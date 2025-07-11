"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Shield, Star, Users, ArrowUpRight, Zap, Target, DollarSign, Building2, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-400 bg-green-500/10";
      case "Medium": return "text-yellow-400 bg-yellow-500/10";
      case "High": return "text-red-400 bg-red-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-500/10";
    if (score >= 80) return "text-yellow-400 bg-yellow-500/10";
    return "text-orange-400 bg-orange-500/10";
  };

  const sharesAvailablePercentage = (property.availableShares / property.totalShares) * 100;

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        
        {/* AI Score Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getAIScoreColor(property.aiScore)}`}>
            <Zap className="w-3 h-3 inline mr-1" />
            AI Score: {property.aiScore}
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(property.riskLevel)}`}>
            <Shield className="w-3 h-3 inline mr-1" />
            {property.riskLevel} Risk
          </div>
        </div>

        {/* Property Type */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white border border-gray-700">
            <Building2 className="w-3 h-3 inline mr-1" />
            {property.type}
          </div>
        </div>

        {/* Placeholder for property image */}
        <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
          <Building2 className="w-16 h-16 text-orange-500/50" />
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </div>
          <p className="text-gray-300 text-sm line-clamp-2">
            {property.description}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {property.currentYield}%
            </div>
            <div className="text-xs text-gray-400">Current Yield</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400 mb-1">
              +{property.predictedAppreciation}%
            </div>
            <div className="text-xs text-gray-400">Predicted Growth</div>
          </div>
        </div>

        {/* Share Information */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Available Shares</span>
            <span className="text-sm font-semibold text-white">
              {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${sharesAvailablePercentage}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-400 mb-3">
            {sharesAvailablePercentage.toFixed(1)}% shares available
          </div>

          {/* Price per Share */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Price per Share</span>
            <span className="text-lg font-bold text-white">
              ₹{property.pricePerShare.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                +{property.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Occupancy</span>
            <span className="text-white font-semibold">{property.occupancyRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Monthly Income</span>
            <span className="text-green-400 font-semibold">₹{(property.rentalIncome / 12).toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/equity/property/${property.id}`} className="flex-1">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-3 rounded-lg transition-all duration-300"
          >
            <Target className="w-4 h-4" />
          </Button>
        </div>

        {/* Hover Effect Info */}
        <motion.div
          className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            height: isHovered ? "auto" : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Minimum Investment</span>
            <span className="text-white font-semibold">₹{property.pricePerShare.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Expected Annual Return</span>
            <span className="text-green-400 font-semibold">
              ₹{Math.round(property.pricePerShare * property.currentYield / 100).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
