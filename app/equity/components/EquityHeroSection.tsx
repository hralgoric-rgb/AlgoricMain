"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Shield, 
  Play, 
  X, 
  Sparkles,
  Target,
  BarChart3,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EquityHeroSection() {
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const [investorCount, setInvestorCount] = useState(2847);
  const [totalInvestment, setTotalInvestment] = useState(1250000000);
  const [monthlyReturns, setMonthlyReturns] = useState(15680000);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [investment, setInvestment] = useState(10000);
  const [duration, setDuration] = useState(24);
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

  const featuredProperties = [
    {
      id: 1,
      name: "Tech Park Mumbai",
      location: "Bandra Kurla Complex",
      type: "Office Building",
      yield: "8.5%",
      invested: "₹45L",
      total: "₹2.5Cr",
      image: "/properties/office1.jpg"
    },
    {
      id: 2,
      name: "Data Center Pune",
      location: "Hinjewadi Phase 2",
      type: "Data Center",
      yield: "11.2%",
      invested: "₹32L",
      total: "₹1.8Cr",
      image: "/properties/datacenter1.jpg"
    },
    {
      id: 3,
      name: "Warehouse Gurgaon",
      location: "IMT Manesar",
      type: "Logistics Hub",
      yield: "9.8%",
      invested: "₹28L",
      total: "₹1.2Cr",
      image: "/properties/warehouse1.jpg"
    },
    {
      id: 4,
      name: "Mall Bangalore",
      location: "Whitefield",
      type: "Retail Complex",
      yield: "7.2%",
      invested: "₹55L",
      total: "₹3.2Cr",
      image: "/properties/mall1.jpg"
    }
  ];

  const calculatedReturns = (investment * (8.5 / 100) * (duration / 12)).toFixed(0);
  const totalReturns = (investment + parseInt(calculatedReturns)).toFixed(0);

  // Auto-cycle through properties
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePropertyIndex((prev) => (prev + 1) % featuredProperties.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProperties.length]);

  // Animate counters
  useEffect(() => {
    const interval = setInterval(() => {
      setInvestorCount(prev => prev + Math.floor(Math.random() * 3));
      setTotalInvestment(prev => prev + Math.floor(Math.random() * 50000));
      setMonthlyReturns(prev => prev + Math.floor(Math.random() * 10000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section 
      ref={containerRef}
      className="min-h-screen bg-black relative overflow-hidden flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl ${
              i % 3 === 0 ? 'w-96 h-96 bg-orange-500/10' :
              i % 3 === 1 ? 'w-80 h-80 bg-red-500/10' :
              'w-72 h-72 bg-yellow-500/10'
            }`}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Interactive mouse gradient */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(251, 146, 60, 0.15), transparent 40%)`,
        }}
      />

      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(239, 68, 68, 0.4) 0%, transparent 50%)",
          backgroundSize: "150% 150%",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-white">SEBI Regulated & Trusted</span>
            </motion.div>

            {/* Main Headline with staggered animation */}
            <div className="space-y-4">
              <motion.h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="block text-white"
                >
                  Invest in
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
                >
                  Commercial
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="block text-white"
                >
                  Real Estate
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-xl text-gray-300 max-w-lg leading-relaxed"
              >
                Start with just ₹2,500. Own premium office buildings, data centers & warehouses. 
                Earn monthly rental income from Day 1.
              </motion.p>
            </div>

            {/* Live Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
            >
              {[
                { label: "Active Investors", value: investorCount.toLocaleString(), icon: BarChart3 },
                { label: "Assets Under Management", value: `₹${Math.round(totalInvestment / 10000000)}Cr+`, icon: Building2 },
                { label: "Monthly Returns Paid", value: `₹${Math.round(monthlyReturns / 100000)}L+`, icon: TrendingUp }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  <stat.icon className="w-6 h-6 text-orange-400 mx-auto mb-2 group-hover:text-orange-300 transition-colors" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/equity/property">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/25">
                    Start Investing
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setIsVideoOpen(true)}
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Investment Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Property Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-500 border-2 ${
                    index === activePropertyIndex 
                      ? 'bg-white/10 backdrop-blur-md border-orange-500/50 shadow-lg shadow-orange-500/20' 
                      : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setActivePropertyIndex(index)}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    rotateX: 5
                  }}
                  animate={{
                    scale: index === activePropertyIndex ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-orange-400" />
                    <div>
                      <h4 className="text-white font-semibold text-sm">{property.name}</h4>
                      <p className="text-gray-400 text-xs">{property.location}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{property.type}</span>
                    <span className="text-green-400 font-bold text-sm">{property.yield}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Investment Calculator */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-bold text-white">Investment Calculator</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Investment Amount</label>
                  <motion.input
                    type="range"
                    min="2500"
                    max="1000000"
                    step="2500"
                    value={investment}
                    onChange={(e) => setInvestment(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>₹2,500</span>
                    <span className="text-orange-400 font-bold">₹{investment.toLocaleString()}</span>
                    <span>₹10L</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Investment Duration</label>
                  <motion.input
                    type="range"
                    min="6"
                    max="60"
                    step="6"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>6 months</span>
                    <span className="text-orange-400 font-bold">{duration} months</span>
                    <span>5 years</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Expected Returns</div>
                    <motion.div 
                      className="text-2xl font-bold text-green-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ₹{parseInt(calculatedReturns).toLocaleString()}
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Value</div>
                    <motion.div 
                      className="text-2xl font-bold text-orange-400"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      ₹{parseInt(totalReturns).toLocaleString()}
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/equity/property">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 font-semibold rounded-xl transition-all duration-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Start This Investment
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.5, rotateY: -15 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.5, rotateY: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                <p className="text-xl font-semibold">Commercial Real Estate Investment Demo</p>
                <p className="text-gray-400 mt-2">Learn how to start investing in just 3 minutes</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #ef4444);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #ef4444);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(251, 146, 60, 0.4);
        }
      `}</style>
    </motion.section>
  );
} 