'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiRefreshCw } from 'react-icons/fi';

interface Owner { id:string; first_name:string; last_name:string; email:string; status:string; shop_name:string; }

const CARD = { background:'rgba(10,20,50,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'1.25rem' };

export default function OwnersManagement() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string|null>(null);

  const fetchOwners = async () => { setLoading(true); try { const res=await fetch('/api/super_admin/owners.php'); const d=await res.json(); if(d.success) setOwners(d.data); } catch{} finally{setLoading(false);} };
  useEffect(() => { if(user) fetchOwners(); }, [user]);

  const toggleStatus = async (id:string, current:string) => {
    setUpdating(id);
    const next=current==='active'?'inactive':'active';
    try { const res=await fetch('/api/super_admin/owners.php',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status:next})}); const d=await res.json(); if(d.success) fetchOwners(); else alert(d.message); } catch{alert('Update failed');} finally{setUpdating(null);}
  };

  if (authLoading || !user) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Shop Owners</h1>
          <p className="text-white/40 text-sm mt-0.5">All business owners on the platform</p>
        </div>
        <button onClick={fetchOwners} className="p-2.5 rounded-xl text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.08)'}}><FiRefreshCw size={14} className={loading?'animate-spin':''}/></button>
      </div>

      <div style={CARD} className="overflow-hidden">
        {loading ? <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        : owners.length===0 ? <p className="text-center text-white/25 py-10 text-sm">No owners found.</p>
        : <div className="divide-y divide-white/5">
            {owners.map(o => (
              <div key={o.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white text-sm">{o.first_name} {o.last_name}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0" style={{background:o.status==='active'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',color:o.status==='active'?'#34d399':'#f87171'}}>{o.status.toUpperCase()}</span>
                  </div>
                  <p className="text-white/40 text-xs truncate mt-0.5">{o.email}</p>
                  <p className="text-cyan-400/60 text-xs font-semibold mt-0.5">{o.shop_name||'No Shop'}</p>
                </div>
                <button onClick={()=>toggleStatus(o.id,o.status)} disabled={updating===o.id} className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:scale-105 disabled:opacity-50" style={{background:o.status==='active'?'rgba(239,68,68,0.15)':'rgba(16,185,129,0.15)',color:o.status==='active'?'#f87171':'#34d399'}}>
                  {updating===o.id?'...':(o.status==='active'?'Suspend':'Activate')}
                </button>
              </div>
            ))}
          </div>}
      </div>
    </div>
  );
}
