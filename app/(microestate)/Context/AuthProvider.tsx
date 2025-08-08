"use client";

import { SessionProvider, useSession, signOut, getSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: "landlord" | "tenant";
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Initialize user from localStorage and session on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        if (session?.user) {
          const userData = {
            id: session.user.id || "",
            email: session.user.email!,
            name: session.user.name!,
            role: session.user.role as "landlord" | "tenant",
            emailVerified: session.user.emailVerified || false,
          };
          
          setUser(userData);
          localStorage.setItem("microestate_user", JSON.stringify(userData));
          return;
        }

        // Fallback to localStorage if no session
        const storedUser = localStorage.getItem("microestate_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify with session if available
          const currentSession = await getSession();
          if (!currentSession) {
            // Session expired, clear stored data
            setUser(null);
            localStorage.removeItem("microestate_user");
          }
        }
      } catch (error) {
        console.error("❌ Error parsing stored user data:", error);
        localStorage.removeItem("microestate_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== "loading") {
      initializeAuth();
    }
  }, [session, status]);

  // Listen for storage changes (useful for multi-tab scenarios)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "microestate_user") {
        if (e.newValue) {
          try {
            const userData = JSON.parse(e.newValue);
            console.log("🔄 Storage changed, updating user:", userData);
            setUser(userData);
          } catch (error) {
            console.error("❌ Error parsing updated user data:", error);
            setUser(null);
          }
        } else {
          console.log("🔄 Storage cleared, removing user");
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for custom events from other components
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      console.log("🔄 User login event received:", event.detail);
      setUser(event.detail);
    };

    const handleUserLogout = () => {
      console.log("🔄 User logout event received");
      setUser(null);
    };

    window.addEventListener("userLogin" as any, handleUserLogin);
    window.addEventListener("userLogout" as any, handleUserLogout);

    return () => {
      window.removeEventListener("userLogin" as any, handleUserLogin);
      window.removeEventListener("userLogout" as any, handleUserLogout);
    };
  }, []);

  const refreshUser = async () => {
    try {
      const currentSession = await getSession();
      if (currentSession?.user) {
        const userData = {
          id: currentSession.user.id || "",
          email: currentSession.user.email!,
          name: currentSession.user.name!,
          role: currentSession.user.role as "landlord" | "tenant",
          emailVerified: currentSession.user.emailVerified || false,
        };
        
        setUser(userData);
        localStorage.setItem("microestate_user", JSON.stringify(userData));
        console.log("🔄 User data refreshed:", userData);
      } else {
        setUser(null);
        localStorage.removeItem("microestate_user");
        console.log("🔄 No session found, user cleared");
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
  };

  const login = (userData: User) => {
    console.log("🔐 AuthProvider: Setting user data:", userData);
    setUser(userData);
    localStorage.setItem("microestate_user", JSON.stringify(userData));

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent("userLogin", { detail: userData }));
    
    // Force a small delay to ensure all components receive the event
    setTimeout(() => {
      console.log("🔄 Login state update completed");
    }, 50);
  };

  const logout = async () => {
    console.log("🔓 AuthProvider: Logging out user");
    setUser(null);
    localStorage.removeItem("microestate_user");

    // Sign out from NextAuth
    await signOut({ redirect: false });

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent("userLogout"));

    // Redirect to login
    router.push("/microestate/auth");
  };

  const value = {
    user,
    login,
    logout,
    isLoading: isLoading || status === "loading",
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Wrapper component that includes SessionProvider
export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider basePath="/microestate/api/auth">
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
