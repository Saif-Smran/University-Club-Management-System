'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';
import { authService } from '@/services/api';
import { INITIAL_USERS } from '@/services/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (targetRole: Role) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]);
  const [token, setToken] = useState<string | null>('demo-jwt-token');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (e) {}
      }
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password: pass });
      if (res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.accessToken || 'demo-jwt-token');
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('token', res.data.accessToken || 'demo-jwt-token');
        }
        toast.success(`Welcome back, ${res.data.user.fullName}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    toast.info('Logged out successfully');
  };

  const switchDemoUser = (targetRole: Role) => {
    const found = INITIAL_USERS.find((u) => u.role === targetRole) || INITIAL_USERS[0];
    setUser(found);
    setToken(`demo-${targetRole.toLowerCase()}-token`);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(found));
      localStorage.setItem('token', `demo-${targetRole.toLowerCase()}-token`);
    }
    toast.success(`Switched role to ${targetRole} (${found.fullName})`);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.data) {
        setUser(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'Student',
        token,
        isLoading,
        login,
        logout,
        switchDemoUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
