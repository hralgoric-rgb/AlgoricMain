"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FloatingCircles, ParticleBackground } from "../../../_components/Background";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/microestate/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess("Password reset successful! Redirecting to login...");
      setLoading(false);
      setTimeout(() => router.push("/microestate/auth"), 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResending(true);
    try {
      const res = await fetch("/microestate/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend code. Please try again.");
        setResending(false);
        return;
      }
      setSuccess("Verification code resent. Please check your email.");
      setResending(false);
    } catch (err) {
      setError("Failed to resend code. Please try again.");
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-between relative overflow-hidden">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-20 relative z-10">
        <form
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden max-w-md w-full mx-4 px-8 py-10 animate-fadeIn"
          onSubmit={handleReset}
        >
          <button type="button" className="text-orange-400 hover:underline text-sm mb-4 text-left" onClick={() => router.back()}>&lt; Back</button>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-1">
            Verification Code
          </h2>
          <p className="text-gray-400 text-center text-sm mb-6">Please enter the verification code sent to your email to reset your password.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-1">Verification Code</label>
              <Input
                type="text"
                maxLength={6}
                minLength={6}
                pattern="[0-9]{6}"
                placeholder="Enter 6-digit code"
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 text-center tracking-widest text-lg"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                required
              />
              <div className="text-xs text-gray-400 mt-1">{code.length}/6 digits</div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">New Password</label>
              <Input
                type="password"
                placeholder="New password"
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
            {success && <div className="text-green-500 text-sm mt-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">{success}</div>}
            <Button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl text-lg shadow-lg shadow-orange-500/20 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full mt-2 bg-gray-800 text-orange-400 border border-orange-500/20 hover:bg-gray-900"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend Code"}
            </Button>
          </div>
        </form>
      </div>
      <footer className="w-full py-6 bg-black/80 border-t border-orange-500/10 text-gray-400 text-center text-xs relative z-10">
        &copy; {new Date().getFullYear()} Microestate. All rights reserved.
      </footer>
    </div>
  );
} 