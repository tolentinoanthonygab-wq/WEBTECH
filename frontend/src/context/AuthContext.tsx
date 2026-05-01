'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, Role } from '@/types';
import { fetchJson, readJson } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, pass: string, role?: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  logout: async () => {}, 
  setUser: () => {},
  login: async () => ({ success: false, message: 'Not implemented' })
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Load from backup to prevent flicker
    const backup = localStorage.getItem('welaund_session');
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        setUser(parsed);
        // We still set loading to true initially until server confirms, 
        // but having the user object prevents the redirect loop.
      } catch (e) {}
    }

    console.log('Checking session with server...');
    fetchJson(`/api/auth/session.php`, {
      credentials: 'include',
    })
      .then((res) => {
        console.log('Session response:', res);
        if (res.success) {
          if (res.suspended) {
            setUser(null);
            localStorage.removeItem('welaund_session');
            // Check if suspended due to shop owner or account itself
            const role = res.data?.role;
            if (role === 'staff' || role === 'customer') {
              router.push('/login?shop_suspended=1');
            } else {
              router.push('/login?suspended=1');
            }
          } else {
            setUser(res.data);
            localStorage.setItem('welaund_session', JSON.stringify(res.data));
          }
        } else {
          setUser(null);
          localStorage.removeItem('welaund_session');
        }
      })
      .catch((err) => {
        console.error('Session error:', err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch(`/api/auth/logout.php`, {
      credentials: 'include',
    });
    setUser(null);
    localStorage.removeItem('welaund_session');
    router.push('/login');
  };

  const updateUserInfo = (userData: AuthUser | null) => {
    setUser(userData);
    if (userData) localStorage.setItem('welaund_session', JSON.stringify(userData));
    else localStorage.removeItem('welaund_session');
  };

  const login = async (email: string, password: string, role: string = 'auto') => {
    try {
      const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await readJson(res);
      
      if (data.success) {
        updateUserInfo(data.data);
        return { success: true, user: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  return <AuthContext.Provider value={{ user, loading, logout, setUser: updateUserInfo, login }}>{children}</AuthContext.Provider>;
}


export const useAuth = () => useContext(AuthContext);

export function useRequireRole(role: Role) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { 
      console.log('RBAC: No user found, redirecting to login');
      router.push('/login'); 
      return; 
    }
    if (user.role !== role) { 
      console.log(`RBAC: Role mismatch. User has "${user.role}" but needs "${role}". Redirecting...`);
      router.push('/login'); 
      return; 
    }
    console.log(`RBAC: Access granted for role "${role}"`);
    if (role === 'customer' && (user as any).status !== 'Approved') {
      console.log('RBAC: Customer not approved, redirecting to pending');
      router.push('/customer/pending');
    }
  }, [user, loading, role, router]);

  return { user, loading };
}
