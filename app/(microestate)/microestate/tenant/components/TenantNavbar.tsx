import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, CreditCard, User, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navLinks = [
  { href: "/microestate/tenant/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
  { href: "/microestate/tenant/payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
  { href: "/microestate/tenant/documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
  { href: "/microestate/tenant/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
];

export default function TenantNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = { name: "Priya Sharma", avatar: "" };
  const initial = user.name ? user.name[0] : "T";

  // Close dropdown on outside click
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

  const handleLogout = async () => {
    localStorage.removeItem("microestate_user");
    // Remove auth cookie if present
    if (typeof window !== 'undefined') {
      // Dynamically import js-cookie only on the client
      const Cookies = (await import("js-cookie")).default;
      Cookies.remove('microauthToken');
    }
    router.push("/microestate");
    toast.success("You have been logged out.");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-glass border-b-2 border-gradient-to-r from-orange-500 to-red-500 shadow-xl flex items-center justify-between px-8 py-4 transition-all duration-300 min-h-[80px] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">Microstate</span>
          <span className="ml-3 text-base font-semibold text-orange-200 bg-orange-500/10 px-4 py-1 rounded-lg border border-orange-400/30">Tenant Portal</span>
        </div>
        <div className="flex gap-6 ml-8 items-center">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-semibold text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
                  ${isActive ? "border-orange-400 text-orange-400 bg-gradient-to-r from-orange-500/10 to-red-500/10 shadow-lg shadow-orange-500/40" : "border-orange-400/30 text-white/90 hover:border-orange-400 hover:text-orange-400 hover:bg-orange-500/10"}
                `}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-4 border-white/30 shadow-lg text-white font-bold text-2xl hover:scale-105 transition-all"
              aria-label="Tenant Profile"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <span>{initial}</span>
              )}
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">Tenant Profile</span>
            {dropdownOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 mt-3 w-44 bg-[#181c24] border border-orange-500/20 rounded-2xl shadow-2xl z-50 py-2 flex flex-col animate-fadeIn"
              >
                <button
                  className="w-full text-left px-5 py-2 text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-t-2xl transition-colors"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/microestate/tenant/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-5 py-2 text-white hover:bg-orange-500/20 hover:text-orange-400 rounded-b-2xl transition-colors"
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
      <div className="w-full h-[2.5px] bg-gradient-to-r from-orange-400/30 via-white/10 to-orange-400/30 backdrop-blur-sm shadow-sm" />
    </>
  );
} 