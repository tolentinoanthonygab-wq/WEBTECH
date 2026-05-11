'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiSave, FiSettings, FiCreditCard, FiPhone } from 'react-icons/fi';

export default function OwnerSettingsPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shop, setShop] = useState({ 
    shop_name: '', 
    address: '', 
    contact_number: '', 
    gcash_number: '', 
    gcash_name: '',
    delivery_available: true,
    delivery_fee: 0
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/settings.php');
      const data = await res.json();
      if (data.success) {
        setShop({
          ...data.data,
          delivery_available: data.data.delivery_available ?? true,
          delivery_fee: data.data.delivery_fee ?? 0
        });
      }
    } catch { console.error('Failed to fetch settings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchSettings(); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/owner/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      const data = await res.json();
      if (data.success) alert('Settings saved successfully!');
    } catch { alert('Error saving settings'); }
    finally { setSaving(false); }
  };

  if (authLoading) return null;

  const field = (label: string, key: keyof typeof shop, placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={String(shop[key])}
        onChange={e => setShop(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shop Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure your business profile and payment methods</p>
      </div>

      {/* General Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><FiSettings size={16} /></div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">General Information</p>
            <p className="text-xs text-slate-400">Shop name, address, and contact</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {field('Shop Name', 'shop_name', 'e.g. WeLaund Makati')}
          {field('Shop Address', 'address', 'e.g. 123 Ayala Ave, Makati')}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={shop.contact_number}
                onChange={e => setShop(p => ({ ...p, contact_number: e.target.value }))}
                placeholder="09XX XXX XXXX"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><FiCreditCard size={16} /></div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Payment Methods</p>
            <p className="text-xs text-slate-400">GCash details for customer payments</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {field('GCash Registered Name', 'gcash_name', 'e.g. Maria Santos')}
            {field('GCash Mobile Number', 'gcash_number', '09XX XXX XXXX')}
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-xs text-emerald-700 font-medium">Customers will see these details during checkout to pay for their laundry.</p>
          </div>
        </div>
      </div>
      
      {/* Delivery Services */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FiSettings size={16} /></div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Delivery Services</p>
            <p className="text-xs text-slate-400">Configure delivery availability and fees</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900 text-sm">Delivery Availability</p>
              <p className="text-xs text-slate-500">Enable or disable delivery services temporarily</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${shop.delivery_available ? 'text-blue-600' : 'text-slate-400'}`}>
                {shop.delivery_available ? 'Active' : 'Disabled'}
              </span>
              <button
                onClick={() => setShop(p => ({ ...p, delivery_available: !p.delivery_available }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  shop.delivery_available ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    shop.delivery_available ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Delivery Service Fee (₱)</label>
            <input
              type="text"
              value={shop.delivery_fee}
              onChange={e => {
                const val = e.target.value;
                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                  setShop(p => ({ ...p, delivery_fee: val as any }));
                }
              }}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-[10px] text-slate-400 italic">This amount will be automatically added to delivery orders.</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm shadow-violet-200 transition-all"
        >
          <FiSave size={14} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
