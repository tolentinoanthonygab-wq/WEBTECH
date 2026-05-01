'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 rounded-xl md:hidden"
        style={{ background: 'rgba(10,20,50,0.82)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        aria-label="Open menu"
      >
        <FiMenu size={18} className="text-white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar drawer */}
      <div className={`
        fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 md:hidden"
        >
          <FiX size={16} />
        </button>
        {children}
      </div>
    </>
  );
}
