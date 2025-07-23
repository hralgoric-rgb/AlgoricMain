"use client";
import React, { useState } from "react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import { BadgeCheck, Edit2, User, Mail, Phone, Calendar, ShieldCheck, Home, KeyRound, EyeOff, Eye, Moon, Bell, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Background from "../../../_components/Background";

const mockProfile = {
  id: "TNT-1001",
  email: "tenant@example.com",
  name: "Priya Sharma",
  phone: "+91 9876543210",
  altContact: "",
  emergencyContact: "+91 9123456789",
  dob: "1998-05-12",
  gender: "Female",
  aadhaar: "XXXX-XXXX-1234",
  profilePic: "https://i.pravatar.cc/100?img=3",
  verified: true,
  status: "Active",
  leaseStart: "2024-01-01",
  leaseEnd: "2025-12-31",
  property: "Urban Heights, Tower B-302",
  landlord: "Amit Verma",
  rent: 18000,
  rentCycle: "1st of every month",
  leaseStatus: "Ongoing",
};

export default function TenantProfile() {
  const [profilePic, setProfilePic] = useState(mockProfile.profilePic);
  const [name, setName] = useState(mockProfile.name);
  const [phone, setPhone] = useState(mockProfile.phone);
  const [altContact, setAltContact] = useState(mockProfile.altContact);
  const [emergencyContact, setEmergencyContact] = useState(mockProfile.emergencyContact);
  const [dob, setDob] = useState(mockProfile.dob);
  const [gender, setGender] = useState(mockProfile.gender);
  const [aadhaar, setAadhaar] = useState(mockProfile.aadhaar);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settings, setSettings] = useState({ dark: true, email: true, whatsapp: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState({ password: false, settings: false });

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfilePic(url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    }, 1200);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password changed successfully!");
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setExpanded({ ...expanded, password: false });
      setTimeout(() => setSuccess(""), 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <TenantNavbar />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-8 flex flex-col gap-8">
        <h2 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent">Profile</h2>
        {/* Profile Overview */}
        <div className="bg-glass border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row gap-10 items-center animate-fadeIn">
          <div className="relative group">
            <img src={profilePic} alt="Profile" className="w-28 h-28 rounded-full border-4 border-orange-500 object-cover shadow-lg" />
            <label className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 cursor-pointer shadow-lg transition">
              <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
              <Edit2 className="w-4 h-4" />
            </label>
          </div>
          <div className="flex-1 flex flex-col gap-2 items-center sm:items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{name}</span>
              {mockProfile.verified && <BadgeCheck className="w-5 h-5 text-green-400" title="Verified Tenant" />}
              <span className="ml-2 px-2 py-1 text-xs rounded bg-green-500/20 text-green-400 font-semibold">Verified Tenant</span>
            </div>
            <div className="flex gap-2 flex-wrap text-sm text-gray-400">
              <span>ID: {mockProfile.id}</span>
              <span>Role: Tenant</span>
              <span>Status: <span className={mockProfile.status === "Active" ? "text-green-400" : "text-red-400"}>{mockProfile.status}</span></span>
            </div>
            <div className="flex gap-2 flex-wrap text-sm text-gray-400">
              <span>Lease: {mockProfile.leaseStart} → {mockProfile.leaseEnd}</span>
            </div>
          </div>
        </div>
        {/* Personal Info Form */}
        <form className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Full Name</label>
            <input type="text" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Email</label>
            <input type="email" className="w-full p-3 rounded bg-[#23232a] text-gray-400 border border-orange-500/20" value={mockProfile.email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Phone Number</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Alternate Contact</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={altContact} onChange={e => setAltContact(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Emergency Contact</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Enter emergency contact" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Date of Birth</label>
            <input type="date" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={dob} onChange={e => setDob(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Gender</label>
            <select className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Aadhaar / Govt. ID</label>
            <input type="text" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={aadhaar} onChange={e => setAadhaar(e.target.value)} placeholder="Enter Aadhaar or Govt. ID" required />
          </div>
          <div className="md:col-span-2 flex gap-4 justify-end mt-2">
            <button type="button" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition">Cancel</button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">Save Changes</button>
          </div>
          {success && <div className="md:col-span-2 mt-2 text-green-400 text-center font-semibold">{success}</div>}
        </form>
        {/* Lease Details Summary */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 flex flex-col gap-2 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-orange-400" />
            <span className="text-lg font-bold text-white">Lease Details</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div><span className="text-gray-400">Property:</span> {mockProfile.property}</div>
            <div><span className="text-gray-400">Landlord:</span> {mockProfile.landlord}</div>
            <div><span className="text-gray-400">Monthly Rent:</span> ₹{mockProfile.rent}</div>
            <div><span className="text-gray-400">Rent Cycle:</span> {mockProfile.rentCycle}</div>
            <div><span className="text-gray-400">Lease Duration:</span> {mockProfile.leaseStart} → {mockProfile.leaseEnd}</div>
            <div><span className="text-gray-400">Status:</span> <span className={`px-2 py-1 rounded text-xs font-bold ${mockProfile.leaseStatus === "Ongoing" ? "bg-green-500/20 text-green-400" : mockProfile.leaseStatus === "Expiring Soon" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{mockProfile.leaseStatus}</span></div>
          </div>
        </div>
        {/* Change Password Section */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn">
          <button type="button" className="flex items-center gap-2 text-orange-400 font-bold mb-4" onClick={() => setExpanded({ ...expanded, password: !expanded.password })}>
            <KeyRound className="w-5 h-5" />
            Change Password
            <span className="ml-2 text-xs text-gray-400">{expanded.password ? "(Hide)" : "(Show)"}</span>
          </button>
          {expanded.password && (
            <form className="flex flex-col gap-3 mt-2" onSubmit={handleChangePassword}>
              <input type="password" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              <input type="password" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <input type="password" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg">Update Password</button>
            </form>
          )}
        </div>
        {/* User Settings */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn">
          <button type="button" className="flex items-center gap-2 text-orange-400 font-bold mb-4" onClick={() => setExpanded({ ...expanded, settings: !expanded.settings })}>
            <ShieldCheck className="w-5 h-5" />
            User Settings
            <span className="ml-2 text-xs text-gray-400">{expanded.settings ? "(Hide)" : "(Show)"}</span>
          </button>
          {expanded.settings && (
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <Moon className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">Dark Mode</span>
                <input type="checkbox" checked={settings.dark} onChange={e => setSettings(s => ({ ...s, dark: e.target.checked }))} className="ml-auto form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-400" />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Bell className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">Email Notifications</span>
                <input type="checkbox" checked={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.checked }))} className="ml-auto form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-400" />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <MessageCircle className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">WhatsApp Updates</span>
                <input type="checkbox" checked={settings.whatsapp} onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.checked }))} className="ml-auto form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-400" />
              </label>
            </div>
          )}
        </div>
      </main>
      <TenantFooter />
    </div>
  );
} 