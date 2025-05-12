"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if(typeof window === "undefined") return;
    const token = sessionStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    if(typeof window === "undefined") return;
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleProtectedLinkClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push(`/`);
      toast.error("Please login to proceed!!")
    }
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">100Gaj</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${
                pathname === "/" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/buy"
              className={`text-sm font-medium ${
                pathname === "/buy" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Buy
            </Link>
            <Link
              href="/rent"
              className={`text-sm font-medium ${
                pathname === "/rent" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Rent
            </Link>
            <Link
              href="/sell"
              className={`text-sm font-medium ${
                pathname === "/sell" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
              onClick={(e) => handleProtectedLinkClick(e)}
            >
              Sell
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`text-sm font-medium ${
                    pathname === "/profile" ? "text-orange-500" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/favourites"
                  className={`text-sm font-medium ${
                    pathname === "/favourites" ? "text-orange-500" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Favourites
                </Link>
                <Button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/buy"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/buy" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Buy
            </Link>
            <Link
              href="/rent"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/rent" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Rent
            </Link>
            <Link
              href="/sell"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/sell" ? "text-orange-500" : "text-gray-300 hover:text-white"
              }`}
              onClick={(e) => handleProtectedLinkClick(e)}
            >
              Sell
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/profile" ? "text-orange-500" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/favourites"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/favourites" ? "text-orange-500" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Favourites
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 