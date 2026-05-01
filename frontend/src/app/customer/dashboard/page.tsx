'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Spinner } from '@nextui-org/react';
import { FiPackage, FiMapPin, FiPhone, FiShoppingBag, FiArrowRight, FiPlus, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';

const CARD = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1.25rem',
};

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchData = () => {
    fetch('/api/customer/dashboard.php')
      .then(res => res.json())
      .then(res => { if (res.success) setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    try {
      const res = await fetch('/api/customer/cancel_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.message || 'Failed to cancel order.');
    } catch { alert('Connection error.'); }
    finally { setCancelling(null); }
  };

  if (authLoading || !user) return null;

  const requestedOrders = data?.orders?.filter((o: any) => o.order_status === 'Requested') || [];
  const ongoingOrders   = data?.orders?.filter((o: any) => o.order_status === 'Ongoing') || [];
  const activeOrders    = data?.orders?.filter((o: any) => ['Requested', 'Ongoing'].includes(o.order_status)) || [];
  const pastOrders      = data?.orders?.filter((o: any) => !['Requested', 'Ongoing'].includes(o.order_status)).slice(0, 3) || [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Hello, {user.first_name}! 👋</h1>
          <p className="text-white/40 text-sm mt-0.5">Tracking your laundry at {user.shop_name}</p>
        </div>
        <Link href="/customer/request">
          <button className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            <FiPlus size={14} /> Request Laundry
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Orders */}
        <div className="lg:col-span-2 space-y-5">

          {/* Status Banner */}
          {ongoingOrders.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl px-5 py-4 border border-emerald-500/20" style={{ background: 'rgba(16,185,129,0.10)' }}>
              <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold text-emerald-300 text-sm">Your laundry has been accepted!</p>
                <p className="text-emerald-400/70 text-xs mt-0.5">Bring your clothes to <strong>{user.shop_name}</strong> and show your order reference.</p>
              </div>
            </div>
          )}
          {requestedOrders.length > 0 && ongoingOrders.length === 0 && (
            <div className="flex items-start gap-3 rounded-2xl px-5 py-4 border border-amber-500/20" style={{ background: 'rgba(245,158,11,0.10)' }}>
              <FiClock className="text-amber-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold text-amber-300 text-sm">Request pending approval</p>
                <p className="text-amber-400/70 text-xs mt-0.5">Waiting for staff at <strong>{user.shop_name}</strong> to accept your request.</p>
              </div>
            </div>
          )}

          {/* Active Orders */}
          <div style={CARD} className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
              <FiPackage size={14} className="text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Ongoing Laundry</h3>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><Spinner color="white" /></div>
            ) : activeOrders.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-white/20">
                <FiShoppingBag size={32} />
                <p className="text-sm font-medium">No active orders</p>
                <p className="text-xs">Your fresh laundry is just one request away!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {activeOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl text-xs font-black text-white"
                        style={{ background: order.order_status === 'Ongoing' ? 'rgba(0,174,239,0.2)' : 'rgba(245,158,11,0.2)', color: order.order_status === 'Ongoing' ? '#00aeef' : '#f59e0b' }}>
                        {order.order_ref}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          {order.order_status === 'Ongoing' ? 'Ongoing Order' : 'Awaiting Acceptance'}
                        </p>
                        <p className="font-black text-white">₱{parseFloat(order.total_amount || '0').toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-3 py-1.5 rounded-full"
                        style={{ background: order.order_status === 'Ongoing' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)', color: order.order_status === 'Ongoing' ? '#f59e0b' : 'rgba(255,255,255,0.4)' }}>
                        {order.order_status === 'Ongoing' ? 'IN PROGRESS' : 'PENDING'}
                      </span>
                      {order.order_status === 'Requested' && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:scale-105 disabled:opacity-50"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                        >
                          <FiXCircle size={11} />
                          {cancelling === order.id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent History */}
          <div style={CARD} className="overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/8">
              <h3 className="font-bold text-white text-sm">Recent History</h3>
              <Link href="/customer/orders" className="flex items-center gap-1 text-xs text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                View All <FiArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {pastOrders.length === 0 ? (
                <p className="text-center text-white/30 py-8 text-sm">No past orders yet.</p>
              ) : pastOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{order.order_ref}</p>
                    <p className="text-xs text-white/30 shrink-0">{new Date(order.created_on).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-black px-3 py-1 rounded-full"
                      style={{ background: order.order_status === 'Done' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: order.order_status === 'Done' ? '#10b981' : '#f87171' }}>
                      {order.order_status}
                    </span>
                    {order.order_status === 'Done' && (
                      <Link href={`/customer/receipt/${order.id}`}>
                        <button className="text-xs text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Receipt</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Shop Info */}
        <div>
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'linear-gradient(135deg,rgba(0,174,239,0.25),rgba(142,102,255,0.25))', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
            <h3 className="font-black text-white text-base">My Shop</h3>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}><FiMapPin size={14} className="text-white" /></div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location</p>
                <p className="font-bold text-white text-sm mt-0.5">{user.shop_name}</p>
                <p className="text-xs text-white/50 mt-0.5">{data?.shop?.address || 'Main Branch'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}><FiPhone size={14} className="text-white" /></div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Contact</p>
                <p className="font-bold text-white text-sm mt-0.5">{data?.shop?.contact_number || 'N/A'}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-white/30 italic">"We take care of your clothes like our own."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
