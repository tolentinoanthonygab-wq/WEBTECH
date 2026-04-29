'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  User, Chip, Button, Card, CardBody, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from '@nextui-org/react';
import { FiUserPlus, FiRefreshCw, FiTrash2, FiCheckCircle } from 'react-icons/fi';

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'inactive';
}

export default function OwnerStaffPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [newStaff, setNewStaff] = useState({ first_name: '', last_name: '', email: '', password: 'Admin@123' });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/staff.php');
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch (err) {
      console.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStaff();
  }, [user]);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/owner/staff.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (data.success) {
        onClose();
        fetchStaff();
        setNewStaff({ first_name: '', last_name: '', email: '', password: 'Admin@123' });
      } else {
        alert(data.message || 'Failed to create staff');
      }
    } catch (err) {
      alert('Error creating staff');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await fetch('/api/owner/staff.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchStaff();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (authLoading) return null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-default-500">Manage employees for {user?.shop_name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchStaff} isLoading={loading}>
            Refresh
          </Button>
          <Button color="primary" startContent={<FiUserPlus />} onPress={onOpen}>
            Add New Staff
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Staff table" removeWrapper>
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={loading ? "Loading..." : "No staff found."}>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <User name={`${s.first_name} ${s.last_name}`} />
                  </TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>
                    <Chip color={s.status === 'active' ? 'success' : 'danger'} variant="flat" size="sm">
                      {s.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        color={s.status === 'active' ? 'danger' : 'success'} 
                        variant="flat" 
                        onPress={() => toggleStatus(s.id, s.status)}
                      >
                        {s.status === 'active' ? <FiTrash2 /> : <FiCheckCircle />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Hire New Staff</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="First Name" 
                    placeholder="Enter first name" 
                    variant="bordered" 
                    value={newStaff.first_name} 
                    onValueChange={(v) => setNewStaff(p => ({...p, first_name: v}))} 
                  />
                  <Input 
                    label="Last Name" 
                    placeholder="Enter last name" 
                    variant="bordered" 
                    value={newStaff.last_name} 
                    onValueChange={(v) => setNewStaff(p => ({...p, last_name: v}))} 
                  />
                </div>
                <Input 
                  label="Email" 
                  placeholder="Enter email" 
                  variant="bordered" 
                  value={newStaff.email} 
                  onValueChange={(v) => setNewStaff(p => ({...p, email: v}))} 
                />
                <Input 
                  label="Temporary Password" 
                  defaultValue="Admin@123" 
                  variant="bordered" 
                  isDisabled 
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCreate}>
                  Create Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
