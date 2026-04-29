'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Card, CardBody, Spinner, Button } from '@nextui-org/react';
import { FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

export default function CustomerOrdersPage() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/customer/dashboard.php')
        .then(res => res.json())
        .then(res => {
          if (res.success) setOrders(res.data.orders);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-default-500">Track all your laundry transactions at {user?.shop_name}</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Order history table" removeWrapper>
            <TableHeader>
              <TableColumn>REFERENCE</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>PAYMENT</TableColumn>
              <TableColumn align="center">STATUS</TableColumn>
              <TableColumn align="center">RECEIPT</TableColumn>
            </TableHeader>
            <TableBody emptyContent={loading ? <Spinner /> : "No orders found."}>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-bold text-primary">{o.order_ref}</TableCell>
                  <TableCell>{new Date(o.created_on).toLocaleDateString()}</TableCell>
                  <TableCell className="font-bold">₱{parseFloat(o.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={o.payment_status === 'Paid' ? 'success' : 'warning'} variant="flat">
                      {o.payment_status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Chip color={o.order_status === 'Done' ? 'success' : o.order_status === 'Ongoing' ? 'warning' : o.order_status === 'Requested' ? 'default' : 'danger'} variant="dot">
                        {o.order_status}
                      </Chip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {o.order_status === 'Done' ? (
                        <Link href={`/customer/receipt/${o.id}`}>
                          <Button size="sm" variant="flat" color="primary" startContent={<FiExternalLink size={14} />}>
                            View Receipt
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-default-400">—</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
