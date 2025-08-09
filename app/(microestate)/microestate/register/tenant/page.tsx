"use client";
import { useState, useEffect } from "react";
import { FloatingCircles, ParticleBackground } from "../../../_components/Background";
import { Building, Mail, User, Phone, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../Context/AuthProvider";
import { toast } from "sonner";

export default function TenantRegisterPage() {
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

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    repeatPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
      setError("All required fields must be filled");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      submitData.append("email", formData.email);
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("phone", formData.phone);
      submitData.append("password", formData.password);
      submitData.append("role", "tenant");

      console.log("Sending tenant registration data...");

      const response = await axios.post("/microestate/api/auth/signup", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Registration response:", response.data);
      
      if (response.data.success) {
        setSuccess(response.data.message || "Registration successful! You are now logged in.");
        // Store email and role for potential verification
        localStorage.setItem("pendingEmail", formData.email);
        localStorage.setItem("userRole", "tenant");
        localStorage.setItem("microestate_user", JSON.stringify(response.data.user));
        
        // Redirect to email verification page after successful registration
        setTimeout(() => {
          router.push("/microestate/verify-email");
        }, 2000);
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-8 sm:py-12 lg:py-20 relative z-10">
        <form 
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden max-w-2xl w-full mx-4 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 animate-fadeIn" 
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3 sm:mb-4">
              <Building className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
              Register as a Tenant
            </h2>
            <p className="text-center text-gray-400 text-sm">Create your tenant account to find properties</p>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" /> EMAIL ADDRESS*
              </label>
              <Input 
                type="email" 
                name="email"
                required 
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 h-12 px-4 rounded-xl" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </div>

            {/* First and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-400" /> FIRST NAME*
                </label>
                <Input 
                  type="text" 
                  name="firstName"
                  required
                  className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 h-12 px-4 rounded-xl" 
                  value={formData.firstName} 
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-400" /> LAST NAME*
                </label>
                <Input 
                  type="text" 
                  name="lastName"
                  required
                  className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 h-12 px-4 rounded-xl" 
                  value={formData.lastName} 
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" /> PHONE NUMBER*
              </label>
              <Input 
                type="tel" 
                name="phone"
                required
                className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 h-12 px-4 rounded-xl" 
                value={formData.phone} 
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-400" /> PASSWORD*
                </label>
                <Input 
                  type="password" 
                  name="password"
                  required
                  className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 h-12 px-4 rounded-xl" 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-400" /> REPEAT PASSWORD*
                </label>
                <Input 
                  type="password" 
                  name="repeatPassword"
                  required
                  className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500 h-12 px-4 rounded-xl" 
                  value={formData.repeatPassword} 
                  onChange={handleChange}
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 flex items-start gap-2">
                <div className="text-red-400 mt-0.5">⚠</div>
                <div>{error}</div>
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm bg-green-500/10 p-4 rounded-xl border border-green-500/20 flex items-start gap-2">
                <div className="text-green-400 mt-0.5">✓</div>
                <div>{success}</div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="mt-6 w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-orange-500/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Registering...
                </div>
              ) : (
                "Register as Tenant"
              )}
            </Button>
          </div>
        </form>
      </div>
      
      <footer className="w-full py-4 sm:py-6 bg-black/80 border-t border-orange-500/10 text-gray-400 text-center text-xs relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Microestate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}