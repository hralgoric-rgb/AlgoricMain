"use client";
import Link from "next/link";
import { FloatingCircles, ParticleBackground } from "../../_components/Background";
import { Building } from "lucide-react";
import { useAuth } from "../../Context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      toast.error("You are already logged in!");
      // Redirect based on user role
      if (user.role === "landlord") {
        router.push("/microestate/landlord");
      } else if (user.role === "tenant") {
        router.push("/microestate/tenant");
      } else {
        router.push("/microestate");
      }
    }
  }, [user, router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 min-h-[80vh] pt-20 pb-10 relative z-10">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden transform hover:scale-[1.01] transition-all duration-500 max-w-xl w-full mx-4">
          <div className="relative px-8 py-6 bg-gradient-to-r from-orange-600/10 to-orange-400/10">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5"></div>
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
              Create Your Account
            </h2>
            <p className="text-center text-gray-300 text-sm mb-2">
              Choose your account type to get started.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mb-6 px-4 mt-2">
            <div className="flex-1 bg-[#101014] border border-orange-500/30 rounded-xl p-6 flex flex-col items-center hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200">
              <span className="text-xl font-bold text-orange-500 mb-2">I'm a Landlord</span>
              <p className="text-gray-300 text-center text-sm mb-4">List properties, manage tenants, and track payments.</p>
              <Link href="/microestate/register/landlord" passHref legacyBehavior>
                <a className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20 text-center block">Continue as Landlord</a>
              </Link>
            </div>
            <div className="flex-1 bg-[#101014] border border-orange-500/30 rounded-xl p-6 flex flex-col items-center hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200">
              <span className="text-xl font-bold text-orange-500 mb-2">I'm a Tenant</span>
              <p className="text-gray-300 text-center text-sm mb-4">Find properties, manage your lease, and pay rent.</p>
              <Link href="/microestate/register/tenant" passHref legacyBehavior>
                <a className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20 text-center block">Continue as Tenant</a>
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4 mb-2">
            Already have an account?{' '}
            <Link href="/microestate/auth" className="text-orange-500 hover:underline font-semibold">Login here.</Link>
          </p>
        </div>
      </div>
      <footer className="w-full py-6 bg-black/80 border-t border-orange-500/10 text-gray-400 text-center text-xs relative z-10">
        &copy; {new Date().getFullYear()} Microestate. All rights reserved.
      </footer>
    </div>
  );
} 