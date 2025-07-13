"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Target, Building2, Calendar, ArrowUpRight, Zap, Star, Shield, Users, Eye } from "lucide-react";
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
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Portfolio Summary</h2>
          <p className="text-gray-400">Your commercial real estate investment overview</p>
        </div>
        <Link href="/equity/portfolio">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Full Portfolio
          </Button>
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
              {stat.value}
            </div>
            <div className="text-sm text-gray-400">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {additionalStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Performance Highlights</h3>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Overall Positive</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-400 mb-2">Return on Investment</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-400">+{returnPercentage}%</div>
              <div className="text-sm text-gray-400">vs. initial investment</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 mb-2">Annualized Yield</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-orange-400">
                {((portfolio.monthlyIncome * 12 / portfolio.totalInvestment) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">annual return</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/equity/dashboard">
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Link href="/equity/property">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Browse Properties
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            <Users className="w-4 h-4 mr-2" />
            Share Portfolio
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
