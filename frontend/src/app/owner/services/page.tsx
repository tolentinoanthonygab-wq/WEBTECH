'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Button, Card, CardBody, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip,
  Select, SelectItem
} from '@nextui-org/react';
import { FiPlus, FiRefreshCw, FiEdit2, FiToggleRight, FiToggleLeft } from 'react-icons/fi';

interface Service {
  id: string;
  service_name: string;
  unit: string;
  price_per_unit: number;
  category: string;
  status: 'active' | 'inactive';
}

export default function OwnerServicesPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [newService, setNewService] = useState({ name: '', unit: 'per_kg', price: '', category: 'Colored' });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/services.php');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchServices();
  }, [user]);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/owner/services.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      if (data.success) {
        onClose();
        fetchServices();
        setNewService({ name: '', unit: 'per_kg', price: '' });
      }
    } catch (err) {
      alert('Error creating service');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await fetch('/api/owner/services.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchServices();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (authLoading) return null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laundry Services</h1>
          <p className="text-default-500">Define your prices and laundry types</p>
        </div>
        <div className="flex gap-2">
          <Button variant="flat" color="primary" startContent={<FiRefreshCw />} onPress={fetchServices} isLoading={loading}>
            Refresh
          </Button>
          <Button color="primary" startContent={<FiPlus />} onPress={onOpen}>
            Add Service
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Services table" removeWrapper>
            <TableHeader>
              <TableColumn>SERVICE NAME</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>UNIT</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={loading ? "Loading..." : "No services found."}>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold text-primary">{s.service_name}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="dot" color={s.category === 'White' ? 'default' : s.category === 'Blanket' ? 'secondary' : 'primary'}>
                        {s.category || 'General'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">{s.unit}</Chip>
                  </TableCell>
                  <TableCell className="font-bold">₱{parseFloat(s.price_per_unit as any).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip color={s.status === 'active' ? 'success' : 'default'} variant="flat" size="sm">
                      {s.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        color={s.status === 'active' ? 'warning' : 'success'} 
                        variant="flat" 
                        onPress={() => toggleStatus(s.id, s.status)}
                      >
                        {s.status === 'active' ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
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
              <ModalHeader className="flex flex-col gap-1 text-2xl font-black">Add New Service</ModalHeader>
              <ModalBody className="gap-4">
                <Input 
                  label="Service Name" 
                  placeholder="e.g. Premium Wash" 
                  variant="bordered" 
                  value={newService.name} 
                  onValueChange={(v) => setNewService(p => ({...p, name: v}))} 
                />
                
                <Select
                    label="Laundry Category"
                    variant="bordered"
                    selectedKeys={[newService.category]}
                    onSelectionChange={(keys) => setNewService(p => ({...p, category: Array.from(keys)[0] as string}))}
                >
                    <SelectItem key="White" value="White">White Items</SelectItem>
                    <SelectItem key="Colored" value="Colored">Colored Items</SelectItem>
                    <SelectItem key="Blanket" value="Blanket">Blanket / Special</SelectItem>
                    <SelectItem key="Other" value="Other">Other / General</SelectItem>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Pricing Unit"
                    variant="bordered"
                    selectedKeys={[newService.unit]}
                    onSelectionChange={(keys) => setNewService(p => ({...p, unit: Array.from(keys)[0] as string}))}
                  >
                    <SelectItem key="per_kg" value="per_kg">Per Kilogram (kg)</SelectItem>
                    <SelectItem key="per_piece" value="per_piece">Per Piece (pc)</SelectItem>
                  </Select>

                  <Input 
                    label="Price per Unit" 
                    placeholder="0.00" 
                    type="number"
                    variant="bordered" 
                    startContent={<span className="text-default-400 text-small">₱</span>}
                    value={newService.price} 
                    onValueChange={(v) => setNewService(p => ({...p, price: v}))} 
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCreate}>
                  Save Service
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
