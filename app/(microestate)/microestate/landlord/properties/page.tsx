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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Background from "../../../_components/Background";
import ProtectedRoute from "../../../_components/ProtectedRoute";
import axios from "axios";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/microestate/api/properties");
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          setError(response.data.error || "Failed to fetch properties.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching your properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const fullAddress = `${property.address.street}, ${property.address.city}, ${property.address.state}`;
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <div className="container mx-auto py-4 mt-8 relative z-10">

          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent">
                  Properties
                </h1>
                <p className="text-gray-400">
                  Manage all your properties and view their status
                </p>
              </div>
              <Link href="/microestate/landlord/properties/add">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="dashboard-gradient-card">
                <div className="bg-[#181a20] rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Building className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                    <span className="text-2xl font-bold text-white">
                      {properties.length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 font-semibold">
                    Total Properties
                  </div>
                </div>
              </div>

              <div className="dashboard-gradient-card">
                <div className="bg-[#181a20] rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <span className="text-2xl font-bold text-white">
                      {properties.filter((p) => p.status === "rented").length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 font-semibold">
                    Rented
                  </div>
                </div>
              </div>

              <div className="dashboard-gradient-card">
                <div className="bg-[#181a20] rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                      {
                        properties.filter((p) => p.status === "available")
                          .length
                      }
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 font-semibold">
                    Available
                  </div>
                </div>
              </div>

              <div className="dashboard-gradient-card">
                <div className="bg-[#181a20] rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                    <span className="text-2xl font-bold text-white">
                      ₹
                      {properties
                        .reduce((sum, p) => sum + p.rent.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 font-semibold">
                    Total Monthly Rent
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-glass border border-transparent border-orange-500/30 shadow-xl rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-transparent transition-colors"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-transparent transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>

                <Button
                  variant="outline"
                  className="border-transparent border-orange-500 text-orange-500 bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-transparent hover:border-red-500 hover:text-red-500 px-6 py-3 rounded-xl transition-all duration-300"
                >
                  <Filter className="w-4 h-4 mr-2 text-orange-500" />
                  More Filters
                </Button>
              </div>
            </div>
          </section>

          {/* Properties Table */}
          <section className="bg-glass border border-transparent border-orange-500/30 shadow-xl rounded-2xl p-6 animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2f]">
                    <th className="pb-4 text-gray-400 font-semibold">
                      Property
                    </th>
                    <th className="pb-4 text-gray-400 font-semibold">
                      Address
                    </th>
                    <th className="pb-4 text-gray-400 font-semibold">Rent</th>
                    <th className="pb-4 text-gray-400 font-semibold">Status</th>
                    <th className="pb-4 text-gray-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {filteredProperties.map((property) => (
                    <tr
                      key={property._id}
                      className="border-b border-[#2a2a2f] hover:bg-[#1a1a1f] transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              ID: {property._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{`${property.address.street}, ${property.address.city}`}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                          <span className="font-semibold">
                            ₹{property.rent.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/microestate/landlord/properties/${property._id}`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-transparent border-orange-500 text-orange-500 bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-transparent hover:border-red-500 hover:text-red-500"
                            >
                              <Eye className="w-4 h-4 text-orange-500" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search or filters, or add your first
                  property.
                </p>
                <Link href="/microestate/landlord/properties/add">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-6 py-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    // </ProtectedRoute>
  );
}
