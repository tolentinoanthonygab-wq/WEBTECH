'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiPlus, FiRefreshCw, FiSearch, FiShield, FiX } from 'react-icons/fi';

interface Admin { id:string; username:string; email:string; status:string; created_on:string; }

const CARD = { background:'rgba(10,20,50,0.72)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:'1.25rem' };
const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300";

export default function SuperAdminAdminsPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username:'', email:'', password:'' });
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async () => { setLoading(true); try { const res=await fetch('/api/super_admin/admins.php'); const d=await res.json(); if(d.success) setAdmins(d.data); } catch{} finally{setLoading(false);} };
  useEffect(() => { if(user) fetchAdmins(); }, [user]);

  const handleCreate = async () => {
    setSaving(true);
    try { const res=await fetch('/api/super_admin/admins.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newAdmin)}); const d=await res.json(); if(d.success){setShowModal(false);fetchAdmins();setNewAdmin({username:'',email:'',password:''});}else alert(d.message); } catch{alert('Creation failed');} finally{setSaving(false);}
  };

  const toggleStatus = async (id:string, current:string) => {
    if(id===user?.user_id){alert("You cannot deactivate your own account.");return;}
    setUpdating(id);
    const next=current==='active'?'inactive':'active';
    try { const res=await fetch('/api/super_admin/admins.php',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status:next})}); const d=await res.json(); if(d.success) fetchAdmins(); else alert(d.message); } catch{alert('Update failed');} finally{setUpdating(null);}
  };

  if (authLoading || !user) return null;

  const filtered = admins.filter(a=>`${a.username} ${a.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2"><FiShield size={20} className="text-cyan-400"/> Super Admins</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage platform administrators</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAdmins} className="p-2.5 rounded-xl text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.08)'}}><FiRefreshCw size={14} className={loading?'animate-spin':''}/></button>
          <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white hover:scale-[1.02] transition-all" style={{background:'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)',boxShadow:'0 4px 16px rgba(99,102,241,0.4)'}}><FiPlus size={14}/> Add Admin</button>
        </div>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14}/>
        <input type="text" placeholder="Search by username or email..." value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
          style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.10)'}}/>
      </div>

      <div style={CARD} className="overflow-hidden">
        {loading ? <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        : filtered.length===0 ? <p className="text-center text-white/25 py-10 text-sm">No admins found.</p>
        : <div className="divide-y divide-white/5">
            {filtered.map(a => (
              <div key={a.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white text-sm">{a.username}</p>
                    {a.id===user.user_id && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{background:'rgba(0,174,239,0.15)',color:'#00aeef'}}>YOU</span>}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0" style={{background:a.status==='active'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',color:a.status==='active'?'#34d399':'#f87171'}}>{a.status.toUpperCase()}</span>
                  </div>
                  <p className="text-white/40 text-xs truncate mt-0.5">{a.email}</p>
                  <p className="text-white/20 text-[10px] mt-0.5">{new Date(a.created_on).toLocaleDateString()}</p>
                </div>
                <button onClick={()=>toggleStatus(a.id,a.status)} disabled={updating===a.id||a.id===user.user_id} className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:scale-105 disabled:opacity-30" style={{background:a.status==='active'?'rgba(239,68,68,0.15)':'rgba(16,185,129,0.15)',color:a.status==='active'?'#f87171':'#34d399'}}>
                  {updating===a.id?'...':(a.status==='active'?'Deactivate':'Activate')}
                </button>
              </div>
            ))}
          </div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}}>
          <div className="w-full max-w-md p-6 rounded-3xl space-y-5" style={{background:'rgba(10,20,50,0.95)',border:'1px solid rgba(255,255,255,0.12)'}}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Add Super Admin</h2>
              <button onClick={()=>setShowModal(false)} className="text-white/30 hover:text-white"><FiX size={18}/></button>
            </div>
            <div className="space-y-5">
              {[['username','Username','admin_name','text'],['email','Email','admin@email.com','email'],['password','Password','Min. 8 characters','password']].map(([k,l,p,t])=>(
                <div key={k} className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">{l}</label>
                  <div className="relative"><input type={t} placeholder={p} value={(newAdmin as any)[k]} onChange={e=>setNewAdmin(a=>({...a,[k]:e.target.value}))} className={inputCls}/><div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500"/></div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.06)'}}>Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 hover:scale-[1.02] transition-all" style={{background:'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)'}}>{saving?'Creating...':'Create Admin'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
