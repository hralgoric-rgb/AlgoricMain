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
import Background from "../../../../_components/Background";
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
    propertyType: "apartment",
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
      minimumTerm: 12,
      maximumTerm: 12,
      petsAllowed: false,
      smokingAllowed: false,
      depositRequired: true,
    },
    utilities: {
      includedInRent: [],
      tenantResponsible: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const steps = [
    { id: 1, title: "Basic Info", icon: Home },
    { id: 2, title: "Rent & Location", icon: DollarSign },
    { id: 3, title: "Features & Images", icon: FileText },
    { id: 4, title: "Review", icon: Check },
  ];

  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "studio", label: "Studio" },
  ];

  const availableAmenities = [
    "swimming_pool",
    "gym",
    "parking",
    "elevator",
    "security",
    "power_backup",
    "water_supply",
    "internet",
    "ac",
    "balcony",
    "garden",
    "playground",
  ];

  const utilityOptions = [
    "electricity",
    "water",
    "gas",
    "internet",
    "cable_tv",
    "maintenance",
    "security",
    "parking",
  ];

  // Handle input changes
  const handleInputChange = (
    field: string,
    value: any,
    nestedField?: string
  ) => {
    if (field === "address" && nestedField) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [nestedField]: value,
        },
      }));
    } else if (field === "rent" && nestedField) {
      setFormData((prev) => ({
        ...prev,
        rent: {
          ...prev.rent,
          [nestedField]: value,
        },
      }));
    } else if (field === "features" && nestedField) {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [nestedField]: value,
        },
      }));
    } else if (field === "leaseTerms" && nestedField) {
      setFormData((prev) => ({
        ...prev,
        leaseTerms: {
          ...prev.leaseTerms,
          [nestedField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    setError("");

    switch (currentStep) {
      case 1:
        if (
          !formData.title ||
          !formData.description ||
          !formData.propertyType
        ) {
          setError("Please fill in all required fields in Basic Info");
          return false;
        }
        break;
      case 2:
        if (
          !formData.rent.amount ||
          !formData.securityDeposit ||
          !formData.address.street ||
          !formData.address.city
        ) {
          setError("Please fill in all required fields in Rent & Location");
          return false;
        }
        break;
      case 3:
        // Images are optional as we'll use placeholder
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrls: string[] = [];

      // Step 1: Upload images if any
      if (formData.images.length > 0) {
        console.log("📸 Uploading images first...");
        setError("Uploading images...");

        const imageFormData = new FormData();

        // Add files
        formData.images.forEach((file) => {
          imageFormData.append("images", file);
        });

        // Add upload configuration
        imageFormData.append("uploadType", "property");
        imageFormData.append("watermark", "true");
        imageFormData.append("resize", "true");
        imageFormData.append("maxWidth", "800");
        imageFormData.append("maxHeight", "600");

        try {
          const imageUploadResponse = await axios.post(
            "/microestate/api/upload",
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 30000,
            }
          );

          if (imageUploadResponse.data.success) {
            // Updated to use the new response structure
            imageUrls = imageUploadResponse.data.files.map(
              (file: any) => file.url
            );
            console.log("✅ Images uploaded successfully:", imageUrls);
            setError("Images uploaded successfully! Creating property...");
          } else {
            throw new Error(
              imageUploadResponse.data.error || "Image upload failed"
            );
          }
        } catch (uploadError: any) {
          console.warn("⚠️ Image upload failed:", uploadError.message);

          const continueWithoutImages = window.confirm(
            `Image upload failed: ${uploadError.message}\n\nDo you want to create the property without images? A placeholder image will be used.`
          );

          if (!continueWithoutImages) {
            setError(`Image upload failed: ${uploadError.message}`);
            setLoading(false);
            return;
          }

          imageUrls = [
            "https://via.placeholder.com/400x300?text=Property+Image",
          ];
          setError("Continuing without images...");
        }
      } else {
        console.log("📸 No images to upload, using placeholder");
        imageUrls = ["https://via.placeholder.com/400x300?text=Property+Image"];
      }

      // Step 2: Create property with image URLs
      setError("Creating property...");

      const propertyData = {
        title: formData.title,
        description: formData.description,
        rent: {
          amount: parseInt(formData.rent.amount),
          currency: formData.rent.currency,
          period: formData.rent.period,
        },
        securityDeposit: parseInt(formData.securityDeposit),
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1,
        squareFootage: formData.squareFootage
          ? parseInt(formData.squareFootage)
          : undefined,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state || "Delhi",
          zipCode: formData.address.zipCode || "110001",
          country: formData.address.country,
        },
        status: formData.status,
        amenities: formData.amenities,
        features: formData.features,
        images: imageUrls,
        leaseTerms: formData.leaseTerms,
        utilities: formData.utilities,
        availableFrom: formData.availableFrom
          ? new Date(formData.availableFrom)
          : new Date(),
        lastUpdated: new Date(),
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

      if (response.data.success) {
        setSuccess(true);
        setError("");
        console.log(
          "✅ Property created successfully:",
          response.data.property
        );
        setTimeout(() => {
          router.push("/microestate/landlord/properties");
        }, 2000);
      } else {
        setError(response.data.error || "Failed to create property");
      }
    } catch (err: any) {
      console.error("❌ Error creating property:", err);

      let errorMessage = "Failed to create property. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        if (Array.isArray(err.response.data.details)) {
          const validationErrors = err.response.data.details
            .map((detail: any) => `${detail.field}: ${detail.message}`)
            .join(", ");
          errorMessage = `Validation failed: ${validationErrors}`;
        } else {
          errorMessage = `Error: ${err.response.data.details}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add image preview component to your form
  const renderImagePreview = () => {
    if (formData.images.length === 0) return null;

    return (
      <div className="mt-4">
        <h5 className="text-sm font-medium text-gray-300 mb-2">
          Image Preview ({formData.images.length} files)
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((file, idx) => (
            <div
              key={idx}
              className="bg-[#23232a] rounded-lg p-2 flex flex-col items-center relative"
            >
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-10"
              >
                ×
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-24 object-cover rounded mb-1"
              />
              <span className="text-xs text-gray-300 truncate w-full text-center">
                {file.name}
              </span>
              <span className="text-xs text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ))}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter property title"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter property description"
                rows={4}
                maxLength={2000}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) =>
                  handleInputChange("propertyType", e.target.value)
                }
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    handleInputChange("bedrooms", e.target.value)
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Number of bedrooms"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleInputChange("bathrooms", e.target.value)
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Number of bathrooms"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Square Footage
                </label>
                <input
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) =>
                    handleInputChange("squareFootage", e.target.value)
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Square footage"
                  min="1"
                  max="50000"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rent Amount *
                </label>
                <input
                  type="number"
                  value={formData.rent.amount}
                  onChange={(e) =>
                    handleInputChange("rent", e.target.value, "amount")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Rent amount"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.rent.currency}
                  onChange={(e) =>
                    handleInputChange("rent", e.target.value, "currency")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Period
                </label>
                <select
                  value={formData.rent.period}
                  onChange={(e) =>
                    handleInputChange("rent", e.target.value, "period")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Security Deposit *
              </label>
              <input
                type="number"
                value={formData.securityDeposit}
                onChange={(e) =>
                  handleInputChange("securityDeposit", e.target.value)
                }
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Security deposit amount"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "street")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "city")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "state")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "zipCode")
                  }
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Zip code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Available From
              </label>
              <input
                type="date"
                value={formData.availableFrom || ""}
                onChange={(e) =>
                  handleInputChange("availableFrom", e.target.value)
                }
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Property Features */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Property Features
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(formData.features).map(([feature, enabled]) => (
                  <label
                    key={feature}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        handleInputChange("features", e.target.checked, feature)
                      }
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-300 capitalize">
                      {feature.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-300 capitalize">
                      {amenity.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-4">
                  Included in Rent
                </h4>
                <div className="space-y-2">
                  {utilityOptions.map((utility) => (
                    <label
                      key={utility}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.utilities.includedInRent.includes(
                          utility
                        )}
                        onChange={() =>
                          handleUtilityToggle(utility, "includedInRent")
                        }
                        className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-300 capitalize">
                        {utility.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-4">
                  Tenant Responsible
                </h4>
                <div className="space-y-2">
                  {utilityOptions.map((utility) => (
                    <label
                      key={utility}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.utilities.tenantResponsible.includes(
                          utility
                        )}
                        onChange={() =>
                          handleUtilityToggle(utility, "tenantResponsible")
                        }
                        className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-300 capitalize">
                        {utility.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Lease Terms */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Lease Terms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Term (months)
                  </label>
                  <input
                    type="number"
                    value={formData.leaseTerms.minimumTerm}
                    onChange={(e) =>
                      handleInputChange(
                        "leaseTerms",
                        parseInt(e.target.value),
                        "minimumTerm"
                      )
                    }
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Term (months)
                  </label>
                  <input
                    type="number"
                    value={formData.leaseTerms.maximumTerm}
                    onChange={(e) =>
                      handleInputChange(
                        "leaseTerms",
                        parseInt(e.target.value),
                        "maximumTerm"
                      )
                    }
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Occupants
                  </label>
                  <input
                    type="number"
                    value={formData.leaseTerms.maxOccupants || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "leaseTerms",
                        parseInt(e.target.value),
                        "maxOccupants"
                      )
                    }
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    min="1"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.leaseTerms.petsAllowed}
                      onChange={(e) =>
                        handleInputChange(
                          "leaseTerms",
                          e.target.checked,
                          "petsAllowed"
                        )
                      }
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-300">Pets Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.leaseTerms.smokingAllowed}
                      onChange={(e) =>
                        handleInputChange(
                          "leaseTerms",
                          e.target.checked,
                          "smokingAllowed"
                        )
                      }
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-300">Smoking Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.leaseTerms.depositRequired}
                      onChange={(e) =>
                        handleInputChange(
                          "leaseTerms",
                          e.target.checked,
                          "depositRequired"
                        )
                      }
                      className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-300">Deposit Required</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Upload Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Images
              </label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload property images (JPG, PNG, GIF, WebP). Maximum 10MB per
                image. Images will be automatically resized and watermarked.
              </p>

              {renderImagePreview()}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Property Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Basic Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Title:</span>{" "}
                      <span className="text-white">{formData.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>{" "}
                      <span className="text-white capitalize">
                        {formData.propertyType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Bedrooms:</span>{" "}
                      <span className="text-white">{formData.bedrooms}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Bathrooms:</span>{" "}
                      <span className="text-white">{formData.bathrooms}</span>
                    </div>
                    {formData.squareFootage && (
                      <div>
                        <span className="text-gray-400">Square Footage:</span>{" "}
                        <span className="text-white">
                          {formData.squareFootage} sq ft
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Status:</span>{" "}
                      <span className="text-white capitalize">
                        {formData.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Rent & Location
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Rent:</span>{" "}
                      <span className="text-white">
                        {formData.rent.amount} {formData.rent.currency} /{" "}
                        {formData.rent.period}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Security Deposit:</span>{" "}
                      <span className="text-white">
                        {formData.securityDeposit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Street:</span>{" "}
                      <span className="text-white">
                        {formData.address.street}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">City:</span>{" "}
                      <span className="text-white">
                        {formData.address.city}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">State:</span>{" "}
                      <span className="text-white">
                        {formData.address.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Zip Code:</span>{" "}
                      <span className="text-white">
                        {formData.address.zipCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>{" "}
                      <span className="text-white">{formData.status}</span>
                    </div>
                    {formData.availableFrom && (
                      <div>
                        <span className="text-gray-400">Available From:</span>{" "}
                        <span className="text-white">
                          {formData.availableFrom}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Images ({formData.images.length})
                </h4>
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-[#23232a] rounded-lg p-2 flex flex-col items-center"
                      >
                        <span className="text-xs text-white mb-2 truncate w-full text-center">
                          {file.name}
                        </span>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">No images uploaded.</span>
                )}
              </div>
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
