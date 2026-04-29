'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, Button, Chip, Spinner } from '@nextui-org/react';
import { FiPlus, FiClock, FiDollarSign, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

interface StaffStats {
  daily_total: number;
  active_orders: number;
  pending_approvals: number;
  recent_orders: any[];
}

export default function StaffDashboard() {
  const { user, loading: authLoading } = useRequireRole('staff');
  const [data, setData] = useState<StaffStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/staff/stats.php')
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setData(res.data);
          } else {
            console.error('Stats fetch failed:', res.message);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Network error:', err);
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hello, {user.first_name}!</h1>
          <p className="text-default-500 font-medium">Manage {user.shop_name} operations</p>
        </div>
        <Link href="/staff/orders/new">
          <Button color="primary" size="lg" startContent={<FiPlus />} className="font-bold">
            New Order
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-success to-success-600 text-white border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Daily Collection</p>
                <h2 className="text-3xl font-extrabold mt-1">₱{data?.daily_total.toLocaleString() || '0'}</h2>
              </div>
              <FiDollarSign size={24} className="opacity-40" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-primary-600 text-white border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Ongoing Orders</p>
                <h2 className="text-3xl font-extrabold mt-1">{data?.active_orders || 0}</h2>
              </div>
              <FiClock size={24} className="opacity-40" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-warning to-warning-600 text-white border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Pending Registrations</p>
                <h2 className="text-3xl font-extrabold mt-1">{data?.pending_approvals || 0}</h2>
              </div>
              <FiUsers size={24} className="opacity-40" />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Ongoing Orders</h3>
              <Button size="sm" variant="light" color="primary">View All</Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-8"><Spinner /></div>
            ) : data?.recent_orders.length === 0 ? (
              <p className="text-center text-default-400 py-10">No ongoing orders at the moment.</p>
            ) : (
              <div className="space-y-3">
                {data?.recent_orders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-default-50 border border-default-100 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {order.first_name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{order.order_ref}</p>
                        <p className="text-xs text-default-500">{order.first_name} {order.last_name}</p>
                      </div>
                    </div>
                    <Chip size="sm" color={order.order_status === 'Requested' ? 'danger' : 'warning'} variant="flat" className="font-bold">
                      {order.order_status === 'Requested' ? 'NEW REQUEST' : 'IN PROGRESS'}
                    </Chip>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card className="border-none bg-primary/10">
            <CardBody className="p-6">
              <h4 className="font-bold mb-2">Quick Tip</h4>
              <p className="text-sm text-primary-600">Don't forget to weigh items before starting an order to ensure accurate pricing.</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="p-6">
              <h4 className="font-bold mb-4">Customer Support</h4>
              <div className="space-y-2">
                <Button fullWidth variant="flat" size="sm">System Logs</Button>
                <Button fullWidth variant="flat" size="sm">Help Center</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
