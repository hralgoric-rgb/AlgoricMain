'use client'

import { SessionProvider, signOut } from "next-auth/react"
import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation';
import { set } from "mongoose";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'landlord' | 'tenant' | 'user';
  emailVerified?: boolean;
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
    
    setLoading(false);
  }, [pathname]);
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('microestate_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('microestate_user');
    localStorage.removeItem('userRole');
    await signOut({
      redirect: false,
      callbackUrl: "/microestate", 
    })
    router.push("/microestate");
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
    <SessionProvider basePath="/microestate/api/auth" >
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  )
}