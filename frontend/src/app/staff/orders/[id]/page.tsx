'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireRole } from '@/context/AuthContext';
import {
  Card, CardBody, CardHeader, Divider, Chip, Spinner, Button,
  Select, SelectItem, Input,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@nextui-org/react';
import { FiArrowLeft, FiCheckCircle, FiX, FiDollarSign, FiPrinter, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

const statusColor: Record<string, 'danger' | 'warning' | 'success' | 'default'> = {
  Requested: 'danger', Ongoing: 'warning', Done: 'success', Cancelled: 'default',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router  = useRouter();
  const { user, loading: authLoading } = useRequireRole('staff');
  const [order, setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [gcashRef, setGcashRef]   = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paying, setPaying] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCalcOpen, onOpen: onCalcOpen, onClose: onCalcClose } = useDisclosure();

  const fetchOrder = async () => {
    try {
      const res  = await fetch(`/api/staff/order_details.php?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
        setAmountPaid(data.data.total_amount?.toString() || '');
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    if (user && id) {
      fetchOrder(); 
      fetch('/api/staff/services.php')
        .then(r => r.json())
        .then(res => { if (res.success) setServices(res.data); });
    }
  }, [user, id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch('/api/staff/orders.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await fetchOrder();
    setUpdating(false);
  };

  const handleAddItem = async () => {
    if (!selectedService || !itemQty) return;
    setAddingItem(true);
    try {
      const res = await fetch('/api/staff/order_items.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: id, service_id: selectedService, quantity: parseFloat(itemQty) })
      });
      const data = await res.json();
      if (data.success) {
        onCalcClose();
        setItemQty('');
        setSelectedService('');
        fetchOrder();
      } else alert(data.message);
    } catch { alert('Failed to add item'); }
    finally { setAddingItem(null); }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remove this item?')) return;
    try {
      const res = await fetch(`/api/staff/order_items.php?order_id=${id}&item_id=${itemId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchOrder();
      else alert(data.message);
    } catch { alert('Failed to remove item'); }
  };

  const handlePayment = async (override?: { amount: number, method: string }) => {
    setPaying(true);
    try {
      const res  = await fetch('/api/staff/payment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: id,
          amount_paid: override ? override.amount : parseFloat(amountPaid),
          payment_method: override ? override.method : paymentMethod,
          transaction_reference: gcashRef,
        }),
      });
      const data = await res.json();
      if (data.success) { onClose(); fetchOrder(); }
      else alert(data.message || 'Payment failed');
    } catch { alert('Error processing payment'); }
    finally { setPaying(false); }
  };

  if (authLoading || loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;
  if (!order) return <div className="p-20 text-center text-default-500">Order not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="light" isIconOnly onPress={() => router.back()}><FiArrowLeft /></Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Order Details</h1>
            <p className="text-default-500 font-mono text-sm">{order.order_ref}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Chip color={statusColor[order.order_status] ?? 'default'} variant="flat" size="lg" className="font-bold">
            {order.order_status}
          </Chip>
          <Chip color={order.payment_status === 'Paid' ? 'success' : 'warning'} variant="flat" size="lg" className="font-bold">
            {order.payment_status}
          </Chip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-6 py-4 font-bold">Customer Info</CardHeader>
            <Divider />
            <CardBody className="p-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-default-400 font-bold uppercase text-xs">Name</p>
                <p className="font-bold">{order.first_name} {order.last_name}</p>
              </div>
              <div>
                <p className="text-default-400 font-bold uppercase text-xs">Contact</p>
                <p className="font-bold">{order.contact_number || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-default-400 font-bold uppercase text-xs">Address</p>
                <p className="font-bold">{order.address || '—'}</p>
              </div>
              <div>
                <p className="text-default-400 font-bold uppercase text-xs">Date</p>
                <p className="font-bold">{new Date(order.created_on).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-default-400 font-bold uppercase text-xs">Type</p>
                <p className="font-bold">{order.pickup_delivery_type || 'Pickup'}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="border-none shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
                <h3 className="font-bold">Order Items / Calculator</h3>
                {order.order_status !== 'Done' && order.order_status !== 'Cancelled' && (
                    <Button size="sm" color="primary" variant="flat" startContent={<FiPlus />} onPress={onCalcOpen}>
                        Add Item
                    </Button>
                )}
            </div>
            <Divider />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-default-50">
                    <th className="text-left px-6 py-3 font-bold text-default-400 uppercase text-xs">Service</th>
                    <th className="text-left px-6 py-3 font-bold text-default-400 uppercase text-xs">Qty / Weight</th>
                    <th className="text-right px-6 py-3 font-bold text-default-400 uppercase text-xs">Subtotal</th>
                    <th className="px-6 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.length > 0 ? order.items.map((item: any, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="px-6 py-4 font-medium">{item.service_name}</td>
                      <td className="px-6 py-4 text-default-500">
                        {item.quantity_or_weight} {item.unit === 'per_kg' ? 'kg' : 'pcs'}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-success">
                        ₱{parseFloat(item.subtotal).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.order_status !== 'Done' && order.order_status !== 'Cancelled' && (
                            <button className="text-danger hover:text-danger-600 transition-colors" onClick={() => handleRemoveItem(item.id)}>
                                <FiX />
                            </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-default-400 italic">
                      No items — weight/pricing to be set by staff
                    </td></tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-between items-center px-6 py-5 border-t">
                <span className="font-bold text-default-500">TOTAL</span>
                <span className="text-2xl font-black text-primary">₱{parseFloat(order.total_amount || '0').toFixed(2)}</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right — Actions */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-6 py-4 font-bold">Actions</CardHeader>
            <Divider />
            <CardBody className="p-6 space-y-3">
              {order.order_status === 'Requested' && (
                <Button color="primary" fullWidth className="font-bold" startContent={<FiCheckCircle />}
                  isLoading={updating} onPress={() => updateStatus('Ongoing')}>
                  Accept Request
                </Button>
              )}
              {order.order_status === 'Ongoing' && (
                <Button color="success" fullWidth className="font-bold text-white" startContent={<FiCheckCircle />}
                  isLoading={updating} onPress={() => updateStatus('Done')}>
                  Mark as Done
                </Button>
              )}
              {(order.order_status === 'Requested' || order.order_status === 'Ongoing') && (
                <Button color="danger" variant="flat" fullWidth className="font-bold" startContent={<FiX />}
                  isLoading={updating} onPress={() => updateStatus('Cancelled')}>
                  Cancel Order
                </Button>
              )}
              {order.payment_status !== 'Paid' && order.order_status !== 'Cancelled' && (
                <div className="space-y-2 pt-2 border-t border-default-100">
                    <p className="text-[10px] font-black text-default-400 uppercase tracking-tighter">Payment Actions</p>
                    <Button color="warning" fullWidth className="font-bold" startContent={<FiDollarSign />}
                    onPress={onOpen}>
                    Record Payment (Mongo Pay / Cash)
                    </Button>
                    <Button color="success" variant="flat" fullWidth className="font-bold"
                        isLoading={paying}
                        onPress={() => {
                            handlePayment({ 
                                amount: parseFloat(order.total_amount || '0'), 
                                method: 'Manual' 
                            });
                        }}>
                        Quick Mark as Paid (Cash)
                    </Button>
                </div>
              )}
              <Link href={`/customer/receipt/${id}`} target="_blank">
                <Button variant="bordered" fullWidth className="font-bold" startContent={<FiPrinter />}>
                  View / Print Receipt
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Shop GCash details for reference */}
          <Card className="border-none shadow-sm bg-blue-50/50 border-1 border-blue-100">
            <CardBody className="p-5 space-y-1 text-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="font-black text-blue-800 text-xs uppercase tracking-widest">Mongo Pay (GCash)</p>
                <Chip size="xs" color="primary" variant="flat" className="text-[9px] h-4">Official Gateway</Chip>
              </div>
              <p className="font-bold text-blue-900">{order.gcash_name || 'Not configured'}</p>
              <p className="text-blue-700 font-mono">{order.gcash_number || '—'}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Calculator Modal */}
      <Modal isOpen={isCalcOpen} onClose={onCalcClose} size="sm">
        <ModalContent>
          <ModalHeader className="font-bold text-xl">Calculator — Add Item</ModalHeader>
          <ModalBody className="gap-4 pb-6">
            <Select label="Select Service" variant="bordered"
              selectedKeys={selectedService ? [selectedService] : []}
              onSelectionChange={(k) => setSelectedService(Array.from(k)[0] as string)}>
              {services.map(s => (
                  <SelectItem key={s.id} textValue={s.service_name} 
                    description={`₱${s.price_per_unit} / ${s.unit === 'per_kg' ? 'kg' : 'pc'}`}>
                      {s.service_name}
                  </SelectItem>
              ))}
            </Select>
            <Input label="Quantity / Weight" type="number" variant="bordered"
              description={selectedService ? `Unit: ${services.find(s => s.id === selectedService)?.unit === 'per_kg' ? 'Kilograms' : 'Pieces'}` : ''}
              value={itemQty} onValueChange={setItemQty} />
            
            {selectedService && itemQty && (
                <div className="bg-primary/5 rounded-2xl p-4 flex justify-between items-center border border-primary/10">
                    <span className="text-sm font-bold text-primary opacity-60">ESTIMATED SUBTOTAL</span>
                    <span className="text-2xl font-black text-primary">
                        ₱{(parseFloat(services.find(s => s.id === selectedService)?.price_per_unit || 0) * parseFloat(itemQty || 0)).toFixed(2)}
                    </span>
                </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCalcClose}>Cancel</Button>
            <Button color="primary" className="font-bold px-8" isLoading={addingItem} onPress={handleAddItem}>
                ADD TO ORDER
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="font-bold">Record Payment — {order.order_ref}</ModalHeader>
          <ModalBody className="gap-4 pb-2">
            <div className="bg-default-50 rounded-2xl p-4 flex justify-between">
              <span className="text-default-500 font-bold">Total</span>
              <span className="text-xl font-black text-primary">₱{parseFloat(order.total_amount || '0').toFixed(2)}</span>
            </div>
            <Select label="Payment Method" variant="bordered"
              selectedKeys={[paymentMethod]}
              onSelectionChange={(k) => setPaymentMethod(Array.from(k)[0] as string)}>
              <SelectItem key="GCash" textValue="GCash">GCash</SelectItem>
              <SelectItem key="Manual" textValue="Cash / Manual">Cash / Manual</SelectItem>
            </Select>
            {paymentMethod === 'GCash' && (
              <Input label="GCash Reference Number" placeholder="e.g. 1234567890" variant="bordered"
                value={gcashRef} onValueChange={setGcashRef} />
            )}
            <Input label="Amount Paid" type="number" variant="bordered"
              value={amountPaid} onValueChange={setAmountPaid} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cancel</Button>
            <Button color="success" className="font-bold" isLoading={paying} onPress={handlePayment}>
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
