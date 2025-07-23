"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Building, Users, FileText, LogOut, User, ChevronDown, Settings, UserCircle, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthProvider';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, isLandlord, isTenant, logout } = useAuth();

    // Navigation items based on authentication and role
    const getNavItems = () => {
        if (!isAuthenticated) {
            // Unauthenticated users - no navigation items
            return [];
        } else if (isLandlord) {
            // Landlords - landlord dashboard and properties
            return [
                { name: "landlord dashboard", path: "/microestate/landlord", icon: Building },
                { name: "properties", path: "/microestate/landlord/properties", icon: Home },
            ];
        } else if (isTenant) {
            // Tenants - only tenant dashboard
            return [
                { name: "tenant dashboard", path: "/microestate/tenant", icon: FileText },
            ];
        } else {
            // Default authenticated users - no navigation items
            return [];
        }
    };

    const navItems = getNavItems();
    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownOpen) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [userDropdownOpen]);

    // Don't show navbar on auth pages
    if (pathname.includes('/microestate/auth') || 
        pathname.includes('/microestate/register') || 
        pathname.includes('/microestate/verify-email')) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/microestate');
        setUserDropdownOpen(false);
    };

    const handleProfileClick = () => {
        // TODO: Navigate to profile page
        setUserDropdownOpen(false);
    };

    const handleSettingsClick = () => {
        // TODO: Navigate to settings page
        setUserDropdownOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md shadow-2xl border-b border-[#1a1a1f]">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-4 mr-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide">microestate</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-3">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => router.push(item.path)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105",
                                isActive(item.path)
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-300 hover:bg-[#1a1a1f] hover:text-orange-400 border border-transparent hover:border-orange-500/20"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="capitalize">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        // Authenticated user - show user dropdown
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserDropdownOpen(!userDropdownOpen);
                                }}
                                className="flex items-center gap-3 bg-[#1a1a1f] hover:bg-[#25252a] border border-[#2a2a2f] rounded-xl px-4 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-white">{user?.name}</div>
                                    <div className="text-xs text-orange-400 capitalize">{user?.role}</div>
                                </div>
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-gray-400 transition-transform duration-300",
                                    userDropdownOpen ? "rotate-180" : ""
                                )} />
                            </button>

                            {/* User Dropdown */}
                            {userDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md">
                                    <div className="p-4 border-b border-[#2a2a2f]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{user?.name}</div>
                                                <div className="text-xs text-gray-400">{user?.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-2">
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#25252a] rounded-lg transition-colors duration-200"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleSettingsClick}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#25252a] rounded-lg transition-colors duration-200"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200 mt-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Unauthenticated user - show login/register
                        <div className="flex items-center gap-3">
                            <Button
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                                onClick={() => router.push("/microestate/auth")}
                            >
                                Login
                            </Button>
                            <a
                                href="/microestate/register"
                                className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/10"
                                style={{ textDecoration: 'none' }}
                            >
                                Register
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;