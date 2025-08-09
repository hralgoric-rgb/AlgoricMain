"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Building,
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Eye,
  Download,
  Plus,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Save,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingCircles, ParticleBackground, AnimatedGradient } from "../../../../_components/Background";
import ProtectedRoute from "../../../../_components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// Enhanced interfaces for better type safety
interface Property {
  _id: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  rent: {
    amount: number;
    currency: string;
    period: string;
  };
  securityDeposit: number;
  amenities: string[];
  features: {
    parking: boolean;
    gym: boolean;
    pool: boolean;
    laundry: boolean;
    airConditioning: boolean;
    heating: boolean;
    internet: boolean;
    furnished: boolean;
    balcony: boolean;
    garden: boolean;
  };
  images: string[];
  status: "available" | "rented" | "maintenance" | "inactive";
}

interface TenantInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface LeaseInfo {
  _id: string;
  tenantId: TenantInfo;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: number;
  status: "draft" | "active" | "expired" | "terminated";
  terms: string;
  createdAt: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<LeaseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantsLoading, setTenantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenantsError, setTenantsError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch property details
  const fetchProperty = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `/microestate/api/properties/${propertyId}`
      );
      setProperty(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch property error:", err);
      setError(err.response?.data?.error || "Failed to fetch property details");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  // Fetch tenants for this property
  const fetchTenants = useCallback(async () => {
    if (!propertyId) return;
    try {
      setTenantsLoading(true);
      setTenantsError(null);
      const response = await axios.get(
        `/microestate/api/properties/${propertyId}/tenant`
      );

      if (response.data.success) {
        setTenants(response.data.data);
      } else {
        setTenants([]);
        setTenantsError(response.data.message);
      }
    } catch (err: any) {
      console.error("Fetch tenants error:", err);
      setTenants([]);
      setTenantsError(err.response?.data?.message || "Failed to fetch tenants");
    } finally {
      setTenantsLoading(false);
    }
  }, [propertyId]);

  // Handle successful tenant addition - FIXED: Removed circular dependency
  const handleTenantAdded = useCallback(async () => {
    toast.success("Tenant added successfully!");
    // Call the functions directly instead of using refreshData
    await Promise.all([fetchProperty(), fetchTenants()]);
    setActiveTab("tenants"); // Switch back to tenants tab
  }, [fetchProperty, fetchTenants]);

  // Initial data fetch - FIXED: Only fetch on mount
  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, fetchProperty]);

  // Fetch tenants when switching to tenants tab - FIXED: Removed circular dependency
  useEffect(() => {
    if (activeTab === "tenants" && propertyId) {
      fetchTenants();
    }
  }, [activeTab, propertyId, fetchTenants]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "tenants", label: "Tenants", icon: Users },
    { id: "payments", label: "Payment Logs", icon: CreditCard },
  ];

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

  const getLeaseStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Active
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Draft
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            Expired
          </span>
        );
      case "terminated":
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
            Terminated
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Manual refresh function
  const handleRefresh = async () => {
    await Promise.all([fetchProperty(), fetchTenants()]);
  };

  const renderTabContent = () => {
    if (!property) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Property Images */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-400" />
                Property Images
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <div className="aspect-[16/10] sm:aspect-[3/2] bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={
                        property.images[0] || "/images/placeholder-property.jpg"
                      }
                      alt="Main property image"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3">
                  {property.images
                    .slice(1, 4)
                    .map((image: string, index: number) => (
                      <div
                        key={index + 1}
                        className="aspect-square lg:aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <img
                          src={image}
                          alt={`Property image ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  {property.images.length === 1 && (
                    <div className="aspect-square lg:aspect-[3/2] bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs sm:text-sm text-center px-2">
                        No additional images
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details and Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-400" />
                  Property Details
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      Type:
                    </span>
                    <span className="text-white font-medium capitalize text-sm sm:text-base">
                      {property.propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      Bedrooms:
                    </span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {property.bedrooms}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      Bathrooms:
                    </span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {property.bathrooms}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      Area:
                    </span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {property.squareFootage?.toLocaleString()} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3">
                    <span className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      Furnished:
                    </span>
                    <span
                      className={`font-medium text-sm sm:text-base ${
                        property.features.furnished
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {property.features.furnished ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  Financial Summary
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-400/10 border border-orange-500/20 rounded-xl p-3 sm:p-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        ₹{property.rent.amount.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">Monthly Rent</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center max-w-xs w-full">
                      <div className="text-lg sm:text-xl font-bold text-white mb-1">
                        ₹{property.securityDeposit.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        Security Deposit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                Amenities & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(property.features).map(
                  ([feature, available]) => (
                    <div
                      key={feature}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                        available
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-gray-800/50 border-gray-700/50 text-gray-500"
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 flex-shrink-0 ${
                          available ? "text-green-400" : "text-gray-600"
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-medium capitalize truncate">
                        {feature.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Property Description */}
            {property.description && (
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {property.description}
                </p>
              </div>
            )}
          </div>
        );

      case "tenants":
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Current Tenants
                  {tenantsLoading && (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  )}
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={fetchTenants}
                    disabled={tenantsLoading}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm sm:text-base"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        tenantsLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => setActiveTab("add-tenant")}
                    disabled={property.status !== "available"}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-3 sm:px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tenant
                  </Button>
                </div>
              </div>

              {property.status !== "available" && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Property is currently {property.status}. New tenants can only
                  be added to available properties.
                </div>
              )}

              {tenantsError ? (
                <div className="text-center py-8 sm:py-12">
                  <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2 text-sm sm:text-base">
                    Error Loading Tenants
                  </h4>
                  <p className="text-gray-400 mb-4 text-xs sm:text-sm px-4">{tenantsError}</p>
                  <Button
                    onClick={fetchTenants}
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm sm:text-base"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : tenants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {tenants.map((lease) => (
                    <div
                      key={lease._id}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 sm:p-4 hover:border-orange-500/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm sm:text-base truncate">
                            {lease.tenantId.firstName} {lease.tenantId.lastName}
                          </h4>
                          <p className="text-gray-400 text-xs sm:text-sm truncate">
                            {lease.tenantId.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {getLeaseStatusBadge(lease.status)}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white truncate ml-2">
                            {lease.tenantId.phone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Monthly Rent:</span>
                          <span className="text-white">
                            ₹{lease.monthlyRent.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-gray-400 flex-shrink-0">Lease Period:</span>
                          <span className="text-white text-right text-xs ml-2">
                            {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rent Due:</span>
                          <span className="text-white">
                            {lease.rentDueDate} of each month
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-700/50 flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs sm:text-sm"
                        >
                          Terminate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 px-4">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2 text-sm sm:text-base">
                    No Tenants Assigned
                  </h4>
                  <p className="text-gray-400 mb-4 text-xs sm:text-sm">
                    This property currently has no tenants assigned.
                  </p>
                  <Button
                    onClick={() => setActiveTab("add-tenant")}
                    disabled={property.status !== "available"}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-3 sm:px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Tenant
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case "add-tenant":
        return (
          <AddTenantForm
            propertyId={propertyId}
            property={property}
            onBack={() => setActiveTab("tenants")}
            onTenantAdded={handleTenantAdded}
          />
        );

      case "documents":
        return (
          <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-10 text-center">
            <h3 className="text-lg font-semibold text-white">
              Feature Not Implemented
            </h3>
            <p className="text-gray-400 mt-2">
              This section is under construction.
            </p>
          </div>
        );

      case "payments":
        return (
          <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-10 text-center">
            <h3 className="text-lg font-semibold text-white">
              Feature Not Implemented
            </h3>
            <p className="text-gray-400 mt-2">
              This section is under construction.
            </p>
          </div>
        );

      default:
        return (
          <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-10 text-center">
            <h3 className="text-lg font-semibold text-white">
              Feature Not Implemented
            </h3>
            <p className="text-gray-400 mt-2">
              This section is under construction.
            </p>
          </div>
        );
    }
  };

  const handleEditProperty = () => {
    router.push(`/microestate/landlord/properties/${propertyId}/edit`);
  };

  const handleDeleteProperty = async () => {
    if (!property) return;

    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        `/microestate/api/properties/${propertyId}`
      );

      if (response.data.success) {
        toast.success("Property deleted successfully!");
        router.push("/microestate/landlord/properties");
      } else {
        toast.error("Failed to delete property. Please try again.");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.error ||
          "Failed to delete property. Please try again."
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
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
        <h2 className="text-2xl font-bold mb-2">Error Fetching Property</h2>
        <p className="text-gray-400">{error}</p>
        <Link href="/microestate/landlord/properties" className="mt-6">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Building className="w-12 h-12 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-gray-400">
          The property you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link href="/microestate/landlord/properties" className="mt-6">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <FloatingCircles />
        <ParticleBackground />
        <AnimatedGradient />
        <div className="container mx-auto py-6 sm:py-8 lg:py-10 mt-16 sm:mt-20 lg:mt-24 relative z-10 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="mb-6 sm:mb-8 animate-fadeIn">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href="/microestate/landlord/properties">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Properties
                  </Button>
                </Link>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate">
                    {property.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base min-w-0">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{`${property.address.street}, ${property.address.city}`}</span>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm sm:text-base"
                  onClick={handleEditProperty}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm sm:text-base"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-2">
              <div className="flex flex-wrap gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none justify-center ${
                      activeTab === tab.id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-[#1a1a1f]"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Tab Content */}
          <section className="animate-fadeIn">{renderTabContent()}</section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1f] border border-red-500/30 rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Delete Property
              </h3>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete "{property?.title}"? This action
              cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-sm sm:text-base"
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteProperty}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Property"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

// Enhanced AddTenantForm component
function AddTenantForm({
  propertyId,
  property,
  onBack,
  onTenantAdded,
}: {
  propertyId: string;
  property: Property;
  onBack: () => void;
  onTenantAdded: () => void;
}) {
  const [formData, setFormData] = useState({
    tenantEmail: "",
    tenantFirstName: "",
    tenantLastName: "",
    tenantPhone: "",
    startDate: "",
    endDate: "",
    monthlyRent: property.rent.amount.toString(),
    securityDeposit: property.securityDeposit.toString(),
    rentDueDate: "1",
    terms: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: any = {};

    if (!formData.tenantFirstName)
      newErrors.tenantFirstName = "First name is required";
    if (!formData.tenantLastName)
      newErrors.tenantLastName = "Last name is required";
    if (
      !formData.tenantEmail ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.tenantEmail)
    )
      newErrors.tenantEmail = "Valid email required";
    if (!formData.tenantPhone || !/^\+?\d{10,15}$/.test(formData.tenantPhone))
      newErrors.tenantPhone = "Valid phone required";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    if (!formData.monthlyRent || parseFloat(formData.monthlyRent) <= 0)
      newErrors.monthlyRent = "Valid monthly rent required";
    if (!formData.securityDeposit || parseFloat(formData.securityDeposit) <= 0)
      newErrors.securityDeposit = "Valid security deposit required";
    if (
      !formData.rentDueDate ||
      parseInt(formData.rentDueDate) < 1 ||
      parseInt(formData.rentDueDate) > 31
    )
      newErrors.rentDueDate = "Valid rent due date required (1-31)";
    if (!formData.terms) newErrors.terms = "Terms and conditions required";

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix all validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...formData,
      monthlyRent: parseFloat(formData.monthlyRent),
      securityDeposit: parseFloat(formData.securityDeposit),
      rentDueDate: parseInt(formData.rentDueDate, 10),
    };

    try {
      const response = await axios.post(
        `/microestate/api/properties/${propertyId}/tenant`,
        payload
      );

      if (response.data.success) {
        onTenantAdded(); // This will handle the success notification and navigation
      } else {
        setErrors({
          api: response.data.message || "An unknown error occurred.",
        });
        toast.error(response.data.message || "Failed to add tenant.");
      }
    } catch (error: any) {
      console.error("Error adding tenant:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add tenant. Please try again.";
      setErrors({ api: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tenants
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Tenant</h1>
          <p className="text-gray-400">
            Assign a tenant to {property.title} with lease details
          </p>
        </div>
      </div>

      {/* Property Status Check */}
      {property.status !== "available" && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          <AlertTriangle className="w-5 h-5 inline mr-2" />
          <strong>Warning:</strong> This property is currently marked as "
          {property.status}". You may encounter issues adding a new tenant.
        </div>
      )}

      {/* Add Tenant Form */}
      <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tenant Personal Information */}
          <div className="border-b border-[#2a2a2f] pb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Tenant Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.tenantFirstName}
                  onChange={(e) =>
                    handleInputChange("tenantFirstName", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.tenantFirstName
                      ? "border-red-500"
                      : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter first name"
                />
                {errors.tenantFirstName && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.tenantFirstName}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.tenantLastName}
                  onChange={(e) =>
                    handleInputChange("tenantLastName", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.tenantLastName
                      ? "border-red-500"
                      : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter last name"
                />
                {errors.tenantLastName && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.tenantLastName}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) =>
                    handleInputChange("tenantEmail", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.tenantEmail ? "border-red-500" : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter email address"
                />
                {errors.tenantEmail && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.tenantEmail}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.tenantPhone}
                  onChange={(e) =>
                    handleInputChange("tenantPhone", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.tenantPhone ? "border-red-500" : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter phone number"
                />
                {errors.tenantPhone && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.tenantPhone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lease Dates */}
          <div className="border-b border-[#2a2a2f] pb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Lease Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.startDate ? "border-red-500" : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.startDate && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.startDate}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.endDate ? "border-red-500" : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.endDate && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.endDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-b border-[#2a2a2f] pb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              Financial Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monthly Rent *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRent}
                  onChange={(e) =>
                    handleInputChange("monthlyRent", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.monthlyRent ? "border-red-500" : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="0.00"
                />
                {errors.monthlyRent && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.monthlyRent}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Security Deposit *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    handleInputChange("securityDeposit", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.securityDeposit
                      ? "border-red-500"
                      : "border-[#2a2a2f]"
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="0.00"
                />
                {errors.securityDeposit && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.securityDeposit}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rent Due Date *
                </label>
                <select
                  value={formData.rentDueDate}
                  onChange={(e) =>
                    handleInputChange("rentDueDate", e.target.value)
                  }
                  className={`w-full p-3 bg-[#1a1a1f] border ${
                    errors.rentDueDate ? "border-red-500" : "border-[#2a2a2f]"
                  } rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors`}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {errors.rentDueDate && (
                  <div className="text-red-400 text-xs mt-1">
                    {errors.rentDueDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Terms and Conditions
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lease Terms *
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) => handleInputChange("terms", e.target.value)}
                rows={4}
                className={`w-full p-3 bg-[#1a1a1f] border ${
                  errors.terms ? "border-red-500" : "border-[#2a2a2f]"
                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none`}
                placeholder="Enter lease terms and conditions..."
              />
              {errors.terms && (
                <div className="text-red-400 text-xs mt-1">{errors.terms}</div>
              )}
            </div>
          </div>

          {/* Display API error message */}
          {errors.api && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <strong>Error:</strong> {errors.api}
            </div>
          )}

          <div className="flex items-center justify-end mt-8 pt-6 border-t border-[#2a2a2f] gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Tenant...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Tenant
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
