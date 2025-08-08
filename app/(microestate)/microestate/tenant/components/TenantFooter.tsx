"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function TenantFooter() {
  return (
    <footer className="w-full bg-[#181c24] border-t border-orange-500/10 text-gray-400 pt-12 pb-6 px-4 md:px-16 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
        {/* Branding */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-3xl text-white font-extrabold">🏢</span>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent">MicroEstate</span>
          </div>
          <div className="text-sm text-gray-300">Revolutionizing property management with AI-powered solutions. Your trusted partner for seamless landlord-tenant relationships and efficient real estate operations.</div>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-orange-400"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-orange-400"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-orange-400"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-orange-400"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        {/* Quick Links */}
        <div className="col-span-1 flex flex-col gap-2">
          <div className="text-lg font-bold text-orange-400 mb-2">Quick Links</div>
          <a href="/microestate/tenant/dashboard" className="hover:text-orange-400">Dashboard</a>
          <a href="/microestate/tenant/profile" className="hover:text-orange-400">Profile</a>
          <a href="/microestate/tenant/payments" className="hover:text-orange-400">Payments</a>
          <a href="/microestate/tenant/documents" className="hover:text-orange-400">Documents</a>
        </div>
        {/* Services */}
        <div className="col-span-1 flex flex-col gap-2">
          <div className="text-lg font-bold text-orange-400 mb-2">Services</div>
          <span>Property Management</span>
          <span>Rent Payments</span>
          <span>Maintenance</span>
          <span>Analytics</span>
        </div>
        {/* Support */}
        <div className="col-span-1 flex flex-col gap-2">
          <div className="text-lg font-bold text-orange-400 mb-2">Support</div>
          <span>Help Center</span>
          <span>Documentation</span>
          <span>Community</span>
          <span>Contact</span>
        </div>
        {/* Contact */}
        <div className="col-span-1 flex flex-col gap-2">
          <div className="text-lg font-bold text-orange-400 mb-2">Contact</div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" /> info@microestate.com</div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" /> +1 (555) 123-4567</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> Delhi, India</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-orange-500/10 text-xs text-gray-500">
        <div>&copy; {new Date().getFullYear()} MicroEstate. All rights reserved. Powered by innovation.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-orange-400">Privacy Policy</a>
          <a href="#" className="hover:text-orange-400">Terms of Service</a>
          <a href="#" className="hover:text-orange-400">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
} 