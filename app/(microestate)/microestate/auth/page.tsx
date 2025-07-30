"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Building,
  ArrowLeft,
  Mail,
  Lock,
  CheckCircle,
  Key,
} from "lucide-react";
import {
  FloatingCircles,
  ParticleBackground,
} from "../../_components/Background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../Context/AuthProvider";
import { signIn, getSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [currentView, setCurrentView] = useState<
    "main" | "forgot-password" | "reset-password"
  >("main");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  // Changes made by Priya - Adding verification code state for enhanced security
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState(""); // Store email for password reset

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

      if (response && response.ok) {
        setSuccess("Logged in successfully!");

        // Fetch session data after successful login
        const session = await getSession();

        if (session && session.user) {
          console.log("Session data:", session);
          console.log("User data:", session.user);

          const { user } = session;

          // Update your auth context if needed
          login({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified || false,
          });

          // Redirect based on role
          setTimeout(() => {
            if (user.role === "landlord") {
              router.push("/microestate/landlord");
            } else if (user.role === "tenant") {
              router.push("/microestate/tenant");
            } else {
              router.push("/microestate");
            }
          }, 1000);
        }
      } else {
        setError(response?.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordEmail) {
      setError("Email address is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      console.log("Sending forgot password request for:", forgotPasswordEmail);

      const response = await axios.post(
        "/microestate/api/auth/forgot-password",
        {
          email: forgotPasswordEmail,
        }
      );
      

      console.log("Forgot password response:", response.data);

      if (response.data.success) {
        setSuccess(
          response.data.message ||
          "Password reset instructions have been sent to your email address. Please check your inbox."
        );

        // Store email for reset password view
        setResetEmail(forgotPasswordEmail);

        // Clear the email field
        setForgotPasswordEmail("");

        // Redirect to reset password view after a delay
        setTimeout(() => {
          setCurrentView("reset-password");
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.error || "Failed to send reset instructions");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);

      let errorMessage = "An error occurred while sending reset instructions";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Changes made by Priya - Adding verification code validation for enhanced security
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }
    
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Changes made by Priya - Updated API call to include verification code for secure password reset
      const response = await axios.post('/microestate/api/auth/reset-password', {
        email: resetEmail,
        code: verificationCode,
        password: resetPasswordData.newPassword
      });
      
      if (response.data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        
        // Clear form data
        setResetPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
        setVerificationCode(""); // Changes made by Priya - Clear verification code after successful reset
        
        // Redirect to login after success
        setTimeout(() => {
          setCurrentView("main");
          setSuccess(null);
        }, 2000);
      } else {
        setError(response.data.error || "Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(error.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (field: any) => (
    <div key={field.id} className="group">
      <Label className="text-gray-300 text-sm font-medium mb-2 block">
        {field.label}
      </Label>
      <div className="relative">
        {field.type === "select" ? (
          <select
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"
          >
            {field.options?.map((option: any) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-800 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            type={
              field.hasToggle
                ? showPassword
                  ? "text"
                  : "password"
                : field.type
            }
            value={field.value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"
          />
        )}
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
    </div>
  );

  // Clear messages when switching views
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [currentView]);

  const renderMainView = () => (
    <>
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
          <div className="space-y-4">{loginFields.map(renderInputField)}</div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm animate-fadeIn flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

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

        {/* Register Links */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <p className="text-center text-gray-400 text-sm mb-4">
            Don't have an account?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/microestate/register/tenant">
              <Button
                variant="outline"
                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200"
              >
                Register as Tenant
              </Button>
            </Link>
            <Link href="/microestate/register/landlord">
              <Button
                variant="outline"
                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200"
              >
                Register as Landlord
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  const renderForgotPasswordView = () => (
    <>
      <div className="relative px-8 py-6 bg-gradient-to-r from-orange-600/10 to-orange-400/10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5"></div>
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
          Reset Password
        </h2>
        <p className="text-center text-gray-300 text-sm">
          Enter your email to receive reset instructions
        </p>
      </div>
      <div className="p-8">
        <form
          onSubmit={handleForgotPassword}
          className="space-y-4 animate-slideIn"
        >
          <div className="group">
            <Label className="text-gray-300 text-sm font-medium mb-2 block flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400" />
              Email Address
            </Label>
            <div className="relative">
              <Input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm animate-fadeIn flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !forgotPasswordEmail}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden h-auto"
          >
            <span className="relative z-10">
              {loading ? "Sending..." : "Send Reset Instructions"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </Button>

          <div className="text-center pt-2">
            <Button
              type="button"
              variant="link"
              onClick={() => setCurrentView("main")}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-200 p-0 h-auto flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Button>
          </div>
        </form>

        {/* Additional Help */}
        <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
          <p className="text-gray-400 text-xs mb-2">Remember your password?</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentView("main")}
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200"
          >
            Sign In Instead
          </Button>
        </div>
      </div>
    </>
  );

  const renderResetPasswordView = () => (
    <>
      <div className="relative px-8 py-6 bg-gradient-to-r from-orange-600/10 to-orange-400/10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5"></div>
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Key className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
          Set New Password
        </h2>
        <p className="text-center text-gray-300 text-sm">
          Enter your new password below
        </p>
        <p className="text-center text-orange-400 text-xs mt-2">
          For: {resetEmail}
        </p>
      </div>
      <div className="p-8">
        <form onSubmit={handleResetPassword} className="space-y-4 animate-slideIn">
          <div className="space-y-4">
            {/* Changes made by Priya - Adding verification code field for enhanced security */}
            <div className="group">
              <Label className="text-gray-300 text-sm font-medium mb-2 block flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400" />
                Verification Code
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  maxLength={6}
                  minLength={6}
                  pattern="[0-9]{6}"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto text-center tracking-widest text-lg"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="text-xs text-gray-400 mt-1 text-center">{verificationCode.length}/6 digits</div>
            </div>

            {/* New Password Field */}
            <div className="group">
              <Label className="text-gray-300 text-sm font-medium mb-2 block flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-400" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={resetPasswordData.newPassword}
                  onChange={(e) => 
                    setResetPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))
                  }
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:bg-transparent h-auto"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <Label className="text-gray-300 text-sm font-medium mb-2 block flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-400" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => 
                    setResetPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))
                  }
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-orange-500/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40 h-auto"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:bg-transparent h-auto"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm animate-fadeIn flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden h-auto"
          >
            <span className="relative z-10">
              {loading ? "Resetting..." : "Reset Password"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </Button>

          {/* Changes made by Priya - Adding resend verification code button for better user experience */}
          <Button
            type="button"
            variant="outline"
            onClick={handleForgotPassword}
            disabled={loading}
            className="w-full py-3 px-6 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200"
          >
            Resend Verification Code
          </Button>

          <div className="text-center pt-2">
            <Button
              type="button"
              variant="link"
              onClick={() => setCurrentView("forgot-password")}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-200 p-0 h-auto flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Verification
            </Button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-20 relative z-10">
        <div className="relative z-10 w-full max-w-lg mx-auto px-2">
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
            {currentView === "main" && renderMainView()}
            {currentView === "forgot-password" && renderForgotPasswordView()}
            {currentView === "reset-password" && renderResetPasswordView()}
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