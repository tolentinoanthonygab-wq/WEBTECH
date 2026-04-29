'use client';
import { useState, useEffect } from 'react';
import { useRequireRole } from '@/context/AuthContext';
import { Card, CardBody, Input, Button, CardHeader, Divider } from '@nextui-org/react';
import { FiSave, FiLock, FiUser } from 'react-icons/fi';

export default function StaffSettingsPage() {
  const { user, loading: authLoading } = useRequireRole('staff');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.user_name.split(' ')[0] || '',
        last_name: user.user_name.split(' ')[1] || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/staff/profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) alert('Profile updated! Please log in again to see changes.');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) return alert('New passwords do not match');
    setSaving(true);
    try {
      const res = await fetch('/api/staff/profile.php', {
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

  if (authLoading) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-success">Staff Settings</h1>
        <p className="text-default-500">Manage your account profile and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex gap-3 px-6 py-4">
            <div className="p-2 bg-success/10 rounded-lg text-success"><FiUser size={20} /></div>
            <p className="font-bold">My Profile</p>
          </CardHeader>
          <Divider />
          <CardBody className="p-6 gap-4">
            <Input 
              label="First Name" 
              variant="bordered" 
              value={profile.first_name} 
              onValueChange={(v) => setProfile(p => ({...p, first_name: v}))} 
            />
            <Input 
              label="Last Name" 
              variant="bordered" 
              value={profile.last_name} 
              onValueChange={(v) => setProfile(p => ({...p, last_name: v}))} 
            />
            <Input label="Email Address" variant="bordered" isDisabled value={profile.email} />
            <Button color="success" className="font-bold text-white shadow-lg shadow-success/20" startContent={<FiSave />} isLoading={saving} onPress={handleUpdateProfile}>
              Save Profile
            </Button>
          </CardBody>
        </Card>

        {/* Password Card */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex gap-3 px-6 py-4">
            <div className="p-2 bg-danger/10 rounded-lg text-danger"><FiLock size={20} /></div>
            <p className="font-bold">Security</p>
          </CardHeader>
          <Divider />
          <CardBody className="p-6 gap-4">
            <Input 
              label="Current Password" 
              type="password" 
              variant="bordered" 
              value={passwords.current} 
              onValueChange={(v) => setPasswords(p => ({...p, current: v}))} 
            />
            <Input 
              label="New Password" 
              type="password" 
              variant="bordered" 
              value={passwords.new} 
              onValueChange={(v) => setPasswords(p => ({...p, new: v}))} 
            />
            <Input 
              label="Confirm New Password" 
              type="password" 
              variant="bordered" 
              value={passwords.confirm} 
              onValueChange={(v) => setPasswords(p => ({...p, confirm: v}))} 
            />
            <Button color="danger" variant="flat" className="font-bold" isLoading={saving} onPress={handleChangePassword}>
              Change Password
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
