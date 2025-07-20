"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Building, ArrowUpRight, Eye, Heart, CheckCircle, TrendingUp, Zap, Shield, Building2, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "High": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-500/20 border-green-500/30";
    if (score >= 80) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-orange-400 bg-orange-500/20 border-orange-500/30";
  };

  const sharesAvailablePercentage = (property.availableShares / property.totalShares) * 100;

  return (
    <motion.div
      ref={cardRef}
      className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:border-orange-500/50 transition-all duration-500 overflow-hidden group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02, z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/40 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mouse tracking gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(251, 146, 60, 0.1), transparent 40%)`,
        }}
      />

      {/* Enhanced Property Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
        
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)",
            backgroundSize: "100% 100%",
          }}
        />

        {/* Enhanced AI Score Badge */}
        <motion.div 
          className="absolute top-4 left-4 z-20"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md border ${getAIScoreColor(property.aiScore)}`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mr-1"
            >
              <Zap className="w-3 h-3" />
            </motion.div>
            AI Score: {property.aiScore}
          </div>
        </motion.div>

        {/* Enhanced Risk Level Badge */}
        <motion.div 
          className="absolute top-4 right-4 z-20"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className={`px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md border ${getRiskColor(property.riskLevel)}`}>
            <Shield className="w-3 h-3 inline mr-1" />
            {property.riskLevel} Risk
          </div>
        </motion.div>

        {/* Enhanced Property Type */}
        <motion.div 
          className="absolute bottom-4 left-4 z-20"
          whileHover={{ scale: 1.05 }}
        >
          <div className="px-3 py-2 rounded-xl text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
            <Building2 className="w-3 h-3 inline mr-1" />
            {property.type}
          </div>
        </motion.div>

        {/* Enhanced property image placeholder */}
        <motion.div 
          className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Building2 className="w-20 h-20 text-orange-500/60" />
          </motion.div>
          
          {/* Sparkle effects */}
          <motion.div
            className="absolute top-4 right-8"
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 1 
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400/60" />
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Property Details */}
      <div className="p-6 relative">
        {/* Header */}
        <div className="mb-6">
          <motion.h3 
            className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {property.name}
          </motion.h3>
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </div>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <motion.div 
              className="text-2xl font-bold text-orange-500 mb-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {property.currentYield}%
            </motion.div>
            <div className="text-xs text-gray-400">Current Yield</div>
          </motion.div>
          <motion.div 
            className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <motion.div 
              className="text-2xl font-bold text-green-400 mb-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              +{property.predictedAppreciation}%
            </motion.div>
            <div className="text-xs text-gray-400">Predicted Growth</div>
          </motion.div>
        </div>

        {/* Enhanced Share Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Available Shares</span>
            <span className="text-sm font-semibold text-white">
              {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()}
            </span>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-3 mb-3 overflow-hidden border border-white/10">
            <motion.div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${sharesAvailablePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
          
          <div className="text-xs text-gray-400 mb-4">
            {sharesAvailablePercentage.toFixed(1)}% shares available
          </div>

          {/* Enhanced Price per Share */}
          <motion.div 
            className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm text-gray-400">Price per Share</span>
            <span className="text-xl font-bold text-white">
              ₹{property.pricePerShare.toLocaleString()}
            </span>
          </motion.div>
        </div>

        {/* Enhanced Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 3).map((feature, index) => (
              <motion.span
                key={index}
                className="text-xs px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-300 rounded-full border border-white/20 hover:border-orange-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {feature}
              </motion.span>
            ))}
            {property.features.length > 3 && (
              <motion.span 
                className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30"
                whileHover={{ scale: 1.05 }}
              >
                +{property.features.length - 3} more
              </motion.span>
            )}
          </div>
        </div>

        {/* Enhanced Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <motion.div 
            className="flex items-center justify-between p-2 rounded-lg bg-white/5"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-400">Occupancy</span>
            <span className="text-white font-semibold">{property.occupancyRate}%</span>
          </motion.div>
          <motion.div 
            className="flex items-center justify-between p-2 rounded-lg bg-white/5"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gray-400">Monthly Income</span>
            <span className="text-green-400 font-semibold">₹{(property.rentalIncome / 12).toLocaleString()}</span>
          </motion.div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/equity/property/${property.id}`} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </Link>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              <Target className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Hover Effect Info */}
        <motion.div
          className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 backdrop-blur-sm"
          initial={{ opacity: 0, height: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            height: isHovered ? "auto" : 0,
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Minimum Investment</span>
            <span className="text-white font-semibold">₹{property.pricePerShare.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Expected Annual Return</span>
            <span className="text-green-400 font-semibold">
              ₹{Math.round(property.pricePerShare * property.currentYield / 100).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* 3D depth effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"
        style={{
          transform: "translateZ(10px)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
