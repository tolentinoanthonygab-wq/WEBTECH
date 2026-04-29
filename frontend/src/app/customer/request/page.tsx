'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, CardHeader, Divider, Chip, Button, Spinner } from '@nextui-org/react';
import { FiSend, FiCheckCircle, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  service_name: string;
  unit: string;
  price_per_unit: number;
  category: string;
}

export default function CustomerRequestPage() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const router = useRouter();
  const [services, setServices]     = useState<Service[]>([]);
  const [loading, setLoading]       = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Manual'>('GCash');
  const [orderType, setOrderType]   = useState<'Pickup' | 'Delivery'>('Pickup');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]             = useState(false);
  const [refCode, setRefCode]       = useState('');
  const [estServiceId, setEstServiceId] = useState<string>('');
  const [estQty, setEstQty] = useState<string>('');
  const [estType, setEstType] = useState<string>('Colored');

  useEffect(() => {
    if (user) {
      fetch('/api/customer/request_order.php')
        .then(r => r.json())
        .then(res => { if (res.success) setServices(res.data); })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const selectedService = services.find(s => s.id === estServiceId);
      const notes = selectedService 
        ? `Estimate: ${estQty} ${selectedService.unit === 'per_kg' ? 'kg' : 'pcs'} of ${selectedService.service_name} (${estType})`
        : `Estimate: ${estQty} ${estType}`;

      const res  = await fetch('/api/customer/request_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: orderType, 
          payment_method: paymentMethod,
          notes: notes
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRefCode(data.ref);
        setSent(true);
      } else {
        alert(data.message || 'Failed to send request');
      }
    } catch { alert('Network error'); }
    finally { setSubmitting(false); }
  };

  const grouped = services.reduce((acc: Record<string, Service[]>, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  if (authLoading || loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center shadow-2xl border-none rounded-3xl overflow-hidden">
          <div className="bg-green-500 h-2 w-full" />
          <CardBody className="gap-6 py-12 px-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <FiCheckCircle className="text-green-500 text-4xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-green-800">Request Sent!</h2>
              <p className="text-default-500 mt-2 text-sm">Your laundry request has been submitted. Please wait for staff at <strong>{user?.shop_name}</strong> to accept it.</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Your Reference Code</p>
              <p className="font-black text-green-900 text-xl font-mono mt-1">{refCode}</p>
            </div>
            <p className="text-xs text-default-400 italic">You'll be notified on your dashboard once the staff accepts your request.</p>
            <Button color="primary" className="font-bold h-12" onPress={() => router.push('/customer/dashboard')}>
              Back to Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900">Request Laundry</h1>
        <p className="text-default-500 font-medium mt-1">Choose your preferences and submit your request to <strong>{user?.shop_name}</strong></p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
          {/* Order Type */}
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="px-6 py-4"><p className="font-bold">Pickup / Delivery</p></CardHeader>
            <Divider />
            <CardBody className="p-6 flex gap-3">
              {(['Pickup', 'Delivery'] as const).map(t => (
                <Button
                  key={t}
                  color={orderType === t ? 'primary' : 'default'}
                  variant={orderType === t ? 'solid' : 'bordered'}
                  className="flex-1 font-bold h-14"
                  onPress={() => setOrderType(t)}
                >
                  {t}
                </Button>
              ))}
            </CardBody>
          </Card>

          {/* Payment Method */}
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="px-6 py-4"><p className="font-bold">Payment Method</p></CardHeader>
            <Divider />
            <CardBody className="p-6 flex gap-3">
              <Button
                color={paymentMethod === 'GCash' ? 'success' : 'default'}
                variant={paymentMethod === 'GCash' ? 'solid' : 'bordered'}
                className="flex-1 font-bold h-14 text-white"
                startContent={<FiSmartphone />}
                onPress={() => setPaymentMethod('GCash')}
              >
                GCash
              </Button>
              <Button
                color={paymentMethod === 'Manual' ? 'warning' : 'default'}
                variant={paymentMethod === 'Manual' ? 'solid' : 'bordered'}
                className="flex-1 font-bold h-14"
                startContent={<FiDollarSign />}
                onPress={() => setPaymentMethod('Manual')}
              >
                Cash
              </Button>
            </CardBody>
          </Card>

          {/* Estimation Calculator */}
          <Card className="border-none shadow-sm rounded-2xl bg-blue-900 text-white overflow-hidden">
            <CardHeader className="px-6 py-4 flex flex-col items-start gap-1">
                <p className="font-bold text-lg">Estimation Calculator</p>
                <p className="text-xs opacity-70">Assumed price based on your estimate</p>
            </CardHeader>
            <CardBody className="p-6 space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">1. Select Service (Price/Unit)</p>
                        <select 
                            className="w-full bg-blue-800 border-none rounded-xl h-12 px-4 text-sm font-bold focus:ring-2 ring-blue-400 outline-none appearance-none"
                            value={estServiceId}
                            onChange={(e) => setEstServiceId(e.target.value)}
                        >
                            <option value="">-- Choose a Service --</option>
                            {services
                                .filter(s => !estType || s.category === estType || (!s.category && estType === 'Colored'))
                                .map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.service_name} (₱{parseFloat(s.price_per_unit.toString()).toFixed(2)}/{s.unit === 'per_kg' ? 'kg' : 'pc'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">2. Laundry Type</p>
                        <div className="grid grid-cols-3 gap-2">
                            {['White', 'Colored', 'Blanket'].map(t => (
                                <button
                                    key={t}
                                    className={`h-10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                        estType === t ? 'bg-white text-blue-900' : 'bg-blue-800 text-blue-300 hover:bg-blue-700'
                                    }`}
                                    onClick={() => setEstType(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">3. Estimated Weight / Qty ({estType})</p>
                        <input 
                            type="number"
                            placeholder={estType === 'Blanket' ? 'e.g. 2 pieces' : 'e.g. 5 kg'}
                            className="w-full bg-blue-800 border-none rounded-xl h-12 px-4 text-sm font-bold focus:ring-2 ring-blue-400 outline-none"
                            value={estQty}
                            onChange={(e) => setEstQty(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-blue-800 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimated Total</p>
                        <p className="text-3xl font-black">
                            ₱{(() => {
                                const s = services.find(x => x.id === estServiceId);
                                const q = parseFloat(estQty) || 0;
                                return s ? (s.price_per_unit * q).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00';
                            })()}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-800 rounded-2xl">
                        <FiDollarSign className="text-2xl text-blue-300" />
                    </div>
                </div>
            </CardBody>
          </Card>

          {/* Submit */}
          <Card className="border-none shadow-sm rounded-2xl bg-blue-50 border border-blue-100">
            <CardBody className="p-6 space-y-4">
              <p className="text-sm text-blue-700 font-bold">
                ℹ️ Actual weight and pricing will be calculated by staff when you bring your clothes. You're just sending a heads-up!
              </p>
              <Button
                color="primary"
                size="lg"
                fullWidth
                className="font-bold h-14 shadow-xl shadow-primary/20"
                startContent={<FiSend />}
                isLoading={submitting}
                onPress={handleSubmit}
              >
                Submit Laundry Request
              </Button>
            </CardBody>
          </Card>
      </div>
    </div>
  );
}

