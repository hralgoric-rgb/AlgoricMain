"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaChartLine, 
  FaArrowUp,
  FaEye,
  FaDownload,
  FaExchangeAlt,
  FaDollarSign,

  
  FaWallet,
  FaTrophy,
  FaUsers,
  
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EquityNavbar from "../components/EquityNavbar";


export default function PortfolioPage() {
  const [user] = useState({
    name: "John Doe",
    totalInvestment: 350000,
    totalValue: 410000,
    totalReturns: 60000,
    monthlyIncome: 12400,
    portfolioCount: 5,
    joinDate: "2024-01-15"
  });
  
  const [portfolioData] = useState([
    {
      id: 1,
      name: "Phoenix Business Center",
      location: "Gurgaon, Haryana",
      type: "Office Complex",
      investment: 100000,
      currentValue: 118000,
      shares: 50,
      totalShares: 1000,
      sharePrice: 2360,
      originalPrice: 2000,
      roi: 18.0,
      monthlyIncome: 4200,
      totalIncome: 25200,
      purchaseDate: "2024-01-20",
      status: "Active",
      riskLevel: "Low",
      image: "/images/property1.jpg"
    },
    {
      id: 2,
      name: "Tech Hub Plaza",
      location: "Noida, UP",
      type: "IT Park",
      investment: 150000,
      currentValue: 165000,
      shares: 75,
      totalShares: 1200,
      sharePrice: 2200,
      originalPrice: 2000,
      roi: 10.0,
      monthlyIncome: 5800,
      totalIncome: 34800,
      purchaseDate: "2024-02-15",
      status: "Active",
      riskLevel: "Medium",
      image: "/images/property2.jpg"
    },
    {
      id: 3,
      name: "Metro Mall Complex",
      location: "New Delhi",
      type: "Retail Mall",
      investment: 100000,
      currentValue: 127000,
      shares: 40,
      totalShares: 800,
      sharePrice: 3175,
      originalPrice: 2500,
      roi: 27.0,
      monthlyIncome: 2400,
      totalIncome: 9600,
      purchaseDate: "2024-03-10",
      status: "Active",
      riskLevel: "Low",
      image: "/images/property3.jpg"
    }
  ]);
  
  const [transactionHistory] = useState([
    {
      id: 1,
      type: "purchase",
      propertyName: "Phoenix Business Center",
      amount: 100000,
      shares: 50,
      date: "2024-01-20",
      status: "Completed"
    },
    {
      id: 2,
      type: "income",
      propertyName: "Phoenix Business Center",
      amount: 4200,
      shares: 50,
      date: "2024-12-01",
      status: "Received"
    },
    {
      id: 3,
      type: "purchase",
      propertyName: "Tech Hub Plaza",
      amount: 150000,
      shares: 75,
      date: "2024-02-15",
      status: "Completed"
    },
    {
      id: 4,
      type: "income",
      propertyName: "Tech Hub Plaza",
      amount: 5800,
      shares: 75,
      date: "2024-12-01",
      status: "Received"
    },
    {
      id: 5,
      type: "purchase",
      propertyName: "Metro Mall Complex",
      amount: 100000,
      shares: 40,
      date: "2024-03-10",
      status: "Completed"
    }
  ]);
  
  const [statements] = useState([
    {
      id: 1,
      type: "Monthly Statement",
      period: "December 2024",
      date: "2024-12-01",
      amount: 12400,
      downloadUrl: "/statements/dec-2024.pdf"
    },
    {
      id: 2,
      type: "Monthly Statement",
      period: "November 2024",
      date: "2024-11-01",
      amount: 11800,
      downloadUrl: "/statements/nov-2024.pdf"
    },
    {
      id: 3,
      type: "Quarterly Report",
      period: "Q4 2024",
      date: "2024-10-01",
      amount: 34200,
      downloadUrl: "/statements/q4-2024.pdf"
    }
  ]);
  
  const [sortBy, setSortBy] = useState("roi_desc");
  const [filterBy, setFilterBy] = useState("all");

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
      month: 'short',
      year: 'numeric'
    });
  };

  const getReturnPercentage = () => {
    return ((user.totalReturns / user.totalInvestment) * 100).toFixed(1);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <FaBuilding className="w-4 h-4 text-blue-500" />;
      case "income":
        return <FaArrowUp className="w-4 h-4 text-green-500" />;
      case "sale":
        return <FaExchangeAlt className="w-4 h-4 text-orange-500" />;
      default:
        return <FaDollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return <Badge className="bg-green-500/20 text-green-400">{riskLevel}</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500/20 text-yellow-400">{riskLevel}</Badge>;
      case "High":
        return <Badge className="bg-red-500/20 text-red-400">{riskLevel}</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{riskLevel}</Badge>;
    }
  };

  const getPerformanceColor = (roi: number) => {
    if (roi >= 20) return "text-green-400";
    if (roi >= 10) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <EquityNavbar />
      
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                My <span className="text-orange-500">Portfolio</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Track your real estate investments and returns
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                <FaDownload className="w-4 h-4 mr-2" />
                Export Portfolio
              </Button>
              <Link href="/equity/properties">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <FaBuilding className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Investment</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(user.totalInvestment)}</p>
                    <p className="text-sm text-gray-400">Since {formatDate(user.joinDate)}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <FaWallet className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Value</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(user.totalValue)}</p>
                    <p className="text-sm text-green-400 flex items-center">
                      <FaArrowUp className="w-3 h-3 mr-1" />
                      {getReturnPercentage()}%
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <FaChartLine className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Returns</p>
                    <p className="text-2xl font-bold text-orange-500">{formatCurrency(user.totalReturns)}</p>
                    <p className="text-sm text-gray-400">Capital + Income</p>
                  </div>
                  <div className="bg-orange-500/20 p-3 rounded-full">
                    <FaTrophy className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Income</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(user.monthlyIncome)}</p>
                    <p className="text-sm text-gray-400">{user.portfolioCount} properties</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <FaUsers className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                  <TabsTrigger value="portfolio" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Portfolio Holdings
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Transaction History
                  </TabsTrigger>
                  <TabsTrigger value="statements" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Statements
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="portfolio" className="mt-6">
                  <div className="space-y-6">
                    {/* Filters */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="roi_desc">Highest ROI</SelectItem>
                            <SelectItem value="roi_asc">Lowest ROI</SelectItem>
                            <SelectItem value="value_desc">Highest Value</SelectItem>
                            <SelectItem value="value_asc">Lowest Value</SelectItem>
                            <SelectItem value="date_desc">Recent First</SelectItem>
                            <SelectItem value="date_asc">Oldest First</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterBy} onValueChange={setFilterBy}>
                          <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Filter by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Properties</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="mixed">Mixed Use</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Portfolio Items */}
                    <div className="space-y-4">
                      {portfolioData.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className="bg-gray-700/50 border-gray-600 hover:border-orange-500 transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                    <FaBuilding className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-white">{property.name}</h3>
                                    <p className="text-gray-400 flex items-center">
                                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                                      {property.location}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge className="bg-blue-500/20 text-blue-400">{property.type}</Badge>
                                      {getRiskBadge(property.riskLevel)}
                                      <Badge className="bg-green-500/20 text-green-400">{property.status}</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Link href={`/equity/properties/${property.id}`}>
                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-600">
                                      <FaEye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                  </Link>
                                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-600">
                                    <FaExchangeAlt className="w-4 h-4 mr-1" />
                                    Trade
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                <div>
                                  <p className="text-gray-400 text-sm">Investment</p>
                                  <p className="text-white font-semibold">{formatCurrency(property.investment)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Current Value</p>
                                  <p className="text-white font-semibold">{formatCurrency(property.currentValue)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">ROI</p>
                                  <p className={`font-semibold ${getPerformanceColor(property.roi)}`}>
                                    {property.roi > 0 ? '+' : ''}{property.roi}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Monthly Income</p>
                                  <p className="text-orange-500 font-semibold">{formatCurrency(property.monthlyIncome)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Total Income</p>
                                  <p className="text-green-500 font-semibold">{formatCurrency(property.totalIncome)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Shares</p>
                                  <p className="text-white font-semibold">{property.shares}</p>
                                  <p className="text-xs text-gray-400">of {property.totalShares}</p>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-600">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-400">
                                    Purchased on {formatDate(property.purchaseDate)}
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-400">Share Price: </span>
                                    <span className="text-white font-semibold">{formatCurrency(property.sharePrice)}</span>
                                    <span className={`ml-2 ${property.sharePrice > property.originalPrice ? 'text-green-400' : 'text-red-400'}`}>
                                      ({property.sharePrice > property.originalPrice ? '+' : ''}{((property.sharePrice - property.originalPrice) / property.originalPrice * 100).toFixed(1)}%)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transactions" className="mt-6">
                  <div className="space-y-4">
                    {transactionHistory.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {getTransactionIcon(transaction.type)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white capitalize">{transaction.type}</h3>
                                  <p className="text-gray-400 text-sm">{transaction.propertyName}</p>
                                  <p className="text-gray-500 text-xs">{formatDate(transaction.date)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{formatCurrency(transaction.amount)}</p>
                                {transaction.shares && (
                                  <p className="text-gray-400 text-sm">{transaction.shares} shares</p>
                                )}
                                <Badge 
                                  className={`mt-1 ${
                                    transaction.status === 'Completed' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-yellow-500/20 text-yellow-400'
                                  }`}
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="statements" className="mt-6">
                  <div className="space-y-4">
                    {statements.map((statement, index) => (
                      <motion.div
                        key={statement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <FaDownload className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white">{statement.type}</h3>
                                  <p className="text-gray-400 text-sm">{statement.period}</p>
                                  <p className="text-gray-500 text-xs">{formatDate(statement.date)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{formatCurrency(statement.amount)}</p>
                                <Button 
                                  size="sm" 
                                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                  <FaDownload className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
