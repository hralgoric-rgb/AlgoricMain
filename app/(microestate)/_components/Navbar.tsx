"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Building, Users, FileText, X, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { name: "home", path: "#", icon: Home },
        { name: "properties", path: "#", icon: Building },
        { name: "landlords", path: "#", icon: Users },
        { name: "tenants", path: "#", icon: FileText },
    ];

    const isActive = (path: string) => pathname === path;

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">microestate</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.path)}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                                    isActive(item.path)
                                        ? "bg-primary/20 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="capitalize">{item.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <Button
                            variant="outline"
                            className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                            onClick={() => { }}
                        >
                            let's talk
                        </Button>
                    </div>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => router.push(item.path)}
                                    className={cn(
                                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-left",
                                        isActive(item.path)
                                            ? "bg-primary/20 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="capitalize">{item.name}</span>
                                </button>
                            ))}
                            <Button
                                variant="outline"
                                className="mt-4 bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={() => { }}
                            >
                                let's talk
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};


export default Navbar;