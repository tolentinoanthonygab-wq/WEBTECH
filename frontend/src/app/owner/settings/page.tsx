'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, Input, Button, CardHeader, Divider } from '@nextui-org/react';
import { FiSave, FiSettings, FiCreditCard } from 'react-icons/fi';

export default function OwnerSettingsPage() {
  const { user, loading: authLoading } = useRequireRole('owner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shop, setShop] = useState({ shop_name: '', address: '', gcash_number: '', gcash_name: '' });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/settings.php');
      const data = await res.json();
      if (data.success) setShop(data.data);
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/owner/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      const data = await res.json();
      if (data.success) alert('Settings saved successfully!');
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-default-500">Configure your business profile and payment methods</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex gap-3 px-6 py-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FiSettings size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-md font-bold">General Information</p>
            <p className="text-small text-default-500">Shop name and branch location</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-6 gap-4">
          <Input 
            label="Shop Name" 
            variant="bordered" 
            value={shop.shop_name} 
            onValueChange={(v) => setShop(p => ({...p, shop_name: v}))} 
          />
          <Input 
            label="Shop Address" 
            variant="bordered" 
            value={shop.address} 
            onValueChange={(v) => setShop(p => ({...p, address: v}))} 
          />
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex gap-3 px-6 py-4">
          <div className="p-2 bg-success/10 rounded-lg text-success">
            <FiCreditCard size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-md font-bold">Payment Methods</p>
            <p className="text-small text-default-500">GCash details for customer payments</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-6 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="GCash Registered Name" 
              placeholder="e.g. Maria Santos"
              variant="bordered" 
              value={shop.gcash_name} 
              onValueChange={(v) => setShop(p => ({...p, gcash_name: v}))} 
            />
            <Input 
              label="GCash Mobile Number" 
              placeholder="09XX XXX XXXX"
              variant="bordered" 
              value={shop.gcash_number} 
              onValueChange={(v) => setShop(p => ({...p, gcash_number: v}))} 
            />
          </div>
          <div className="bg-success-50 p-4 rounded-xl border border-success-100 flex gap-3 items-center">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="text-xs text-success-700">Customers will see these details during checkout to pay for their laundry.</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          color="primary" 
          size="lg" 
          className="px-12 font-bold shadow-lg"
          startContent={<FiSave />}
          isLoading={saving}
          onPress={handleSave}
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
