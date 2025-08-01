'use client'

import { SessionProvider, useSession, signOut } from "next-auth/react"
import React, { createContext, useContext } from "react"
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'landlord' | 'tenant';
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  login: (userData: User) => void;
  isAuthenticated: boolean;
  isLandlord: boolean;
  isTenant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  console.log("🔄 Auth session:", session);
  console.log("🔄 Auth status:", status);

  const user: User | null = session?.user ? {
    id: session.user.id!,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role as 'landlord' | 'tenant',
    emailVerified: session.user.emailVerified || false,
  } : null;

  const logout = async () => {
    console.log("🚪 Logging out...");
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/microestate", 
      });
      router.push("/microestate");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Add the missing login function
  const login = (userData: User) => {
    console.log("🔄 Login function called with:", userData);

    if(userData.emailVerified==true){
      localStorage.removeItem("pendingEmail");
    }

    localStorage.setItem('microestate_user', JSON.stringify(userData));

    // You could add additional client-side logic here if needed
    console.log("✅ Login function completed successfully");
  };

  const value = {
    user,
    loading,
    logout,
    login, // Make sure this is included
    isAuthenticated: !!user,
    isLandlord: user?.role === 'landlord',
    isTenant: user?.role === 'tenant',
  };

  console.log("🔄 Auth context value:", value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/microestate/api/auth">
      <AuthContent>
        {children}
      </AuthContent>
    </SessionProvider>
  );
}