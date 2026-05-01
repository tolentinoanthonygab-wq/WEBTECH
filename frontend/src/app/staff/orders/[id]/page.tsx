'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireRole } from '@/context/AuthContext';
import { Spinner, Select, SelectItem, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { FiArrowLeft, FiCheckCircle, FiX, FiDollarSign, FiPrinter, FiPlus, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

const statusStyle: Record<string, string> = {
  Requested: 'bg-red-50 text-red-600',
  Ongoing:   'bg-amber-50 text-amber-600',
  Done:      'bg-emerald-50 text-emerald-600',
  Cancelled: 'bg-slate-100 text-slate-500',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireRole('staff');
  const [order, setOrder]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [gcashRef, setGcashRef]   = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paying, setPaying]   = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCalcOpen, onOpen: onCalcOpen, onClose: onCalcClose } = useDisclosure();

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/staff/order_details.php?id=${id}`);
      const data = await res.json();
      if (data.success) { setOrder(data.data); setAmountPaid(data.data.total_amount?.toString() || ''); }
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user && id) {
      fetchOrder();
      fetch('/api/staff/services.php').then(r => r.json()).then(res => { if (res.success) setServices(res.data); });
    }
  }, [user, id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch('/api/staff/orders.php', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    await fetchOrder();
    setUpdating(false);
  };

  const handleDeleteOrder = async () => {
    if (!confirm('Permanently delete this order? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/staff/orders.php?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) router.push('/staff/orders');
      else alert(data.message || 'Delete failed');
    } catch { alert('Network error'); }
  };

  const handleAddItem = async () => {
    if (!selectedService || !itemQty) return;
    setAddingItem(true);
    try {
      const res = await fetch('/api/staff/order_items.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: id, service_id: selectedService, quantity: parseFloat(itemQty) })
      });
      const data = await res.json();
      if (data.success) { onCalcClose(); setItemQty(''); setSelectedService(''); fetchOrder(); }
      else alert(data.message);
    } catch { alert('Failed to add item'); }
    finally { setAddingItem(false); }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remove this item?')) return;
    try {
      const res = await fetch(`/api/staff/order_items.php?order_id=${id}&item_id=${itemId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchOrder(); else alert(data.message);
    } catch { alert('Failed to remove item'); }
  };

  const handlePayment = async (override?: { amount: number; method: string }) => {
    setPaying(true);
    try {
      const res = await fetch('/api/staff/payment.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: id,
          amount_paid: override ? override.amount : parseFloat(amountPaid),
          payment_method: override ? override.method : paymentMethod,
          transaction_reference: gcashRef,
        }),
      });
      const data = await res.json();
      if (data.success) { onClose(); fetchOrder(); } else alert(data.message || 'Payment failed');
    } catch { alert('Error processing payment'); }
    finally { setPaying(false); }
  };

  if (authLoading || loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;
  if (!order) return <div className="p-20 text-center text-slate-400">Order not found.</div>;

  const canEdit = order.order_status !== 'Done' && order.order_status !== 'Cancelled';

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
            <p className="text-slate-400 text-xs font-mono">{order.order_ref}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle[order.order_status] ?? 'bg-slate-100 text-slate-500'}`}>
            {order.order_status}
          </span>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${order.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {order.payment_status}
          </span>
        </div>
      </div>

      {/* Empty alert */}
      {canEdit && (!order.items || order.items.length === 0) && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl"><FiPlus className="text-blue-600" size={16} /></div>
            <div>
              <p className="font-bold text-blue-900 text-sm">No items added yet</p>
              <p className="text-xs text-blue-600">Add laundry weight and services to calculate the total.</p>
            </div>
          </div>
          <button onClick={onCalcOpen} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all">
            <FiPlus size={12} /> Add Items
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800 text-sm">Customer Info</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Name',     value: `${order.first_name} ${order.last_name}` },
                { label: 'Contact',  value: order.contact_number || '—' },
                { label: 'Date',     value: new Date(order.created_on).toLocaleString() },
                { label: 'Type',     value: order.pickup_delivery_type || 'Pickup' },
                { label: 'Payment',  value: order.payment_method || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                <p className="font-semibold text-slate-800 mt-0.5">{order.address || '—'}</p>
              </div>
              {order.notes && (
                <div className="col-span-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Customer Notes</p>
                  <p className="text-sm font-medium text-amber-900">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800 text-sm">Order Items</p>
              {canEdit && (
                <button onClick={onCalcOpen} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <FiPlus size={12} /> Add Item
                </button>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Service</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Qty/Wt</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Subtotal</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items?.length > 0 ? order.items.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.service_name}</td>
                    <td className="px-6 py-4 text-slate-500">{item.quantity_or_weight} {item.unit === 'per_kg' ? 'kg' : 'pcs'}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">₱{parseFloat(item.subtotal).toFixed(2)}</td>
                    <td className="px-4 py-4 text-center">
                      {canEdit && (
                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <FiX size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm italic">No items added yet</td></tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black text-slate-900">₱{parseFloat(order.total_amount || '0').toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800 text-sm">Actions</p>
            </div>
            <div className="p-4 space-y-2">
              {order.order_status === 'Requested' && (
                order.items?.length > 0 ? (
                  <button onClick={() => updateStatus('Ongoing')} disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
                    <FiCheckCircle size={14} /> Confirm & Accept
                  </button>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center space-y-2">
                    <p className="text-xs font-semibold text-slate-400">Add items before accepting</p>
                    <button onClick={onCalcOpen} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all">
                      Add Items Now
                    </button>
                  </div>
                )
              )}
              {order.order_status === 'Ongoing' && (
                <button onClick={() => updateStatus('Done')} disabled={updating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
                  <FiCheckCircle size={14} /> Mark as Done
                </button>
              )}
              {canEdit && (
                <button onClick={() => updateStatus('Cancelled')} disabled={updating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-all">
                  <FiX size={14} /> Cancel Order
                </button>
              )}
              {order.order_status === 'Cancelled' && (
                <button onClick={handleDeleteOrder}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all">
                  <FiTrash2 size={14} /> Permanently Delete
                </button>
              )}
              {order.payment_status !== 'Paid' && !['Cancelled'].includes(order.order_status) && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Payment</p>
                  <button onClick={onOpen}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold rounded-xl transition-all">
                    <FiDollarSign size={14} /> Record Payment
                  </button>
                  <button onClick={() => handlePayment({ amount: parseFloat(order.total_amount || '0'), method: 'Manual' })} disabled={paying}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-xl transition-all">
                    Quick Mark as Paid (Cash)
                  </button>
                </div>
              )}
              <Link href={`/customer/receipt/${id}`} target="_blank">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all mt-2">
                  <FiPrinter size={14} /> View / Print Receipt
                </button>
              </Link>
            </div>
          </div>

          {/* GCash Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-1">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">GCash Details</p>
              <span className="text-[9px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Official</span>
            </div>
            <p className="font-bold text-blue-900 text-sm">{order.gcash_name || 'Not configured'}</p>
            <p className="text-blue-700 font-mono text-sm">{order.gcash_number || '—'}</p>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={isCalcOpen} onClose={onCalcClose} size="sm">
        <ModalContent>
          <ModalHeader className="font-bold text-base">Add Item</ModalHeader>
          <ModalBody className="gap-4 pb-4">
            <div className="flex items-end gap-2">
              <Select label="Select Service" variant="bordered" size="sm"
                placeholder={services.length === 0 ? 'No services found' : 'Choose a service'}
                selectedKeys={selectedService ? [selectedService] : []}
                onSelectionChange={(k) => setSelectedService(Array.from(k)[0] as string)}>
                {services.map(s => (
                  <SelectItem key={s.id} textValue={s.service_name} description={`₱${s.price_per_unit} / ${s.unit === 'per_kg' ? 'kg' : 'pc'}`}>
                    {s.service_name}
                  </SelectItem>
                ))}
              </Select>
              <button onClick={() => fetch('/api/staff/services.php').then(r => r.json()).then(res => { if (res.success) setServices(res.data); })}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all">
                <FiRefreshCw size={14} />
              </button>
            </div>
            {services.length === 0 && (
              <p className="text-xs text-red-600 font-semibold text-center bg-red-50 p-2 rounded-xl border border-red-100">
                No services configured for this shop!
              </p>
            )}
            <Input label="Quantity / Weight" type="number" variant="bordered" size="sm"
              description={selectedService ? `Unit: ${services.find(s => s.id === selectedService)?.unit === 'per_kg' ? 'Kilograms' : 'Pieces'}` : ''}
              value={itemQty} onValueChange={setItemQty} />
            {selectedService && itemQty && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-600">Subtotal</span>
                <span className="font-bold text-emerald-700">
                  ₱{(parseFloat(services.find(s => s.id === selectedService)?.price_per_unit || 0) * parseFloat(itemQty || '0')).toFixed(2)}
                </span>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <button onClick={onCalcClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button onClick={handleAddItem} disabled={addingItem}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
              {addingItem ? 'Adding...' : 'Add to Order'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="font-bold text-base">Record Payment — {order.order_ref}</ModalHeader>
          <ModalBody className="gap-4 pb-2">
            <div className="bg-slate-50 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-500">Total</span>
              <span className="text-xl font-black text-slate-900">₱{parseFloat(order.total_amount || '0').toFixed(2)}</span>
            </div>
            <Select label="Payment Method" variant="bordered" size="sm"
              selectedKeys={[paymentMethod]}
              onSelectionChange={(k) => setPaymentMethod(Array.from(k)[0] as string)}>
              <SelectItem key="GCash" textValue="GCash">GCash</SelectItem>
              <SelectItem key="Manual" textValue="Cash / Manual">Cash / Manual</SelectItem>
            </Select>
            {paymentMethod === 'GCash' && (
              <Input label="GCash Reference Number" placeholder="e.g. 1234567890" variant="bordered" size="sm"
                value={gcashRef} onValueChange={setGcashRef} />
            )}
            <Input label="Amount Paid" type="number" variant="bordered" size="sm"
              value={amountPaid} onValueChange={setAmountPaid} />
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button onClick={() => handlePayment()} disabled={paying}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
              {paying ? 'Processing...' : 'Confirm Payment'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
