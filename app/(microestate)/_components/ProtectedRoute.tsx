"use client";

import { useAuth } from "../Context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {

    // Add a small delay to ensure auth context is fully initialized
    const checkAuth = setTimeout(() => {
      if (!isLoading) {
        if (!user) {
          router.push("/microestate/auth");
        } else if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role)
        ) {
          router.push("/microestate/auth");
        } else {
          console.log("✅ User authenticated:", user.email, user.role);
        }
        setIsChecking(false);
      }
    }, 100); 

    return () => clearTimeout(checkAuth);
  }, [user, isLoading, allowedRoles, router]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
