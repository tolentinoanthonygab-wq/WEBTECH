'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody, Input, Button, Link } from '@nextui-org/react';
import { useAuth } from '@/context/AuthContext';
import { FiEye, FiEyeOff, FiCheckCircle, FiTruck, FiShoppingBag, FiTrendingUp, FiCreditCard, FiBarChart2, FiLayers, FiZap, FiUser } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('customer'); // Default focus
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { login } = useAuth();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = (await login(email, password, role)) as any;
      if (result.success) {
        const userRole = result.user.role;
        if (userRole === 'super_admin') window.location.href = '/super-admin/dashboard';
        else if (userRole === 'owner') window.location.href = '/owner/dashboard';
        else if (userRole === 'staff') window.location.href = '/staff/dashboard';
        else window.location.href = '/customer/dashboard';
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'customer', title: 'Customer', desc: 'Track laundry', icon: <FiTruck className="text-green-500" />, bg: 'bg-green-50' },
    { id: 'staff', title: 'Staff', desc: 'Daily ops', icon: <FiShoppingBag className="text-orange-500" />, bg: 'bg-orange-50' },
    { id: 'owner', title: 'Owner', desc: 'Analytics', icon: <FiTrendingUp className="text-red-500" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#f8fafc] overflow-hidden">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-[#1e40af] via-[#3730a3] to-[#4338ca] p-6 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[120px] opacity-10" />

        <div className="relative z-10 space-y-6 max-w-xs w-full text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-2xl">
              <Image src="/logo.png" alt="WeLaund" width={140} height={42} priority />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">WeLaund Platform</h1>
              <p className="text-blue-100/80 mt-2 font-semibold text-xs">Modern SaaS Laundry Solution</p>
            </div>
          </div>

          <div className="space-y-2 text-left">
            {[
              { icon: <FiZap />, text: "Real-time order tracking" },
              { icon: <FiCreditCard />, text: "GCash & cash payments" },
              { icon: <FiBarChart2 />, text: "Business analytics" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-200 text-sm">{f.icon}</div>
                <p className="text-white font-bold text-xs">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
        <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100/50">
          <div className="text-left">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-default-400 font-bold text-xs italic">Sign in to your dashboard</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all relative group ${role === r.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 mx-auto ${r.bg}`}>
                  <span className="text-lg">{r.icon}</span>
                </div>
                <h3 className="font-extrabold text-[9px] text-gray-800 uppercase">{r.title}</h3>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {error && <div className="bg-danger-50 border-l-2 border-danger-500 text-danger-700 text-[10px] rounded-lg px-4 py-2 font-bold animate-shake">⚠️ {error}</div>}

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                <Input size="sm" placeholder="Enter your email" variant="flat" radius="lg" value={email} onValueChange={setEmail} classNames={{ inputWrapper: "h-10 bg-gray-100/50 focus-within:bg-white border-2 border-transparent focus-within:border-blue-500 transition-all" }} />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
                <Input
                  size="sm"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  variant="flat"
                  radius="lg"
                  value={password}
                  onValueChange={setPassword}
                  classNames={{ inputWrapper: "h-10 bg-gray-100/50 focus-within:bg-white border-2 border-transparent focus-within:border-blue-500 transition-all" }}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? <FiEyeOff className="text-default-400" /> : <FiEye className="text-default-400" />}
                    </button>
                  }
                />
              </div>
            </div>

            <Button color="primary" className="w-full h-12 rounded-xl bg-blue-600 text-white font-black text-sm shadow-lg mt-1" isLoading={loading} onPress={handleLogin}>
              SIGN IN NOW →
            </Button>

            <p className="text-center text-[10px] text-default-400 font-bold">
              New customer? <Link href="/register" className="text-blue-600 font-black ml-1 hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
