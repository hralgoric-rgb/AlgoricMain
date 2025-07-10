"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Target, Building2, Calendar, ArrowUpRight, Zap, Star, Shield, Users, Eye, Sparkles, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Portfolio {
  totalValue: number;
  totalInvestment: number;
  totalReturns: number;
  monthlyIncome: number;
  properties: number;
  totalShares: number;
}

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for interactive gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX);
  const mouseYSpring = useSpring(mouseY);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const returnPercentage = ((portfolio.totalReturns / portfolio.totalInvestment) * 100).toFixed(1);
  const isPositive = portfolio.totalReturns > 0;

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `₹${portfolio.totalValue.toLocaleString()}`,
      change: `+${returnPercentage}%`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      isPositive: true
    },
    {
      title: "Total Investment",
      value: `₹${portfolio.totalInvestment.toLocaleString()}`,
      change: "Principal Amount",
      icon: Target,
      color: "from-blue-500 to-purple-500",
      isPositive: true
    },
    {
      title: "Total Returns",
      value: `₹${portfolio.totalReturns.toLocaleString()}`,
      change: isPositive ? `+${returnPercentage}%` : `${returnPercentage}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "from-green-500 to-emerald-500" : "from-red-500 to-pink-500",
      isPositive
    },
    {
      title: "Monthly Income",
      value: `₹${portfolio.monthlyIncome.toLocaleString()}`,
      change: "Avg. Monthly",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      isPositive: true
    }
  ];

  const additionalStats = [
    { label: "Properties Owned", value: portfolio.properties, icon: Building2 },
    { label: "Total Shares", value: portfolio.totalShares, icon: Star },
    { label: "Avg. Monthly Yield", value: `${((portfolio.monthlyIncome * 12 / portfolio.totalInvestment) * 100).toFixed(1)}%`, icon: Zap }
  ];

  return (
    <motion.div 
      ref={containerRef}
      className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 mb-8 overflow-hidden group"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: [
          "0 0 30px rgba(251, 146, 60, 0.2)",
          "0 0 50px rgba(251, 146, 60, 0.4)",
          "0 0 30px rgba(251, 146, 60, 0.2)"
        ]
      }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        boxShadow: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Glowing border animation for main container */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-orange-400/0"
        animate={{
          borderColor: [
            "rgba(251, 146, 60, 0)",
            "rgba(251, 146, 60, 0.6)",
            "rgba(251, 146, 60, 0)"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mouse tracking gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(251, 146, 60, 0.1), transparent 40%)`,
        }}
      />

      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, rgba(251, 146, 60, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.4) 0%, transparent 50%)",
          backgroundSize: "120% 120%",
        }}
      />

      {/* Enhanced Header */}
      <div className="relative flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white">Portfolio Summary</h2>
              <p className="text-gray-400">Your commercial real estate investment overview</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/equity/portfolio">
            <Button
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300 backdrop-blur-sm rounded-xl px-6 py-3"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Portfolio
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Enhanced Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              boxShadow: [
                `0 0 20px ${
                  stat.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                  stat.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                  stat.color.includes('orange') ? 'rgba(251, 146, 60, 0.3)' :
                  'rgba(168, 85, 247, 0.3)'
                }`,
                `0 0 40px ${
                  stat.color.includes('green') ? 'rgba(34, 197, 94, 0.2)' :
                  stat.color.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                  stat.color.includes('orange') ? 'rgba(251, 146, 60, 0.2)' :
                  'rgba(168, 85, 247, 0.2)'
                }`,
                `0 0 20px ${
                  stat.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                  stat.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                  stat.color.includes('orange') ? 'rgba(251, 146, 60, 0.3)' :
                  'rgba(168, 85, 247, 0.3)'
                }`
              ]
            }}
            transition={{ 
              delay: 0.4 + index * 0.1, 
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }
            }}
            className="relative bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-orange-500/50 transition-all duration-500 group/card overflow-hidden"
            whileHover={{ 
              scale: 1.05, 
              y: -5,
            }}
          >
            {/* Individual card glowing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent"
              animate={{
                borderColor: [
                  `${
                    stat.color.includes('green') ? 'rgba(34, 197, 94, 0)' :
                    stat.color.includes('blue') ? 'rgba(59, 130, 246, 0)' :
                    stat.color.includes('orange') ? 'rgba(251, 146, 60, 0)' :
                    'rgba(168, 85, 247, 0)'
                  }`,
                  `${
                    stat.color.includes('green') ? 'rgba(34, 197, 94, 0.6)' :
                    stat.color.includes('blue') ? 'rgba(59, 130, 246, 0.6)' :
                    stat.color.includes('orange') ? 'rgba(251, 146, 60, 0.6)' :
                    'rgba(168, 85, 247, 0.6)'
                  }`,
                  `${
                    stat.color.includes('green') ? 'rgba(34, 197, 94, 0)' :
                    stat.color.includes('blue') ? 'rgba(59, 130, 246, 0)' :
                    stat.color.includes('orange') ? 'rgba(251, 146, 60, 0)' :
                    'rgba(168, 85, 247, 0)'
                  }`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
            />

            {/* Card sparkle effect */}
            <motion.div
              className="absolute top-3 right-3"
              animate={{ 
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
            >
              <Sparkles className="w-3 h-3 text-orange-400/40" />
            </motion.div>

            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover/card:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Content */}
              <div className="mb-3">
                <motion.div 
                  className="text-2xl font-bold text-white group-hover/card:text-orange-400 transition-colors duration-300"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
              </div>

              {/* Change indicator */}
              <motion.div 
                className={`flex items-center gap-1 text-xs px-3 py-1 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                  stat.isPositive 
                    ? "bg-green-500/20 text-green-400 border-green-500/30 group-hover/card:bg-green-500/30" 
                    : "bg-red-500/20 text-red-400 border-red-500/30 group-hover/card:bg-red-500/30"
                }`}
                whileHover={{ scale: 1.05 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
              >
                {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {additionalStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            className="relative bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 group/stat backdrop-blur-sm overflow-hidden"
            whileHover={{ scale: 1.02, y: -3 }}
          >
            {/* Sparkle effect */}
            <motion.div
              className="absolute top-3 right-3"
              animate={{ 
                rotate: [0, 180, 360],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: index * 0.7 
              }}
            >
              <Sparkles className="w-3 h-3 text-orange-400/40" />
            </motion.div>

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-orange-500/20 backdrop-blur-sm flex items-center justify-center border border-orange-500/30"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    backgroundColor: "rgba(251, 146, 60, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-5 h-5 text-orange-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <motion.div 
                    className="text-xl font-bold text-white group-hover/stat:text-orange-400 transition-colors duration-300"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="relative bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        {/* Performance background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.h3 
              className="text-xl font-semibold text-white flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-6 h-6 text-orange-400" />
              </motion.div>
              Performance Highlights
            </motion.h3>
            <motion.div 
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-green-500/20 border border-green-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Overall Positive</span>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-sm text-gray-400 mb-2">Return on Investment</div>
              <div className="flex items-center gap-3">
                <motion.div 
                  className="text-3xl font-bold text-green-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +{returnPercentage}%
                </motion.div>
                <div className="text-sm text-gray-400">vs. initial investment</div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-sm text-gray-400 mb-2">Annualized Yield</div>
              <div className="flex items-center gap-3">
                <motion.div 
                  className="text-3xl font-bold text-orange-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {((portfolio.monthlyIncome * 12 / portfolio.totalInvestment) * 100).toFixed(1)}%
                </motion.div>
                <div className="text-sm text-gray-400">annual return</div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/equity/dashboard">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 rounded-xl px-6 py-2 shadow-lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/equity/property">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm rounded-xl px-6 py-2"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm rounded-xl px-6 py-2"
              >
                <Users className="w-4 h-4 mr-2" />
                Share Portfolio
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
