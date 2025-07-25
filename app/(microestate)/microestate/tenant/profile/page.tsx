"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Edit, CheckCircle, XCircle, Lock, Eye, EyeOff, Trash2, KeyRound, ShieldCheck, LogOut, Home, Briefcase } from "lucide-react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import { motion } from "framer-motion";

const mockProfile = {
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  firstName: "Priya",
  lastName: "Sharma",
  email: "priya.sharma@email.com",
  emailVerified: true,
  phone: "+91 9876543211",
  phoneVerified: false,
  dob: "1998-05-15",
  gender: "Female",
  currentAddress: {
    street: "Urban Loft Apartment, 123 Main Street",
    city: "Cityville",
    state: "Delhi",
    zip: "100001",
    country: "India",
  },
  permanentAddress: {
    street: "456 Park Avenue",
    city: "Hometown",
    state: "UP",
    zip: "200002",
    country: "India",
  },
  occupation: "Software Engineer",
  employer: "Tech Solutions Pvt Ltd",
  workEmail: "priya@techsolutions.com",
  emergency: {
    name: "Amit Sharma",
    relationship: "Brother",
    phone: "+91 9123456789",
    alt: "",
  },
  lastLogin: "2025-07-25 22:45:00",
  twoFA: false,
};

const genders = ["Male", "Female", "Other"];

