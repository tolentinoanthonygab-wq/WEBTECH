'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Select, SelectItem, Input, Spinner } from '@nextui-org/react';
import { FiPlus, FiTrash2, FiCheckCircle, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Customer { id: string; first_name: string; last_name: string; }
interface Service  { id: string; service_name: string; unit: string; price_per_unit: number; }
interface OrderItem { service_id: string; name: string; weight: number; price: number; subtotal: number; }

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
      fetch('/api/staff/customers.php?type=approved').then(r => r.json()).then(res => setCustomers(res.data || []));
      fetch('/api/staff/services.php').then(r => r.json()).then(res => setServices(res.data || []));
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: selectedCustomer, items: orderItems }),
      });
      const data = await res.json();
      if (data.success) { alert(`Order Placed! Reference: ${data.order_ref}`); router.push('/staff/dashboard'); }
    } catch { alert('Order failed'); }
    finally { setLoading(false); }
  };

  if (authLoading) return null;

  const selectedSvc = services.find(s => s.id === selectedService);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Laundry Order</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fill in customer and service details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inputs */}
        <div className="lg:col-span-1 space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <FiSearch size={15} /> Customer
            </div>
            <Select
              label="Select Approved Customer"
              variant="bordered"
              size="sm"
              selectedKeys={selectedCustomer ? [selectedCustomer] : []}
              onSelectionChange={(k) => setSelectedCustomer(Array.from(k)[0] as string)}
              classNames={{ trigger: 'rounded-xl' }}
            >
              {customers.map(c => (
                <SelectItem key={c.id} textValue={`${c.first_name} ${c.last_name}`}>
                  {c.first_name} {c.last_name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Add Service */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 space-y-4">
            <p className="font-semibold text-sm text-slate-700">Add Service</p>
            <Select
              label="Service Type"
              variant="bordered"
              size="sm"
              selectedKeys={selectedService ? [selectedService] : []}
              onSelectionChange={(k) => setSelectedService(Array.from(k)[0] as string)}
              classNames={{ trigger: 'rounded-xl' }}
            >
              {services.map(s => (
                <SelectItem key={s.id} textValue={s.service_name}>
                  {s.service_name} — ₱{s.price_per_unit}/{s.unit}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Weight / Quantity"
              type="number"
              variant="bordered"
              size="sm"
              value={weight}
              onValueChange={setWeight}
              classNames={{ inputWrapper: 'rounded-xl' }}
            />
            {selectedSvc && weight && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-600">Subtotal</span>
                <span className="font-bold text-emerald-700">₱{(parseFloat(weight) * selectedSvc.price_per_unit).toFixed(2)}</span>
              </div>
            )}
            <button
              onClick={addItem}
              disabled={!selectedService || !weight}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <FiPlus /> Add to Order
            </button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-card flex flex-col">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 text-slate-700 font-semibold text-sm">
            <FiShoppingCart size={15} /> Order Summary
          </div>

          <div className="flex-1 overflow-auto">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
                <FiShoppingCart size={36} />
                <p className="text-sm font-medium">No services added yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Service</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Qty/Wt</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Subtotal</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orderItems.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500">{item.weight} kg</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">₱{item.subtotal.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Total + CTA */}
          <div className="border-t border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-500">Estimated Total</span>
              <span className="text-3xl font-black text-slate-900">₱{total.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={orderItems.length === 0 || !selectedCustomer || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-md shadow-emerald-100 transition-all text-sm"
            >
              {loading ? <Spinner size="sm" color="white" /> : <><FiCheckCircle /> Confirm &amp; Place Order</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
