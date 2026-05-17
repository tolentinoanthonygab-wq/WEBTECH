'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiSave, FiSettings, FiCreditCard, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function OwnerSettingsPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [emailForm, setEmailForm] = useState({ new_email: '', current_password: '' });
  const [emailSaving, setEmailSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
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

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetch('/api/owner/profile.php').then(r => r.json()).then(res => {
        if (res.success) setOwnerEmail(res.data?.email || '');
      }).catch(() => {});
    }
  }, [user]);

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return alert('Fill all password fields.');
    if (passwords.new !== passwords.confirm) return alert('New passwords do not match.');
    setPwdSaving(true);
    try {
      const res  = await fetch('/api/owner/profile.php', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (data.success) { alert('Password changed!'); setPasswords({ current: '', new: '', confirm: '' }); }
      else alert(data.message || 'Failed to change password.');
    } catch { alert('Error changing password.'); }
    finally { setPwdSaving(false); }
  };

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
          {field('Shop Name', 'shop_name', 'e.g. WashWise Makati')}
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

      {/* Password */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="p-2 bg-red-50 rounded-lg text-red-500"><FiLock size={16} /></div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Change Password</p>
            <p className="text-xs text-slate-400">Update your account password</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[['current','Current Password'],['new','New Password'],['confirm','Confirm New Password']].map(([k,l]) => (
            <div key={k} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{l}</label>
              <input type="password" value={(passwords as any)[k]}
                onChange={e => setPasswords(p => ({ ...p, [k]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" />
            </div>
          ))}
          <button onClick={handleChangePassword} disabled={pwdSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
            <FiLock size={14} />{pwdSaving ? 'Saving...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-500"><FiMail size={16} /></div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Change Email</p>
            <p className="text-xs text-slate-400">Current: {ownerEmail || user?.email || '—'}</p>
          </div>
        </div>
        <div className="p-6">
          <EmailChangeCard
            currentEmail={ownerEmail || user?.email || ''}
            apiEndpoint="/api/owner/profile.php"
            onSuccess={e => setOwnerEmail(e)}
          />
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

      {/* Account Settings */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Account Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Change Email */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FiMail size={16} /></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Change Email</p>
                <p className="text-xs text-slate-400 truncate">Current: {ownerEmail}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">New Email Address</label>
                <input type="email" value={emailForm.new_email} onChange={e => setEmailForm(p => ({ ...p, new_email: e.target.value }))} placeholder="new@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Password</label>
                <input type="password" value={emailForm.current_password} onChange={e => setEmailForm(p => ({ ...p, current_password: e.target.value }))} placeholder="Confirm with your password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div className="flex justify-end">
                <button onClick={async () => {
                  if (!emailForm.new_email || !emailForm.current_password) return alert('Fill in all fields.');
                  setEmailSaving(true);
                  try {
                    const res  = await fetch('/api/owner/profile.php', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailForm) });
                    const data = await res.json();
                    if (data.success) { setOwnerEmail(emailForm.new_email); setEmailForm({ new_email: '', current_password: '' }); alert('Email updated!'); }
                    else alert(data.message || 'Failed to update email.');
                  } catch { alert('Network error.'); }
                  finally { setEmailSaving(false); }
                }} disabled={emailSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
                  <FiSave size={14} />{emailSaving ? 'Saving...' : 'Update Email'}
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><FiLock size={16} /></div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Change Password</p>
                <p className="text-xs text-slate-400">Minimum 8 characters</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {([{ key: 'current', label: 'Current Password' }, { key: 'new', label: 'New Password' }, { key: 'confirm', label: 'Confirm New Password' }] as const).map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
                  <div className="relative">
                    <input type={showPw[key] ? 'text' : 'password'} value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPw[key] ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>
              )}
              <div className="flex justify-end">
                <button onClick={handleChangePassword} disabled={pwdSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
                  <FiSave size={14} />{pwdSaving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
