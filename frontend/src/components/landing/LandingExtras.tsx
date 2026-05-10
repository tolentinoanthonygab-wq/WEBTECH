'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiBarChart2, FiCreditCard, FiSmartphone, FiShield, FiClock,
  FiTrendingUp, FiLayers, FiUsers, FiCheckCircle, FiStar, FiChevronLeft, FiChevronRight,
  FiActivity, FiFileText, FiServer, FiLock
} from 'react-icons/fi';

const ACCENT_COLOR = "#0692abff"; 

export function StatsSection() {
  const stats = [
    { label: 'Orders Processed', value: '1.2M+', icon: FiZap },
    { label: 'Active Shops', value: '850+', icon: FiLayers },
    { label: 'Happy Customers', value: '250k+', icon: FiUsers },
    { label: 'Uptime', value: '99.9%', icon: FiShield },
  ];

  return (
    <div className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <div key={i} className="text-center animate-slideup" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="inline-flex p-4 rounded-3xl mb-6" style={{ background: 'rgba(59, 117, 151, 0.1)', border: '1px solid rgba(59, 117, 151, 0.05)' }}>
              <s.icon size={28} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-5xl font-black text-[#3B7597] mb-2 tracking-tighter">{s.value}</div>
            <div className="text-[#3B7597] opacity-70 font-semibold uppercase tracking-[0.2em] text-[10px]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureMockup({ index }: { index: number }) {
  const textColor = "text-[#3B7597]";
  const subTextColor = "text-[#3B7597]/60";
  const cardBg = "bg-[#3B7597]/5 dark:bg-white/5";
  const borderColor = "border-[#3B7597]/10 dark:border-white/10";
  
  if (index === 0) { // Order Tracking
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`w-72 ${cardBg} rounded-2xl p-6 border ${borderColor} space-y-4 shadow-xl`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[10px] font-black ${textColor} uppercase tracking-widest`}>Order #8821</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold">WASHING</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 rounded ${cardBg} overflow-hidden`}>
                <motion.div initial={{ width: 0 }} animate={{ width: i === 1 ? '100%' : i === 2 ? '40%' : '0%' }} transition={{ duration: 1, delay: i * 0.2 }} className="h-full bg-cyan-500" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2 items-center">
             <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><FiClock size={16} /></div>
             <div className={`flex-1 text-[10px] ${subTextColor}`}>Estimated Pickup: <br/><span className={`${textColor} font-bold`}>Today, 5:00 PM</span></div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) { // Payments
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`w-64 ${cardBg} rounded-3xl p-8 border ${borderColor} flex flex-col items-center shadow-xl`}>
           <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6"><FiCreditCard size={32} /></div>
           <div className={`text-2xl font-black ${textColor} mb-1`}>₱1,250.00</div>
           <div className={`text-[10px] font-bold ${subTextColor} uppercase tracking-widest mb-6`}>Payment Due</div>
           <div className="w-full h-11 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition-colors flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Pay with GCash</div>
        </div>
      </div>
    );
  }

  if (index === 2) { // Analytics
    return (
      <div className="relative w-full h-full flex items-center justify-center gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-14 ${cardBg} border ${borderColor} rounded-xl flex flex-col-reverse p-1.5 overflow-hidden shadow-lg`} style={{ height: `${40 + i * 20}%` }}>
            <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} transition={{ duration: 1, delay: i * 0.1 }} className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-lg" />
          </div>
        ))}
        <div className={`absolute top-12 right-12 p-5 rounded-2xl ${cardBg} border ${borderColor} shadow-2xl animate-float`}>
          <FiTrendingUp className="text-cyan-600 dark:text-cyan-400" size={28} />
        </div>
      </div>
    );
  }

  if (index === 3) { // Mobile
    return (
      <div className="relative w-full h-full flex items-center justify-center">
         <div className={`w-36 h-60 border-4 ${borderColor} rounded-[2.5rem] p-2 relative shadow-2xl`}>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-14 h-5 ${borderColor} border bg-white/10 rounded-b-xl`} />
            <div className={`w-full h-full rounded-[2rem] ${cardBg} flex flex-col p-3 space-y-2.5`}>
               <div className="h-7 rounded-lg bg-cyan-500/20" />
               <div className={`h-14 rounded-lg ${cardBg} border ${borderColor}`} />
               <div className={`h-14 rounded-lg ${cardBg} border ${borderColor}`} />
               <div className="flex-1" />
               <div className="h-14 rounded-lg bg-cyan-500 shadow-md" />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
       {/* Data Streams */}
       {[...Array(6)].map((_, i) => (
         <motion.div
           key={i}
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ 
             opacity: [0, 0.3, 0],
             scale: [0.8, 1.2],
             x: [0, (i % 2 === 0 ? 120 : -120)],
             y: [0, (i < 3 ? 120 : -120)]
           }}
           transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
           className="absolute w-1.5 h-1.5 bg-cyan-500 rounded-full blur-[1px]"
         />
       ))}

       <div className="relative flex flex-col items-center">
          <div className="w-36 h-36 rounded-full border-2 border-cyan-500/20 flex items-center justify-center relative shadow-inner">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 rounded-full border-t-2 border-cyan-500/40"
             />
             <div className={`w-28 h-28 rounded-full ${cardBg} flex items-center justify-center relative shadow-xl`}>
                <FiShield size={56} className="text-cyan-600 dark:text-cyan-400 opacity-80" />
                <motion.div 
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute"
                >
                  <FiLock size={24} className={`${textColor} mt-2`} />
                </motion.div>
             </div>
          </div>
          
          <div className="mt-10 space-y-3 text-center">
             <div className={`text-[11px] font-black ${textColor} uppercase tracking-[0.3em]`}>Encrypted Storage</div>
             <div className="flex gap-1.5 justify-center">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    className="w-2 h-2 rounded-sm bg-cyan-500 shadow-sm" 
                  />
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}

export function DetailedFeaturesSection() {
  const features = [
    {
      title: 'Live Order Tracking',
      desc: 'Real-time visibility for both staff and customers. Every stage is logged from washing to folding.',
      icon: FiClock,
      bullets: ['Stage-by-stage updates', 'Instant push notifications', 'Digital order receipts']
    },
    {
      title: 'Flexible Payments',
      desc: 'Seamless integration with GCash, Maya, and cash management. Instant validation.',
      icon: FiCreditCard,
      bullets: ['Automatic payment logs', 'QR Code generation', 'Instant payment tracking']
    },
    {
      title: 'Owner Analytics',
      desc: 'Powerful insights into revenue, staff performance, and peak hours at your fingertips.',
      icon: FiBarChart2,
      bullets: ['Daily/Weekly reports', 'Top services breakdown', 'Staff efficiency metrics']
    },
    {
      title: 'Mobile Operations',
      desc: 'Process orders directly from a tablet or phone. No bulky hardware needed.',
      icon: FiSmartphone,
      bullets: ['Fully responsive UI', 'Cloud syncing', 'Low data usage']
    },
    {
      title: 'Enterprise Security',
      desc: 'Your business data is encrypted and backed up daily on secure cloud servers.',
      icon: FiShield,
      bullets: ['Role-based access', 'Audit logs', 'Daily backups']
    }
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % features.length);
  const prev = () => setIndex((i) => (i - 1 + features.length) % features.length);

  return (
    <div className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.4em] mb-4 block">Platform Features</span>
        <h2 className="text-4xl lg:text-6xl font-black text-[#3B7597] mb-6 tracking-tight">Everything You Need</h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative min-h-[550px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="absolute inset-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 px-4"
          >
            <div className="lg:w-1/2 flex flex-col items-start text-left">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" 
                   style={{ background: 'rgba(59, 117, 151, 0.1)', border: '1px solid rgba(59, 117, 151, 0.2)' }}>
                {(() => { const Icon = features[index].icon; return <Icon size={32} className="text-cyan-600 dark:text-cyan-400" />; })()}
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#3B7597] mb-6 tracking-tight">{features[index].title}</h3>
              <p className="text-[#3B7597] opacity-80 text-xl leading-relaxed mb-10 font-medium">{features[index].desc}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {features[index].bullets.map((b, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-bold text-[#3B7597]/70">
                    <FiCheckCircle size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 w-full h-[350px] lg:h-[450px] welaund-card overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-[#3B7597]/5 to-transparent dark:from-white/5">
               <FeatureMockup index={index} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-[-80px] lg:bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
           <button onClick={prev} className="w-12 h-12 rounded-full border border-[#3B7597]/20 flex items-center justify-center text-[#3B7597] hover:bg-[#3B7597]/10 transition-all">
             <FiChevronLeft size={24} />
           </button>
           <div className="flex gap-2">
             {features.map((_, i) => (
               <div key={i} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all cursor-pointer ${index === i ? 'w-8 bg-cyan-500' : 'w-2 bg-[#3B7597]/20'}`} />
             ))}
           </div>
           <button onClick={next} className="w-12 h-12 rounded-full border border-[#3B7597]/20 flex items-center justify-center text-[#3B7597] hover:bg-[#3B7597]/10 transition-all">
             <FiChevronRight size={24} />
           </button>
        </div>
      </div>
    </div>
  );
}

