"use client";

import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthProvider';

function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    // Don't show navbar on auth/register/verify-email pages
    if (
        pathname.includes('/microestate/auth') ||
        pathname.includes('/microestate/register') ||
        pathname.includes('/microestate/verify-email')
    ) {
        return null;
    }

    // Only show navbar if NOT authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md shadow-2xl border-b border-[#1a1a1f]">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-4 mr-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide">microestate</span>
                </div>
                {/* Login/Register Buttons */}
                <div className="flex items-center gap-3">
                    <Button
                        className="h-12 px-7 text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 border-none"
                        style={{ minWidth: '110px' }}
                        onClick={() => router.push("/microestate/auth")}
                    >
                        Login
                    </Button>
                    <a
                        href="/microestate/register"
                        className="h-12 px-7 text-base flex items-center justify-center bg-gradient-to-r from-orange-600 via-orange-500 to-red-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/10 border-none"
                        style={{ minWidth: '110px', textDecoration: 'none' }}
                    >
                        Register
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;