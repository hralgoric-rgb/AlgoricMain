"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
	Building2,
	MapPin,
	DollarSign,
	Image as ImageIcon,
	FileText,
	CheckCircle,
	ArrowRight,
	ArrowLeft,
	Upload,
	X,
	Shield,
} from "lucide-react";
import EquityNavigation from "@/app/equity/components/EquityNavigation";
import { AuthModal } from "@/app/equity/components";

interface PropertyFormData {
	title: string;
	description: string;
	price: string;
	location: string;
	propertyType: string;
	bedrooms?: string;
	bathrooms?: string;
	area: string;
	amenities: string[];
	images: File[];
}

export default function PostPropertyPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showAuthModal, setShowAuthModal] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState<PropertyFormData>({
		title: "",
		description: "",
		price: "",
		location: "",
		propertyType: "",
		bedrooms: "",
		bathrooms: "",
		area: "",
		amenities: [],
		images: [],
	});

	const propertyTypes = [
		{ label: "Residential Apartment", value: "apartment" },
		{ label: "Residential Villa", value: "villa" },
		{ label: "Commercial Office", value: "office" },
		{ label: "Commercial Retail", value: "commercial" },
		{ label: "Land", value: "land" },
		{ label: "House", value: "house" },
		{ label: "Other", value: "other" },
	];

	const amenitiesList = [
		"Parking",
		"Gym",
		"Swimming Pool",
		"Garden",
		"Security",
		"Elevator",
		"Air Conditioning",
		"Furnished",
		"Balcony",
		"Pet Friendly",
	];

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

		// Only check KYC verification if authenticated
		setShowAuthModal(false);

		// Check if user has completed KYC and OTP verification
		const checkVerification = async () => {
			try {
				const res = await fetch("/api/kyc", {
					method: "GET",
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await res.json();
				if (res.ok && data.reviewed) {
					const tokenPayload = JSON.parse(atob(token.split(".")[1]));
					const userId = tokenPayload.userId || tokenPayload.sub;
					const myKyc = data.reviewed.find(
						(k: any) =>
							k.userId === userId && k.status === "accepted" && k.otpVerified
					);
					if (myKyc) {
						setLoading(false);
					} else {
						// Redirect to dashboard if not verified
						router.replace("/equity/property/post-dashboard");
						return;
					}
				} else {
					// Redirect to dashboard if no KYC
					router.replace("/equity/property/post-dashboard");
					return;
				}
			} catch {
				// Redirect to dashboard on error
				router.replace("/equity/property/post-dashboard");
				return;
			}
			setLoading(false);
		};
		checkVerification();
	}, [router]);

	const handleInputChange = (field: keyof PropertyFormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAmenityToggle = (amenity: string) => {
		setFormData((prev) => ({
			...prev,
			amenities: prev.amenities.includes(amenity)
				? prev.amenities.filter((a) => a !== amenity)
				: [...prev.amenities, amenity],
		}));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files);
			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...newImages],
			}));
		}
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setSubmitting(true);

		try {
			const token = localStorage.getItem("authToken");
			if (!token) {
				setError("You must be logged in to post a property.");
				setSubmitting(false);
				return;
			}

			// Get user details from token
			const tokenPayload = JSON.parse(atob(token.split(".")[1]));
			const userId = tokenPayload.userId || tokenPayload.sub;

			// Upload images first if any are selected
			let imageUrls: string[] = [];
			if (formData.images.length > 0) {
				const uploadPromises = formData.images.map(async (image) => {
					const formDataUpload = new FormData();
					formDataUpload.append("file", image);

					const uploadRes = await fetch("/api/upload", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
						},
						body: formDataUpload,
					});

					if (uploadRes.ok) {
						const uploadData = await uploadRes.json();
						return uploadData.url;
					}
					return null;
				});

				const uploadedUrls = await Promise.all(uploadPromises);
				imageUrls = uploadedUrls.filter((url) => url !== null);
			}

			// Prepare the data according to the API expectations
			const propertyData: any = {
				title: formData.title,
				description: formData.description,
				price: parseInt(formData.price),
				propertyType: formData.propertyType,
				listingType: "sale", // Default to sale
				area: parseInt(formData.area),
				amenities: formData.amenities,
				features: [], // Empty features array
				furnished: false, // Default to unfurnished
				address: {
					street: formData.location,
					city: "Delhi", // Default city
					locality: formData.location,
					state: "Delhi", // Default state
					zipCode: "110001", // Default zipcode
					country: "India",
					location: {
						type: "Point",
						coordinates: [77.1025, 28.7041], // Default Delhi coordinates
					},
				},
				images: imageUrls, // Use uploaded image URLs
				ownerDetails: {
					name: "Property Owner", // Default name
					phone: "1234567890", // Default phone
					email: null,
				},
			};

			// Only add bedrooms and bathrooms for property types that require them
			if (
				formData.propertyType !== "land" &&
				formData.propertyType !== "commercial"
			) {
				propertyData.bedrooms = formData.bedrooms
					? parseInt(formData.bedrooms)
					: 0;
				propertyData.bathrooms = formData.bathrooms
					? parseInt(formData.bathrooms)
					: 0;
			}

			const res = await fetch("/api/properties", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(propertyData),
			});

			const data = await res.json();
			if (!res.ok) {
				if (data.details && Array.isArray(data.details)) {
					// Show specific validation errors
					const errorMessages = data.details
						.map((err: any) => `${err.field}: ${err.message}`)
						.join(", ");
					setError(`Validation failed: ${errorMessages}`);
				} else {
					setError(data.error || "Failed to post property");
				}
				setSubmitting(false);
				return;
			}

			setSuccess("Property posted successfully! Redirecting to properties...");
			setTimeout(() => {
				router.push("/equity/property");
			}, 2000);
		} catch (err) {
			setError("An error occurred. Please try again.");
			setSubmitting(false);
		}
	};

	const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
	const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

	const handleAuthSuccess = () => {
		setShowAuthModal(false);
		// Reload the page to check authentication and KYC status with the new auth token
		window.location.reload();
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
								Please sign in to access the property posting page
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
						window.location.href = "/equity";
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
							Post Your Property
						</h1>
						<p className='text-purple-200 text-xl font-medium'>
							Fill in the details below to list your property
						</p>
						<div className='mt-4 flex justify-center'>
							<div className='w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full'></div>
						</div>
					</motion.div>

					{/* Progress Bar with Glass Effect */}
					<motion.div
						className='mb-8 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<div className='flex items-center justify-between mb-4'>
							{[1, 2, 3, 4].map((step) => (
								<div key={step} className='flex items-center'>
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
											currentStep >= step
												? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
												: "bg-white/10 text-gray-300 backdrop-blur-sm"
										}`}
									>
										{currentStep > step ? (
											<CheckCircle className='w-6 h-6' />
										) : (
											step
										)}
									</div>
									{step < 4 && (
										<div
											className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
												currentStep > step
													? "bg-gradient-to-r from-purple-500 to-blue-500"
													: "bg-white/20"
											}`}
										/>
									)}
								</div>
							))}
						</div>
						<div className='text-center text-purple-200 text-lg font-medium'>
							Step {currentStep} of 4
						</div>
					</motion.div>

					{/* Form with Glass Effect */}
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className='backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20'
					>
						<form onSubmit={handleSubmit}>
							<AnimatePresence mode='wait'>
								{currentStep === 1 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className='space-y-6'
									>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<Building2 className='w-6 h-6 mr-2 text-purple-400' />
											Basic Information
										</h2>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Property Title *
												</label>
												<input
													type='text'
													value={formData.title}
													onChange={(e) =>
														handleInputChange("title", e.target.value)
													}
													className='w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:border-purple-400 focus:bg-white/15 outline-none transition-all duration-300 placeholder-gray-400'
													placeholder='e.g. Premium Office Space in Mumbai'
													required
												/>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Property Type *
												</label>
												<select
													value={formData.propertyType}
													onChange={(e) =>
														handleInputChange("propertyType", e.target.value)
													}
													className='w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:border-purple-400 focus:bg-white/15 outline-none transition-all duration-300'
													required
												>
													<option value=''>Select Property Type</option>
													{propertyTypes.map((type) => (
														<option key={type.value} value={type.value}>
															{type.label}
														</option>
													))}
												</select>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Price (INR) *
												</label>
												<div className='relative'>
													<DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
													<input
														type='number'
														value={formData.price}
														onChange={(e) =>
															handleInputChange("price", e.target.value)
														}
														className='w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:border-purple-400 focus:bg-white/15 outline-none transition-all duration-300 placeholder-gray-400'
														placeholder='e.g. 2500000'
														required
														min='0'
													/>
												</div>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Area (sq ft) *
												</label>
												<input
													type='number'
													value={formData.area}
													onChange={(e) =>
														handleInputChange("area", e.target.value)
													}
													className='w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:border-purple-400 focus:bg-white/15 outline-none transition-all duration-300 placeholder-gray-400'
													placeholder='e.g. 1500'
													required
													min='0'
												/>
											</div>
										</div>

										<div>
											<label className='block text-sm font-medium text-gray-300 mb-2'>
												Description *
											</label>
											<textarea
												value={formData.description}
												onChange={(e) =>
													handleInputChange("description", e.target.value)
												}
												className='w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:border-purple-400 focus:bg-white/15 outline-none transition-all duration-300 placeholder-gray-400 resize-none'
												placeholder='Describe your property, its features, amenities, etc.'
												rows={4}
												required
											/>
										</div>
									</motion.div>
								)}

								{currentStep === 2 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className='space-y-6'
									>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<MapPin className='w-6 h-6 mr-2 text-purple-400' />
											Location & Details
										</h2>

										<div>
											<label className='block text-sm font-medium text-gray-300 mb-2'>
												Location *
											</label>
											<input
												type='text'
												value={formData.location}
												onChange={(e) =>
													handleInputChange("location", e.target.value)
												}
												className='w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none'
												placeholder='e.g. Bandra Kurla Complex, Mumbai'
												required
											/>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Bedrooms
												</label>
												<input
													type='number'
													value={formData.bedrooms}
													onChange={(e) =>
														handleInputChange("bedrooms", e.target.value)
													}
													className='w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none'
													placeholder='e.g. 3'
													min='0'
												/>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Bathrooms
												</label>
												<input
													type='number'
													value={formData.bathrooms}
													onChange={(e) =>
														handleInputChange("bathrooms", e.target.value)
													}
													className='w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none'
													placeholder='e.g. 2'
													min='0'
												/>
											</div>
										</div>
									</motion.div>
								)}

								{currentStep === 3 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className='space-y-6'
									>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<CheckCircle className='w-6 h-6 mr-2 text-purple-400' />
											Amenities
										</h2>

										<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
											{amenitiesList.map((amenity) => (
												<label
													key={amenity}
													className='flex items-center space-x-3 cursor-pointer'
												>
													<input
														type='checkbox'
														checked={formData.amenities.includes(amenity)}
														onChange={() => handleAmenityToggle(amenity)}
														className='w-4 h-4 text-purple-600 bg-gray-900 border-purple-400/30 rounded focus:ring-purple-500'
													/>
													<span className='text-gray-300'>{amenity}</span>
												</label>
											))}
										</div>
									</motion.div>
								)}

								{currentStep === 4 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className='space-y-6'
									>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<ImageIcon className='w-6 h-6 mr-2 text-purple-400' />
											Property Images
										</h2>

										<div>
											<label className='block text-sm font-medium text-gray-300 mb-2'>
												Upload Images
											</label>
											<div className='border-2 border-dashed border-purple-400/30 rounded-lg p-6 text-center'>
												<Upload className='w-12 h-12 text-purple-400 mx-auto mb-4' />
												<input
													type='file'
													multiple
													accept='image/*'
													onChange={handleImageUpload}
													className='hidden'
													ref={fileInputRef}
												/>
												<button
													type='button'
													onClick={() => fileInputRef.current?.click()}
													className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors'
												>
													Choose Images
												</button>
												<p className='text-gray-400 mt-2'>
													Upload up to 10 images
												</p>
											</div>
										</div>

										{formData.images.length > 0 && (
											<div>
												<label className='block text-sm font-medium text-gray-300 mb-2'>
													Selected Images ({formData.images.length})
												</label>
												<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
													{formData.images.map((image, index) => (
														<div key={index} className='relative'>
															<img
																src={URL.createObjectURL(image)}
																alt={`Preview ${index + 1}`}
																className='w-full h-24 object-cover rounded-lg border border-purple-400/30'
															/>
															<button
																type='button'
																onClick={() => removeImage(index)}
																className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
															>
																<X className='w-4 h-4' />
															</button>
														</div>
													))}
												</div>
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>

							{/* Navigation Buttons with Glass Effect */}
							<div className='flex justify-between mt-8'>
								<Button
									type='button'
									onClick={prevStep}
									disabled={currentStep === 1}
									className='backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl flex items-center border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									<ArrowLeft className='w-4 h-4 mr-2' />
									Previous
								</Button>

								{currentStep < 4 ? (
									<Button
										type='button'
										onClick={nextStep}
										className='backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-8 py-3 rounded-xl flex items-center border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25'
									>
										Next
										<ArrowRight className='w-4 h-4 ml-2' />
									</Button>
								) : (
									<Button
										type='submit'
										disabled={submitting}
										className='backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-8 py-3 rounded-xl flex items-center border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50'
									>
										{submitting ? "Posting..." : "Post Property"}
										<FileText className='w-4 h-4 ml-2' />
									</Button>
								)}
							</div>
						</form>
					</motion.div>

					{/* Success/Error Messages with Glass Effect */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-4 p-6 backdrop-blur-xl bg-red-500/10 border border-red-400/30 rounded-2xl text-red-200 text-center shadow-2xl'
						>
							<div className='flex items-center justify-center gap-2'>
								<div className='w-2 h-2 bg-red-400 rounded-full animate-pulse'></div>
								{error}
							</div>
						</motion.div>
					)}

					{success && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-4 p-6 backdrop-blur-xl bg-green-500/10 border border-green-400/30 rounded-2xl text-green-200 text-center shadow-2xl'
						>
							<div className='flex items-center justify-center gap-2'>
								<div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
								{success}
							</div>
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	);
}
