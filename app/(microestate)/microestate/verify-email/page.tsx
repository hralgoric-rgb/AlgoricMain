"use client";
import { useState, useEffect } from "react";
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
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const router = useRouter();

  // Load email on component mount
  useEffect(() => {
    const email = localStorage.getItem("pendingEmail");
    setPendingEmail(email);
    console.log("Loaded pending email:", email);
    
    // Clear email if it's invalid
    if (!email || !validateEmail(email)) {
      console.warn("Invalid email in storage:", email);
      localStorage.removeItem("pendingEmail");
      setPendingEmail(null);
      setError("No valid email found. Please register again.");
    }
  }, []);

  // Basic email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate inputs before sending
    if (!pendingEmail) {
      setError("No email found in session. Please register again.");
      setLoading(false);
      return;
    }
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending verification request for:", pendingEmail);
      const response = await axios.post("/microestate/api/auth/verifycode", {
        code: verificationCode,
        email: pendingEmail.toLowerCase().trim(),
      });

      if (response.data.success) {
        setSuccess("Email verified successfully! Redirecting...");
        
        // Clear verification data
        localStorage.removeItem("pendingEmail");
        
        // Get user data from response
        const userData = response.data.user || {};
        const userRole = userData.role || "user";
        console.log("Verified user role:", userRole);
        
        // Redirect based on role
        setTimeout(() => {
          if (userRole === "landlord") {
            router.push("/microestate/landlord");
          } else if (userRole === "tenant") {
            router.push("/microestate/tenant");
          } else {
            router.push("/microestate");
          }
        }, 2000);
      } else {
        const serverError = response.data.error || "Verification failed";
        setError(`Server error: ${serverError}`);
        console.warn("Server validation error:", response.data);
      }
    } catch (err: any) {
      // Enhanced error diagnostics
      let errorDetails = "";
      
      if (axios.isAxiosError(err)) {
        // Axios-specific errors
        errorDetails = `HTTP ${err.response?.status || "No status"} - ${err.code || "ERR_UNKNOWN"}`;
        
        if (err.response) {
          // Server responded with error
          const serverMessage = err.response.data?.error || 
                               err.response.data?.message || 
                               JSON.stringify(err.response.data);
          errorDetails += `: ${serverMessage}`;
          
          console.error("Server response error:", {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
        } else if (err.request) {
          // No response received
          errorDetails += ": No response from server";
          console.error("No server response:", err.request);
        }
      } else {
        // Non-Axios errors
        errorDetails = err.message || "Unknown client error";
        console.error("Non-network error:", err);
      }

      const userMessage = `Verification failed: ${errorDetails}`;
      setError(userMessage);
      console.error("Full error object:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!pendingEmail) {
      setError("No email found. Please register again.");
      setLoading(false);
      return;
    }

    try {
      console.log("Resending code to:", pendingEmail);
      const response = await axios.post("/microestate/api/auth/resend-code", {
        email: pendingEmail.toLowerCase().trim(),
      });

      if (response.data.success) {
        setSuccess("New verification code sent successfully!");
        console.log("Resend response:", response.data);
      } else {
        const serverError = response.data.error || "Failed to resend code";
        setError(`Server error: ${serverError}`);
      }
    } catch (err: any) {
      let errorDetails = "";
      
      if (axios.isAxiosError(err)) {
        errorDetails = `HTTP ${err.response?.status || "No status"}`;
        
        if (err.response) {
          errorDetails += `: ${err.response.data?.error || "No error message"}`;
        } else if (err.request) {
          errorDetails += ": No response from server";
        }
      } else {
        errorDetails = err.message || "Unknown client error";
      }

      setError(`Resend failed: ${errorDetails}`);
      console.error("Resend error:", err);
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
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-1">
              Verify Your Email
            </h2>
            
            {/* Display pending email */}
            <div className="mt-3 text-center">
              <p className="text-gray-400 text-sm">
                Code sent to:
              </p>
              <p className="font-medium text-orange-300 text-sm mt-1 break-all">
                {pendingEmail || "No email found"}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Verification Code
              </label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '');
                  setVerificationCode(value.slice(0, 6));
                }}
                placeholder="Enter 6-digit code"
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 text-center text-lg tracking-widest font-mono h-14"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Only numbers are allowed
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl text-lg shadow-lg shadow-orange-500/20 transition-all duration-200 disabled:opacity-70"
              disabled={loading || !verificationCode || verificationCode.length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : "Verify Email"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-orange-500 hover:text-orange-400 text-sm font-medium disabled:opacity-50 flex items-center justify-center mx-auto"
              >
                Didn't receive the code? Resend
              </button>
              
              {success?.includes("resent") && (
                <p className="text-green-400 text-xs mt-1 animate-pulse">
                  New code sent successfully!
                </p>
              )}
            </div>

            <div className="text-center pt-4 border-t border-gray-800/50">
              <button
                type="button"
                onClick={() => router.push("/microestate/auth")}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mx-auto"
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