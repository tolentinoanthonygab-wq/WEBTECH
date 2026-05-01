'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Spinner } from '@nextui-org/react';
import { FiPlus, FiTrash2, FiCheckCircle, FiShoppingCart, FiUser, FiPackage } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { fetchJson, readJson } from '@/lib/api';

interface Customer { id: string; first_name: string; last_name: string; }
interface Service  { id: string; service_name: string; unit: string; price_per_unit: number; }
interface OrderItem { service_id: string; name: string; weight: number; price: number; subtotal: number; }

const CARD = {
  background: 'rgba(10,20,50,0.72)', backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '1.25rem',
};

const inputCls = "w-full pb-2.5 pt-1 text-sm text-white placeholder-white/20 bg-transparent outline-none border-b border-white/15 focus:border-cyan-400 transition-colors duration-300";

export default function NewOrderPage() {
  const { user, loading: authLoading } = useRequireRole('staff');
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices]   = useState<Service[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedService, setSelectedService]   = useState('');
  const [weight, setWeight]       = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (user) {
      fetchJson('/api/staff/customers.php?type=approved')
        .then(res => setCustomers(res.data || []))
        .catch(error => console.error('Failed to fetch approved customers:', error));
      fetchJson('/api/staff/services.php')
        .then(res => setServices(res.data || []))
        .catch(error => console.error('Failed to fetch services:', error));
    }
  }, [user]);

  const addItem = () => {
    const service = services.find(s => s.id === selectedService);
    if (!service || !weight) return;
    const subtotal = parseFloat(weight) * service.price_per_unit;
    setOrderItems([...orderItems, { service_id: service.id, name: service.service_name, weight: parseFloat(weight), price: service.price_per_unit, subtotal }]);
    setWeight('');
  };

  const removeItem = (i: number) => setOrderItems(orderItems.filter((_, idx) => idx !== i));
  const total = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

  const placeOrder = async () => {
    if (!selectedCustomer || orderItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/staff/orders.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: selectedCustomer, items: orderItems }),
      });
      const data = await readJson(res);
      if (data.success) { alert(`Order Placed! Reference: ${data.order_ref}`); router.push('/staff/dashboard'); }
    } catch { alert('Order failed'); } finally { setLoading(false); }
  };

  if (authLoading) return null;

  const selectedSvc = services.find(s => s.id === selectedService);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">New Laundry Order</h1>
        <p className="text-white/40 text-sm mt-0.5">Fill in customer and service details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Inputs */}
        <div className="lg:col-span-1 space-y-4">

          {/* Customer */}
          <div style={CARD} className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-white/60 font-bold text-xs uppercase tracking-widest">
              <FiUser size={12} /> Customer
            </div>
            <div className="group">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Select Customer *</label>
              <div className="relative">
                <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}
                  className={inputCls + ' appearance-none cursor-pointer pr-4'}>
                  <option value="" className="bg-[#0a1432]">Choose approved customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#0a1432]">{c.first_name} {c.last_name}</option>
                  ))}
                </select>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Add Service */}
          <div style={CARD} className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-white/60 font-bold text-xs uppercase tracking-widest">
              <FiPackage size={12} /> Add Service
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Service Type</label>
              <div className="relative">
                <select value={selectedService} onChange={e => setSelectedService(e.target.value)}
                  className={inputCls + ' appearance-none cursor-pointer pr-4'}>
                  <option value="" className="bg-[#0a1432]">Choose service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0a1432]">{s.service_name} — ₱{s.price_per_unit}/{s.unit}</option>
                  ))}
                </select>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Weight / Quantity</label>
              <div className="relative">
                <input type="number" placeholder="e.g. 2.5" value={weight} onChange={e => setWeight(e.target.value)}
                  className={inputCls} />
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-focus-within:w-full transition-all duration-500" />
              </div>
            </div>

            {selectedSvc && weight && (
              <div className="rounded-xl px-4 py-3 flex justify-between items-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="text-xs font-bold text-emerald-400">Subtotal</span>
                <span className="font-black text-emerald-300">₱{(parseFloat(weight) * selectedSvc.price_per_unit).toFixed(2)}</span>
              </div>
            )}

            <button onClick={addItem} disabled={!selectedService || !weight}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)' }}>
              <FiPlus size={14} /> Add to Order
            </button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-2 flex flex-col" style={{ ...CARD, minHeight: '300px' }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8 text-white/60 font-bold text-xs uppercase tracking-widest">
            <FiShoppingCart size={12} /> Order Summary
          </div>

          <div className="flex-1 overflow-auto">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-3">
                <FiShoppingCart size={36} />
                <p className="text-sm font-medium">No services added yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-bold text-white text-sm">{item.name}</p>
                      <p className="text-xs text-white/40">{item.weight} kg × ₱{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-emerald-400">₱{item.subtotal.toFixed(2)}</span>
                      <button onClick={() => removeItem(i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total + CTA */}
          <div className="border-t border-white/8 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white/40">Estimated Total</span>
              <span className="text-3xl font-black text-white">₱{total.toFixed(2)}</span>
            </div>
            <button onClick={placeOrder} disabled={orderItems.length === 0 || !selectedCustomer || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-white disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(90deg,#00aeef,#6366f1,#8e66ff)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              {loading ? <Spinner size="sm" color="white" /> : <><FiCheckCircle size={15} /> Confirm &amp; Place Order</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
