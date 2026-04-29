'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, CardHeader, Chip, Divider, Spinner, Button } from '@nextui-org/react';
import { FiPackage, FiMapPin, FiPhone, FiShoppingBag, FiArrowRight, FiPlus, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/customer/dashboard.php')
        .then(res => res.json())
        .then(res => {
          if (res.success) setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const requestedOrders = data?.orders?.filter((o: any) => o.order_status === 'Requested') || [];
  const ongoingOrders   = data?.orders?.filter((o: any) => o.order_status === 'Ongoing') || [];
  const activeOrders    = data?.orders?.filter((o: any) => ['Requested','Ongoing'].includes(o.order_status)) || [];
  const pastOrders      = data?.orders?.filter((o: any) => !['Requested','Ongoing'].includes(o.order_status)).slice(0, 3) || [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900">Hello, {user.first_name}!</h1>
        <p className="text-default-500 font-medium">Tracking your laundry at {user.shop_name}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Ongoing Orders */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><FiPackage className="text-primary" /> Ongoing Laundry</h3>
              <Link href="/customer/request">
                <Button color="primary" variant="flat" size="sm" startContent={<FiPlus />} className="font-bold">Request Laundry</Button>
              </Link>
            </div>
            
            {/* Notification Banner */}
            {ongoingOrders.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-4">
                <span className="text-green-500 text-xl mt-0.5">✅</span>
                <div>
                  <p className="font-bold text-green-800">Your laundry has been accepted!</p>
                  <p className="text-green-700 text-sm">You can now bring your clothes to <strong>{user.shop_name}</strong>. Show your order reference at the counter.</p>
                </div>
              </div>
            )}
            {requestedOrders.length > 0 && ongoingOrders.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-4">
                <span className="text-amber-500 text-xl mt-0.5">⏳</span>
                <div>
                  <p className="font-bold text-amber-800">Request pending approval</p>
                  <p className="text-amber-700 text-sm">Your laundry request has been sent. Please wait for staff at <strong>{user.shop_name}</strong> to accept it.</p>
                </div>
              </div>
            )}

            {loading ? <Spinner /> : activeOrders.length === 0 ? (
              <Card className="bg-default-50 border-none">
                <CardBody className="py-12 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-default-300 shadow-sm">
                    <FiShoppingBag size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-default-700">No active orders</p>
                    <p className="text-sm text-default-500">Your fresh laundry is just one visit away!</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order: any) => (
                  <Card key={order.id} className="border-none shadow-md overflow-hidden">
                    <div className={`h-1.5 w-full ${order.order_status === 'Ongoing' ? 'bg-primary' : 'bg-amber-400'}`} />
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl font-bold text-sm ${order.order_status === 'Ongoing' ? 'bg-primary/10 text-primary' : 'bg-amber-50 text-amber-600'}`}>
                          {order.order_ref}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-default-400 uppercase tracking-widest">{order.order_status === 'Ongoing' ? 'Ongoing Order' : 'Awaiting Acceptance'}</p>
                          <p className="font-bold text-lg">₱{parseFloat(order.total_amount || '0').toFixed(2)}</p>
                        </div>
                      </div>
                      <Chip color={order.order_status === 'Ongoing' ? 'warning' : 'default'} variant="shadow" className="font-bold">
                        {order.order_status === 'Ongoing' ? 'IN PROGRESS' : 'PENDING'}
                      </Chip>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4 mt-8">
              <h3 className="text-xl font-bold flex items-center gap-2">Recent History</h3>
              <Link href="/customer/orders">
                <Button variant="light" color="primary" endContent={<FiArrowRight />}>View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {pastOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-default-100">
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-sm">{order.order_ref}</p>
                    <p className="text-xs text-default-400">{new Date(order.created_on).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip size="sm" color={order.order_status === 'Done' ? 'success' : 'danger'} variant="flat" className="font-bold">{order.order_status}</Chip>
                    {order.order_status === 'Done' && (
                      <Link href={`/customer/receipt/${order.id}`}>
                        <Button size="sm" variant="light" color="primary" className="font-bold min-w-unit-0 px-2 h-8">
                          Receipt
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Shop Info */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl">
            <CardHeader className="px-6 pt-6">
              <h3 className="font-bold text-lg">My Shop</h3>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg"><FiMapPin /></div>
                <div>
                  <p className="text-xs font-bold uppercase opacity-60">Location</p>
                  <p className="font-bold text-sm leading-tight">{user.shop_name}</p>
                  <p className="text-xs opacity-80 mt-1">{data?.profile?.shop_address || 'Main Branch'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg"><FiPhone /></div>
                <div>
                  <p className="text-xs font-bold uppercase opacity-60">Contact</p>
                  <p className="font-bold text-sm">0917-XXX-XXXX</p>
                </div>
              </div>
              <Divider className="bg-white/20" />
              <div className="pt-2">
                <p className="text-xs opacity-60 mb-2 italic">"We take care of your clothes like our own."</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
