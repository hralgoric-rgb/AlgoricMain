"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Edit, CheckCircle, XCircle, Lock, Eye, EyeOff, Trash2, KeyRound, ShieldCheck, LogOut, Home, Briefcase } from "lucide-react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import { motion } from "framer-motion";
import { useAuth } from "@/app/(microestate)/Context/AuthProvider";
import axios from "axios";




export default function TenantProfilePage() {
  const {user} = useAuth()
  const [edit, setEdit] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ current: "", new: "" });
 const [firstName , setfirstName] = useState("")
    const [lastname , setlastname] = useState("")
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [profilePic, setProfilePic] = useState("");
    // firstName

  function handleSave() {
    setEdit(false);
    // Save logic here
  }
  const userId = user?.id

  useEffect(() => {

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`/microestate/api/users/${userId}`);
      console.log("Current user fetched Successfully");

      const userData = response.data.user;
      console.log("response", userData);


       setfirstName(userData.firstName || "");
      setlastname(userData.lastName || "")
      setPhone(userData.phone || "");
      setlastname(userData.lastName || " ")
           setEmail(userData.email || "")
           setProfilePic(userData.profilePic || "")

    } catch (error) {
      console.log("Error while getting current user", error);
    }
  };

  getCurrentUser();
}, [userId]); // ✅ re-run when userId is available


  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden">
      <TenantNavbar />
      <div className="mt-6" />
      <div className="max-w-4xl mx-auto w-full mt-[72px] mb-16 px-2 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={profilePic} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 shadow-lg" />
              {edit && (
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1 cursor-pointer shadow-lg">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <Edit className="w-4 h-4" />
                </label>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white"> {firstName} {lastname}</div>
              <div className="text-sm text-orange-300">Tenant Profile</div>
            </div>
          </div>
          <div>
            {!edit ? (
              <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-500/10" onClick={() => setEdit(true)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}><CheckCircle className="w-4 h-4 mr-1" /> Save</Button>
                <Button variant="outline" className="border-red-400 text-red-400 hover:bg-red-500/10"><XCircle className="w-4 h-4 mr-1" /> Cancel</Button>
              </div>
            )}
          </div>
        </div>
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="bg-white/5 border-2 border-orange-500 rounded-2xl shadow-xl p-6 mb-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400">
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-orange-400" /> Personal Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center"><span className="w-40 text-gray-300">Full Name</span>{edit ? <><Input value={firstName} className="mr-2" placeholder="First" /> <Input value={firstName}  placeholder="Last" /></> : <span className="text-white">{firstName} {lastname}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Email Address</span><span className="text-white flex items-center gap-2">{email} </span></div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Phone Number</span>  : <span className="text-white flex items-center gap-2">{phone}</span></div>
            </div>
          </Card>
        </motion.div> 
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="bg-white/5 border-2 border-orange-500 rounded-2xl shadow-xl p-6 mb-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400">
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-orange-400" /> Account Settings</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center"><span className="w-40 text-gray-300">Change Password</span><Button size="sm" className="ml-2 bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded" onClick={() => setShowPwdModal(true)}><KeyRound className="w-4 h-4" /> Change</Button></div>
           
              <div className="flex items-center"><span className="w-40 text-gray-300">Delete Account</span><Button size="sm" className="ml-2 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded" onClick={() => setShowDeleteModal(true)}><Trash2 className="w-4 h-4" /> Delete</Button></div>
             
            </div>
          </Card>
        </motion.div>
      </div>
      {/* Change Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#181c24] rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button className="absolute top-4 right-4" onClick={() => setShowPwdModal(false)}><XCircle className="w-6 h-6 text-white/70 hover:text-white" /></button>
            <div className="text-xl font-bold text-white mb-4 flex items-center gap-2"><KeyRound className="w-6 h-6 text-orange-400" /> Change Password</div>
            <div className="flex flex-col gap-3">
              <Input type={showPwd ? "text" : "password"} placeholder="Current Password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} />
           
              <Button variant="ghost" className="self-end text-orange-400" onClick={() => setShowPwd(v => !v)}>{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {showPwd ? "Hide" : "Show"}</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-2">Update Password</Button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#181c24] rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button className="absolute top-4 right-4" onClick={() => setShowDeleteModal(false)}><XCircle className="w-6 h-6 text-white/70 hover:text-white" /></button>
            <div className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Trash2 className="w-6 h-6 text-red-400" /> Delete Account</div>
            <div className="text-white mb-4">Are you sure you want to delete your account? This action cannot be undone.</div>
            <div className="flex gap-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowDeleteModal(false)}>Delete</Button>
              <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-500/10" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      <TenantFooter />
    </div>
  );
} 