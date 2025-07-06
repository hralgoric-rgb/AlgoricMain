"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaHome, 
  FaBuilding, 
  FaChartLine, 
  FaExchangeAlt, 
  FaFileAlt,
  
  FaBars,
  FaTimes,
  FaSignOutAlt
} from "react-icons/fa";
import { Button } from "@/components/ui/button";


export default function EquityNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/equity/dashboard", icon: <FaHome className="w-5 h-5" /> },
    { name: "Properties", href: "/equity/properties", icon: <FaBuilding className="w-5 h-5" /> },
    { name: "Portfolio", href: "/equity/portfolio", icon: <FaChartLine className="w-5 h-5" /> },
    { name: "Trade", href: "/equity/trade", icon: <FaExchangeAlt className="w-5 h-5" /> },
    { name: "Statements", href: "/equity/statements", icon: <FaFileAlt className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/equity" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FaBuilding className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Equity<span className="text-orange-500">Invest</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  } px-4 py-2 rounded-lg transition-all duration-200`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <FaSignOutAlt className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-gray-800"
            >
              {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pb-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    } w-full justify-start px-4 py-2 rounded-lg transition-all duration-200`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
