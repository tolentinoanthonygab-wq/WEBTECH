'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiUsers, FiSettings, FiPackage, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import MobileSidebarWrapper from './MobileSidebarWrapper';

const menuItems = [
  { name: 'Dashboard', path: '/owner/dashboard',  icon: FiHome },
  { name: 'Staff',     path: '/owner/staff',       icon: FiUsers },
  { name: 'Services',  path: '/owner/services',    icon: FiPackage },
  { name: 'Settings',  path: '/owner/settings',    icon: FiSettings },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <MobileSidebarWrapper>
      <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <Image src="/logo.png" alt="WeLaund" width={110} height={34} />
        </div>

        {user && (
          <div className="mx-4 mt-4 mb-2 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Owner</p>
            <p className="font-bold text-purple-900 text-sm truncate mt-0.5">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-purple-500 truncate">{user.shop_name}</p>
          </div>
        )}

        <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active = pathname === path || pathname.startsWith(path + '/');
            return (
              <Link key={path} href={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="text-base shrink-0" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <FiLogOut className="text-base shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </MobileSidebarWrapper>
  );
}
