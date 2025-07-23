"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, CreditCard, User, Menu, Users, Building } from "lucide-react";
import { toast } from "sonner";

const navLinks = [
  { href: "/microestate/landlord", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
  { href: "/microestate/landlord/properties", label: "Properties", icon: <Building className="w-4 h-4" /> },
  { href: "/microestate/landlord/tenants", label: "Tenants", icon: <Users className="w-4 h-4" /> },
  { href: "/microestate/landlord/documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
];

export default function LandlordNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = { name: "Amit Verma", avatar: "" };
  const initial = user.name ? user.name[0] : "L";

  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      const dropdown = document.getElementById("profile-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("microestate_user");
    if (typeof window !== 'undefined') {
      document.cookie = 'microauthToken=; Max-Age=0; path=/;';
    }
    router.push("/microestate");
    toast.success("You have been logged out.");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#181c24] border-b border-[#23232a] shadow-lg flex items-center justify-between px-4 md:px-8 py-3 md:py-4 transition-all duration-300 min-h-[68px]">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Open menu">
            <Menu className="w-7 h-7 text-orange-400" />
          </button>
          <span className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">Microestate</span>
          <span className="ml-3 text-sm font-semibold text-orange-200 bg-orange-500/10 px-3 py-1 rounded-lg hidden md:inline">Landlord Portal</span>
        </div>
        <div className="hidden lg:flex gap-4 ml-8 items-center">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-7 py-3 rounded-full font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
                  ${isActive ? "bg-[#23232a] text-orange-400 shadow-md border border-orange-400" : "bg-transparent text-white/80 hover:bg-[#23232a]/80 hover:text-orange-400"}
                `}
                style={{ boxShadow: isActive ? "0 2px 16px 0 #ff990033" : undefined }}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          {/* Avatar with tooltip */}
          <div className="relative group">
            <button
              className="flex items-center justify-center w-11 h-11 rounded-full bg-[#23232a] border border-orange-400/40 shadow hover:bg-orange-500/10 transition-all"
              aria-label="Landlord Profile"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xl">{initial}</span>
              )}
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">Landlord Profile</span>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 mt-3 w-44 bg-[#181c24] border border-orange-500/20 rounded-xl shadow-2xl z-50 py-2 flex flex-col animate-fadeIn"
              >
                <button
                  className="w-full text-left px-5 py-2 text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-t-xl transition-colors"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/microestate/landlord/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-5 py-2 text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-b-xl transition-colors"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl flex flex-col lg:hidden">
            <div className="flex flex-col gap-4 p-8">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
                      ${isActive ? "bg-[#23232a] text-orange-400 shadow-md border border-orange-400" : "bg-transparent text-white/80 hover:bg-[#23232a]/80 hover:text-orange-400"}
                    `}
                    style={{ boxShadow: isActive ? "0 2px 16px 0 #ff990033" : undefined }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      {/* Glass/blur separator */}
    </>
  );
} 