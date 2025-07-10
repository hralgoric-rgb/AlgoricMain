"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Building2, TrendingUp, DollarSign, Target, BarChart3, Users, Shield, Clock, Zap, Star, Eye, ChevronRight, CheckCircle, UserPlus, CreditCard, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PropertyCard from "./components/PropertyCard";
import PortfolioSummary from "./components/PortfolioSummary";
import PerformanceChart from "./components/PerformanceChart";

export default function EquityDashboard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Subtle parallax effects
  const heroParallax = useTransform(scrollY, [0, 400], [0, -100]);
  const cardsParallax = useTransform(scrollY, [100, 600], [0, -50]);
  const statsParallax = useTransform(scrollY, [200, 800], [0, -30]);

  // Mouse tracking for subtle gradient effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mock data
  const mockPortfolio = {
    totalValue: 1250000,
    totalInvestment: 950000,
    totalReturns: 300000,
    monthlyIncome: 28500,
    properties: 12,
    totalShares: 847
  };

  const featuredProperty = {
    id: "1",
    name: "Tech Park Mumbai",
    type: "Office Building",
    location: "Bandra Kurla Complex",
    totalShares: 1000,
    availableShares: 250,
    pricePerShare: 2500,
    currentYield: 8.5,
    predictedAppreciation: 12.3,
    riskLevel: "Low" as const,
    image: "/property-1.jpg",
    description: "Premium office space in Mumbai's financial district",
    rentalIncome: 85000,
    occupancyRate: 95,
    totalValue: 2500000,
    aiScore: 92,
    features: ["Prime Location", "High Occupancy", "Stable Tenants"]
  };

  const quickStats = [
    { label: "Portfolio Value", value: "₹12.5L", change: "+8.2%", icon: DollarSign, color: "text-green-400" },
    { label: "Monthly Income", value: "₹28.5K", change: "+12.1%", icon: TrendingUp, color: "text-blue-400" },
    { label: "Properties Owned", value: "12", change: "+2", icon: Building2, color: "text-orange-400" },
    { label: "Total Returns", value: "31.5%", change: "+4.2%", icon: Target, color: "text-purple-400" }
  ];

  const investmentSteps = [
    {
      id: 1,
      title: "Create Account",
      description: "Sign up with your mobile number and complete KYC verification in under 5 minutes",
      icon: UserPlus,
      gradient: "from-blue-500 to-cyan-500",
      borderGlow: "border-blue-500/50 shadow-blue-500/25",
      time: "2 min"
    },
    {
      id: 2,
      title: "Browse Properties", 
      description: "Explore curated commercial real estate opportunities with detailed analytics",
      icon: Building2,
      gradient: "from-green-500 to-emerald-500", 
      borderGlow: "border-green-500/50 shadow-green-500/25",
      time: "5 min"
    },
    {
      id: 3,
      title: "Invest Securely",
      description: "Start with just ₹2,500 and purchase fractional ownership through secure payment",
      icon: CreditCard,
      gradient: "from-orange-500 to-red-500",
      borderGlow: "border-orange-500/50 shadow-orange-500/25", 
      time: "1 min"
    },
    {
      id: 4,
      title: "Earn Returns",
      description: "Receive monthly rental income and track your portfolio growth in real-time",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      borderGlow: "border-purple-500/50 shadow-purple-500/25",
      time: "Monthly"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(251, 146, 60, 0.08), transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:24px_24px] opacity-30" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroParallax }}
        className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8"
            >
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Welcome to Your Investment Dashboard</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="block text-white">Commercial Real Estate</span>
              <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Start with ₹2,500. Own premium office buildings, data centers & warehouses. 
              Earn monthly rental income from Day 1.
            </motion.p>
          </div>

          {/* Quick Stats Cards */}
          <motion.div 
            style={{ y: cardsParallax }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
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
                  duration: 0.6, 
                  delay: 0.6 + index * 0.1,
                  boxShadow: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-orange-400/30 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Glowing border animation for quick stats */}
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

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </motion.div>
                    <motion.span 
                      className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {stat.change}
                    </motion.span>
                  </div>
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-1"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Portfolio Summary */}
      <motion.section 
        style={{ y: statsParallax }}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <PortfolioSummary portfolio={mockPortfolio} />
        </div>
      </motion.section>

      {/* Investment Steps Section with Glowing Borders */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Start Investing in 4 Simple Steps</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get started with commercial real estate investing in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {/* Glowing border effect */}
                <motion.div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${step.borderGlow.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : 
                                  step.borderGlow.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                                  step.borderGlow.includes('orange') ? 'rgba(251, 146, 60, 0.3)' :
                                  'rgba(168, 85, 247, 0.3)'}`,
                      `0 0 40px ${step.borderGlow.includes('blue') ? 'rgba(59, 130, 246, 0.2)' : 
                                  step.borderGlow.includes('green') ? 'rgba(34, 197, 94, 0.2)' :
                                  step.borderGlow.includes('orange') ? 'rgba(251, 146, 60, 0.2)' :
                                  'rgba(168, 85, 247, 0.2)'}`,
                      `0 0 20px ${step.borderGlow.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : 
                                  step.borderGlow.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                                  step.borderGlow.includes('orange') ? 'rgba(251, 146, 60, 0.3)' :
                                  'rgba(168, 85, 247, 0.3)'}`
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />

                <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                  {/* Step number */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.id}
                  </motion.div>

                  {/* Time indicator */}
                  <motion.div
                    className="absolute top-4 right-4 text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full font-medium"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.time}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Completion indicator */}
                  <motion.div
                    className="flex items-center gap-2 mt-6 text-sm text-green-400"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                    Easy & Secure
                  </motion.div>

                  {/* Animated bottom border */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.gradient} rounded-b-3xl`}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action for steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/equity/property">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Start Your Journey Today
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Investment Opportunity */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Featured Investment</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Hand-picked opportunity with verified returns and low risk
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <PropertyCard property={featuredProperty} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/equity/property">
              <Button 
                size="lg"
                variant="outline"
                className="border-orange-400/50 text-orange-400 hover:bg-orange-400/10 px-8 py-3 rounded-xl font-semibold backdrop-blur-md group"
              >
                View All Properties
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Performance Chart */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Performance Analytics</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Track your investment growth and rental income over time
            </p>
          </motion.div>
          
          <PerformanceChart />
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose 100Gaj?</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Professional real estate investing made accessible
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Low Entry Point",
                description: "Start investing with just ₹2,500 and build your portfolio gradually",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "SEBI Regulated",
                description: "Fully compliant platform ensuring your investments are secure",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Clock,
                title: "Monthly Income",
                description: "Earn regular rental income deposited directly to your account",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${
                      feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                      feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                      'rgba(251, 146, 60, 0.3)'
                    }`,
                    `0 0 40px ${
                      feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0.2)' :
                      feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                      'rgba(251, 146, 60, 0.2)'
                    }`,
                    `0 0 20px ${
                      feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                      feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                      'rgba(251, 146, 60, 0.3)'
                    }`
                  ]
                }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-orange-400/30 transition-all duration-300 group text-center relative overflow-hidden"
              >
                {/* Glowing border animation for feature cards */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent"
                  animate={{
                    borderColor: [
                      `${
                        feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0)' :
                        feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0)' :
                        'rgba(251, 146, 60, 0)'
                      }`,
                      `${
                        feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0.6)' :
                        feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.6)' :
                        'rgba(251, 146, 60, 0.6)'
                      }`,
                      `${
                        feature.gradient.includes('green') ? 'rgba(34, 197, 94, 0)' :
                        feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0)' :
                        'rgba(251, 146, 60, 0)'
                      }`
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.7,
                    boxShadow: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.7
                    }
                  }}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 3, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.6 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-3xl border border-orange-400/20 p-12"
          >
            <Star className="w-12 h-12 text-orange-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Building Wealth?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors earning monthly income from premium commercial properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/equity/property">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Start Investing
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/equity/portfolio">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-md"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
