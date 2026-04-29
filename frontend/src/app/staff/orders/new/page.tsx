'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { 
  Card, CardBody, Button, Input, Select, SelectItem, Divider, Chip, 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from '@nextui-org/react';
import { FiPlus, FiTrash2, FiCheckCircle, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Customer { id: string; first_name: string; last_name: string; }
interface Service  { id: string; service_name: string; unit: string; price_per_unit: number; }
interface OrderItem { service_id: string; name: string; weight: number; price: number; subtotal: number; }

export default function NewOrderPage() {
  const { user, loading: authLoading } = useRequireRole('staff');
  const router = useRouter();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices]   = useState<Service[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedService, setSelectedService]   = useState('');
  const [weight, setWeight]                       = useState('');
  const [orderItems, setOrderItems]               = useState<OrderItem[]>([]);
  const [loading, setLoading]                     = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch approved customers and active services
      fetch('/api/staff/customers.php?type=approved').then(r => r.json()).then(res => setCustomers(res.data || []));
      fetch('/api/staff/services.php').then(r => r.json()).then(res => setServices(res.data || []));
    }
  }, [user]);

  const addItem = () => {
    const service = services.find(s => s.id === selectedService);
    if (!service || !weight) return;
    
    const subtotal = parseFloat(weight) * service.price_per_unit;
    setOrderItems([...orderItems, {
      service_id: service.id,
      name: service.service_name,
      weight: parseFloat(weight),
      price: service.price_per_unit,
      subtotal
    }]);
    setWeight('');
  };

  const removeItem = (index: number) => setOrderItems(orderItems.filter((_, i) => i !== index));

  const total = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

  const placeOrder = async () => {
    if (!selectedCustomer || orderItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/staff/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: selectedCustomer, items: orderItems }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order Placed! Reference: ${data.order_ref}`);
        router.push('/staff/dashboard');
      }
    } catch (err) {
      alert('Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">New Laundry Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Customer & Service Selection */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-none">
            <CardBody className="gap-4 p-6">
              <h3 className="font-bold flex items-center gap-2"><FiSearch /> Customer</h3>
              <Select 
                label="Select Approved Customer" 
                variant="bordered"
                selectedKeys={selectedCustomer ? [selectedCustomer] : []}
                onSelectionChange={(k) => setSelectedCustomer(Array.from(k)[0] as string)}
              >
                {customers.map(c => <SelectItem key={c.id} textValue={`${c.first_name} ${c.last_name}`}>{c.first_name} {c.last_name}</SelectItem>)}
              </Select>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-none">
            <CardBody className="gap-4 p-6">
              <h3 className="font-bold">Add Service</h3>
              <Select 
                label="Service Type" 
                variant="bordered"
                selectedKeys={selectedService ? [selectedService] : []}
                onSelectionChange={(k) => setSelectedService(Array.from(k)[0] as string)}
              >
                {services.map(s => <SelectItem key={s.id} textValue={s.service_name}>{s.service_name} (₱{s.price_per_unit}/{s.unit})</SelectItem>)}
              </Select>
              <Input 
                label="Weight / Quantity" 
                type="number" 
                variant="bordered" 
                value={weight} 
                onValueChange={setWeight}
              />
              <Button color="primary" variant="flat" startContent={<FiPlus />} onPress={addItem} isDisabled={!selectedService || !weight}>
                Add to Order
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div className="md:col-span-2">
          <Card className="shadow-sm border-none h-full">
            <CardBody className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold mb-4">Order Summary</h3>
                <Table removeWrapper aria-label="Order items">
                  <TableHeader>
                    <TableColumn>SERVICE</TableColumn>
                    <TableColumn>QTY/WT</TableColumn>
                    <TableColumn>SUBTOTAL</TableColumn>
                    <TableColumn align="center">ACTION</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="No services added yet.">
                    {orderItems.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.weight} kg</TableCell>
                        <TableCell className="font-bold text-success">₱{item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => removeItem(i)}>
                            <FiTrash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-8 space-y-4">
                <Divider />
                <div className="flex justify-between items-center px-2">
                  <span className="text-default-500 font-bold">Estimated Total</span>
                  <span className="text-3xl font-black text-primary">₱{total.toFixed(2)}</span>
                </div>
                <Button 
                  color="primary" 
                  size="lg" 
                  fullWidth 
                  className="font-bold h-14 text-lg shadow-xl shadow-primary/20"
                  startContent={<FiCheckCircle />}
                  isLoading={loading}
                  onPress={placeOrder}
                  isDisabled={orderItems.length === 0 || !selectedCustomer}
                >
                  Confirm & Place Order
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
