"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
				{/* Background Elements without animations */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl'></div>
					<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl'></div>
					<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl'></div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl'></div>
				</div>

				<EquityNavigation />

				<div className='container mx-auto px-4 py-8 pt-24 relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)]'>
					<div className='max-w-md mx-auto text-center'>
						<div className='backdrop-blur-xl bg-black/80 rounded-3xl p-8 border border-white/10 shadow-2xl'>
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
					</div>
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
			{/* Background Elements without animations */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl'></div>
				<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl'></div>
				<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl'></div>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl'></div>
			</div>

			<EquityNavigation />

			<div className='container mx-auto px-4 py-8 pt-24 relative z-10'>
				<div className='max-w-6xl mx-auto'>
					{/* Header */}
					<div className='text-center mb-12'>
						<h1 className='text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent'>
							Post Property Dashboard
						</h1>
						<p className='text-purple-200 text-xl font-medium mb-8'>
							Complete the verification steps to post your property
						</p>
					</div>

					{/* Three Step Progress Bar */}
					<div className='mb-12'>
						<div className='flex items-center justify-center space-x-8 mb-8'>
							{/* Step 1 - KYC */}
							<div className='flex flex-col items-center'>
								<div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
									kycStatus === "accepted" 
										? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50' 
										: kycStatus === "pending"
										? 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50'
										: kycStatus === "rejected"
										? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50'
										: 'bg-gray-600 border-gray-500'
								}`}>
									{kycStatus === "accepted" ? (
										<CheckCircle className='w-10 h-10 text-white' />
									) : kycStatus === "pending" ? (
										<Clock className='w-10 h-10 text-white' />
									) : kycStatus === "rejected" ? (
										<AlertCircle className='w-10 h-10 text-white' />
									) : (
										<Shield className='w-10 h-10 text-white' />
									)}
								</div>
								<div className='mt-4 text-center'>
									<p className='text-white font-bold text-lg'>Step 1</p>
									<p className='text-purple-200'>KYC Verification</p>
									<div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
										kycStatus === "accepted" ? 'bg-green-500/20 text-green-300' :
										kycStatus === "pending" ? 'bg-yellow-500/20 text-yellow-300' :
										kycStatus === "rejected" ? 'bg-red-500/20 text-red-300' :
										'bg-gray-500/20 text-gray-300'
									}`}>
										{kycStatus === "accepted" && "✓ Completed"}
										{kycStatus === "pending" && "⏱ In Progress"}
										{kycStatus === "rejected" && "✗ Rejected"}
										{kycStatus === null && "Pending"}
									</div>
								</div>
							</div>

							{/* Progress Line 1 */}
							<div className={`w-32 h-2 rounded-full transition-all duration-500 ${
								kycStatus === "accepted" ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-600'
							}`}></div>

							{/* Step 2 - OTP */}
							<div className='flex flex-col items-center'>
								<div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
									otpVerified 
										? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50' 
										: kycStatus === "accepted"
										? 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50'
										: 'bg-gray-600 border-gray-500'
								}`}>
									{otpVerified ? (
										<CheckCircle className='w-10 h-10 text-white' />
									) : kycStatus === "accepted" ? (
										<Mail className='w-10 h-10 text-white' />
									) : (
										<Mail className='w-10 h-10 text-gray-400' />
									)}
								</div>
								<div className='mt-4 text-center'>
									<p className='text-white font-bold text-lg'>Step 2</p>
									<p className='text-purple-200'>OTP Verification</p>
									<div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
										otpVerified ? 'bg-green-500/20 text-green-300' :
										kycStatus === "accepted" ? 'bg-yellow-500/20 text-yellow-300' :
										'bg-gray-500/20 text-gray-300'
									}`}>
										{otpVerified && "✓ Completed"}
										{!otpVerified && kycStatus === "accepted" && "📧 Ready"}
										{!otpVerified && kycStatus !== "accepted" && "🔒 Locked"}
									</div>
								</div>
							</div>

							{/* Progress Line 2 */}
							<div className={`w-32 h-2 rounded-full transition-all duration-500 ${
								otpVerified ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-600'
							}`}></div>

							{/* Step 3 - Post Property */}
							<div className='flex flex-col items-center'>
								<div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
									otpVerified 
										? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50' 
										: 'bg-gray-600 border-gray-500'
								}`}>
									<Building2 className={`w-10 h-10 ${otpVerified ? 'text-white' : 'text-gray-400'}`} />
								</div>
								<div className='mt-4 text-center'>
									<p className='text-white font-bold text-lg'>Step 3</p>
									<p className='text-purple-200'>Post Property</p>
									<div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
										otpVerified ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
									}`}>
										{otpVerified ? "🚀 Ready" : "🔒 Locked"}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Step Cards */}
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
						{/* KYC Card */}
						<div className={`backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl transition-all duration-500 transform cursor-pointer ${
							kycStatus === "accepted" 
								? 'bg-green-500/10 border-green-400/50 shadow-green-500/20 scale-105' 
								: kycStatus === "pending"
								? 'bg-yellow-500/10 border-yellow-400/50 shadow-yellow-500/20'
								: kycStatus === "rejected"
								? 'bg-red-500/10 border-red-400/50 shadow-red-500/20'
								: 'bg-black/40 border-white/20 hover:scale-105 hover:border-purple-400/60 hover:shadow-purple-500/30 hover:shadow-2xl focus:border-purple-400/80 focus:shadow-purple-500/40 active:border-purple-300/90 active:shadow-purple-400/50'
						}`}>
							<div className='text-center mb-6'>
								<div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-500 ${
									kycStatus === "accepted" ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
									kycStatus === "pending" ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
									kycStatus === "rejected" ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-purple-500'
								}`}>
									{kycStatus === "accepted" ? (
										<CheckCircle className='w-12 h-12 text-white' />
									) : kycStatus === "pending" ? (
										<Clock className='w-12 h-12 text-white' />
									) : kycStatus === "rejected" ? (
										<AlertCircle className='w-12 h-12 text-white' />
									) : (
										<Shield className='w-12 h-12 text-white' />
									)}
								</div>
								<h3 className='text-2xl font-bold text-white mb-4'>KYC Verification</h3>
								<div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
									kycStatus === "accepted" ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
									kycStatus === "pending" ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
									kycStatus === "rejected" ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
									'bg-blue-500/20 text-blue-300 border border-blue-400/30'
								}`}>
									{kycStatus === "accepted" && "✓ Approved"}
									{kycStatus === "pending" && "⏱ Under Review"}
									{kycStatus === "rejected" && "✗ Rejected"}
									{kycStatus === null && "📋 Required"}
								</div>
							</div>

							<p className='text-gray-300 text-center mb-6 leading-relaxed'>
								{kycStatus === "accepted" &&
									"Great! Your identity has been verified successfully. You can now proceed to the next step."}
								{kycStatus === "pending" &&
									"Your KYC documents are being reviewed by our team. Please wait for approval."}
								{kycStatus === "rejected" &&
									"Your KYC was rejected. Please contact support for assistance."}
								{kycStatus === null &&
									"Complete your Know Your Customer verification to start posting properties."}
							</p>

							{kycStatus === null && (
								<Button
									onClick={() => router.push("/equity/kyc")}
									className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105'
								>
									<Shield className='w-5 h-5 mr-2' />
									Start KYC Verification
								</Button>
							)}
						</div>

						{/* OTP Card */}
						<div className={`backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl transition-all duration-500 transform cursor-pointer ${
							otpVerified 
								? 'bg-green-500/10 border-green-400/50 shadow-green-500/20 scale-105' 
								: kycStatus === "accepted"
								? 'bg-yellow-500/10 border-yellow-400/50 shadow-yellow-500/20 hover:scale-105 hover:border-purple-400/60 hover:shadow-purple-500/30 hover:shadow-2xl focus:border-purple-400/80 focus:shadow-purple-500/40 active:border-purple-300/90 active:shadow-purple-400/50'
								: 'bg-black/40 border-white/20 opacity-50'
						}`}>
							<div className='text-center mb-6'>
								<div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-500 ${
									otpVerified ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
									kycStatus === "accepted" ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-gray-500'
								}`}>
									{otpVerified ? (
										<CheckCircle className='w-12 h-12 text-white' />
									) : kycStatus === "accepted" ? (
										<Mail className='w-12 h-12 text-white' />
									) : (
										<Mail className='w-12 h-12 text-gray-400' />
									)}
								</div>
								<h3 className='text-2xl font-bold text-white mb-4'>OTP Verification</h3>
								<div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
									otpVerified ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
									kycStatus === "accepted" ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
									'bg-gray-500/20 text-gray-300 border border-gray-400/30'
								}`}>
									{otpVerified && "✓ Verified"}
									{!otpVerified && kycStatus === "accepted" && "📧 Ready"}
									{!otpVerified && kycStatus !== "accepted" && "🔒 Locked"}
								</div>
							</div>

							<p className='text-gray-300 text-center mb-6 leading-relaxed'>
								{otpVerified &&
									"Perfect! Email verification completed. You're ready to post your property."}
								{!otpVerified && kycStatus === "accepted" &&
									"Verify your email address with the OTP code to proceed to the final step."}
								{!otpVerified && kycStatus !== "accepted" &&
									"Complete KYC verification first to unlock this step."}
							</p>

							{kycStatus === "accepted" && !otpVerified && (
								<Button
									onClick={handlePostNow}
									disabled={otpLoading}
									className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 transform hover:scale-105'
								>
									<Mail className='w-5 h-5 mr-2' />
									{otpLoading ? "Sending OTP..." : "Send OTP Code"}
								</Button>
							)}
						</div>

						{/* Post Property Card */}
						<div className={`backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl transition-all duration-500 transform cursor-pointer ${
							otpVerified 
								? 'bg-green-500/10 border-green-400/50 shadow-green-500/20 hover:scale-105 hover:border-purple-400/60 hover:shadow-purple-500/30 hover:shadow-2xl focus:border-purple-400/80 focus:shadow-purple-500/40 active:border-purple-300/90 active:shadow-purple-400/50' 
								: 'bg-black/40 border-white/20 opacity-50'
						}`}>
							<div className='text-center mb-6'>
								<div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-500 ${
									otpVerified ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-500'
								}`}>
									<Building2 className={`w-12 h-12 ${otpVerified ? 'text-white' : 'text-gray-400'}`} />
								</div>
								<h3 className='text-2xl font-bold text-white mb-4'>Post Property</h3>
								<div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
									otpVerified ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
								}`}>
									{otpVerified ? "🚀 Ready to Launch" : "🔒 Locked"}
								</div>
							</div>

							<p className='text-gray-300 text-center mb-6 leading-relaxed'>
								{otpVerified 
									? "Excellent! All verifications complete. Start posting your property and reach potential buyers."
									: "Complete the previous steps to unlock the property posting feature."
								}
							</p>

							{otpVerified && (
								<Button
									onClick={handleStartPosting}
									className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 transform hover:scale-105'
								>
									<FileText className='w-5 h-5' />
									Start Posting Property
									<ArrowRight className='w-5 h-5' />
								</Button>
							)}
						</div>
					</div>

					{/* Success Message */}
					{success && (
						<div className='backdrop-blur-xl bg-green-500/10 border border-green-400/30 rounded-2xl p-6 text-center shadow-2xl animate-pulse'>
							<div className='flex items-center justify-center gap-3 mb-2'>
								<div className='w-3 h-3 bg-green-400 rounded-full'></div>
								<CheckCircle className='w-8 h-8 text-green-400' />
								<div className='w-3 h-3 bg-green-400 rounded-full'></div>
							</div>
							<p className='text-green-200 text-lg font-medium'>{success}</p>
						</div>
					)}
				</div>
			</div>

			{/* OTP Modal */}
			{showOtpModal && (
				<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className='backdrop-blur-xl bg-black/80 rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl shadow-purple-500/20'>
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
									className='flex-1 backdrop-blur-xl bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300'
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
					</div>
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
