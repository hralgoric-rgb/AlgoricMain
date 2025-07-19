'use client'

import { SessionProvider } from "next-auth/react"
import React, { createContext, useContext, useState, useEffect } from "react"

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

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('microestate_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('microestate_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('microestate_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('microestate_user');
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