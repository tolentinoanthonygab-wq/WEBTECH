'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Spinner } from '@nextui-org/react';
import { FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

const CARD = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1.25rem',
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  Done:      { bg: 'rgba(16,185,129,0.15)',  color: '#34d399' },
  Ongoing:   { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  Requested: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' },
  Cancelled: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
};

const payStyle: Record<string, { bg: string; color: string }> = {
  Paid:    { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  Unpaid:  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  Pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
};

export default function CustomerOrdersPage() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/customer/dashboard.php')
        .then(res => res.json())
        .then(res => { if (res.success) setOrders(res.data.orders); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Order History</h1>
        <p className="text-white/40 text-sm mt-0.5">All your laundry transactions at {user?.shop_name}</p>
      </div>

      {/* Orders */}
      <div style={CARD} className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner color="white" /></div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-white/20">
            <FiShoppingBag size={36} />
            <p className="text-sm font-medium">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map((o) => {
              const st  = statusStyle[o.order_status]  ?? statusStyle.Cancelled;
              const pay = payStyle[o.payment_status]   ?? payStyle.Pending;
              return (
                <div key={o.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-cyan-400 font-mono text-sm">{o.order_ref}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: st.bg, color: st.color }}>
                        {o.order_status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs mt-0.5 flex items-center gap-2">
                      <span>{new Date(o.created_on).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span className="text-white/25">·</span>
                      <span>{new Date(o.created_on).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                      {o.order_status === 'Done' && o.last_updated && (
                        <>
                          <span className="text-white/25">·</span>
                          <span className="text-emerald-400/70">Done {new Date(o.last_updated).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-white text-sm">₱{parseFloat(o.total_amount).toFixed(2)}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: pay.bg, color: pay.color }}>
                        {o.payment_status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {o.order_status === 'Done' ? (
                      <Link href={`/customer/receipt/${o.id}`}>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1)' }}>
                          <FiExternalLink size={11} /> Receipt
                        </button>
                      </Link>
                    ) : (
                      <span className="text-white/20 text-xs">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
