"use client";
import { useState } from "react";
import { FloatingCircles, ParticleBackground } from "../../../_components/Background";
import { Building, Mail, User, Phone, Image as ImageIcon, Lock, Home, Briefcase, MapPin, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LandlordRegisterPage() {
  const [profilePic, setProfilePic] = useState<File | null>(null);
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
  const router = useRouter();

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
      setError("All fields are required");
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
      console.log("Sending registration data:", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        role: "landlord",
      });

      const response = await axios.post("/microestate/api/signup", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        role: "landlord",
      });
      
      console.log("Registration response:", response.data);
      
      if (response.data.success) {
        setSuccess(response.data.message);
        // Store email and role for verification page
        localStorage.setItem("pendingEmail", formData.email);
        localStorage.setItem("userRole", "landlord");
        // Redirect to verification page after 2 seconds
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
      const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-20 relative z-10">
        <form
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden max-w-lg w-full mx-4 px-8 py-10 animate-fadeIn"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
              <Building className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-1">
              Register as a Landlord
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" /> EMAIL ADDRESS*</label>
              <Input type="email" name="email" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" value={formData.email} onChange={handleChange} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><User className="w-4 h-4 text-orange-400" /> FIRST NAME*</label>
                <Input type="text" name="firstName" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><User className="w-4 h-4 text-orange-400" /> LAST NAME*</label>
                <Input type="text" name="lastName" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" /> PHONE NUMBER*</label>
              <Input type="tel" name="phone" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-orange-400" /> PROFILE PICTURE</label>
              <Input type="file" accept="image/*" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" onChange={e => setProfilePic(e.target.files?.[0] || null)} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> PASSWORD*</label>
                <Input type="password" name="password" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" value={formData.password} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> REPEAT PASSWORD*</label>
                <Input type="password" name="repeatPassword" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" value={formData.repeatPassword} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Briefcase className="w-4 h-4 text-orange-400" /> COMPANY NAME</label>
              <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> ADDRESS</label>
              <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Hash className="w-4 h-4 text-orange-400" /> TAX ID</label>
              <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            {error && <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
            {success && <div className="text-green-500 text-sm mt-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">{success}</div>}
            <Button type="submit" className="mt-6 w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl text-lg shadow-lg shadow-orange-500/20 transition-all duration-200" disabled={loading}>
              {loading ? "Registering..." : "Register as Landlord"}
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