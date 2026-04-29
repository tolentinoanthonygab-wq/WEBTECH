'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  User, Chip, Button, Tooltip, Card, CardBody 
} from '@nextui-org/react';
import { FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  status: 'Pending' | 'Approved' | 'Disapproved';
}

export default function StaffCustomersPage() {
  const { user, loading: authLoading } = useRequireRole('staff');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff/customers.php');
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (err) {
      console.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCustomers();
  }, [user]);

  const handleAction = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/staff/customers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) fetchCustomers();
    } catch (err) {
      alert('Action failed');
    }
  };

  if (authLoading) return null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Approvals</h1>
          <p className="text-default-500">Review and manage new registrations for {user?.shop_name}</p>
        </div>
        <Button 
          variant="flat" 
          color="primary" 
          startContent={<FiRefreshCw />} 
          onPress={fetchCustomers}
          isLoading={loading}
        >
          Refresh List
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Customer approvals table" removeWrapper>
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>CONTACT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No pending registrations found."}>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <User
                      name={`${c.first_name} ${c.last_name}`}
                      description={c.email}
                    />
                  </TableCell>
                  <TableCell>{c.contact_number || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      color={c.status === 'Pending' ? 'warning' : c.status === 'Approved' ? 'success' : 'danger'} 
                      variant="flat" 
                      size="sm"
                    >
                      {c.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {c.status === 'Pending' && (
                        <>
                          <Tooltip content="Approve Customer">
                            <Button isIconOnly size="sm" color="success" variant="flat" onPress={() => handleAction(c.id, 'Approved')}>
                              <FiCheck />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Disapprove">
                            <Button isIconOnly size="sm" color="danger" variant="flat" onPress={() => handleAction(c.id, 'Disapproved')}>
                              <FiX />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                      {c.status === 'Approved' && (
                        <Tooltip content="Deactivate Account">
                          <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleAction(c.id, 'Inactive')}>
                            <FiX />
                          </Button>
                        </Tooltip>
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
