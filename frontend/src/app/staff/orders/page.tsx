'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { FiRefreshCw, FiCheckCircle, FiX, FiDollarSign, FiLink, FiAlertCircle, FiTrash2, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string; order_ref: string; order_status: string;
  payment_status: string; total_amount: number;
  created_on: string; first_name: string; last_name: string; contact_number: string;
}

const CARD = {
  background: 'rgba(10,20,50,0.72)', backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '1.25rem',
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  Requested: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
  Ongoing:   { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  Done:      { bg: 'rgba(16,185,129,0.15)',  color: '#34d399' },
  Cancelled: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
};

export default function OrdersListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireRole('staff');
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionOrder, setActionOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [gcashRef, setGcashRef] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paying, setPaying]   = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff/orders.php');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/staff/orders.php', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this order?')) return;
    const res = await fetch(`/api/staff/orders.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchOrders(); else alert(data.message || 'Delete failed');
  };

  const openPayment = (order: Order) => {
    setActionOrder(order); setAmountPaid(order.total_amount.toString()); setGcashRef(''); setPaymentMethod('GCash'); onOpen();
  };

  const handlePayment = async () => {
    if (!actionOrder) return;
    setPaying(true);
    try {
      const res = await fetch('/api/staff/payment.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: actionOrder.id, amount_paid: parseFloat(amountPaid), payment_method: paymentMethod, transaction_reference: gcashRef }),
      });
      const data = await res.json();
      if (data.success) { onClose(); fetchOrders(); } else alert(data.message || 'Payment failed');
    } catch { alert('Error processing payment'); } finally { setPaying(false); }
  };

  if (authLoading) return null;

  const requested = orders.filter(o => o.order_status === 'Requested');
  const ongoing   = orders.filter(o => o.order_status === 'Ongoing');
  const done      = orders.filter(o => o.order_status === 'Done');

  const OrderCard = ({ o }: { o: Order }) => {
    const st = statusStyle[o.order_status] ?? statusStyle.Cancelled;
    return (
      <div className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <Link href={`/staff/orders/${o.id}`}>
              <span className="font-black text-cyan-400 hover:text-cyan-300 font-mono text-sm">{o.order_ref}</span>
            </Link>
            <p className="text-white font-semibold text-sm mt-0.5">{o.first_name} {o.last_name}</p>
            <p className="text-white/40 text-xs">{o.contact_number}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-white text-base">₱{parseFloat(o.total_amount?.toString() || '0').toFixed(2)}</p>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
              {o.order_status === 'Requested' ? '⚡ NEW' : o.order_status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {o.order_status === 'Requested' && (
            <button onClick={() => router.push(`/staff/orders/${o.id}`)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
              style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1)' }}>
              <FiCheckCircle size={11} /> Process
            </button>
          )}
          {o.order_status === 'Ongoing' && (
            <button onClick={() => updateStatus(o.id, 'Done')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: 'rgba(16,185,129,0.25)', color: '#34d399' }}>
              <FiCheckCircle size={11} /> Done
            </button>
          )}
          {(o.order_status === 'Ongoing' || o.order_status === 'Done') && o.payment_status !== 'Paid' && (
            <button onClick={() => openPayment(o)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>
              <FiDollarSign size={11} /> Pay
            </button>
          )}
          {(o.order_status === 'Requested' || o.order_status === 'Ongoing') && (
            <button onClick={() => updateStatus(o.id, 'Cancelled')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
              <FiX size={11} /> Cancel
            </button>
          )}
          {o.order_status === 'Cancelled' && (
            <button onClick={() => handleDelete(o.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
              <FiTrash2 size={11} /> Delete
            </button>
          )}
          <Link href={`/customer/receipt/${o.id}`}>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <FiLink size={11} /> Receipt
            </button>
          </Link>
        </div>
      </div>
    );
  };

  const Section = ({ rows, title, emptyMsg }: { rows: Order[]; title: string; emptyMsg: string }) => (
    <div style={CARD} className="overflow-hidden">
      <div className="px-5 py-4 border-b border-white/8">
        <h3 className="font-black text-white/60 text-xs uppercase tracking-widest">{title}</h3>
      </div>
      {rows.length === 0
        ? <p className="text-center text-white/25 py-8 text-sm">{emptyMsg}</p>
        : rows.map(o => <OrderCard key={o.id} o={o} />)
      }
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Orders List</h1>
          <p className="text-white/40 text-sm mt-0.5">{user?.shop_name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/staff/orders/new">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              <FiPlus size={14} /> New Order
            </button>
          </Link>
          <button onClick={fetchOrders}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Alert */}
      {requested.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-4 border border-red-500/20" style={{ background: 'rgba(239,68,68,0.10)' }}>
          <FiAlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p className="text-red-300 font-bold text-sm">
            <span className="text-red-400">{requested.length}</span> new customer request(s) waiting!
          </p>
        </div>
      )}

      {requested.length > 0 && <Section rows={requested} title="⚡ New Requests" emptyMsg="No new requests." />}
      <Section rows={ongoing} title="🔄 Ongoing Orders" emptyMsg="No ongoing orders." />
      {done.length > 0 && <Section rows={done} title="✅ Completed Today" emptyMsg="" />}

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm"
        classNames={{ base: 'border border-white/10', header: 'text-white', body: 'text-white', footer: 'border-t border-white/10' }}
        style={{ background: 'rgba(10,20,50,0.95)', backdropFilter: 'blur(20px)' }}>
        <ModalContent>
          <ModalHeader className="font-black text-lg">Record Payment — {actionOrder?.order_ref}</ModalHeader>
          <ModalBody className="gap-4 pb-2">
            <div className="rounded-xl px-4 py-3 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <span className="text-white/50 font-bold text-sm">Total Amount</span>
              <span className="text-2xl font-black text-cyan-400">₱{parseFloat(actionOrder?.total_amount?.toString() || '0').toFixed(2)}</span>
            </div>
            <Select label="Payment Method" variant="bordered" selectedKeys={[paymentMethod]}
              onSelectionChange={(k) => setPaymentMethod(Array.from(k)[0] as string)}
              classNames={{ label: 'text-white/50', value: 'text-white', trigger: 'border-white/20' }}>
              <SelectItem key="GCash" textValue="GCash">GCash</SelectItem>
              <SelectItem key="Manual" textValue="Cash / Manual">Cash / Manual</SelectItem>
            </Select>
            {paymentMethod === 'GCash' && (
              <Input label="GCash Reference" placeholder="e.g. 1234567890" variant="bordered" value={gcashRef} onValueChange={setGcashRef}
                classNames={{ label: 'text-white/50', input: 'text-white', inputWrapper: 'border-white/20' }} />
            )}
            <Input label="Amount Paid" type="number" variant="bordered" value={amountPaid} onValueChange={setAmountPaid}
              classNames={{ label: 'text-white/50', input: 'text-white', inputWrapper: 'border-white/20' }} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} className="text-white/50">Cancel</Button>
            <Button isLoading={paying} onPress={handlePayment} className="font-black text-white"
              style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)' }}>
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
