'use client';
import CustomerSidebar from '@/components/CustomerSidebar';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-default-50 min-h-screen">
      <CustomerSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
