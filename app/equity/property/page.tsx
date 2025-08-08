"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  Warehouse,
  Store,
  Server,
  UserPlus,
  Coffee,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "../components";
import EquityNavigation from "../components/EquityNavigation";
import BackgroundVideo from "../components/BackgroundVideo";
import EquityAnimatedBackground from "../EquityAnimatedBackground";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  currentYield: number;
  predictedAppreciation: number;
  riskLevel: "Low" | "Medium" | "High";
  images: string[];
  description: string;
  monthlyRental: number;
  currentOccupancy: number;
  totalValue: number;
  aiScore: number;
  features: string[];
  keyTenants: string[];
}

export default function PropertyListingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [sortBy, setSortBy] = useState("aiScore");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [yieldRange, setYieldRange] = useState<[number, number]>([0, 15]);
  const router = useRouter();

  const propertyTypes = [
    { value: "all", label: "All Types", icon: Building2 },
    { value: "Office", label: "Office Buildings", icon: Briefcase },
    { value: "Warehouse", label: "Warehouses", icon: Warehouse },
    { value: "Retail", label: "Retail", icon: Store },
    { value: "Data Center", label: "Data Centers", icon: Server },
    { value: "Co-working", label: "Co-working", icon: UserPlus },
    { value: "Industrial", label: "Industrial", icon: Coffee },
  ];

  const riskLevels = [
    { value: "all", label: "All Risk Levels" },
    { value: "Low", label: "Low Risk" },
    { value: "Medium", label: "Medium Risk" },
    { value: "High", label: "High Risk" },
  ];

  const sortOptions = [
    { value: "aiScore", label: "AI Score" },
    { value: "yield", label: "Current Yield" },
    { value: "appreciation", label: "Predicted Growth" },
    { value: "price", label: "Price per Share" },
    { value: "currentOccupancy", label: "Occupancy Rate" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const title = params.get("title") || "";
    setSearchTerm(title);
    setDebouncedSearchTerm(title);

    const propertyType = params.get("propertyType");
    if (propertyType) setSelectedType(propertyType);

    const riskLevel = params.get("riskLevel");
    if (riskLevel) setSelectedRisk(riskLevel);

    const sortParam = params.get("sortBy");
    if (sortParam === "pricePerShare") setSortBy("price");
    else if (sortParam === "currentYield") setSortBy("yield");
    else if (sortParam === "currentOccupancy") setSortBy("currentOccupancy");

    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    if (minPrice && maxPrice)
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);

    const minYield = params.get("minYield");
    const maxYield = params.get("maxYield");
    if (minYield && maxYield)
      setYieldRange([parseFloat(minYield), parseFloat(maxYield)]);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Delay 2 seconds

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchFilteredProperties = async () => {
      setIsLoading(true);

      const params = new URLSearchParams();

      if (debouncedSearchTerm) params.set("title", debouncedSearchTerm);
      if (selectedType !== "all") params.set("propertyType", selectedType);
      if (selectedRisk !== "all") params.set("riskLevel", selectedRisk);
      if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
      if (priceRange[1] < 10000) params.set("maxPrice", String(priceRange[1]));
      if (yieldRange[0] > 0) params.set("minYield", String(yieldRange[0]));
      if (yieldRange[1] < 15) params.set("maxYield", String(yieldRange[1]));
      if (sortBy) {
        if (sortBy === "price") params.set("sortBy", "pricePerShare");
        else if (sortBy === "yield") params.set("sortBy", "currentYield");
        else if (sortBy === "currentOccupancy")
          params.set("sortBy", "currentOccupancy");
      }

      // Update URL in browser (client-side routing)
      router.replace(`?${params.toString()}`);

      try {
        const res = await fetch(`/api/commercial/search?${params.toString()}`, {
          signal: controller.signal,
        });

        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
          setFilteredProperties(data.data);
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching filtered properties:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProperties();

    return () => controller.abort();
  }, [
    debouncedSearchTerm,
    selectedType,
    selectedRisk,
    priceRange,
    yieldRange,
    sortBy,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Video Background */}
      <BackgroundVideo />
      {/* Animated SVG Background */}
      <EquityAnimatedBackground />

      {/* Navigation */}
      <EquityNavigation />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Commercial Properties{" "}
              <span className="text-[#a78bfa]">Marketplace</span>
            </motion.h1>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mb-8 relative overflow-hidden group max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="relative z-10 mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties by name, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {/* Filter Tabs */}
            <div className="relative z-10 flex flex-wrap gap-2 mb-6">
              {propertyTypes.map((type, index) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedType === type.value
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Risk Level */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Risk Level
                </label>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Results
                </label>
                <div className="flex items-center justify-center h-10 bg-black/40 border border-gray-700 rounded-lg text-white">
                  <span className="text-sm font-medium">
                    {filteredProperties.length} Properties
                  </span>
                </div>
              </div>
            </div>

            {/* Price and Yield Range Sliders */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Price per Share: ₹{priceRange[0].toLocaleString()} - ₹
                  {priceRange[1].toLocaleString()}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
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
                    onChange={(e) =>
                      setYieldRange([parseFloat(e.target.value), yieldRange[1]])
                    }
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={yieldRange[1]}
                    onChange={(e) =>
                      setYieldRange([yieldRange[0], parseFloat(e.target.value)])
                    }
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property, index) => {
                  const glowColors = [
                    "rgba(249, 115, 22, 0.3)", // orange
                    "rgba(34, 197, 94, 0.3)", // green
                    "rgba(147, 51, 234, 0.3)", // purple
                    "rgba(59, 130, 246, 0.3)", // blue
                    "rgba(239, 68, 68, 0.3)", // red
                    "rgba(245, 158, 11, 0.3)", // amber
                  ];
                  const glowColor = glowColors[index % glowColors.length];

                  return (
                    <div
                      key={property.id}
                      className="w-full bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
                    >
                      <PropertyCard property={property} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm rounded-xl border border-gray-800/50 relative overflow-hidden max-w-4xl mx-auto">
                <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No properties found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search criteria or filters to find more
                  properties.
                </p>
                <div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
