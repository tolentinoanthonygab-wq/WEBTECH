'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Input
} from '@nextui-org/react';
import { FiRefreshCw, FiSearch, FiDollarSign } from 'react-icons/fi';

interface Payment {
  id: string;
  amount_paid: number;
  payment_method: string;
  status: string;
  created_on: string;
  order_ref: string;
  first_name: string;
  last_name: string;
  shop_name: string;
}

export default function SuperAdminPaymentsPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super_admin/payments.php');
      const data = await res.json();
      if (data.success) setPayments(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const toggleStatus = async (id: string, current: string) => {
    setUpdating(id);
    const next = current === 'Verified' ? 'Pending' : 'Verified';
    try {
      const res = await fetch('/api/super_admin/payments.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (data.success) fetchPayments();
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  useEffect(() => { if (user) fetchPayments(); }, [user]);

  if (authLoading || !user) return null;

  const filtered = payments.filter(p =>
    `${p.order_ref} ${p.first_name} ${p.last_name} ${p.shop_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FiDollarSign className="text-primary" /> Global Payments
          </h1>
          <p className="text-default-500 font-medium">Financial oversight across the platform</p>
        </div>
        <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchPayments} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <Input
        placeholder="Search by reference, customer, or shop..."
        variant="bordered"
        className="max-w-md"
        startContent={<FiSearch className="text-default-400" />}
        value={search}
        onValueChange={setSearch}
      />

      {loading ? (
        <div className="flex justify-center p-20"><Spinner size="lg" /></div>
      ) : (
        <Table aria-label="Global Payments Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>REFERENCE</TableColumn>
            <TableColumn>SHOP</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>METHOD</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn align="center">ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No payments found.">
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="text-xs text-default-400">
                    {new Date(p.created_on).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono font-bold text-primary">{p.order_ref}</TableCell>
                <TableCell>
                    <span className="bg-default-100 text-default-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {p.shop_name}
                    </span>
                </TableCell>
                <TableCell className="text-sm">{p.first_name} {p.last_name}</TableCell>
                <TableCell>
                    <Chip size="sm" variant="flat" color={p.payment_method === 'GCash' ? 'primary' : 'default'}>
                        {p.payment_method}
                    </Chip>
                </TableCell>
                <TableCell className="font-black text-success text-lg">
                    ₱{parseFloat(p.amount_paid as any).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      color={p.status === 'Verified' ? 'default' : 'success'}
                      variant="flat"
                      className="font-bold"
                      isLoading={updating === p.id}
                      onPress={() => toggleStatus(p.id, p.status)}
                    >
                      {p.status === 'Verified' ? 'Unverify' : 'Verify'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
