'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Skeleton } from '@nextui-org/react';
import { FiTrendingUp, FiUsers, FiSettings, FiPackage, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

interface OwnerStats {
  monthly: any[];
  yearly: any[];
  stats: { total_staff: number; total_services: number; total_customers?: number; pending_customers?: number; };
}

export default function OwnerDashboard() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [data, setData] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/owner/stats.php')
        .then(res => res.json())
        .then(res => { if (res.success) setData(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const statCards = [
    { label: 'Monthly Income',   value: `₱${parseFloat(data?.monthly?.[0]?.total || 0).toLocaleString()}`, icon: FiTrendingUp, color: 'violet' },
    { label: 'Total Staff',      value: data?.stats?.total_staff || 0,                                      icon: FiUsers,      color: 'blue' },
    { label: 'Total Customers',  value: data?.stats?.total_customers || 0,                                  icon: FiUsers,      color: 'emerald', sub: `${data?.stats?.pending_customers || 0} pending` },
    { label: 'Active Services',  value: data?.stats?.total_services || 0,                                   icon: FiPackage,    color: 'amber' },
    { label: 'Yearly Total',     value: `₱${parseFloat(data?.yearly?.[0]?.total || 0).toLocaleString()}`,  icon: FiBarChart2,  color: 'rose' },
  ];

  const colorMap: Record<string, string> = {
    violet:  'bg-violet-50 text-violet-600 border-violet-100',
    blue:    'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber:   'bg-amber-50 text-amber-600 border-amber-100',
    rose:    'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {user.first_name}! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Business Dashboard — {user.shop_name}</p>
        </div>
        <Link href="/owner/settings">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-violet-300 text-slate-700 text-sm font-semibold rounded-xl shadow-card transition-all">
            <FiSettings size={14} /> Shop Settings
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 hover:-translate-y-0.5 transition-transform">
            <div className={`inline-flex p-2.5 rounded-xl border mb-3 ${colorMap[color]}`}>
              <Icon size={16} />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-20 rounded-lg" />
            ) : (
              <p className="text-xl font-bold text-slate-900">{value}</p>
            )}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Income Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <h3 className="font-semibold text-slate-800 mb-6">Monthly Income</h3>
          <div className="h-48 flex items-end gap-2 overflow-x-auto pb-2">
            {data?.monthly?.length ? (
              data.monthly.slice(0, 12).reverse().map((m, i) => {
                const max = Math.max(...data.monthly.map((x: any) => x.total), 1);
                const height = Math.max((m.total / max) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-[32px] group">
                    <div className="relative w-full">
                      <div
                        className="w-full bg-violet-500 hover:bg-violet-600 rounded-t-lg transition-all cursor-pointer"
                        style={{ height: `${(height / 100) * 192}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ₱{parseFloat(m.total).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {new Date(2000, m.month - 1).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center text-slate-300 text-sm italic">
                No income data yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
          <div className="space-y-2">
            {[
              { label: 'Manage Staff',    href: '/owner/staff' },
              { label: 'Manage Services', href: '/owner/services' },
              { label: 'Shop Settings',   href: '/owner/settings' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <FiArrowRight size={14} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
