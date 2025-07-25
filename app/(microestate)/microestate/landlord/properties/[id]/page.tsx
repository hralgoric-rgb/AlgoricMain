"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Background from "../../../../_components/Background";
import ProtectedRoute from "../../../../_components/ProtectedRoute";
import { useParams } from "next/navigation";
import axios from "axios";

// Define a type for the property data from the API
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
  // Note: tenants, documents, and payments might need separate API calls
  // For now, we'll use placeholder data for those tabs.
  tenants?: any[];
  documents?: any[];
  payments?: any[];
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `/microestate/api/properties/${propertyId}`
          );
          setProperty(response.data);
          setError(null);
        } catch (err: any) {
          console.error("Fetch error:", err);
          setError(
            err.response?.data?.error || "Failed to fetch property details."
          );
          setProperty(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [propertyId]);

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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case "overdue":
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            Overdue
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

  const renderTabContent = () => {
    if (!property) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Property Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Property Images
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-800 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Property Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white capitalize">
                      {property.propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bedrooms:</span>
                    <span className="text-white">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bathrooms:</span>
                    <span className="text-white">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Area:</span>
                    <span className="text-white">
                      {property.squareFootage} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Furnished:</span>
                    <span className="text-white">
                      {property.features.furnished ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Financial Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    ₹{property.rent.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Monthly Rent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    ₹{property.securityDeposit.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Security Deposit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {property.tenants?.length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Tenants</div>
                </div>
              </div>
            </div>
          </div>
        );

      // ... other cases for documents, tenants, payments would go here
      // They will need their own data fetching logic if not part of the main property object.
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
        <Background />
        <div className="container mx-auto py-10 mt-24 relative z-10">
          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/microestate/landlord/properties">
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {property.title}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{`${property.address.street}, ${property.address.city}`}</span>
                  </div>
                  {getStatusBadge(property.status)}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-2">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-[#1a1a1f]"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Tab Content */}
          <section className="animate-fadeIn">{renderTabContent()}</section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
