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
        <div className="container mx-auto py-4 mt-8 relative z-10">

          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">My Properties</h1>
                <p className="text-gray-400">Manage your property listings</p>
              </div>
              <div className="flex gap-2">
                <Link href="/microestate/landlord/properties/add">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </Link>
                <Button onClick={fetchProperties} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-gray-500/25 transition-all duration-300 hover:scale-105">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Properties Grid */}
          <section className="animate-fadeIn">
            {filteredProperties.length === 0 ? (
              <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-12 text-center">
                <Building className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Properties Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "No properties match your search criteria."
                    : "You haven't added any properties yet."}
                </p>
                <Link href="/microestate/landlord/properties/add">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{property.address.street}, {property.address.city}</span>
                        </div>
                        {getStatusBadge(property.status)}
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Monthly Rent:</span>
                        <span className="text-white font-semibold">
                          ₹{property.rent.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white capitalize">{property.status}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/microestate/landlord/properties/${property._id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/microestate/landlord/properties/${property._id}/edit`}>
                        <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
