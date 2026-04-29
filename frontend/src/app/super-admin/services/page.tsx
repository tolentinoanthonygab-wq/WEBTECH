'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Input
} from '@nextui-org/react';
import { FiRefreshCw, FiSearch, FiToggleLeft, FiToggleRight, FiPackage } from 'react-icons/fi';

interface Service {
  id: string;
  service_name: string;
  unit: string;
  price_per_unit: number;
  status: string;
  shop_name: string;
}

export default function SuperAdminServicesPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super_admin/services.php');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchServices(); }, [user]);

  const toggleStatus = async (id: string, current: string) => {
    setUpdating(id);
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/super_admin/services.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (data.success) fetchServices();
      else alert(data.message);
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  if (authLoading || !user) return null;

  const filtered = services.filter(s =>
    `${s.service_name} ${s.shop_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FiPackage className="text-primary" /> Global Services
          </h1>
          <p className="text-default-500 font-medium">Oversight of all services across all shops</p>
        </div>
        <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchServices} isLoading={loading}>
          Refresh
        </Button>
      </div>

      <Input
        placeholder="Search by service or shop name..."
        variant="bordered"
        className="max-w-md"
        startContent={<FiSearch className="text-default-400" />}
        value={search}
        onValueChange={setSearch}
      />

      {loading ? (
        <div className="flex justify-center p-20"><Spinner size="lg" /></div>
      ) : (
        <Table aria-label="Global Services Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>SERVICE NAME</TableColumn>
            <TableColumn>SHOP</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No services found.">
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-bold">{s.service_name}</TableCell>
                <TableCell>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {s.shop_name}
                    </span>
                </TableCell>
                <TableCell className="font-bold text-success">
                    ₱{parseFloat(s.price_per_unit as any).toFixed(2)} / {s.unit === 'per_kg' ? 'kg' : 'pc'}
                </TableCell>
                <TableCell>
                  <Chip
                    color={s.status === 'active' ? 'success' : 'danger'}
                    variant="flat" size="sm" className="font-bold"
                  >
                    {s.status.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      color={s.status === 'active' ? 'danger' : 'success'}
                      variant="flat"
                      className="font-bold"
                      isLoading={updating === s.id}
                      startContent={s.status === 'active' ? <FiToggleLeft /> : <FiToggleRight />}
                      onPress={() => toggleStatus(s.id, s.status)}
                    >
                      {s.status === 'active' ? 'Deactivate' : 'Activate'}
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
