"use client";
import { useState } from "react";
import { FloatingCircles, ParticleBackground } from "@/app/(microestate)/_components/Background";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("/microestate/api/auth/verifycode", {
        email: localStorage.getItem("pendingEmail") || "",
        code: verificationCode,
      });

      if (response.data.success) {
        setSuccess("Email verified successfully! Redirecting to your dashboard...");
        
        // Get the user's role from the response or stored data
        const userRole = response.data.user?.role || localStorage.getItem("userRole") || "user";
        
        // Redirect based on role after a short delay
        setTimeout(() => {
          router.push("/microestate/auth")
        }, 2000);
      } else {
        setError(response.data.error || "Verification failed");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      const errorMessage = err.response?.data?.error || "Verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post("/microestate/api/auth/resend-code", {
        email: localStorage.getItem("pendingEmail") || "",
      });

      if (response.data.success) {
        setSuccess("Verification code resent successfully!");
      } else {
        setError(response.data.error || "Failed to resend code");
      }
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-20 relative z-10">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden max-w-md w-full mx-4 px-8 py-10 animate-fadeIn">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-1">
              Verify Your Email
            </h2>
            <p className="text-gray-400 text-center text-sm">
              We've sent a verification code to your email address. Please enter it below.
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Verification Code
              </label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl text-lg shadow-lg shadow-orange-500/20 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-orange-500 hover:text-orange-400 text-sm font-medium disabled:opacity-50"
              >
                Didn't receive the code? Resend
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/microestate/auth")}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className="w-full py-6 bg-black/80 border-t border-orange-500/10 text-gray-400 text-center text-xs relative z-10">
        &copy; {new Date().getFullYear()} Microestate. All rights reserved.
      </footer>
    </div>
  );
} 