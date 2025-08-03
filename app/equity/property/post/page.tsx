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
// Optimized imports - only load what's needed
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
} from "lucide-react";

// Lazy load heavy components
const EquityNavigation = lazy(() => import("@/app/equity/components/EquityNavigation"));
const AuthModal = lazy(() => import("@/app/equity/components").then(mod => ({ default: mod.AuthModal })));

// Dynamic import for axios to reduce bundle size
const fetchCoordinates = async (query: string) => {
	const axios = (await import("axios")).default;
	return axios.get(`/api/geocode?q=${encodeURIComponent(query)}`);
};

// Loading component for better UX
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

interface PropertyFormData {
	// Step 1: Basic Property Details
	title: string;
	listingType: string;
	propertyType: string;
	subType: string;
	bedrooms: string;
	furnishing: string;
	propertyAge: string;
	possessionStatus: string;
	availableFrom: string;
	
	// Step 2: Location & Address
	address: {
		city: string;
		locality: string;
		projectName: string;
		street: string;
		floorNumber: string;
		landmark: string;
		coordinates: {
			latitude: string;
			longitude: string;
		};
	};
	
	// Step 3: Property Features & Area
	area: string;
	carpetArea: string;
	bathrooms: string;
	balcony: string;
	balconyCount: string;
	facing: string;
	parking: string;
	waterElectricity: string;
	description: string;
	
	// Step 4: Pricing & Media
	price: string;
	numberOfTokens: string;
	priceNegotiable: boolean;
	maintenanceCharges: string;
	securityDeposit: string;
	images: File[];
	existingImages: string[];
	floorPlan: File | null;
	virtualTour: string;
	ownershipType: string;
	
	// Step 5: Contact Information  
	ownerDetails: {
		name: string;
		phone: string;
		email: string;
	};
	
	amenities: string[];
	additionalFeatures: string;
}

