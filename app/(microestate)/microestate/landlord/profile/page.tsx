"use client";
import React, { useState } from "react";
import { BadgeCheck, Edit2, User, Mail, Phone, Calendar, ShieldCheck, Home, KeyRound, EyeOff, Eye, Moon, Bell, MessageCircle, Building } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/(microestate)/Context/AuthProvider";
import axios from "axios";
import { useEffect } from "react";




export default function LandlordProfile() {
 const { user } = useAuth();
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState({ password: false, settings: false });

  const [name, setName] = useState("");
  const [lastname , setlastname] = useState("")
  const [role  , setrole] = useState("")
  const [UserId , setuserID] = useState("")

const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");


  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  // Fetch profile data
 useEffect(() => {
  const fetchCurrent = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(`/microestate/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("microestate_user")}`,
        },
        withCredentials: true,
      });

      const userData = response.data.user;
      console.log("response", userData);

      // Set the values
      setName(userData.firstName || "");
      setlastname(userData.lastName || "")
      setPhone(userData.phone || "");
      setrole(userData.role || "")
      setuserID(userData._id || " ")
      setEmail(userData.email || " ")

     } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  fetchCurrent();
}, [userId]);


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
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-8 flex flex-col gap-8">
        {/* Profile Overview */}

        <div className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row gap-8 items-center animate-fadeIn">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-orange-500 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl select-none">
                {name ? name.charAt(0).toUpperCase() : "L"}
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2 items-center sm:items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{name} {lastname}</span>
                <span className="ml-2 px-2 py-1 text-xs rounded bg-green-500/20 text-green-400 font-semibold">Verified Landlord</span>
            </div>
            <div className="flex gap-2 flex-wrap text-sm text-gray-400">
              <span>ID: {userId}</span>
              <span>Role: {role}</span>
                         </div>
            {/* <div className="flex gap-2 flex-wrap text-sm text-gray-400">
              <span>Properties: {mockProfile.properties}</span>
              <span>Tenants: {mockProfile.tenants}</span>
              <span>Monthly Income: ₹{mockProfile.monthlyIncome.toLocaleString()}</span>
            </div> */}
          </div>
        </div>
        {/* Personal Info Form */}
        <form className="bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-xl p-6 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6" >
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Full Name</label>
            <input type="text" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={name}  onChange={e => setName(e.target.value)} placeholder="Enter full name" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Email</label>
            <input type="email" className="w-full p-3 rounded bg-[#23232a] text-gray-400 border border-orange-500/20" value= {email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Phone Number</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" required />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Alternate Contact</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={altContact} onChange={e => setAltContact(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Emergency Contact</label>
            <input type="tel" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Enter emergency contact" required />
          </div> */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Date of Birth</label>
            <input type="date" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={dob} onChange={e => setDob(e.target.value)} required />
          </div> */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Gender</label>
            <select className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div> */}
          {/* <div>
            <label className="block text-sm font-semibold text-white mb-1">Aadhaar / Govt. ID</label>
            <input type="text" className="w-full p-3 rounded bg-[#23232a] text-white border border-orange-500/20" value={aadhaar} onChange={e => setAadhaar(e.target.value)} placeholder="Enter Aadhaar or Govt. ID" required />
          </div> */}
          {/* <div className="md:col-span-2 flex gap-4 justify-end mt-2">
            <button type="button" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition">Cancel</button>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">Save Changes</button>
          </div> */}
               </form>
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
      </main>
    </div>
  )
  }
  

function setName(arg0: any) {
  throw new Error("Function not implemented.");
}

