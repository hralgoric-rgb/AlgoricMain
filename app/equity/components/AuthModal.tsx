"use client";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Mail, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAuthSuccess?: () => void;
}

interface PasswordStrength {
	score: number;
	feedback: string[];
}

export default function AuthModal({
	isOpen,
	onClose,
	onAuthSuccess,
}: AuthModalProps) {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [currentView, setCurrentView] = useState<
		"main" | "forgot-password" | "verify-email"
	>("main");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	// Form data
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [userId, setUserId] = useState<string | null>(null);
	const [verificationCode, setVerificationCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isAgent, setIsAgent] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
		score: 0,
		feedback: [],
	});

	// Clear errors and success messages when switching tabs
	useEffect(() => {
		setError(null);
		setSuccess(null);
	}, [activeTab, currentView]);

	// Reset form state when modal closes
	useEffect(() => {
		if (!isOpen) {
			resetFormState();
		}
	}, [isOpen]);

	const resetFormState = () => {
		setEmail("");
		setPassword("");
		setName("");
		setVerificationCode("");
		setNewPassword("");
		setConfirmPassword("");
		setError(null);
		setSuccess(null);
		setCurrentView("main");
		setShowPassword(false);
		setIsAgent(false);
		setActiveTab("login");
		setUserId(null);
		setPasswordStrength({ score: 0, feedback: [] });
	};

	// Password strength calculation
	const calculatePasswordStrength = (password: string): PasswordStrength => {
		const feedback = [];
		let score = 0;

		if (password.length >= 8) {
			score += 1;
		} else {
			feedback.push("At least 8 characters");
		}

		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
			score += 1;
		} else {
			feedback.push("Both uppercase and lowercase letters");
		}

		if (/\d/.test(password)) {
			score += 1;
		} else {
			feedback.push("At least one number");
		}

		if (/[@$!%*?&]/.test(password)) {
			score += 1;
		} else {
			feedback.push("At least one special character (@$!%*?&)");
		}

		return { score, feedback };
	};

	// Handle login
	const handleLogin = async (e?: FormEvent) => {
		e?.preventDefault();

		if (!email || !password) {
			setError("Email and password are required");
			return;
		}

		// Client-side email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		// Basic password validation for login
		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await axios.post("/api/auth/login", {
				email,
				password,
			});

			if (response.data.token) {
				// Store the token
				if (typeof window !== "undefined") {
					document.cookie = `authToken=${response.data.token}; path=/;`;
					sessionStorage.setItem("authToken", response.data.token);
				}

				toast.success("Successfully Logged In!!");
				setSuccess("Login successful!");

				// Close modal and trigger success callback
				setTimeout(() => {
					onClose();
					onAuthSuccess?.();
					window.location.reload(); // Refresh to update auth state
				}, 1000);
			}
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Login failed. Please try again.";
			setError(errorMsg);
			toast.error("Login failed. Please try again.");

			// Check if email verification is required
			if (err.response?.status === 403 && err.response?.data?.userId) {
				setUserId(err.response.data.userId);
				setCurrentView("verify-email");
			}
		} finally {
			setLoading(false);
		}
	};

	// Handle signup
	const handleSignup = async (e?: FormEvent) => {
		e?.preventDefault();

		if (!name || !email || !password) {
			setError("Name, email, and password are required");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		// Simple password validation
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(password)) {
			setError(
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
			);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await axios.post("/api/auth/signup", {
				name,
				email,
				password,
				isAgent,
			});

			if (response.data.userId) {
				setUserId(response.data.userId);
				setSuccess("Account created! Please verify your email.");
				setCurrentView("verify-email");
				toast.success("Successfully Signed Up!");
			}
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Signup failed. Please try again.";
			toast.error("Signup failed. Please try again.");
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	// Handle email verification
	const handleVerifyEmail = async (e?: FormEvent) => {
		e?.preventDefault();

		if (!userId || !verificationCode) {
			setError("Verification code is required");
			return;
		}

		if (verificationCode.length !== 6) {
			setError("Verification code must be exactly 6 digits");
			return;
		}

		if (!/^\d{6}$/.test(verificationCode)) {
			setError("Verification code must contain only numbers");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await axios.post("/api/auth/verify-email", {
				userId,
				code: verificationCode,
			});

			if (response.data.token) {
				// Store the token
				if (typeof window !== "undefined") {
					sessionStorage.setItem("authToken", response.data.token);
					document.cookie = `authToken=${response.data.token}; path=/;`;
				}

				setSuccess("Email verified successfully!");

				// Close modal and trigger success callback
				setTimeout(() => {
					onClose();
					onAuthSuccess?.();
					window.location.reload(); // Refresh to update auth state
				}, 1000);
			}
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Verification failed. Please try again.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	// Handle resend verification code
	const handleResendCode = async () => {
		if (!userId) {
			setError("User ID is missing. Please try logging in again.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await axios.post("/api/auth/resend-code", {
				userId,
			});

			if (response.data.success) {
				setSuccess("Verification code sent! Please check your email.");
			}
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Failed to resend code. Please try again.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	// Request password reset
	const handleForgotPassword = async (e?: FormEvent) => {
		e?.preventDefault();

		if (!email) {
			setError("Email is required");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await axios.post("/api/auth/forgot-password", {
				email,
			});

			if (response.data.userId) {
				setUserId(response.data.userId);
				setSuccess("Password reset instructions sent to your email!");
				setCurrentView("verify-email");
			}
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error ||
				"Failed to process request. Please try again.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	// Reset password
	const handleResetPassword = async (e?: FormEvent) => {
		e?.preventDefault();

		if (!userId || !verificationCode || !newPassword) {
			setError("All fields are required");
			return;
		}

		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await axios.post("/api/auth/reset-password", {
				userId,
				code: verificationCode,
				newPassword,
			});

			if (response.data.success) {
				setSuccess(
					"Password reset successful! You can now login with your new password."
				);

				// Switch back to the login view after a brief delay
				setTimeout(() => {
					setCurrentView("main");
					setActiveTab("login");
				}, 2000);
			}
		} catch (err: any) {
			const errorMsg =
				err.response?.data?.error || "Password reset failed. Please try again.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	const getPasswordStrengthColor = (score: number) => {
		switch (score) {
			case 0:
			case 1:
				return "bg-red-500";
			case 2:
				return "bg-yellow-500";
			case 3:
				return "bg-blue-500";
			case 4:
				return "bg-green-500";
			default:
				return "bg-gray-300";
		}
	};

	const getPasswordStrengthText = (score: number) => {
		switch (score) {
			case 0:
			case 1:
				return "Weak";
			case 2:
				return "Fair";
			case 3:
				return "Good";
			case 4:
				return "Strong";
			default:
				return "";
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className='fixed inset-0 flex items-center justify-center z-50 p-2'
						onClick={(e) => e.stopPropagation()}
					>
						<div className='bg-white rounded-2xl shadow-xl overflow-y-auto relative w-full max-w-md max-h-[90vh]'>
							{/* Close button */}
							<button
								onClick={onClose}
								className='absolute right-4 top-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1 transition-all duration-200 z-10'
							>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M18 6L6 18M6 6L18 18'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</button>

							<div className='p-8'>
								{/* Title */}
								<h2 className='text-2xl font-bold text-orange-500 text-center mb-6'>
									Welcome to 100 GAJ
								</h2>

								{/* Main auth view (login/signup) */}
								{currentView === "main" && (
									<>
										{/* Tabs */}
										<div className='flex text-xl mb-6 border-b border-gray-200'>
											<button
												onClick={() => setActiveTab("login")}
												className={`flex-1 pb-4 text-center font-medium ${
													activeTab === "login"
														? "text-orange-500 border-b-2 border-orange-500"
														: "text-gray-500"
												}`}
											>
												Sign in
											</button>
											<button
												onClick={() => setActiveTab("signup")}
												className={`flex-1 pb-4 text-center font-medium ${
													activeTab === "signup"
														? "text-orange-500 border-b-2 border-orange-500"
														: "text-gray-500"
												}`}
											>
												New account
											</button>
										</div>

										{/* Error/Success Messages */}
										{error && (
											<div className='mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start'>
												<AlertCircle
													size={16}
													className='mr-2 mt-0.5 flex-shrink-0'
												/>
												<span>{error}</span>
											</div>
										)}

										{success && (
											<div className='mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start'>
												<CheckCircle
													size={16}
													className='mr-2 mt-0.5 flex-shrink-0'
												/>
												<span>{success}</span>
											</div>
										)}

										{/* Login Form */}
										{activeTab === "login" && (
											<form onSubmit={handleLogin} className='space-y-4'>
												<div>
													<label className='text-gray-700 text-sm font-medium mb-2 block'>
														Email
													</label>
													<div className='relative'>
														<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
															<Mail size={16} className='text-gray-400' />
														</div>
														<input
															type='email'
															value={email}
															onChange={(e) => setEmail(e.target.value)}
															placeholder='Enter email'
															className='w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
														/>
													</div>
												</div>

												<div>
													<label className='text-gray-700 text-sm font-medium mb-2 block'>
														Password
													</label>
													<div className='relative'>
														<input
															type={showPassword ? "text" : "password"}
															value={password}
															onChange={(e) => setPassword(e.target.value)}
															placeholder='Enter password'
															className='w-full pl-4 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
														/>
														<button
															type='button'
															onClick={() => setShowPassword(!showPassword)}
															className='absolute inset-y-0 right-0 pr-3 flex items-center'
														>
															{showPassword ? (
																<EyeOff size={16} className='text-gray-400' />
															) : (
																<Eye size={16} className='text-gray-400' />
															)}
														</button>
													</div>
												</div>

												<button
													type='submit'
													disabled={loading}
													className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
												>
													{loading ? "Signing in..." : "Sign in"}
												</button>

												<div className='text-center'>
													<button
														type='button'
														onClick={() => setCurrentView("forgot-password")}
														className='text-orange-500 hover:text-orange-600 text-sm font-medium'
													>
														Forgot your password?
													</button>
												</div>
											</form>
										)}

										{/* Signup Form */}
										{activeTab === "signup" && (
											<form onSubmit={handleSignup} className='space-y-4'>
												<div>
													<label className='text-gray-700 text-sm font-medium mb-2 block'>
														Name
													</label>
													<input
														type='text'
														value={name}
														onChange={(e) => setName(e.target.value)}
														placeholder='Enter your full name'
														className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
													/>
												</div>

												<div>
													<label className='text-gray-700 text-sm font-medium mb-2 block'>
														Email
													</label>
													<div className='relative'>
														<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
															<Mail size={16} className='text-gray-400' />
														</div>
														<input
															type='email'
															value={email}
															onChange={(e) => setEmail(e.target.value)}
															placeholder='Enter email'
															className='w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
														/>
													</div>
												</div>

												<div>
													<label className='text-gray-700 text-sm font-medium mb-2 block'>
														Password
													</label>
													<div className='relative'>
														<input
															type={showPassword ? "text" : "password"}
															value={password}
															onChange={(e) => {
																const newPassword = e.target.value;
																setPassword(newPassword);
																setPasswordStrength(
																	calculatePasswordStrength(newPassword)
																);
															}}
															placeholder='Create password'
															className='w-full pl-4 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
														/>
														<button
															type='button'
															onClick={() => setShowPassword(!showPassword)}
															className='absolute inset-y-0 right-0 pr-3 flex items-center'
														>
															{showPassword ? (
																<EyeOff size={16} className='text-gray-400' />
															) : (
																<Eye size={16} className='text-gray-400' />
															)}
														</button>
													</div>
													{password && (
														<div className='mt-2'>
															{/* Password Strength Bar */}
															<div className='flex items-center space-x-2 mb-2'>
																<div className='flex-1 h-2 bg-gray-200 rounded-full'>
																	<div
																		className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(
																			passwordStrength.score
																		)}`}
																		style={{
																			width: `${
																				(passwordStrength.score / 4) * 100
																			}%`,
																		}}
																	/>
																</div>
																<span className='text-xs text-gray-600'>
																	{getPasswordStrengthText(
																		passwordStrength.score
																	)}
																</span>
															</div>
															{passwordStrength.feedback.length > 0 && (
																<div className='text-xs text-gray-600'>
																	<span>Password must include:</span>
																	<ul className='list-disc list-inside mt-1'>
																		{passwordStrength.feedback.map(
																			(item, index) => (
																				<li key={index}>{item}</li>
																			)
																		)}
																	</ul>
																</div>
															)}
														</div>
													)}
												</div>

												<div className='flex items-center space-x-2'>
													<input
														type='checkbox'
														id='isAgent'
														checked={isAgent}
														onChange={(e) => setIsAgent(e.target.checked)}
														className='w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500'
													/>
													<label htmlFor='isAgent' className='text-gray-700'>
														I am a landlord or industry professional
													</label>
												</div>

												<button
													type='submit'
													disabled={loading}
													className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
												>
													{loading ? "Creating account..." : "Create account"}
												</button>

												<p className='text-sm text-gray-600 text-center'>
													By submitting, I accept 100 GAJ&apos;s{" "}
													<a
														href='#'
														className='text-orange-500 hover:text-orange-600'
													>
														terms of use
													</a>
													.
												</p>
											</form>
										)}
									</>
								)}

								{/* Forgot Password View */}
								{currentView === "forgot-password" && (
									<>
										<button
											type='button'
											onClick={() => setCurrentView("main")}
											className='flex items-center text-orange-500 hover:text-orange-600 mb-6'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5 mr-1'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M15 19l-7-7 7-7'
												/>
											</svg>
											Back to login
										</button>

										<h3 className='text-lg font-medium text-gray-900 mb-4'>
											Reset your password
										</h3>

										<p className='text-gray-600 mb-6'>
											Enter your email address and we&apos;ll send you a link to
											reset your password.
										</p>

										{/* Error/Success Messages */}
										{error && (
											<div className='mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start'>
												<AlertCircle
													size={16}
													className='mr-2 mt-0.5 flex-shrink-0'
												/>
												<span>{error}</span>
											</div>
										)}

										{success && (
											<div className='mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start'>
												<CheckCircle
													size={16}
													className='mr-2 mt-0.5 flex-shrink-0'
												/>
												<span>{success}</span>
											</div>
										)}

										<form onSubmit={handleForgotPassword} className='space-y-4'>
											<div>
												<label className='text-gray-700 text-sm font-medium mb-2 block'>
													Email
												</label>
												<div className='relative'>
													<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
														<Mail size={16} className='text-gray-400' />
													</div>
													<input
														type='email'
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														placeholder='Enter your email'
														className='w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
													/>
												</div>
											</div>

											<button
												type='submit'
												disabled={loading}
												className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
											>
												{loading ? "Sending..." : "Send reset link"}
											</button>
										</form>
									</>
								)}

								{/* Verify Email / OTP View */}
								{currentView === "verify-email" && (
									<>
										<button
											type='button'
											onClick={() => setCurrentView("main")}
											className='flex items-center text-orange-500 hover:text-orange-600 mb-6'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5 mr-1'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M15 19l-7-7 7-7'
												/>
											</svg>
											Back to login
										</button>

										<h3 className='text-lg font-medium text-gray-900 mb-4'>
											Verify your email
										</h3>

										<p className='text-gray-600 mb-6'>
											We&apos;ve sent a 6-digit verification code to your email.
											Please enter it below.
										</p>

										{/* Error/Success Messages */}
										{error && (
											<div className='mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start'>
												<AlertCircle
													size={16}
													className='mr-2 mt-0.5 flex-shrink-0'
												/>
												<span>{error}</span>
											</div>
										)}

										{success && (
											<div className='mb-4 p-3 rounded-md bg-green-50 text-green-500 text-sm flex items-start'>
												<CheckCircle
													size={16}
													className='mr-2 mt-0.5 flex-shrink-0'
												/>
												<span>{success}</span>
											</div>
										)}

										<form onSubmit={handleVerifyEmail} className='space-y-4'>
											<div>
												<label className='text-gray-700 text-sm font-medium mb-2 block'>
													Verification Code
												</label>
												<input
													type='text'
													value={verificationCode}
													onChange={(e) => setVerificationCode(e.target.value)}
													placeholder='Enter 6-digit code'
													maxLength={6}
													className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent text-center text-lg tracking-widest'
												/>
											</div>

											{currentView === "verify-email" && (
												<>
													{newPassword && (
														<>
															<div>
																<label className='text-gray-700 text-sm font-medium mb-2 block'>
																	New Password
																</label>
																<input
																	type={showPassword ? "text" : "password"}
																	value={newPassword}
																	onChange={(e) =>
																		setNewPassword(e.target.value)
																	}
																	placeholder='Enter new password'
																	className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
																/>
															</div>

															<div>
																<label className='text-gray-700 text-sm font-medium mb-2 block'>
																	Confirm Password
																</label>
																<input
																	type={showPassword ? "text" : "password"}
																	value={confirmPassword}
																	onChange={(e) =>
																		setConfirmPassword(e.target.value)
																	}
																	placeholder='Confirm new password'
																	className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-transparent'
																/>
															</div>
														</>
													)}

													<button
														type='submit'
														disabled={loading}
														className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'
														onClick={
															newPassword
																? handleResetPassword
																: handleVerifyEmail
														}
													>
														{loading
															? newPassword
																? "Resetting..."
																: "Verifying..."
															: newPassword
															? "Reset Password"
															: "Verify Email"}
													</button>
												</>
											)}

											<div className='text-center'>
												<button
													type='button'
													onClick={handleResendCode}
													disabled={loading}
													className='text-orange-500 hover:text-orange-600 text-sm font-medium disabled:opacity-50'
												>
													Resend code
												</button>
											</div>
										</form>
									</>
								)}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
