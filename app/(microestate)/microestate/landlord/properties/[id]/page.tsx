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
  Save,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Background from "../../../../_components/Background";
import ProtectedRoute from "../../../../_components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const propertyId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
            err.response?.data?.error || "Failed to fetch property details"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();

      // Add event listener to refresh data when page becomes visible
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchProperty();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup event listener
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
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
          <div className="space-y-8">
            {/* Property Images - Enhanced Gallery */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-400" />
                Property Images
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Featured Image - Reduced Size */}
                <div className="lg:col-span-2">
                  <div className="aspect-[3/2] bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={property.images[0] || "/images/placeholder-property.jpg"}
                      alt="Main property image"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                {/* Thumbnail Images - Smaller */}
                <div className="space-y-3">
                  {property.images.slice(1, 4).map((image: string, index: number) => (
                    <div
                      key={index + 1}
                      className="aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={image}
                        alt={`Property image ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  {property.images.length === 1 && (
                    <div className="aspect-[3/2] bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No additional images</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details and Financial Summary - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Details - Enhanced */}
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-400" />
                  Property Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Type:
                    </span>
                    <span className="text-white font-medium capitalize">
                      {property.propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Bedrooms:
                    </span>
                    <span className="text-white font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Bathrooms:
                    </span>
                    <span className="text-white font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
                    <span className="text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Area:
                    </span>
                    <span className="text-white font-medium">
                      {property.squareFootage?.toLocaleString()} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Furnished:
                    </span>
                    <span className={`font-medium ${property.features.furnished ? 'text-green-400' : 'text-gray-400'}`}>
                      {property.features.furnished ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary - Enhanced */}
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  Financial Summary
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-500/10 to-orange-400/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        ₹{property.rent.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Monthly Rent</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-white mb-1">
                        ₹{property.securityDeposit.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Security Deposit</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-white mb-1">
                        {property.tenants?.length || 0}
                      </div>
                      <div className="text-xs text-gray-400">Active Tenants</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section - New */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-400" />
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(property.features).map(([feature, available]) => (
                  <div
                    key={feature}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      available
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-500'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${available ? 'text-green-400' : 'text-gray-600'}`} />
                    <span className="text-sm font-medium capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Description - New */}
            {property.description && (
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}
          </div>
        );

      case "tenants":
        return (
          <div className="space-y-8">
            {/* Tenants List Section */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Current Tenants
                </h3>
                <Button
                  onClick={() => setActiveTab("add-tenant")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tenant
                </Button>
              </div>
              
              {property.tenants && property.tenants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.tenants.map((tenant: any, index: number) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {tenant.firstName} {tenant.lastName}
                          </h4>
                          <p className="text-gray-400 text-sm">{tenant.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white">{tenant.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rent:</span>
                          <span className="text-white">₹{tenant.monthlyRent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">No Tenants Assigned</h4>
                  <p className="text-gray-400 mb-4">This property currently has no tenants assigned.</p>
                  <Button
                    onClick={() => setActiveTab("add-tenant")}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
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
        return <AddTenantForm propertyId={propertyId} onBack={() => setActiveTab("tenants")} />;

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
      const response = await axios.delete(`/microestate/api/properties/${propertyId}`);
      
      if (response.data.success) {
        // Redirect to properties list after successful deletion
        router.push("/microestate/landlord/properties");
      } else {
        setError("Failed to delete property. Please try again.");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Failed to delete property. Please try again.");
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
                  onClick={handleEditProperty}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1f] border border-red-500/30 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Property</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{property?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteProperty}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
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

// AddTenantForm component
function AddTenantForm({ propertyId, onBack }: { propertyId: string; onBack: () => void }) {
  const [formData, setFormData] = useState({
    tenantEmail: '',
    tenantFirstName: '',
    tenantLastName: '',
    tenantPhone: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    rentDueDate: '1',
    terms: ''
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.tenantFirstName) newErrors.tenantFirstName = 'First name is required';
    if (!formData.tenantLastName) newErrors.tenantLastName = 'Last name is required';
    if (!formData.tenantEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.tenantEmail)) newErrors.tenantEmail = 'Valid email required';
    if (!formData.tenantPhone || !/^\+?\d{10,15}$/.test(formData.tenantPhone)) newErrors.tenantPhone = 'Valid phone required';
    if (!formData.startDate) newErrors.startDate = 'Start date required';
    if (!formData.endDate) newErrors.endDate = 'End date required';
    if (!formData.monthlyRent || parseFloat(formData.monthlyRent) <= 0) newErrors.monthlyRent = 'Valid monthly rent required';
    if (!formData.securityDeposit || parseFloat(formData.securityDeposit) <= 0) newErrors.securityDeposit = 'Valid security deposit required';
    if (!formData.rentDueDate || parseInt(formData.rentDueDate) < 1 || parseInt(formData.rentDueDate) > 31) newErrors.rentDueDate = 'Valid rent due date required (1-31)';
    if (!formData.terms) newErrors.terms = 'Terms and conditions required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        // TODO: Submit new tenant data to API with propertyId
        console.log('Submitting tenant data for property:', propertyId, formData);
        alert('Tenant added successfully!');
        onBack(); // Go back to tenants list
      } catch (error) {
        console.error('Error adding tenant:', error);
        alert('Error adding tenant. Please try again.');
      }
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
          <p className="text-gray-400">Assign a tenant to this property with lease details</p>
        </div>
      </div>

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
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.tenantFirstName}
                  onChange={e => handleInputChange('tenantFirstName', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantFirstName ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter first name"
                />
                {errors.tenantFirstName && <div className="text-red-400 text-xs mt-1">{errors.tenantFirstName}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.tenantLastName}
                  onChange={e => handleInputChange('tenantLastName', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantLastName ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter last name"
                />
                {errors.tenantLastName && <div className="text-red-400 text-xs mt-1">{errors.tenantLastName}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={e => handleInputChange('tenantEmail', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantEmail ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter email address"
                />
                {errors.tenantEmail && <div className="text-red-400 text-xs mt-1">{errors.tenantEmail}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.tenantPhone}
                  onChange={e => handleInputChange('tenantPhone', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantPhone ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter phone number"
                />
                {errors.tenantPhone && <div className="text-red-400 text-xs mt-1">{errors.tenantPhone}</div>}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => handleInputChange('startDate', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.startDate ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.startDate && <div className="text-red-400 text-xs mt-1">{errors.startDate}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => handleInputChange('endDate', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.endDate ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.endDate && <div className="text-red-400 text-xs mt-1">{errors.endDate}</div>}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRent}
                  onChange={e => handleInputChange('monthlyRent', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.monthlyRent ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="0.00"
                />
                {errors.monthlyRent && <div className="text-red-400 text-xs mt-1">{errors.monthlyRent}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Security Deposit *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={e => handleInputChange('securityDeposit', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.securityDeposit ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="0.00"
                />
                {errors.securityDeposit && <div className="text-red-400 text-xs mt-1">{errors.securityDeposit}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rent Due Date *</label>
                <select
                  value={formData.rentDueDate}
                  onChange={e => handleInputChange('rentDueDate', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.rentDueDate ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors`}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {errors.rentDueDate && <div className="text-red-400 text-xs mt-1">{errors.rentDueDate}</div>}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Lease Terms *</label>
              <textarea
                value={formData.terms}
                onChange={e => handleInputChange('terms', e.target.value)}
                rows={4}
                className={`w-full p-3 bg-[#1a1a1f] border ${errors.terms ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none`}
                placeholder="Enter lease terms and conditions..."
              />
              {errors.terms && <div className="text-red-400 text-xs mt-1">{errors.terms}</div>}
            </div>
          </div>

          <div className="flex items-center justify-end mt-8 pt-6 border-t border-[#2a2a2f]">
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
