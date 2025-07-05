"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaDownload,
  FaArrowLeft,
  FaShieldAlt,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityNavbar from "../../components/EquityNavbar";

// Mock data for property details
const propertyData = {
  1: {
    id: 1,
    name: "Phoenix Business Center",
    location: "Sector 62, Gurgaon, Haryana",
    type: "Office Complex",
    totalValue: 50000000,
    totalShares: 1000,
    pricePerShare: 50000,
    sharesAvailable: 250,
    expectedROI: 16.5,
    rentalYield: 8.2,
    occupancy: 95,
    minInvestment: 100000,
    monthlyIncome: 4200,
    launchDate: "2024-01-15",
    completionDate: "2021-06-30",
    description: "Premium Grade-A office complex located in the heart of Gurgaon's business district. Features modern architecture, state-of-the-art facilities, and excellent connectivity.",
    features: [
      "Prime Location",
      "Grade A Building", 
      "Metro Connectivity",
      "24/7 Security",
      "Power Backup",
      "Parking Available",
      "Food Court",
      "Gym & Wellness Center"
    ],
    amenities: [
      "High-speed elevators",
      "Central air conditioning",
      "Fire safety systems",
      "Conference rooms",
      "Cafeteria",
      "ATM facility",
      "Medical room",
      "Landscaped gardens"
    ],
    tenants: [
      { name: "Tech Corp India", area: "25,000 sq ft", lease: "5 years" },
      { name: "Global Solutions Ltd", area: "15,000 sq ft", lease: "3 years" },
      { name: "Innovation Hub", area: "20,000 sq ft", lease: "7 years" }
    ],
    financials: {
      totalArea: "2,50,000 sq ft",
      builtUpArea: "2,00,000 sq ft",
      avgRent: "₹65/sq ft",
      maintenanceCost: "₹8/sq ft",
      propertyTax: "₹2.5L/year",
      insurance: "₹5L/year"
    },
    mlPredictions: {
      roi12Months: 16.5,
      roi24Months: 18.2,
      roi36Months: 20.1,
      valueAppreciation: 12.5,
      riskScore: "Low",
      marketTrend: "Positive"
    },
    isFavorite: false
  }
};

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);
  const property = propertyData[propertyId as keyof typeof propertyData];
  
  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyFormData, setBuyFormData] = useState({
    shares: 2,
    amount: 100000,
    paymentMethod: "card"
  });

  useEffect(() => {
    if (property) {
      setBuyFormData(prev => ({
        ...prev,
        amount: prev.shares * property.pricePerShare
      }));
    }
  }, [property]);

  const handleSharesChange = (shares: number) => {
    if (property) {
      setBuyFormData({
        ...buyFormData,
        shares: shares,
        amount: shares * property.pricePerShare
      });
    }
  };

  const handleBuySubmit = () => {
    // Handle purchase logic
    console.log("Purchase submitted:", buyFormData);
    setShowBuyModal(false);
    // Redirect to success page or show success message
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-400 mb-8">The property you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/equity/properties">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <EquityNavbar />
      
      {/* Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm pt-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/equity/properties" className="flex items-center text-orange-500 hover:text-orange-400">
              <FaArrowLeft className="mr-2 w-4 h-4" />
              Back to Properties
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsFavorite(!isFavorite)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                {isFavorite ? <FaHeart className="w-4 h-4 text-red-500" /> : <FaRegHeart className="w-4 h-4" />}
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                <FaShare className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                <FaDownload className="w-4 h-4 mr-2" />
                Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <FaBuilding className="w-5 h-5 text-orange-500" />
                  <Badge className="bg-orange-500/20 text-orange-400">{property.type}</Badge>
                  <Badge className="bg-green-500/20 text-green-400">{property.expectedROI}% ROI</Badge>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{property.name}</h1>
                <p className="text-gray-400 flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  {property.location}
                </p>
              </div>

              {/* Property Image */}
              <div className="w-full h-96 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                <FaBuilding className="w-32 h-32 text-white opacity-30" />
              </div>

              {/* Property Description */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">About this Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-6">{property.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Total Area</p>
                      <p className="text-white font-semibold">{property.financials.totalArea}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Built-up Area</p>
                      <p className="text-white font-semibold">{property.financials.builtUpArea}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Avg Rent</p>
                      <p className="text-white font-semibold">{property.financials.avgRent}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Occupancy</p>
                      <p className="text-green-500 font-semibold">{property.occupancy}%</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Investment Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Investment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Price per Share</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(property.pricePerShare)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Min Investment</p>
                      <p className="text-2xl font-bold text-orange-500">{formatCurrency(property.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Expected ROI</p>
                      <p className="text-2xl font-bold text-green-500">{property.expectedROI}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Rental Yield</p>
                      <p className="text-2xl font-bold text-blue-500">{property.rentalYield}%</p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Shares Available</span>
                      <span className="text-white text-sm">{property.sharesAvailable}/{property.totalShares}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(property.sharesAvailable / property.totalShares) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round((property.sharesAvailable / property.totalShares) * 100)}% available
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Estimated Monthly Income</p>
                    <p className="text-xl font-bold text-orange-500">{formatCurrency(property.monthlyIncome)}</p>
                    <p className="text-xs text-gray-400">Based on minimum investment</p>
                  </div>

                  <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 text-lg font-semibold">
                        <FaShoppingCart className="w-5 h-5 mr-2" />
                        Buy Shares
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">
                          Purchase Shares
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-2">{property.name}</h3>
                          <p className="text-gray-400 text-sm">{property.location}</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-white">Number of Shares</Label>
                            <Input
                              type="number"
                              min="1"
                              max={property.sharesAvailable}
                              value={buyFormData.shares}
                              onChange={(e) => handleSharesChange(parseInt(e.target.value) || 1)}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>

                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400">Price per Share</span>
                              <span className="text-white">{formatCurrency(property.pricePerShare)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400">Shares</span>
                              <span className="text-white">{buyFormData.shares}</span>
                            </div>
                            <div className="border-t border-gray-600 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-white font-semibold">Total Amount</span>
                                <span className="text-orange-500 font-bold text-lg">{formatCurrency(buyFormData.amount)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                            <div className="flex items-center text-blue-400 mb-2">
                              <FaShieldAlt className="w-4 h-4 mr-2" />
                              <span className="text-sm font-semibold">Investment Protection</span>
                            </div>
                            <p className="text-xs text-blue-300">
                              Your investment is protected by our comprehensive insurance policy and legal framework.
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
                              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                            >
                              <FaCreditCard className="w-4 h-4 mr-2" />
                              Purchase
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center text-orange-500 mb-2">
                      <FaExclamationTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-semibold">Important Notice</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Real estate investments are subject to market risks. Past performance doesn&apos;t guarantee future returns.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-700">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="financials" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Financials
                  </TabsTrigger>
                  <TabsTrigger value="tenants" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Tenants
                  </TabsTrigger>
                  <TabsTrigger value="predictions" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    ML Insights
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Property Highlights</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completion Date</span>
                          <span className="text-white">{property.completionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Launch Date</span>
                          <span className="text-white">{property.launchDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Value</span>
                          <span className="text-white">{formatCurrency(property.totalValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Shares</span>
                          <span className="text-white">{property.totalShares}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Amenities</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-gray-300">
                            <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financials" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Financial Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Average Rent</p>
                          <p className="text-2xl font-bold text-white">{property.financials.avgRent}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Maintenance Cost</p>
                          <p className="text-2xl font-bold text-white">{property.financials.maintenanceCost}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Property Tax</p>
                          <p className="text-2xl font-bold text-white">{property.financials.propertyTax}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Insurance</p>
                          <p className="text-2xl font-bold text-white">{property.financials.insurance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tenants" className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Current Tenants</h3>
                    <div className="space-y-4">
                      {property.tenants.map((tenant, index) => (
                        <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">{tenant.name}</h4>
                            <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 text-sm">Leased Area</p>
                              <p className="text-white">{tenant.area}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Lease Period</p>
                              <p className="text-white">{tenant.lease}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="predictions" className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">ML-Powered Predictions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">12-Month ROI</p>
                        <p className="text-2xl font-bold text-green-500">{property.mlPredictions.roi12Months}%</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">24-Month ROI</p>
                        <p className="text-2xl font-bold text-green-500">{property.mlPredictions.roi24Months}%</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">36-Month ROI</p>
                        <p className="text-2xl font-bold text-green-500">{property.mlPredictions.roi36Months}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Value Appreciation</p>
                        <p className="text-xl font-bold text-orange-500">{property.mlPredictions.valueAppreciation}%</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Risk Score</p>
                        <Badge className="bg-green-500/20 text-green-400">{property.mlPredictions.riskScore}</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Legal Documents</h3>
                    <div className="space-y-3">
                      {[
                        "Property Title Deed",
                        "Building Approval Certificate",
                        "Tax Clearance Certificate",
                        "Insurance Documents",
                        "Tenant Agreements",
                        "Property Valuation Report"
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                          <span className="text-white">{doc}</span>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-600">
                            <FaDownload className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
