'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, Input, Button, CardHeader, Divider, Spinner } from '@nextui-org/react';
import { FiSave, FiLock, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';

export default function CustomerProfilePage() {
  const { user, loading: authLoading } = useRequireRole('customer');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ 
    first_name: '', 
    middle_name: '', 
    last_name: '', 
    email: '', 
    contact_number: '', 
    address: '' 
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (user) {
      fetch('/api/customer/profile.php')
        .then(res => res.json())
        .then(res => {
          if (res.success) setProfile(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) alert('Profile updated successfully!');
      else alert(data.message || 'Update failed');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return alert('Please fill all password fields');
    if (passwords.new !== passwords.confirm) return alert('New passwords do not match');
    
    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (data.success) {
        alert('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (err) {
      alert('Error updating password');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="flex justify-center p-20"><Spinner size="lg" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 italic">My Account</h1>
        <p className="text-default-500 font-medium tracking-wide uppercase text-xs">Manage your personal profile and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="flex gap-4 px-8 py-6 bg-blue-50/50">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <FiUser size={24} />
            </div>
            <div>
              <p className="font-black text-blue-900">Personal Details</p>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Profile Info</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-8 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="First Name" variant="bordered" radius="lg" value={profile.first_name} onValueChange={(v) => setProfile(p => ({...p, first_name: v}))} />
              <Input label="Middle Name" variant="bordered" radius="lg" value={profile.middle_name} onValueChange={(v) => setProfile(p => ({...p, middle_name: v}))} />
              <Input label="Last Name" variant="bordered" radius="lg" value={profile.last_name} onValueChange={(v) => setProfile(p => ({...p, last_name: v}))} />
            </div>
            
            <Input label="Email Address" variant="bordered" radius="lg" isDisabled value={profile.email} description="Contact support to change your email." />
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
               <Input label="Contact Number" variant="bordered" radius="lg" startContent={<FiPhone className="text-default-400" />} value={profile.contact_number} onValueChange={(v) => setProfile(p => ({...p, contact_number: v}))} />
               <Input label="Home Address" variant="bordered" radius="lg" startContent={<FiMapPin className="text-default-400" />} value={profile.address} onValueChange={(v) => setProfile(p => ({...p, address: v}))} />
            </div>

            <Button 
              color="primary" 
              className="font-bold h-14 rounded-2xl shadow-xl shadow-blue-200 mt-2" 
              startContent={<FiSave />} 
              isLoading={saving} 
              onPress={handleUpdateProfile}
            >
              Update Profile Information
            </Button>
          </CardBody>
        </Card>

        {/* Security Card */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden self-start">
          <CardHeader className="flex gap-4 px-8 py-6 bg-red-50/50">
            <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-200">
              <FiLock size={24} />
            </div>
            <div>
              <p className="font-black text-red-900">Account Security</p>
              <p className="text-xs text-red-600 font-bold uppercase tracking-widest">Update Password</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-8 gap-6">
            <div className="space-y-4">
              <Input 
                label="Current Password" 
                type="password" 
                variant="bordered" 
                radius="lg"
                value={passwords.current} 
                onValueChange={(v) => setPasswords(p => ({...p, current: v}))} 
              />
              <Input 
                label="New Password" 
                type="password" 
                variant="bordered" 
                radius="lg"
                value={passwords.new} 
                onValueChange={(v) => setPasswords(p => ({...p, new: v}))} 
              />
              <Input 
                label="Confirm New Password" 
                type="password" 
                variant="bordered" 
                radius="lg"
                value={passwords.confirm} 
                onValueChange={(v) => setPasswords(p => ({...p, confirm: v}))} 
              />
            </div>
            <Button 
              color="danger" 
              variant="flat" 
              className="font-bold h-14 rounded-2xl mt-2" 
              isLoading={saving} 
              onPress={handleChangePassword}
            >
              Change My Password
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
