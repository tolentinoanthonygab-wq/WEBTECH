'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiUsers, FiSettings, FiPackage, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/owner/dashboard', icon: <FiHome /> },
  { name: 'Staff', path: '/owner/staff', icon: <FiUsers /> },
  { name: 'Services', path: '/owner/services', icon: <FiPackage /> },
  { name: 'Settings', path: '/owner/settings', icon: <FiSettings /> },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 h-screen bg-content1 border-r border-divider flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center border-b border-divider">
        <Image src="/logo.png" alt="WeLaund" width={110} height={34} />
      </div>
      
      <nav className="flex-1 px-4 pt-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-secondary text-white shadow-lg shadow-secondary/30' 
                : 'text-default-500 hover:bg-default-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-divider">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-danger/10 transition-all font-semibold"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
