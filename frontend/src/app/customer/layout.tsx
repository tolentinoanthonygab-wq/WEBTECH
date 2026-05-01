'use client';
import CustomerSidebar from '@/components/CustomerSidebar';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <CustomerSidebar />
      <main className="flex-1 md:ml-64 min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