export default function PostPropertyPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [formStep, setFormStep] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
	const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Memoized property types to prevent re-creation on every render
	const propertyTypes = useMemo(() => [
		{
			value: "apartment",
			label: "Apartment",
			icon: <Building2 className="w-5 h-5" />,
			subTypes: ["Studio Apartment", "Builder Floor", "Service Apartment", "Penthouse"]
		},
		{ 
			value: "house", 
			label: "Independent House", 
			icon: <Building2 className="w-5 h-5" />,
			subTypes: ["Villa", "Row House", "Bungalow", "Farmhouse"]
		},
		{ 
			value: "villa", 
			label: "Villa", 
			icon: <Building2 className="w-5 h-5" />,
			subTypes: ["Independent Villa", "Villa in Complex", "Resort Villa"]
		},
		{
			value: "commercial",
			label: "Commercial",
			icon: <Building2 className="w-5 h-5" />,
			subTypes: ["Shop", "Office Space", "Showroom", "Warehouse", "Restaurant Space"]
		},
		{ 
			value: "land", 
			label: "Plot/Land", 
			icon: <MapPin className="w-5 h-5" />,
			subTypes: ["Residential Plot", "Commercial Plot", "Agricultural Land", "Industrial Plot"]
		},
	], []);

	// Memoized amenities list
	const amenitiesList = useMemo(() => [
		"Parking", "Swimming Pool", "Gym", "Security", "Garden", "Elevator",
		"Power Backup", "Club House", "Air Conditioning", "Furnished", "Balcony",
		"Pet Friendly", "CCTV", "Intercom", "Fire Safety", "Water Storage",
		"Maintenance Staff", "Visitor Parking", "Children's Play Area", "Senior Citizen Sit-out"
	], []);

	// Memoized Delhi areas - only load when needed
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

	// Memoized options arrays
	const bhkOptions = useMemo(() => [
		"Studio", "1 RK", "1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK", 
		"4 BHK", "4.5 BHK", "5 BHK", "5+ BHK"
	], []);

	const furnishingOptions = useMemo(() => [
		"Unfurnished", "Semi-Furnished", "Fully Furnished"
	], []);

	const propertyAgeOptions = useMemo(() => [
		"New Construction", "Less than 1 year", "1-5 years", "5-10 years", "10-15 years", "15+ years"
	], []);

	const possessionStatusOptions = useMemo(() => [
		"Ready to Move", "Under Construction"
	], []);

	const facingOptions = useMemo(() => [
		"North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"
	], []);

	const parkingOptions = useMemo(() => [
		"No Parking", "1 Covered", "2 Covered", "3+ Covered", "1 Open", "2 Open", "3+ Open", "1 Covered + 1 Open"
	], []);

	const waterElectricityOptions = useMemo(() => [
		"24x7 Available", "Limited Hours", "Frequent Cuts", "No Issues"
	], []);

	const ownershipTypeOptions = useMemo(() => [
		"Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"
	], []);

	const [formData, setFormData] = useState<PropertyFormData>({
		// Step 1: Basic Property Details
		title: "",
		listingType: "sale",
		propertyType: "",
		subType: "",
		bedrooms: "",
		furnishing: "",
		propertyAge: "",
		possessionStatus: "",
		availableFrom: "",
		
		// Step 2: Location & Address
		address: {
			city: "Delhi",
			locality: "",
			projectName: "",
			street: "",
			floorNumber: "",
			landmark: "",
			coordinates: {
				latitude: "",
				longitude: "",
			},
		},
		
		// Step 3: Property Features & Area
		area: "",
		carpetArea: "",
		bathrooms: "",
		balcony: "",
		balconyCount: "",
		facing: "",
		parking: "",
		waterElectricity: "",
		description: "",
		
		// Step 4: Pricing & Media
		price: "",
		numberOfTokens: "",
		priceNegotiable: false,
		maintenanceCharges: "",
		securityDeposit: "",
		images: [],
		existingImages: [],
		floorPlan: null,
		virtualTour: "",
		ownershipType: "",
		
		// Step 5: Contact Information  
		ownerDetails: {
			name: "",
			phone: "",
			email: "",
		},
		
		amenities: [],
		additionalFeatures: "",
	});

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

	// Memoized getter for subtypes
	const getSubTypes = useCallback(() => {
		const selectedType = propertyTypes.find(type => type.value === formData.propertyType);
		return selectedType?.subTypes || [];
	}, [formData.propertyType, propertyTypes]);

	// Optimized input change handler
	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		
		if (name.includes('.')) {
			const [parent, child] = name.split('.');
			setFormData(prev => ({
				...prev,
				[parent]: {
					...prev[parent as keyof typeof prev] as any,
					[child]: type === 'number' ? parseFloat(value) || 0 : value,
				},
			}));
		} else {
			setFormData(prev => ({
				...prev,
				[name]: type === 'number' ? parseFloat(value) || 0 : value,
			}));
		}
	}, []);

	// Optimized nested input change handler
	const handleNestedInputChange = useCallback((parent: string, child: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[parent]: {
				...prev[parent as keyof typeof prev] as any,
				[child]: value,
			},
		}));
	}, []);

	// Optimized amenity change handler
	const handleAmenityChange = useCallback((amenity: string) => {
		setFormData(prev => ({
			...prev,
			amenities: prev.amenities.includes(amenity)
				? prev.amenities.filter((a: string) => a !== amenity)
				: [...prev.amenities, amenity]
		}));
	}, []);

	// Alias for handleAmenityChange to match form usage
	const handleAmenityToggle = handleAmenityChange;

	const removeImage = useCallback((index: number) => {
		setFormData(prev => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index)
		}));
		setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
	}, []);

	const handlePropertyTypeChange = useCallback((type: string) => {
		setFormData(prev => ({
			...prev,
			propertyType: type,
			subType: "", // Reset subtype when property type changes
		}));
	}, []);

	// Optimized image upload with compression
	const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		
		setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
		
		// Process images in batches to avoid blocking the UI
		const batchSize = 3;
		const newPreviewUrls: string[] = [];
		
		for (let i = 0; i < files.length; i += batchSize) {
			const batch = files.slice(i, i + batchSize);
			const batchUrls = await Promise.all(
				batch.map(file => {
					return new Promise<string>((resolve) => {
						const reader = new FileReader();
						reader.onload = (e) => resolve(e.target?.result as string);
						reader.readAsDataURL(file);
					});
				})
			);
			newPreviewUrls.push(...batchUrls);
			
			// Allow UI to update between batches
			if (i + batchSize < files.length) {
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}
		
		setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		
		const files = Array.from(e.dataTransfer.files);
		const imageFiles = files.filter(file => file.type.startsWith('image/'));
		
		setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }));
		
		const newPreviewUrls = await Promise.all(
			imageFiles.map(file => {
				return new Promise<string>((resolve) => {
					const reader = new FileReader();
					reader.onload = (e) => resolve(e.target?.result as string);
					reader.readAsDataURL(file);
				});
			})
		);
		
		setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
	}, []);

	// Memoized validation function for each step
	const validateStep = useMemo(() => (step: number): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];
		
		switch (step) {
			case 1: // Basic Property Details
				if (!formData.title.trim()) errors.push("Property title is required");
				if (!formData.listingType) errors.push("Listing type is required");
				if (!formData.propertyType) errors.push("Property type is required");
				if (!formData.bedrooms && formData.propertyType !== 'land' && formData.propertyType !== 'commercial') {
					errors.push("BHK/Room count is required");
				}
				if (!formData.furnishing) errors.push("Furnishing status is required");
				if (!formData.propertyAge) errors.push("Property age is required");
				if (!formData.possessionStatus) errors.push("Possession status is required");
				break;
				
			case 2: // Location & Address
				if (!formData.address.city.trim()) errors.push("City is required");
				if (!formData.address.locality.trim()) errors.push("Locality is required");
				if (!formData.address.street.trim()) errors.push("Street address is required");
				if (!formData.address.coordinates.latitude || !formData.address.coordinates.longitude) {
					errors.push("Coordinates are required - please fetch coordinates");
				}
				break;
				
			case 3: // Property Specifications
				if (!formData.area || parseFloat(formData.area) <= 0) errors.push("Valid area is required");
				if (!formData.price || parseFloat(formData.price) <= 0) errors.push("Valid token price is required");
				if (!formData.numberOfTokens || parseFloat(formData.numberOfTokens) <= 0) errors.push("Valid number of tokens is required");
				if (!formData.description.trim()) errors.push("Property description is required");
				break;
				
			case 4: // Amenities & Features
				// No minimum amenities requirement - users can select as many as they want
				break;
				
			case 5: // Images & Review
				// Check if images exist (either new uploads or existing images)
				const totalImages = (formData.existingImages?.length || 0) + (formData.images?.length || 0);
				if (totalImages === 0) {
					errors.push("At least one image is required");
				}
				// Require minimum 3 images for better listing quality
				if (totalImages < 3) {
					errors.push("Please upload at least 3 images for better listing quality");
				}
				// Require owner contact details
				if (!formData.ownerDetails.name.trim()) {
					errors.push("Owner name is required");
				}
				if (!formData.ownerDetails.phone.trim()) {
					errors.push("Owner phone number is required");
				}
				break;
		}
		
		return { isValid: errors.length === 0, errors };
	}, [formData]);

	// Helper function to check if current step is valid
	const isCurrentStepValid = useCallback((): boolean => {
		const validation = validateStep(formStep);
		return validation.isValid;
	}, [validateStep, formStep]);

	const handleNextStep = useCallback(() => {
		const validation = validateStep(formStep);
		
		if (!validation.isValid) {
			setError(`Please fill required fields: ${validation.errors.join(", ")}`);
			return;
		}
		
		if (formStep < 5) {
			setFormStep(formStep + 1);
		}
	}, [validateStep, formStep]);

	const handlePrevStep = useCallback(() => {
		if (formStep > 1) {
			setFormStep(formStep - 1);
		}
	}, [formStep]);

	// Optimized coordinate fetching with dynamic import
	const handleFetchCoordinates = useCallback(async () => {
		if (!formData.address.locality || !formData.address.city) return;
		
		setIsLoadingCoordinates(true);
		try {
			const query = `${formData.address.locality}, ${formData.address.city}, India`;
			const response = await fetchCoordinates(query);
			
			if (response.data && response.data.length > 0) {
				const { lat, lon } = response.data[0];
				setFormData(prev => ({
					...prev,
					address: {
						...prev.address,
						coordinates: {
							latitude: String(lat),
							longitude: String(lon),
						}
					}
				}));
				setSuccess("Coordinates fetched successfully!");
			} else {
				setError("Could not find coordinates for this locality");
			}
		} catch (error) {
			setError("Failed to fetch coordinates");
		} finally {
			setIsLoadingCoordinates(false);
		}
	}, [formData.address.locality, formData.address.city]);

	// Optimized AI description generator
	const handleGenerateAIDescription = useCallback(async () => {
		setIsGeneratingDescription(true);
		try {
			// Basic AI description generation using form data
			const amenitiesText = formData.amenities?.length > 0 
				? `Amenities: ${formData.amenities.join(", ")}.` 
				: "";
			
			const bedroomsText = formData.bedrooms 
				? `${formData.bedrooms}` 
				: "";
			const bathroomsText = formData.bathrooms 
				? `${formData.bathrooms} bathroom${parseInt(formData.bathrooms) > 1 ? "s" : ""}` 
				: "";
			const roomsText = bedroomsText && bathroomsText 
				? `${bedroomsText} with ${bathroomsText}` 
				: bedroomsText || bathroomsText;

			const locationText = formData.address?.city 
				? `located in ${formData.address?.locality || ""} ${formData.address?.locality ? "," : ""} ${formData.address?.city}` 
				: "";

			const generatedDescription = `This ${formData.propertyType}${formData.subType ? ` (${formData.subType})` : ""} ${roomsText ? `with ${roomsText}` : ""} is ${locationText}. The property offers ${formData.area} square feet of ${formData.furnishing?.toLowerCase()} living space. ${amenitiesText} Perfect for ${formData.listingType === 'rent' ? 'tenants' : 'buyers'} looking for quality living.`;
			
			setFormData(prev => ({ ...prev, description: generatedDescription }));
			setSuccess("AI description generated!");
		} catch (error) {
			setError("Failed to generate description. Please write manually.");
		} finally {
			setIsGeneratingDescription(false);
		}
	}, [formData.propertyType, formData.subType, formData.bedrooms, formData.bathrooms, formData.address, formData.area, formData.furnishing, formData.amenities, formData.listingType]);

	// Helper function to convert parking string to number
	const parseParkingValue = useCallback((parkingStr: string): number => {
		if (parkingStr === "No Parking") return 0;
		if (parkingStr === "1 Covered" || parkingStr === "1 Open") return 1;
		if (parkingStr === "2 Covered" || parkingStr === "2 Open") return 2;
		if (parkingStr === "3+ Covered" || parkingStr === "3+ Open") return 3;
		if (parkingStr === "1 Covered + 1 Open") return 2;
		return 0; // Default fallback
	}, []);

	// Optimized submit handler
	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setSubmitting(true);

		try {
			const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
				numberOfTokens: parseInt(formData.numberOfTokens),
				totalValue: parseInt(formData.price) * parseInt(formData.numberOfTokens),
				propertyType: formData.propertyType,
				listingType: formData.listingType,
				area: parseInt(formData.area),
				amenities: formData.amenities,
				features: [], // Empty features array
				furnished: formData.furnishing === "Fully Furnished",
				address: {
					street: formData.address.street,
					city: formData.address.city,
					locality: formData.address.locality,
					state: "Delhi", // Default state
					zipCode: "110001", // Default zipcode
					country: "India",
					location: {
						type: "Point",
						coordinates: [
							parseFloat(formData.address.coordinates.longitude),
							parseFloat(formData.address.coordinates.latitude)
						],
					},
				},
				images: imageUrls, // Use uploaded image URLs
				ownerDetails: {
					name: formData.ownerDetails.name,
					phone: formData.ownerDetails.phone,
					email: formData.ownerDetails.email,
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
	}, [formData, router]);

	const nextStep = useCallback(() => setFormStep((prev) => Math.min(prev + 1, 5)), []);
	const prevStep = useCallback(() => setFormStep((prev) => Math.max(prev - 1, 1)), []);

	const handleAuthSuccess = useCallback(() => {
		setShowAuthModal(false);
		// Reload the page to check authentication and KYC status with the new auth token
		window.location.reload();
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	// Block access completely if not authenticated - only show auth modal
	if (showAuthModal) {
		return (
			<>
				{/* Custom styles to override orange colors with purple - only for this page */}
				<style dangerouslySetInnerHTML={{
					__html: `
						/* Override all orange colors with purple - scoped to this page */
						.equity-post-page *:focus {
							border-color: #a855f7 !important;
							box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
							outline: none !important;
						}
						
						.equity-post-page input:focus, 
						.equity-post-page textarea:focus, 
						.equity-post-page select:focus,
						.equity-post-page [role="combobox"]:focus {
							border-color: #a855f7 !important;
							box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
							outline: none !important;
						}
						
						.equity-post-page button:focus {
							border-color: #a855f7 !important;
							box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
							outline: none !important;
						}
						
						.equity-post-page [data-state="open"] {
							border-color: #a855f7 !important;
							box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
						}
						
						/* Override any orange colors */
						.equity-post-page [style*="rgb(251, 146, 60)"], 
						.equity-post-page [style*="#fb9234"], 
						.equity-post-page [style*="orange"] {
							color: #a855f7 !important;
							border-color: #a855f7 !important;
							background-color: rgba(168, 85, 247, 0.1) !important;
						}
					`
				}} />
			<div className='equity-post-page min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] relative overflow-hidden'>
				{/* Animated Background Elements */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse'></div>
					<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl animate-bounce'></div>
					<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse'></div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl animate-spin'></div>
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
								Please sign in to access the property posting page
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
						window.location.href = "/equity";
					}}
					onAuthSuccess={handleAuthSuccess}
				/>
			</div>
			</>
		);
	}

	return (
		<>
			{/* Custom styles to override orange colors with purple - only for this page */}
			<style dangerouslySetInnerHTML={{
				__html: `
					/* Override all orange colors with purple - scoped to this page */
					.equity-post-page *:focus {
						border-color: #a855f7 !important;
						box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
						outline: none !important;
					}
					
					.equity-post-page input:focus, 
					.equity-post-page textarea:focus, 
					.equity-post-page select:focus,
					.equity-post-page [role="combobox"]:focus {
						border-color: #a855f7 !important;
						box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
						outline: none !important;
					}
					
					.equity-post-page button:focus {
						border-color: #a855f7 !important;
						box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
						outline: none !important;
					}
					
					.equity-post-page [data-state="open"] {
						border-color: #a855f7 !important;
						box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
					}
					
					/* Override any orange colors */
					.equity-post-page [style*="rgb(251, 146, 60)"], 
					.equity-post-page [style*="#fb9234"], 
					.equity-post-page [style*="orange"] {
						color: #a855f7 !important;
						border-color: #a855f7 !important;
						background-color: rgba(168, 85, 247, 0.1) !important;
					}
				`
			}} />
		<div className='equity-post-page min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] relative overflow-hidden'>
			{/* Static Background - animations removed */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl'></div>
				<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl'></div>
				<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl'></div>
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl'></div>
			</div>

			<Suspense fallback={<div className="fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm z-50" />}>
				<EquityNavigation />
			</Suspense>

			<div className='container mx-auto px-4 py-8 pt-24 relative z-10'>
				<div className='max-w-4xl mx-auto'>
					{/* Header with Glass Effect */}
					<div className='text-center mb-8 backdrop-blur-xl bg-black/80 rounded-3xl p-8 border border-white/10 shadow-2xl'>
						<h1 className='text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent'>
							Post Your Property
						</h1>
						<p className='text-purple-200 text-xl font-medium'>
							Fill in the details below to list your property
						</p>
						<div className='mt-4 flex justify-center'>
							<div className='w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full'></div>
						</div>
					</div>

					{/* Progress Bar with Glass Effect */}
					<div className='mb-8 backdrop-blur-xl bg-black/80 rounded-2xl p-6 border border-white/10 shadow-2xl'>
						<div className='flex items-center justify-between mb-4'>
							{[1, 2, 3, 4, 5].map((step) => (
								<div key={step} className='flex items-center'>
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
											formStep >= step
												? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
												: "bg-white/10 text-gray-300 backdrop-blur-sm"
										}`}
									>
										{formStep > step ? (
											<CheckCircle className='w-6 h-6' />
										) : (
											step
										)}
									</div>
									{step < 5 && (
										<div
											className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
												formStep > step
													? "bg-gradient-to-r from-purple-500 to-blue-500"
													: "bg-white/20"
											}`}
										/>
									)}
								</div>
							))}
						</div>
						<div className='text-center text-purple-200 text-lg font-medium'>
							Step {formStep} of 5
						</div>
						
						{/* Validation Status */}
						{!isCurrentStepValid() && (
							<div className='text-xs text-red-400 mt-1 text-center'>
								⚠️ Please fill all required fields to proceed
							</div>
						)}
					</div>

					{/* Form with Glass Effect */}
					<div className='backdrop-blur-xl bg-black/80 rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20'>
						<form onSubmit={handleSubmit}>
							{/* Step 1: Basic Property Details */}
							{formStep === 1 && (
								<div className='space-y-6'>
									<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
										<Building2 className='w-6 h-6 mr-2 text-purple-400' />
										Basic Property Details
									</h2>

										<div>
											<Label htmlFor="title">Property Title *</Label>
											<Input
												id="title"
												name="title"
												value={formData.title}
												onChange={handleInputChange}
												placeholder="e.g., 2 BHK Flat in Sector 62"
												className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
												required
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="listingType">Listing Type *</Label>
												<Select
													value={formData.listingType}
													onValueChange={(value) => setFormData(prev => ({ ...prev, listingType: value }))}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select listing type" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
														<SelectItem value="sale" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">Sell</SelectItem>
														<SelectItem value="rent" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">Rent</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label htmlFor="propertyType">Property Type *</Label>
												<Select
													value={formData.propertyType}
													onValueChange={handlePropertyTypeChange}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
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
										</div>

										{formData.propertyType && getSubTypes().length > 0 && (
											<div>
												<Label htmlFor="subType">Sub-Type</Label>
												<Select
													value={formData.subType}
													onValueChange={(value) => setFormData(prev => ({ ...prev, subType: value }))}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select sub-type" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
														{getSubTypes().map((subType) => (
															<SelectItem key={subType} value={subType} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																{subType}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{(formData.propertyType !== 'land' && formData.propertyType !== 'commercial') && (
												<div>
													<Label htmlFor="bedrooms">BHK/Room Count *</Label>
													<Select
														value={formData.bedrooms}
														onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}
													>
														<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
															<SelectValue placeholder="Select BHK" />
														</SelectTrigger>
														<SelectContent className="bg-gray-900 border-purple-400/30">
															{bhkOptions.map((bhk) => (
																<SelectItem key={bhk} value={bhk} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																	{bhk}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											)}

											<div>
												<Label htmlFor="furnishing">Furnishing *</Label>
												<Select
													value={formData.furnishing}
													onValueChange={(value) => setFormData(prev => ({ ...prev, furnishing: value }))}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select furnishing" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
														{furnishingOptions.map((option) => (
															<SelectItem key={option} value={option} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="propertyAge">Property Age *</Label>
												<Select
													value={formData.propertyAge}
													onValueChange={(value) => setFormData(prev => ({ ...prev, propertyAge: value }))}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select property age" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
														{propertyAgeOptions.map((option) => (
															<SelectItem key={option} value={option} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label htmlFor="possessionStatus">Possession Status *</Label>
												<Select
													value={formData.possessionStatus}
													onValueChange={(value) => setFormData(prev => ({ ...prev, possessionStatus: value }))}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
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
										</div>

										<div>
											<Label htmlFor="availableFrom">Available From</Label>
											<Input
												id="availableFrom"
												name="availableFrom"
												value={formData.availableFrom}
												onChange={handleInputChange}
												type="date"
												className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'
											/>
										</div>
									</div>
								)}

								{/* Step 2: Location & Address */}
								{formStep === 2 && (
									<div className='space-y-6'>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<MapPin className='w-6 h-6 mr-2 text-purple-400' />
											Location & Address
										</h2>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="address.city">City *</Label>
												<Select
													value={formData.address.city}
													onValueChange={(value) => handleNestedInputChange('address', 'city', value)}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select city" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
														<SelectItem value="Delhi" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">Delhi</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label htmlFor="address.locality">Locality/Sector *</Label>
												<Select
													value={formData.address.locality}
													onValueChange={(value) => handleNestedInputChange('address', 'locality', value)}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select locality" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
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
											<Label htmlFor="address.projectName">Project/Society Name</Label>
											<Input
												id="address.projectName"
												name="address.projectName"
												value={formData.address.projectName}
												onChange={handleInputChange}
												placeholder="Optional, but useful"
												className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
											/>
										</div>

										<div>
											<Label htmlFor="address.street">Full Address *</Label>
											<Textarea
												id="address.street"
												name="address.street"
												value={formData.address.street}
												onChange={handleInputChange}
												placeholder="Complete address"
												rows={3}
												className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
												required
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="address.floorNumber">Floor Number</Label>
												<Input
													id="address.floorNumber"
													name="address.floorNumber"
													value={formData.address.floorNumber}
													onChange={handleInputChange}
													placeholder="e.g., 2nd out of 10"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
												/>
											</div>

											<div>
												<Label htmlFor="address.landmark">Landmark</Label>
												<Input
													id="address.landmark"
													name="address.landmark"
													value={formData.address.landmark}
													onChange={handleInputChange}
													placeholder="Optional"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="address.coordinates.latitude">Latitude</Label>
												<div className="flex gap-2">
													<Input
														id="address.coordinates.latitude"
														name="address.coordinates.latitude"
														value={formData.address.coordinates.latitude}
														onChange={handleInputChange}
														placeholder="Auto-generated"
														className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
														readOnly
													/>
													<Button
														type="button"
														onClick={handleFetchCoordinates}
														disabled={isLoadingCoordinates}
														className="bg-purple-400 hover:bg-purple-500 text-white"
													>
														<MapPin className="w-4 h-4" />
													</Button>
												</div>
											</div>
											
											<div>
												<Label htmlFor="address.coordinates.longitude">Longitude</Label>
												<Input
													id="address.coordinates.longitude"
													name="address.coordinates.longitude"
													value={formData.address.coordinates.longitude}
													onChange={handleInputChange}
													placeholder="Auto-generated"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
													readOnly
												/>
											</div>
										</div>
									</div>
								)}

								{/* Step 3: Property Specifications */}
								{formStep === 3 && (
									<div className='space-y-6'>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<Settings className='w-6 h-6 mr-2 text-purple-400' />
											Property Specifications
										</h2>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="area">Built-up Area (sq ft) *</Label>
												<Input
													id="area"
													name="area"
													value={formData.area}
													onChange={handleInputChange}
													type="number"
													placeholder="e.g., 1200"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
													required
												/>
											</div>

											<div>
												<Label htmlFor="price">Token Price (INR) *</Label>
												<Input
													id="price"
													name="price"
													value={formData.price}
													onChange={handleInputChange}
													type="number"
													placeholder="e.g., 1000"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
													required
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<Label htmlFor="numberOfTokens">No. of Tokens *</Label>
												<Input
													id="numberOfTokens"
													name="numberOfTokens"
													value={formData.numberOfTokens}
													onChange={handleInputChange}
													type="number"
													placeholder="e.g., 100"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
													required
												/>
											</div>

											<div>
												<Label className="text-gray-300">Total Property Value</Label>
												<div className="bg-white/5 border border-white/10 rounded-lg p-3 text-purple-200 font-medium">
													₹{formData.price && formData.numberOfTokens ? 
														(parseFloat(formData.price) * parseFloat(formData.numberOfTokens)).toLocaleString('en-IN') : 
														'0'
													}
												</div>
											</div>
										</div>

										{(formData.propertyType !== 'land' && formData.propertyType !== 'commercial') && (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label htmlFor="bathrooms">Bathrooms</Label>
													<Select
														value={formData.bathrooms.toString()}
														onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}
													>
														<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
															<SelectValue placeholder="Select bathrooms" />
														</SelectTrigger>
														<SelectContent className="bg-gray-900 border-purple-400/30">
															{[1, 2, 3, 4, 5, 6].map((num) => (
																<SelectItem key={num} value={num.toString()} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																	{num} Bathroom{num > 1 ? 's' : ''}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div>
													<Label htmlFor="balcony">Balconies</Label>
													<Select
														value={formData.balcony.toString()}
														onValueChange={(value) => setFormData(prev => ({ ...prev, balcony: value }))}
													>
														<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
															<SelectValue placeholder="Select balconies" />
														</SelectTrigger>
														<SelectContent className="bg-gray-900 border-purple-400/30">
															{[0, 1, 2, 3, 4].map((num) => (
																<SelectItem key={num} value={num.toString()} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																	{num} Balcon{num === 1 ? 'y' : 'ies'}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{formData.propertyType === 'residential' && (
												<div>
													<Label htmlFor="facing">Facing Direction</Label>
													<Select
														value={formData.facing}
														onValueChange={(value) => setFormData(prev => ({ ...prev, facing: value }))}
													>
														<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
															<SelectValue placeholder="Select facing" />
														</SelectTrigger>
														<SelectContent className="bg-gray-900 border-purple-400/30">
															{facingOptions.map((option) => (
																<SelectItem key={option} value={option} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																	{option}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											)}

											<div>
												<Label htmlFor="parking">Parking</Label>
												<Select
													value={formData.parking}
													onValueChange={(value) => setFormData(prev => ({ ...prev, parking: value }))}
												>
													<SelectTrigger className='bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400'>
														<SelectValue placeholder="Select parking" />
													</SelectTrigger>
													<SelectContent className="bg-gray-900 border-purple-400/30">
														{parkingOptions.map((option) => (
															<SelectItem key={option} value={option} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										{formData.listingType === 'rent' && (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label htmlFor="securityDeposit">Security Deposit (INR)</Label>
													<Input
														id="securityDeposit"
														name="securityDeposit"
														value={formData.securityDeposit}
														onChange={handleInputChange}
														type="number"
														placeholder="e.g., 50000"
														className='bg-white/10 border-white/20 text-white placeholder-gray-400'
													/>
												</div>

												<div>
													<Label htmlFor="maintenanceCharges">Maintenance Charges (INR/month)</Label>
													<Input
														id="maintenanceCharges"
														name="maintenanceCharges"
														value={formData.maintenanceCharges}
														onChange={handleInputChange}
														type="number"
														placeholder="e.g., 2000"
														className='bg-white/10 border-white/20 text-white placeholder-gray-400'
													/>
												</div>
											</div>
										)}

										<div>
											<Label htmlFor="description">Property Description *</Label>
											<Textarea
												id="description"
												name="description"
												value={formData.description}
												onChange={handleInputChange}
												placeholder="Describe your property in detail..."
												rows={4}
												className='bg-white/10 border-white/20 text-white placeholder-gray-400'
												required
											/>
										</div>
									</div>
								)}

								{/* Step 4: Amenities & Features */}
								{formStep === 4 && (
									<div className='space-y-6'>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<Star className='w-6 h-6 mr-2 text-purple-400' />
											Amenities & Features
										</h2>

										<div>
											<div className="flex items-center justify-between mb-4">
												<Label className="text-lg font-semibold text-white">
													Select Available Amenities
												</Label>
												<div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-400/20 text-purple-300 border border-purple-400/30">
													{formData.amenities.length} selected
												</div>
											</div>
											<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
												{amenitiesList.map((amenity) => (
													<label
														key={amenity}
														className='flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-purple-400/50 transition-all duration-300'
													>
														<input
															type='checkbox'
															checked={formData.amenities.includes(amenity)}
															onChange={() => handleAmenityToggle(amenity)}
															className='w-4 h-4 text-purple-600 bg-transparent border-white/30 rounded focus:ring-purple-500 focus:ring-2'
														/>
														<span className='text-gray-300 text-sm font-medium'>{amenity}</span>
													</label>
												))}
											</div>
										</div>

										<div>
											<Label htmlFor="additionalFeatures">Additional Features</Label>
											<Textarea
												id="additionalFeatures"
												name="additionalFeatures"
												value={formData.additionalFeatures}
												onChange={handleInputChange}
												placeholder="Any other features or highlights of your property..."
												rows={3}
												className='bg-white/10 border-white/20 text-white placeholder-gray-400'
											/>
										</div>
									</div>
								)}

								{/* Step 5: Images & Review */}
								{formStep === 5 && (
									<div className='space-y-6'>
										<h2 className='text-2xl font-bold text-white mb-6 flex items-center'>
											<ImageIcon className='w-6 h-6 mr-2 text-purple-400' />
											Upload Images & Review
										</h2>

										{/* Image Upload Section */}
										<div>
											<Label className="text-lg font-semibold text-white mb-4 block">
												Property Images
											</Label>
											<div className='border-2 border-dashed border-purple-400/30 rounded-xl p-8 text-center bg-black/40 hover:bg-black/60 transition-all duration-300'>
												<Upload className='w-16 h-16 text-purple-400 mx-auto mb-4' />
												<input
													type='file'
													multiple
													accept='image/*'
													onChange={handleImageUpload}
													className='hidden'
													ref={fileInputRef}
												/>
												<Button
													type='button'
													onClick={() => fileInputRef.current?.click()}
													className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl mb-4'
												>
													<ImageIcon className="w-4 h-4 mr-2" />
													Choose Images
												</Button>
												<p className='text-gray-400'>
													Upload up to 10 high-quality images of your property
												</p>
												<p className='text-gray-500 text-sm mt-2'>
													Supported formats: JPG, PNG, WebP (Max 5MB each)
												</p>
											</div>
										</div>

										{/* Image Preview */}
										{formData.images.length > 0 && (
											<div>
												<Label className="text-lg font-semibold text-white mb-4 block">
													Selected Images ({formData.images.length}/10)
												</Label>
												<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
													{formData.images.map((image, index) => (
														<div key={index} className='relative group'>
															<img
																src={URL.createObjectURL(image)}
																alt={`Preview ${index + 1}`}
																className='w-full h-24 object-cover rounded-xl border border-white/20 group-hover:border-purple-400/50 transition-all duration-300'
															/>
															<button
																type='button'
																onClick={() => removeImage(index)}
																className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'
															>
																<X className='w-4 h-4' />
															</button>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Property Summary */}
										<div className="backdrop-blur-xl bg-black/80 rounded-2xl p-6 border border-white/10">
											<h3 className="text-xl font-bold text-white mb-4 flex items-center">
												<FileText className="w-5 h-5 mr-2 text-purple-400" />
												Property Summary
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
												<div className="space-y-2">
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Title:</span> {formData.title}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Type:</span> {formData.propertyType} - {formData.subType}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Listing:</span> {formData.listingType}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">BHK:</span> {formData.bedrooms}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Area:</span> {formData.area} sq ft</p>
												</div>
												<div className="space-y-2">
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Token Price:</span> ₹{formData.price}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">No. of Tokens:</span> {formData.numberOfTokens}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Total Value:</span> ₹{formData.price && formData.numberOfTokens ? (parseFloat(formData.price) * parseFloat(formData.numberOfTokens)).toLocaleString('en-IN') : '0'}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Location:</span> {formData.address.locality}, {formData.address.city}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Furnishing:</span> {formData.furnishing}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Possession:</span> {formData.possessionStatus}</p>
													<p className="text-gray-300"><span className="text-purple-400 font-medium">Amenities:</span> {formData.amenities.length} selected</p>
												</div>
											</div>
										</div>

										{/* Owner Contact Details */}
										<div className="backdrop-blur-xl bg-black/80 rounded-2xl p-6 border border-white/10">
											<h3 className="text-xl font-bold text-white mb-4 flex items-center">
												<User className="w-5 h-5 mr-2 text-purple-400" />
												Owner Contact Details
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div>
													<Label htmlFor="ownerDetails.name">Owner Name *</Label>
													<Input
														id="ownerDetails.name"
														name="ownerDetails.name"
														value={formData.ownerDetails.name}
														onChange={handleInputChange}
														placeholder="Enter owner's full name"
														className='bg-white/10 border-white/20 text-white placeholder-gray-400'
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
														placeholder="Enter contact number"
														type="tel"
														className='bg-white/10 border-white/20 text-white placeholder-gray-400'
														required
													/>
												</div>
											</div>
											
											<div className="mt-4">
												<Label htmlFor="ownerDetails.email">Email Address (Optional)</Label>
												<Input
													id="ownerDetails.email"
													name="ownerDetails.email"
													value={formData.ownerDetails.email}
													onChange={handleInputChange}
													placeholder="Enter email address"
													type="email"
													className='bg-white/10 border-white/20 text-white placeholder-gray-400'
												/>
											</div>
										</div>
									</div>
								)}

							{/* Navigation Buttons with Glass Effect */}
							<div className='flex justify-between mt-8'>
								<Button
									type='button'
									onClick={handlePrevStep}
									disabled={formStep === 1}
									className='backdrop-blur-xl bg-black/60 hover:bg-black/80 text-white px-6 py-3 rounded-xl flex items-center border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									<ArrowLeft className='w-4 h-4 mr-2' />
									Previous
								</Button>

								{formStep < 5 ? (
									<Button
										type='button'
										onClick={handleNextStep}
										className={`backdrop-blur-xl px-8 py-3 rounded-xl flex items-center border border-white/20 transition-all duration-300 shadow-lg ${
											isCurrentStepValid() 
												? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white shadow-purple-500/25' 
												: 'bg-gray-600/50 text-gray-300 cursor-not-allowed'
										}`}
										disabled={!isCurrentStepValid()}
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
					</div>

					{/* Success/Error Messages with Glass Effect */}
					{error && (
						<div className='mt-4 p-6 backdrop-blur-xl bg-red-500/10 border border-red-400/30 rounded-2xl text-red-200 text-center shadow-2xl'>
							<div className='flex items-center justify-center gap-2'>
								<div className='w-2 h-2 bg-red-400 rounded-full animate-pulse'></div>
								{error}
							</div>
						</div>
					)}

					{success && (
						<div className='mt-4 p-6 backdrop-blur-xl bg-green-500/10 border border-green-400/30 rounded-2xl text-green-200 text-center shadow-2xl'>
							<div className='flex items-center justify-center gap-2'>
								<div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
								{success}
							</div>
						</div>
					)}
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
