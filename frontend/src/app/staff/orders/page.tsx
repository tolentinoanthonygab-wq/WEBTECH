'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Card, CardBody, Chip, User, Tooltip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, useDisclosure
} from '@nextui-org/react';
import { FiRefreshCw, FiCheckCircle, FiX, FiDollarSign, FiLink, FiClock, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  order_ref: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  created_on: string;
  first_name: string;
  last_name: string;
  contact_number: string;
}

const statusColor: Record<string, 'danger' | 'warning' | 'success' | 'default'> = {
  Requested: 'danger',
  Ongoing:   'warning',
  Done:      'success',
  Cancelled: 'default',
};

export default function OrdersListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireRole('staff');
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [actionOrder, setActionOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [gcashRef, setGcashRef] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paying, setPaying]     = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/staff/orders.php');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/staff/orders.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY DELETE this order? This cannot be undone.')) return;
    const res = await fetch(`/api/staff/orders.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchOrders();
    else alert(data.message || 'Delete failed');
  };

  const openPayment = (order: Order) => {
    setActionOrder(order);
    setAmountPaid(order.total_amount.toString());
    setGcashRef('');
    setPaymentMethod('GCash');
    onOpen();
  };

  const handlePayment = async () => {
    if (!actionOrder) return;
    setPaying(true);
    try {
      const res = await fetch('/api/staff/payment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: actionOrder.id,
          amount_paid: parseFloat(amountPaid),
          payment_method: paymentMethod,
          transaction_reference: gcashRef,
        }),
      });
      const data = await res.json();
      if (data.success) { onClose(); fetchOrders(); }
      else alert(data.message || 'Payment failed');
    } catch { alert('Error processing payment'); }
    finally { setPaying(false); }
  };

  if (authLoading) return null;

  const requested = orders.filter(o => o.order_status === 'Requested');
  const ongoing   = orders.filter(o => o.order_status === 'Ongoing');
  const done      = orders.filter(o => o.order_status === 'Done');

  const OrderTable = ({ rows, title, emptyMsg }: { rows: Order[], title: string, emptyMsg: string }) => (
    <Card className="border-none shadow-sm">
      <CardBody className="p-0">
        <div className="px-6 py-4 border-b border-default-100">
          <h3 className="font-bold text-sm uppercase tracking-widest text-default-500">{title}</h3>
        </div>
        <Table aria-label={title} removeWrapper>
          <TableHeader>
            <TableColumn>REFERENCE</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>PAYMENT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={emptyMsg}>
            {rows.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Link href={`/staff/orders/${o.id}`} className="font-bold text-primary hover:underline font-mono">
                    {o.order_ref}
                  </Link>
                </TableCell>
                <TableCell>
                  <User name={`${o.first_name} ${o.last_name}`} description={o.contact_number} />
                </TableCell>
                <TableCell className="font-bold">₱{parseFloat(o.total_amount?.toString() || '0').toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={o.payment_status === 'Paid' ? 'success' : 'warning'}
                    variant="flat"
                    className="font-bold"
                  >
                    {o.payment_status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={statusColor[o.order_status] ?? 'default'} variant="flat" className="font-bold">
                    {o.order_status === 'Requested' ? '⚡ NEW REQUEST' : o.order_status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {o.order_status === 'Requested' && (
                      <Tooltip content="Process Request — weigh and add items first">
                        <Button size="sm" color="primary" variant="flat" startContent={<FiCheckCircle />} 
                          onPress={() => router.push(`/staff/orders/${o.id}`)}>
                          Process
                        </Button>
                      </Tooltip>
                    )}
                    {o.order_status === 'Ongoing' && (
                      <>
                        <Tooltip content="Mark as Done">
                          <Button size="sm" color="success" variant="flat" startContent={<FiCheckCircle />} onPress={() => updateStatus(o.id, 'Done')}>
                            Done
                          </Button>
                        </Tooltip>
                        {o.payment_status !== 'Paid' && (
                          <Tooltip content="Record Payment">
                            <Button size="sm" color="warning" variant="flat" startContent={<FiDollarSign />} onPress={() => openPayment(o)}>
                              Pay
                            </Button>
                          </Tooltip>
                        )}
                      </>
                    )}
                    {o.order_status === 'Done' && o.payment_status !== 'Paid' && (
                      <Tooltip content="Record Payment">
                        <Button size="sm" color="warning" variant="flat" startContent={<FiDollarSign />} onPress={() => openPayment(o)}>
                          Pay
                        </Button>
                      </Tooltip>
                    )}
                    {(o.order_status === 'Requested' || o.order_status === 'Ongoing') && (
                      <Tooltip content="Cancel Order">
                        <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => updateStatus(o.id, 'Cancelled')}>
                          <FiX />
                        </Button>
                      </Tooltip>
                    )}
                    {o.order_status === 'Cancelled' && (
                      <Tooltip content="Permanently Delete">
                        <Button isIconOnly size="sm" color="danger" variant="flat" onPress={() => handleDelete(o.id)}>
                          <FiTrash2 />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip content="View Receipt">
                      <Link href={`/customer/receipt/${o.id}`}>
                        <Button isIconOnly size="sm" variant="light" color="default">
                          <FiLink />
                        </Button>
                      </Link>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Orders List</h1>
          <p className="text-default-500 font-medium">Manage all laundry orders for {user?.shop_name}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/staff/orders/new">
            <Button color="primary" className="font-bold">+ New Order</Button>
          </Link>
          <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchOrders} isLoading={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert for new requests */}
      {requested.length > 0 && (
        <div className="bg-danger-50 border border-danger-200 rounded-2xl px-6 py-4 flex items-center gap-3">
          <FiAlertCircle className="text-danger text-xl flex-shrink-0" />
          <p className="text-danger-700 font-bold text-sm">
            You have <span className="text-danger font-black">{requested.length}</span> new customer request(s) waiting! Accept them to notify customers to bring their clothes.
          </p>
        </div>
      )}

      {/* New Requests */}
      {requested.length > 0 && (
        <OrderTable rows={requested} title="⚡ New Requests" emptyMsg="No new requests." />
      )}

      {/* Ongoing */}
      <OrderTable rows={ongoing} title="🔄 Ongoing Orders" emptyMsg="No ongoing orders." />

      {/* Done */}
      {done.length > 0 && (
        <OrderTable rows={done} title="✅ Completed Today" emptyMsg="No completed orders." />
      )}

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="font-bold text-xl">Record Payment — {actionOrder?.order_ref}</ModalHeader>
          <ModalBody className="gap-4 pb-2">
            <div className="bg-default-50 rounded-2xl p-4 flex justify-between items-center">
              <span className="text-default-500 font-bold">Total Amount</span>
              <span className="text-2xl font-black text-primary">₱{parseFloat(actionOrder?.total_amount?.toString() || '0').toFixed(2)}</span>
            </div>
            <Select
              label="Payment Method"
              variant="bordered"
              selectedKeys={[paymentMethod]}
              onSelectionChange={(k) => setPaymentMethod(Array.from(k)[0] as string)}
            >
              <SelectItem key="GCash" textValue="GCash">GCash</SelectItem>
              <SelectItem key="Manual" textValue="Cash / Manual">Cash / Manual</SelectItem>
            </Select>
            {paymentMethod === 'GCash' && (
              <Input
                label="GCash Reference Number"
                placeholder="e.g. 1234567890"
                variant="bordered"
                value={gcashRef}
                onValueChange={setGcashRef}
              />
            )}
            <Input
              label="Amount Paid"
              type="number"
              variant="bordered"
              value={amountPaid}
              onValueChange={setAmountPaid}
            />
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
