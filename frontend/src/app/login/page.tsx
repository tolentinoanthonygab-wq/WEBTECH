'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { FiEye, FiEyeOff, FiMail, FiLock, FiAlertOctagon } from 'react-icons/fi';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import AppPhoneShowcase from '@/components/AppPhoneShowcase';

const inputCls = "w-full pb-2.5 pt-1 text-sm text-[var(--text-color)] placeholder-slate-400/50 bg-transparent outline-none border-b border-slate-300/30 focus:border-cyan-400 transition-colors duration-300";

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="group">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <Icon className="text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={11} />
        {label}
      </label>
      <div className="relative">
        {children}
        <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-focus-within:w-full transition-all duration-500" />
      </div>
    </div>
  );
}

function LoginContent() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showSuspended,  setShowSuspended]  = useState(false);
  const [showShopClosed, setShowShopClosed] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('suspended')     === '1') { setShowSuspended(true);  window.history.replaceState({}, '', '/login'); }
    if (searchParams.get('shop_suspended') === '1') { setShowShopClosed(true); window.history.replaceState({}, '', '/login'); }
  }, [searchParams]);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const result = (await login(email, password, 'auto')) as any;
      if (result.success) {
        const r = result.user.role;
        if (r === 'super_admin') window.location.href = '/super-admin/dashboard';
        else if (r === 'owner')  window.location.href = '/owner/dashboard';
        else if (r === 'staff')  window.location.href = '/staff/dashboard';
        else                      window.location.href = '/customer/dashboard';
      } else {
        const msg = result.message || 'Invalid email or password.';
        if (msg === 'SHOP_SUSPENDED') setShowShopClosed(true);
        else if (msg.includes('suspended')) setShowSuspended(true);
        else setError(msg);
      }
    } catch { setError('An error occurred during login.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen welaund-bg flex flex-col transition-colors duration-500">
      <div className="welaund-orb orb-1" /><div className="welaund-orb orb-2" /><div className="welaund-orb orb-3" />

      {/* Navbar */}
      <nav className="relative z-50 py-6 px-6 flex justify-between items-center">
        <Link href="/"><Image src="/logo.png" alt="WashWise" width={140} height={44} style={{ height:'auto' }} className="w-28 lg:w-36" priority /></Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/register" className="px-5 py-2 welaund-btn text-xs">Register</Link>
        </div>
      </nav>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── Left: Description + 3D Phone (desktop) ── */}
          <div className="hidden lg:flex flex-col flex-1 items-center justify-center gap-10" style={{ minHeight:'520px' }}>
            <div className="text-center space-y-4 px-4">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-cyan-400/30 text-cyan-400 bg-cyan-400/8">
                Smart Laundry Platform
              </span>
              <h2 className="text-3xl font-black tracking-tight leading-tight text-[var(--text-color)]">
                Laundry Management,<br/>
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Reimagined.</span>
              </h2>
              <p className="text-sm font-medium text-[var(--text-color)] max-w-xs mx-auto leading-relaxed">
                WashWise is a SaaS platform that lets customers request laundry orders, track progress in real time, and pay digitally — all from one app.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {['Real-time Tracking', 'GCash Payments', 'Multi-shop', 'Digital Receipts'].map(f => (
                  <span key={f} className="px-3 py-1 rounded-full text-[10px] font-bold text-[var(--text-color)]/70 border border-[var(--card-border)] bg-[var(--card-bg)]">{f}</span>
                ))}
              </div>
            </div>
            <AppPhoneShowcase />
          </div>

          {/* ── Mobile: Description text above card ── */}
          <div className="lg:hidden w-full text-center space-y-3 px-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-cyan-400/30 text-cyan-400 bg-cyan-400/8">
              Smart Laundry Platform
            </span>
            <h2 className="text-2xl font-black tracking-tight leading-tight text-[var(--text-color)]">
              Laundry Management,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Reimagined.</span>
            </h2>
            <p className="text-sm font-medium text-[var(--text-color)] max-w-xs mx-auto leading-relaxed">
              WashWise lets you request orders, track progress in real time, and pay digitally.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {['Real-time Tracking', 'GCash Payments', 'Multi-shop', 'Digital Receipts'].map(f => (
                <span key={f} className="px-3 py-1 rounded-full text-[10px] font-bold text-[var(--text-color)]/70 border border-[var(--card-border)] bg-[var(--card-bg)]">{f}</span>
              ))}
            </div>
          </div>

          {/* ── Right: Login Card ── */}
          <div className="w-full lg:w-[420px] shrink-0 animate-slideup">
            <div className="welaund-card p-10 pulse-bg">
              <div className="mb-8">
                <h1 className="text-2xl font-black text-[var(--text-color)] tracking-tight">Sign In</h1>
                <p className="text-[var(--text-color)]/50 text-sm mt-1">Welcome back to WashWise</p>
              </div>

              <div className="space-y-8">
                <Field label="Email Address" icon={FiMail}>
                  <input type="email" placeholder="name@example.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className={inputCls} />
                </Field>
                <Field label="Password" icon={FiLock}>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className={inputCls} />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--text-color)] transition-colors">
                      {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </Field>
                {error && <div className="text-rose-400 text-xs font-bold bg-rose-400/10 p-4 rounded-xl border border-rose-400/20">{error}</div>}
                <button onClick={handleLogin} disabled={loading} className="w-full py-4 welaund-btn text-sm disabled:opacity-60">
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </button>
              </div>

              <p className="text-center text-[var(--text-color)]/40 text-xs mt-8">
                Don't have an account?{' '}
                <Link href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Register here</Link>
              </p>
            </div>
          </div>

          {/* ── Mobile: Phone showcase below card ── */}
          <div className="lg:hidden w-full" style={{ height:'360px' }}>
            <AppPhoneShowcase />
          </div>

        </div>
      </div>

      {/* Modals */}
      {showSuspended && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="welaund-card w-full max-w-sm p-10 text-center space-y-6 border-rose-500/20">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500"><FiAlertOctagon size={40}/></div>
            <div><h3 className="text-2xl font-black text-[var(--text-color)]">Account Suspended</h3><p className="text-[var(--text-color)]/70 text-sm mt-2">Please contact support@washwise.com</p></div>
            <button onClick={() => setShowSuspended(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm transition-all">Close</button>
          </div>
        </div>
      )}
      {showShopClosed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="welaund-card w-full max-w-sm p-10 text-center space-y-6 border-amber-500/20">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500"><FiAlertOctagon size={40}/></div>
            <div><h3 className="text-2xl font-black text-[var(--text-color)]">Shop Inactive</h3><p className="text-[var(--text-color)]/70 text-sm mt-2">This laundry branch is currently not accepting new orders.</p></div>
            <button onClick={() => setShowShopClosed(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm transition-all">Understood</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen welaund-bg flex items-center justify-center text-white/50">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
