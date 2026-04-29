'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Spinner, Card, CardBody, User, Button
} from '@nextui-org/react';
import { FiRefreshCw } from 'react-icons/fi';

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'inactive';
  shop_name: string;
}

export default function OwnersManagement() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super_admin/owners.php');
      const data = await res.json();
      if (data.success) setOwners(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchOwners(); }, [user]);

  const toggleStatus = async (id: string, current: string) => {
    setUpdating(id);
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/super_admin/owners.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (data.success) fetchOwners();
      else alert(data.message);
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  if (authLoading || !user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shop Owners</h1>
          <p className="text-default-500">Global list of all business owners on the platform</p>
        </div>
        <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchOwners} isLoading={loading}>
            Refresh
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" label="Loading owners..." />
        </div>
      ) : (
        <Table aria-label="Owners Management Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>OWNER</TableColumn>
            <TableColumn>ASSOCIATED SHOP</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No owners found.">
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>
                  <User
                    name={`${owner.first_name} ${owner.last_name}`}
                    description={owner.email}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
                    {owner.shop_name || 'No Shop Assigned'}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={owner.status === 'active' ? 'success' : 'danger'} 
                    variant="flat" 
                    size="sm"
                    className="font-bold"
                  >
                    {owner.status.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      color={owner.status === 'active' ? 'danger' : 'success'}
                      variant="flat"
                      className="font-bold"
                      isLoading={updating === owner.id}
                      onPress={() => toggleStatus(owner.id, owner.status)}
                    >
                      {owner.status === 'active' ? 'Suspend Owner' : 'Activate Owner'}
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
