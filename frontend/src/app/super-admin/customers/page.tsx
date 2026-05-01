'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

interface Customer { id:string; first_name:string; last_name:string; email:string; shop_name:string; status:string; }

const CARD = { background:'rgba(10,20,50,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'1.25rem' };

const statusStyle: Record<string,{bg:string;color:string}> = {
  Approved:    {bg:'rgba(16,185,129,0.15)',  color:'#34d399'},
  Pending:     {bg:'rgba(245,158,11,0.15)',  color:'#fbbf24'},
  Disapproved: {bg:'rgba(239,68,68,0.15)',   color:'#f87171'},
  Inactive:    {bg:'rgba(255,255,255,0.08)', color:'rgba(23, 5, 5, 0.35)'},
};

const nextOptions: Record<string,string[]> = {
  Approved:['Inactive','Pending'], Pending:['Approved','Disapproved'], Disapproved:['Pending'], Inactive:['Approved'],
};

export default function SuperAdminCustomersPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState<string|null>(null);

  const fetchCustomers = async () => { setLoading(true); try { const res=await fetch('/api/super_admin/customers.php'); const d=await res.json(); if(d.success) setCustomers(d.data); } catch{} finally{setLoading(false);} };
  useEffect(() => { if(user) fetchCustomers(); }, [user]);

  const setStatus = async (id:string, status:string) => {
    setUpdating(id);
    try { const res=await fetch('/api/super_admin/customers.php',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})}); const d=await res.json(); if(d.success) fetchCustomers(); else alert(d.message); } catch{alert('Update failed');} finally{setUpdating(null);}
  };

  if (authLoading || !user) return null;

  const filtered = customers.filter(c => {
    const ms = `${c.first_name} ${c.last_name} ${c.email} ${c.shop_name}`.toLowerCase().includes(search.toLowerCase());
    return ms && (filter==='all'||c.status===filter);
  });

  const counts = customers.reduce((a,c)=>({...a,[c.status]:(a[c.status]||0)+1}),{} as Record<string,number>);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Customers</h1>
          <p className="text-white/40 text-sm mt-0.5">All customer accounts across every shop</p>
        </div>
        <button onClick={fetchCustomers} className="p-2.5 rounded-xl text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.08)'}}><FiRefreshCw size={14} className={loading?'animate-spin':''}/></button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all',...Object.keys(statusStyle)].map(s => {
          const st = statusStyle[s];
          const active = filter===s;
          return (
            <button key={s} onClick={()=>setFilter(s)} className="text-[10px] font-black px-3 py-1.5 rounded-full transition-all"
              style={{ background:active?(st?.bg||'rgba(24, 20, 20, 0.15)'):'rgba(255,255,255,0.06)', color:active?(st?.color||'white'):'rgba(255,255,255,0.4)', border:`1px solid ${active?(st?.color||'rgba(255,255,255,0.3)'):'rgba(255,255,255,0.08)'}` }}>
              {s==='all'?`All (${customers.length})`:`${s} (${counts[s]||0})`}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14}/>
        <input type="text" placeholder="Search by name, email or shop..." value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-black placeholder-white/20 outline-none transition-all"
          style={{background:'rgba(0, 0, 0, 0.06)',border:'1px solid rgba(11, 5, 5, 0.1)'}}/>
      </div>

      <div style={CARD} className="overflow-hidden">
        {loading ? <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        : filtered.length===0 ? <p className="text-center text-white/25 py-10 text-sm">No customers found.</p>
        : <div className="divide-y divide-white/5">
            {filtered.map(c => {
              const st = statusStyle[c.status]??statusStyle.Inactive;
              return (
                <div key={c.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{c.first_name} {c.last_name}</p>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0" style={{background:st.bg,color:st.color}}>{c.status.toUpperCase()}</span>
                    </div>
                    <p className="text-white/40 text-xs truncate mt-0.5">{c.email}</p>
                    <p className="text-cyan-400/60 text-xs font-semibold mt-0.5">{c.shop_name}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    {(nextOptions[c.status]||[]).map(next => {
                      const ns = statusStyle[next]??statusStyle.Inactive;
                      return (
                        <button key={next} onClick={()=>setStatus(c.id,next)} disabled={updating===c.id} className="px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all hover:scale-105 disabled:opacity-50" style={{background:ns.bg,color:ns.color}}>
                          {updating===c.id?'...':next}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>}
      </div>
      <p className="text-xs text-white/25 text-right">Showing {filtered.length} of {customers.length}</p>
    </div>
  );
}
