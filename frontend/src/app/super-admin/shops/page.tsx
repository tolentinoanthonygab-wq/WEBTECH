'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Card, CardBody, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@nextui-org/react';
import { FiPlus, FiMapPin, FiPhone, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';

interface Shop {
  id: string;
  shop_name: string;
  address: string;
  gcash_number: string;
  gcash_name: string;
  status: 'active' | 'inactive';
  created_on: string;
  owner_first: string;
  owner_last: string;
}

export default function ShopsManagement() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shop_name: '',
    shop_address: '',
    shop_contact: '',
    owner_first_name: '',
    owner_last_name: '',
    owner_email: '',
    owner_password: ''
  });

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super_admin/shops.php');
      const data = await res.json();
      if (data.success) setShops(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchShops(); }, [user]);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/super_admin/shops.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onClose();
        fetchShops();
        setForm({
            shop_name: '', shop_address: '', shop_contact: '',
            owner_first_name: '', owner_last_name: '', owner_email: '', owner_password: ''
        });
      } else {
        alert(data.message);
      }
    } catch { alert('Creation failed'); }
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      await fetch('/api/super_admin/shops.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      fetchShops();
    } catch { alert('Update failed'); }
  };

  if (authLoading || !user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laundry Shops</h1>
          <p className="text-default-500">Manage platform partners and their locations</p>
        </div>
        <div className="flex gap-2">
            <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchShops} isLoading={loading}>
                Refresh
            </Button>
            <Button color="primary" startContent={<FiPlus />} size="lg" onPress={onOpen}>
                Add New Shop
            </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" label="Loading shops..." />
        </div>
      ) : (
        <Table aria-label="Shops Management Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>SHOP NAME</TableColumn>
            <TableColumn>OWNER</TableColumn>
            <TableColumn>ADDRESS</TableColumn>
            <TableColumn>GCASH INFO</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED ON</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No shops found.">
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-semibold">{shop.shop_name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{shop.owner_first} {shop.owner_last}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-default-400" />
                    <span className="text-sm truncate max-w-[200px]">{shop.address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">{shop.gcash_name || 'N/A'}</p>
                    <p className="text-default-400 flex items-center gap-1">
                      <FiPhone size={12} /> {shop.gcash_number || 'N/A'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={shop.status === 'active' ? 'success' : 'danger'} 
                    variant="flat" 
                    size="sm"
                    startContent={shop.status === 'active' ? <FiCheckCircle /> : <FiXCircle />}
                  >
                    {shop.status.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell className="text-sm text-default-500">
                  {new Date(shop.created_on).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="flat" 
                      color={shop.status === 'active' ? 'danger' : 'success'}
                      onPress={() => toggleStatus(shop.id, shop.status)}
                    >
                      {shop.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="font-bold text-2xl">Create New Shop & Owner</ModalHeader>
          <ModalBody className="gap-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Shop Information</p>
                    <Input label="Shop Name" variant="bordered" value={form.shop_name} onValueChange={(v) => setForm(p => ({...p, shop_name: v}))} />
                    <Input label="Shop Address" variant="bordered" value={form.shop_address} onValueChange={(v) => setForm(p => ({...p, shop_address: v}))} />
                    <Input label="Contact Number" variant="bordered" value={form.shop_contact} onValueChange={(v) => setForm(p => ({...p, shop_contact: v}))} />
                </div>
                <div className="space-y-4">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Owner Information</p>
                    <div className="flex gap-2">
                        <Input label="First Name" variant="bordered" value={form.owner_first_name} onValueChange={(v) => setForm(p => ({...p, owner_first_name: v}))} />
                        <Input label="Last Name" variant="bordered" value={form.owner_last_name} onValueChange={(v) => setForm(p => ({...p, owner_last_name: v}))} />
                    </div>
                    <Input label="Email" variant="bordered" type="email" value={form.owner_email} onValueChange={(v) => setForm(p => ({...p, owner_email: v}))} />
                    <Input label="Password" variant="bordered" type="password" value={form.owner_password} onValueChange={(v) => setForm(p => ({...p, owner_password: v}))} />
                </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cancel</Button>
            <Button color="primary" className="font-black px-8" isLoading={submitting} onPress={handleCreate}>
                SAVE SHOP & OWNER
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