export default function TenantProfilePage() {
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ current: "", new: "" });
  const [twoFA, setTwoFA] = useState(profile.twoFA);
  const [avatar, setAvatar] = useState(profile.avatar);

  function handleChange(field, value, nested) {
    if (nested) {
      setProfile(p => ({ ...p, [nested]: { ...p[nested], [field]: value } }));
    } else {
      setProfile(p => ({ ...p, [field]: value }));
    }
  }

  function handleSave() {
    setEdit(false);
    // Save logic here
  }
  function handleCancel() {
    setProfile(mockProfile);
    setEdit(false);
  }
  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setProfile(p => ({ ...p, avatar: url }));
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
              <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 shadow-lg" />
              {edit && (
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1 cursor-pointer shadow-lg">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <Edit className="w-4 h-4" />
                </label>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</div>
              <div className="text-sm text-orange-300">Tenant Profile</div>
            </div>
          </div>
          <div>
            {!edit ? (
              <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-500/10" onClick={() => setEdit(true)}><Edit className="w-4 h-4 mr-1" /> Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}><CheckCircle className="w-4 h-4 mr-1" /> Save</Button>
                <Button variant="outline" className="border-red-400 text-red-400 hover:bg-red-500/10" onClick={handleCancel}><XCircle className="w-4 h-4 mr-1" /> Cancel</Button>
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
              <div className="flex items-center"><span className="w-40 text-gray-300">Full Name</span>{edit ? <><Input value={profile.firstName} onChange={e => handleChange("firstName", e.target.value)} className="mr-2" placeholder="First" /> <Input value={profile.lastName} onChange={e => handleChange("lastName", e.target.value)} placeholder="Last" /></> : <span className="text-white">{profile.firstName} {profile.lastName}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Email Address</span><span className="text-white flex items-center gap-2">{profile.email} {profile.emailVerified && <CheckCircle className="w-4 h-4 text-green-400" />}</span></div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Phone Number</span>{edit ? <Input value={profile.phone} onChange={e => handleChange("phone", e.target.value)} /> : <span className="text-white flex items-center gap-2">{profile.phone} {profile.phoneVerified ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Button size="sm" className="ml-2 bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded" >Verify</Button>}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Date of Birth</span>{edit ? <Input type="date" value={profile.dob} onChange={e => handleChange("dob", e.target.value)} /> : <span className="text-white">{profile.dob}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Gender</span>{edit ? <select className="rounded-md border border-input bg-transparent px-2 py-1 text-white" value={profile.gender} onChange={e => handleChange("gender", e.target.value)}>{genders.map(g => <option key={g}>{g}</option>)}</select> : <span className="text-white">{profile.gender}</span>}</div>
            </div>
          </Card>
        </motion.div>
        {/* Address Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="bg-white/5 border-2 border-orange-500 rounded-2xl shadow-xl p-6 mb-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400">
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Home className="w-5 h-5 text-orange-400" /> Address Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-orange-300 font-semibold mb-1">Current Address</div>
                {edit ? (
                  <>
                    <Input value={profile.currentAddress.street} onChange={e => handleChange("street", e.target.value, "currentAddress")} className="mb-1" placeholder="Street" />
                    <div className="flex gap-2 mb-1"><Input value={profile.currentAddress.city} onChange={e => handleChange("city", e.target.value, "currentAddress")} placeholder="City" /><Input value={profile.currentAddress.state} onChange={e => handleChange("state", e.target.value, "currentAddress")} placeholder="State" /></div>
                    <div className="flex gap-2"><Input value={profile.currentAddress.zip} onChange={e => handleChange("zip", e.target.value, "currentAddress")} placeholder="Zip Code" /><Input value={profile.currentAddress.country} onChange={e => handleChange("country", e.target.value, "currentAddress")} placeholder="Country" /></div>
                  </>
                ) : (
                  <div className="text-white whitespace-pre-line">{profile.currentAddress.street}, {profile.currentAddress.city}, {profile.currentAddress.state}, {profile.currentAddress.zip}, {profile.currentAddress.country}</div>
                )}
              </div>
              <div>
                <div className="text-orange-300 font-semibold mb-1">Permanent Address</div>
                {edit ? (
                  <>
                    <Input value={profile.permanentAddress.street} onChange={e => handleChange("street", e.target.value, "permanentAddress")} className="mb-1" placeholder="Street" />
                    <div className="flex gap-2 mb-1"><Input value={profile.permanentAddress.city} onChange={e => handleChange("city", e.target.value, "permanentAddress")} placeholder="City" /><Input value={profile.permanentAddress.state} onChange={e => handleChange("state", e.target.value, "permanentAddress")} placeholder="State" /></div>
                    <div className="flex gap-2"><Input value={profile.permanentAddress.zip} onChange={e => handleChange("zip", e.target.value, "permanentAddress")} placeholder="Zip Code" /><Input value={profile.permanentAddress.country} onChange={e => handleChange("country", e.target.value, "permanentAddress")} placeholder="Country" /></div>
                  </>
                ) : (
                  <div className="text-white whitespace-pre-line">{profile.permanentAddress.street}, {profile.permanentAddress.city}, {profile.permanentAddress.state}, {profile.permanentAddress.zip}, {profile.permanentAddress.country}</div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
        {/* Occupation & Work Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="bg-white/5 border-2 border-orange-500 rounded-2xl shadow-xl p-6 mb-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400">
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-orange-400" /> Occupation & Work Info</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center"><span className="w-40 text-gray-300">Occupation Title</span>{edit ? <Input value={profile.occupation} onChange={e => handleChange("occupation", e.target.value)} /> : <span className="text-white">{profile.occupation}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Employer/Company</span>{edit ? <Input value={profile.employer} onChange={e => handleChange("employer", e.target.value)} /> : <span className="text-white">{profile.employer}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Work Email</span>{edit ? <Input value={profile.workEmail} onChange={e => handleChange("workEmail", e.target.value)} /> : <span className="text-white">{profile.workEmail}</span>}</div>
            </div>
          </Card>
        </motion.div>
        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Card className="bg-white/5 border-2 border-orange-500 rounded-2xl shadow-xl p-6 mb-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400">
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-orange-400" /> Emergency Contact</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center"><span className="w-40 text-gray-300">Name</span>{edit ? <Input value={profile.emergency.name} onChange={e => handleChange("name", e.target.value, "emergency")} /> : <span className="text-white">{profile.emergency.name}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Relationship</span>{edit ? <Input value={profile.emergency.relationship} onChange={e => handleChange("relationship", e.target.value, "emergency")} /> : <span className="text-white">{profile.emergency.relationship}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Phone Number</span>{edit ? <Input value={profile.emergency.phone} onChange={e => handleChange("phone", e.target.value, "emergency")} /> : <span className="text-white">{profile.emergency.phone}</span>}</div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Alternate Contact</span>{edit ? <Input value={profile.emergency.alt} onChange={e => handleChange("alt", e.target.value, "emergency")} /> : <span className="text-white">{profile.emergency.alt}</span>}</div>
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
              <div className="flex items-center"><span className="w-40 text-gray-300">Two-Factor Auth</span><Button size="sm" className={`ml-2 ${twoFA ? "bg-green-600" : "bg-gray-600"} text-white py-1 px-2 rounded`} onClick={() => setTwoFA(v => !v)}>{twoFA ? <ShieldCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} {twoFA ? "Enabled" : "Disabled"}</Button></div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Delete Account</span><Button size="sm" className="ml-2 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded" onClick={() => setShowDeleteModal(true)}><Trash2 className="w-4 h-4" /> Delete</Button></div>
              <div className="flex items-center"><span className="w-40 text-gray-300">Last Login</span><span className="text-white">{profile.lastLogin}</span></div>
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
              <Input type={showPwd ? "text" : "password"} placeholder="New Password" value={pwd.new} onChange={e => setPwd(p => ({ ...p, new: e.target.value }))} />
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