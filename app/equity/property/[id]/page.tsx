"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, TrendingUp, Shield, Star, Users, Calendar, DollarSign, Target, Zap, Building2, Eye, Share2, Heart, AlertCircle, CheckCircle, Info, Plus, Minus, ShoppingCart, CreditCard, Briefcase, Warehouse, Store, Server, UserPlus, Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  detailedDescription: string;
  keyTenants: string[];
  propertyManager: string;
  yearBuilt: number;
  totalArea: number;
  parkingSpaces: number;
  amenities: string[];
  financials: {
    grossIncome: number;
    operatingExpenses: number;
    netIncome: number;
    capRate: number;
    cashOnCashReturn: number;
  };
  marketAnalysis: {
    comparableProperties: number;
    marketGrowth: number;
    demandSupply: string;
    futureProjects: string[];
  };
}

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShares, setSelectedShares] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [propertyId, setPropertyId] = useState<string>('');

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setPropertyId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Mock data - replace with actual API call
  const mockProperty: Property = {
    id: propertyId,
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
    features: ["Prime Location", "High Occupancy", "A+ Tenants", "Modern Facilities", "24/7 Security", "Backup Power"],
    detailedDescription: "This premium Grade A office complex is strategically located in the heart of Cyber Hub, Gurgaon. The property features state-of-the-art infrastructure with modern amenities and is home to several multinational corporations. With its prime location and excellent connectivity, this property offers stable rental income and strong appreciation potential.",
    keyTenants: ["Microsoft India", "Accenture", "Deloitte", "EY", "KPMG"],
    propertyManager: "CBRE India",
    yearBuilt: 2018,
    totalArea: 250000,
    parkingSpaces: 500,
    amenities: ["Central AC", "High Speed Elevators", "Food Court", "Gymnasium", "Conference Rooms", "Parking"],
    financials: {
      grossIncome: 1200000,
      operatingExpenses: 350000,
      netIncome: 850000,
      capRate: 3.4,
      cashOnCashReturn: 8.5
    },
    marketAnalysis: {
      comparableProperties: 12,
      marketGrowth: 15.2,
      demandSupply: "High Demand, Limited Supply",
      futureProjects: ["Metro Extension", "New IT Parks", "Commercial Developments"]
    }
  };

  useEffect(() => {
    // Simulate API call
    if (!propertyId) return;
    
    const timer = setTimeout(() => {
      const updatedMockProperty = {
        ...mockProperty,
        id: propertyId
      };
      setProperty(updatedMockProperty);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [propertyId, mockProperty]);

  const handleBuyShares = () => {
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = () => {
    // Handle purchase logic here
    console.log(`Purchasing ${selectedShares} shares`);
    setShowBuyModal(false);
    // Show success message or redirect
  };

  const getTotalInvestment = () => {
    if (!property) return 0;
    return selectedShares * property.pricePerShare;
  };

  const getExpectedMonthlyIncome = () => {
    if (!property) return 0;
    return Math.round((getTotalInvestment() * property.currentYield) / 100 / 12);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-400 bg-green-500/10";
      case "Medium": return "text-yellow-400 bg-yellow-500/10";
      case "High": return "text-red-400 bg-red-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "office building":
      case "office": return Briefcase;
      case "warehouse": return Warehouse;
      case "retail": return Store;
      case "data center": return Server;
      case "co-working": return UserPlus;
      case "industrial": return Coffee;
      default: return Building2;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Property not found</h1>
          <Link href="/equity">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const PropertyIcon = getPropertyTypeIcon(property.type);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/equity">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
              <div className="text-sm text-gray-400">
                Property Details
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`border-gray-600 hover:bg-gray-800 ${isFavorite ? 'text-red-400' : 'text-gray-300'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{property.name}</h1>
                  <div className="flex items-center gap-4 text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PropertyIcon className="w-4 h-4" />
                      <span>{property.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(property.riskLevel)} mb-2`}>
                    <Shield className="w-4 h-4 inline mr-1" />
                    {property.riskLevel} Risk
                  </div>
                  <div className="text-2xl font-bold text-orange-400">
                    AI Score: {property.aiScore}
                  </div>
                </div>
              </div>

              {/* Property Image */}
              <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <PropertyIcon className="w-24 h-24 text-orange-500/50" />
                </div>
                
                {/* Overlays */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm text-gray-400 mb-1">Property Value</div>
                    <div className="text-xl font-bold text-white">₹{property.totalValue.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-400 mb-1">Occupancy Rate</div>
                    <div className="text-xl font-bold text-green-400">{property.occupancyRate}%</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl font-bold text-orange-500 mb-1">{property.currentYield}%</div>
                <div className="text-sm text-gray-400">Current Yield</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl font-bold text-green-400 mb-1">+{property.predictedAppreciation}%</div>
                <div className="text-sm text-gray-400">Predicted Growth</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl font-bold text-blue-400 mb-1">{property.totalArea.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Area (sq ft)</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="text-2xl font-bold text-purple-400 mb-1">{property.yearBuilt}</div>
                <div className="text-sm text-gray-400">Year Built</div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8"
            >
              <h2 className="text-xl font-bold text-white mb-4">Property Overview</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{property.detailedDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                  <div className="space-y-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-orange-400" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Tenants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8"
            >
              <h2 className="text-xl font-bold text-white mb-4">Key Tenants</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.keyTenants.map((tenant, index) => (
                  <div key={index} className="bg-black/40 rounded-lg p-3 text-center">
                    <div className="text-white font-semibold">{tenant}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financial Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <h2 className="text-xl font-bold text-white mb-4">Financial Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Gross Income</span>
                    <span className="text-white font-semibold">₹{property.financials.grossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Operating Expenses</span>
                    <span className="text-white font-semibold">₹{property.financials.operatingExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Net Income</span>
                    <span className="text-green-400 font-semibold">₹{property.financials.netIncome.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cap Rate</span>
                    <span className="text-white font-semibold">{property.financials.capRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cash-on-Cash Return</span>
                    <span className="text-orange-400 font-semibold">{property.financials.cashOnCashReturn}%</span>
                  </div>
                </div>
              </div>
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
                <h2 className="text-xl font-bold text-white mb-6">Invest in This Property</h2>
                
                {/* Share Information */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price per Share</span>
                    <span className="text-2xl font-bold text-white">₹{property.pricePerShare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Available Shares</span>
                    <span className="text-white font-semibold">
                      {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                      style={{ width: `${(property.availableShares / property.totalShares) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    {((property.availableShares / property.totalShares) * 100).toFixed(1)}% available
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
                        onClick={() => setSelectedShares(Math.max(1, selectedShares - 1))}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-bold text-white px-4">{selectedShares}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedShares(Math.min(property.availableShares, selectedShares + 1))}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Investment</span>
                      <span className="text-xl font-bold text-white">₹{getTotalInvestment().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Expected Monthly Income</span>
                      <span className="text-lg font-semibold text-green-400">₹{getExpectedMonthlyIncome().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  onClick={handleBuyShares}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Equity Shares
                </Button>
              </motion.div>

              {/* Market Analysis */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-lg font-bold text-white mb-4">Market Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Growth</span>
                    <span className="text-green-400 font-semibold">+{property.marketAnalysis.marketGrowth}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Comparable Properties</span>
                    <span className="text-white font-semibold">{property.marketAnalysis.comparableProperties}</span>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-2">Market Conditions</div>
                    <div className="text-sm text-green-400 font-semibold">
                      {property.marketAnalysis.demandSupply}
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
                <h3 className="text-lg font-bold text-white mb-4">Property Management</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{property.propertyManager}</div>
                    <div className="text-sm text-gray-400">Professional Management</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  Experienced property management company ensuring optimal operations and tenant satisfaction.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Shares Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-800"
          >
            <h3 className="text-xl font-bold text-white mb-6">Confirm Purchase</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Property</span>
                <span className="text-white font-semibold">{property.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Shares</span>
                <span className="text-white font-semibold">{selectedShares}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price per Share</span>
                <span className="text-white font-semibold">₹{property.pricePerShare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-orange-400">₹{getTotalInvestment().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowBuyModal(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Confirm Purchase
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
