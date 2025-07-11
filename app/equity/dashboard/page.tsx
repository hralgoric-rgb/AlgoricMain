"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Zap, Brain, AlertCircle, CheckCircle, ArrowUpRight, PieChart, Activity, Filter, Download, Share2, RefreshCw, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "../components";
import { toast } from "sonner";

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
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Mouse tracking for animated background
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    toast.info("Refreshing analytics data...");
    
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update metrics with new data (simulated)
      const updatedMetrics = {
        ...mockMetrics,
        totalPortfolioValue: mockMetrics.totalPortfolioValue + Math.floor(Math.random() * 50000 - 25000),
        averageYield: Number((mockMetrics.averageYield + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        portfolioGrowth: Number((mockMetrics.portfolioGrowth + (Math.random() * 2 - 1)).toFixed(1)),
      };
      
      setMetrics(updatedMetrics);
      toast.success("Analytics data refreshed successfully!");
      
    } catch (error) {
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportReport = async () => {
    setExporting(true);
    toast.info("Generating comprehensive analytics report...");
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Generate comprehensive report content
      const reportContent = `
🏢 100GAJ EQUITY PLATFORM - ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
Timeframe: ${selectedTimeframe}
Analysis Type: ${selectedAnalysis.charAt(0).toUpperCase() + selectedAnalysis.slice(1)}

═══════════════════════════════════════════════════════════

📊 PORTFOLIO METRICS
═══════════════════════════════════════════════════════════
Total Portfolio Value: ₹${metrics?.totalPortfolioValue.toLocaleString()}
Total Investment: ₹${metrics?.totalInvestment.toLocaleString()}
Total Returns: ₹${metrics?.totalReturns.toLocaleString()}
Monthly Income: ₹${metrics?.monthlyIncome.toLocaleString()}
Average Yield: ${metrics?.averageYield.toFixed(1)}%
Portfolio Growth: +${metrics?.portfolioGrowth.toFixed(1)}%
Risk Score: ${metrics?.riskScore.toFixed(1)}/10
Diversification Score: ${metrics?.diversificationScore.toFixed(1)}/10
Liquidity Score: ${metrics?.liquidityScore.toFixed(1)}/10
Market Sentiment: ${metrics?.marketSentiment.toUpperCase()}

═══════════════════════════════════════════════════════════

🧠 MARKET INTELLIGENCE
═══════════════════════════════════════════════════════════
${marketInsights.map((insight, index) => `
${index + 1}. ${insight.title}
   Impact: ${insight.impact.toUpperCase()} (${insight.confidence}% confidence)
   Category: ${insight.category.toUpperCase()}
   Description: ${insight.description}
`).join('')}

═══════════════════════════════════════════════════════════

🔮 PREDICTIVE ANALYTICS
═══════════════════════════════════════════════════════════
${predictiveAnalysis.map((analysis, index) => `
${index + 1}. ${analysis.period}
   Expected Return: +${analysis.expectedReturn}%
   Confidence Level: ${analysis.confidence}%
   Risk Level: ${analysis.riskLevel.toUpperCase()}
   Recommendation: ${analysis.recommendation}
`).join('')}

═══════════════════════════════════════════════════════════

📈 PERFORMANCE SUMMARY
═══════════════════════════════════════════════════════════
✅ Portfolio performing 23% above market average
✅ Well-diversified across commercial property types
✅ Strong cash flow with consistent monthly income
✅ AI models indicate bullish market sentiment
⚠️  Consider diversifying into data centers for higher yields

═══════════════════════════════════════════════════════════

DISCLAIMER: This report is generated for informational purposes only. 
Past performance does not guarantee future results. All investments 
carry risk and may lose value.

© 2024 100GAJ Equity Platform. All rights reserved.
`;
      
      // Create and download the report
      const dataBlob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `100GAJ-Analytics-Report-${currentDate}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success("📊 Comprehensive analytics report downloaded successfully!");
      
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleShareAnalysis = async () => {
    setSharing(true);
    toast.info("Creating shareable analytics summary...");
    
    try {
      // Simulate generating shareable content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create shareable summary text
      const shareText = `🏢 My 100GAJ Portfolio Analytics

📊 Performance Highlights:
• Portfolio Value: ₹${metrics?.totalPortfolioValue.toLocaleString()}
• Average Yield: ${metrics?.averageYield.toFixed(1)}%
• Growth: +${metrics?.portfolioGrowth.toFixed(1)}%
• Risk Score: ${metrics?.riskScore.toFixed(1)}/10

💡 AI Insights:
• Portfolio performing 23% above market average
• Well-diversified across commercial properties
• Strong monthly income stream

🔮 Outlook: ${metrics?.marketSentiment === 'bullish' ? '📈 Bullish' : metrics?.marketSentiment === 'bearish' ? '📉 Bearish' : '➡️ Neutral'}

Generated: ${new Date().toLocaleDateString()}
Platform: 100GAJ Equity Investment

#RealEstate #Investment #Portfolio #100GAJ`;

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: '100GAJ Portfolio Analytics',
          text: shareText,
          url: window.location.href,
        });
        toast.success("🚀 Analytics shared successfully!");
      } else {
        // Fallback to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          toast.success("📋 Analytics summary copied to clipboard! You can now paste it anywhere to share.");
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success("📋 Analytics summary copied to clipboard! You can now paste it anywhere to share.");
        }
      }
      
      // Also provide an option to generate a shareable link
      setTimeout(() => {
        const shareableData = {
          metrics: {
            portfolioValue: metrics?.totalPortfolioValue,
            averageYield: metrics?.averageYield,
            riskScore: metrics?.riskScore,
            diversificationScore: metrics?.diversificationScore,
            portfolioGrowth: metrics?.portfolioGrowth
          },
          timeframe: selectedTimeframe,
          timestamp: new Date().toISOString(),
          type: 'analytics_share'
        };
        
        const encodedData = btoa(JSON.stringify(shareableData));
        const shareableUrl = `${window.location.origin}/equity/shared?data=${encodedData}`;
        
        // Show additional option
        toast.info("💡 Want a shareable link instead? Check your downloads for the report file!", {
          duration: 4000,
        });
      }, 2000);
      
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Failed to share analytics. Please try again.");
    } finally {
      setSharing(false);
    }
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(251, 146, 60, 0.10), transparent 70%)`,
            opacity: 0.25,
          }}
        />
        {/* Optional: Subtle grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:24px_24px] opacity-20" />
      </div>
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
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={handleExportReport}
                disabled={exporting}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : ''}`} />
                {exporting ? 'Generating...' : 'Export Report'}
              </Button>
              <Button
                onClick={handleShareAnalysis}
                disabled={sharing}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Share2 className={`w-4 h-4 mr-2 ${sharing ? 'animate-pulse' : ''}`} />
                {sharing ? 'Generating...' : 'Share Analysis'}
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
          <motion.div 
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20 relative overflow-hidden group"
            whileHover={{ scale: 1.02, y: -5 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(34, 197, 94, 0.3)",
                "0 0 40px rgba(34, 197, 94, 0.5)",
                "0 0 20px rgba(34, 197, 94, 0.3)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              hover: {
                type: "spring",
                stiffness: 300
              }
            }}
          >
            {/* Glowing border animation */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-green-400/0"
              animate={{
                borderColor: [
                  "rgba(34, 197, 94, 0)",
                  "rgba(34, 197, 94, 0.6)",
                  "rgba(34, 197, 94, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <DollarSign className="w-6 h-6 text-green-400" />
                </motion.div>
                <div className="text-right">
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ₹{metrics?.totalPortfolioValue.toLocaleString()}
                  </motion.div>
                  <div className="text-sm text-gray-400">Portfolio Value</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>+{metrics?.portfolioGrowth}% growth</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20 relative overflow-hidden group"
            whileHover={{ scale: 1.02, y: -5 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(249, 115, 22, 0.3)",
                "0 0 40px rgba(249, 115, 22, 0.5)",
                "0 0 20px rgba(249, 115, 22, 0.3)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              },
              hover: {
                type: "spring",
                stiffness: 300
              }
            }}
          >
            {/* Glowing border animation */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-orange-400/0"
              animate={{
                borderColor: [
                  "rgba(249, 115, 22, 0)",
                  "rgba(249, 115, 22, 0.6)",
                  "rgba(249, 115, 22, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Target className="w-6 h-6 text-orange-400" />
                </motion.div>
                <div className="text-right">
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    {metrics?.averageYield.toFixed(1)}%
                  </motion.div>
                  <div className="text-sm text-gray-400">Average Yield</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-orange-400">
                <ArrowUpRight className="w-4 h-4" />
                <span>Above market average</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 relative overflow-hidden group"
            whileHover={{ scale: 1.02, y: -5 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 40px rgba(147, 51, 234, 0.5)",
                "0 0 20px rgba(147, 51, 234, 0.3)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              },
              hover: {
                type: "spring",
                stiffness: 300
              }
            }}
          >
            {/* Glowing border animation */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-purple-400/0"
              animate={{
                borderColor: [
                  "rgba(147, 51, 234, 0)",
                  "rgba(147, 51, 234, 0.6)",
                  "rgba(147, 51, 234, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Brain className="w-6 h-6 text-purple-400" />
                </motion.div>
                <div className="text-right">
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    {metrics?.riskScore.toFixed(1)}/10
                  </motion.div>
                  <div className="text-sm text-gray-400">Risk Score</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-purple-400">
                <Activity className="w-4 h-4" />
                <span>Moderate risk</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20 relative overflow-hidden group"
            whileHover={{ scale: 1.02, y: -5 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              },
              hover: {
                type: "spring",
                stiffness: 300
              }
            }}
          >
            {/* Glowing border animation */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-blue-400/0"
              animate={{
                borderColor: [
                  "rgba(59, 130, 246, 0)",
                  "rgba(59, 130, 246, 0.6)",
                  "rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <PieChart className="w-6 h-6 text-blue-400" />
                </motion.div>
                <div className="text-right">
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  >
                    {metrics?.diversificationScore.toFixed(1)}/10
                  </motion.div>
                  <div className="text-sm text-gray-400">Diversification</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-400">
                <CheckCircle className="w-4 h-4" />
                <span>Well diversified</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Analysis Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8"
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative z-10">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {timeframes.map((timeframe) => (
                  <motion.button
                    key={timeframe.value}
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedTimeframe === timeframe.value
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {timeframe.label}
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    onClick={() => setSelectedAnalysis(type.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedAnalysis === type.value
                        ? "bg-purple-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
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
          <motion.div 
            className="bg-gray-900 rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.01, y: -3 }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Brain className="w-5 h-5 text-blue-400" />
                </motion.div>
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
                    className={`p-4 rounded-lg border ${getImpactColor(insight.impact)} relative overflow-hidden group/insight`}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{insight.title}</h4>
                        <div className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">
                          {insight.confidence}% confidence
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {insight.category}
                        </span>
                        <span className={`text-xs capitalize ${insight.impact === 'positive' ? 'text-green-400' : insight.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {insight.impact} impact
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Predictive Analysis */}
          <motion.div 
            className="bg-gray-900 rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.01, y: -3 }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Zap className="w-5 h-5 text-purple-400" />
                </motion.div>
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
                    className="p-4 bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden group/analysis"
                    whileHover={{ scale: 1.02, x: -5 }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{analysis.period}</h4>
                        <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(analysis.riskLevel)}`}>
                          {analysis.riskLevel} risk
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-400">Expected Return</div>
                          <motion.div 
                            className="text-lg font-bold text-green-400"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          >
                            +{analysis.expectedReturn}%
                          </motion.div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Confidence</div>
                          <motion.div 
                            className="text-lg font-bold text-white"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 + 0.5 }}
                          >
                            {analysis.confidence}%
                          </motion.div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">{analysis.recommendation}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Market Sentiment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900 rounded-xl p-6 border border-gray-700"
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Current Market Sentiment</h3>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className={`text-4xl font-bold ${getSentimentColor(metrics?.marketSentiment || "neutral")}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {metrics?.marketSentiment?.toUpperCase()}
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrendingUp className={`w-6 h-6 ${getSentimentColor(metrics?.marketSentiment || "neutral")}`} />
                    <span className="text-gray-400">Overall trend positive for commercial real estate</span>
                  </motion.div>
                </div>
              </div>
              <motion.div 
                className="text-right"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-sm text-gray-400 mb-1">Market Confidence</div>
                <div className="text-3xl font-bold text-green-400">87%</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
