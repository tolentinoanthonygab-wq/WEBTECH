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
    { label: 'Daily Collection', value: `₱${data?.daily_total?.toLocaleString() || '0'}`, icon: FiDollarSign, color: 'emerald' },
    { label: 'Ongoing Orders',   value: data?.active_orders || 0,                          icon: FiClock,      color: 'blue' },
    { label: 'Pending Approvals',value: data?.pending_approvals || 0,                      icon: FiUsers,      color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue:    'bg-blue-50 text-blue-600 border-blue-100',
    amber:   'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {user.first_name}! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">{user.shop_name} — Staff Dashboard</p>
        </div>
        <Link href="/staff/orders/new">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 transition-all">
            <FiPlus /> New Order
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
            <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Ongoing Orders</h3>
          <Link href="/staff/orders" className="flex items-center gap-1 text-sm text-emerald-600 font-semibold hover:underline">
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : !data?.recent_orders?.length ? (
          <p className="text-center text-slate-400 py-12 text-sm">No ongoing orders at the moment.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.recent_orders.map((order, i) => (
              <Link key={i} href={`/staff/orders/${order.id}`}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {order.first_name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{order.order_ref}</p>
                      <p className="text-xs text-slate-400">{order.first_name} {order.last_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.order_status === 'Requested'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-600'
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
