"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, TrendingUp, Building2, Target, Star, Filter, Grid3X3, List, ArrowUpDown, Briefcase, Warehouse, Store, Server, UserPlus, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "../components";

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  currentYield: number;
  predictedAppreciation: number;
  riskLevel: "Low" | "Medium" | "High";
  image: string;
  description: string;
  rentalIncome: number;
  occupancyRate: number;
  totalValue: number;
  aiScore: number;
  features: string[];
}

export default function PropertyListingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [sortBy, setSortBy] = useState("aiScore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [yieldRange, setYieldRange] = useState<[number, number]>([0, 15]);

  // Mock data
  const mockProperties: Property[] = [
    {
      id: "1",
      name: "Cyber Hub Office Complex",
      type: "Office Building",
      location: "Gurgaon, Haryana",
      totalShares: 10000,
      availableShares: 3500,
      pricePerShare: 2500,
      currentYield: 8.5,
      predictedAppreciation: 15.2,
      riskLevel: "Medium",
      image: "/images/office-complex.jpg",
      description: "Premium Grade A office space in Cyber Hub with multinational tenants",
      rentalIncome: 850000,
      occupancyRate: 95,
      totalValue: 25000000,
      aiScore: 92,
      features: ["Prime Location", "High Occupancy", "A+ Tenants", "Modern Facilities"]
    },
    {
      id: "2",
      name: "Logistic Park Warehouse",
      type: "Warehouse",
      location: "Sonipat, Haryana",
      totalShares: 8000,
      availableShares: 2200,
      pricePerShare: 1800,
      currentYield: 9.2,
      predictedAppreciation: 18.7,
      riskLevel: "High",
      image: "/images/warehouse.jpg",
      description: "Strategic logistics facility with e-commerce anchor tenants",
      rentalIncome: 950000,
      occupancyRate: 88,
      totalValue: 14400000,
      aiScore: 88,
      features: ["E-commerce Hub", "Highway Access", "Scalable", "Growing Demand"]
    },
    {
      id: "3",
      name: "Retail Mall Complex",
      type: "Retail",
      location: "Noida, UP",
      totalShares: 15000,
      availableShares: 5800,
      pricePerShare: 3200,
      currentYield: 7.8,
      predictedAppreciation: 12.5,
      riskLevel: "Low",
      image: "/images/retail-mall.jpg",
      description: "Established shopping mall with anchor stores and food courts",
      rentalIncome: 1200000,
      occupancyRate: 92,
      totalValue: 48000000,
      aiScore: 89,
      features: ["Anchor Stores", "Food Court", "Entertainment", "Parking"]
    },
    {
      id: "4",
      name: "Data Center Facility",
      type: "Data Center",
      location: "Mumbai, Maharashtra",
      totalShares: 6000,
      availableShares: 1800,
      pricePerShare: 5000,
      currentYield: 11.5,
      predictedAppreciation: 22.3,
      riskLevel: "Medium",
      image: "/images/data-center.jpg",
      description: "Tier-3 data center with cloud service provider tenants",
      rentalIncome: 1800000,
      occupancyRate: 98,
      totalValue: 30000000,
      aiScore: 95,
      features: ["Tier-3 Certified", "Cloud Tenants", "24/7 Security", "Backup Power"]
    },
    {
      id: "5",
      name: "Co-working Hub",
      type: "Co-working",
      location: "Bangalore, Karnataka",
      totalShares: 12000,
      availableShares: 4500,
      pricePerShare: 2800,
      currentYield: 8.9,
      predictedAppreciation: 16.8,
      riskLevel: "Medium",
      image: "/images/coworking.jpg",
      description: "Modern co-working space with flexible membership models",
      rentalIncome: 750000,
      occupancyRate: 87,
      totalValue: 33600000,
      aiScore: 86,
      features: ["Flexible Space", "Tech Startups", "Premium Location", "Community"]
    },
    {
      id: "6",
      name: "Industrial Manufacturing",
      type: "Industrial",
      location: "Pune, Maharashtra",
      totalShares: 7500,
      availableShares: 2800,
      pricePerShare: 2200,
      currentYield: 9.8,
      predictedAppreciation: 14.2,
      riskLevel: "High",
      image: "/images/industrial.jpg",
      description: "Manufacturing facility with automotive industry tenants",
      rentalIncome: 680000,
      occupancyRate: 90,
      totalValue: 16500000,
      aiScore: 83,
      features: ["Automotive Hub", "Export Facility", "Rail Access", "Skilled Labor"]
    },
    {
      id: "7",
      name: "Tech Park Office",
      type: "Office Building",
      location: "Hyderabad, Telangana",
      totalShares: 9000,
      availableShares: 3200,
      pricePerShare: 2900,
      currentYield: 8.2,
      predictedAppreciation: 13.8,
      riskLevel: "Low",
      image: "/images/tech-park.jpg",
      description: "IT park with major technology companies as tenants",
      rentalIncome: 720000,
      occupancyRate: 94,
      totalValue: 26100000,
      aiScore: 90,
      features: ["IT Companies", "Metro Access", "Food Courts", "Parking"]
    },
    {
      id: "8",
      name: "Cold Storage Facility",
      type: "Warehouse",
      location: "Chennai, Tamil Nadu",
      totalShares: 5500,
      availableShares: 1900,
      pricePerShare: 3800,
      currentYield: 10.5,
      predictedAppreciation: 19.2,
      riskLevel: "High",
      image: "/images/cold-storage.jpg",
      description: "Temperature-controlled storage for pharmaceutical and food industries",
      rentalIncome: 980000,
      occupancyRate: 96,
      totalValue: 20900000,
      aiScore: 91,
      features: ["Temperature Control", "Pharma Grade", "Port Access", "Specialized"]
    }
  ];

  const propertyTypes = [
    { value: "all", label: "All Types", icon: Building2 },
    { value: "office", label: "Office Buildings", icon: Briefcase },
    { value: "warehouse", label: "Warehouses", icon: Warehouse },
    { value: "retail", label: "Retail", icon: Store },
    { value: "data-center", label: "Data Centers", icon: Server },
    { value: "co-working", label: "Co-working", icon: UserPlus },
    { value: "industrial", label: "Industrial", icon: Coffee }
  ];

  const riskLevels = [
    { value: "all", label: "All Risk Levels" },
    { value: "low", label: "Low Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "high", label: "High Risk" }
  ];

  const sortOptions = [
    { value: "aiScore", label: "AI Score" },
    { value: "yield", label: "Current Yield" },
    { value: "appreciation", label: "Predicted Growth" },
    { value: "price", label: "Price per Share" },
    { value: "occupancy", label: "Occupancy Rate" }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(property =>
        property.type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Risk filter
    if (selectedRisk !== "all") {
      filtered = filtered.filter(property =>
        property.riskLevel.toLowerCase() === selectedRisk.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.pricePerShare >= priceRange[0] && property.pricePerShare <= priceRange[1]
    );

    // Yield range filter
    filtered = filtered.filter(property =>
      property.currentYield >= yieldRange[0] && property.currentYield <= yieldRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "aiScore":
          return b.aiScore - a.aiScore;
        case "yield":
          return b.currentYield - a.currentYield;
        case "appreciation":
          return b.predictedAppreciation - a.predictedAppreciation;
        case "price":
          return a.pricePerShare - b.pricePerShare;
        case "occupancy":
          return b.occupancyRate - a.occupancyRate;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedType, selectedRisk, priceRange, yieldRange, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background with Parallax */}
      <div className="absolute inset-0 bg-black">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/20 rounded-full"
            animate={{
              x: [0, Math.random() * window.innerWidth || 1000],
              y: [0, Math.random() * window.innerHeight || 1000],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(249, 115, 22, 0.5)",
                  "0 0 40px rgba(249, 115, 22, 0.8)",
                  "0 0 20px rgba(249, 115, 22, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Commercial Properties
              <span className="text-orange-500 ml-2">Marketplace</span>
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover premium commercial real estate opportunities and build your equity portfolio
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            boxShadow: [
              "0 0 20px rgba(147, 51, 234, 0.2)",
              "0 0 40px rgba(249, 115, 22, 0.3)",
              "0 0 20px rgba(34, 197, 94, 0.2)"
            ]
          }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mb-8 relative overflow-hidden group"
          whileHover={{ scale: 1.01 }}
          transition={{
            boxShadow: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            },
            hover: {
              type: "spring",
              stiffness: 300
            }
          }}
        >
          {/* Glowing border animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-transparent"
            animate={{
              borderImage: [
                "linear-gradient(45deg, rgba(147, 51, 234, 0.5), rgba(249, 115, 22, 0.5), rgba(34, 197, 94, 0.5)) 1",
                "linear-gradient(90deg, rgba(249, 115, 22, 0.5), rgba(34, 197, 94, 0.5), rgba(147, 51, 234, 0.5)) 1",
                "linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(147, 51, 234, 0.5), rgba(249, 115, 22, 0.5)) 1"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Search Bar */}
          <div className="relative z-10 mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <motion.input
              type="text"
              placeholder="Search properties by name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-all duration-300"
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(249, 115, 22, 0.4)"
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="relative z-10 flex flex-wrap gap-2 mb-6">
            {propertyTypes.map((type, index) => (
              <motion.button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === type.value
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: selectedType === type.value 
                    ? "0 0 30px rgba(249, 115, 22, 0.6)" 
                    : "0 0 20px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </motion.button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Risk Level</label>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {riskLevels.map((risk) => (
                  <option key={risk.value} value={risk.value}>
                    {risk.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">View</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Results</label>
              <div className="flex items-center justify-center h-10 bg-black/40 border border-gray-700 rounded-lg text-white">
                <span className="text-sm font-medium">{filteredProperties.length} Properties</span>
              </div>
            </div>
          </div>

          {/* Price and Yield Range Sliders */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Price per Share: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Yield: {yieldRange[0]}% - {yieldRange[1]}%
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={yieldRange[0]}
                  onChange={(e) => setYieldRange([parseFloat(e.target.value), yieldRange[1]])}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={yieldRange[1]}
                  onChange={(e) => setYieldRange([yieldRange[0], parseFloat(e.target.value)])}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          {filteredProperties.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredProperties.map((property, index) => {
                const glowColors = [
                  "rgba(249, 115, 22, 0.3)", // orange
                  "rgba(34, 197, 94, 0.3)",  // green  
                  "rgba(147, 51, 234, 0.3)", // purple
                  "rgba(59, 130, 246, 0.3)", // blue
                  "rgba(239, 68, 68, 0.3)",  // red
                  "rgba(245, 158, 11, 0.3)"  // amber
                ];
                const glowColor = glowColors[index % glowColors.length];
                
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      boxShadow: [
                        `0 0 20px ${glowColor}`,
                        `0 0 40px ${glowColor}`,
                        `0 0 20px ${glowColor}`
                      ]
                    }}
                    transition={{ 
                      opacity: { delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 },
                      y: { delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 },
                      scale: { delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 },
                      boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -10,
                      rotateY: 5,
                      boxShadow: `0 20px 40px ${glowColor}`
                    }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 group"
                  >
                    {/* Glowing border animation */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-transparent"
                      animate={{
                        borderColor: [
                          glowColor.replace('0.3', '0'),
                          glowColor.replace('0.3', '0.6'),
                          glowColor.replace('0.3', '0')
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                    />
                    <PropertyCard property={property} />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm rounded-xl border border-gray-800/50 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Glowing border animation */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-transparent"
                animate={{
                  borderColor: [
                    "rgba(147, 51, 234, 0)",
                    "rgba(147, 51, 234, 0.4)",
                    "rgba(147, 51, 234, 0)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="relative z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">No properties found</h3>
              <p className="text-gray-400 mb-6 relative z-10">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <motion.div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("all");
                      setSelectedRisk("all");
                      setPriceRange([0, 10000]);
                      setYieldRange([0, 15]);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
