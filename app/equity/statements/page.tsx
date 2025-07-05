"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { 
  FaDownload, 
  FaEye, 
  FaCalendarAlt, 
  
  FaFileAlt,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  
  FaReceipt,
  FaWallet,
  FaPrint,
  FaEnvelope
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import EquityNavbar from "../components/EquityNavbar";

export default function StatementsPage() {
  const [statements] = useState([
    {
      id: 1,
      type: "Monthly Statement",
      period: "December 2024",
      date: "2024-12-31",
      totalInvestment: 350000,
      totalValue: 410000,
      totalReturns: 60000,
      monthlyIncome: 12400,
      properties: 5,
      status: "Available",
      fileSize: "2.4 MB"
    },
    {
      id: 2,
      type: "Quarterly Statement",
      period: "Q4 2024",
      date: "2024-12-31",
      totalInvestment: 350000,
      totalValue: 410000,
      totalReturns: 60000,
      monthlyIncome: 12400,
      properties: 5,
      status: "Available",
      fileSize: "5.2 MB"
    },
    {
      id: 3,
      type: "Annual Statement",
      period: "2024",
      date: "2024-12-31",
      totalInvestment: 350000,
      totalValue: 410000,
      totalReturns: 60000,
      monthlyIncome: 12400,
      properties: 5,
      status: "Available",
      fileSize: "8.1 MB"
    },
    {
      id: 4,
      type: "Tax Statement",
      period: "FY 2024-25",
      date: "2024-12-31",
      totalInvestment: 350000,
      totalValue: 410000,
      totalReturns: 60000,
      monthlyIncome: 12400,
      properties: 5,
      status: "Available",
      fileSize: "1.8 MB"
    }
  ]);
  
  const [transactions] = useState([
    {
      id: "TXN-001",
      date: "2024-12-15",
      type: "Purchase",
      property: "Phoenix Business Center",
      amount: 100000,
      shares: 50,
      status: "Completed"
    },
    {
      id: "TXN-002",
      date: "2024-12-10",
      type: "Dividend",
      property: "Marina Bay Offices",
      amount: 3200,
      shares: 0,
      status: "Received"
    },
    {
      id: "TXN-003",
      date: "2024-12-05",
      type: "Sale",
      property: "Tech Hub Complex",
      amount: 85000,
      shares: 25,
      status: "Completed"
    },
    {
      id: "TXN-004",
      date: "2024-11-28",
      type: "Purchase",
      property: "Green Valley Mall",
      amount: 150000,
      shares: 75,
      status: "Completed"
    },
    {
      id: "TXN-005",
      date: "2024-11-20",
      type: "Dividend",
      property: "Phoenix Business Center",
      amount: 2800,
      shares: 0,
      status: "Received"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const handleDownload = (statementId: number) => {
    // Simulate download
    console.log(`Downloading statement ${statementId}`);
  };

  const handleEmail = (statementId: number) => {
    // Simulate email
    console.log(`Emailing statement ${statementId}`);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Purchase":
        return <FaArrowDown className="text-red-500" />;
      case "Sale":
        return <FaArrowUp className="text-green-500" />;
      case "Dividend":
        return <FaWallet className="text-blue-500" />;
      default:
        return <FaReceipt className="text-gray-500" />;
    }
  };

  const getTransactionAmount = (type: string, amount: number) => {
    if (type === "Purchase") {
      return `-₹${amount.toLocaleString()}`;
    } else {
      return `+₹${amount.toLocaleString()}`;
    }
  };

  const getTransactionAmountColor = (type: string) => {
    if (type === "Purchase") {
      return "text-red-500";
    } else {
      return "text-green-500";
    }
  };

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
                  <span className="text-orange-500">Statements</span> & Reports
                </h1>
                <p className="text-gray-400 text-lg">
                  Download your investment statements and transaction history
                </p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <FaPrint className="mr-2" />
                  Print All
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <FaDownload className="mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="statements" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              <TabsTrigger value="statements" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <FaFileAlt className="mr-2" />
                Statements
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <FaReceipt className="mr-2" />
                Transaction History
              </TabsTrigger>
            </TabsList>

            {/* Statements Tab */}
            <TabsContent value="statements" className="space-y-6">
              {/* Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-4 mb-6"
              >
                <div className="flex-1 min-w-64">
                  <Label htmlFor="search" className="text-gray-400 mb-2 block">Search</Label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Search statements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="min-w-48">
                  <Label htmlFor="type" className="text-gray-400 mb-2 block">Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-48">
                  <Label htmlFor="period" className="text-gray-400 mb-2 block">Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="q4-2024">Q4 2024</SelectItem>
                      <SelectItem value="q3-2024">Q3 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Statements List */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                {statements.map((statement) => (
                  <Card key={statement.id} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{statement.type}</h3>
                            <p className="text-gray-400">
                              {statement.period} • {statement.fileSize}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <FaCalendarAlt className="mr-1" />
                              Generated: {new Date(statement.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`${statement.status === 'Available' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}
                          >
                            {statement.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmail(statement.id)}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700"
                          >
                            <FaEnvelope className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-400 hover:bg-gray-700"
                          >
                            <FaEye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(statement.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <FaDownload className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Transaction History */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{transaction.type}</h3>
                              <p className="text-gray-400 text-sm">{transaction.property}</p>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <FaCalendarAlt className="mr-1" />
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${getTransactionAmountColor(transaction.type)}`}>
                              {getTransactionAmount(transaction.type, transaction.amount)}
                            </p>
                            {transaction.shares > 0 && (
                              <p className="text-sm text-gray-400">
                                {transaction.shares} shares
                              </p>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs mt-1 ${
                                transaction.status === 'Completed' ? 'border-green-500 text-green-500' : 
                                transaction.status === 'Received' ? 'border-blue-500 text-blue-500' : 
                                'border-yellow-500 text-yellow-500'
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
