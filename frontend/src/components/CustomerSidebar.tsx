'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiSend, FiList, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import MobileSidebarWrapper from './MobileSidebarWrapper';

const menuItems = [
  { name: 'Dashboard',       path: '/customer/dashboard', icon: FiHome },
  { name: 'Request Laundry', path: '/customer/request',   icon: FiSend },
  { name: 'Order History',   path: '/customer/orders',    icon: FiList },
  { name: 'My Profile',      path: '/customer/profile',   icon: FiUser },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <MobileSidebarWrapper>
      <div className="w-64 h-screen flex flex-col" style={{ background: 'rgba(10,20,50,0.82)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="bg-[#0a0f2e] rounded-xl px-4 py-2 inline-flex">
            <Image src="/logo.png" alt="WeLaund" width={180} height={56} className="h-auto" style={{ width: 'auto' }} priority />
          </div>
        </div>

        {/* User badge */}
        {user && (
          <div className="mx-4 mt-4 mb-2 px-4 py-3 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest">Customer</p>
            <p className="font-bold text-white text-sm truncate mt-0.5">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-white/40 truncate">{user.shop_name}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active = pathname === path || pathname.startsWith(path + '/');
            return (
              <Link key={path} href={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/8'
                }`}
                style={active ? { background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' } : {}}
              >
                <Icon className="text-base shrink-0" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-red-400 hover:bg-white/8 transition-all duration-150"
          >
            <FiLogOut className="text-base shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </MobileSidebarWrapper>
  );
}
