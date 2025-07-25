"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "../../components/GoogleLoginButton";

export default function EquityLoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [userId, setUserId] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/equity";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (isLogin) {
        res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } else {
        res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        // If login and email not verified, show OTP input and store userId
        if (isLogin && data.error === "Email not verified" && data.userId) {
          setUserId(data.userId);
          setShowOtp(true);
          setLoading(false);
          return;
        }
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }
      // If signup, show OTP input and store userId
      if (!isLogin && data.userId) {
        setUserId(data.userId);
        setShowOtp(true);
        setLoading(false);
        return;
      }
      // Store JWT token if login
      if (isLogin && data.token) {
        localStorage.setItem("authToken", data.token);
        document.cookie = `authToken=${data.token}; path=/;`;
      }
      setLoading(false);
      router.push(redirect);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Invalid code");
        setLoading(false);
        return;
      }
      setOtpSuccess("Email verified! You can now log in.");
      setShowOtp(false);
      setIsLogin(true);
      setLoading(false);
    } catch (err) {
      setOtpError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage("");
    setOtpError("");
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendMessage(data.error || "Failed to resend OTP");
        setResendLoading(false);
        return;
      }
      setResendMessage("OTP resent to your email.");
      setResendLoading(false);
    } catch (err) {
      setResendMessage("An error occurred. Please try again.");
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-black/80 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md z-10 border border-purple-400/30"
      >
        {showOtp ? (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-center mb-2 text-white">Verify Your Email</h2>
            <p className="text-center text-purple-300 mb-6">Enter the OTP sent to your email address.</p>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none text-center text-xl tracking-widest"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              required
              placeholder="Enter OTP"
            />
            {otpError && <div className="text-red-400 text-sm text-center">{otpError}</div>}
            {otpSuccess && <div className="text-green-400 text-sm text-center">{otpSuccess}</div>}
            {resendMessage && <div className={`text-sm text-center ${resendMessage.includes('OTP resent') ? 'text-green-400' : 'text-red-400'}`}>{resendMessage}</div>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 rounded-lg mt-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            <button
              type="button"
              className="w-full mt-2 py-2 rounded-lg bg-gray-800 text-purple-300 border border-purple-400 hover:bg-gray-900 transition-all duration-300 font-medium"
              onClick={handleResendOtp}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-2 text-white">
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="text-center text-purple-300 mb-6">
              {isLogin ? "Login to post your property and manage your investments." : "Sign up to start investing and posting properties."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-400 text-sm text-center">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 rounded-lg mt-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-700" />
              <span className="mx-3 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-700" />
            </div>
            <GoogleLoginButton />
            <div className="mt-6 text-center">
              <span className="text-gray-300 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                className="ml-2 text-purple-400 hover:underline text-sm font-medium"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
          </>
        )}
      </motion.div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Decorative blurred gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700 rounded-full opacity-20 blur-2xl" />
      </div>
    </div>
  );
} 