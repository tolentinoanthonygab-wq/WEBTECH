'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardBody, Chip, Button } from '@nextui-org/react';
import { useAuth } from '@/context/AuthContext';
import { FiRefreshCw, FiLogOut } from 'react-icons/fi';

export default function PendingPage() {
  const { user, loading, logout, setUser } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && (user as any).status === 'Approved') router.push('/customer/dashboard');
  }, [user, loading, router]);

  const checkStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/auth/session.php');
      const data = await res.json();
      if (data.success) {
        setUser(data.data); // Update local session
        if (data.data.status === 'Approved') {
          router.push('/customer/dashboard');
        }
      }
    } catch (err) {
      console.error('Status check failed');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center shadow-2xl border-none p-4">
        <CardBody className="gap-6 py-10 px-8 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Image src="/logo.png" alt="WeLaund" width={140} height={42} className="mx-auto" />
          </div>
          
          <div className="space-y-2">
            <Chip color="warning" variant="flat" size="lg" className="font-bold uppercase tracking-wider">
              Pending Approval
            </Chip>
            <h2 className="text-xl font-bold text-gray-800">Account Under Review</h2>
          </div>

          <p className="text-default-500 text-sm leading-relaxed">
            Your account is waiting for approval from <strong className="text-gray-800">{user.shop_name}</strong>.<br/>
            Once a staff member approves your registration, you can start tracking your laundry!
          </p>

          <div className="flex flex-col w-full gap-3 mt-4">
            <Button 
              color="primary" 
              className="font-bold shadow-lg h-12" 
              startContent={<FiRefreshCw className={refreshing ? "animate-spin" : ""} />}
              onPress={checkStatus}
              isLoading={refreshing}
            >
              Refresh My Status
            </Button>
            
            <Button 
              variant="light" 
              color="danger" 
              className="font-bold" 
              startContent={<FiLogOut />}
              onPress={logout}
            >
              Logout Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
