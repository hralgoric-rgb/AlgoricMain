"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	Target,
	Building2,
	Calendar,
	ArrowUpRight,
	Zap,
	Star,
	Shield,
	Users,
	Eye,
	Sparkles,
	BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "./BackgroundVideo";

interface Portfolio {
	totalValue: number;
	totalInvestment: number;
	totalReturns: number;
	monthlyIncome: number;
	properties: number;
	totalShares: number;
	averageYield?: number; // Optional field from API
	bestPerformer?: string; // Optional field from API
	worstPerformer?: string; // Optional field from API
}

interface PortfolioSummaryProps {
	portfolio: Portfolio;
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
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

	const returnPercentage =
		portfolio.totalInvestment > 0
			? ((portfolio.totalReturns / portfolio.totalInvestment) * 100).toFixed(1)
			: "0.0";
	const isPositive = portfolio.totalReturns > 0;

	const stats = [
		{
			title: "Total Portfolio Value",
			value: `₹${portfolio.totalValue.toLocaleString()}`,
			change: `+${returnPercentage}%`,
			icon: DollarSign,
			color: "from-green-500 to-emerald-500",
			isPositive: true,
		},
		{
			title: "Total Investment",
			value: `₹${portfolio.totalInvestment.toLocaleString()}`,
			change: "Principal Amount",
			icon: Target,
			color: "from-blue-500 to-purple-500",
			isPositive: true,
		},
		{
			title: "Total Returns",
			value: `₹${portfolio.totalReturns.toLocaleString()}`,
			change: isPositive ? `+${returnPercentage}%` : `${returnPercentage}%`,
			icon: isPositive ? TrendingUp : TrendingDown,
			color: isPositive
				? "from-green-500 to-emerald-500"
				: "from-red-500 to-pink-500",
			isPositive,
		},
		{
			title: "Monthly Income",
			value: `₹${portfolio.monthlyIncome.toLocaleString()}`,
			change: "Avg. Monthly",
			icon: Calendar,
			color: "from-orange-500 to-red-500",
			isPositive: true,
		},
	];
	const additionalStats = [
		{ label: "Properties Owned", value: portfolio.properties, icon: Building2 },
		{ label: "Total Shares", value: portfolio.totalShares, icon: Star },
		{
			label: "Avg. Annual Yield",
			value: portfolio.averageYield
				? `${portfolio.averageYield.toFixed(1)}%`
				: portfolio.totalInvestment > 0
				? `${(
						((portfolio.monthlyIncome * 12) / portfolio.totalInvestment) *
						100
				  ).toFixed(1)}%`
				: "0.0%",
			icon: Zap,
		},
	];


  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 overflow-hidden group bg-black border border-[#a78bfa]"
    >
      {/* Animated background video layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <BackgroundVideo className="w-full h-full" />
      </div>
      {/* Content above background */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: '#ede9fe' }}
              >
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#a78bfa' }} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white transition-colors duration-300 hover:text-purple-400 cursor-pointer break-words">Portfolio Summary</h2>
                <p className="text-gray-400 text-sm sm:text-base">Your commercial real estate investment overview</p>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Link href="/equity/portfolio">
              <Button
                className="w-full sm:w-auto rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-semibold shadow-md transition-colors duration-300 group bg-[#a78bfa] text-white border-none hover:bg-white hover:text-[#a78bfa] focus:bg-white focus:text-[#a78bfa] text-sm sm:text-base"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:text-[#a78bfa] group-focus:text-[#a78bfa]" />
                <span className="hidden xs:inline">View Full Portfolio</span>
                <span className="xs:hidden">Portfolio</span>
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:text-[#a78bfa] group-focus:text-[#a78bfa]" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-[#a78bfa] flex flex-col gap-3 sm:gap-4 group/stat transition-all duration-300 hover:shadow-[0_0_24px_4px_#a78bfa66] hover:scale-[1.035] focus:shadow-[0_0_24px_4px_#a78bfa66] focus:scale-[1.035] outline-none"
              style={{ background: 'linear-gradient(135deg, #a78bfa22 0%, #1e293b 100%)' }}
              tabIndex={0}
            >
              {/* Icon with glowing backdrop */}
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#a78bfa]/10">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                {/* Neon pill tag */}
                <span className="text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow bg-[#B6FF3F] text-white animate-pulse break-words">
                  {stat.change}
                </span>
              </div>
              {/* Stat value */}
              <h3 className="stat-value text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1 tracking-tight break-all" style={{ color: '#B6FF3F' }}>
                {stat.value}
              </h3>
              {/* Stat label */}
              <div className="stat-label text-sm sm:text-base text-gray-300 font-medium tracking-wide break-words">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
          {additionalStats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative bg-gradient-to-r from-purple-200/10 to-purple-400/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#a78bfa] backdrop-blur-sm overflow-hidden shadow-lg"
            >
              {/* Sparkle effect */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <Sparkles className="w-3 h-3 text-purple-400/40" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border border-[#a78bfa] flex-shrink-0" style={{ background: '#6d28d9' }}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-gray-400 mb-1 break-words">{stat.label}</div>
                    <div className="text-lg sm:text-xl font-bold text-white break-all">
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Performance Summary */}
        <div
          className="relative bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#a78bfa] hover:shadow-[0_0_32px_4px_#a78bfa55]"
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                Performance Highlights
              </h3>
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-[#B6FF3F]/20 border border-[#B6FF3F] transition-all duration-300 hover:shadow-[0_0_16px_2px_#B6FF3F99]">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#B6FF3F' }} />
                <span className="text-xs sm:text-sm font-medium" style={{ color: '#B6FF3F' }}>Overall Positive</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-xs sm:text-sm text-gray-400 mb-2">Return on Investment</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div className="text-2xl sm:text-3xl font-bold break-all" style={{ color: '#B6FF3F' }}>
                    +{returnPercentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">vs. initial investment</div>
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-xs sm:text-sm text-gray-400 mb-2">Annualized Yield</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 break-all">
                    {((portfolio.monthlyIncome * 12 / portfolio.totalInvestment) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">annual return</div>
                </div>
              </div>
            </div>
            {/* Enhanced Quick Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link href="/equity/dashboard">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#a78bfa] to-[#6d28d9] text-white transition-all duration-300 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 shadow-lg border-none text-sm"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/equity/property">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-gray-300 bg-transparent hover:bg-white hover:text-[#a78bfa] hover:border-[#a78bfa] transition-all duration-300 backdrop-blur-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 text-sm"
                >
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:text-[#a78bfa]" />
                  Browse Properties
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-gray-300 bg-transparent hover:bg-white hover:text-[#a78bfa] hover:border-[#a78bfa] transition-all duration-300 backdrop-blur-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:text-[#a78bfa]" />
                Share Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
