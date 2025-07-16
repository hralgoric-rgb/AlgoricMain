"use client";
import { useState } from "react";
import { FloatingCircles, ParticleBackground } from "../../../_components/Background";
import { Building, Mail, User, Phone, Image as ImageIcon, Lock, MapPin, IdCard, Briefcase, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TenantRegisterPage() {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex flex-col justify-between">
      <FloatingCircles />
      <ParticleBackground />
      <div className="flex flex-col items-center justify-center flex-1 py-20 relative z-10">
        <form className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-orange-500/20 rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden max-w-lg w-full mx-4 px-8 py-10 animate-fadeIn">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
              <Building className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent mb-1">
              Register as a Tenant
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" /> EMAIL ADDRESS*</label>
              <Input type="email" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><User className="w-4 h-4 text-orange-400" /> FIRST NAME</label>
                <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><User className="w-4 h-4 text-orange-400" /> LAST NAME</label>
                <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" /> PHONE NUMBER</label>
              <Input type="tel" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-orange-400" /> PROFILE PICTURE</label>
              <Input type="file" accept="image/*" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" onChange={e => setProfilePic(e.target.files?.[0] || null)} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> PASSWORD*</label>
                <Input type="password" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> REPEAT PASSWORD*</label>
                <Input type="password" required className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> ADDRESS</label>
              <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><IdCard className="w-4 h-4 text-orange-400" /> ID PROOF</label>
              <Input type="file" accept="image/*,.pdf" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" onChange={e => setIdProof(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><Briefcase className="w-4 h-4 text-orange-400" /> EMPLOYMENT STATUS</label>
              <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-400" /> EMERGENCY CONTACT</label>
              <Input type="text" className="bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500" />
            </div>
            <Button type="submit" className="mt-6 w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl text-lg shadow-lg shadow-orange-500/20 transition-all duration-200">
              Register as Tenant
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