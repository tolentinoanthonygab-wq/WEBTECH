'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardBody, CardHeader, Input, Button, Select, SelectItem, Link } from '@nextui-org/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface Shop { id: string; name: string; }

export default function RegisterPage() {
  const [shops, setShops]   = useState<Shop[]>([]);
  const [form, setForm]     = useState({ shop_id: '', first_name: '', middle_name: '', last_name: '', email: '', password: '', contact_number: '', address: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    fetch('/api/public/register.php')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setShops(res.data);
      });
  }, []);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handle = async () => {
    setError(''); setSuccess('');
    if (!form.shop_id || !form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/public/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-xl shadow-lg border-none bg-white">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-2 text-center">
          <Image src="/logo.png" alt="WeLaund" width={120} height={40} priority />
          <h1 className="text-2xl font-bold text-gray-900">Join WeLaund</h1>
          <p className="text-default-500 text-sm">Professional laundry service made easy</p>
        </CardHeader>

        <CardBody className="gap-4 px-8 pb-10">
          {error   && <div className="bg-danger-50 text-danger-700 text-sm rounded-lg px-4 py-2 font-bold">⚠️ {error}</div>}
          {success && <div className="bg-success-50 text-success-700 text-sm rounded-lg px-4 py-2 font-bold">🎉 {success}</div>}

          <div className="space-y-10">
            <div className="w-full">
              <Select 
                label="Choose your Laundry Shop" 
                labelPlacement="outside"
                placeholder="Select a branch"
                variant="bordered"
                radius="sm"
                isRequired 
                selectedKeys={form.shop_id ? [form.shop_id] : []} 
                onSelectionChange={(k) => set('shop_id', Array.from(k)[0] as string)}
                classNames={{ label: "font-bold mb-2" }}
              >
                {shops.map((s) => <SelectItem key={s.id} textValue={s.name}>{s.name}</SelectItem>)}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="First Name" labelPlacement="outside" placeholder="Juan" variant="bordered" radius="sm" isRequired value={form.first_name} onValueChange={(v) => set('first_name', v)} classNames={{ label: "font-bold mb-2" }} />
              <Input label="Middle Name" labelPlacement="outside" placeholder="Optional" variant="bordered" radius="sm" value={form.middle_name} onValueChange={(v) => set('middle_name', v)} classNames={{ label: "font-bold mb-2" }} />
              <Input label="Last Name" labelPlacement="outside" placeholder="Dela Cruz" variant="bordered" radius="sm" isRequired value={form.last_name} onValueChange={(v) => set('last_name', v)} classNames={{ label: "font-bold mb-2" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email Address" labelPlacement="outside" placeholder="name@email.com" type="email" variant="bordered" radius="sm" isRequired value={form.email} onValueChange={(v) => set('email', v)} classNames={{ label: "font-bold mb-2" }} />
              <Input label="Contact Number" labelPlacement="outside" placeholder="09XX XXX XXXX" variant="bordered" radius="sm" value={form.contact_number} onValueChange={(v) => set('contact_number', v)} classNames={{ label: "font-bold mb-2" }} />
            </div>

            <div className="w-full">
              <Input 
                label="Create Password" 
                labelPlacement="outside" 
                placeholder="Min. 8 characters" 
                type={isVisible ? "text" : "password"} 
                variant="bordered" 
                radius="sm" 
                isRequired 
                value={form.password} 
                onValueChange={(v) => set('password', v)} 
                classNames={{ label: "font-bold mb-2" }}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? <FiEyeOff className="text-xl text-default-400" /> : <FiEye className="text-xl text-default-400" />}
                  </button>
                }
              />
            </div>

            <div className="w-full">
              <Input label="Home Address" labelPlacement="outside" placeholder="Street, City, Province" variant="bordered" radius="sm" value={form.address} onValueChange={(v) => set('address', v)} classNames={{ label: "font-bold mb-2" }} />
            </div>
          </div>

          <Button color="primary" size="lg" className="w-full font-bold shadow-md mt-2 h-14" isLoading={loading} onPress={handle}>
            Create My Account →
          </Button>

          <p className="text-center text-sm text-default-500 mt-2 font-medium">
            Already have an account? <Link href="/login" size="sm" className="font-bold text-blue-600 ml-1">Sign In</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
