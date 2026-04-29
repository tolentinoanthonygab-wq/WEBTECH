'use client';
import { useEffect, useState } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Spinner, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@nextui-org/react';
import { FiPlus, FiRefreshCw, FiSearch, FiToggleLeft, FiToggleRight, FiShield } from 'react-icons/fi';

interface Admin {
  id: string;
  username: string;
  email: string;
  status: string;
  created_on: string;
}

export default function SuperAdminAdminsPage() {
  const { user, loading: authLoading } = useRequireRole('super_admin');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super_admin/admins.php');
      const data = await res.json();
      if (data.success) setAdmins(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchAdmins(); }, [user]);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/super_admin/admins.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (data.success) {
        onClose();
        fetchAdmins();
        setNewAdmin({ username: '', email: '', password: '' });
      } else {
        alert(data.message);
      }
    } catch { alert('Creation failed'); }
  };

  const toggleStatus = async (id: string, current: string) => {
    if (id === user?.user_id) {
        alert("You cannot deactivate your own account.");
        return;
    }
    setUpdating(id);
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/super_admin/admins.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (data.success) fetchAdmins();
      else alert(data.message);
    } catch { alert('Update failed'); }
    finally { setUpdating(null); }
  };

  if (authLoading || !user) return null;

  const filtered = admins.filter(a =>
    `${a.username} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FiShield className="text-primary" /> Super Admins
          </h1>
          <p className="text-default-500 font-medium">Manage platform administrators</p>
        </div>
        <div className="flex gap-2">
            <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchAdmins} isLoading={loading}>
                Refresh
            </Button>
            <Button color="primary" startContent={<FiPlus />} onPress={onOpen}>
                Add Admin
            </Button>
        </div>
      </div>

      <Input
        placeholder="Search by username or email..."
        variant="bordered"
        className="max-w-md"
        startContent={<FiSearch className="text-default-400" />}
        value={search}
        onValueChange={setSearch}
      />

      {loading ? (
        <div className="flex justify-center p-20"><Spinner size="lg" /></div>
      ) : (
        <Table aria-label="Super Admins Table" shadow="sm" className="rounded-2xl overflow-hidden">
          <TableHeader>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED ON</TableColumn>
            <TableColumn align="center">ACTION</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No admins found.">
            {filtered.map(a => (
              <TableRow key={a.id}>
                <TableCell className="font-bold">{a.username}</TableCell>
                <TableCell className="text-default-500 text-sm">{a.email}</TableCell>
                <TableCell>
                  <Chip
                    color={a.status === 'active' ? 'success' : 'danger'}
                    variant="flat" size="sm" className="font-bold"
                  >
                    {a.status.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell className="text-xs text-default-400">
                    {new Date(a.created_on).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      color={a.status === 'active' ? 'danger' : 'success'}
                      variant="flat"
                      className="font-bold"
                      isDisabled={a.id === user.user_id}
                      isLoading={updating === a.id}
                      startContent={a.status === 'active' ? <FiToggleLeft /> : <FiToggleRight />}
                      onPress={() => toggleStatus(a.id, a.status)}
                    >
                      {a.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="font-bold">Add New Super Admin</ModalHeader>
          <ModalBody className="gap-4">
            <Input label="Username" variant="bordered" value={newAdmin.username} onValueChange={(v) => setNewAdmin(p => ({...p, username: v}))} />
            <Input label="Email" variant="bordered" type="email" value={newAdmin.email} onValueChange={(v) => setNewAdmin(p => ({...p, email: v}))} />
            <Input label="Password" variant="bordered" type="password" value={newAdmin.password} onValueChange={(v) => setNewAdmin(p => ({...p, password: v}))} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cancel</Button>
            <Button color="primary" className="font-bold" onPress={handleCreate}>Create Admin</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
