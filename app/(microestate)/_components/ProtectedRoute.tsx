"use client";

import { useAuth } from "../Context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('landlord' | 'tenant' | 'user')[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['landlord', 'tenant', 'user'], 
  redirectTo = "/microestate/auth" 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login/register
      if (!isAuthenticated) {
        router.push("/microestate/auth");
        return;
      }

      // If user has a role but it's not in allowed roles, redirect
      if (user?.role && !allowedRoles.includes(user.role as any)) {
        if (user.role === 'landlord') {
          router.push("/microestate/landlord");
        } else if (user.role === 'tenant') {
          router.push("/microestate/tenant");
        } else {
          router.push("/microestate");
        }
        return;
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, router, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // If user role is not allowed, don't render children
  if (user?.role && !allowedRoles.includes(user.role as any)) {
    return null;
  }

  return <>{children}</>;
} 