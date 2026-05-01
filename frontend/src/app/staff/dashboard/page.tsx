'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Spinner } from '@nextui-org/react';
import { FiPlus, FiClock, FiDollarSign, FiUsers, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

interface StaffStats {
  daily_total: number;
  active_orders: number;
  pending_approvals: number;
  recent_orders: any[];
}

const CARD = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1.25rem',
};

export default function StaffDashboard() {
  const { user, loading: authLoading } = useRequireRole('staff');
  const [data, setData] = useState<StaffStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/staff/stats.php')
        .then(res => res.json())
        .then(res => { if (res.success) setData(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const stats = [
    { label: 'Daily Collection',  value: `₱${data?.daily_total?.toLocaleString() || '0'}`, icon: FiDollarSign, accent: '#10b981' },
    { label: 'Ongoing Orders',    value: data?.active_orders || 0,                          icon: FiClock,      accent: '#00aeef' },
    { label: 'Pending Approvals', value: data?.pending_approvals || 0,                      icon: FiUsers,      accent: '#f59e0b' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Hello, {user.first_name}! 👋</h1>
          <p className="text-white/40 text-sm mt-0.5">{user.shop_name} — Staff Dashboard</p>
        </div>
        <Link href="/staff/orders/new">
          <button className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            <FiPlus /> New Order
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="p-5 flex items-center gap-4" style={CARD}>
            <div className="p-3 rounded-xl shrink-0" style={{ background: `${accent}22`, color: accent }}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={CARD} className="overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/8">
          <h3 className="font-bold text-white text-sm">Recent Ongoing Orders</h3>
          <Link href="/staff/orders" className="flex items-center gap-1 text-xs text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
            View All <FiArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner color="white" /></div>
        ) : !data?.recent_orders?.length ? (
          <p className="text-center text-white/30 py-12 text-sm">No ongoing orders at the moment.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {data.recent_orders.map((order, i) => (
              <Link key={i} href={`/staff/orders/${order.id}`}>
                <div className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white"
                      style={{ background: 'linear-gradient(135deg,#00aeef,#8e66ff)' }}>
                      {order.first_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{order.order_ref}</p>
                      <p className="text-xs text-white/40">{order.first_name} {order.last_name}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                    order.order_status === 'Requested'
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {order.order_status === 'Requested' ? 'NEW REQUEST' : 'IN PROGRESS'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
