"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaExchangeAlt, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaEye,
  FaShoppingCart,
  FaSellcast,
  FaArrowUp,
  FaArrowDown,
  
  FaCheckCircle,
  
  FaExclamationTriangle,
  FaDownload
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EquityNavbar from "../components/EquityNavbar";

export default function TradePage() {
  const [myHoldings] = useState([
    {
      id: 1,
      name: "Phoenix Business Center",
      location: "Gurgaon, Haryana",
      type: "Office Complex",
      shares: 50,
      purchasePrice: 2000,
      currentPrice: 2360,
      totalValue: 118000,
      roi: 18.0,
      canSell: true,
      availableForSale: 20,
      image: "/images/property1.jpg"
    },
    {
      id: 2,
      name: "Tech Hub Plaza",
      location: "Noida, UP",
      type: "IT Park",
      shares: 75,
      purchasePrice: 2000,
      currentPrice: 2200,
      totalValue: 165000,
      roi: 10.0,
      canSell: true,
      availableForSale: 30,
      image: "/images/property2.jpg"
    },
    {
      id: 3,
      name: "Metro Mall Complex",
      location: "New Delhi",
      type: "Retail Mall",
      shares: 40,
      purchasePrice: 2500,
      currentPrice: 3175,
      totalValue: 127000,
      roi: 27.0,
      canSell: true,
      availableForSale: 15,
      image: "/images/property3.jpg"
    }
  ]);
  
  const [marketplaceListings] = useState([
    {
      id: 1,
      propertyName: "Elite Corporate Tower",
      location: "Bangalore, Karnataka",
      type: "Corporate Office",
      sellerId: "user_456",
      sellerName: "Rajesh Kumar",
      shares: 25,
      askingPrice: 3200,
      originalPrice: 3000,
      currentMarketPrice: 3150,
      priceChange: 6.67,
      listedDate: "2024-12-15",
      status: "Active",
      reason: "Portfolio rebalancing"
    },
    {
      id: 2,
      propertyName: "Green Valley Office Park",
      location: "Pune, Maharashtra",
      type: "Office Park",
      sellerId: "user_789",
      sellerName: "Priya Sharma",
      shares: 60,
      askingPrice: 2850,
      originalPrice: 2700,
      currentMarketPrice: 2800,
      priceChange: 3.7,
      listedDate: "2024-12-10",
      status: "Active",
      reason: "Urgent liquidation"
    },
    {
      id: 3,
      propertyName: "Diamond District Hub",
      location: "Mumbai, Maharashtra",
      type: "Mixed Use",
      sellerId: "user_321",
      sellerName: "Amit Patel",
      shares: 15,
      askingPrice: 4200,
      originalPrice: 4000,
      currentMarketPrice: 4100,
      priceChange: 2.5,
      listedDate: "2024-12-08",
      status: "Active",
      reason: "Profit booking"
    }
  ]);
  
  const [tradeHistory] = useState([
    {
      id: 1,
      type: "buy",
      propertyName: "Phoenix Business Center",
      shares: 10,
      price: 2300,
      totalAmount: 23000,
      date: "2024-12-01",
      status: "Completed",
      counterparty: "System"
    },
    {
      id: 2,
      type: "sell",
      propertyName: "Tech Hub Plaza",
      shares: 15,
      price: 2150,
      totalAmount: 32250,
      date: "2024-11-28",
      status: "Completed",
      counterparty: "Vikram Singh"
    },
    {
      id: 3,
      type: "buy",
      propertyName: "Metro Mall Complex",
      shares: 5,
      price: 3100,
      totalAmount: 15500,
      date: "2024-11-25",
      status: "Pending",
      counterparty: "Neha Gupta"
    }
  ]);
  
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [sellFormData, setSellFormData] = useState({
    shares: 1,
    price: 0,
    reason: ""
  });
  const [buyFormData, setBuyFormData] = useState({
    shares: 1,
    maxPrice: 0
  });

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

  const getTradeTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <FaShoppingCart className="w-4 h-4 text-green-500" />;
      case "sell":
        return <FaSellcast className="w-4 h-4 text-red-500" />;
      default:
        return <FaExchangeAlt className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case "Active":
        return <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
    }
  };

  const handleSellSubmit = () => {
    console.log("Sell order submitted:", sellFormData);
    setShowSellModal(false);
    // Add to trade history and update holdings
  };

  const handleBuySubmit = () => {
    console.log("Buy order submitted:", buyFormData);
    setShowBuyModal(false);
    // Add to trade history
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
                <span className="text-orange-500">Trade</span> & Exchange
              </h1>
              <p className="text-gray-400 mt-1">
                Buy and sell property shares on our secondary marketplace
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/equity/portfolio">
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <FaBuilding className="w-4 h-4 mr-2" />
                  My Portfolio
                </Button>
              </Link>
              <Link href="/equity/properties">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <FaShoppingCart className="w-4 h-4 mr-2" />
                  New Investment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="holdings" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="holdings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  My Holdings
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Trade History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="holdings" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Properties You Own</h2>
                    <p className="text-gray-400">Click on a property to sell shares</p>
                  </div>

                  <div className="space-y-4">
                    {myHoldings.map((holding, index) => (
                      <motion.div
                        key={holding.id}
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
                                  <h3 className="text-xl font-semibold text-white">{holding.name}</h3>
                                  <p className="text-gray-400 flex items-center">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                                    {holding.location}
                                  </p>
                                  <Badge className="bg-blue-500/20 text-blue-400 mt-1">{holding.type}</Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-white">{formatCurrency(holding.totalValue)}</p>
                                <p className={`text-sm flex items-center justify-end ${holding.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {holding.roi > 0 ? <FaArrowUp className="w-3 h-3 mr-1" /> : <FaArrowDown className="w-3 h-3 mr-1" />}
                                  {holding.roi}%
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-gray-400 text-sm">Shares Owned</p>
                                <p className="text-white font-semibold">{holding.shares}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Purchase Price</p>
                                <p className="text-white font-semibold">{formatCurrency(holding.purchasePrice)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Current Price</p>
                                <p className="text-white font-semibold">{formatCurrency(holding.currentPrice)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Available to Sell</p>
                                <p className="text-orange-500 font-semibold">{holding.availableForSale}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                Gain/Loss: <span className={`font-semibold ${holding.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {formatCurrency((holding.currentPrice - holding.purchasePrice) * holding.shares)}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Link href={`/equity/properties/${holding.id}`}>
                                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-600">
                                    <FaEye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                                <Dialog open={showSellModal} onOpenChange={setShowSellModal}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      className="bg-red-500 hover:bg-red-600 text-white"
                                      onClick={() => {
                                        setSelectedProperty(holding);
                                        setSellFormData({
                                          shares: 1,
                                          price: holding.currentPrice,
                                          reason: ""
                                        });
                                      }}
                                    >
                                      <FaSellcast className="w-4 h-4 mr-1" />
                                      Sell
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md bg-gray-800 border-gray-700">
                                    <DialogHeader>
                                      <DialogTitle className="text-2xl font-bold text-white">
                                        Sell Shares
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedProperty && (
                                      <div className="space-y-6">
                                        <div className="bg-gray-700/50 rounded-lg p-4">
                                          <h3 className="text-lg font-semibold text-white mb-2">{selectedProperty.name}</h3>
                                          <p className="text-gray-400 text-sm">{selectedProperty.location}</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            Available to sell: {selectedProperty.availableForSale} shares
                                          </p>
                                        </div>

                                        <div className="space-y-4">
                                          <div>
                                            <Label className="text-white">Number of Shares</Label>
                                            <Input
                                              type="number"
                                              min="1"
                                              max={selectedProperty.availableForSale}
                                              value={sellFormData.shares}
                                              onChange={(e) => setSellFormData({...sellFormData, shares: parseInt(e.target.value) || 1})}
                                              className="bg-gray-700 border-gray-600 text-white"
                                            />
                                          </div>

                                          <div>
                                            <Label className="text-white">Asking Price per Share</Label>
                                            <Input
                                              type="number"
                                              value={sellFormData.price}
                                              onChange={(e) => setSellFormData({...sellFormData, price: parseInt(e.target.value) || 0})}
                                              className="bg-gray-700 border-gray-600 text-white"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                              Current market price: {formatCurrency(selectedProperty.currentPrice)}
                                            </p>
                                          </div>

                                          <div>
                                            <Label className="text-white">Reason for Sale (Optional)</Label>
                                            <Input
                                              placeholder="e.g., Portfolio rebalancing, profit booking"
                                              value={sellFormData.reason}
                                              onChange={(e) => setSellFormData({...sellFormData, reason: e.target.value})}
                                              className="bg-gray-700 border-gray-600 text-white"
                                            />
                                          </div>

                                          <div className="bg-gray-700/50 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="text-gray-400">Shares to Sell</span>
                                              <span className="text-white">{sellFormData.shares}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="text-gray-400">Price per Share</span>
                                              <span className="text-white">{formatCurrency(sellFormData.price)}</span>
                                            </div>
                                            <div className="border-t border-gray-600 pt-2">
                                              <div className="flex justify-between items-center">
                                                <span className="text-white font-semibold">Total Amount</span>
                                                <span className="text-orange-500 font-bold text-lg">
                                                  {formatCurrency(sellFormData.shares * sellFormData.price)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                                            <div className="flex items-center text-yellow-400 mb-2">
                                              <FaExclamationTriangle className="w-4 h-4 mr-2" />
                                              <span className="text-sm font-semibold">Important Notice</span>
                                            </div>
                                            <p className="text-xs text-yellow-300">
                                              Once listed, your shares will be available for purchase by other investors. 
                                              The sale will be completed when a buyer matches your asking price.
                                            </p>
                                          </div>

                                          <div className="flex space-x-2">
                                            <Button
                                              variant="outline"
                                              onClick={() => setShowSellModal(false)}
                                              className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              onClick={handleSellSubmit}
                                              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                                            >
                                              <FaSellcast className="w-4 h-4 mr-2" />
                                              List for Sale
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="marketplace" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Secondary Marketplace</h2>
                    <p className="text-gray-400">Buy shares from other investors</p>
                  </div>

                  <div className="space-y-4">
                    {marketplaceListings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
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
                                  <h3 className="text-xl font-semibold text-white">{listing.propertyName}</h3>
                                  <p className="text-gray-400 flex items-center">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                                    {listing.location}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge className="bg-blue-500/20 text-blue-400">{listing.type}</Badge>
                                    {getStatusBadge(listing.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-white">{formatCurrency(listing.askingPrice)}</p>
                                <p className="text-sm text-gray-400">per share</p>
                                <p className={`text-sm flex items-center justify-end ${listing.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {listing.priceChange > 0 ? <FaArrowUp className="w-3 h-3 mr-1" /> : <FaArrowDown className="w-3 h-3 mr-1" />}
                                  {listing.priceChange}%
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-gray-400 text-sm">Shares Available</p>
                                <p className="text-white font-semibold">{listing.shares}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Market Price</p>
                                <p className="text-white font-semibold">{formatCurrency(listing.currentMarketPrice)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Seller</p>
                                <p className="text-white font-semibold">{listing.sellerName}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Listed Date</p>
                                <p className="text-white font-semibold">{formatDate(listing.listedDate)}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                Reason: <span className="text-white">{listing.reason}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-600">
                                  <FaEye className="w-4 h-4 mr-1" />
                                  View Property
                                </Button>
                                <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                      onClick={() => {
                                        setSelectedProperty(listing);
                                        setBuyFormData({
                                          shares: 1,
                                          maxPrice: listing.askingPrice
                                        });
                                      }}
                                    >
                                      <FaShoppingCart className="w-4 h-4 mr-1" />
                                      Buy
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md bg-gray-800 border-gray-700">
                                    <DialogHeader>
                                      <DialogTitle className="text-2xl font-bold text-white">
                                        Purchase Shares
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedProperty && (
                                      <div className="space-y-6">
                                        <div className="bg-gray-700/50 rounded-lg p-4">
                                          <h3 className="text-lg font-semibold text-white mb-2">{selectedProperty.propertyName}</h3>
                                          <p className="text-gray-400 text-sm">{selectedProperty.location}</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            Seller: {selectedProperty.sellerName}
                                          </p>
                                        </div>

                                        <div className="space-y-4">
                                          <div>
                                            <Label className="text-white">Number of Shares</Label>
                                            <Input
                                              type="number"
                                              min="1"
                                              max={selectedProperty.shares}
                                              value={buyFormData.shares}
                                              onChange={(e) => setBuyFormData({...buyFormData, shares: parseInt(e.target.value) || 1})}
                                              className="bg-gray-700 border-gray-600 text-white"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                              Available: {selectedProperty.shares} shares
                                            </p>
                                          </div>

                                          <div>
                                            <Label className="text-white">Maximum Price per Share</Label>
                                            <Input
                                              type="number"
                                              value={buyFormData.maxPrice}
                                              onChange={(e) => setBuyFormData({...buyFormData, maxPrice: parseInt(e.target.value) || 0})}
                                              className="bg-gray-700 border-gray-600 text-white"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                              Asking price: {formatCurrency(selectedProperty.askingPrice)}
                                            </p>
                                          </div>

                                          <div className="bg-gray-700/50 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="text-gray-400">Shares to Buy</span>
                                              <span className="text-white">{buyFormData.shares}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="text-gray-400">Max Price per Share</span>
                                              <span className="text-white">{formatCurrency(buyFormData.maxPrice)}</span>
                                            </div>
                                            <div className="border-t border-gray-600 pt-2">
                                              <div className="flex justify-between items-center">
                                                <span className="text-white font-semibold">Total Amount</span>
                                                <span className="text-orange-500 font-bold text-lg">
                                                  {formatCurrency(buyFormData.shares * buyFormData.maxPrice)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                                            <div className="flex items-center text-blue-400 mb-2">
                                              <FaCheckCircle className="w-4 h-4 mr-2" />
                                              <span className="text-sm font-semibold">Instant Settlement</span>
                                            </div>
                                            <p className="text-xs text-blue-300">
                                              Your purchase will be completed immediately if the seller accepts your offer.
                                            </p>
                                          </div>

                                          <div className="flex space-x-2">
                                            <Button
                                              variant="outline"
                                              onClick={() => setShowBuyModal(false)}
                                              className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              onClick={handleBuySubmit}
                                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                            >
                                              <FaShoppingCart className="w-4 h-4 mr-2" />
                                              Place Order
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Trade History</h2>
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                      <FaDownload className="w-4 h-4 mr-2" />
                      Export History
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {tradeHistory.map((trade, index) => (
                      <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {getTradeTypeIcon(trade.type)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white capitalize">{trade.type}</h3>
                                  <p className="text-gray-400 text-sm">{trade.propertyName}</p>
                                  <p className="text-gray-500 text-xs">
                                    {formatDate(trade.date)} • {trade.counterparty}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{formatCurrency(trade.totalAmount)}</p>
                                <p className="text-gray-400 text-sm">
                                  {trade.shares} shares @ {formatCurrency(trade.price)}
                                </p>
                                {getStatusBadge(trade.status)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
