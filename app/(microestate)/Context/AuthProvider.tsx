'use client'

import { SessionProvider } from "next-auth/react"
import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation';
import { set } from "mongoose";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'landlord' | 'tenant' | 'user';
  emailVerified?: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLandlord: boolean;
  isTenant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({
  children,
}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Recalculate auth state on mount and on route change
  useEffect(() => {
    if (typeof document !== 'undefined' && document.cookie.split('; ').some(cookie => cookie.trim().startsWith('microauth='))) {

        const storedUser = localStorage.getItem('microestate_user');

        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('microestate_user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
    }
    else {
      localStorage.removeItem('microestate_user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('nextauth.message');
      
      setUser(null);
    }
    setLoading(false);
  }, [pathname]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('microestate_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('microestate_user');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authToken');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.replace('/microestate');
    }
  };

  const isAuthenticated = !!user;
  const isLandlord = user?.role === 'landlord';
  const isTenant = user?.role === 'tenant';

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isLandlord,
    isTenant,
  };

  return (
    <SessionProvider basePath="/microestate/api/auth">
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  )
}