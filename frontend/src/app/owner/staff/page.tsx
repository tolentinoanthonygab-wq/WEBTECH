'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiUserPlus, FiRefreshCw, FiTrash2, FiCheckCircle, FiX } from 'react-icons/fi';

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'inactive';
  photo_url: string | null;
}

const CARD = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1.25rem',
};

const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300";

export default function OwnerStaffPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [staff, setStaff]   = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ first_name: '', last_name: '', email: '', password: 'Admin@123' });
  const [saving, setSaving] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/staff.php');
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchStaff(); }, [user]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/owner/staff.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchStaff();
        setNewStaff({ first_name: '', last_name: '', email: '', password: 'Admin@123' });
      } else alert(data.message || 'Failed to create staff');
    } catch { alert('Error creating staff'); } finally { setSaving(false); }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await fetch('/api/owner/staff.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchStaff();
    } catch { alert('Failed to update status'); }
  };

  if (authLoading) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Staff Management</h1>
          <p className="text-white/40 text-sm mt-0.5">{user?.shop_name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStaff}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            <FiUserPlus size={14} /> Add Staff
          </button>
        </div>
      </div>

      {/* Staff list */}
      <div style={CARD} className="overflow-hidden">
        {loading ? (
          <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        ) : staff.length === 0 ? (
          <p className="text-center text-white/25 py-10 text-sm">No staff found.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {staff.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {s.photo_url
                      ? <img src={s.photo_url} alt="avatar" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center font-black text-sm text-white/40">
                          {s.first_name?.[0]?.toUpperCase()}
                        </div>
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{s.first_name} {s.last_name}</p>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: s.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: s.status === 'active' ? '#34d399' : '#f87171',
                        }}>
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs truncate mt-0.5">{s.email}</p>
                  </div>
                </div>
                <button onClick={() => toggleStatus(s.id, s.status)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black shrink-0 transition-all hover:scale-105"
                  style={{
                    background: s.status === 'active' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                    color: s.status === 'active' ? '#f87171' : '#34d399',
                  }}>
                  {s.status === 'active' ? <><FiTrash2 size={11} /> Deactivate</> : <><FiCheckCircle size={11} /> Activate</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md p-6 rounded-3xl space-y-5" style={{ background: 'rgba(10,20,50,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Hire New Staff</h2>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors"><FiX size={18} /></button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">First Name</label>
                  <div className="relative">
                    <input type="text" placeholder="Juan" value={newStaff.first_name}
                      onChange={e => setNewStaff(p => ({ ...p, first_name: e.target.value }))} className={inputCls} />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                  </div>
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Last Name</label>
                  <div className="relative">
                    <input type="text" placeholder="Dela Cruz" value={newStaff.last_name}
                      onChange={e => setNewStaff(p => ({ ...p, last_name: e.target.value }))} className={inputCls} />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Email</label>
                <div className="relative">
                  <input type="email" placeholder="staff@email.com" value={newStaff.email}
                    onChange={e => setNewStaff(p => ({ ...p, email: e.target.value }))} className={inputCls} />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Temporary Password</label>
                <p className="text-sm font-bold text-white/40 border-b border-white/10 pb-2">Admin@123</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                Cancel
              </button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)' }}>
                {saving ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
