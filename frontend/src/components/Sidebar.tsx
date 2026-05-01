'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiShoppingBag, FiUsers, FiUserCheck, FiBriefcase, FiLogOut, FiPackage, FiList, FiDollarSign, FiShield } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import MobileSidebarWrapper from './MobileSidebarWrapper';

const menuItems = [
  { name: 'Dashboard', path: '/super-admin/dashboard', icon: FiHome },
  { name: 'Shops',     path: '/super-admin/shops',     icon: FiShoppingBag },
  { name: 'Owners',    path: '/super-admin/owners',    icon: FiUsers },
  { name: 'Staff',     path: '/super-admin/staff',     icon: FiBriefcase },
  { name: 'Customers', path: '/super-admin/customers', icon: FiUserCheck },
  { name: 'Services',  path: '/super-admin/services',  icon: FiPackage },
  { name: 'Orders',    path: '/super-admin/orders',    icon: FiList },
  { name: 'Payments',  path: '/super-admin/payments',  icon: FiDollarSign },
  { name: 'Admins',    path: '/super-admin/admins',    icon: FiShield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <MobileSidebarWrapper>
      <div className="w-64 h-screen bg-slate-900 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <Image src="/logo.png" alt="WeLaund" width={110} height={34} />
        </div>

        {user && (
          <div className="mx-4 mt-4 mb-2 px-4 py-3 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
            <p className="font-bold text-white text-sm truncate mt-0.5">{user.first_name || user.username}</p>
          </div>
        )}

        <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const active = pathname === path || pathname.startsWith(path + '/');
            return (
              <Link key={path} href={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="text-base shrink-0" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-red-400 hover:bg-slate-800 transition-all duration-150"
          >
            <FiLogOut className="text-base shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </MobileSidebarWrapper>
  );
}
