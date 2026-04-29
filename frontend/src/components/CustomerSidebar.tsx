'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiSend, FiList, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Dashboard',     path: '/customer/dashboard', icon: <FiHome /> },
  { name: 'Request Laundry', path: '/customer/request',   icon: <FiSend /> },
  { name: 'Order History', path: '/customer/orders',    icon: <FiList /> },
  { name: 'My Profile',    path: '/customer/profile',   icon: <FiUser /> },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 h-screen bg-content1 border-r border-divider flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-divider">
        <Image src="/logo.png" alt="WeLaund" width={110} height={34} />
      </div>

      {user && (
        <div className="px-6 py-4 bg-blue-50/60 border-b border-divider">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Customer</p>
          <p className="font-bold text-blue-900 truncate">{user.first_name} {user.user_name?.split(' ').slice(1).join(' ')}</p>
          <p className="text-xs text-default-400 truncate">{user.shop_name}</p>
        </div>
      )}

      <nav className="flex-1 px-4 pt-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-default-500 hover:bg-default-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-divider">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-danger/10 transition-all font-semibold"
        >
          <FiLogOut className="text-lg" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