export function BentoSection() {
  return (
    <div className="py-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 welaund-card p-8 lg:p-12 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl lg:text-4xl font-black text-[#3B7597] mb-4 tracking-tight">Ready for Scale</h3>
            <p className="text-[#3B7597] opacity-80 max-w-md font-medium text-lg">Whether you have one shop or a nationwide chain, WeLaund handles the complexity for you.</p>
          </div>
          <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiTrendingUp size={300} className="text-[#3B7597]" />
          </div>
        </div>
        <div className="lg:col-span-4 welaund-card p-8 lg:p-12 flex flex-col justify-center items-center text-center">
          <FiSmartphone size={60} className="text-cyan-600 dark:text-cyan-400 mb-8 animate-float" />
          <h3 className="text-2xl font-black text-[#3B7597] mb-2">Mobile First</h3>
          <p className="text-[#3B7597] opacity-80 text-sm font-medium">Staff can process orders directly from a tablet or phone.</p>
        </div>
      </div>
    </div>
  );
}

export function WhySection() {
  const benefits = [
    { title: 'Zero Hardware Needed', desc: 'Runs in any modern browser. No complex setup.', icon: FiSmartphone },
    { title: 'Secure & Reliable',    desc: 'Encrypted data and 99.9% uptime for your peace of mind.', icon: FiShield },
    { title: 'Fast Implementation', desc: 'Get your shop online and ready in under 10 minutes.', icon: FiClock },
    { title: 'Modern Experience',   desc: 'Impress your customers with a professional digital workflow.', icon: FiStar },
  ];

  return (
    <div className="py-32 bg-white/5 backdrop-blur-3xl border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-4xl lg:text-5xl font-black text-[#3B7597] tracking-tight">Why Choose WeLaund?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((b, i) => (
            <div key={i} className="group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                <b.icon className="text-[#3B7597]/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" size={24} />
              </div>
              <h4 className="text-lg font-black text-[#3B7597] mb-3 tracking-tight">{b.title}</h4>
              <p className="text-[#3B7597] opacity-70 text-sm font-medium leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
