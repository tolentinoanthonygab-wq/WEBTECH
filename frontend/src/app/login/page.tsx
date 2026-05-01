'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiChevronDown, FiAlertOctagon, FiX } from 'react-icons/fi';

interface Shop { id: string; name: string; }

const SKY_BG = {
  background: `
    radial-gradient(ellipse at 30% 60%, #5e95c2 0%, transparent 25%),
    radial-gradient(ellipse at 5%  50%, #749ac1 0%, transparent 20%),
    radial-gradient(ellipse at 35% 80%, #4081b3 0%, transparent 18%),
    radial-gradient(ellipse at 85% 100%, #7dadd2 0%, transparent 22%),
    radial-gradient(ellipse at 0%  75%, #5da2cd 0%, transparent 20%),
    linear-gradient(160deg,#e4f3ff 0%,#d5e8f9 8%,#d3e6f6 15%,#c7d7f0 22%,#aacfec 35%,#a6d2ef 42%,#bdd8ef 55%,#c8def5 65%,#c4dff3 75%,#c8ddf0 85%,#b4d7ed 100%)
  `
};

const CARD_STYLE = {
  background: 'rgba(10,20,50,0.72)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(5, 0, 0, 0.08)',
};

const BTN_STYLE = {
  background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)',
  boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
};

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="group">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <Icon className="text-white/30 group-focus-within:text-cyan-400 transition-colors" size={11} />
        {label}
      </label>
      <div className="relative">
        {children}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
      </div>
    </div>
  );
}

const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300";

