"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
    if (typeof window === "undefined") return;
    const token = sessionStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/");
  };

  const handleProtectedLinkClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push(`/`);
      toast.error("Please login to proceed!!");
    }
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 fixed w-full z-50">
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
                pathname === "/"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/buy"
              className={`text-sm font-medium ${
                pathname === "/buy"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Buy
            </Link>
            <Link
              href="/rent"
              className={`text-sm font-medium ${
                pathname === "/rent"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Rent
            </Link>
            <Link
              href="/sell"
              className={`text-sm font-medium ${
                pathname === "/sell"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={(e) => handleProtectedLinkClick(e)}
            >
              Sell
            </Link>
            <Link
              href="/commercial"
              className={`text-sm font-medium ${
                pathname === "/commercial" ||
                pathname?.startsWith("/commercial/")
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Commercial
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${
                    pathname === "/dashboard"
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-medium ${
                    pathname === "/profile"
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/favourites"
                  className={`text-sm font-medium ${
                    pathname === "/favourites"
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
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
              className="text-gray-300 hover:text-white focus:outline-none z-50"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-gray-900/95 backdrop-blur-md">
          <div className="px-2 pt-4 pb-3 space-y-2 sm:px-3 max-h-[calc(100vh-4rem)] overflow-auto">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/buy"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/buy"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Buy
            </Link>
            <Link
              href="/rent"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/rent"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rent
            </Link>
            <Link
              href="/sell"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/sell"
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={(e) => {
                handleProtectedLinkClick(e);
                setIsMenuOpen(false);
              }}
            >
              Sell
            </Link>
            <Link
              href="/commercial"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/commercial" ||
                pathname?.startsWith("/commercial/")
                  ? "text-orange-500"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Commercial
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/dashboard"
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/profile"
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/favourites"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/favourites"
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favourites
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
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
