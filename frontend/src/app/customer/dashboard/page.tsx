'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Spinner } from '@nextui-org/react';
import { FiPackage, FiMapPin, FiPhone, FiShoppingBag, FiArrowRight, FiPlus, FiClock, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/customer/dashboard.php')
        .then(res => res.json())
        .then(res => { if (res.success) setData(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const requestedOrders = data?.orders?.filter((o: any) => o.order_status === 'Requested') || [];
  const ongoingOrders   = data?.orders?.filter((o: any) => o.order_status === 'Ongoing') || [];
  const activeOrders    = data?.orders?.filter((o: any) => ['Requested', 'Ongoing'].includes(o.order_status)) || [];
  const pastOrders      = data?.orders?.filter((o: any) => !['Requested', 'Ongoing'].includes(o.order_status)).slice(0, 3) || [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {user.first_name}! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Tracking your laundry at {user.shop_name}</p>
        </div>
        <Link href="/customer/request">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 transition-all">
            <FiPlus size={14} /> Request Laundry
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left: Orders */}
        <div className="lg:col-span-2 space-y-6">

          {/* Status Banner */}
          {ongoingOrders.length > 0 && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
              <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold text-emerald-800 text-sm">Your laundry has been accepted!</p>
                <p className="text-emerald-700 text-xs mt-0.5">Bring your clothes to <strong>{user.shop_name}</strong> and show your order reference at the counter.</p>
              </div>
            </div>
          )}
          {requestedOrders.length > 0 && ongoingOrders.length === 0 && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
              <FiClock className="text-amber-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold text-amber-800 text-sm">Request pending approval</p>
                <p className="text-amber-700 text-xs mt-0.5">Waiting for staff at <strong>{user.shop_name}</strong> to accept your request.</p>
              </div>
            </div>
          )}

          {/* Active Orders */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <FiPackage size={15} className="text-blue-500" />
              <h3 className="font-semibold text-slate-800 text-sm">Ongoing Laundry</h3>
            </div>

            {loading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : activeOrders.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-slate-300">
                <FiShoppingBag size={32} />
                <p className="text-sm font-medium">No active orders</p>
                <p className="text-xs">Your fresh laundry is just one request away!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {activeOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        order.order_status === 'Ongoing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.order_ref}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {order.order_status === 'Ongoing' ? 'Ongoing Order' : 'Awaiting Acceptance'}
                        </p>
                        <p className="font-bold text-slate-800">₱{parseFloat(order.total_amount || '0').toFixed(2)}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      order.order_status === 'Ongoing' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {order.order_status === 'Ongoing' ? 'IN PROGRESS' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Recent History</h3>
              <Link href="/customer/orders" className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
                View All <FiArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {pastOrders.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-sm">No past orders yet.</p>
              ) : pastOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-sm text-slate-800">{order.order_ref}</p>
                    <p className="text-xs text-slate-400">{new Date(order.created_on).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.order_status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {order.order_status}
                    </span>
                    {order.order_status === 'Done' && (
                      <Link href={`/customer/receipt/${order.id}`}>
                        <button className="text-xs text-blue-600 font-semibold hover:underline">Receipt</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Shop Info */}
        <div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 space-y-5">
            <h3 className="font-bold text-base">My Shop</h3>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg shrink-0"><FiMapPin size={14} /></div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Location</p>
                <p className="font-bold text-sm mt-0.5">{user.shop_name}</p>
                <p className="text-xs opacity-70 mt-0.5">{data?.shop?.address || data?.profile?.shop_address || 'Main Branch'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg shrink-0"><FiPhone size={14} /></div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Contact</p>
                <p className="font-bold text-sm mt-0.5">{data?.shop?.contact_number || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <p className="text-xs opacity-50 italic">"We take care of your clothes like our own."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