export default function AuthPage() {
  const [view, setView]           = useState<'login' | 'register'>('login');
  const [sliding, setSliding]     = useState(false);
  const [showSuspended, setShowSuspended] = useState(false);
  const [showShopClosed, setShowShopClosed] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('suspended') === '1') {
      setShowSuspended(true);
      window.history.replaceState({}, '', '/login');
    }
    if (searchParams.get('shop_suspended') === '1') {
      setShowShopClosed(true);
      window.history.replaceState({}, '', '/login');
    }
  }, [searchParams]);

  // Login state
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPwd, setShowPwd]     = useState(false);
  const { login } = useAuth();

  // Register state
  const [shops, setShops]         = useState<Shop[]>([]);
  const [form, setForm]           = useState({ shop_id: '', first_name: '', middle_name: '', last_name: '', email: '', password: '', contact_number: '', address: '' });
  const [regError, setRegError]   = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  useEffect(() => {
    fetch('/api/public/register.php')
      .then(r => r.json())
      .then(res => { if (res.success) setShops(res.data); })
      .catch(() => {});
  }, []);

  const switchTo = (next: 'login' | 'register') => {
    if (next === view || sliding) return;
    setSliding(true);
    // Reset both forms on switch
    setEmail(''); setPassword(''); setLoginError(''); setShowPwd(false);
    setForm({ shop_id: '', first_name: '', middle_name: '', last_name: '', email: '', password: '', contact_number: '', address: '' });
    setRegError(''); setRegSuccess(''); setShowRegPwd(false);
    setTimeout(() => { setView(next); setSliding(false); }, 350);
  };

  const handleLogin = async () => {
    setLoginError('');
    if (!email || !password) { setLoginError('Please enter your email and password.'); return; }
    setLoginLoading(true);
    try {
      const result = (await login(email, password, 'auto')) as any;
      if (result.success) {
        const r = result.user.role;
        if (r === 'super_admin') window.location.href = '/super-admin/dashboard';
        else if (r === 'owner') window.location.href = '/owner/dashboard';
        else if (r === 'staff') window.location.href = '/staff/dashboard';
        else window.location.href = '/customer/dashboard';
      } else {
        const msg = result.message || 'Invalid email or password.';
        if (msg === 'SHOP_SUSPENDED') {
          setShowShopClosed(true);
        } else if (msg.includes('suspended')) {
          setShowSuspended(true);
        } else {
          setLoginError(msg);
        }
      }
    } catch { setLoginError('An error occurred during login.'); }
    finally { setLoginLoading(false); }
  };

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async () => {
    setRegError(''); setRegSuccess('');
    if (!form.shop_id || !form.first_name || !form.last_name || !form.email || !form.password) {
      setRegError('Please fill in all required fields.'); return;
    }
    setRegLoading(true);
    try {
      const res = await fetch('/api/public/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => switchTo('login'), 2000);
      } else {
        setRegError(data.message || 'Registration failed.');
      }
    } catch { setRegError('Connection error. Please try again.'); }
    finally { setRegLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden">

      {/* Sky background */}
      <div className="absolute inset-0 z-0" style={SKY_BG} />

      {/* Left branding panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center px-10 relative z-10">
        <div className="mb-8">
          <div className="bg-[#0a0f2e] rounded-2xl px-6 py-3 inline-flex border border-slate-700" style={{ boxShadow: '0 0 40px rgba(34,211,238,0.12)' }}>
            <Image src="/logo.png" alt="WeLaund" width={200} height={62} className="w-48 h-auto" style={{ height: 'auto' }} priority />
          </div>
        </div>
        <div className="text-center max-w-sm">
          <h1 className="text-5xl font-black tracking-tight leading-none mb-4">
            <span className="text-slate-800">We</span><span className="text-blue-600">Laund</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/60" />
          </div>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            A modern laundry management system designed to simplify operations, track orders, and improve customer experience in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Order Tracking', 'GCash Payments', 'Analytics'].map(f => (
              <span key={f} className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right card panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 md:py-0 relative z-10">
        <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Static card shell */}
        <div className="relative w-full max-w-md overflow-hidden" style={{ ...CARD_STYLE, borderRadius: '1.875rem' }}>

          {/* Sliding inner content */}
          <div
            className="transition-all duration-350 ease-in-out"
            style={{
              transform: sliding
                ? view === 'login' ? 'translateX(-60px)' : 'translateX(60px)'
                : 'translateX(0)',
              opacity: sliding ? 0 : 1,
              transition: 'transform 0.35s ease, opacity 0.35s ease',
            }}
          >
            {view === 'login' ? (
              /* ── LOGIN FORM ── */
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <p className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-[0.3em] mb-2">WeLaund Platform</p>
                  <h2 className="text-3xl font-black text-white tracking-tight leading-none">Login</h2>
                  <p className="text-white/30 text-sm mt-2 font-medium">Sign in to your dashboard</p>
                </div>

                {loginError && (
                  <div className="mb-6 px-4 py-3 rounded-xl text-xs font-semibold text-red-300 border border-red-500/20 bg-red-500/10 flex items-center gap-2">
                    <span>⚠️</span> {loginError}
                  </div>
                )}

                <div className="space-y-7">
                  <Field label="Email Address" icon={FiMail}>
                    <input type="email" placeholder="Enter your email" value={email}
                      onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className={inputCls} />
                  </Field>

                  <Field label="Password" icon={FiLock}>
                    <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password" value={password}
                      onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className={inputCls + ' pr-8'} />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-0 top-1 text-white/25 hover:text-white/60 transition-colors">
                      {showPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </Field>

                  <button onClick={handleLogin} disabled={loginLoading}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white mt-2 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    style={BTN_STYLE}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.6)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = BTN_STYLE.boxShadow)}
                  >
                    {loginLoading ? 'Signing in...' : 'SIGN IN →'}
                  </button>
                </div>

                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[10px] text-white/20 font-semibold uppercase tracking-widest">WeLaund</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                <p className="text-center text-[11px] text-white/25 font-medium">
                  New customer?{' '}
                  <button onClick={() => switchTo('register')} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors ml-1">
                    Create Account
                  </button>
                </p>
              </div>
            ) : (
              /* ── REGISTER FORM ── */
              <div className="p-8 md:p-10">
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-[0.3em] mb-2">WeLaund Platform</p>
                  <h2 className="text-3xl font-black text-white tracking-tight leading-none">Register</h2>
                  <p className="text-white/30 text-sm mt-2 font-medium">Create your customer account</p>
                </div>

                {regError && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-xs font-semibold text-red-300 border border-red-500/20 bg-red-500/10 flex items-center gap-2">
                    <span>⚠️</span> {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-xs font-semibold text-green-300 border border-green-500/20 bg-green-500/10 flex items-center gap-2">
                    <span>🎉</span> {regSuccess}
                  </div>
                )}

                <div className="space-y-5 max-h-[52vh] overflow-y-auto pr-1">
                  {/* Shop select */}
                  <div className="group">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <FiMapPin size={11} className="text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                      Laundry Shop *
                    </label>
                    <div className="relative">
                      <select value={form.shop_id} onChange={e => setF('shop_id', e.target.value)}
                        className={inputCls + ' pr-6 appearance-none cursor-pointer'}>
                        <option value="" className="bg-[#0a1432]">Select a branch</option>
                        {shops.map(s => <option key={s.id} value={s.id} className="bg-[#0a1432]">{s.name}</option>)}
                      </select>
                      <FiChevronDown size={12} className="absolute right-0 top-2 text-white/30 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
                    </div>
                  </div>

                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name *" icon={FiUser}>
                      <input type="text" placeholder="Juan" value={form.first_name}
                        onChange={e => setF('first_name', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Last Name *" icon={FiUser}>
                      <input type="text" placeholder="Dela Cruz" value={form.last_name}
                        onChange={e => setF('last_name', e.target.value)} className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Middle Name" icon={FiUser}>
                    <input type="text" placeholder="Optional" value={form.middle_name}
                      onChange={e => setF('middle_name', e.target.value)} className={inputCls} />
                  </Field>

                  <Field label="Email Address *" icon={FiMail}>
                    <input type="email" placeholder="name@email.com" value={form.email}
                      onChange={e => setF('email', e.target.value)} className={inputCls} />
                  </Field>

                  <Field label="Contact Number" icon={FiPhone}>
                    <input type="text" placeholder="09XX XXX XXXX" value={form.contact_number}
                      onChange={e => setF('contact_number', e.target.value)} className={inputCls} />
                  </Field>

                  <Field label="Password *" icon={FiLock}>
                    <input type={showRegPwd ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password}
                      onChange={e => setF('password', e.target.value)} className={inputCls + ' pr-8'} />
                    <button type="button" onClick={() => setShowRegPwd(v => !v)}
                      className="absolute right-0 top-1 text-white/25 hover:text-white/60 transition-colors">
                      {showRegPwd ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </Field>

                  <Field label="Home Address" icon={FiMapPin}>
                    <input type="text" placeholder="Street, City, Province" value={form.address}
                      onChange={e => setF('address', e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <button onClick={handleRegister} disabled={regLoading}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white mt-6 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                  style={BTN_STYLE}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = BTN_STYLE.boxShadow)}
                >
                  {regLoading ? 'Creating account...' : 'CREATE ACCOUNT →'}
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[10px] text-white/20 font-semibold uppercase tracking-widest">WeLaund</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                <p className="text-center text-[11px] text-white/25 font-medium">
                  Already have an account?{' '}
                  <button onClick={() => switchTo('login')} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors ml-1">
                    Back to Login
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SUSPENDED POPUP ── */}
      {showSuspended && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm p-8 rounded-3xl text-center space-y-5"
            style={{ background: 'rgba(10,20,50,0.97)', border: '1px solid rgba(239,68,68,0.35)', boxShadow: '0 0 60px rgba(239,68,68,0.2)' }}>
            <div className="flex justify-center">
              <div className="p-4 rounded-full" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <FiAlertOctagon size={36} className="text-red-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Account Suspended</h2>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                Sorry, this account has been suspended by the developer.
                Please contact support for assistance.
              </p>
            </div>
            <div className="h-px bg-white/8" />
            <p className="text-[11px] text-white/30">
              Contact: <span className="text-cyan-400 font-bold">support@welaund.com</span>
            </p>
            <button onClick={() => setShowSuspended(false)}
              className="w-full py-3 rounded-xl font-black text-sm text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <FiX size={14} className="inline mr-2" />Close
            </button>
          </div>
        </div>
      )}

      {/* ── SHOP CLOSED POPUP ── */}
      {showShopClosed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm p-8 rounded-3xl text-center space-y-5"
            style={{ background: 'rgba(10,20,50,0.97)', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 0 60px rgba(245,158,11,0.15)' }}>
            <div className="flex justify-center">
              <div className="p-4 rounded-full" style={{ background: 'rgba(245,158,11,0.15)' }}>
                <span style={{ fontSize: 36 }}>🏪</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Shop Temporarily Closed</h2>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                Please wait for the shop to open again.
                Your account is safe — the shop is currently unavailable.
              </p>
            </div>
            <div className="h-px bg-white/8" />
            <p className="text-[11px] text-white/30">
              Contact your shop owner or{' '}
              <span className="text-cyan-400 font-bold">support@welaund.com</span>
            </p>
            <button onClick={() => setShowShopClosed(false)}
              className="w-full py-3 rounded-xl font-black text-sm text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <FiX size={14} className="inline mr-2" />Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
