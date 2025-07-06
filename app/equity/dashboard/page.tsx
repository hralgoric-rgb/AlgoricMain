"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaChartLine, 
  FaBuilding, 
  FaWallet, 
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPlus,
  FaBell,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPercentage
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EquityNavbar from "../components/EquityNavbar";

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    totalInvestment: 250000,
    totalValue: 285000,
    totalReturns: 35000,
    portfolioCount: 8
  });

  const [portfolioData] = useState([
    {
      id: 1,
      name: "Phoenix Business Center",
      location: "Gurgaon, Haryana",
      investment: 50000,
      currentValue: 58000,
      shares: 25,
      totalShares: 1000,
      roi: 16.0,
      monthlyIncome: 2400,
      image: "/images/property1.jpg"
    },
    {
      id: 2,
      name: "Marina Bay Offices",
      location: "Mumbai, Maharashtra",
      investment: 75000,
      currentValue: 82000,
      shares: 50,
      totalShares: 1500,
      roi: 9.3,
      monthlyIncome: 3200,
      image: "/images/property2.jpg"
    },
    {
      id: 3,
      name: "Tech Hub Complex",
      location: "Bangalore, Karnataka",
      investment: 60000,
      currentValue: 68000,
      shares: 30,
      totalShares: 1200,
      roi: 13.3,
      monthlyIncome: 2800,
      image: "/images/property3.jpg"
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "purchase",
      property: "Phoenix Business Center",
      amount: 10000,
      shares: 5,
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      type: "dividend",
      property: "Marina Bay Offices",
      amount: 3200,
      date: "2024-01-10",
      status: "received"
    },
    {
      id: 3,
      type: "sale",
      property: "Tech Hub Complex",
      amount: 8000,
      shares: 4,
      date: "2024-01-08",
      status: "completed"
    }
  ]);

  const [recommendations] = useState([
    {
      id: 4,
      name: "Cyber Park Tower",
      location: "Noida, Uttar Pradesh",
      expectedRoi: 14.5,
      monthlyIncome: 3500,
      minInvestment: 25000,
      totalShares: 2000,
      availableShares: 1200,
      image: "/images/property4.jpg",
      category: "Commercial"
    },
    {
      id: 5,
      name: "Green Valley Mall",
      location: "Pune, Maharashtra",
      expectedRoi: 11.8,
      monthlyIncome: 4200,
      minInvestment: 50000,
      totalShares: 3000,
      availableShares: 800,
      image: "/images/property5.jpg",
      category: "Retail"
    }
  ]);

  const calculatePortfolioMetrics = () => {
    const totalInvestment = portfolioData.reduce((sum, item) => sum + item.investment, 0);
    const totalCurrentValue = portfolioData.reduce((sum, item) => sum + item.currentValue, 0);
    const totalReturns = totalCurrentValue - totalInvestment;
    const avgRoi = portfolioData.reduce((sum, item) => sum + item.roi, 0) / portfolioData.length;
    const totalMonthlyIncome = portfolioData.reduce((sum, item) => sum + item.monthlyIncome, 0);
    
    return {
      totalInvestment,
      totalCurrentValue,
      totalReturns,
      avgRoi,
      totalMonthlyIncome
    };
  };

  const metrics = calculatePortfolioMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <EquityNavbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {user.name}
                </h1>
                <p className="text-gray-400 text-lg">
                  Here&apos;s your portfolio overview
                </p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <FaBell className="mr-2" />
                  Notifications
                </Button>
                <Link href="/equity/properties">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <FaPlus className="mr-2" />
                    Invest Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Investment</CardTitle>
                <FaWallet className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ₹{metrics.totalInvestment.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Across {portfolioData.length} properties
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Current Value</CardTitle>
                <FaChartLine className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ₹{metrics.totalCurrentValue.toLocaleString()}
                </div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <FaArrowUp className="mr-1" />
                  +{((metrics.totalCurrentValue - metrics.totalInvestment) / metrics.totalInvestment * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Returns</CardTitle>
                <FaPercentage className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ₹{metrics.totalReturns.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Avg ROI: {metrics.avgRoi.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Monthly Income</CardTitle>
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ₹{metrics.totalMonthlyIncome.toLocaleString()}
                </div>
                <p className="text-xs text-blue-500 mt-1">
                  Next payout in 5 days
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Overview */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-white">Your Portfolio</CardTitle>
                    <Link href="/equity/portfolio">
                      <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/equity/properties/${property.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                            <FaBuilding className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{property.name}</h3>
                            <p className="text-gray-400 text-sm flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              {property.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            ₹{property.currentValue.toLocaleString()}
                          </p>
                          <p className="text-sm flex items-center text-green-500">
                            <FaArrowUp className="mr-1" />
                            +{property.roi.toFixed(1)}%
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity & Recommendations */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'purchase' ? 'bg-green-500' : 
                            activity.type === 'sale' ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            {activity.type === 'purchase' ? <FaPlus className="text-white text-xs" /> :
                             activity.type === 'sale' ? <FaArrowDown className="text-white text-xs" /> :
                             <FaWallet className="text-white text-xs" />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {activity.type === 'purchase' ? 'Bought' : 
                               activity.type === 'sale' ? 'Sold' : 'Dividend'}
                            </p>
                            <p className="text-gray-400 text-xs">{activity.property}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            activity.type === 'sale' || activity.type === 'dividend' ? 'text-green-500' : 'text-white'
                          }`}>
                            {activity.type === 'sale' || activity.type === 'dividend' ? '+' : '-'}₹{activity.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.slice(0, 2).map((property) => (
                      <div key={property.id} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white text-sm">{property.name}</h3>
                          <Badge variant="outline" className="border-orange-500 text-orange-500 text-xs">
                            {property.category}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs mb-2 flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {property.location}
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-green-500 text-sm font-semibold">
                              {property.expectedRoi}% ROI
                            </p>
                            <p className="text-gray-400 text-xs">
                              Min: ₹{property.minInvestment.toLocaleString()}
                            </p>
                          </div>
                          <Link href={`/equity/properties/${property.id}`}>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                              <FaEye className="mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/equity/properties">
                      <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                        View All Properties
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
