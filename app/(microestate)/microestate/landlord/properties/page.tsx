"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatingCircles, ParticleBackground, AnimatedGradient } from "../../../_components/Background";
import ProtectedRoute from "../../../_components/ProtectedRoute";
import axios from "axios";
import { useAuth } from "@/app/(microestate)/Context/AuthProvider";

// Define a type for the property data coming from the API
interface Property {
  _id: string;
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  rent: {
    amount: number;
    currency: string;
  };
  status: "available" | "rented" | "maintenance" | "inactive";
  // Add other fields from your API response as needed
}

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {user}=  useAuth();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/microestate/api/properties");
      
      // Changes made by Priya - Ensuring properties is always an array to prevent filter error
      const propertiesData = response.data;
      if (Array.isArray(propertiesData)) {
        setProperties(propertiesData);
      } else if (propertiesData && Array.isArray(propertiesData.properties)) {
        setProperties(propertiesData.properties);
      } else if (propertiesData && Array.isArray(propertiesData.data)) {
        setProperties(propertiesData.data);
      } else {
        console.warn("Unexpected API response structure:", propertiesData);
        setProperties([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.error || "Failed to fetch properties."
      );
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!user || user.role !== "landlord") {
      router.push("/microestate/auth");
    } else {
      fetchProperties();
    }
  }, [user, router]);

  // Listen for route changes to refresh data when returning from edit page
  useEffect(() => {
    // Add event listener for when the page becomes visible or focused
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProperties();
      }
    };

    const handleFocus = () => {
      fetchProperties();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "rented":
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Rented
          </span>
        );
      case "available":
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Available
          </span>
        );
      case "maintenance":
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
            Maintenance
          </span>
        );
      case "inactive":
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            Inactive
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  // Changes made by Priya - Adding safety check to prevent filter error when properties is not an array
  const filteredProperties = Array.isArray(properties) ? properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Properties</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <FloatingCircles />
        <ParticleBackground />
        <AnimatedGradient />
        <div className="container mx-auto py-4 sm:py-6 lg:py-8 mt-4 sm:mt-6 lg:mt-8 relative z-10 px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <section className="mb-6 sm:mb-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="w-full sm:w-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">My Properties</h1>
                <p className="text-gray-400 text-sm sm:text-base">Manage your property listings</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link href="/microestate/landlord/properties/add" className="w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 sm:px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Add Property</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </Link>
                <Button onClick={fetchProperties} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl px-4 sm:px-6 py-3 shadow-lg shadow-gray-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">Sync</span>
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none text-sm sm:text-base"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-3 w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Filter</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Properties Grid */}
          <section className="animate-fadeIn">
            {filteredProperties.length === 0 ? (
              <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 sm:p-12 text-center">
                <Building className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Properties Found</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "No properties match your search criteria."
                    : "You haven't added any properties yet."}
                </p>
                <Link href="/microestate/landlord/properties/add" className="inline-block w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 sm:px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">
                          {property.title}
                        </h3>
                        <div className="flex items-start gap-2 text-gray-400 text-xs sm:text-sm mb-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{property.address.street}, {property.address.city}</span>
                        </div>
                        {getStatusBadge(property.status)}
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white ml-2 flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs sm:text-sm">Monthly Rent:</span>
                        <span className="text-white font-semibold text-sm sm:text-base">
                          ₹{property.rent.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs sm:text-sm">Status:</span>
                        <span className="text-white capitalize text-sm sm:text-base">{property.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/microestate/landlord/properties/${property._id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs sm:text-sm py-2 sm:py-3">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          View
                        </Button>
                      </Link>
                      <div className="flex gap-2 sm:gap-1">
                        <Link href={`/microestate/landlord/properties/${property._id}/edit`} className="flex-1 sm:flex-none">
                          <Button variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-xs sm:text-sm py-2 sm:py-3 px-3">
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-0" />
                            <span className="ml-1 sm:hidden">Edit</span>
                          </Button>
                        </Link>
                        <Button variant="outline" className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs sm:text-sm py-2 sm:py-3 px-3">
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-0" />
                          <span className="ml-1 sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
