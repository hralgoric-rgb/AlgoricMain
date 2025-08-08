"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Shield,
  Star,
  Users,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Building2,
  Eye,
  Share2,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Briefcase,
  Warehouse,
  Store,
  Server,
  UserPlus,
  Coffee,
  Calculator,
  BarChart3,
  TrendingDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BuySharesModal from "@/app/commercial/components/BuySharesModal";
import { ICommercialProperty } from "@/app/models/CommercialProperty";
import { toast } from "sonner";
import Image from "next/image";

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const router = useRouter();
  const [property, setProperty] = useState<ICommercialProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShares, setSelectedShares] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [propertyId, setPropertyId] = useState<string>("");
  const [areaAnalysis, setAreaAnalysis] = useState<any>(null);
  const [loadingAreaAnalysis, setLoadingAreaAnalysis] = useState(false);

  // Fetch property data based on ID
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setPropertyId(id);
        setIsLoading(true);

        // Validate MongoDB ObjectId (24 hex chars)
        const isValidObjectId = id && /^[a-fA-F0-9]{24}$/.test(id);
        if (!isValidObjectId) {
          setProperty(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/commercial/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProperty(data.data);
        } else {
          console.error("Error fetching property:", data.message);
          setProperty(null);
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params]);

  // Fetch area analysis when property is loaded
  useEffect(() => {
    if (property?.locality) {
      fetchAreaAnalysis(property.locality);
    }
  }, [property?.locality]);

  const handleBuyShares = () => {
    setShowBuyModal(true);
  };

  const handlePurchaseSuccess = () => {
    toast.success("Shares purchased successfully!");
    setShowBuyModal(false);
    // You can add additional success logic here like refreshing data
  };

  const handleShare = async () => {
    if (!property) return;
    
    const shareData = {
      title: `${property.projectName || property.title} - Investment Opportunity`,
      text: `Check out this commercial real estate investment opportunity: ${property.projectName || property.title} in ${property.locality}. Expected ROI: ${property.currentROI}%`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Property shared successfully!");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Property link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Property link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
        toast.error("Unable to share or copy link");
      }
    }
  };

  const getTotalInvestment = () => {
    if (!property) return 0;
    return selectedShares * property.pricePerShare;
  };

  const getExpectedMonthlyIncome = () => {
    if (!property) return 0;
    return Math.round(
      (getTotalInvestment() * property.currentYield) / 100 / 12
    );
  };

  // Financial calculation helpers
  const getGrossIncome = () => {
    if (!property || !property.monthlyRental) return 0;
    return property.monthlyRental * 12;
  };

  const getOperatingExpenses = () => {
    if (!property || !property.monthlyRental) return 0;
    // Typically 20-30% of gross income for commercial properties
    return Math.round(getGrossIncome() * 0.25);
  };

  const getNetIncome = () => {
    return getGrossIncome() - getOperatingExpenses();
  };

  const getCapRate = () => {
    if (!property || !property.totalPropertyValue || !property.monthlyRental) return 0;
    return Math.round((getNetIncome() / property.totalPropertyValue) * 100 * 100) / 100;
  };

  const getAIScore = () => {
    if (!property) return 0;
    // Calculate AI score based on various factors
    const occupancyScore = property.currentOccupancy || 0;
    const roiScore = property.currentROI ? Math.min(property.currentROI * 10, 100) : 0;
    const yieldScore = property.currentYield ? Math.min(property.currentYield * 12, 100) : 0;
    const locationScore = property.locality ? 85 : 70; // Basic location scoring
    
    // Only include scores that have values
    const scores = [occupancyScore, roiScore, yieldScore, locationScore].filter(score => score > 0);
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Area analysis function
  const fetchAreaAnalysis = async (location: string) => {
    if (!location.trim()) return;
    
    setLoadingAreaAnalysis(true);
    try {
      const response = await fetch(
        `https://ml-models-vu7b.onrender.com/api/location/${encodeURIComponent(location)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAreaAnalysis(data);
      }
    } catch (error) {
      console.error("Failed to fetch area analysis:", error);
    } finally {
      setLoadingAreaAnalysis(false);
    }
  };

  // Create compatibility object for BuySharesModal
  const compatibleProperty = property ? {
    ...property,
    title: property.projectName || property.title,
    rentalYield: property.currentYield, // Map currentYield to rentalYield
    propertyManager: property.ownerDetails?.companyName || property.ownerDetails?.name,
    keyTenants: property.tenantName ? [property.tenantName] : [],
    address: {
      ...property.address,
      city: property.address?.city || property.locality,
      state: property.address?.state,
      street: property.address?.street || property.fullAddress,
      zipCode: property.address?.zipCode || property.pinCode,
      coordinates: property.address?.coordinates || [0, 0]
    }
  } : null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-400 bg-green-500/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "High":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "office":
        return Briefcase;
      case "warehouse":
        return Warehouse;
      case "retail":
        return Store;
      case "mixed use":
        return Server;
      case "industrial":
        return Coffee;
      default:
        return Building2;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Property not found
          </h1>
          <Link href="/equity">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const PropertyIcon = getPropertyTypeIcon(property.propertyType);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <PropertyIcon className="w-6 h-6 text-purple-500" />
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-[#a78bfa] to-white bg-clip-text text-transparent">
                  {property.projectName || property.title}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                {property.locality && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {property.locality}{property.address?.city && `, ${property.address.city}`}
                    </span>
                  </div>
                )}
                {property.currentROI && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{property.currentROI}% ROI</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>AI Score: {getAIScore()}/100</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-800">
                <img
                  src={property.images?.[0] || "/placeholder-property.jpg"}
                  alt={property.projectName || property.title || "Property Image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-semibold">
                      {property.availableShares.toLocaleString()} shares
                      available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Property Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Property Overview
              </h2>
              {property.description && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {property.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property.totalArea && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white font-semibold">
                      {property.totalArea.toLocaleString()} sq ft
                    </div>
                    <div className="text-gray-400 text-sm">Total Area</div>
                  </div>
                )}
                {property.builtYear && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white font-semibold">
                      {property.builtYear}
                    </div>
                    <div className="text-gray-400 text-sm">Year Built</div>
                  </div>
                )}
                {property.currentOccupancy !== undefined && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white font-semibold">
                      {property.currentOccupancy}%
                    </div>
                    <div className="text-gray-400 text-sm">Occupancy</div>
                  </div>
                )}
                {property.currentROI && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white font-semibold">
                      {property.currentROI}%
                    </div>
                    <div className="text-gray-400 text-sm">Annual ROI</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Investment Highlights */}
            {(property.highlights.length > 0 || property.customHighlights) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-800/40"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-400" />
                  Investment Highlights
                </h3>
                <div className="space-y-3">
                  {property.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{highlight}</span>
                    </div>
                  ))}
                  {property.customHighlights && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{property.customHighlights}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-purple-400" />
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {property.totalValuation && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Valuation</span>
                      <span className="text-white font-semibold">₹{property.totalValuation} Cr</span>
                    </div>
                  )}
                  {property.possessionStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Possession Status</span>
                      <span className="text-white font-semibold">{property.possessionStatus}</span>
                    </div>
                  )}
                  {property.pinCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pin Code</span>
                      <span className="text-white font-semibold">{property.pinCode}</span>
                    </div>
                  )}
                  {property.minimumHoldingPeriod && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min. Holding Period</span>
                      <span className="text-white font-semibold">{property.minimumHoldingPeriod}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {(property.minimumInvestmentTicket || property.customTicketAmount) && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Investment</span>
                      <span className="text-white font-semibold">
                        {property.minimumInvestmentTicket === "Custom Amount" && property.customTicketAmount ? 
                          `₹${property.customTicketAmount.toLocaleString()}` : 
                          property.minimumInvestmentTicket
                        }
                      </span>
                    </div>
                  )}
                  {property.targetRaiseAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Raise</span>
                      <span className="text-white font-semibold">₹{property.targetRaiseAmount} Cr</span>
                    </div>
                  )}
                  {property.ownershipSplit && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ownership Split</span>
                      <span className="text-white font-semibold">{property.ownershipSplit}</span>
                    </div>
                  )}
                  {property.virtualTourLink && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Virtual Tour</span>
                      <a 
                        href={property.virtualTourLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        View Tour
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {property.exitOptions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="text-white font-semibold mb-3">Exit Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.exitOptions.map((option, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-800/40"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {property.features && property.features.length > 0 && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: "#B6FF3F" }}
                    />
                    Key Features
                  </h3>
                  <div className="space-y-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#B6FF3F]" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    Amenities
                  </h3>
                  <div className="space-y-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#a78bfa]" />
                        <span className="text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Key Tenants */}
            {property.tenantName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4">Key Tenant</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-gray-900 rounded-full shadow-sm border-2 border-[#B6FF3F] transition-colors duration-200">
                    <div className="font-semibold text-lg text-white">
                      {property.tenantName}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Financial Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-purple-400" />
                Financial Analysis
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {getGrossIncome() > 0 && (
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "#B6FF3F" }}
                    >
                      {formatCurrency(getGrossIncome())}
                    </div>
                    <div className="text-gray-400">Annual Gross Income</div>
                  </div>
                )}
                {getOperatingExpenses() > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {formatCurrency(getOperatingExpenses())}
                    </div>
                    <div className="text-gray-400">Operating Expenses</div>
                  </div>
                )}
                {getNetIncome() > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(getNetIncome())}
                    </div>
                    <div className="text-gray-400">Annual Net Income</div>
                  </div>
                )}
                {getCapRate() > 0 && (
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "#a78bfa" }}
                    >
                      {getCapRate()}%
                    </div>
                    <div className="text-gray-400">Cap Rate</div>
                  </div>
                )}
              </div>
              
              {/* Additional Financial Metrics */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.monthlyRental && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Monthly Rental</div>
                      <div className="text-lg font-semibold text-white">
                        {formatCurrency(property.monthlyRental)}
                      </div>
                    </div>
                  )}
                  {property.totalPropertyValue && property.totalArea && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Price Per Sq Ft</div>
                      <div className="text-lg font-semibold text-white">
                        ₹{Math.round(property.totalPropertyValue / property.totalArea).toLocaleString()}
                      </div>
                    </div>
                  )}
                  {property.currentOccupancy !== undefined && (
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">Occupancy Rate</div>
                      <div className="text-lg font-semibold text-green-400">
                        {property.currentOccupancy}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Area Analysis Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                  Area Analysis{property.locality && `: ${property.locality}`}
                </h3>              {loadingAreaAnalysis ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                  <span className="text-white">Analyzing area data...</span>
                </div>
              ) : areaAnalysis ? (
                <div className="space-y-6">
                  {/* Safety and Crime Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Safety Score</span>
                        <span className={`font-bold text-lg ${
                          areaAnalysis.safety_rating >= 8 ? 'text-green-400' :
                          areaAnalysis.safety_rating >= 6 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {areaAnalysis.safety_rating}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            areaAnalysis.safety_rating >= 8 ? 'bg-green-500' :
                            areaAnalysis.safety_rating >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${areaAnalysis.safety_rating * 10}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Crime Level</span>
                        <span className={`font-bold text-lg ${
                          areaAnalysis.crime_rating <= 3 ? 'text-green-400' :
                          areaAnalysis.crime_rating <= 6 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {areaAnalysis.crime_level}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {areaAnalysis.total_crimes} reported cases annually
                      </div>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-800/30">
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Advantages
                      </h4>
                      <ul className="space-y-2">
                        {areaAnalysis.pros.slice(0, 4).map((pro: string, index: number) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/30">
                      <h4 className="text-red-400 font-semibold mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Considerations
                      </h4>
                      <ul className="space-y-2">
                        {areaAnalysis.cons.slice(0, 4).map((con: string, index: number) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Infrastructure */}
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">Infrastructure Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Electricity Supply</span>
                        <span className={`text-sm font-medium ${
                          areaAnalysis.electricity_issues.toLowerCase().includes('good') || 
                          areaAnalysis.electricity_issues.toLowerCase().includes('stable') ? 
                          'text-green-400' : 'text-yellow-400'
                        }`}>
                          {areaAnalysis.electricity_issues}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Water/Drainage</span>
                        <span className={`text-sm font-medium ${
                          areaAnalysis.water_clogging.toLowerCase().includes('no') || 
                          areaAnalysis.water_clogging.toLowerCase().includes('minimal') ? 
                          'text-green-400' : 'text-yellow-400'
                        }`}>
                          {areaAnalysis.water_clogging}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">Investment Insight: </span>
                      {property.locality && areaAnalysis.zone && `${property.locality} is in ${areaAnalysis.zone} `}
                      {areaAnalysis.safety_rating && `with a safety score of ${areaAnalysis.safety_rating}/10. `}
                      {areaAnalysis.safety_rating >= 7 ? 
                        "This is considered a good area for commercial real estate investment." :
                        areaAnalysis.safety_rating ? "Consider the safety factors when evaluating this investment." : ""
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Area analysis data not available</p>
                  <button 
                    onClick={() => fetchAreaAnalysis(property.locality)}
                    className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Try to reload area data
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Investment Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800"
              >
                <h2 className="text-xl font-bold text-white mb-6">
                  Invest in This Property
                </h2>

                {/* Share Information */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price per Share</span>
                    <span className="text-2xl font-bold text-white">
                      ₹{property.pricePerShare.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Available Shares</span>
                    <span className="text-white font-semibold">
                      {property.availableShares.toLocaleString()} /{" "}
                      {property.totalShares.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full bg-[#B6FF3F]"
                      style={{
                        width: `${
                          (property.availableShares / property.totalShares) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    {(
                      (property.availableShares / property.totalShares) *
                      100
                    ).toFixed(1)}
                    % available
                  </div>
                </div>

                {/* Share Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Select Shares</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedShares(Math.max(1, selectedShares - 1))
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-bold text-white px-4">
                        {selectedShares}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedShares(
                            Math.min(
                              property.availableShares,
                              selectedShares + 1
                            )
                          )
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Investment</span>
                      <span className="text-xl font-bold text-white">
                        ₹{getTotalInvestment().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        Expected Monthly Income
                      </span>
                      <span
                        className="text-lg font-semibold"
                        style={{ color: "#B6FF3F" }}
                      >
                        ₹{getExpectedMonthlyIncome().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  onClick={handleBuyShares}
                  className="w-full bg-[#d1ff4a] hover:bg-[#b6e944] text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Express Interest
                </Button>
              </motion.div>

              {/* Market Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Market Analysis
                </h3>
                <div className="space-y-4">
                  {property.appreciationRate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Expected Appreciation</span>
                      <span
                        className="font-semibold"
                        style={{ color: "#B6FF3F" }}
                      >
                        +{property.appreciationRate}%
                      </span>
                    </div>
                  )}
                  {property.currentYield && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current Yield</span>
                      <span className="text-white font-semibold">
                        {property.currentYield}%
                      </span>
                    </div>
                  )}
                  {property.status && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Property Status</span>
                      <span className={`font-semibold capitalize ${
                        property.status === 'active' ? 'text-green-400' : 
                        property.status === 'pending_approval' ? 'text-yellow-400' : 
                        'text-gray-400'
                      }`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-400 mb-2">Investment Type</div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "#B6FF3F" }}
                    >
                      Fractional Commercial Real Estate
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Property Manager */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  Property Management
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-violet-100" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {property.ownerDetails?.companyName || property.ownerDetails?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {property.ownerDetails?.companyName ? "Company" : "Property Owner"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  {property.ownerDetails?.companyName ? 
                    "Experienced property management company ensuring optimal operations and tenant satisfaction." :
                    "Property owner managed with professional oversight for optimal operations."
                  }
                </div>
              </motion.div>

              {/* Property Owner Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  Property Owner
                </h3>
                <div className="space-y-3">
                  {property.ownerDetails?.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Name</span>
                      <span className="text-white font-semibold">{property.ownerDetails.name}</span>
                    </div>
                  )}
                  {property.ownerDetails?.companyName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Company</span>
                      <span className="text-white font-semibold">{property.ownerDetails.companyName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Contact</span>
                    <span className="text-gray-300 text-sm">Via 100गज Platform</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-gray-400">
                    All communications are facilitated through 100गज for security and transparency.
                  </p>
                </div>
              </motion.div>

              {/* Risk Disclosure */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-orange-900/30 to-red-900/20 rounded-xl p-6 border border-orange-800/40"
              >
                <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Investment Disclaimer
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Real estate investments carry market risks</p>
                  <p>• Past performance does not guarantee future returns</p>
                  <p>• Property values may fluctuate based on market conditions</p>
                  <p>• Rental income may vary based on occupancy rates</p>
                  <p>• Please read all legal documents before investing</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Shares Modal with Razorpay Integration */}
      <BuySharesModal
        property={compatibleProperty as any}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
