"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  FaCheckCircle, 
  FaBuilding, 
  FaDownload, 
  FaShare,
  FaEye,
  FaChartLine,
  FaCalendarAlt,
  FaReceipt,
  FaArrowRight,
  FaHome,
  FaUser
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";
import EquityNavbar from "../components/EquityNavbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [transactionData, setTransactionData] = useState({
    id: "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    type: searchParams?.get("type") || "purchase",
    propertyName: searchParams?.get("property") || "Phoenix Business Center",
    location: "Gurgaon, Haryana",
    shares: parseInt(searchParams?.get("shares") || "10"),
    pricePerShare: parseInt(searchParams?.get("price") || "50000"),
    totalAmount: parseInt(searchParams?.get("amount") || "500000"),
    date: new Date().toISOString(),
    status: "Completed",
    paymentMethod: "Credit Card",
    expectedIncome: 4200,
    expectedROI: 16.5
  });
  setTransactionData(transactionData)
  const [showCelebration, setShowCelebration] = useState(false);
  console.log(showCelebration);
  useEffect(() => {
    // Trigger confetti animation
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b35', '#f7931e', '#ffd700']
      });
    };

    triggerConfetti();
    setShowCelebration(true);

    // Trigger more confetti after a delay
    setTimeout(() => {
      triggerConfetti();
    }, 500);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeText = () => {
    switch (transactionData.type) {
      case "purchase":
        return "Investment Successful!";
      case "sale":
        return "Sale Completed!";
      case "trade":
        return "Trade Successful!";
      default:
        return "Transaction Completed!";
    }
  };

  const getTransactionMessage = () => {
    switch (transactionData.type) {
      case "purchase":
        return "Congratulations! You've successfully invested in premium real estate. Your shares have been added to your portfolio.";
      case "sale":
        return "Your shares have been successfully sold. The proceeds will be transferred to your account within 2-3 business days.";
      case "trade":
        return "Your trade has been completed successfully. Your portfolio has been updated with the new holdings.";
      default:
        return "Your transaction has been processed successfully.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <EquityNavbar />
      
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.5, 1],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center"
            >
              <FaCheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {getTransactionTypeText()}
            </CardTitle>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              {getTransactionMessage()}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Summary */}
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FaReceipt className="w-5 h-5 mr-2 text-orange-500" />
                Transaction Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Transaction ID</p>
                  <p className="text-white font-mono font-semibold">{transactionData.id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="text-white font-semibold">{formatDate(transactionData.date)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <Badge className="bg-green-500/20 text-green-400">{transactionData.status}</Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <p className="text-white font-semibold">{transactionData.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <FaBuilding className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{transactionData.propertyName}</h4>
                      <p className="text-gray-400 text-sm">{transactionData.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{formatCurrency(transactionData.totalAmount)}</p>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                  <div>
                    <p className="text-gray-400 text-sm">Shares</p>
                    <p className="text-white font-semibold">{transactionData.shares}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Price per Share</p>
                    <p className="text-white font-semibold">{formatCurrency(transactionData.pricePerShare)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Projections (for purchases) */}
            {transactionData.type === "purchase" && (
              <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaChartLine className="w-5 h-5 mr-2 text-orange-500" />
                  Investment Projections
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Expected Monthly Income</p>
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(transactionData.expectedIncome)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Expected Annual ROI</p>
                    <p className="text-2xl font-bold text-orange-500">{transactionData.expectedROI}%</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-4 text-center">
                  * Projections are based on historical data and market analysis. Actual returns may vary.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/equity/properties/${transactionData.id}`} className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  View Property Details
                </Button>
              </Link>
              <Link href="/equity/portfolio" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <FaUser className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
              </Link>
            </div>

            {/* Additional Actions */}
            <div className="flex justify-center space-x-4 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                <FaDownload className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                <FaShare className="w-4 h-4 mr-2" />
                Share Success
              </Button>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <FaCalendarAlt className="w-5 h-5 mr-2 text-blue-500" />
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <FaArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                  <span>You&apos;ll receive monthly income distributions directly to your account</span>
                </li>
                <li className="flex items-start">
                  <FaArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                  <span>Track your investment performance in real-time through your dashboard</span>
                </li>
                <li className="flex items-start">
                  <FaArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                  <span>Receive quarterly property updates and annual reports</span>
                </li>
                <li className="flex items-start">
                  <FaArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                  <span>You can trade your shares anytime on our secondary marketplace</span>
                </li>
              </ul>
            </div>

            {/* Return to Dashboard */}
            <div className="text-center">
              <Link href="/equity/dashboard">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg">
                  <FaHome className="w-5 h-5 mr-2" />
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
