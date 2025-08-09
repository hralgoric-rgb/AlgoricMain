"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
	TrendingUp,
	TrendingDown,
	Target,
	Eye,
	Download,
	Share2,
	Zap,
	BarChart3,
	Activity,
	Grid3X3,
	List,
	Plus,
	Shield,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortfolioSummary } from "../components";
import { AuthModal } from "../components";
import EquityNavigation from "../components/EquityNavigation";

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
	const [portfolioProperties, setPortfolioProperties] = useState<
		PortfolioProperty[]
	>([]);
	const [portfolioMetrics, setPortfolioMetrics] =
		useState<PortfolioMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [sortBy, setSortBy] = useState("value");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showAuthModal, setShowAuthModal] = useState(false);

	const filterOptions = [
		{ value: "all", label: "All Properties" },
		{ value: "positive", label: "Positive Returns" },
		{ value: "negative", label: "Negative Returns" },
		{ value: "high-yield", label: "High Yield (>9%)" },
		{ value: "low-risk", label: "Low Risk" },
		{ value: "medium-risk", label: "Medium Risk" },
		{ value: "high-risk", label: "High Risk" },
	];

	const sortOptions = [
		{ value: "value", label: "Current Value" },
		{ value: "returns", label: "Total Returns" },
		{ value: "percentage", label: "Return %" },
		{ value: "income", label: "Monthly Income" },
		{ value: "yield", label: "Current Yield" },
		{ value: "aiScore", label: "AI Score" },
	];

	useEffect(() => {
		const token =
			typeof window !== "undefined"
				? sessionStorage.getItem("authToken") ||
				  localStorage.getItem("authToken")
				: null;

		if (!token) {
			setShowAuthModal(true);
			setIsLoading(false);
			return;
		}

		// Only fetch portfolio data if authenticated
		setShowAuthModal(false);
		const fetchPortfolioData = async () => {
			try {
				// Get user profile for authentication
				const profileResponse = await axios.get("/api/users/profile");
				if (!profileResponse.data.user) {
					// User not authenticated - set empty data
					setPortfolioMetrics({
						totalValue: 0,
						totalInvestment: 0,
						totalReturns: 0,
						monthlyIncome: 0,
						properties: 0,
						totalShares: 0,
						averageYield: 0,
						bestPerformer: "",
						worstPerformer: "",
					});
					setPortfolioProperties([]);
					setIsLoading(false);
					return;
				}

				// Fetch portfolio summary
				const [summaryResponse, holdingsResponse] = await Promise.all([
					axios.get("/api/portfolio/summary"),
					axios.get("/api/portfolio/holdings"),
				]);

				// Transform API data to match component interface
				const apiSummary = summaryResponse.data.summary;
				const apiHoldings = holdingsResponse.data.holdings;

				// Map summary data - use zeros/empty strings for missing fields
				const transformedMetrics: PortfolioMetrics = {
					totalValue: apiSummary.totalValue || 0,
					totalInvestment: apiSummary.totalInvestment || 0,
					totalReturns: apiSummary.totalReturns || 0,
					monthlyIncome: apiSummary.monthlyIncome || 0,
					properties: apiSummary.properties || 0,
					totalShares: apiSummary.totalShares || 0,
					averageYield: apiSummary.averageYield || 0,
					bestPerformer: apiSummary.bestPerformer || "",
					worstPerformer: apiSummary.worstPerformer || "",
				};

				// Map holdings data - only use API data, empty/zero for missing fields
				const transformedProperties: PortfolioProperty[] = apiHoldings.map(
					(holding: any) => ({
						id: holding._id || `holding-${Date.now()}-${Math.random()}`,
						name: holding.property?.title || holding.propertyId || "",
						type: holding.property?.type || "",
						location: holding.property?.location || "",
						sharesOwned: holding.shares || 0,
						totalShares: holding.property?.totalShares || 0,
						pricePerShare: holding.pricePerShare || 0,
						currentValue: holding.currentValue || 0,
						initialInvestment: holding.initialInvestment || 0,
						currentYield: holding.currentYield || 0,
						monthlyIncome: holding.monthlyIncome || 0,
						totalReturns: holding.totalReturns || 0,
						returnPercentage: holding.returnPercentage || 0,
						lastUpdated: holding.lastUpdated || new Date().toISOString(),
						riskLevel: holding.riskLevel || "Medium",
						occupancyRate: holding.occupancyRate || 0,
						aiScore: holding.aiScore || 0,
						performance:
							holding.returnPercentage > 5
								? "positive"
								: holding.returnPercentage < -2
								? "negative"
								: "neutral",
					})
				);

				setPortfolioMetrics(transformedMetrics);
				setPortfolioProperties(transformedProperties);
				setIsLoading(false);
			} catch {
				// API failed - set empty data instead of mock data
				setPortfolioMetrics({
					totalValue: 0,
					totalInvestment: 0,
					totalReturns: 0,
					monthlyIncome: 0,
					properties: 0,
					totalShares: 0,
					averageYield: 0,
					bestPerformer: "",
					worstPerformer: "",
				});
				setPortfolioProperties([]);
				setIsLoading(false);
			}
		};

		fetchPortfolioData();
	}, []);

	const filteredProperties = portfolioProperties
		.filter((property) => {
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
		})
		.sort((a, b) => {
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
			case "Low":
				return "text-green-400 bg-green-500/10";
			case "Medium":
				return "text-yellow-400 bg-yellow-500/10";
			case "High":
				return "text-red-400 bg-red-500/10";
			default:
				return "text-gray-400 bg-gray-500/10";
		}
	};

	const getPerformanceColor = (performance: string) => {
		switch (performance) {
			case "positive":
				return "text-green-400";
			case "negative":
				return "text-red-400";
			case "neutral":
				return "text-gray-400";
			default:
				return "text-gray-400";
		}
	};

	const getPerformanceIcon = (performance: string) => {
		switch (performance) {
			case "positive":
				return TrendingUp;
			case "negative":
				return TrendingDown;
			case "neutral":
				return Activity;
			default:
				return Activity;
		}
	};

	const handleAuthSuccess = () => {
		setShowAuthModal(false);
		// Reload the page to fetch portfolio data with the new auth token
		window.location.reload();
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-black flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
					<p className='text-white text-lg'>Loading your portfolio...</p>
				</div>
			</div>
		);
	}

	// Block access completely if not authenticated - only show auth modal
	if (showAuthModal) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] relative overflow-hidden'>
				{/* Animated Background Elements */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse'></div>
					<div className='absolute top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full opacity-15 blur-2xl animate-bounce'></div>
					<div className='absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse'></div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-5 blur-3xl animate-spin'></div>
				</div>

				<EquityNavigation />

				<div className='container mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24 relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)]'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='max-w-sm sm:max-w-md mx-auto text-center'
					>
						<div className='backdrop-blur-xl bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl'>
							<Shield className='w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-3 sm:mb-4' />
							<h1 className='text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent'>
								Authentication Required
							</h1>
							<p className='text-purple-200 mb-4 sm:mb-6 text-sm sm:text-base'>
								Please sign in to access your portfolio dashboard
							</p>
							<Button
								onClick={() => setShowAuthModal(true)}
								className='backdrop-blur-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/25 text-sm sm:text-base'
							>
								Sign In
							</Button>
						</div>
					</motion.div>
				</div>

				{/* Auth Modal - Only UI element accessible when not authenticated */}
				<AuthModal
					isOpen={showAuthModal}
					onClose={() => {
						// Prevent closing modal when not authenticated - redirect to home instead
						window.location.href = "/equity";
					}}
					onAuthSuccess={handleAuthSuccess}
				/>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-black'>
			<EquityNavigation />

			{/* Header */}
			<div className='bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 pt-16 sm:pt-20'>
				<div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0'
					>
						<div className='w-full lg:w-auto'>
							<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2'>
								My Portfolio
								<span className='text-orange-500 ml-2'>Dashboard</span>
							</h1>
							<p className='text-gray-300 text-sm sm:text-base lg:text-lg'>
								Track your commercial real estate investments and performance
							</p>
						</div>
						<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto'>
							<Button
								variant='outline'
								className='border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base px-3 sm:px-4 py-2'
							>
								<Download className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
								Export Report
							</Button>
							<Button
								variant='outline'
								className='border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base px-3 sm:px-4 py-2'
							>
								<Share2 className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
								Share Portfolio
							</Button>
						</div>
					</motion.div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
				{/* Portfolio Summary */}
				{portfolioMetrics && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='mb-6 sm:mb-8'
					>
						<PortfolioSummary portfolio={portfolioMetrics} />
					</motion.div>
				)}

				{/* Filters and Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-800 mb-6 sm:mb-8'
				>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6'>
						{/* Filter */}
						<div className='sm:col-span-2 lg:col-span-1'>
							<label className='block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2'>
								Filter Properties
							</label>
							<select
								value={selectedFilter}
								onChange={(e) => setSelectedFilter(e.target.value)}
								className='w-full bg-black/40 border border-gray-700 rounded-lg px-2 sm:px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-orange-500'
							>
								{filterOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* Sort */}
						<div className='sm:col-span-2 lg:col-span-1'>
							<label className='block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2'>
								Sort By
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='w-full bg-black/40 border border-gray-700 rounded-lg px-2 sm:px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-orange-500'
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* View Mode */}
						<div className='sm:col-span-1 lg:col-span-1'>
							<label className='block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2'>
								View Mode
							</label>
							<div className='flex gap-1 sm:gap-2'>
								<button
									onClick={() => setViewMode("grid")}
									className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
										viewMode === "grid"
											? "bg-orange-500 text-white"
											: "bg-gray-800 text-gray-300 hover:bg-gray-700"
									}`}
								>
									<Grid3X3 className='w-3 h-3 sm:w-4 sm:h-4' />
									<span className='hidden xs:inline'>Grid</span>
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
										viewMode === "list"
											? "bg-orange-500 text-white"
											: "bg-gray-800 text-gray-300 hover:bg-gray-700"
									}`}
								>
									<List className='w-3 h-3 sm:w-4 sm:h-4' />
									<span className='hidden xs:inline'>List</span>
								</button>
							</div>
						</div>

						{/* Add Investment */}
						<div className='sm:col-span-1 lg:col-span-1'>
							<label className='block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2'>
								Actions
							</label>
							<Link href='/equity/property'>
								<Button className='w-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-2'>
									<Plus className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
									<span className='hidden xs:inline'>Add Investment</span>
									<span className='xs:hidden'>Add</span>
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
					<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0'>
						<h2 className='text-xl sm:text-2xl font-bold text-white'>
							Your Properties
							<span className='text-orange-500 ml-2'>
								({filteredProperties.length})
							</span>
						</h2>
					</div>

					{filteredProperties.length > 0 ? (
						<div
							className={`grid gap-4 sm:gap-6 ${
								viewMode === "grid"
									? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
									: "grid-cols-1"
							}`}
						>
							{filteredProperties.map((property, index) => {
								const PerformanceIcon = getPerformanceIcon(
									property.performance
								);

								return (
									<motion.div
										key={property.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className='bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 p-4 sm:p-6'
									>
										{/* Header */}
										<div className='flex items-start justify-between mb-3 sm:mb-4'>
											<div className='min-w-0 flex-1 mr-3'>
												<h3 className='text-base sm:text-lg font-bold text-white mb-1 break-words'>
													{property.name || "Unnamed Property"}
												</h3>
												<div className='text-xs sm:text-sm text-gray-400 break-words'>
													{property.location || "Location not specified"}
												</div>
											</div>
											<div className='flex items-center gap-2 flex-shrink-0'>
												<div
													className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(
														property.riskLevel
													)}`}
												>
													{property.riskLevel}
												</div>
											</div>
										</div>

										{/* Investment Details */}
										<div className='grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4'>
											<div className='bg-black/40 rounded-lg p-2 sm:p-3'>
												<div className='text-lg sm:text-xl font-bold text-white mb-1 break-all'>
													₹{property.currentValue.toLocaleString()}
												</div>
												<div className='text-xs text-gray-400'>
													Current Value
												</div>
											</div>
											<div className='bg-black/40 rounded-lg p-2 sm:p-3'>
												<div
													className={`text-lg sm:text-xl font-bold mb-1 ${getPerformanceColor(
														property.performance
													)}`}
												>
													{property.returnPercentage > 0 ? "+" : ""}
													{property.returnPercentage.toFixed(1)}%
												</div>
												<div className='text-xs text-gray-400'>Return</div>
											</div>
										</div>

										{/* Shares Info */}
										<div className='mb-3 sm:mb-4'>
											<div className='flex justify-between items-center mb-2'>
												<span className='text-xs sm:text-sm text-gray-400'>
													Shares Owned
												</span>
												<span className='text-xs sm:text-sm font-semibold text-white break-all'>
													{property.sharesOwned} /{" "}
													{property.totalShares.toLocaleString()}
												</span>
											</div>
											<div className='text-xs sm:text-sm text-gray-400 mb-2'>
												Ownership:{" "}
												{property.totalShares > 0
													? (
															(property.sharesOwned / property.totalShares) *
															100
													  ).toFixed(3)
													: "0.000"}
												%
											</div>
										</div>

										{/* Performance Metrics */}
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm'>
											<div className='flex items-center justify-between bg-black/20 rounded-lg p-2'>
												<span className='text-gray-400'>Monthly Income</span>
												<span className='text-green-400 font-semibold break-all'>
													₹{property.monthlyIncome.toLocaleString()}
												</span>
											</div>
											<div className='flex items-center justify-between bg-black/20 rounded-lg p-2'>
												<span className='text-gray-400'>Current Yield</span>
												<span className='text-orange-400 font-semibold'>
													{property.currentYield}%
												</span>
											</div>
											<div className='flex items-center justify-between bg-black/20 rounded-lg p-2'>
												<span className='text-gray-400'>Total Returns</span>
												<span
													className={`font-semibold break-all ${getPerformanceColor(
														property.performance
													)}`}
												>
													{property.totalReturns > 0 ? "+" : ""}₹
													{property.totalReturns.toLocaleString()}
												</span>
											</div>
											<div className='flex items-center justify-between bg-black/20 rounded-lg p-2'>
												<span className='text-gray-400'>AI Score</span>
												<span className='text-purple-400 font-semibold'>
													{property.aiScore}
												</span>
											</div>
										</div>

										{/* Action Buttons */}
										<div className='flex flex-col sm:flex-row gap-2'>
											<Link
												href={`/equity/property/${property.id}`}
												className='flex-1'
											>
												<Button
													size='sm'
													className='w-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm py-2'
												>
													<Eye className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
													View Details
												</Button>
											</Link>
											<Button
												size='sm'
												variant='outline'
												className='border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white sm:w-auto w-full'
											>
												<BarChart3 className='w-3 h-3 sm:w-4 sm:h-4' />
											</Button>
										</div>

										{/* Performance Indicator */}
										<div className='mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm'>
											<PerformanceIcon
												className={`w-3 h-3 sm:w-4 sm:h-4 ${getPerformanceColor(
													property.performance
												)}`}
											/>
											<span className='text-gray-400'>
												{property.performance === "positive"
													? "Outperforming"
													: property.performance === "negative"
													? "Underperforming"
													: "Stable"}
											</span>
										</div>
									</motion.div>
								);
							})}
						</div>
					) : (
						<div className='text-center py-8 sm:py-12'>
							<Target className='w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4' />
							<h3 className='text-lg sm:text-xl font-semibold text-white mb-2'>
								{selectedFilter === "all"
									? "No properties in your portfolio"
									: "No properties match your filter"}
							</h3>
							<p className='text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4'>
								{selectedFilter === "all"
									? "Start building your portfolio by adding your first property investment."
									: "Try adjusting your filter criteria to see more properties."}
							</p>
							{selectedFilter === "all" ? (
								<Link href='/equity/property'>
									<Button className='bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3'>
										<Plus className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
										Browse Properties
									</Button>
								</Link>
							) : (
								<Button
									onClick={() => setSelectedFilter("all")}
									className='bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3'
								>
									Show All Properties
								</Button>
							)}
						</div>
					)}
				</motion.div>

				{/* Portfolio Insights */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className='mt-8 sm:mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 sm:p-6 border border-purple-500/20'
				>
					<div className='flex items-center gap-3 mb-3 sm:mb-4'>
						<div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center'>
							<Zap className='w-4 h-4 sm:w-5 sm:h-5 text-purple-400' />
						</div>
						<h3 className='text-lg sm:text-xl font-bold text-white'>Portfolio Insights</h3>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
						<div>
							<h4 className='text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3'>
								Performance Summary
							</h4>
							<div className='space-y-2 text-xs sm:text-sm'>
								<div className='flex justify-between items-center'>
									<span className='text-gray-400'>Best Performer:</span>
									<span className='text-green-400 font-semibold break-all text-right ml-2'>
										{portfolioMetrics?.bestPerformer}
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-gray-400'>Worst Performer:</span>
									<span className='text-red-400 font-semibold break-all text-right ml-2'>
										{portfolioMetrics?.worstPerformer}
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-gray-400'>Average Yield:</span>
									<span className='text-orange-400 font-semibold'>
										{portfolioMetrics?.averageYield.toFixed(1)}%
									</span>
								</div>
							</div>
						</div>

						<div>
							<h4 className='text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3'>
								AI Recommendations
							</h4>
							<div className='text-xs sm:text-sm text-gray-300 leading-relaxed'>
								Consider rebalancing your portfolio by reducing retail exposure
								and increasing data center investments for better risk-adjusted
								returns.
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
