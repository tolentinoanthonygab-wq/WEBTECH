'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Input, Select, SelectItem
} from '@nextui-org/react';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  shop_name: string;
  status: string;
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  Approved:    'success',
  Pending:     'warning',
  Disapproved: 'danger',
  Inactive:    'default',
};

const nextStatusOptions: Record<string, string[]> = {
  Approved:    ['Inactive', 'Pending'],
  Pending:     ['Approved', 'Disapproved'],
  Disapproved: ['Pending'],
  Inactive:    ['Approved'],
};

export default function SuperAdminCustomersPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [updating, setUpdating]   = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/super_admin/customers.php');
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchCustomers(); }, [user]);

  const setStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res  = await fetch('/api/super_admin/customers.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) fetchCustomers();
      else alert(data.message);
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  if (authLoading || !user) return null;

  const filtered = customers.filter(c => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email} ${c.shop_name}`
      .toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = customers.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Customers (Global)</h1>
          <p className="text-default-500 font-medium">Manage all customer accounts across every shop</p>
        </div>
        <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchCustomers} isLoading={loading}>
          Refresh
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(statusColors).map(([status, color]) => (
          <button key={status} onClick={() => setFilter(filter === status ? 'all' : status)}>
            <Chip
              color={filter === status ? color : 'default'}
              variant={filter === status ? 'solid' : 'flat'}
              className="font-bold cursor-pointer"
            >
              {status}: {counts[status] || 0}
            </Chip>
          </button>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name, email, or shop..."
        variant="bordered"
        className="max-w-md"
        startContent={<FiSearch className="text-default-400" />}
        value={search}
        onValueChange={setSearch}
      />

      {loading ? (
        <div className="flex justify-center p-20"><Spinner size="lg" /></div>
      ) : (
        <Table aria-label="Global Customers Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>FULL NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>SHOP</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No customers found.">
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-bold">{c.first_name} {c.last_name}</TableCell>
                <TableCell className="text-default-500 text-sm">{c.email}</TableCell>
                <TableCell>
                  <span className="bg-default-100 text-default-700 text-xs font-bold px-3 py-1 rounded-full">
                    {c.shop_name}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusColors[c.status] ?? 'default'}
                    variant="flat" size="sm" className="font-bold"
                  >
                    {c.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {(nextStatusOptions[c.status] || []).map(next => (
                      <Button
                        key={next}
                        size="sm"
                        color={statusColors[next] ?? 'default'}
                        variant="flat"
                        className="font-bold"
                        isLoading={updating === c.id}
                        onPress={() => setStatus(c.id, next)}
                      >
                        → {next}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <p className="text-xs text-default-400 text-right">
        Showing {filtered.length} of {customers.length} customers
      </p>
    </div>
  );
}
