'use client';
import { useState } from 'react';
import { Card, CardBody, CardHeader, Divider, Input, Button } from '@nextui-org/react';
import { FiMail } from 'react-icons/fi';

interface Props {
  currentEmail: string;
  apiEndpoint: string;
  onSuccess?: (newEmail: string) => void;
}

export default function EmailChangeCard({ currentEmail, apiEndpoint, onSuccess }: Props) {
  const [form, setForm]     = useState({ new_email: '', current_password: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    if (!form.new_email || !form.current_password) return alert('Please fill in all fields.');
    setSaving(true);
    try {
      const res  = await fetch(apiEndpoint, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess?.(form.new_email);
        setForm({ new_email: '', current_password: '' });
        alert('Email updated successfully! Please log in again.');
      } else alert(data.message || 'Failed to update email.');
    } catch { alert('Error updating email.'); }
    finally { setSaving(false); }
  };

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden self-start">
      <CardHeader className="flex gap-4 px-8 py-6 bg-amber-50/50">
        <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-200"><FiMail size={24} /></div>
        <div>
          <p className="font-black text-amber-900">Change Email</p>
          <p className="text-xs text-amber-600 font-bold uppercase tracking-widest">Update Email Address</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-8 gap-6">
        <Input label="New Email Address" type="email" variant="bordered" radius="lg"
          value={form.new_email}
          onValueChange={v => setForm(p => ({ ...p, new_email: v }))}
          description={`Current: ${currentEmail}`} />
        <Input label="Confirm with Password" type="password" variant="bordered" radius="lg"
          value={form.current_password}
          onValueChange={v => setForm(p => ({ ...p, current_password: v }))}
          description="Enter your current password to confirm." />
        <Button color="warning" variant="flat" className="font-bold h-14 rounded-2xl mt-2"
          isLoading={saving} onPress={handleChange}>
          Update Email Address
        </Button>
      </CardBody>
    </Card>
  );
}
