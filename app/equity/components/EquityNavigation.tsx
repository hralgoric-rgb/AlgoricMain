"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Home,
	Building2,
	Target,
	Landmark,
	Menu,
	X,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import AuthModal from "./AuthModal";
export default function EquityNavigation() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = usePathname();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [showAuth, setShowAuth] = useState(false);
	const [kycStatus, setKycStatus] = useState<"accepted" | "pending" | "rejected" | null>(null);
	const [loading, setLoading] = useState(true);

	// Check authentication on mount
	React.useEffect(() => {
		if (typeof window !== "undefined") {
			const token =
				sessionStorage.getItem("authToken") ||
				localStorage.getItem("authToken");
			setIsAuthenticated(!!token);
		}
	}, []);

	// Fetch KYC status when authenticated
	useEffect(() => {
		const fetchKycStatus = async () => {
			if (!isAuthenticated) {
				setLoading(false);
				return;
			}

			try {
				const token =
					sessionStorage.getItem("authToken") ||
					localStorage.getItem("authToken");
				
				if (!token) {
					setLoading(false);
					return;
				}

				const res = await fetch("/api/kyc", {
					method: "GET",
					headers: { Authorization: `Bearer ${token}` },
				});
				
				const data = await res.json();
				
				if (res.ok && data.reviewed) {
					const tokenPayload = JSON.parse(atob(token.split(".")[1]));
					const userId = tokenPayload.userId || tokenPayload.sub;
					const myKyc = data.reviewed.find((k: any) => k.userId === userId);
					
					if (myKyc) {
						setKycStatus(myKyc.status);
					} else {
						setKycStatus(null);
					}
				} else {
					setKycStatus(null);
				}
			} catch (error) {
				console.error("Error fetching KYC status:", error);
				setKycStatus(null);
			}
			setLoading(false);
		};

		fetchKycStatus();
	}, [isAuthenticated]);

	const handleAuthSuccess = () => {
		setShowAuth(false);
		// Update authentication state
		if (typeof window !== "undefined") {
			const token =
				sessionStorage.getItem("authToken") ||
				localStorage.getItem("authToken");
			setIsAuthenticated(!!token);
		}
		// Redirect to post property page after successful authentication
		setTimeout(() => {
			window.location.href = "/equity/property/post-dashboard";
		}, 100);
	};

	const navItems = [
				{ href: "/", label: "Home", icon: Landmark},

		{ href: "/equity", label: "Dashboard", icon: Home },
		{ href: "/equity/property", label: "Properties", icon: Building2 },
		{ href: "/equity/portfolio", label: "Portfolio", icon: Target },
	];

	return (
		<>
			{/* Horizontal Navigation Bar */}
			<nav className='fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#a78bfa]/30'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						{/* Logo */}
						<div className='flex items-center flex-shrink-0'>
							<div className='w-8 h-8 bg-[#a78bfa] rounded-lg flex items-center justify-center mr-3'>
								<Building2 className='w-5 h-5 text-white' />
							</div>
							<div className='flex flex-col'>
								<span className='text-white font-bold text-base sm:text-lg'>Algoric</span>
								<span className='text-gray-300 text-xs hidden sm:block'>Equity Platform</span>
							</div>
						</div>

						{/* Desktop Navigation Links */}
						<div className='hidden md:flex items-center space-x-4 lg:space-x-8'>
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 ${
											isActive
												? "bg-[#a78bfa] text-white"
												: "text-gray-300 hover:text-white hover:bg-[#a78bfa]/20 hover:border hover:border-[#a78bfa]/30"
										}`}
									>
										<item.icon className='w-4 h-4' />
										<span className='font-medium text-sm lg:text-base'>{item.label}</span>
									</Link>
								);
							})}
							{/* Post Property Button */}
							{isAuthenticated ? (
								<Link
									href='/equity/property/post-dashboard'
									className='ml-2 lg:ml-4 px-3 lg:px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 transition-all duration-300 flex items-center gap-2 font-medium text-sm lg:text-base'
								>
									<span>Post Property</span>
								</Link>
							) : (
								<button
									onClick={() => setShowAuth(true)}
									className='ml-2 lg:ml-4 px-3 lg:px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 transition-all duration-300 flex items-center gap-2 font-medium text-sm lg:text-base'
								>
									<span>Post Property</span>
								</button>
							)}
							{/* KYC Button - Only show if authenticated and KYC not completed */}
							{isAuthenticated && kycStatus !== "accepted" && !loading && (
								<Link
									href='/equity/kyc'
									className='ml-2 lg:ml-4 px-3 lg:px-4 py-2 rounded-lg bg-gradient-to-r from-[#a78bfa] to-purple-700 text-white border border-purple-400 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:from-purple-500 hover:to-purple-800 text-sm lg:text-base'
								>
									<span>KYC</span>
								</Link>
							)}
							
						</div>

						{/* Mobile Menu Button */}
						<div className='md:hidden'>
							<button
								className='text-white p-2 rounded-lg hover:bg-white/10 transition-colors'
								onClick={() => setMobileOpen(!mobileOpen)}
								aria-label='Toggle menu'
							>
								{mobileOpen ? (
									<X className='w-5 h-5' />
								) : (
									<Menu className='w-5 h-5' />
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
						className='md:hidden bg-black/95 backdrop-blur-sm border-t border-[#a78bfa]/30 max-h-screen overflow-y-auto'
					>
						<div className='px-4 py-4 space-y-2 max-w-full'>
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
											isActive
												? "bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/30"
												: "text-gray-300 hover:text-white hover:bg-[#a78bfa]/10"
										}`}
										onClick={() => setMobileOpen(false)}
									>
										<item.icon className='w-5 h-5 flex-shrink-0' />
										<span className='font-medium'>{item.label}</span>
									</Link>
								);
							})}
							{/* Post Property Button for Mobile */}
							{isAuthenticated ? (
								<Link
									href='/equity/property/post-dashboard'
									className='block w-full mt-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 transition-all duration-300 text-center font-medium'
									onClick={() => setMobileOpen(false)}
								>
									Post Property
								</Link>
							) : (
								<button
									onClick={() => {
										setShowAuth(true);
										setMobileOpen(false);
									}}
									className='block w-full mt-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 transition-all duration-300 text-center font-medium'
								>
									Post Property
								</button>
							)}
							{/* KYC Button for Mobile - Only show if authenticated and KYC not completed */}
							{isAuthenticated && kycStatus !== "accepted" && !loading && (
								<Link
									href='/equity/kyc'
									className='block w-full mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#a78bfa] to-purple-700 text-white border border-purple-400 transition-all duration-300 text-center font-medium shadow-md hover:from-purple-500 hover:to-purple-800'
									onClick={() => setMobileOpen(false)}
								>
									KYC
								</Link>
							)}
							
						</div>
					</motion.div>
				)}
			</nav>

			{/* Overlay for mobile menu */}
			{mobileOpen && (
				<div
					className='fixed inset-0 bg-black/40 z-40 md:hidden'
					onClick={() => setMobileOpen(false)}
					aria-label='Close menu overlay'
				/>
			)}

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuth}
				onClose={() => setShowAuth(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
		</>
	);
}
