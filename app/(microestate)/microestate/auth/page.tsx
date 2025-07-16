"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Building,
} from "lucide-react";
import {
  FloatingCircles,
  ParticleBackground,
} from "../../_components/Background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../../_components/GoogleLoginButton";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"main" | "forgot-password">(
    "main"
  );
  // Remove activeTab and all signup logic
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "tenant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<0 | 1 | 2 | 3 | 4>(
    0
  );

  const loginFields = [
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      value: formData.email,
      required: true,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      value: formData.password,
      required: true,
      hasToggle: true,
    },
  ];

  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength++;

    setPasswordStrength(Math.min(4, strength) as 0 | 1 | 2 | 3 | 4);
  }, [formData.password]);

  const getPasswordStrengthColor = (level: number) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-400",
      "bg-green-500",
    ];
    return colors[level] || "bg-gray-600";
  };

  const getPasswordStrengthLabel = (level: number) => {
    const labels = ["Very weak", "Weak", "Medium", "Strong", "Very strong"];
    return labels[level] || "";
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
      } else {
        setSuccess("Logged in successfully!");
      }

      if (response?.ok) {
        router.push("/microestate");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post("/microestate/api/signup", formData);

      console.log("signup resp", response);

      if (response?.data?.success) {
        setSuccess(response.data?.message);
      }

      router.push("/microestate");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        console.error(error.response.data.error);
        setError(error.response.data.error);
      } else {
        console.error(error, "Error in signup");
        setError("An error occurred during signup");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Reset instructions have been sent to your email.");
    }, 1000);
  };

  const renderInputField = (field: any) => (
    <div key={field.id} className="group">
      <Label className="text-gray-300 text-sm font-medium mb-2 block">
        {field.label}
      </Label>
      <div className="relative">
        <Input
          type={
            field.hasToggle ? (showPassword ? "text" : "password") : field.type
          }
          value={field.value}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"
        />
        {field.hasToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:bg-transparent h-auto"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {field.showStrength && formData.password && (
        <div className="mt-2 animate-fadeIn">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Password strength:</span>
            <span
              className={`text-xs font-medium ${
                passwordStrength === 0
                  ? "text-red-400"
                  : passwordStrength === 1
                  ? "text-orange-400"
                  : passwordStrength === 2
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {getPasswordStrengthLabel(passwordStrength)}
            </span>
          </div>
          <div className="w-full flex space-x-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  bar <= passwordStrength
                    ? getPasswordStrengthColor(passwordStrength)
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 space-y-1 text-xs text-gray-400">
            <p>• At least 8 characters • Mix of letters and numbers</p>
            <p>• At least 1 special character • Upper and lowercase letters</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-20 relative z-10">
        <div className="relative z-10 w-full max-w-lg mx-auto px-2">
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
            <div className="relative px-8 py-6 bg-gradient-to-r from-orange-600/10 to-orange-400/10">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5"></div>
              <div className="relative flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform hover:rotate-12 transition-transform duration-300">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
                Welcome to 100 GAJ
              </h2>
              <p className="text-center text-gray-300 text-sm">
                Your gateway to modern real estate management
              </p>
            </div>
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-4 animate-slideIn">
                <div className="space-y-4">
                  {loginFields.map(renderInputField)}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden h-auto"
                >
                  <span className="relative z-10">
                    {loading ? "Signing in..." : "Sign in"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </Button>
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView("forgot-password")}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-200 p-0 h-auto"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-sm text-gray-400 whitespace-nowrap">Or sign in with</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>
              <div className="flex justify-center mb-4">
                <GoogleLoginButton />
              </div>
              <div className="text-center mt-4">
                <span className="text-gray-400 text-sm">Not a member? </span>
                <Link href="/microestate/register" className="text-orange-400 hover:underline font-semibold text-sm">Create account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full py-6 bg-black/80 border-t border-orange-500/10 text-gray-400 text-center text-xs relative z-10">
        &copy; {new Date().getFullYear()} Microestate. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
