'use client';
import OwnerSidebar from '@/components/OwnerSidebar';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-default-50 min-h-screen">
      <OwnerSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
