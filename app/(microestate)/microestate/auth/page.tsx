"use client";
import React, { useState, useEffect } from "react";
// Import your icons and GoogleLoginButton here
// import { Mail, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
// import GoogleLoginButton from "@/components/GoogleLoginButton";

const Login = () => {
  const [currentView, setCurrentView] = useState<"main" | "forgot-password">("main");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<0 | 1 | 2 | 3 | 4>(0); // 0-4 strength levels

  // Password strength calculation
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    setPasswordStrength(Math.min(4, strength) as 0 | 1 | 2 | 3 | 4);
  }, [password]);

  const getPasswordStrengthColor = (level: number) => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-500"];
    return colors[level] || "bg-gray-200";
  };

  const getPasswordStrengthLabel = (level: number) => {
    const labels = ["Very weak", "Weak", "Medium", "Strong", "Very strong"];
    return labels[level] || "";
  };

  // Dummy handlers for demonstration
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // TODO: Implement login logic
    setTimeout(() => {
      setLoading(false);
      setSuccess("Logged in successfully!");
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // TODO: Implement signup logic
    setTimeout(() => {
      setLoading(false);
      setSuccess("Account created successfully! You can now log in.");
    }, 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // TODO: Implement forgot password logic
    setTimeout(() => {
      setLoading(false);
      setSuccess("Reset instructions have been sent to your email.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">
            Welcome to 100 GAJ
          </h2>

          {/* Main auth view (login/signup) */}
          {currentView === "main" && (
            <>
              <div className="flex text-xl mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 pb-4 text-center font-medium ${activeTab === "login"
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-500"
                    }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 pb-4 text-center font-medium ${activeTab === "signup"
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-500"
                    }`}
                >
                  New account
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start">
                  {/* <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> */}
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start">
                  {/* <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> */}
                  <span>{success}</span>
                </div>
              )}

              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-4 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                      >
                        {/* {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />} */}
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentView("forgot-password")}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              )}

              {/* Signup Form */}
              {activeTab === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-medium mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full pl-4 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                      >
                        {/* {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />} */}
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Password strength:</span>
                        <span className={`text-xs font-medium ${passwordStrength === 0 ? 'text-red-500' :
                            passwordStrength === 1 ? 'text-orange-500' :
                              passwordStrength === 2 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                          {getPasswordStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full flex space-x-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`h-1 flex-1 rounded-full ${bar <= passwordStrength
                                ? getPasswordStrengthColor(passwordStrength)
                                : 'bg-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>At least 8 characters</p>
                      <p>Mix of letters and numbers</p>
                      <p>At least 1 special character</p>
                      <p>At least 1 lowercase letter and 1 uppercase letter</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAgent"
                      checked={isAgent}
                      onChange={(e) => setIsAgent(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="isAgent" className="text-gray-700">
                      I am a landlord or industry professional
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    By submitting, I accept 100 GAJ&apos;s{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-600">
                      terms of use
                    </a>
                    .
                  </p>
                </form>
              )}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or connect with
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {/* <GoogleLoginButton /> */}
                <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                  Google Login
                </button>
              </div>
            </>
          )}

          {/* Forgot Password View */}
          {currentView === "forgot-password" && (
            <>
              <button
                type="button"
                onClick={() => setCurrentView("main")}
                className="flex items-center text-orange-500 hover:text-orange-600 mb-6"
              >
                ← Back to login
              </button>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reset your password
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              {error && (
                <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start">
                  {/* <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> */}
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start">
                  {/* <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> */}
                  <span>{success}</span>
                </div>
              )}
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;