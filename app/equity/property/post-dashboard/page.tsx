"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
	Building2,
	CheckCircle,
	AlertCircle,
	Clock,
	FileText,
	ArrowRight,
	Shield,
	Mail,
} from "lucide-react";
import EquityNavigation from "@/app/equity/components/EquityNavigation";
import { AuthModal } from "@/app/equity/components";

export default function PostPropertyDashboard() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [kycStatus, setKycStatus] = useState<
		"accepted" | "pending" | "rejected" | null
	>(null);
	const [kycData, setKycData] = useState<any>(null);
	const [showOtpModal, setShowOtpModal] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");
	const [otpLoading, setOtpLoading] = useState(false);
	const [otpVerified, setOtpVerified] = useState(false);
	const [success, setSuccess] = useState("");
	const [resendDisabled, setResendDisabled] = useState(false);

	useEffect(() => {
		const token =
			typeof window !== "undefined"
				? sessionStorage.getItem("authToken") ||
				  localStorage.getItem("authToken")
				: null;

		if (!token) {
			setShowAuthModal(true);
			setLoading(false);
			return;
		}

		// Only fetch KYC status if authenticated
		setShowAuthModal(false);
		const fetchKycStatus = async () => {
			try {
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
						setKycData(myKyc);
						setOtpVerified(myKyc.otpVerified || false);
					} else {
						setKycStatus(null);
						setKycData(null);
					}
				} else {
					setKycStatus(null);
					setKycData(null);
				}
			} catch {
				setKycStatus(null);
				setKycData(null);
			}
			setLoading(false);
		};
		fetchKycStatus();
	}, [router]);

	const handleVerifyOtp = async () => {
		if (!otp || otp.length !== 6) {
			setOtpError("Please enter a valid 6-digit OTP");
			return;
		}
		setOtpLoading(true);
		setOtpError("");
		try {
			const token =
				typeof window !== "undefined"
					? sessionStorage.getItem("authToken") ||
					  localStorage.getItem("authToken")
					: null;
			const res = await fetch("/api/kyc/verify-otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					kycId: kycData._id,
					otp: otp,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setOtpVerified(true);
				setShowOtpModal(false);
				setOtp("");
				setSuccess(
					"OTP verified successfully! You can now post your property."
				);
				setTimeout(() => setSuccess(""), 3000);
			} else {
				setOtpError(data.error || "Failed to verify OTP");
			}
		} catch {
			setOtpError("An error occurred. Please try again.");
		}
		setOtpLoading(false);
	};

	const handlePostNow = async () => {
		if (kycStatus !== "accepted") {
			return;
		}

		setOtpError("");
		setSuccess("");
		setOtp("");
		setOtpVerified(false);
		setShowOtpModal(false);
		setOtpLoading(true);
		try {
			const token =
				typeof window !== "undefined"
					? sessionStorage.getItem("authToken") ||
					  localStorage.getItem("authToken")
					: null;
			if (!token) {
				setOtpError("You must be logged in to post a property.");
				setOtpLoading(false);
				setShowOtpModal(true);
				return;
			}

			const resOtp = await fetch("/api/kyc", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const dataOtp = await resOtp.json();
			if (!resOtp.ok) {
				setOtpError(dataOtp.error || "Failed to send OTP");
				setOtpLoading(false);
				setShowOtpModal(true);
				return;
			}
			setSuccess("OTP sent to your email. Please check your inbox.");
			setShowOtpModal(true);
		} catch {
			setOtpError("An error occurred. Please try again.");
			setShowOtpModal(true);
		}
		setOtpLoading(false);
	};

	const handleResendOtp = async () => {
		setResendDisabled(true);
		setOtpLoading(true);
		setOtpError("");
		try {
			const token =
				typeof window !== "undefined"
					? sessionStorage.getItem("authToken") ||
					  localStorage.getItem("authToken")
					: null;
			if (!token) {
				setOtpError("You must be logged in to post a property.");
				setOtpLoading(false);
				return;
			}

			const resOtp = await fetch("/api/kyc", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const dataOtp = await resOtp.json();
			if (!resOtp.ok) {
				setOtpError(dataOtp.error || "Failed to send OTP");
				setOtpLoading(false);
				return;
			}
			setSuccess("OTP resent to your email. Please check your inbox.");
			setOtp("");
			setOtpError("");
		} catch {
			setOtpError("An error occurred. Please try again.");
		}
		setOtpLoading(false);
		setTimeout(() => setResendDisabled(false), 30000);
	};

	const handleAuthSuccess = () => {
		setShowAuthModal(false);
		// Reload the page to fetch KYC status with the new auth token
		window.location.reload();
	};

	const handleStartPosting = () => {
		if (otpVerified) {
			router.push("/equity/property/post");
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa]'>
				<div className='text-white text-xl'>Loading...</div>
			</div>
		);
	}

	// Block access completely if not authenticated - only show auth modal
	if (showAuthModal) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] relative overflow-hidden'>
				{/* Animated Background Elements */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse'></div>
					<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl animate-bounce'></div>
					<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse'></div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl animate-spin'></div>
				</div>

				<EquityNavigation />

				<div className='container mx-auto px-4 py-8 pt-24 relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)]'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='max-w-md mx-auto text-center'
					>
						<div className='backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl'>
							<Shield className='w-16 h-16 text-purple-400 mx-auto mb-4' />
							<h1 className='text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent'>
								Authentication Required
							</h1>
							<p className='text-purple-200 mb-6'>
								Please sign in to access the property posting dashboard
							</p>
							<Button
								onClick={() => setShowAuthModal(true)}
								className='backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25'
							>
								Sign In
							</Button>
						</div>
					</motion.div>
				</div>

				{/* Auth Modal - Only UI element accessible when not authenticated */}
				<AuthModal
					isOpen={showAuthModal}
					onClose={() => {
						// Prevent closing modal when not authenticated - redirect to home instead
						window.location.href = '/equity';
					}}
					onAuthSuccess={handleAuthSuccess}
				/>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] relative overflow-hidden'>
			{/* Animated Background Elements */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse'></div>
				<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl animate-bounce'></div>
				<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse'></div>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl animate-spin'></div>
			</div>

			<EquityNavigation />

			<div className='container mx-auto px-4 py-8 pt-24 relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='max-w-4xl mx-auto'
				>
					{/* Header with Glass Effect */}
					<motion.div
						className='text-center mb-8 backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl'
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2 }}
					>
						<h1 className='text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent'>
							Post Property Dashboard
						</h1>
						<p className='text-purple-200 text-xl font-medium'>
							Complete the verification steps to post your property
						</p>
						<div className='mt-4 flex justify-center'>
							<div className='w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full'></div>
						</div>
					</motion.div>

					{/* Status Cards with Glass Effect */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
						{/* KYC Status Card */}
						<motion.div
							className='backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/20 shadow-2xl'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<div className='flex items-center mb-4'>
								<Shield className='w-8 h-8 text-purple-400 mr-3' />
								<h3 className='text-xl font-bold text-white'>
									KYC Verification
								</h3>
							</div>

							{kycStatus === "accepted" && (
								<div className='flex items-center text-green-400 mb-4'>
									<CheckCircle className='w-6 h-6 mr-2' />
									<span className='font-medium'>KYC Approved</span>
								</div>
							)}

							{kycStatus === "pending" && (
								<div className='flex items-center text-yellow-400 mb-4'>
									<Clock className='w-6 h-6 mr-2' />
									<span className='font-medium'>Under Review</span>
								</div>
							)}

							{kycStatus === "rejected" && (
								<div className='flex items-center text-red-400 mb-4'>
									<AlertCircle className='w-6 h-6 mr-2' />
									<span className='font-medium'>KYC Rejected</span>
								</div>
							)}

							{kycStatus === null && (
								<div className='flex items-center text-blue-400 mb-4'>
									<AlertCircle className='w-6 h-6 mr-2' />
									<span className='font-medium'>KYC Required</span>
								</div>
							)}

							<p className='text-gray-300 text-sm mb-4'>
								{kycStatus === "accepted" &&
									"Your KYC has been approved. You can now proceed with OTP verification."}
								{kycStatus === "pending" &&
									"Your KYC is currently under review. Please wait for admin approval."}
								{kycStatus === "rejected" &&
									"Your KYC was rejected. Please contact support for assistance."}
								{kycStatus === null &&
									"Please complete your KYC verification first to post properties."}
							</p>

							{kycStatus === null && (
								<Button
									onClick={() => router.push("/equity/kyc")}
									className='w-full backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25'
								>
									Complete KYC
								</Button>
							)}
						</motion.div>

						{/* OTP Verification Card */}
						<motion.div
							className='backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/20 shadow-2xl'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							<div className='flex items-center mb-4'>
								<Mail className='w-8 h-8 text-purple-400 mr-3' />
								<h3 className='text-xl font-bold text-white'>
									OTP Verification
								</h3>
							</div>

							{otpVerified && (
								<div className='flex items-center text-green-400 mb-4'>
									<CheckCircle className='w-6 h-6 mr-2' />
									<span className='font-medium'>OTP Verified</span>
								</div>
							)}

							{!otpVerified && kycStatus === "accepted" && (
								<div className='flex items-center text-yellow-400 mb-4'>
									<Clock className='w-6 h-6 mr-2' />
									<span className='font-medium'>OTP Required</span>
								</div>
							)}

							{!otpVerified && kycStatus !== "accepted" && (
								<div className='flex items-center text-gray-400 mb-4'>
									<AlertCircle className='w-6 h-6 mr-2' />
									<span className='font-medium'>KYC Required First</span>
								</div>
							)}

							<p className='text-gray-300 text-sm mb-4'>
								{otpVerified &&
									"Your OTP has been verified. You can now post your property."}
								{!otpVerified &&
									kycStatus === "accepted" &&
									"Click 'Send OTP' to receive a verification code on your email."}
								{!otpVerified &&
									kycStatus !== "accepted" &&
									"Complete KYC verification first to proceed with OTP."}
							</p>

							{kycStatus === "accepted" && !otpVerified && (
								<Button
									onClick={handlePostNow}
									disabled={otpLoading}
									className='w-full backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50'
								>
									{otpLoading ? "Sending..." : "Send OTP"}
								</Button>
							)}
						</motion.div>
					</div>

					{/* Action Button */}
					{otpVerified && (
						<motion.div
							className='text-center'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<Button
								onClick={handleStartPosting}
								className='backdrop-blur-xl bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white px-8 py-4 rounded-xl flex items-center mx-auto border border-white/20 transition-all duration-300 shadow-lg shadow-green-500/25 text-lg font-semibold'
							>
								<FileText className='w-6 h-6 mr-2' />
								Start Posting Property
								<ArrowRight className='w-6 h-6 ml-2' />
							</Button>
						</motion.div>
					)}

					{/* Success Message */}
					{success && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-6 p-4 backdrop-blur-xl bg-green-500/10 border border-green-400/30 rounded-2xl text-green-200 text-center shadow-2xl'
						>
							<div className='flex items-center justify-center gap-2'>
								<div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
								{success}
							</div>
						</motion.div>
					)}
				</motion.div>
			</div>

			{/* OTP Modal */}
			{showOtpModal && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className='backdrop-blur-xl bg-white/5 rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl shadow-purple-500/20'
					>
						<h3 className='text-2xl font-bold text-center mb-4 text-white'>
							Verify OTP
						</h3>
						<p className='text-center text-purple-300 mb-6'>
							Enter the 6-digit OTP sent to your email when your KYC was
							approved.
						</p>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm text-gray-300 mb-2'>OTP</label>
								<input
									type='text'
									value={otp}
									onChange={(e) =>
										setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
									}
									className='w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:border-purple-400 focus:bg-white/15 outline-none text-center text-xl tracking-widest transition-all duration-300 placeholder-gray-400'
									placeholder='000000'
									maxLength={6}
								/>
							</div>
							{otpError && (
								<div className='text-red-400 text-sm text-center'>
									{otpError}
								</div>
							)}
							{success && (
								<div className='text-green-400 text-sm text-center'>
									{success}
								</div>
							)}
							<div className='flex gap-3 mt-2'>
								<Button
									onClick={() => {
										setShowOtpModal(false);
										setOtp("");
										setOtpError("");
									}}
									className='flex-1 backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300'
								>
									Cancel
								</Button>
								<Button
									onClick={handleVerifyOtp}
									disabled={otpLoading || otp.length !== 6}
									className='flex-1 backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50'
								>
									{otpLoading ? "Verifying..." : "Verify OTP"}
								</Button>
							</div>
							<div className='flex gap-3 mt-2'>
								<Button
									onClick={handleResendOtp}
									disabled={resendDisabled || otpLoading}
									className='flex-1 backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50'
								>
									{otpLoading
										? "Sending..."
										: resendDisabled
										? "Resend OTP (wait...)"
										: "Resend OTP"}
								</Button>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Auth Modal */}
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
		</div>
	);
}
