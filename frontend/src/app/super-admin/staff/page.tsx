'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

interface StaffMember { id:string; first_name:string; last_name:string; email:string; shop_name:string; status:string; }

const CARD = { background:'rgba(10,20,50,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'1.25rem' };

export default function SuperAdminStaffPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string|null>(null);

  const fetchStaff = async () => { setLoading(true); try { const res=await fetch('/api/super_admin/staff.php'); const d=await res.json(); if(d.success) setStaff(d.data); } catch{} finally{setLoading(false);} };
  useEffect(() => { if(user) fetchStaff(); }, [user]);

  const toggleStatus = async (id:string, current:string) => {
    setUpdating(id);
    const next=current==='active'?'inactive':'active';
    try { const res=await fetch('/api/super_admin/staff.php',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status:next})}); const d=await res.json(); if(d.success) fetchStaff(); else alert(d.message); } catch{alert('Update failed');} finally{setUpdating(null);}
  };

  if (authLoading || !user) return null;

  const filtered = staff.filter(s=>`${s.first_name} ${s.last_name} ${s.email} ${s.shop_name}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Staff Management</h1>
          <p className="text-white/40 text-sm mt-0.5">All staff across every shop</p>
        </div>
        <button onClick={fetchStaff} className="p-2.5 rounded-xl text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.08)'}}><FiRefreshCw size={14} className={loading?'animate-spin':''}/></button>
      </div>

      <div className="relative group">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14}/>
        <input type="text" placeholder="Search by name, email or shop..." value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
          style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.10)'}}/>
      </div>

      <div style={CARD} className="overflow-hidden">
        {loading ? <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        : filtered.length===0 ? <p className="text-center text-white/25 py-10 text-sm">No staff found.</p>
        : <div className="divide-y divide-white/5">
            {filtered.map(s => (
              <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white text-sm">{s.first_name} {s.last_name}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0" style={{background:s.status==='active'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',color:s.status==='active'?'#34d399':'#f87171'}}>{s.status.toUpperCase()}</span>
                  </div>
                  <p className="text-white/40 text-xs truncate mt-0.5">{s.email}</p>
                  <p className="text-cyan-400/60 text-xs font-semibold mt-0.5">{s.shop_name}</p>
                </div>
                <button onClick={()=>toggleStatus(s.id,s.status)} disabled={updating===s.id} className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:scale-105 disabled:opacity-50" style={{background:s.status==='active'?'rgba(239,68,68,0.15)':'rgba(16,185,129,0.15)',color:s.status==='active'?'#f87171':'#34d399'}}>
                  {updating===s.id?'...':(s.status==='active'?'Deactivate':'Activate')}
                </button>
              </div>
            ))}
          </div>}
      </div>
      <p className="text-xs text-white/25 text-right">Showing {filtered.length} of {staff.length}</p>
    </div>
  );
}
