'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiShoppingBag, FiUsers, FiBriefcase, FiDollarSign, FiClock, FiShield } from 'react-icons/fi';
import Link from 'next/link';

const CARD = { background:'rgba(10,20,50,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'1.25rem' };

export default function SuperAdminDashboard() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetch('/api/super_admin/stats.php').then(r=>r.json()).then(res=>{ if(res.success) setStats(res.data); setLoading(false); }).catch(()=>setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const cards = [
    { label:'Total Revenue',      value:`₱${(stats?.total_revenue||0).toLocaleString('en-PH',{minimumFractionDigits:2})}`, icon:FiDollarSign, accent:'#10b981' },
    { label:'Total Shops',        value:stats?.total_shops||0,        icon:FiShoppingBag, accent:'#00aeef' },
    { label:'Active Owners',      value:stats?.total_owners||0,       icon:FiUsers,       accent:'#8e66ff' },
    { label:'Total Staff',        value:stats?.total_staff||0,        icon:FiBriefcase,   accent:'#f59e0b' },
    { label:'Total Customers',    value:stats?.total_customers||0,    icon:FiUsers,       accent:'#6366f1' },
    { label:'Pending Approvals',  value:stats?.pending_customers||0,  icon:FiClock,       accent:'#f43f5e' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Platform Overview</h1>
        <p className="text-white/40 text-sm mt-0.5">Welcome back, {user.user_name}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="p-4 hover:-translate-y-0.5 transition-transform" style={CARD}>
            <div className="p-2.5 rounded-xl inline-flex mb-3" style={{ background:`${accent}22`, color:accent }}><Icon size={16} /></div>
            {loading ? <div className="h-6 w-16 rounded animate-pulse" style={{ background:'rgba(255,255,255,0.08)' }} />
              : <p className="text-lg font-black text-white">{value}</p>}
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wide mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label:'Manage Shops',    href:'/super-admin/shops',     accent:'#00aeef' },
          { label:'Manage Owners',   href:'/super-admin/owners',    accent:'#8e66ff' },
          { label:'Manage Admins',   href:'/super-admin/admins',    accent:'#f43f5e' },
        ].map(({ label, href, accent }) => (
          <Link key={href} href={href}>
            <div className="p-4 rounded-2xl text-center font-black text-sm cursor-pointer hover:scale-[1.02] transition-all"
              style={{ background:`${accent}18`, border:`1px solid ${accent}33`, color:accent }}>
              {label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
