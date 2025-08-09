"use client";

import { Button } from '@/components/ui/button';
import { Building, LogOut, Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthProvider';

function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Don't show navbar on auth/register/verify-email pages
    if (
        pathname.includes('/microestate/auth') ||
        pathname.includes('/microestate/register') ||
        pathname.includes('/microestate/verify-email')
    ) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md shadow-2xl border-b border-[#1a1a1f]">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2 sm:space-x-4 mr-4 sm:mr-8">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Building className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">microestate</span>
                </div>
                
                {/* Right side buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Home button - always visible */}
                    <Button
                        variant="outline"
                        className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200 flex items-center gap-1 sm:gap-2"
                        onClick={() => router.push("/")}
                    >
                        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Home</span>
                    </Button>

                    {user ? (
                        // Show logout button and user info when authenticated
                        <>
                            <div className="flex items-center gap-2 sm:gap-3 text-white">
                                <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">Welcome, {user.name}</span>
                                <Button
                                    variant="outline"
                                    className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200 flex items-center gap-1 sm:gap-2"
                                    onClick={logout}
                                >
                                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden xs:inline">Logout</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Show login/register buttons when not authenticated
                        <>
                            <Button
                                className="h-10 sm:h-12 px-4 sm:px-7 text-sm sm:text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 border-none"
                                style={{ minWidth: '80px' }}
                                onClick={() => router.push("/microestate/auth")}
                            >
                                Login
                            </Button>
                            <a
                                href="/microestate/register"
                                className="h-10 sm:h-12 px-4 sm:px-7 text-sm sm:text-base flex items-center justify-center bg-gradient-to-r from-orange-600 via-orange-500 to-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/10 border-none"
                                style={{ minWidth: '80px', textDecoration: 'none' }}
                            >
                                Register
                            </a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;