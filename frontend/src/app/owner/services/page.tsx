'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiPlus, FiRefreshCw, FiEdit2, FiToggleRight, FiToggleLeft, FiTrash2, FiX } from 'react-icons/fi';

interface Service {
  id: string;
  service_name: string;
  unit: string;
  price_per_unit: number;
  category: string;
  status: 'active' | 'inactive';
}

const CARD = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1.25rem',
};

const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300";
const selectCls = "w-full pb-2.5 pt-1 text-sm text-white bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300 appearance-none cursor-pointer";

const categoryColor: Record<string, { bg: string; color: string }> = {
  White:   { bg: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.7)' },
  Colored: { bg: 'rgba(0,174,239,0.15)',   color: '#00aeef' },
  Blanket: { bg: 'rgba(142,102,255,0.15)', color: '#8e66ff' },
  Other:   { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
};

export default function OwnerServicesPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState<Service | null>(null);
  const [form, setForm]         = useState({ name: '', unit: 'per_kg', price: '', category: 'Colored' });
  const [saving, setSaving]     = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/services.php');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchServices(); }, [user]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', unit: 'per_kg', price: '', category: 'Colored' });
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.service_name, unit: s.unit, price: s.price_per_unit.toString(), category: s.category || 'Colored' });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body   = editing ? { id: editing.id, ...form } : form;
      const res    = await fetch('/api/owner/services.php', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setShowModal(false); fetchServices(); }
      else alert(data.message || 'Error saving service');
    } catch { alert('Error saving service'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch('/api/owner/services.php', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchServices(); else alert(data.message || 'Failed to delete');
    } catch { alert('Error deleting service'); }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await fetch('/api/owner/services.php', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }),
      });
      fetchServices();
    } catch { alert('Failed to update status'); }
  };

  if (authLoading) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Laundry Services</h1>
          <p className="text-white/40 text-sm mt-0.5">Define your prices and laundry types</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchServices}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            <FiPlus size={14} /> Add Service
          </button>
        </div>
      </div>

      {/* Services list */}
      <div style={CARD} className="overflow-hidden">
        {loading ? (
          <p className="text-center text-white/30 py-10 text-sm">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-white/25 py-10 text-sm">No services found.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {services.map(s => {
              const cat = categoryColor[s.category] ?? categoryColor.Other;
              return (
                <div key={s.id} className="flex items-center justify-between px-5 py-4 gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-white text-sm">{s.service_name}</p>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: cat.bg, color: cat.color }}>
                        {s.category || 'General'}
                      </span>
                      {s.status === 'inactive' && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">
                      ₱{parseFloat(s.price_per_unit as any).toFixed(2)} / {s.unit.replace('per_', '')}
                    </p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => openEdit(s)}
                      className="p-2 rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(0,174,239,0.15)', color: '#00aeef' }}>
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => toggleStatus(s.id, s.status)}
                      className="p-2 rounded-lg transition-all hover:scale-105"
                      style={{
                        background: s.status === 'active' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                        color: s.status === 'active' ? '#fbbf24' : '#34d399',
                      }}>
                      {s.status === 'active' ? <FiToggleRight size={15} /> : <FiToggleLeft size={15} />}
                    </button>
                    <button onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md p-6 rounded-3xl space-y-5"
            style={{ background: 'rgba(10,20,50,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Service Name</label>
                <div className="relative">
                  <input type="text" placeholder="e.g. Premium Wash" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Category</label>
                <div className="relative">
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={selectCls}>
                    <option value="White"   className="bg-[#0a1432]">White Items</option>
                    <option value="Colored" className="bg-[#0a1432]">Colored Items</option>
                    <option value="Blanket" className="bg-[#0a1432]">Blanket / Special</option>
                    <option value="Other"   className="bg-[#0a1432]">Other / General</option>
                  </select>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Unit</label>
                  <div className="relative">
                    <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className={selectCls}>
                      <option value="per_kg"    className="bg-[#0a1432]">Per Kilogram</option>
                      <option value="per_piece" className="bg-[#0a1432]">Per Piece</option>
                    </select>
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                  </div>
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Price (₱)</label>
                  <div className="relative">
                    <input type="number" placeholder="0.00" value={form.price}
                      onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inputCls} />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)' }}>
                {saving ? 'Saving...' : editing ? 'Update Service' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
