'use client'

import { SessionProvider, signOut, getSession } from "next-auth/react"
import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation';
import { set } from "mongoose";
// Update your User interface
interface User {
  id: string;
  _id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'landlord' | 'tenant' | 'user';
  emailVerified?: boolean | Date;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  profileImage?: string;
  qrCode?: string;
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
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            _id: session.user._id,
            email: session.user.email,
            name: session.user.name,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            phone: session.user.phone,
            role: session.user.role,
            emailVerified: session.user.emailVerified
          };
          setUser(userData);
          localStorage.setItem('microestate_user', JSON.stringify(userData));
        } else {
          // Fallback to localStorage if session not available
          const storedUser = localStorage.getItem('microestate_user');
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
    <SessionProvider basePath="/microestate/api/auth">
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  )
}