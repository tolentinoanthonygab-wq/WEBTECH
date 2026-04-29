'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, Skeleton } from '@nextui-org/react';
import { 
  FiShoppingBag, FiUsers, FiBriefcase, FiDollarSign, 
  FiClock, FiCheckCircle 
} from 'react-icons/fi';

interface Stats {
  total_shops: number;
  active_shops: number;
  total_owners: number;
  total_staff: number;
  total_customers: number;
  pending_customers: number;
  total_orders: number;
  total_revenue: number;
  overdue_orders: number;
}

export default function SuperAdminDashboard() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/super_admin/stats.php')
        .then(res => res.json())
        .then(res => {
          if (res.success) setStats(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const statCards = [
    { title: 'Total Revenue', value: `₱${stats?.total_revenue.toLocaleString()}`, icon: <FiDollarSign className="text-success" />, color: 'success' },
    { title: 'Total Shops', value: stats?.total_shops, icon: <FiShoppingBag className="text-primary" />, color: 'primary' },
    { title: 'Active Owners', value: stats?.total_owners, icon: <FiUsers className="text-secondary" />, color: 'secondary' },
    { title: 'Total Staff', value: stats?.total_staff, icon: <FiBriefcase className="text-warning" />, color: 'warning' },
    { title: 'Total Customers', value: stats?.total_customers, icon: <FiUsers className="text-info" />, color: 'info' },
    { title: 'Pending Approvals', value: stats?.pending_customers, icon: <FiClock className="text-danger" />, color: 'danger' },
    { title: 'Overdue Orders', value: stats?.overdue_orders, icon: <FiClock className="text-warning" />, color: 'warning' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-default-500">Welcome back, Super Admin {user.user_name}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="h-32">
              <CardBody className="flex flex-row items-center gap-4">
                <Skeleton className="rounded-full w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-1/2 rounded-lg" />
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          statCards.map((stat, i) => (
            <Card key={i} className="hover:scale-[1.02] transition-transform cursor-default">
              <CardBody className="flex flex-row items-center gap-6 p-6">
                <div className={`p-4 rounded-2xl bg-${stat.color}/10 text-2xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-default-500 font-medium uppercase tracking-wider">{stat.title}</p>
                  <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Card isPressable className="flex-1 p-4 border-none bg-primary/10 text-primary hover:bg-primary/20">
            <CardBody className="text-center font-bold">Manage Shops</CardBody>
          </Card>
          <Card isPressable className="flex-1 p-4 border-none bg-secondary/10 text-secondary hover:bg-secondary/20">
            <CardBody className="text-center font-bold">Manage Owners</CardBody>
          </Card>
          <Card isPressable className="flex-1 p-4 border-none bg-warning/10 text-warning hover:bg-warning/20">
            <CardBody className="text-center font-bold">System Logs</CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
