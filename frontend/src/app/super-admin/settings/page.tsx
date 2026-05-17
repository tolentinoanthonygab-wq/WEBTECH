'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { FiMail, FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

const CARD = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1.25rem',
};

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg text-white transition-all ${ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {msg}
    </div>
  );
}

export default function SuperAdminSettingsPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');

  const [profile, setProfile] = useState({ username: '', email: '' });
  const [emailForm, setEmailForm] = useState({ new_email: '', current_password: '' });
  const [pwForm, setPwForm]     = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showPw, setShowPw]     = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving]     = useState<'email' | 'password' | null>(null);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user) return;
    fetch('/api/super_admin/settings.php')
      .then(r => r.json())
      .then(res => { if (res.success) setProfile(res.data); });
  }, [user]);

  const handleEmailSave = async () => {
    if (!emailForm.new_email || !emailForm.current_password)
      return showToast('Fill in all fields.', false);
    setSaving('email');
    try {
      const res = await fetch('/api/super_admin/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_email', ...emailForm }),
      });
      const data = await res.json();
      showToast(data.message, data.success);
      if (data.success) {
        setProfile(p => ({ ...p, email: emailForm.new_email }));
        setEmailForm({ new_email: '', current_password: '' });
      }
    } catch { showToast('Network error.', false); }
    finally { setSaving(null); }
  };

  const handlePasswordSave = async () => {
    if (!pwForm.current_password || !pwForm.new_password || !pwForm.confirm_password)
      return showToast('Fill in all fields.', false);
    if (pwForm.new_password !== pwForm.confirm_password)
      return showToast('New passwords do not match.', false);
    setSaving('password');
    try {
      const res = await fetch('/api/super_admin/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_password', current_password: pwForm.current_password, new_password: pwForm.new_password }),
      });
      const data = await res.json();
      showToast(data.message, data.success);
      if (data.success) setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch { showToast('Network error.', false); }
    finally { setSaving(null); }
  };

  if (authLoading || !user) return null;

  const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all';
  const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' };
  const labelCls = 'text-[11px] font-bold text-white/50 uppercase tracking-widest';

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Account Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage your email and password</p>
      </div>

      {/* Profile Info */}
      <div style={CARD} className="px-6 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#00aeef,#6366f1)' }}>
          {(profile.username?.[0] || 'A').toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-white">{profile.username}</p>
          <p className="text-sm text-white/50">{profile.email}</p>
        </div>
      </div>

      {/* Change Email */}
      <div style={CARD} className="overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(0,174,239,0.15)', color: '#00aeef' }}><FiMail size={16} /></div>
          <div>
            <p className="font-semibold text-white text-sm">Change Email</p>
            <p className="text-xs text-white/40">Update your login email address</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>New Email Address</label>
            <input
              type="email"
              value={emailForm.new_email}
              onChange={e => setEmailForm(p => ({ ...p, new_email: e.target.value }))}
              placeholder="new@email.com"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Current Password</label>
            <input
              type="password"
              value={emailForm.current_password}
              onChange={e => setEmailForm(p => ({ ...p, current_password: e.target.value }))}
              placeholder="Confirm with your password"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleEmailSave}
              disabled={saving === 'email'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1)' }}
            >
              <FiSave size={14} />
              {saving === 'email' ? 'Saving...' : 'Update Email'}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={CARD} className="overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}><FiLock size={16} /></div>
          <div>
            <p className="font-semibold text-white text-sm">Change Password</p>
            <p className="text-xs text-white/40">Must be at least 8 characters</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {([
            { key: 'current_password', label: 'Current Password',  show: showPw.current,  toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
            { key: 'new_password',     label: 'New Password',      show: showPw.new,      toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
            { key: 'confirm_password', label: 'Confirm New Password', show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
          ] as const).map(({ key, label, show, toggle }) => (
            <div key={key} className="space-y-1.5">
              <label className={labelCls}>{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={pwForm[key]}
                  onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                  style={inputStyle}
                />
                <button type="button" onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
          ))}
          {pwForm.new_password && pwForm.confirm_password && pwForm.new_password !== pwForm.confirm_password && (
            <p className="text-xs text-red-400 font-medium">Passwords do not match.</p>
          )}
          <div className="flex justify-end">
            <button
              onClick={handlePasswordSave}
              disabled={saving === 'password'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(90deg,#6366f1,#8e66ff)' }}
            >
              <FiSave size={14} />
              {saving === 'password' ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
