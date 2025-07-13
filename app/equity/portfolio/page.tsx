"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Building2, Target, Star, Eye, Download, Share2, AlertCircle, CheckCircle, ArrowUpRight, Zap, BarChart3, PieChart, Activity, Filter, Grid3X3, List, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortfolioSummary } from "../components";

interface PortfolioProperty {
  id: string;
  name: string;
  type: string;
  location: string;
  sharesOwned: number;
  totalShares: number;
  pricePerShare: number;
  currentValue: number;
  initialInvestment: number;
  currentYield: number;
  monthlyIncome: number;
  totalReturns: number;
  returnPercentage: number;
  lastUpdated: string;
  riskLevel: "Low" | "Medium" | "High";
  occupancyRate: number;
  aiScore: number;
  performance: "positive" | "negative" | "neutral";
}

interface PortfolioMetrics {
  totalValue: number;
  totalInvestment: number;
  totalReturns: number;
  monthlyIncome: number;
  properties: number;
  totalShares: number;
  averageYield: number;
  bestPerformer: string;
  worstPerformer: string;
}

export default function PortfolioPage() {
  const [portfolioProperties, setPortfolioProperties] = useState<PortfolioProperty[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("value");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data
  const mockPortfolioProperties: PortfolioProperty[] = [
    {
      id: "1",
      name: "Cyber Hub Office Complex",
      type: "Office Building",
      location: "Gurgaon, Haryana",
      sharesOwned: 45,
      totalShares: 10000,
      pricePerShare: 2500,
      currentValue: 127500,
      initialInvestment: 112500,
      currentYield: 8.5,
      monthlyIncome: 9562,
      totalReturns: 15000,
      returnPercentage: 13.3,
      lastUpdated: "2024-01-15",
      riskLevel: "Medium",
      occupancyRate: 95,
      aiScore: 92,
      performance: "positive"
    },
    {
      id: "2",
      name: "Data Center Facility",
      type: "Data Center",
      location: "Mumbai, Maharashtra",
      sharesOwned: 25,
      totalShares: 6000,
      pricePerShare: 5000,
      currentValue: 137500,
      initialInvestment: 125000,
      currentYield: 11.5,
      monthlyIncome: 12000,
      totalReturns: 12500,
      returnPercentage: 10.0,
      lastUpdated: "2024-01-15",
      riskLevel: "Medium",
      occupancyRate: 98,
      aiScore: 95,
      performance: "positive"
    },
    {
      id: "3",
      name: "Retail Mall Complex",
      type: "Retail",
      location: "Noida, UP",
      sharesOwned: 18,
      totalShares: 15000,
      pricePerShare: 3200,
      currentValue: 55800,
      initialInvestment: 57600,
      currentYield: 7.8,
      monthlyIncome: 3744,
      totalReturns: -1800,
      returnPercentage: -3.1,
      lastUpdated: "2024-01-15",
      riskLevel: "Low",
      occupancyRate: 92,
      aiScore: 89,
      performance: "negative"
    },
    {
      id: "4",
      name: "Logistic Park Warehouse",
      type: "Warehouse",
      location: "Sonipat, Haryana",
      sharesOwned: 32,
      totalShares: 8000,
      pricePerShare: 1800,
      currentValue: 62400,
      initialInvestment: 57600,
      currentYield: 9.2,
      monthlyIncome: 4784,
      totalReturns: 4800,
      returnPercentage: 8.3,
      lastUpdated: "2024-01-15",
      riskLevel: "High",
      occupancyRate: 88,
      aiScore: 88,
      performance: "positive"
    },
    {
      id: "5",
      name: "Co-working Hub",
      type: "Co-working",
      location: "Bangalore, Karnataka",
      sharesOwned: 28,
      totalShares: 12000,
      pricePerShare: 2800,
      currentValue: 78400,
      initialInvestment: 78400,
      currentYield: 8.9,
      monthlyIncome: 5817,
      totalReturns: 0,
      returnPercentage: 0.0,
      lastUpdated: "2024-01-15",
      riskLevel: "Medium",
      occupancyRate: 87,
      aiScore: 86,
      performance: "neutral"
    }
  ];

  const mockPortfolioMetrics: PortfolioMetrics = {
    totalValue: 461600,
    totalInvestment: 431100,
    totalReturns: 30500,
    monthlyIncome: 35907,
    properties: 5,
    totalShares: 148,
    averageYield: 9.18,
    bestPerformer: "Cyber Hub Office Complex",
    worstPerformer: "Retail Mall Complex"
  };

  const filterOptions = [
    { value: "all", label: "All Properties" },
    { value: "positive", label: "Positive Returns" },
    { value: "negative", label: "Negative Returns" },
    { value: "high-yield", label: "High Yield (>9%)" },
    { value: "low-risk", label: "Low Risk" },
    { value: "medium-risk", label: "Medium Risk" },
    { value: "high-risk", label: "High Risk" }
  ];

  const sortOptions = [
    { value: "value", label: "Current Value" },
    { value: "returns", label: "Total Returns" },
    { value: "percentage", label: "Return %" },
    { value: "income", label: "Monthly Income" },
    { value: "yield", label: "Current Yield" },
    { value: "aiScore", label: "AI Score" }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPortfolioProperties(mockPortfolioProperties);
      setPortfolioMetrics(mockPortfolioMetrics);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = portfolioProperties.filter(property => {
    switch (selectedFilter) {
      case "positive":
        return property.performance === "positive";
      case "negative":
        return property.performance === "negative";
      case "high-yield":
        return property.currentYield > 9;
      case "low-risk":
        return property.riskLevel === "Low";
      case "medium-risk":
        return property.riskLevel === "Medium";
      case "high-risk":
        return property.riskLevel === "High";
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case "value":
        return b.currentValue - a.currentValue;
      case "returns":
        return b.totalReturns - a.totalReturns;
      case "percentage":
        return b.returnPercentage - a.returnPercentage;
      case "income":
        return b.monthlyIncome - a.monthlyIncome;
      case "yield":
        return b.currentYield - a.currentYield;
      case "aiScore":
        return b.aiScore - a.aiScore;
      default:
        return 0;
    }
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-400 bg-green-500/10";
      case "Medium": return "text-yellow-400 bg-yellow-500/10";
      case "High": return "text-red-400 bg-red-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "positive": return "text-green-400";
      case "negative": return "text-red-400";
      case "neutral": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case "positive": return TrendingUp;
      case "negative": return TrendingDown;
      case "neutral": return Activity;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My Portfolio
                <span className="text-orange-500 ml-2">Dashboard</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Track your commercial real estate investments and performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        {portfolioMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <PortfolioSummary portfolio={portfolioMetrics} />
          </motion.div>
        )}

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Filter Properties</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">View Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            {/* Add Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Actions</label>
              <Link href="/equity/property">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Investment
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Your Properties
              <span className="text-orange-500 ml-2">({filteredProperties.length})</span>
            </h2>
          </div>

          {filteredProperties.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredProperties.map((property, index) => {
                const PerformanceIcon = getPerformanceIcon(property.performance);
                
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 p-6"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
                        <div className="text-sm text-gray-400">{property.location}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(property.riskLevel)}`}>
                          {property.riskLevel}
                        </div>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/40 rounded-lg p-3">
                        <div className="text-xl font-bold text-white mb-1">
                          ₹{property.currentValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Current Value</div>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3">
                        <div className={`text-xl font-bold mb-1 ${getPerformanceColor(property.performance)}`}>
                          {property.returnPercentage > 0 ? '+' : ''}{property.returnPercentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">Return</div>
                      </div>
                    </div>

                    {/* Shares Info */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Shares Owned</span>
                        <span className="text-sm font-semibold text-white">
                          {property.sharesOwned} / {property.totalShares.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        Ownership: {((property.sharesOwned / property.totalShares) * 100).toFixed(3)}%
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Monthly Income</span>
                        <span className="text-green-400 font-semibold">₹{property.monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Current Yield</span>
                        <span className="text-orange-400 font-semibold">{property.currentYield}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Returns</span>
                        <span className={`font-semibold ${getPerformanceColor(property.performance)}`}>
                          {property.totalReturns > 0 ? '+' : ''}₹{property.totalReturns.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">AI Score</span>
                        <span className="text-purple-400 font-semibold">{property.aiScore}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/equity/property/${property.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Performance Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <PerformanceIcon className={`w-4 h-4 ${getPerformanceColor(property.performance)}`} />
                      <span className="text-gray-400">
                        {property.performance === "positive" ? "Outperforming" : 
                         property.performance === "negative" ? "Underperforming" : "Stable"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No properties match your filter</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filter criteria to see more properties.
              </p>
              <Button
                onClick={() => setSelectedFilter("all")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Show All Properties
              </Button>
            </div>
          )}
        </motion.div>

        {/* Portfolio Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Portfolio Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Performance Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Performer:</span>
                  <span className="text-green-400 font-semibold">{portfolioMetrics?.bestPerformer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Worst Performer:</span>
                  <span className="text-red-400 font-semibold">{portfolioMetrics?.worstPerformer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Yield:</span>
                  <span className="text-orange-400 font-semibold">{portfolioMetrics?.averageYield.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">AI Recommendations</h4>
              <div className="text-sm text-gray-300">
                Consider rebalancing your portfolio by reducing retail exposure and increasing data center investments for better risk-adjusted returns.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
