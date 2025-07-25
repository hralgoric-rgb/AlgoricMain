"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Target, BarChart3, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function EquityNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check authentication on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    }
  }, []);

  const navItems = [
    { href: "/equity", label: "Dashboard", icon: Home },
    { href: "/equity/properties", label: "Properties", icon: Building2 },
    { href: "/equity/portfolio", label: "Portfolio", icon: Target },
    { href: "/equity/dashboard", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      {/* Horizontal Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#a78bfa]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#a78bfa] rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">100Gaj</span>
                <span className="text-gray-300 text-xs">Equity Platform</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#a78bfa] text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-[#a78bfa]/20 hover:border hover:border-[#a78bfa]/30'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              {/* Post Property Button */}
              <Link
                href="/equity/property/post"
                className="ml-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <span>Post Property</span>
              </Link>
              {isAuthenticated && (
                <Link
                  href="/equity/kyc"
                  className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#a78bfa] to-purple-700 text-white border border-purple-400 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:from-purple-500 hover:to-purple-800"
                >
                  <span>KYC</span>
                </Link>
              )}
              {isAuthenticated && (
                <div className="relative ml-4">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
                    onClick={() => setShowProfileMenu((v) => !v)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-black border border-gray-700 rounded-lg shadow-lg z-50">
                      <Link href="/equity/profile" className="block px-4 py-2 text-white hover:bg-gray-800">My Profile</Link>
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800"
                        onClick={() => {
                          localStorage.removeItem("authToken");
                          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                          window.location.reload();
                        }}
                      >Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                className="text-white p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-sm border-t border-[#a78bfa]/30"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/30' 
                        : 'text-gray-300 hover:text-white hover:bg-[#a78bfa]/10'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              {/* Post Property Button for Mobile */}
              <Link
                href="/equity/property/post"
                className="block w-full mt-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 transition-all duration-300 text-center font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Post Property
              </Link>
              {isAuthenticated && (
                <Link
                  href="/equity/kyc"
                  className="block w-full mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#a78bfa] to-purple-700 text-white border border-purple-400 transition-all duration-300 text-center font-medium shadow-md hover:from-purple-500 hover:to-purple-800"
                  onClick={() => setMobileOpen(false)}
                >
                  KYC
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link
                    href="/equity/profile"
                    className="block w-full mt-2 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 text-center font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    className="block w-full mt-2 px-4 py-3 rounded-lg bg-red-600 text-white border border-red-400 text-center font-medium"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </>
  );
}
