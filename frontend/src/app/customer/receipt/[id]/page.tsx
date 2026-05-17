'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardBody, CardHeader, Divider, Chip, Spinner, Button } from '@nextui-org/react';
import { FiPrinter, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ReceiptPage() {
  const { id } = useParams();
  const router  = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user && id) {
      fetch(`/api/staff/order_details.php?id=${id}`)
        .then(res => res.json())
        .then(res => {
          if (res.success) setOrder(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, authLoading, id]);

  if (authLoading || !user) return null;

  if (loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="shadow-2xl border-t-8 border-primary">
        <CardHeader className="flex flex-col items-center py-8">
          <h1 className="text-3xl font-black text-primary italic">WashWise</h1>
          <p className="text-default-500 text-sm font-bold tracking-widest uppercase mt-1">{user.shop_name}</p>
          <div className="mt-4 flex flex-col items-center">
            <h2 className="text-xl font-bold">OFFICIAL RECEIPT</h2>
            <p className="text-xs text-default-400 mt-1">Ref: {order.order_ref}</p>
          </div>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="p-8">
          <div className="flex justify-between mb-8">
            <div className="space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase">Customer</p>
              <p className="font-bold">{order.first_name} {order.last_name}</p>
              <p className="text-xs text-default-500">{order.contact_number}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase">Date</p>
              <p className="font-bold">{new Date(order.created_on).toLocaleDateString()}</p>
              <Chip size="sm" color={order.payment_status === 'Paid' ? 'success' : 'danger'} variant="flat">
                {order.payment_status.toUpperCase()}
              </Chip>
            </div>
          </div>

          <TableSimple 
            headers={['Service', 'Qty/Weight', 'Price']}
            rows={order.items.map((it: any) => [
                it.service_name,
                `${it.quantity_or_weight} ${it.unit === 'per_kg' ? 'kg' : 'pcs'}`,
                `₱${parseFloat(it.subtotal).toLocaleString()}`
            ])}
          />

          <div className="mt-8 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-bold">₱{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee</span>
              <span className="font-bold">₱0.00</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-xl font-black text-primary">
              <span>TOTAL</span>
              <span>₱{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className={`flex items-center justify-center gap-2 font-bold mb-1 ${order.payment_status === 'Paid' ? 'text-success' : 'text-warning'}`}>
              {order.payment_status === 'Paid' ? <FiCheckCircle /> : <FiAlertCircle />}
              <span>{order.payment_status === 'Paid' ? 'Payment Verified' : 'Payment Pending'}</span>
            </div>
            <p className="text-[10px] text-default-400">Thank you for choosing WashWise!</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-4 mt-8 no-print">
        <Button className="flex-1" variant="flat" startContent={<FiArrowLeft />} onPress={() => router.back()}>Back</Button>
        <Button className="flex-1" color="primary" startContent={<FiPrinter />} onPress={() => window.print()}>Print Receipt</Button>
      </div>
    </div>
  );
}

function TableSimple({ headers, rows }: { headers: string[], rows: string[][] }) {
    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                    {headers.map(h => <th key={h} className="text-left py-2 font-bold text-default-400 uppercase text-[10px]">{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i} className="border-b border-default-50">
                        {r.map((c, j) => <td key={j} className="py-3 font-medium">{c}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
