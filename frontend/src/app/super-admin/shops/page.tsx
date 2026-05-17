'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiPlus, FiMapPin, FiPhone, FiRefreshCw, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

interface Shop { id:string; shop_name:string; address:string; gcash_number:string; gcash_name:string; status:string; created_on:string; owner_first:string; owner_last:string; }

const CARD = { background:'rgba(10,20,50,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'1.25rem' };
const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300";

export default function ShopsManagement() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ shop_name:'', shop_address:'', shop_contact:'', owner_first_name:'', owner_last_name:'', owner_email:'', owner_password:'' });
  const [showPassword, setShowPassword] = useState(false);

  const fetchShops = async () => { setLoading(true); try { const res=await fetch('/api/super_admin/shops.php'); const d=await res.json(); if(d.success) setShops(d.data); } catch{} finally{setLoading(false);} };
  useEffect(() => { if(user) fetchShops(); }, [user]);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res=await fetch('/api/super_admin/shops.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d=await res.json();
      if(d.success){setShowModal(false);fetchShops();setForm({shop_name:'',shop_address:'',shop_contact:'',owner_first_name:'',owner_last_name:'',owner_email:'',owner_password:''});}
      else alert(d.message);
    } catch{alert('Creation failed');} finally{setSubmitting(false);}
  };

  const toggleStatus = async (id:string, current:string) => {
    const next=current==='active'?'inactive':'active';
    await fetch('/api/super_admin/shops.php',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status:next})});
    fetchShops();
  };

  if (authLoading || !user) return null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Laundry Shops</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage platform partners</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchShops} className="p-2.5 rounded-xl text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.08)'}}><FiRefreshCw size={14} className={loading?'animate-spin':''} /></button>
          <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white hover:scale-[1.02] transition-all" style={{background:'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)',boxShadow:'0 4px 16px rgba(99,102,241,0.4)'}}><FiPlus size={14}/> Add Shop</button>
        </div>
      </div>

      <div style={CARD} className="overflow-hidden">
        {loading ? <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        : shops.length===0 ? <p className="text-center text-white/25 py-10 text-sm">No shops found.</p>
        : <div className="divide-y divide-white/5">
            {shops.map(s => (
              <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-white text-sm">{s.shop_name}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0" style={{background:s.status==='active'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',color:s.status==='active'?'#34d399':'#f87171'}}>{s.status.toUpperCase()}</span>
                  </div>
                  <p className="text-white/50 text-xs mt-0.5 font-semibold">{s.owner_first} {s.owner_last}</p>
                  <div className="flex items-center gap-1 text-white/30 text-xs mt-0.5"><FiMapPin size={10}/>{s.address||'N/A'}</div>
                  <div className="flex items-center gap-1 text-white/30 text-xs"><FiPhone size={10}/>{s.gcash_number||'N/A'} {s.gcash_name?`(${s.gcash_name})`:''}</div>
                  <p className="text-white/20 text-[10px] mt-0.5">{new Date(s.created_on).toLocaleDateString()}</p>
                </div>
                <button onClick={()=>toggleStatus(s.id,s.status)} className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:scale-105" style={{background:s.status==='active'?'rgba(239,68,68,0.15)':'rgba(16,185,129,0.15)',color:s.status==='active'?'#f87171':'#34d399'}}>
                  {s.status==='active'?'Deactivate':'Activate'}
                </button>
              </div>
            ))}
          </div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}}>
          <div className="w-full max-w-lg p-6 rounded-3xl space-y-5 my-4" style={{background:'rgba(10,20,50,0.95)',border:'1px solid rgba(255,255,255,0.12)'}}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Create Shop & Owner</h2>
              <button onClick={()=>setShowModal(false)} className="text-white/30 hover:text-white"><FiX size={18}/></button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-cyan-400/70 uppercase tracking-widest">Shop Information</p>
              {[['shop_name','Shop Name','e.g. WashWise Makati'],['shop_address','Address','Street, City'],['shop_contact','Contact Number','09XX XXX XXXX']].map(([k,l,p])=>(
                <div key={k} className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">{l}</label>
                  <div className="relative"><input type="text" placeholder={p} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className={inputCls}/><div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500"/></div>
                </div>
              ))}
              <p className="text-[10px] font-black text-cyan-400/70 uppercase tracking-widest pt-2">Owner Information</p>
              <div className="grid grid-cols-2 gap-4">
                {[['owner_first_name','First Name','Juan'],['owner_last_name','Last Name','Dela Cruz']].map(([k,l,p])=>(
                  <div key={k} className="group">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">{l}</label>
                    <div className="relative"><input type="text" placeholder={p} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className={inputCls}/><div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500"/></div>
                  </div>
                ))}
              </div>
              {[['owner_email', 'Email', 'owner@email.com', 'email']].map(([k, l, p, t]) => (
                <div key={k} className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">{l}</label>
                  <div className="relative">
                    <input type={t} placeholder={p} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                  </div>
                </div>
              ))}

              <div className="group">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={form.owner_password}
                    onChange={e => setForm(f => ({ ...f, owner_password: e.target.value }))}
                    className={inputCls}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.06)'}}>Cancel</button>
              <button onClick={handleCreate} disabled={submitting} className="flex-1 py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:scale-[1.02] transition-all" style={{background:'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)'}}>{submitting?'Saving...':'Save Shop & Owner'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
