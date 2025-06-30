export interface CommercialProperty {
  _id: string;
  title: string;
  description: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number];
  };
  images: string[];

  // Property Details
  propertyType: "Office" | "Retail" | "Warehouse" | "Mixed Use" | "Industrial";
  totalArea: number; // in sqft
  builtYear: number;

  // Developer Info
  developer: {
    name: string;
    rating: number;
    projectsCompleted: number;
  };

  // Investment Details
  totalPropertyValue: number; // Total value of the property
  totalShares: number; // Total shares available
  availableShares: number; // Remaining shares for purchase
  pricePerShare: number;
  minInvestment: number;

  // Returns
  currentROI: number; // Annual ROI percentage
  rentalYield: number; // Annual rental yield percentage
  appreciationRate: number; // Expected annual appreciation

  // Occupancy & Revenue
  currentOccupancy: number; // Percentage
  monthlyRental: number; // Total monthly rental income

  // SPV Details
  spvId: string;
  spvName: string;

  // Status
  status: "active" | "sold_out" | "coming_soon";
  featured: boolean;

  // Additional Info
  amenities: string[];
  nearbyLandmarks: string[];

  // Documents
  documents: {
    name: string;
    url: string;
    type: "legal" | "financial" | "technical";
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface UserInvestment {
  _id: string;
  userId: string;
  propertyId: string;
  property: CommercialProperty;
  sharesOwned: number;
  totalInvested: number;
  purchaseDate: string;
  currentValue: number;
  totalRentalReceived: number;
  monthlyRental: number;
  ownershipPercentage: number;

  // Returns tracking
  capitalAppreciation: number;
  totalReturns: number;

  status: "active" | "sold";
}

export const mockCommercialProperties: CommercialProperty[] = [
  {
    _id: "comm_001",
    title: "Premium Office Complex - Cyber City",
    description:
      "State-of-the-art Grade A office complex in the heart of Gurgaon's Cyber City. Fully leased to top IT companies with long-term contracts.",
    location: "Cyber City, Gurgaon",
    address: {
      street: "DLF Cyber City, Phase 2",
      city: "Gurgaon",
      state: "Haryana",
      zipCode: "122002",
      coordinates: [77.0855, 28.4949],
    },
    images: ["/canada.jpeg", "/airpirt.jpeg", "/image1.jpg"],
    propertyType: "Office",
    totalArea: 50000,
    builtYear: 2020,
    developer: {
      name: "DLF Limited",
      rating: 4.8,
      projectsCompleted: 250,
    },
    totalPropertyValue: 100000000, // 10 Cr
    totalShares: 1000,
    availableShares: 650,
    pricePerShare: 100000, // 1 Lakh per share
    minInvestment: 100000,
    currentROI: 12.5,
    rentalYield: 8.2,
    appreciationRate: 8.5,
    currentOccupancy: 95,
    monthlyRental: 850000,
    spvId: "SPV_CC_001",
    spvName: "Cyber City Office SPV",
    status: "active",
    featured: true,
    amenities: [
      "24/7 Security",
      "Power Backup",
      "High-Speed Elevators",
      "Food Court",
      "Parking",
      "Metro Connectivity",
    ],
    nearbyLandmarks: [
      "Cyber Hub",
      "DLF Mall",
      "MG Road Metro",
      "Cyber City Metro",
    ],
    documents: [
      {
        name: "Property Title Deed",
        url: "/documents/title-deed-001.pdf",
        type: "legal",
      },
      {
        name: "Rental Agreement",
        url: "/documents/rental-agreement-001.pdf",
        type: "legal",
      },
      {
        name: "Financial Statements",
        url: "/documents/financial-001.pdf",
        type: "financial",
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    _id: "comm_002",
    title: "Luxury Retail Mall - Connaught Place",
    description:
      "Prime retail space in Delhi's most prestigious commercial area. High footfall location with premium brand tenants.",
    location: "Connaught Place, New Delhi",
    address: {
      street: "Inner Circle, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      coordinates: [77.2197, 28.6315],
    },
    images: ["/airpirt.jpeg", "/canada.jpeg", "/image1.jpg"],
    propertyType: "Retail",
    totalArea: 35000,
    builtYear: 2019,
    developer: {
      name: "Phoenix Mills",
      rating: 4.6,
      projectsCompleted: 45,
    },
    totalPropertyValue: 75000000, // 7.5 Cr
    totalShares: 750,
    availableShares: 420,
    pricePerShare: 100000,
    minInvestment: 200000,
    currentROI: 14.2,
    rentalYield: 9.8,
    appreciationRate: 12.0,
    currentOccupancy: 88,
    monthlyRental: 620000,
    spvId: "SPV_CP_002",
    spvName: "CP Retail Mall SPV",
    status: "active",
    featured: true,
    amenities: [
      "Central AC",
      "Escalators",
      "Food Court",
      "Ample Parking",
      "Metro Connectivity",
      "High Street Access",
    ],
    nearbyLandmarks: [
      "Rajiv Chowk Metro",
      "Central Park",
      "Janpath Market",
      "India Gate",
    ],
    documents: [
      {
        name: "Property Title Deed",
        url: "/documents/title-deed-002.pdf",
        type: "legal",
      },
      {
        name: "Tenant Agreements",
        url: "/documents/tenant-agreements-002.pdf",
        type: "legal",
      },
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-03-05T00:00:00Z",
  },
  {
    _id: "comm_003",
    title: "Modern Warehouse Complex - Manesar",
    description:
      "Strategically located logistics hub with excellent connectivity to Delhi-NCR. Multiple e-commerce giants as tenants.",
    location: "Manesar, Gurgaon",
    address: {
      street: "IMT Manesar, Sector 8",
      city: "Manesar",
      state: "Haryana",
      zipCode: "122051",
      coordinates: [76.9366, 28.3728],
    },
    images: ["/image1.jpg", "/canada.jpeg", "/airpirt.jpeg"],
    propertyType: "Warehouse",
    totalArea: 80000,
    builtYear: 2021,
    developer: {
      name: "Welspun One",
      rating: 4.4,
      projectsCompleted: 35,
    },
    totalPropertyValue: 60000000, // 6 Cr
    totalShares: 600,
    availableShares: 280,
    pricePerShare: 100000,
    minInvestment: 100000,
    currentROI: 15.8,
    rentalYield: 11.2,
    appreciationRate: 10.5,
    currentOccupancy: 92,
    monthlyRental: 560000,
    spvId: "SPV_MN_003",
    spvName: "Manesar Logistics SPV",
    status: "active",
    featured: false,
    amenities: [
      "Heavy Vehicle Access",
      "Loading Docks",
      "24/7 Operations",
      "CCTV Surveillance",
      "Fire Safety Systems",
      "Highway Connectivity",
    ],
    nearbyLandmarks: [
      "NH-8 Highway",
      "IMT Manesar",
      "Hero MotoCorp",
      "Maruti Suzuki Plant",
    ],
    documents: [
      {
        name: "Property Title Deed",
        url: "/documents/title-deed-003.pdf",
        type: "legal",
      },
    ],
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-03-08T00:00:00Z",
  },
  {
    _id: "comm_004",
    title: "Tech Park - Noida Expressway",
    description:
      "Modern IT park housing multiple tech companies. Excellent infrastructure with fiber connectivity and modern facilities.",
    location: "Noida Expressway, Greater Noida",
    address: {
      street: "Knowledge Park III",
      city: "Greater Noida",
      state: "Uttar Pradesh",
      zipCode: "201310",
      coordinates: [77.4538, 28.4743],
    },
    images: ["/canada.jpeg", "/image1.jpg", "/airpirt.jpeg"],
    propertyType: "Office",
    totalArea: 45000,
    builtYear: 2022,
    developer: {
      name: "Logix Group",
      rating: 4.5,
      projectsCompleted: 28,
    },
    totalPropertyValue: 85000000, // 8.5 Cr
    totalShares: 850,
    availableShares: 340,
    pricePerShare: 100000,
    minInvestment: 150000,
    currentROI: 13.5,
    rentalYield: 9.2,
    appreciationRate: 9.8,
    currentOccupancy: 85,
    monthlyRental: 650000,
    spvId: "SPV_NE_004",
    spvName: "Noida Tech Park SPV",
    status: "active",
    featured: true,
    amenities: [
      "High-Speed Internet",
      "Conference Centers",
      "Cafeteria",
      "Gym & Recreation",
      "Ample Parking",
      "Green Building Certified",
    ],
    nearbyLandmarks: ["Pari Chowk", "Alpha Mall", "Wipro Campus", "TCS Campus"],
    documents: [
      {
        name: "Property Title Deed",
        url: "/documents/title-deed-004.pdf",
        type: "legal",
      },
    ],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
  {
    _id: "comm_005",
    title: "Premium Shopping Center - Saket",
    description:
      "Upscale shopping destination in South Delhi with premium brands and high-end restaurants.",
    location: "Saket, New Delhi",
    address: {
      street: "District Centre, Saket",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110017",
      coordinates: [77.2145, 28.5245],
    },
    images: ["/airpirt.jpeg", "/image1.jpg", "/canada.jpeg"],
    propertyType: "Mixed Use",
    totalArea: 40000,
    builtYear: 2018,
    developer: {
      name: "Select City Walk",
      rating: 4.7,
      projectsCompleted: 15,
    },
    totalPropertyValue: 95000000, // 9.5 Cr
    totalShares: 950,
    availableShares: 180,
    pricePerShare: 100000,
    minInvestment: 250000,
    currentROI: 11.8,
    rentalYield: 7.5,
    appreciationRate: 11.2,
    currentOccupancy: 94,
    monthlyRental: 710000,
    spvId: "SPV_SK_005",
    spvName: "Saket Shopping SPV",
    status: "active",
    featured: true,
    amenities: [
      "Premium Retail Spaces",
      "Multiplex Cinema",
      "Fine Dining",
      "Valet Parking",
      "Metro Connectivity",
      "Brand Anchor Stores",
    ],
    nearbyLandmarks: [
      "Saket Metro Station",
      "Select City Walk",
      "Malviya Nagar",
      "Hauz Khas",
    ],
    documents: [
      {
        name: "Property Title Deed",
        url: "/documents/title-deed-005.pdf",
        type: "legal",
      },
    ],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-03-12T00:00:00Z",
  },
];

// Mock user investments for dashboard
export const mockUserInvestments: UserInvestment[] = [
  {
    _id: "inv_001",
    userId: "user_123",
    propertyId: "comm_001",
    property: mockCommercialProperties[0],
    sharesOwned: 5,
    totalInvested: 500000,
    purchaseDate: "2024-01-20T00:00:00Z",
    currentValue: 545000,
    totalRentalReceived: 18500,
    monthlyRental: 4250,
    ownershipPercentage: 0.5,
    capitalAppreciation: 45000,
    totalReturns: 63500,
    status: "active",
  },
  {
    _id: "inv_002",
    userId: "user_123",
    propertyId: "comm_002",
    property: mockCommercialProperties[1],
    sharesOwned: 3,
    totalInvested: 300000,
    purchaseDate: "2024-02-05T00:00:00Z",
    currentValue: 336000,
    totalRentalReceived: 8900,
    monthlyRental: 2480,
    ownershipPercentage: 0.4,
    capitalAppreciation: 36000,
    totalReturns: 44900,
    status: "active",
  },
];
