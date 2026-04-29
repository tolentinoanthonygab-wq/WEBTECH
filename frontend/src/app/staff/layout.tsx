'use client';
import StaffSidebar from '@/components/StaffSidebar';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-default-50 min-h-screen">
      <StaffSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
