'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/staff/customers', label: 'Customer Approvals', icon: '👥' },
  { href: '/staff/orders', label: 'Orders', icon: '📋' },
  { href: '/staff/orders/new', label: 'New Order', icon: '➕' },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-default-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-default-200 flex flex-col">
        <div className="p-6 border-b border-default-200">
          <Image src="/logo.png" alt="WeLaund" width={120} height={40} priority />
          <p className="text-xs text-default-400 mt-2 truncate">{user?.shop_name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-white'
                  : 'text-default-600 hover:bg-default-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-default-200">
          <p className="text-xs text-default-400 mb-2 truncate">{user?.user_name}</p>
          <button
            onClick={logout}
            className="w-full text-left text-sm text-danger hover:text-danger-600 px-4 py-2 rounded-lg hover:bg-danger-50 transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
