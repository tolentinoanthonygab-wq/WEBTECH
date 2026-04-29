'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, Skeleton, Button } from '@nextui-org/react';
import { FiTrendingUp, FiUsers, FiSettings, FiPackage, FiBarChart2 } from 'react-icons/fi';

interface OwnerStats {
  monthly: any[];
  yearly: any[];
  stats: {
    total_staff: number;
    total_services: number;
  };
}

export default function OwnerDashboard() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [data, setData] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/owner/stats.php')
        .then(res => res.json())
        .then(res => {
          if (res.success) setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-900">Hello, {user.first_name}!</h1>
          <p className="text-default-500 font-medium">Business Dashboard — {user.shop_name}</p>
        </div>
        <div className="flex gap-2">
          <Button startContent={<FiSettings />} variant="flat">Shop Settings</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary text-primary-foreground">
          <CardBody className="p-6">
            <p className="text-xs font-bold uppercase opacity-80">Monthly Income</p>
            <h2 className="text-2xl font-bold mt-1">
              ₱{data?.monthly[0]?.total.toLocaleString() || '0'}
            </h2>
            <div className="flex items-center gap-1 mt-2 text-xs opacity-90">
              <FiTrendingUp /> <span>+12.5% from last month</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-secondary/10 text-secondary text-xl">
              <FiUsers />
            </div>
            <div>
              <p className="text-xs font-bold text-default-500 uppercase">Total Staff</p>
              <h2 className="text-2xl font-bold">{data?.stats.total_staff || 0}</h2>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary text-xl">
              <FiUsers />
            </div>
            <div>
              <p className="text-xs font-bold text-default-500 uppercase">Total Customers</p>
              <h2 className="text-2xl font-bold">{data?.stats.total_customers || 0}</h2>
              <p className="text-xs text-default-400 mt-0.5">{data?.stats.pending_customers || 0} pending</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-warning/10 text-warning text-xl">
              <FiPackage />
            </div>
            <div>
              <p className="text-xs font-bold text-default-500 uppercase">Active Services</p>
              <h2 className="text-2xl font-bold">{data?.stats.total_services || 0}</h2>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-success/10 text-success text-xl">
              <FiBarChart2 />
            </div>
            <div>
              <p className="text-xs font-bold text-default-500 uppercase">Yearly Total</p>
              <h2 className="text-2xl font-bold">₱{data?.yearly[0]?.total.toLocaleString() || '0'}</h2>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold mb-4">Income History (Monthly)</h3>
            <div className="h-[250px] w-full flex items-end gap-2 px-4 pb-4 overflow-x-auto">
              {data?.monthly && data.monthly.length > 0 ? (
                data.monthly.slice(0, 12).reverse().map((m, i) => {
                    const max = Math.max(...data.monthly.map(x => x.total), 1);
                    const height = (m.total / max) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-[40px]">
                            <div 
                                className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-600 cursor-pointer relative group"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ₱{parseFloat(m.total).toLocaleString()}
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-default-400 uppercase">
                                {new Date(2000, m.month - 1).toLocaleString('default', { month: 'short' })}
                            </span>
                        </div>
                    );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-default-400 italic">
                    No income data available.
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <h3 className="text-lg font-bold mb-4">Recent Staff Activity</h3>
            <div className="space-y-4">
              <p className="text-sm text-default-500 italic text-center py-8">No recent activity to show.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
