'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Input
} from '@nextui-org/react';
import { FiRefreshCw, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  shop_name: string;
  status: string;
}

export default function SuperAdminStaffPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [staff, setStaff]   = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/super_admin/staff.php');
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchStaff(); }, [user]);

  const toggleStatus = async (id: string, current: string) => {
    setUpdating(id);
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      const res  = await fetch('/api/super_admin/staff.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (data.success) fetchStaff();
      else alert(data.message);
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  if (authLoading || !user) return null;

  const filtered = staff.filter(s =>
    `${s.first_name} ${s.last_name} ${s.email} ${s.shop_name}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff Management</h1>
          <p className="text-default-500 font-medium">Global view — all staff across every shop</p>
        </div>
        <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchStaff} isLoading={loading}>
          Refresh
        </Button>
      </div>

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
        <Table aria-label="Global Staff Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>FULL NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>SHOP</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No staff found.">
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-bold">{s.first_name} {s.last_name}</TableCell>
                <TableCell className="text-default-500 text-sm">{s.email}</TableCell>
                <TableCell>
                  <span className="bg-default-100 text-default-700 text-xs font-bold px-3 py-1 rounded-full">
                    {s.shop_name}
                  </span>
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

      <p className="text-xs text-default-400 text-right">
        Showing {filtered.length} of {staff.length} staff members
      </p>
    </div>
  );
}
