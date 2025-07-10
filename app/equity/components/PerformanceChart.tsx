"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, BarChart3, DollarSign, Calendar, Sparkles, Target, Activity, TrendingDown, Brain } from "lucide-react";

interface PerformanceChartProps {
  portfolioData?: any;
}

interface PerformanceData {
  month: string;
  portfolioValue: number;
  investment: number;
  returns: number;
  monthlyIncome: number;
}

export default function PerformanceChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [selectedMetric, setSelectedMetric] = useState("value");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for interactive gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX);
  const mouseYSpring = useSpring(mouseY);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const periods = [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "ALL", label: "All Time" }
  ];

  const metrics = [
    { value: "value", label: "Portfolio Value", icon: DollarSign, color: "text-green-400" },
    { value: "returns", label: "Returns", icon: TrendingUp, color: "text-blue-400" },
    { value: "income", label: "Monthly Income", icon: Calendar, color: "text-orange-400" }
  ];

  // Mock performance data
  const performanceData: PerformanceData[] = [
    { month: "Jan", portfolioValue: 850000, investment: 800000, returns: 50000, monthlyIncome: 22000 },
    { month: "Feb", portfolioValue: 890000, investment: 850000, returns: 40000, monthlyIncome: 24000 },
    { month: "Mar", portfolioValue: 925000, investment: 880000, returns: 45000, monthlyIncome: 25500 },
    { month: "Apr", portfolioValue: 980000, investment: 920000, returns: 60000, monthlyIncome: 27000 },
    { month: "May", portfolioValue: 1120000, investment: 950000, returns: 170000, monthlyIncome: 28500 },
    { month: "Jun", portfolioValue: 1250000, investment: 950000, returns: 300000, monthlyIncome: 28500 }
  ];

  const currentData = performanceData[performanceData.length - 1];
  const previousData = performanceData[performanceData.length - 2];
  
  const getMetricValue = (data: PerformanceData, metric: string) => {
    switch (metric) {
      case "value": return data.portfolioValue;
      case "returns": return data.returns;
      case "income": return data.monthlyIncome;
      default: return data.portfolioValue;
    }
  };

  const currentValue = getMetricValue(currentData, selectedMetric);
  const previousValue = getMetricValue(previousData, selectedMetric);
  const changePercent = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
  const isPositive = currentValue > previousValue;

  const maxValue = Math.max(...performanceData.map(d => getMetricValue(d, selectedMetric)));
  const minValue = Math.min(...performanceData.map(d => getMetricValue(d, selectedMetric)));

  return (
    <motion.div 
      ref={chartRef}
      className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 overflow-hidden group"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
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
          background: `radial-gradient(900px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(251, 146, 60, 0.08), transparent 40%)`,
        }}
      />

      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.4) 0%, transparent 50%)",
          backgroundSize: "150% 150%",
        }}
      />

      {/* Enhanced Header */}
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Activity className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
              <p className="text-gray-400">Track your investment growth and returns</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-2 mt-4 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {periods.map((period, index) => (
            <motion.button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                selectedPeriod === period.value
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {period.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Metric Selection */}
      <motion.div 
        className="flex flex-wrap gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {metrics.map((metric, index) => (
          <motion.button
            key={metric.value}
            onClick={() => setSelectedMetric(metric.value)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm border ${
              selectedMetric === metric.value
                ? "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-lg"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-white/10"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <metric.icon className="w-4 h-4" />
            </motion.div>
            {metric.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Enhanced Current Value & Change */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          className="relative bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-500 overflow-hidden group/card"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Card sparkle effect */}
          <motion.div
            className="absolute top-3 right-3"
            animate={{ 
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3 text-orange-400/40" />
          </motion.div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400 font-medium">Current Value</span>
              <motion.div 
                className={`flex items-center gap-1 text-xs px-3 py-1 rounded-xl backdrop-blur-sm border ${
                  isPositive 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{changePercent}%
              </motion.div>
            </div>
            <motion.div 
              className="text-3xl font-bold text-white group-hover/card:text-orange-400 transition-colors duration-300"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ₹{currentValue.toLocaleString()}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          className="relative bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="text-sm text-gray-400 mb-3 font-medium">Monthly Change</div>
          <motion.div 
            className="text-3xl font-bold text-orange-400"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            {isPositive ? "+" : ""}₹{Math.abs(currentValue - previousValue).toLocaleString()}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
          className="relative bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="text-sm text-gray-400 mb-3 font-medium">Average Growth</div>
          <motion.div 
            className="text-3xl font-bold text-green-400"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          >
            +{((currentValue - performanceData[0].portfolioValue) / performanceData[0].portfolioValue * 100 / performanceData.length).toFixed(1)}%
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Chart Area with Proper Bar Chart */}
      <motion.div 
        className="relative bg-black/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-hidden mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Chart background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              className="text-lg font-semibold text-white flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Performance Chart - {selectedPeriod}
            </motion.div>
            <div className="text-sm text-gray-400">
              Hover over bars for details
            </div>
          </div>
          
          {/* Bar Chart Container */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-500 pr-4">
              <span>₹{(maxValue / 100000).toFixed(0)}L</span>
              <span>₹{((maxValue + minValue) / 200000).toFixed(0)}L</span>
              <span>₹{(minValue / 100000).toFixed(0)}L</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-64 flex items-end justify-between gap-3">
              {performanceData.map((data, index) => {
                const value = getMetricValue(data, selectedMetric);
                const heightPercentage = ((value - minValue) / (maxValue - minValue)) * 100;
                const barHeight = Math.max(heightPercentage * 2.4, 8); // Convert to pixels, minimum 8px
                const isHovered = hoveredBar === index;
                
                return (
                  <motion.div
                    key={`${data.month}-${selectedMetric}`}
                    className="flex flex-col items-center gap-3 flex-1 relative group/bar"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Hover tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 10,
                        scale: isHovered ? 1 : 0.8
                      }}
                      className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-lg p-3 border border-orange-500/30 z-20 whitespace-nowrap"
                    >
                      <div className="text-xs text-orange-400 font-medium">{data.month}</div>
                      <div className="text-sm text-white font-bold">
                        ₹{value.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-300">
                        {metrics.find(m => m.value === selectedMetric)?.label}
                      </div>
                    </motion.div>

                    {/* Value label on hover */}
                    <motion.div 
                      className="text-xs text-gray-400 font-medium h-4"
                      animate={{ opacity: isHovered ? 1 : 0 }}
                    >
                      {isHovered && `₹${(value / 1000).toFixed(0)}k`}
                    </motion.div>
                    
                    {/* Bar */}
                    <motion.div
                      className="relative w-full max-w-16 rounded-t-xl overflow-hidden bg-gradient-to-t from-orange-500 to-red-500 cursor-pointer"
                      initial={{ height: 0 }}
                      animate={{ height: barHeight }}
                      transition={{ 
                        delay: index * 0.15, 
                        duration: 0.8, 
                        type: "spring", 
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        boxShadow: "0 0 30px rgba(251, 146, 60, 0.6)",
                        scale: 1.05
                      }}
                      style={{ minHeight: "8px" }}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.2,
                          repeatDelay: 3
                        }}
                      />
                      
                      {/* Pulsing effect for hovered bar */}
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{ opacity: [0, 0.4, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}

                      {/* Inner glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-orange-400/20 to-red-400/20"
                        animate={{ 
                          opacity: isHovered ? [0.3, 0.6, 0.3] : 0.3
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    
                    {/* Month label */}
                    <motion.div 
                      className="text-xs text-gray-400 font-medium mt-2"
                      whileHover={{ scale: 1.1, color: "#fff" }}
                    >
                      {data.month}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* X-axis line */}
            <motion.div 
              className="ml-12 h-px bg-gradient-to-r from-gray-600 to-gray-700 mt-2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Enhanced Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div 
          className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <motion.div
            className="absolute top-3 right-3"
            animate={{ 
              rotate: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-4 h-4 text-green-400/50" />
          </motion.div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">Best Performing Month</span>
            </div>
            <div className="text-white font-semibold text-lg">May 2024</div>
            <div className="text-sm text-gray-400">+15.2% portfolio growth</div>
          </div>
        </motion.div>

        <motion.div 
          className="relative bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.02, y: -3 }}
        >
          <motion.div
            className="absolute top-3 right-3"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Target className="w-4 h-4 text-orange-400/50" />
          </motion.div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Growth Prediction</span>
            </div>
            <div className="text-white font-semibold text-lg">Next 6 Months</div>
            <div className="text-sm text-gray-400">Projected +18.5% growth</div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="relative bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        {/* AI background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-6 h-6 text-purple-400" />
            </motion.div>
            <span className="text-lg font-semibold text-purple-400">AI Performance Insights</span>
          </div>
          
          <motion.div 
            className="text-white text-sm mb-3 leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            Your portfolio is performing 23% better than market average. Consider diversifying into data centers for higher yields.
          </motion.div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <BarChart3 className="w-4 h-4" />
            Based on market analysis and your risk profile
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
