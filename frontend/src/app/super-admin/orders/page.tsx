'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Input, Select, SelectItem
} from '@nextui-org/react';
import { FiRefreshCw, FiSearch, FiShoppingBag } from 'react-icons/fi';

interface Order {
  id: string;
  order_ref: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  created_on: string;
  first_name: string;
  last_name: string;
  shop_name: string;
}

const statusColor: Record<string, 'danger' | 'warning' | 'success' | 'default'> = {
  Requested: 'danger', Ongoing: 'warning', Done: 'success', Cancelled: 'default',
};

export default function SuperAdminOrdersPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showOverdue, setShowOverdue] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super_admin/orders.php');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/super_admin/orders.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) fetchOrders();
      else alert(data.message);
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  if (authLoading || !user) return null;

  const filtered = orders.filter(o => {
    const matchesSearch = `${o.order_ref} ${o.first_name} ${o.last_name} ${o.shop_name}`.toLowerCase().includes(search.toLowerCase());
    if (showOverdue) {
        const createdDate = new Date(o.created_on);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const isOverdue = createdDate < threeDaysAgo && !['Done', 'Cancelled'].includes(o.order_status);
        return matchesSearch && isOverdue;
    }
    return matchesSearch;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FiShoppingBag className="text-primary" /> Global Orders
          </h1>
          <p className="text-default-500 font-medium">Oversight of all laundry transactions</p>
        </div>
        <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchOrders} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <div className="flex justify-between items-center gap-4">
        <Input
            placeholder="Search by reference, customer, or shop..."
            variant="bordered"
            className="max-w-md"
            startContent={<FiSearch className="text-default-400" />}
            value={search}
            onValueChange={setSearch}
        />
        <Button 
            color={showOverdue ? "danger" : "default"} 
            variant={showOverdue ? "solid" : "flat"}
            className="font-bold"
            onPress={() => setShowOverdue(!showOverdue)}
        >
            {showOverdue ? "Showing Overdue" : "Show Overdue Only"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Spinner size="lg" /></div>
      ) : (
        <Table aria-label="Global Orders Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>REFERENCE</TableColumn>
            <TableColumn>SHOP</TableColumn>
            <TableColumn>CUSTOMER</TableColumn>
            <TableColumn>AMOUNT</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No orders found.">
            {filtered.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-mono font-bold text-primary">{o.order_ref}</TableCell>
                <TableCell>
                    <span className="bg-default-100 text-default-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {o.shop_name}
                    </span>
                </TableCell>
                <TableCell className="text-sm font-medium">{o.first_name} {o.last_name}</TableCell>
                <TableCell className="font-bold">₱{parseFloat(o.total_amount as any).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    color={statusColor[o.order_status] ?? 'default'}
                    variant="flat" size="sm" className="font-bold"
                  >
                    {o.order_status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Select
                      size="sm"
                      aria-label="Change Status"
                      variant="bordered"
                      className="w-32"
                      isDisabled={updating === o.id}
                      selectedKeys={[o.order_status]}
                      onSelectionChange={(k) => updateStatus(o.id, Array.from(k)[0] as string)}
                    >
                      <SelectItem key="Requested" textValue="Requested">Requested</SelectItem>
                      <SelectItem key="Ongoing" textValue="Ongoing">Ongoing</SelectItem>
                      <SelectItem key="Done" textValue="Done">Done</SelectItem>
                      <SelectItem key="Cancelled" textValue="Cancelled">Cancelled</SelectItem>
                    </Select>
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
