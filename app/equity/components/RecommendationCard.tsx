"use client";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, Target, Star, ArrowRight, Brain, Lightbulb, AlertCircle, CheckCircle, Building2, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: string;
  type: "buy" | "hold" | "diversify" | "warning";
  title: string;
  description: string;
  propertyName?: string;
  location?: string;
  expectedReturn?: number;
  confidence: number;
  reason: string;
  actionText: string;
  actionLink: string;
}

export default function RecommendationCard() {
  const recommendations: Recommendation[] = [
    {
      id: "1",
      type: "buy",
      title: "High Growth Opportunity",
      description: "Data Center Facility in Mumbai shows exceptional potential based on cloud computing demand surge",
      propertyName: "Data Center Facility",
      location: "Mumbai, Maharashtra",
      expectedReturn: 22.3,
      confidence: 95,
      reason: "AI analysis indicates 78% increase in cloud demand in Mumbai region",
      actionText: "Invest Now",
      actionLink: "/equity/property/4"
    },
    {
      id: "2",
      type: "diversify",
      title: "Portfolio Diversification",
      description: "Consider adding industrial assets to reduce portfolio risk and increase stability",
      confidence: 87,
      reason: "Current portfolio heavily weighted in office buildings (67%)",
      actionText: "Browse Industrial",
      actionLink: "/equity/property?filter=industrial"
    },
    {
      id: "3",
      type: "hold",
      title: "Market Timing Alert",
      description: "Hold current retail investments as market shows signs of recovery in Q2",
      confidence: 82,
      reason: "Consumer spending patterns indicate 12% uptick in retail occupancy",
      actionText: "View Analysis",
      actionLink: "/equity/dashboard"
    },
    {
      id: "4",
      type: "warning",
      title: "Risk Assessment",
      description: "Warehouse sector showing volatility due to e-commerce policy changes",
      confidence: 91,
      reason: "New regulations may impact logistics real estate valuations",
      actionText: "Learn More",
      actionLink: "/equity/portfolio"
    }
  ];

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "buy": return {
        bg: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
        icon: "text-green-400",
        badge: "bg-green-500/20 text-green-400"
      };
      case "hold": return {
        bg: "from-blue-500/20 to-purple-500/20",
        border: "border-blue-500/30",
        icon: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-400"
      };
      case "diversify": return {
        bg: "from-orange-500/20 to-yellow-500/20",
        border: "border-orange-500/30",
        icon: "text-orange-400",
        badge: "bg-orange-500/20 text-orange-400"
      };
      case "warning": return {
        bg: "from-red-500/20 to-pink-500/20",
        border: "border-red-500/30",
        icon: "text-red-400",
        badge: "bg-red-500/20 text-red-400"
      };
      default: return {
        bg: "from-gray-500/20 to-gray-600/20",
        border: "border-gray-500/30",
        icon: "text-gray-400",
        badge: "bg-gray-500/20 text-gray-400"
      };
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "buy": return TrendingUp;
      case "hold": return Shield;
      case "diversify": return Target;
      case "warning": return AlertCircle;
      default: return Star;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
            <p className="text-gray-400">Personalized investment insights powered by machine learning</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap className="w-4 h-4 text-orange-400" />
          Updated 2 mins ago
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {recommendations.map((rec, index) => {
          const colors = getRecommendationColor(rec.type);
          const IconComponent = getRecommendationIcon(rec.type);
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${colors.bg} backdrop-blur-sm rounded-xl p-6 border ${colors.border} hover:border-opacity-60 transition-all duration-300 group`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center ${colors.icon}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {rec.title}
                    </h3>
                    <div className={`text-xs px-2 py-1 rounded-full ${colors.badge} capitalize`}>
                      {rec.type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Confidence</div>
                  <div className="text-lg font-bold text-white">{rec.confidence}%</div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
                
                {/* Property Details (if applicable) */}
                {rec.propertyName && (
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{rec.propertyName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{rec.location}</span>
                    </div>
                  </div>
                )}

                {/* Expected Return */}
                {rec.expectedReturn && (
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Expected Return: </span>
                    <span className="text-sm font-semibold text-green-400">+{rec.expectedReturn}%</span>
                  </div>
                )}

                {/* Reason */}
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-400" />
                  <span>{rec.reason}</span>
                </div>
              </div>

              {/* Action Button */}
              <Link href={rec.actionLink}>
                <Button
                  size="sm"
                  className={`w-full ${colors.icon} hover:bg-white hover:text-black transition-all duration-300 group-hover:transform group-hover:scale-105`}
                >
                  {rec.actionText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Market Intelligence Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">78%</div>
            <div className="text-xs text-gray-400">Market Opportunity Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">4.2</div>
            <div className="text-xs text-gray-400">Risk-Adjusted Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">92%</div>
            <div className="text-xs text-gray-400">Prediction Accuracy</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mb-4">
          Our AI model analyzes 150+ market indicators, property fundamentals, and economic trends to provide personalized recommendations. 
          Current market sentiment is <span className="text-green-400 font-semibold">bullish</span> for commercial real estate.
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>Next update in 24 hours</span>
        </div>
      </motion.div>
    </div>
  );
}
