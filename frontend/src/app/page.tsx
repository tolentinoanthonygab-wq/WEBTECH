'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import {
  FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone,
  FiMapPin, FiChevronDown, FiAlertOctagon, FiX,
  FiCheckCircle, FiZap, FiBarChart2, FiCreditCard, FiSmartphone, FiArrowRight
} from 'react-icons/fi';
import { StatsSection, DetailedFeaturesSection, BentoSection, WhySection } from '@/components/landing/LandingExtras';
import ThemeToggle from '@/components/ThemeToggle';


interface Shop { id: string; name: string; }

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

const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/10 focus:border-cyan-400 transition-colors duration-300";

const STEPS = [
  { n: '01', title: 'Create Account',   desc: 'Register in seconds and link your laundry shop.' },
  { n: '02', title: 'Drop Off Laundry', desc: 'Walk in, drop your items and get a digital receipt.' },
  { n: '03', title: 'Track Progress',   desc: 'Monitor wash, dry, fold stages in real time.' },
  { n: '04', title: 'Pay & Pickup',     desc: 'Pay via GCash or cash, then pick up fresh laundry.' },
];

function LandingContent() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView]         = useState<'login'|'register'>('login');
  const [sliding, setSliding]   = useState(false);

  // modals
  const [showSuspended,  setShowSuspended]  = useState(false);
  const [showShopClosed, setShowShopClosed] = useState(false);

  // login
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPwd, setShowPwd]       = useState(false);
  const { login } = useAuth();

  // register
  const [shops, setShops] = useState<Shop[]>([]);
  const [form,  setForm]  = useState({ shop_id:'', first_name:'', middle_name:'', last_name:'', email:'', password:'', contact_number:'', address:'' });
  const [regError,   setRegError]   = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('suspended')    === '1') { setShowSuspended(true);  window.history.replaceState({}, '', '/'); }
    if (searchParams.get('shop_suspended') === '1') { setShowShopClosed(true); window.history.replaceState({}, '', '/'); }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/public/register.php').then(r => r.json()).then(res => { if (res.success) setShops(res.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchTo = (next: 'login'|'register') => {
    if (next === view || sliding) return;
    setSliding(true);
    setEmail(''); setPassword(''); setLoginError(''); setShowPwd(false);
    setForm({ shop_id:'', first_name:'', middle_name:'', last_name:'', email:'', password:'', contact_number:'', address:'' });
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
        else if (r === 'owner')  window.location.href = '/owner/dashboard';
        else if (r === 'staff')  window.location.href = '/staff/dashboard';
        else                      window.location.href = '/customer/dashboard';
      } else {
        const msg = result.message || 'Invalid email or password.';
        if (msg === 'SHOP_SUSPENDED') setShowShopClosed(true);
        else if (msg.includes('suspended')) setShowSuspended(true);
        else setLoginError(msg);
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
      const res  = await fetch('/api/public/register.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setRegSuccess('Registration successful! Redirecting…'); setTimeout(() => switchTo('login'), 2000); }
      else setRegError(data.message || 'Registration failed.');
    } catch { setRegError('Connection error. Please try again.'); }
    finally { setRegLoading(false); }
  };

  return (
    <div className="min-h-screen welaund-bg transition-colors duration-500">
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[var(--bg-color)]/80 backdrop-blur-xl border-b border-[var(--card-border)]' : 'py-8 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Image src="/logo.png" alt="WeLaund" width={160} height={50} style={{ height: 'auto' }} className="w-32 lg:w-40" priority />
          
          <div className="flex items-center gap-4 lg:gap-10">
            <div className="hidden lg:flex items-center gap-10">
              {['Features', 'How It Works'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-bold text-[#3B7597] hover:opacity-100 transition-opacity tracking-wide uppercase">{l}</a>
              ))}
            </div>
            
            <ThemeToggle />
            
            <button onClick={() => { setView('login'); document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-5 py-2 sm:px-6 sm:py-2.5 welaund-btn text-[10px] sm:text-xs">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO & AUTH ── */}
      <section id="get-started" className="pt-32 sm:pt-40 lg:pt-56 pb-20 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-[55%] animate-slideup">
              <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Next-Gen Laundry Platform</span>
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tighter text-[#3B7597]">
                Smart Laundry <br/><span className="text-[#3B7597]/70">Management.</span>
              </h1>
              <p className="text-xl text-[#3B7597]/80 max-w-lg mb-12 font-medium leading-relaxed">
                Experience the first fully automated SaaS platform for laundry shop growth. Real-time orders, digital payments, and powerful analytics.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 welaund-btn text-sm">Join the Beta</button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">View Demo</button>
              </div>
            </div>

            <div className="lg:w-[45%] w-full max-w-md animate-slideup delay-200" id="auth-card">
              <div className="welaund-card p-10 relative overflow-hidden">
                <div className="flex gap-8 mb-10 border-b border-white/5 pb-2">
                  {['login', 'register'].map(v => (
                    <button key={v} onClick={() => switchTo(v as any)} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${view === v ? 'text-[#3B7597]' : 'text-[#3B7597]/50 hover:text-[#3B7597]'}`}>
                      {v}
                      {view === v && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-full" />}
                    </button>
                  ))}
                </div>

                <div className={`transition-all duration-500 ${sliding ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  {view === 'login' ? (
                    <div className="space-y-8">
                      <Field label="Email Address" icon={FiMail}>
                        <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Password" icon={FiLock}>
                        <div className="relative">
                          <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} />
                          <button onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"><Icon i={showPwd ? FiEyeOff : FiEye} /></button>
                        </div>
                      </Field>
                      {loginError && <div className="text-rose-400 text-xs font-bold bg-rose-400/10 p-4 rounded-xl border border-rose-400/20">{loginError}</div>}
                      <button onClick={handleLogin} disabled={loginLoading} className="w-full py-4 welaund-btn text-sm">
                        {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scroll">
                      <Field label="Select Laundry Shop" icon={FiMapPin}>
                        <select value={form.shop_id} onChange={e => setF('shop_id', e.target.value)} className={inputCls}>
                          <option value="" disabled className="bg-[#020617]">Choose a location...</option>
                          {shops.map(s => <option key={s.id} value={s.id} className="bg-[#020617]">{s.name}</option>)}
                        </select>
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="First Name" icon={FiUser}><input type="text" placeholder="John" value={form.first_name} onChange={e => setF('first_name', e.target.value)} className={inputCls} /></Field>
                        <Field label="Last Name" icon={FiUser}><input type="text" placeholder="Doe" value={form.last_name} onChange={e => setF('last_name', e.target.value)} className={inputCls} /></Field>
                      </div>
                      <Field label="Email" icon={FiMail}><input type="email" placeholder="john@email.com" value={form.email} onChange={e => setF('email', e.target.value)} className={inputCls} /></Field>
                      <Field label="Password" icon={FiLock}>
                        <div className="relative">
                          <input type={showRegPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setF('password', e.target.value)} className={inputCls} />
                          <button onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"><Icon i={showRegPwd ? FiEyeOff : FiEye} /></button>
                        </div>
                      </Field>
                      {regError && <div className="text-rose-400 text-xs font-bold bg-rose-400/10 p-4 rounded-xl border border-rose-400/20">{regError}</div>}
                      {regSuccess && <div className="text-emerald-400 text-xs font-bold bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">{regSuccess}</div>}
                      <button onClick={handleRegister} disabled={regLoading} className="w-full py-4 welaund-btn text-sm">
                        {regLoading ? 'Creating Account...' : 'Complete Registration'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <div className="space-y-32">
        <StatsSection />
        <div id="features"><DetailedFeaturesSection /></div>
        <BentoSection />
        <WhySection />
        
        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 lg:mb-24">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.4em] mb-4 block">Our Workflow</span>
              <h2 className="text-4xl lg:text-5xl font-black text-[#3B7597] tracking-tight">How WeLaund Works</h2>
              <p className="text-[#3B7597]/70 mt-4 font-medium text-base lg:text-lg">Four simple steps from drop-off to fresh pickup.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} className="group animate-slideup">
                  <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center text-2xl font-black text-[#3B7597] bg-white/5 border border-white/5 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 transition-all duration-500">
                    {n}
                  </div>
                  <h3 className="text-xl font-black text-[#3B7597] mb-3 tracking-tight">{title}</h3>
                  <p className="text-[#3B7597]/70 text-sm font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── CTA ── */}
        <section className="py-40 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center welaund-card p-10 lg:p-20 border-cyan-400/20">
            <h2 className="text-4xl lg:text-5xl font-black text-[#3B7597] mb-6 tracking-tight">Ready to Modernize?</h2>
            <p className="text-[#3B7597]/70 mb-10 text-lg font-medium">Join hundreds of laundry shops already using WeLaund to scale.</p>
            <button className="px-12 py-5 welaund-btn text-base flex items-center gap-3 mx-auto">
              Get Started for Free <FiArrowRight />
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-20 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">
              <div className="space-y-6">
                <Image src="/logo.png" alt="WeLaund" width={140} height={44} style={{ height: 'auto' }} className="opacity-80" />
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                  Leading SaaS platform for modern laundry shop management. Orders, payments, and growth analytics in one unified workspace.
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="text-[#3B7597] font-black text-sm uppercase tracking-widest">Platform</h4>
                <div className="flex flex-col gap-4 text-slate-400 text-sm font-medium">
                  <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                  <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
                  <a href="#get-started" className="hover:text-cyan-400 transition-colors">Pricing</a>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[#3B7597] font-black text-sm uppercase tracking-widest">Company</h4>
                <div className="flex flex-col gap-4 text-slate-400 text-sm font-medium">
                  <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} WeLaund Platform.</p>
              <div className="flex gap-3">
                {['GCash', 'Maya', 'Cash'].map(p => (
                  <span key={p} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── MODALS ── */}
      <Suspense fallback={null}>
        <Modals showSuspended={showSuspended} setShowSuspended={setShowSuspended} showShopClosed={showShopClosed} setShowShopClosed={setShowShopClosed} />
      </Suspense>
    </div>
  );
}

function Modals({ showSuspended, setShowSuspended, showShopClosed, setShowShopClosed }: any) {
  return (
    <>
      {showSuspended && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="welaund-card w-full max-w-sm p-10 text-center space-y-6 border-rose-500/20">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500"><FiAlertOctagon size={40}/></div>
            <div><h3 className="text-2xl font-black text-[#3B7597]">Account Suspended</h3><p className="text-[#3B7597]/70 text-sm mt-2 font-medium">Please contact support@welaund.com</p></div>
            <button onClick={() => setShowSuspended(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm transition-all">Close</button>
          </div>
        </div>
      )}
      {showShopClosed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="welaund-card w-full max-w-sm p-10 text-center space-y-6 border-amber-500/20">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500"><FiAlertOctagon size={40}/></div>
            <div><h3 className="text-2xl font-black text-[#3B7597]">Shop Inactive</h3><p className="text-[#3B7597]/70 text-sm mt-2 font-medium">This laundry branch is currently not accepting new orders.</p></div>
            <button onClick={() => setShowShopClosed(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm transition-all">Understood</button>
          </div>
        </div>
      )}
    </>
  );
}

const Icon = ({ i: Icon }: { i: any }) => <Icon size={16} />;

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen welaund-bg flex items-center justify-center text-white/50">Loading...</div>}>
      <LandingContent />
    </Suspense>
  );
}
