"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Home,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingCircles, ParticleBackground, AnimatedGradient } from "../../../../_components/Background";
import ProtectedRoute from "../../../../_components/ProtectedRoute";
import { useRouter } from "next/navigation";
import axios from "axios";

// Updated FormData interface to match your Property model exactly
interface FormData {
  title: string;
  description: string;
  rent: {
    amount: string;
    currency: string;
    period: string;
  };
  securityDeposit: string;
  propertyType: string;
  squareFootage: string; // This matches your model
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  images: File[];
  availableFrom?: string;
  status: "available" | "rented" | "maintenance" | "inactive";
  bedrooms: string;
  bathrooms: string;
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
  leaseTerms: {
    minimumTerm: number;
    maximumTerm: number;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    maxOccupants?: number;
    depositRequired: boolean;
  };
  utilities: {
    includedInRent: string[];
    tenantResponsible: string[];
  };
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    rent: {
      amount: "",
      currency: "INR",
      period: "monthly",
    },
    securityDeposit: "",
    propertyType: "",
    squareFootage: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
    images: [],
    status: "available",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    features: {
      parking: false,
      gym: false,
      pool: false,
      laundry: false,
      airConditioning: false,
      heating: false,
      internet: false,
      furnished: false,
      balcony: false,
      garden: false,
    },
    leaseTerms: {
      minimumTerm: 6,
      maximumTerm: 24,
      petsAllowed: false,
      smokingAllowed: false,
      maxOccupants: 4,
      depositRequired: true,
    },
    utilities: {
      includedInRent: [],
      tenantResponsible: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const steps = [
    { id: 1, title: "Basic Info", icon: Building },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Details", icon: FileText },
    { id: 4, title: "Features", icon: Home },
    { id: 5, title: "Images", icon: Upload },
  ];

  // Property types array - Updated to match database schema and UI dropdown requirements
  // Includes all property types: apartment, house, villa, studio, penthouse, duplex, townhouse, condo
  const propertyTypes = [
    "apartment",
    "house",
    "villa",
    "studio",
    "penthouse",
    "duplex",
    "townhouse",
    "condo",
  ];

  const amenities = [
    "WiFi",
    "Parking",
    "Gym",
    "Pool",
    "Laundry",
    "Air Conditioning",
    "Heating",
    "Furnished",
    "Balcony",
    "Garden",
    "Security",
    "Elevator",
    "Pet Friendly",
    "Smoking Allowed",
  ];

  const utilities = [
    "Electricity",
    "Water",
    "Gas",
    "Internet",
    "Cable TV",
    "Garbage Collection",
    "Maintenance",
  ];

  const handleInputChange = (
    field: string,
    value: any,
    nestedField?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: nestedField
        ? {
            ...(prev[field as keyof FormData] as Record<string, any>),
            [nestedField]: value,
          }
        : value,
    }));
  };

  const handleFeatureToggle = (feature: keyof FormData["features"]) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleUtilityToggle = (
    utility: string,
    type: "includedInRent" | "tenantResponsible"
  ) => {
    setFormData((prev) => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [type]: prev.utilities[type].includes(utility)
          ? prev.utilities[type].filter((u) => u !== utility)
          : [...prev.utilities[type], utility],
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title || !formData.description || !formData.rent.amount) {
          setError("Please fill in all required fields in Basic Info.");
          return false;
        }
        break;
      case 2:
        if (
          !formData.address.street ||
          !formData.address.city ||
          !formData.address.state ||
          !formData.address.zipCode
        ) {
          setError("Please fill in all address fields.");
          return false;
        }
        break;
      case 3:
        if (
          !formData.propertyType ||
          !formData.bedrooms ||
          !formData.bathrooms ||
          !formData.squareFootage
        ) {
          setError("Please fill in all property details.");
          return false;
        }
        break;
      case 4:
        // Features step is optional
        break;
      case 5:
        if (formData.images.length === 0) {
          setError("Please upload at least one image.");
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError(null);

    try {
      // First, upload all images
      const imageUrls: string[] = [];
      for (const image of formData.images) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);

        try {
          const imageUploadResponse = await axios.post(
            "/microestate/api/upload",
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (imageUploadResponse.data.url) {
            imageUrls.push(imageUploadResponse.data.url);
          } else {
            throw new Error("Failed to get image URL from upload response");
          }
        } catch (uploadError: any) {
          console.error("Image upload error:", uploadError);
          throw new Error(
            `Failed to upload image: ${
              uploadError.response?.data?.error || uploadError.message
            }`
          );
        }
      }

      // Prepare property data for API
      const propertyData = {
        title: formData.title,
        description: formData.description,
        rent: {
          amount: parseFloat(formData.rent.amount),
          currency: formData.rent.currency,
          period: formData.rent.period,
        },
        securityDeposit: parseFloat(formData.securityDeposit),
        propertyType: formData.propertyType,
        squareFootage: parseInt(formData.squareFootage),
        address: formData.address,
        images: imageUrls,
        status: formData.status,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        amenities: formData.amenities,
        features: formData.features,
        leaseTerms: formData.leaseTerms,
        utilities: formData.utilities,
        availableFrom: formData.availableFrom,
      };

      console.log("🏗️ Creating property with uploaded images:", propertyData);

      const response = await axios.post(
        "/microestate/api/properties",
        propertyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Property created successfully:", response.data);

      setSuccess(true);
      setLoading(false);

      // Redirect to properties list after a short delay
      setTimeout(() => {
        router.push("/microestate/landlord/properties");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Error creating property:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to create property. Please try again."
      );
      setLoading(false);
    }
  };

  const renderImagePreview = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-gray-400">Click to upload images</span>
            <span className="text-sm text-gray-500">
              Supports: JPG, PNG, GIF (Max 5MB each)
            </span>
          </label>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                placeholder="Enter property title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                placeholder="Describe your property..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  value={formData.rent.amount}
                  onChange={(e) =>
                    handleInputChange("rent", e.target.value, "amount")
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    handleInputChange("securityDeposit", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  handleInputChange("address", e.target.value, "street")
                }
                className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "city")
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "state")
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "zipCode")
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) =>
                  handleInputChange("propertyType", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleInputChange("bathrooms", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Square Footage *
                </label>
                <input
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) =>
                    handleInputChange("squareFootage", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Available From
              </label>
              <input
                type="date"
                value={formData.availableFrom || ""}
                onChange={(e) =>
                  handleInputChange("availableFrom", e.target.value)
                }
                className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Property Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.features).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() =>
                        handleFeatureToggle(key as keyof FormData["features"])
                      }
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-white">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Utilities
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Included in Rent
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {utilities.map((utility) => (
                      <label
                        key={utility}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.utilities.includedInRent.includes(
                            utility
                          )}
                          onChange={() =>
                            handleUtilityToggle(utility, "includedInRent")
                          }
                          className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-white">{utility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Tenant Responsible
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {utilities.map((utility) => (
                      <label
                        key={utility}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.utilities.tenantResponsible.includes(
                            utility
                          )}
                          onChange={() =>
                            handleUtilityToggle(utility, "tenantResponsible")
                          }
                          className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="text-white">{utility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Property Images *
              </h3>
              <p className="text-gray-400 mb-4">
                Upload high-quality images of your property. First image will be
                the cover photo.
              </p>
              {renderImagePreview()}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <FloatingCircles />
        <ParticleBackground />
        <AnimatedGradient />
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
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Add New Property
                </h1>
                <p className="text-gray-400">Create a new property listing</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.id
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-gray-600 text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.id
                            ? "bg-orange-500"
                            : "bg-gray-600"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Form Content */}
          <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
            {renderStepContent()}

            {/* Error and Success Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-fadeIn">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm animate-fadeIn flex items-center gap-2">
                <Check className="w-4 h-4" />
                Property created successfully! Redirecting to properties list...
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2a2a2f]">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || success}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Create Property
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
