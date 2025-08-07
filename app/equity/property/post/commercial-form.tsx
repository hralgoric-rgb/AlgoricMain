"use client";
import { useEffect, useState, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Building2,
	MapPin,
	ImageIcon,
	FileText,
	CheckCircle,
	ArrowRight,
	ArrowLeft,
	Upload,
	X,
	Shield,
	Settings,
	Star,
	User,
	Calculator,
	TrendingUp,
} from "lucide-react";

// Interface for commercial property form data
interface CommercialPropertyFormData {
	// Step 1: Property Type & Category
	propertyType: string;
	listingCategory: string;
	
	// Step 2: Basic Property Details
	projectName: string;
	fullAddress: string;
	pinCode: string;
	city: string;
	locality: string;
	googleMapsPin: string;
	possessionStatus: string;
	builtUpArea: string;
	totalValuation: string;
	minimumInvestmentTicket: string;
	customTicketAmount: string;
	
	// Step 3: Fractional Investment Parameters
	targetRaiseAmount: string;
	ownershipSplit: string;
	sharePercentage: string;
	rentalYield: string;
	annualROIProjection: string;
	minimumHoldingPeriod: string;
	exitOptions: string[];
	
	// Step 4: Document Uploads (simplified for demo)
	documentsUploaded: boolean;
	
	// Step 5: Media & Marketing
	images: File[];
	existingImages: string[];
	virtualTourLink: string;
	requestVirtualTour: boolean;
	
	// Step 6: Additional Highlights
	highlights: string[];
	customHighlights: string;
	tenantName: string;
	
	// Step 7: Contact Information & Legal
	ownerDetails: {
		name: string;
		phone: string;
		email: string;
		companyName: string;
	};
	termsAccepted: boolean;
	
	// Internal coordinates
	coordinates: {
		latitude: string;
		longitude: string;
	};
}

// Lazy load heavy components
const EquityNavigation = lazy(() => import("@/app/equity/components/EquityNavigation"));
const AuthModal = lazy(() => import("@/app/equity/components").then(mod => ({ default: mod.AuthModal })));

// Loading component
const LoadingSpinner = () => (
	<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa]">
		<div className="relative">
			<div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse"></div>
			</div>
		</div>
	</div>
);

