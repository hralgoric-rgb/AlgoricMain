"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, Calendar, Target, Zap, ArrowUpRight, DollarSign } from "lucide-react";

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
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Performance Analytics</h2>
          <p className="text-gray-400">Track your investment growth and returns</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedPeriod === period.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.value}
            onClick={() => setSelectedMetric(metric.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedMetric === metric.value
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <metric.icon className="w-4 h-4" />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Current Value & Change */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Current Value</span>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}{changePercent}%
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{currentValue.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
        >
          <div className="text-sm text-gray-400 mb-2">Monthly Change</div>
          <div className="text-2xl font-bold text-orange-400">
            {isPositive ? "+" : ""}₹{Math.abs(currentValue - previousValue).toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
        >
          <div className="text-sm text-gray-400 mb-2">Average Growth</div>
          <div className="text-2xl font-bold text-green-400">
            +{((currentValue - performanceData[0].portfolioValue) / performanceData[0].portfolioValue * 100 / performanceData.length).toFixed(1)}%
          </div>
        </motion.div>
      </div>

      {/* Chart Area */}
      <div className="relative h-64 bg-black/20 rounded-xl p-4 border border-gray-800">
        <div className="absolute top-4 left-4 text-sm text-gray-400">
          Performance Chart - {selectedPeriod}
        </div>
        
        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between h-full pt-8 pb-4">
          {performanceData.map((data, index) => {
            const value = getMetricValue(data, selectedMetric);
            const height = ((value - minValue) / (maxValue - minValue)) * 100;
            
            return (
              <motion.div
                key={data.month}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="text-xs text-gray-400 font-medium">
                  ₹{(value / 1000).toFixed(0)}k
                </div>
                <div 
                  className="w-full max-w-16 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-md transition-all duration-300 hover:from-orange-400 hover:to-red-400"
                  style={{ height: `${height}%`, minHeight: "4px" }}
                />
                <div className="text-xs text-gray-400 font-medium">
                  {data.month}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Best Performing Month</span>
          </div>
          <div className="text-white font-semibold">May 2024</div>
          <div className="text-sm text-gray-400">+15.2% portfolio growth</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">Growth Prediction</span>
          </div>
          <div className="text-white font-semibold">Next 6 Months</div>
          <div className="text-sm text-gray-400">Projected +18.5% growth</div>
        </div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">AI Performance Insights</span>
        </div>
        <div className="text-white text-sm mb-2">
          Your portfolio is performing 23% better than market average. Consider diversifying into data centers for higher yields.
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <BarChart3 className="w-4 h-4" />
          Based on market analysis and your risk profile
        </div>
      </motion.div>
    </div>
  );
}
