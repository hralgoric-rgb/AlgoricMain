"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Zap, Brain, AlertCircle, CheckCircle, ArrowUpRight, PieChart, Activity, Filter, Download, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "../components";

interface DashboardMetrics {
  totalPortfolioValue: number;
  totalInvestment: number;
  totalReturns: number;
  monthlyIncome: number;
  averageYield: number;
  portfolioGrowth: number;
  riskScore: number;
  diversificationScore: number;
  liquidityScore: number;
  marketSentiment: "bullish" | "bearish" | "neutral";
}

interface MarketInsight {
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  confidence: number;
  category: "market" | "property" | "economic" | "regulatory";
}

interface PredictiveAnalysis {
  period: string;
  expectedReturn: number;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");
  const [selectedAnalysis, setSelectedAnalysis] = useState("performance");
  const [refreshing, setRefreshing] = useState(false);

  const mockMetrics: DashboardMetrics = {
    totalPortfolioValue: 1275000,
    totalInvestment: 950000,
    totalReturns: 325000,
    monthlyIncome: 28750,
    averageYield: 9.2,
    portfolioGrowth: 15.8,
    riskScore: 7.2,
    diversificationScore: 8.5,
    liquidityScore: 6.8,
    marketSentiment: "bullish"
  };

  const marketInsights: MarketInsight[] = [
    {
      title: "Commercial Real Estate Demand Surge",
      description: "Office space demand increased 23% in tier-1 cities driven by hybrid work models",
      impact: "positive",
      confidence: 89,
      category: "market"
    },
    {
      title: "Data Center Expansion",
      description: "Cloud infrastructure investments expected to grow 35% in next 12 months",
      impact: "positive",
      confidence: 94,
      category: "property"
    },
    {
      title: "Interest Rate Stability",
      description: "RBI maintains steady rates, favorable for real estate financing",
      impact: "positive",
      confidence: 82,
      category: "economic"
    },
    {
      title: "REIT Regulations Update",
      description: "New SEBI guidelines may impact small investor participation",
      impact: "neutral",
      confidence: 76,
      category: "regulatory"
    }
  ];

  const predictiveAnalysis: PredictiveAnalysis[] = [
    {
      period: "Next 3 Months",
      expectedReturn: 4.2,
      confidence: 87,
      riskLevel: "low",
      recommendation: "Hold current positions, monitor market conditions"
    },
    {
      period: "Next 6 Months",
      expectedReturn: 8.7,
      confidence: 82,
      riskLevel: "medium",
      recommendation: "Consider increasing data center allocation"
    },
    {
      period: "Next 12 Months",
      expectedReturn: 18.3,
      confidence: 78,
      riskLevel: "medium",
      recommendation: "Diversify into warehouse and logistics properties"
    }
  ];

  const timeframes = [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
    { value: "ALL", label: "All Time" }
  ];

  const analysisTypes = [
    { value: "performance", label: "Performance Analysis" },
    { value: "risk", label: "Risk Assessment" },
    { value: "predictions", label: "Predictive Analytics" },
    { value: "market", label: "Market Intelligence" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "negative": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "neutral": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 bg-green-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "high": return "text-red-400 bg-red-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-400";
      case "bearish": return "text-red-400";
      case "neutral": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading analytics dashboard...</p>
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
                Analytics
                <span className="text-orange-500 ml-2">Dashboard</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Advanced insights and predictive analytics for your portfolio
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
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
                Share Analysis
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">₹{metrics?.totalPortfolioValue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Portfolio Value</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>+{metrics?.portfolioGrowth}% growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{metrics?.averageYield.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Average Yield</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-orange-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>Above market average</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{metrics?.riskScore.toFixed(1)}/10</div>
                <div className="text-sm text-gray-400">Risk Score</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-400">
              <Activity className="w-4 h-4" />
              <span>Moderate risk</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{metrics?.diversificationScore.toFixed(1)}/10</div>
                <div className="text-sm text-gray-400">Diversification</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-blue-400">
              <CheckCircle className="w-4 h-4" />
              <span>Well diversified</span>
            </div>
          </div>
        </motion.div>

        {/* Analysis Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.value}
                  onClick={() => setSelectedTimeframe(timeframe.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedTimeframe === timeframe.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedAnalysis(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedAnalysis === type.value
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <PerformanceChart />
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Market Intelligence */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Market Intelligence</h3>
                <p className="text-gray-400 text-sm">AI-powered market insights</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {marketInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-lg border ${getImpactColor(insight.impact)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <div className="text-xs px-2 py-1 bg-black/20 rounded-full text-gray-400">
                      {insight.confidence}% confidence
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                      {insight.category}
                    </span>
                    <span className={`text-xs capitalize ${insight.impact === 'positive' ? 'text-green-400' : insight.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {insight.impact} impact
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Predictive Analysis */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Predictive Analytics</h3>
                <p className="text-gray-400 text-sm">Future performance forecasts</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {predictiveAnalysis.map((analysis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-black/20 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{analysis.period}</h4>
                    <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel} risk
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-400">Expected Return</div>
                      <div className="text-lg font-bold text-green-400">+{analysis.expectedReturn}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Confidence</div>
                      <div className="text-lg font-bold text-white">{analysis.confidence}%</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">{analysis.recommendation}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Market Sentiment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Market Sentiment Analysis</h3>
                <p className="text-gray-400 text-sm">Overall market conditions and sentiment</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold capitalize ${getSentimentColor(metrics?.marketSentiment || 'neutral')}`}>
                {metrics?.marketSentiment}
              </div>
              <div className="text-sm text-gray-400">Market Sentiment</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">78%</div>
              <div className="text-sm text-gray-400">Positive Indicators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-2">15%</div>
              <div className="text-sm text-gray-400">Neutral Indicators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-2">7%</div>
              <div className="text-sm text-gray-400">Negative Indicators</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