export default function CommercialPropertyForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [formStep, setFormStep] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showAuthModal, setShowAuthModal] = useState(false);

	// Property types for commercial real estate
	const propertyTypes = useMemo(() => [
		{
			value: "commercial-office",
			label: "Commercial Office",
			icon: <Building2 className="w-5 h-5" />,
		},
		{ 
			value: "retail-shop", 
			label: "Retail Shop", 
			icon: <Building2 className="w-5 h-5" />,
		},
		{ 
			value: "co-working-space", 
			label: "Co-working Space", 
			icon: <Building2 className="w-5 h-5" />,
		},
		{
			value: "warehousing-industrial",
			label: "Warehousing / Industrial",
			icon: <Building2 className="w-5 h-5" />,
		},
	], []);

	// Investment ticket options
	const investmentTicketOptions = useMemo(() => [
		"₹10,000", "₹25,000", "₹50,000", "Custom Amount"
	], []);

	// Possession status options
	const possessionStatusOptions = useMemo(() => [
		"Ready to Move", "Under Construction", "Leased Asset"
	], []);

	// Exit options
	const exitOptions = useMemo(() => [
		"Platform Resale", "Owner Buyback", "Secondary Marketplace (coming soon)"
	], []);

	// Property highlights/USP options
	const highlightOptions = useMemo(() => [
		"Grade-A construction",
		"Tenanted property",
		"Proximity to metro/highway", 
		"Expected price appreciation",
		"Developer track record",
		"Green building / IGBC certification",
		"Pre-leased income"
	], []);

	// Delhi areas
	const delhiAreas = useMemo(() => [
		"AAYA NAGAR", "ADARSH NAGAR", "ALIPUR", "AMBEDKAR NAGAR", "ANAND PARBAT", "ANANDVIHAR", 
		"ANDREWS GANJ", "AZADPUR", "BADARPUR", "BARAKHAMBA ROAD", "BAWANA", "BHALSWA JAHANGIR PUR", 
		"BIJWASAN", "BINDAPUR", "BRAHMPURI", "BURARI", "CHANAKYAPURI", "CHANDNI MAHAL", "CHHAWLA", 
		"CHITTARANJAN PARK", "CONNAUGHT PLACE", "D.B.G ROAD", "DABRI", "DARYA GANJ", "DEFENCE COLONY", 
		"DELHI CANTT", "DWARKA", "FARASH BAZAR", "FRIENDS COLONY", "GANDHI NAGAR", "GEETA COLONY", 
		"GHAZIPUR", "GOVINDPURI", "GREATER KAILASH", "H. N. DIN", "HARI NAGAR", "HASTSAL", 
		"HAUZ KHAS", "HAUZQAZI", "I.P. ESTATE", "INDERPURI", "JAFFARPUR KALAN", "JAGATPURI", 
		"JAHANGIR PURI", "JAMA MASJID", "JANAKPURI", "JANGPURA", "KAKROLA", "KALKAJI", 
		"KALYANPURI", "KAMLA MARKET", "KANJHAWLA", "KAPASHERA", "KARKARDOOMA", "KAROL BAGH", 
		"KASHMERE GATE", "KESHAV PURAM", "KHYALA", "KIRTI NAGAR", "KOTLA MUBARAKPUR", 
		"KOTWALI", "LAHORI GATE", "LAJPAT NAGAR", "LAWRENCE ROAD", "LAXMI NAGAR", 
		"LODHI ROAD", "MALVIYA NAGAR", "MANDIR MARG", "MATIALA", "MAURYA ENCLAVE", 
		"MAYAPURI", "MAYUR VIHAR", "MEHRAULI", "MODEL TOWN", "MOHAN GARDEN", "MUNDKA", 
		"NABI KARIM", "NAJAFGARH", "NAND NAGRI", "NANGLOI", "NARAINA", "NARELA", 
		"NEHRU PLACE", "NETAJI SUBHASH PLACE", "NEW FRIENDS COLONY", "NIHAL VIHAR", 
		"OKHLA", "PAHARGANJ", "PALAM", "PANDAV NAGAR", "PARLIAMENT STREET", 
		"PARSHAD NAGAR", "PASCHIM VIHAR", "PATEL NAGAR", "PATPARGANJ", "PEERAGARHI", 
		"POCHANPUR", "PRASHANT VIHAR", "PREET VIHAR", "PULPAHLADPUR", "PUNJABI BAGH", 
		"R. K. PURAM", "RAJINDER NAGAR", "RAJOURI GARDEN", "RANHAULA", "RANJIT NAGAR", 
		"ROHINI", "SABZI MANDI", "SADAR BAZAR", "SADH NAGAR", "SAGARPUR", "SAKET", 
		"SARAI ROHILLA", "SARITA VIHAR", "SAROJINI NAGAR", "SEELAMPUR", "SHAHDARA", 
		"SHAKURPUR", "SHASTRI PARK", "SHEIKH SARAI", "SOUTH EXTENSION", "SUBHASH NAGAR", 
		"SUBZIMANDI", "SUNDAR NAGRI", "TAGORE GARDEN", "TIGRI", "TILAK MARG", 
		"TILAK NAGAR", "TRI NAGAR", "TRILOKPURI", "TUGLAK ROAD", "TUGLAKABAD", 
		"UTTAM NAGAR", "VASANT KUNJ", "VASANT VIHAR", "VASUNDHARA ENCLAVE", "VIKAS PURI", 
		"VIKASPURI", "VIVEK VIHAR", "WAZIRPUR", "YAMUNA VIHAR"
	].sort(), []);

	const [formData, setFormData] = useState<CommercialPropertyFormData>({
		// Step 1: Property Type & Category
		propertyType: "",
		listingCategory: "Fractional Ownership",
		
		// Step 2: Basic Property Details
		projectName: "",
		fullAddress: "",
		pinCode: "",
		city: "Delhi",
		locality: "",
		googleMapsPin: "",
		possessionStatus: "",
		builtUpArea: "",
		totalValuation: "",
		minimumInvestmentTicket: "",
		customTicketAmount: "",
		
		// Step 3: Fractional Investment Parameters
		targetRaiseAmount: "",
		ownershipSplit: "",
		sharePercentage: "",
		rentalYield: "",
		annualROIProjection: "",
		minimumHoldingPeriod: "",
		exitOptions: [],
		
		// Step 4: Document Uploads
		documentsUploaded: false,
		
		// Step 5: Media & Marketing
		images: [],
		existingImages: [],
		virtualTourLink: "",
		requestVirtualTour: false,
		
		// Step 6: Additional Highlights
		highlights: [],
		customHighlights: "",
		tenantName: "",
		
		// Step 7: Contact Information & Legal
		ownerDetails: {
			name: "",
			phone: "",
			email: "",
			companyName: "",
		},
		termsAccepted: false,
		
		// Internal coordinates
		coordinates: {
			latitude: "",
			longitude: "",
		},
	});

	useEffect(() => {
		const token = typeof window !== "undefined"
			? sessionStorage.getItem("authToken") || localStorage.getItem("authToken")
			: null;

		if (!token) {
			setShowAuthModal(true);
			setLoading(false);
			return;
		}

		setShowAuthModal(false);
		setLoading(false);
	}, [router]);

	// Input change handler
	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		
		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			setFormData(prev => ({
				...prev,
				[parent]: {
					...prev[parent as keyof typeof prev] as any,
					[child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
				},
			}));
		} else {
			setFormData(prev => ({
				...prev,
				[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
			}));
		}
	}, []);

	// Handle highlight changes
	const handleHighlightChange = useCallback((highlight: string) => {
		setFormData(prev => ({
			...prev,
			highlights: prev.highlights.includes(highlight)
				? prev.highlights.filter((h: string) => h !== highlight)
				: [...prev.highlights, highlight]
		}));
	}, []);

	// Handle exit option changes
	const handleExitOptionChange = useCallback((option: string) => {
		setFormData(prev => ({
			...prev,
			exitOptions: prev.exitOptions.includes(option)
				? prev.exitOptions.filter((o: string) => o !== option)
				: [...prev.exitOptions, option]
		}));
	}, []);

	// Handle image upload
	const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newFiles = Array.from(files);
		const totalImages = formData.images.length + newFiles.length;

		if (totalImages > 10) {
			setError("Maximum 10 images allowed");
			return;
		}

		// Validate file sizes (10MB max each)
		const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
		if (oversizedFiles.length > 0) {
			setError("Each image must be less than 10MB");
			return;
		}

		setFormData(prev => ({
			...prev,
			images: [...prev.images, ...newFiles]
		}));
		setError(""); // Clear any previous errors
	}, [formData.images.length]);

	// Remove image
	const removeImage = useCallback((index: number) => {
		setFormData(prev => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index)
		}));
	}, []);

	// Step navigation
	const handleNextStep = useCallback(() => {
		if (formStep < 7) {
			setFormStep(formStep + 1);
			setError("");
		}
	}, [formStep]);

	const handlePrevStep = useCallback(() => {
		if (formStep > 1) {
			setFormStep(formStep - 1);
			setError("");
		}
	}, [formStep]);

	// Form submission
	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		console.log("Form submission started");
		
		setError("");
		setSuccess("");
		setSubmitting(true);

		try {
			const token = typeof window !== "undefined"
				? sessionStorage.getItem("authToken") || localStorage.getItem("authToken")
				: null;

			if (!token) {
				setError("You must be logged in to post a property.");
				setSubmitting(false);
				return;
			}

			// Validate only the fields that are actually implemented in the form
			const requiredFields = [
				{ field: formData.propertyType, name: "Property Type" },
				{ field: formData.projectName, name: "Project Name" },
				{ field: formData.fullAddress, name: "Full Address" },
				{ field: formData.pinCode, name: "Pin Code" },
				{ field: formData.locality, name: "Locality" },
				{ field: formData.possessionStatus, name: "Possession Status" },
				{ field: formData.builtUpArea, name: "Built-up Area" },
				{ field: formData.totalValuation, name: "Total Valuation" },
				{ field: formData.minimumInvestmentTicket, name: "Minimum Investment Ticket" },
				{ field: formData.ownerDetails.name, name: "Owner Name" },
				{ field: formData.ownerDetails.phone, name: "Owner Phone" },
				{ field: formData.ownerDetails.email, name: "Owner Email" },
				{ field: formData.termsAccepted, name: "Terms Acceptance", isBoolean: true }
			];

			const missingFields = requiredFields.filter(item => 
				item.isBoolean ? !item.field : !item.field?.toString().trim()
			);

			if (missingFields.length > 0) {
				setError(`Please fill in the following required fields: ${missingFields.map(f => f.name).join(', ')}`);
				setSubmitting(false);
				return;
			}

			// Additional validation for custom amount
			if (formData.minimumInvestmentTicket === "Custom Amount" && !formData.customTicketAmount) {
				setError("Please enter a custom ticket amount.");
				setSubmitting(false);
				return;
			}

			console.log("Submitting form data:", formData);
			console.log("Token exists:", !!token);
			console.log("Making API call to /api/commercial");

			let response;

			// Check if there are images to upload
			if (formData.images.length > 0) {
				// Use FormData for file uploads
				const submitData = new FormData();
				
				// Add all form fields except images
				const { images, ...formDataWithoutImages } = formData;
				
				// Add form data as JSON
				submitData.append('formData', JSON.stringify(formDataWithoutImages));
				
				// Add images as files
				images.forEach((file, index) => {
					submitData.append(`images`, file);
				});

				// Make API call with FormData
				response = await fetch('/api/commercial', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						// Don't set Content-Type for FormData - browser will set it with boundary
					},
					body: submitData,
				});
			} else {
				// Use JSON when no images
				const { images, ...formDataWithoutImages } = formData;
				
				response = await fetch('/api/commercial', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
					body: JSON.stringify(formDataWithoutImages),
				});
			}

			console.log("API Response status:", response.status);
			console.log("API Response headers:", Object.fromEntries(response.headers.entries()));

			if (!response.ok) {
				console.error("Response not ok:", response.status, response.statusText);
			}

			const result = await response.json();
			console.log("API Response data:", result);

			if (response.ok && result.success) {
				setSuccess("Commercial property submitted successfully for approval! You will be notified once it's reviewed.");
				setTimeout(() => {
					router.push("/equity/property");
				}, 3000);
			} else {
				const errorMessage = result.message || 
					(result.errors?.map((e: any) => typeof e === 'string' ? e : e.message).join(', ')) || 
					"Failed to submit property. Please try again.";
				setError(errorMessage);
				setSubmitting(false);
			}
		} catch (err) {
			console.error('Property submission error:', err);
			setError("An error occurred while submitting the property. Please check your connection and try again.");
			setSubmitting(false);
		}
	}, [formData, router]);

	const handleAuthSuccess = useCallback(() => {
		setShowAuthModal(false);
		window.location.reload();
	}, []);

	// Helper functions for calculations
	const getMinInvestmentAmount = useCallback(() => {
		if (formData.minimumInvestmentTicket === "Custom Amount") {
			return parseFloat(formData.customTicketAmount) || 10000;
		}
		
		const ticketMapping: Record<string, number> = {
			"₹10,000": 10000,
			"₹25,000": 25000,
			"₹50,000": 50000
		};
		
		return ticketMapping[formData.minimumInvestmentTicket] || 10000;
	}, [formData.minimumInvestmentTicket, formData.customTicketAmount]);

	const calculateTotalShares = useCallback(() => {
		const totalValue = parseFloat(formData.totalValuation) * 10000000; // Convert crores to rupees
		const minInvestment = getMinInvestmentAmount();
		
		if (!totalValue || !minInvestment) {
			return 1000; // Fallback
		}
		
		// Calculate total shares based on minimum investment
		const calculatedShares = Math.round(totalValue / minInvestment);
		
		// Ensure reasonable share count (between 100 and 10000)
		const minShares = 100;
		const maxShares = 10000;
		
		return Math.max(minShares, Math.min(maxShares, calculatedShares));
	}, [formData.totalValuation, getMinInvestmentAmount]);

	const calculatePricePerShare = useCallback(() => {
		const totalValue = parseFloat(formData.totalValuation) * 10000000;
		const totalShares = calculateTotalShares();
		return Math.round(totalValue / totalShares);
	}, [formData.totalValuation, calculateTotalShares]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (showAuthModal) {
		return (
			<>
				<style dangerouslySetInnerHTML={{
					__html: `
						.equity-post-page *:focus {
							border-color: #a855f7 !important;
							box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
							outline: none !important;
						}
					`
				}} />
				<Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />}>
					<AuthModal
						isOpen={showAuthModal}
						onClose={() => setShowAuthModal(false)}
						onAuthSuccess={handleAuthSuccess}
					/>
				</Suspense>
			</>
		);
	}

	return (
		<>
			<style dangerouslySetInnerHTML={{
				__html: `
					.equity-post-page *:focus {
						border-color: #a855f7 !important;
						box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
						outline: none !important;
					}
				`
			}} />
			
			<div className="equity-post-page min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa]">
				<Suspense fallback={<LoadingSpinner />}>
					<EquityNavigation />
				</Suspense>
				
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<div className="text-center mb-8">
							<h1 className="text-4xl font-bold text-white mb-4">
								Post Commercial Property for Fractional Ownership
							</h1>
							<p className="text-purple-200 text-lg">
								List your commercial property for fractional investment opportunities
							</p>
						</div>

						{/* Step Indicator */}
						<div className="flex justify-center mb-8">
							<div className="flex items-center space-x-4">
								{[1, 2, 3, 4, 5, 6, 7].map((step) => (
									<div
										key={step}
										className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
											formStep >= step
												? "bg-purple-600 text-white"
												: "bg-gray-600 text-gray-300"
										}`}
									>
										{step}
									</div>
								))}
							</div>
						</div>

						{/* Step Labels */}
						<div className="text-center mb-8">
							<h2 className="text-xl font-semibold text-white">
								{formStep === 1 && "Step 1: Property Type & Category"}
								{formStep === 2 && "Step 2: Basic Property Details"}
								{formStep === 3 && "Step 3: Fractional Investment Parameters"}
								{formStep === 4 && "Step 4: Document Uploads"}
								{formStep === 5 && "Step 5: Media & Marketing"}
								{formStep === 6 && "Step 6: Additional Highlights"}
								{formStep === 7 && "Step 7: Review & Submit"}
							</h2>
						</div>

						{/* Form Card */}
						<div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
							{error && (
								<div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
									<p className="text-red-200">{error}</p>
								</div>
							)}

							{success && (
								<div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
									<p className="text-green-200">{success}</p>
								</div>
							)}

							<form 
								onSubmit={(e) => {
									console.log("Form onSubmit triggered");
									handleSubmit(e);
								}} 
								className="space-y-6"
							>
								{/* Step 1: Property Type & Category */}
								{formStep === 1 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6 flex items-center">
											<Building2 className="w-6 h-6 mr-2 text-purple-400" />
											Select Property Type & Category
										</h3>

										<div>
											<Label htmlFor="propertyType" className="mb-2 block">Property Type&nbsp;*</Label>
											<Select
												value={formData.propertyType}
												onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
											>
												<SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
													<SelectValue placeholder="Select property type" />
												</SelectTrigger>
												<SelectContent className="bg-gray-900 border-purple-400/30">
													{propertyTypes.map((type) => (
														<SelectItem key={type.value} value={type.value} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
															<div className="flex items-center gap-2">
																{type.icon}
																{type.label}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label>Listing Category</Label>
											<div className="p-4 bg-white/10 border border-white/20 rounded-lg">
												<div className="flex items-center space-x-2">
													<CheckCircle className="w-5 h-5 text-green-400" />
													<span className="text-white">Fractional Ownership</span>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Step 2: Basic Property Details */}
								{formStep === 2 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6 flex items-center">
											<FileText className="w-6 h-6 mr-2 text-purple-400" />
											Enter Basic Property Details
										</h3>

										<div>
											<Label htmlFor="projectName" className="mb-2 block">Project/Asset Name *</Label>
											<Input
												id="projectName"
												name="projectName"
												value={formData.projectName}
												onChange={handleInputChange}
												placeholder="e.g., DLF Corporate Park"
												className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
												required
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="fullAddress" className="mb-2 block">Full Address with Pin Code *</Label>
												<Textarea
													id="fullAddress"
													name="fullAddress"
													value={formData.fullAddress}
													onChange={handleInputChange}
													placeholder="Complete address with pin code"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
											<div>
												<Label htmlFor="pinCode" className="mb-2 block">Pin Code *</Label>
												<Input
													id="pinCode"
													name="pinCode"
													value={formData.pinCode}
													onChange={handleInputChange}
													placeholder="110001"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="city" className="mb-2 block">City *</Label>
												<Input
													id="city"
													name="city"
													value={formData.city}
													onChange={handleInputChange}
													placeholder="Delhi"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
											<div>
												<Label htmlFor="locality" className="mb-2 block">Locality *</Label>
												<Select
													value={formData.locality}
													onValueChange={(value) => setFormData(prev => ({ ...prev, locality: value }))}
												>
													<SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
														<SelectValue placeholder="Select locality" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30 max-h-48 overflow-y-auto">
														{delhiAreas.map((area) => (
															<SelectItem key={area} value={area} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																{area}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div>
											<Label htmlFor="possessionStatus">Possession Status *</Label>
											<Select
												value={formData.possessionStatus}
												onValueChange={(value) => setFormData(prev => ({ ...prev, possessionStatus: value }))}
											>
												<SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
													<SelectValue placeholder="Select possession status" />
												</SelectTrigger>
												<SelectContent className="bg-gray-900 border-purple-400/30">
													{possessionStatusOptions.map((option) => (
														<SelectItem key={option} value={option} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
															{option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="builtUpArea">Built-up Area (sq. ft.) *</Label>
												<Input
													id="builtUpArea"
													name="builtUpArea"
													type="number"
													value={formData.builtUpArea}
													onChange={handleInputChange}
													placeholder="e.g., 10000"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
											<div>
												<Label htmlFor="totalValuation">Total Valuation (₹ Cr) *</Label>
												<Input
													id="totalValuation"
													name="totalValuation"
													type="number"
													step="0.1"
													value={formData.totalValuation}
													onChange={handleInputChange}
													placeholder="e.g., 50.5"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
										</div>

										<div>
											<Label htmlFor="minimumInvestmentTicket">Minimum Investment Ticket *</Label>
											<Select
												value={formData.minimumInvestmentTicket}
												onValueChange={(value) => setFormData(prev => ({ ...prev, minimumInvestmentTicket: value }))}
											>
												<SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
													<SelectValue placeholder="Select minimum ticket size" />
												</SelectTrigger>
												<SelectContent className="bg-gray-900 border-purple-400/30">
													{investmentTicketOptions.map((option) => (
														<SelectItem key={option} value={option} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
															{option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{formData.minimumInvestmentTicket === "Custom Amount" && (
											<div>
												<Label htmlFor="customTicketAmount">Custom Ticket Amount (₹) *</Label>
												<Input
													id="customTicketAmount"
													name="customTicketAmount"
													type="number"
													value={formData.customTicketAmount}
													onChange={handleInputChange}
													placeholder="e.g., 75000"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
										)}
									</div>
								)}

								{/* Step 3: Fractional Investment Parameters */}
								{formStep === 3 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6 flex items-center">
											<Calculator className="w-6 h-6 mr-2 text-purple-400" />
											Fractional Investment Parameters
										</h3>
										
										{/* Auto-calculated Investment Breakdown */}
										{formData.totalValuation && formData.minimumInvestmentTicket && (
											<div className="bg-purple-900/20 border border-purple-800/40 rounded-xl p-6 mb-6">
												<h4 className="text-lg font-semibold text-white mb-4 flex items-center">
													<TrendingUp className="w-5 h-5 mr-2 text-green-400" />
													Auto-Calculated Investment Structure
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="bg-white/5 p-4 rounded-lg border border-white/10">
														<div className="text-sm text-gray-400">Total Shares</div>
														<div className="text-2xl font-bold text-white">
															{calculateTotalShares().toLocaleString()}
														</div>
														<div className="text-xs text-gray-500 mt-1">
															Based on min. investment
														</div>
													</div>
													<div className="bg-white/5 p-4 rounded-lg border border-white/10">
														<div className="text-sm text-gray-400">Price Per Share</div>
														<div className="text-2xl font-bold text-green-400">
															₹{calculatePricePerShare().toLocaleString()}
														</div>
														<div className="text-xs text-gray-500 mt-1">
															Property value ÷ Total shares
														</div>
													</div>
													<div className="bg-white/5 p-4 rounded-lg border border-white/10">
														<div className="text-sm text-gray-400">Min. Investment</div>
														<div className="text-2xl font-bold text-purple-400">
															₹{getMinInvestmentAmount().toLocaleString()}
														</div>
														<div className="text-xs text-gray-500 mt-1">
															{formData.minimumInvestmentTicket}
														</div>
													</div>
												</div>
												<div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/40">
													<p className="text-sm text-blue-200">
														<strong>How it works:</strong> The total number of shares is automatically calculated by dividing your property value (₹{formData.totalValuation} Cr) by the minimum investment amount (₹{getMinInvestmentAmount().toLocaleString()}). This ensures each share costs approximately your chosen minimum investment amount.
													</p>
												</div>
											</div>
										)}

										{/* Optional Manual Inputs */}
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label htmlFor="rentalYield" className="mb-2 block">Expected Annual Rental Yield (%)</Label>
													<Input
														id="rentalYield"
														name="rentalYield"
														type="number"
														step="0.1"
														min="0"
														max="20"
														value={formData.rentalYield}
														onChange={handleInputChange}
														placeholder="e.g., 6.5"
														className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													/>
													<p className="text-xs text-gray-400 mt-1">Typical range: 4-12%</p>
												</div>
												<div>
													<Label htmlFor="annualROIProjection" className="mb-2 block">Expected Annual ROI (%)</Label>
													<Input
														id="annualROIProjection"
														name="annualROIProjection"
														type="number"
														step="0.1"
														min="0"
														max="30"
														value={formData.annualROIProjection}
														onChange={handleInputChange}
														placeholder="e.g., 12"
														className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													/>
													<p className="text-xs text-gray-400 mt-1">Includes rental yield + appreciation</p>
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label htmlFor="minimumHoldingPeriod" className="mb-2 block">Minimum Holding Period</Label>
													<Select
														value={formData.minimumHoldingPeriod}
														onValueChange={(value) => setFormData(prev => ({ ...prev, minimumHoldingPeriod: value }))}
													>
														<SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400">
															<SelectValue placeholder="Select period" />
														</SelectTrigger>
														<SelectContent className="bg-gray-900 border-purple-400/30">
															<SelectItem value="1 year" className="text-white hover:bg-purple-600/50">1 year</SelectItem>
															<SelectItem value="2 years" className="text-white hover:bg-purple-600/50">2 years</SelectItem>
															<SelectItem value="3 years" className="text-white hover:bg-purple-600/50">3 years</SelectItem>
															<SelectItem value="5 years" className="text-white hover:bg-purple-600/50">5 years</SelectItem>
															<SelectItem value="No minimum" className="text-white hover:bg-purple-600/50">No minimum</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label htmlFor="targetRaiseAmount" className="mb-2 block">Target Raise Amount (₹ Crores)</Label>
													<Input
														id="targetRaiseAmount"
														name="targetRaiseAmount"
														type="number"
														step="0.1"
														min="0"
														value={formData.targetRaiseAmount}
														onChange={handleInputChange}
														placeholder="e.g., 2.5"
														className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													/>
													<p className="text-xs text-gray-400 mt-1">Amount you want to raise from investors</p>
												</div>
											</div>

											{/* Exit Options */}
											<div>
												<Label className="mb-3 block">Exit Options (Select all that apply)</Label>
												<div className="space-y-2">
													{exitOptions.map((option) => (
														<div key={option} className="flex items-center space-x-2">
															<input
																type="checkbox"
																id={option}
																checked={formData.exitOptions.includes(option)}
																onChange={() => handleExitOptionChange(option)}
																className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
															/>
															<Label htmlFor={option} className="text-white cursor-pointer">
																{option}
															</Label>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								)}

								{formStep === 4 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6">
											Document Uploads
										</h3>
										<div className="text-white">
											<p>Document upload fields will be added here...</p>
										</div>
									</div>
								)}

								{formStep === 5 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6">
											Media & Marketing
										</h3>
										
										<div className="space-y-4">
											{/* Property Images Upload */}
											<div>
												<label className="block text-white text-sm font-medium mb-2">
													Property Images *
												</label>
												<div className="border-2 border-dashed border-purple-400/50 rounded-lg p-6 bg-white/5">
													<input
														type="file"
														multiple
														accept="image/*"
														onChange={handleImageUpload}
														className="hidden"
														id="property-images"
													/>
													<label 
														htmlFor="property-images"
														className="cursor-pointer flex flex-col items-center text-center"
													>
														<ImageIcon className="w-12 h-12 text-purple-400 mb-3" />
														<p className="text-white mb-2">
															Click to upload property images
														</p>
														<p className="text-gray-400 text-sm">
															PNG, JPG, JPEG up to 10MB each. Max 10 images.
														</p>
													</label>
												</div>
												
												{/* Preview uploaded images */}
												{formData.images.length > 0 && (
													<div className="mt-4">
														<p className="text-white text-sm mb-2">
															Uploaded Images ({formData.images.length}/10):
														</p>
														<div className="grid grid-cols-3 gap-3">
															{Array.from(formData.images).map((file, index) => (
																<div key={index} className="relative">
																	<img
																		src={URL.createObjectURL(file)}
																		alt={`Property ${index + 1}`}
																		className="w-full h-24 object-cover rounded-lg"
																	/>
																	<button
																		type="button"
																		onClick={() => removeImage(index)}
																		className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
																	>
																		×
																	</button>
																</div>
															))}
														</div>
													</div>
												)}
											</div>

											{/* Virtual Tour Link */}
											<div>
												<label className="block text-white text-sm font-medium mb-2">
													Virtual Tour Link (Optional)
												</label>
												<input
													type="url"
													value={formData.virtualTourLink || ""}
													onChange={(e) => setFormData(prev => ({ 
														...prev, 
														virtualTourLink: e.target.value 
													}))}
													placeholder="https://example.com/virtual-tour"
													className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
												/>
											</div>

											{/* Request Virtual Tour */}
											<div className="flex items-center space-x-3">
												<input
													type="checkbox"
													id="requestVirtualTour"
													checked={formData.requestVirtualTour || false}
													onChange={(e) => setFormData(prev => ({ 
														...prev, 
														requestVirtualTour: e.target.checked 
													}))}
													className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
												/>
												<label htmlFor="requestVirtualTour" className="text-white text-sm">
													Request virtual tour creation service
												</label>
											</div>
										</div>
									</div>
								)}

								{formStep === 6 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6">
											Additional Highlights
										</h3>
										<div className="space-y-4">
											{highlightOptions.map((highlight) => (
												<div key={highlight} className="flex items-center space-x-2">
													<input
														type="checkbox"
														id={highlight}
														checked={formData.highlights.includes(highlight)}
														onChange={() => handleHighlightChange(highlight)}
														className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400"
													/>
													<Label htmlFor={highlight} className="text-white">
														{highlight}
													</Label>
												</div>
											))}
										</div>
									</div>
								)}

								{formStep === 7 && (
									<div className="space-y-6">
										<h3 className="text-2xl font-bold text-white mb-6">
											Review & Submit
										</h3>
										
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="ownerDetails.name">Owner Name *</Label>
												<Input
													id="ownerDetails.name"
													name="ownerDetails.name"
													value={formData.ownerDetails.name}
													onChange={handleInputChange}
													placeholder="Full name"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
											<div>
												<Label htmlFor="ownerDetails.phone">Phone Number *</Label>
												<Input
													id="ownerDetails.phone"
													name="ownerDetails.phone"
													value={formData.ownerDetails.phone}
													onChange={handleInputChange}
													placeholder="Phone number"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="ownerDetails.email">Email Address *</Label>
												<Input
													id="ownerDetails.email"
													name="ownerDetails.email"
													type="email"
													value={formData.ownerDetails.email}
													onChange={handleInputChange}
													placeholder="Email address"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
													required
												/>
											</div>
											<div>
												<Label htmlFor="ownerDetails.companyName">Company Name (Optional)</Label>
												<Input
													id="ownerDetails.companyName"
													name="ownerDetails.companyName"
													value={formData.ownerDetails.companyName}
													onChange={handleInputChange}
													placeholder="Company name"
													className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
												/>
											</div>
										</div>

										<div className="flex items-center space-x-2">
											<input
												type="checkbox"
												id="termsAccepted"
												checked={formData.termsAccepted}
												onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
												className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-400"
												required
											/>
											<Label htmlFor="termsAccepted" className="text-white">
												I accept the terms and conditions for compliance and listing *
											</Label>
										</div>
									</div>
								)}

								{/* Navigation Buttons */}
								<div className="flex justify-between pt-6">
									<Button
										type="button"
										onClick={handlePrevStep}
										disabled={formStep === 1}
										className="bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										Previous
									</Button>

									{formStep < 7 ? (
										<Button
											type="button"
											onClick={handleNextStep}
											className="bg-purple-600 hover:bg-purple-700 text-white"
										>
											Next
											<ArrowRight className="w-4 h-4 ml-2" />
										</Button>
									) : (
										<Button
											type="submit"
											disabled={submitting}
											onClick={() => console.log("Submit button clicked, formStep:", formStep)}
											className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
										>
											{submitting ? "Submitting..." : "Submit for Verification"}
										</Button>
									)}
								</div>
							</form>
						</div>
					</div>
				</div>

				{/* Auth Modal */}
				<Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />}>
					<AuthModal
						isOpen={showAuthModal}
						onClose={() => setShowAuthModal(false)}
						onAuthSuccess={handleAuthSuccess}
					/>
				</Suspense>
			</div>
		</>
	);
}
