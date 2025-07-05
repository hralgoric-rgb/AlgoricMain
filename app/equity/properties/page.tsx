"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaChartLine, 
  FaUsers,
  FaFilter,
  FaSearch,
  
  FaEye,
  FaHeart,
  FaRegHeart,
  
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import EquityNavbar from "../components/EquityNavbar";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Phoenix Business Center",
      location: "Gurgaon, Haryana",
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
      image: "/images/property1.jpg",
      features: ["Prime Location", "Grade A Building", "Metro Connectivity"],
      isFavorite: false
    },
    {
      id: 2,
      name: "Tech Hub Plaza",
      location: "Noida, Uttar Pradesh",
      type: "IT Park",
      totalValue: 75000000,
      totalShares: 1500,
      pricePerShare: 50000,
      sharesAvailable: 425,
      expectedROI: 14.8,
      rentalYield: 7.8,
      occupancy: 88,
      minInvestment: 75000,
      monthlyIncome: 3800,
      launchDate: "2024-02-20",
      completionDate: "2022-03-15",
      image: "/images/property2.jpg",
      features: ["Tech Hub", "Modern Amenities", "Cafeteria"],
      isFavorite: true
    },
    {
      id: 3,
      name: "Metro Mall Complex",
      location: "New Delhi",
      type: "Retail Mall",
      totalValue: 120000000,
      totalShares: 2000,
      pricePerShare: 60000,
      sharesAvailable: 180,
      expectedROI: 18.2,
      rentalYield: 9.5,
      occupancy: 92,
      minInvestment: 120000,
      monthlyIncome: 5700,
      launchDate: "2024-03-10",
      completionDate: "2020-12-20",
      image: "/images/property3.jpg",
      features: ["High Footfall", "Brand Tenants", "Food Court"],
      isFavorite: false
    },
    {
      id: 4,
      name: "Elite Corporate Tower",
      location: "Bangalore, Karnataka",
      type: "Corporate Office",
      totalValue: 90000000,
      totalShares: 1200,
      pricePerShare: 75000,
      sharesAvailable: 320,
      expectedROI: 15.6,
      rentalYield: 8.8,
      occupancy: 96,
      minInvestment: 150000,
      monthlyIncome: 4500,
      launchDate: "2024-04-05",
      completionDate: "2021-09-10",
      image: "/images/property4.jpg",
      features: ["IT Corridor", "Multinational Tenants", "Parking"],
      isFavorite: false
    },
    {
      id: 5,
      name: "Green Valley Office Park",
      location: "Pune, Maharashtra",
      type: "Office Park",
      totalValue: 60000000,
      totalShares: 800,
      pricePerShare: 75000,
      sharesAvailable: 200,
      expectedROI: 13.4,
      rentalYield: 7.2,
      occupancy: 85,
      minInvestment: 75000,
      monthlyIncome: 3200,
      launchDate: "2024-05-01",
      completionDate: "2023-01-25",
      image: "/images/property5.jpg",
      features: ["Green Building", "LEED Certified", "Gym & Spa"],
      isFavorite: true
    },
    {
      id: 6,
      name: "Diamond District Hub",
      location: "Mumbai, Maharashtra",
      type: "Mixed Use",
      totalValue: 150000000,
      totalShares: 2500,
      pricePerShare: 60000,
      sharesAvailable: 450,
      expectedROI: 17.8,
      rentalYield: 9.1,
      occupancy: 94,
      minInvestment: 120000,
      monthlyIncome: 5400,
      launchDate: "2024-06-15",
      completionDate: "2022-08-30",
      image: "/images/property6.jpg",
      features: ["Sea View", "Premium Location", "Sky Lounge"],
      isFavorite: false
    }
  ]);

  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [roiRange, setRoiRange] = useState([10, 20]);
  const [investmentRange, setInvestmentRange] = useState([50000, 200000]);
  const [sortBy, setSortBy] = useState("roi_desc");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // ROI filter
    filtered = filtered.filter(property =>
      property.expectedROI >= roiRange[0] && property.expectedROI <= roiRange[1]
    );

    // Investment filter
    filtered = filtered.filter(property =>
      property.minInvestment >= investmentRange[0] && property.minInvestment <= investmentRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "roi_desc":
          return b.expectedROI - a.expectedROI;
        case "roi_asc":
          return a.expectedROI - b.expectedROI;
        case "investment_asc":
          return a.minInvestment - b.minInvestment;
        case "investment_desc":
          return b.minInvestment - a.minInvestment;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedLocation, selectedType, roiRange, investmentRange, sortBy]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const toggleFavorite = (id: number) => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, isFavorite: !prop.isFavorite } : prop
    ));
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "Office Complex":
      case "Corporate Office":
      case "IT Park":
      case "Office Park":
        return <FaBuilding className="w-5 h-5 text-blue-500" />;
      case "Retail Mall":
        return <FaUsers className="w-5 h-5 text-green-500" />;
      case "Mixed Use":
        return <FaBuilding className="w-5 h-5 text-purple-500" />;
      default:
        return <FaBuilding className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAvailabilityStatus = (sharesAvailable: number, totalShares: number) => {
    const percentage = (sharesAvailable / totalShares) * 100;
    if (percentage > 50) return { status: "High", color: "bg-green-500" };
    if (percentage > 20) return { status: "Medium", color: "bg-yellow-500" };
    return { status: "Low", color: "bg-red-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <EquityNavbar />
      
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-white">
                <span className="text-orange-500">Investment</span> Properties
              </h1>
              <p className="text-gray-400 mt-1">
                Discover premium real estate opportunities with high returns
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <FaFilter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="gurgaon">Gurgaon</SelectItem>
                        <SelectItem value="noida">Noida</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Property Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Office Complex">Office Complex</SelectItem>
                        <SelectItem value="IT Park">IT Park</SelectItem>
                        <SelectItem value="Retail Mall">Retail Mall</SelectItem>
                        <SelectItem value="Corporate Office">Corporate Office</SelectItem>
                        <SelectItem value="Office Park">Office Park</SelectItem>
                        <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Expected ROI: {roiRange[0]}% - {roiRange[1]}%
                    </Label>
                    <Slider
                      value={roiRange}
                      onValueChange={setRoiRange}
                      min={10}
                      max={25}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Min Investment: {formatCurrency(investmentRange[0])} - {formatCurrency(investmentRange[1])}
                    </Label>
                    <Slider
                      value={investmentRange}
                      onValueChange={setInvestmentRange}
                      min={50000}
                      max={200000}
                      step={25000}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sort and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredProperties.length}</span> properties
          </div>
          <div className="flex items-center space-x-4">
            <Label className="text-gray-400">Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi_desc">Highest ROI</SelectItem>
                <SelectItem value="roi_asc">Lowest ROI</SelectItem>
                <SelectItem value="investment_asc">Lowest Investment</SelectItem>
                <SelectItem value="investment_desc">Highest Investment</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500 transition-all duration-300 backdrop-blur-sm group-hover:transform group-hover:scale-105">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg flex items-center justify-center">
                      <FaBuilding className="w-20 h-20 text-white opacity-50" />
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFavorite(property.id)}
                        className="bg-black/50 border-none hover:bg-black/70"
                      >
                        {property.isFavorite ? (
                          <FaHeart className="w-4 h-4 text-red-500" />
                        ) : (
                          <FaRegHeart className="w-4 h-4 text-white" />
                        )}
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-500/90 text-white">
                        {property.expectedROI}% ROI
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center space-x-1">
                        {getPropertyTypeIcon(property.type)}
                        <span className="text-white text-sm font-medium">{property.type}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{property.name}</h3>
                    <p className="text-gray-400 flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      {property.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Min Investment</p>
                      <p className="text-white font-semibold">{formatCurrency(property.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Income</p>
                      <p className="text-orange-500 font-semibold">{formatCurrency(property.monthlyIncome)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Rental Yield</p>
                      <p className="text-white font-semibold">{property.rentalYield}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Occupancy</p>
                      <p className="text-green-500 font-semibold">{property.occupancy}%</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Shares Available</span>
                      <span className="text-white text-sm">
                        {property.sharesAvailable}/{property.totalShares}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getAvailabilityStatus(property.sharesAvailable, property.totalShares).color}`}
                        style={{ width: `${(property.sharesAvailable / property.totalShares) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {property.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/equity/properties/${property.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                        <FaEye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:bg-gray-700"
                    >
                      <FaChartLine className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No properties found matching your criteria</div>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("all");
                setSelectedType("all");
                setRoiRange([10, 20]);
                setInvestmentRange([50000, 200000]);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
