"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building,
  Store,
  LandPlot,
  CheckCircle,
  Camera,
  X,
  ArrowLeft,
  ArrowRight,
  Map,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const propertyTypes = [
  {
    value: "apartment",
    label: "Apartment",
    icon: <Building className="w-5 h-5" />,
  },
  { value: "house", label: "House", icon: <Home className="w-5 h-5" /> },
  { value: "villa", label: "Villa", icon: <Home className="w-5 h-5" /> },
  {
    value: "commercial",
    label: "Commercial",
    icon: <Store className="w-5 h-5" />,
  },
  { value: "land", label: "Land", icon: <LandPlot className="w-5 h-5" /> },
];

const amenities = [
  "Parking",
  "Swimming Pool",
  "Gym",
  "Security",
  "Garden",
  "Elevator",
  "Power Backup",
  "Club House",
  "Air Conditioning",
  "Furnished",
  "Balcony",
  "Pet Friendly",
];

async function generateAIDescription(propertyData: any) {
  const API_URL = "https://api.together.xyz/v1/completions";
  const API_KEY = process.env.NEXT_PUBLIC_TOGETHER_API_KEY || ""; // Should be set in your .env.local file

  if (!API_KEY) {
    throw new Error(
      "Together API key is not set. Please set NEXT_PUBLIC_TOGETHER_API_KEY in your environment.",
    );
  }

  // Create the prompt with the property details
  const amenitiesText =
    propertyData.amenities.length > 0
      ? `Amenities: ${propertyData.amenities.join(", ")}.`
      : "";

  const bedroomsText = propertyData.bedrooms
    ? `${propertyData.bedrooms} bedroom${propertyData.bedrooms > 1 ? "s" : ""}`
    : "";
  const bathroomsText = propertyData.bathrooms
    ? `${propertyData.bathrooms} bathroom${propertyData.bathrooms > 1 ? "s" : ""}`
    : "";
  const roomsText =
    bedroomsText && bathroomsText
      ? `${bedroomsText} and ${bathroomsText}`
      : bedroomsText || bathroomsText;

  const locationText = propertyData.address.city
    ? `located in ${propertyData.address.locality || ""} ${propertyData.address.locality ? "in" : ""} ${propertyData.address.city}`
    : "";

  const prompt = `Write a compelling real estate property description for the following property:

  Property Title: ${propertyData.title}
  Property Type: ${propertyData.propertyType}
  ${roomsText ? `Rooms: ${roomsText}` : ""}
  Size: ${propertyData.area} square feet
  ${locationText ? `Location: ${locationText}` : ""}
  ${amenitiesText}

  Write a professional and engaging description highlighting the property's features and benefits. Keep it under 150 words, focus on selling points, and make it appealing to potential buyers. Do not include the price.

  Description:`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        prompt: prompt,
        max_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
        stop: ["</s>", "[/INST]"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to generate description",
      );
    }

    const data = await response.json();
    let generatedText = data.choices[0]?.text || "";

    // Clean up the response text
    generatedText = generatedText.trim();

    // Remove any additional formatting or prefixes sometimes added by LLM
    if (generatedText.startsWith("Description:")) {
      generatedText = generatedText.substring("Description:".length).trim();
    }

    return generatedText;
  } catch (error) {
    console.error("Error generating AI description:", error);
    throw error;
  }
}

export default function PropertyForm({
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
}) {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price ? String(initialData.price) : "",
    propertyType: initialData?.propertyType || "",
    listingType: initialData?.listingType || "sale",
    bedrooms: initialData?.bedrooms ? String(initialData.bedrooms) : "",
    bathrooms: initialData?.bathrooms ? String(initialData.bathrooms) : "",
    area: initialData?.area ? String(initialData.area) : "",
    amenities: initialData?.amenities || ([] as string[]),
    images: [] as File[],
    existingImages: initialData?.images || [],
    ownerDetails: {
      name: initialData?.ownerDetails?.name || "",
      phone: initialData?.ownerDetails?.phone || "",
    },
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      zipCode: initialData?.address?.zipCode || "",
      locality: initialData?.address?.locality || "",
      coordinates: {
        latitude: initialData?.address?.location?.coordinates
          ? String(initialData?.address?.location?.coordinates[1])
          : "",
        longitude: initialData?.address?.location?.coordinates
          ? String(initialData?.address?.location?.coordinates[0])
          : "",
      },
    },
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    initialData?.images || [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(initialData?.images || []);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "ownerDetails") {
        setFormData({
          ...formData,
          ownerDetails: {
            ...formData.ownerDetails,
            [child]: value,
          },
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...(formData as any)[parent],
            [child]: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAmenityChange = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a: string) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handlePropertyTypeChange = (type: string) => {
    setFormData({
      ...formData,
      propertyType: type,
    });
  };

  const handleListingTypeChange = (type: string) => {
    setFormData({
      ...formData,
      listingType: type,
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Generate image previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);

      setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      

      // Generate image previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);

      setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
    }
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      // Remove from existing images
      const newExistingImages = [...formData.existingImages];
      newExistingImages.splice(index, 1);

      // Also remove from preview
      const newPreviews = [...imagePreviewUrls];
      newPreviews.splice(index, 1);

      setFormData({
        ...formData,
        existingImages: newExistingImages,
      });
      setImagePreviewUrls(newPreviews);
    } else {
      // Handle new uploaded images as before
      const actualIndex = index - formData.existingImages.length;
      const newImages = [...formData.images];
      newImages.splice(actualIndex, 1);

      const newPreviews = [...imagePreviewUrls];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);

      setFormData({
        ...formData,
        images: newImages,
      });
      setImagePreviewUrls(newPreviews);
    }
  };

  const handleNextStep = () => {
    // Basic validations before allowing to proceed to next step
    if (formStep === 1) {
      // Validate step 1 fields (Property Details)
      if (
        !formData.title ||
        !formData.propertyType ||
        !formData.price ||
        !formData.area
      ) {
        setError("Please fill all required fields in this step");
        toast.error("Please fill all required fields before proceeding");
        return;
      }
    } else if (formStep === 2) {
      // Validate step 2 fields (Description & Features)
      if (!formData.description) {
        setError("Please add a description for your property");
        toast.error("Please add a description before proceeding");
        return;
      }
    } else if (formStep === 3) {
      // Validate step 3 fields (Photos)
      // Validate minimum 5 images
      const totalImages = formData.images.length + formData.existingImages.length;
      if (totalImages < 5) {
        setError(
          `Please add at least 5 images (currently have ${totalImages})`,
        );
        toast.error(
          `Please add at least 5 images (currently have ${totalImages})`,
        );
        return;
      }
    } else if (formStep === 4) {
      // Validate step 4 fields (Location)
      if (
        !formData.address.city ||
        !formData.address.locality ||
        !formData.address.street
      ) {
        setError("Please fill in all address fields");
        toast.error("Please fill in all address fields before proceeding");
        return;
      }

      if (
        !formData.address.coordinates.latitude ||
        !formData.address.coordinates.longitude
      ) {
        setError("Please provide location coordinates");
        toast.error("Please provide location coordinates before proceeding");
        return;
      }

      // Validate coordinates format
      const latitude = parseFloat(formData.address.coordinates.latitude);
      const longitude = parseFloat(formData.address.coordinates.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        setError("Please provide valid coordinates");
        toast.error("Please provide valid coordinates");
        return;
      }
    }

    // Clear any previous errors
    setError(null);

    // Move to next step
    if (formStep < 4) {
      setFormStep(formStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate owner details
      if (!formData.ownerDetails.name || !formData.ownerDetails.phone) {
        setError("Please provide owner name and phone number");
        toast.error("Please provide owner name and phone number");
        setIsSubmitting(false);
        return;
      }

      // Make sure we have at least five images
      if (formData.images.length + formData.existingImages.length < 5) {
        setError("Please add at least 5 images of your property");
        toast.error("Please add at least 5 images");
        setIsSubmitting(false);
        return;
      }

      // First, we need to upload any new images

      // Combine new and existing images
      

      // Get latitude and longitude as numbers
      const latitude = parseFloat(formData.address.coordinates.latitude);
      const longitude = parseFloat(formData.address.coordinates.longitude);

      // Check if latitude and longitude are valid numbers
      if (isNaN(latitude) || isNaN(longitude)) {
        setError("Please provide valid coordinates");
        toast.error("Please provide valid coordinates");
        setIsSubmitting(false);
        return;
      }

      // Get the authentication token from sessionStorage
      if (window === undefined) return;
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to create a property");
        toast.error("Please log in to create a property");
        setIsSubmitting(false);
        return;
      }

      // Set up axios default headers with the token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Create a copy of formData without existingImages
      const { existingImages, ...formDataWithoutImages } = formData;
      console.log(existingImages);
      // Create address object without coordinates
      const { coordinates, ...addressWithoutCoordinates } = formData.address;
      console.log(coordinates);

      let newImageUrls: string[] = [];
    if (formData.images.length > 0) {
      try {
        newImageUrls = await uploadImages(formData.images);
        toast.success(`${newImageUrls.length} images uploaded successfully!`);
      } catch (error) {
        setError("Failed to upload images. Please try again.");
        toast.error("Failed to upload images. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const allImageUrls = [
        ...formData.existingImages,
        ...newImageUrls,
      ];
      // Prepare data for submission
      const propertyData = {
        ...formDataWithoutImages,
        price: Number(formData.price),
        area: Number(formData.area),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        furnished: formData.amenities.includes("Furnished"),
        features: [],
        images: allImageUrls,
        status: initialData?.status || "active",
        ownerDetails: {
          name: formData.ownerDetails.name,
          phone: formData.ownerDetails.phone,
        },
        address: {
          ...addressWithoutCoordinates,
          country: "India",
          // Set location with provided coordinates
          location: {
            type: "Point",
            coordinates: [longitude, latitude], // GeoJSON format [longitude, latitude]
          },
        },
      };

      // Remove the existingImages field
      delete (propertyData as any).existingImages;

      console.log(
        `${isEditing ? "Updating" : "Submitting"} property data:`,
        propertyData,
      );

      let response;

      if (isEditing && initialData?._id) {
        // Update existing property
        response = await axios.put(
          `/api/properties/${initialData._id}`,
          propertyData,
        );
        toast.success("Property updated successfully!");
      } else {
        // Submit new property
        response = await axios.post("/api/properties", propertyData);
        toast.success("Property listed successfully!");
      }

      // Call the onSubmit callback with the response data
      onSubmit(response.data);

      // Close the form
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "submitting"} property:`,
        error,
      );

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details?.[0]?.message ||
        `Failed to ${isEditing ? "update" : "submit"} property. Please try again.`;

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to upload images
  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

    try {
      const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);

        // Use our custom API endpoint
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to upload image");
        }

        return data.url;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  // Clean up image preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleGenerateAIDescription = async () => {
    // Basic validation before sending to API
    if (!formData.title || !formData.propertyType) {
      toast.error("Please fill in at least the title and property type first");
      return;
    }

    try {
      setIsGeneratingDescription(true);
      const description = await generateAIDescription(formData);

      setFormData({
        ...formData,
        description: description,
      });

      toast.success("AI description generated successfully!");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to generate description. Please try again.",
      );
      console.error("Error generating description:", error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          address: {
            ...formData.address,
            coordinates: {
              latitude: String(position.coords.latitude),
              longitude: String(position.coords.longitude),
            },
          },
        });
        setIsLoadingLocation(false);
        toast.success("Location detected successfully!");
      },
      (error) => {
        setIsLoadingLocation(false);
        setLocationError(`Failed to get your location: ${error.message}`);
        toast.error(`Failed to get your location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-y-auto py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl mx-auto my-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white z-10 rounded-full bg-black/50 p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl shadow-2xl border border-orange-500/20">
          {/* Header */}
          <div className="relative h-24 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.3)_0%,transparent_60%)]"></div>
            <div className="absolute inset-0 flex items-center px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold tracking-tight">
                    {isEditing
                      ? "Update Your Property"
                      : "Create Your Property Listing"}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {isEditing
                      ? "Update your property details to attract more buyers"
                      : "Showcase your property to thousands of potential buyers"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Abstract design elements */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-400/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute right-20 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>

          {/* Progress tracker */}
          <div className="px-8 py-4 border-b border-white/10">
            <div className="flex justify-between">
              {["Details", "Features", "Photos", "Location"].map(
                (step, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Only allow clicking on previous steps
                      if (index + 1 <= formStep) {
                        setFormStep(index + 1);
                      }
                    }}
                    className="relative flex flex-1 items-center justify-center"
                  >
                    <div
                      className={`absolute h-1 w-full left-0 top-1/2 transform -translate-y-1/2 ${index === 0 ? "bg-transparent" : index < formStep - 1 ? "bg-orange-500" : "bg-gray-800"}`}
                    ></div>
                    <div
                      className={`absolute h-1 w-full right-0 top-1/2 transform -translate-y-1/2 ${index === 3 ? "bg-transparent" : index < formStep ? "bg-orange-500" : "bg-gray-800"}`}
                    ></div>

                    <div
                      className="z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-black border-2 transition-all duration-300 ${formStep > index + 1 ? 'border-orange-500 text-orange-500' : formStep === index + 1 ? 'border-orange-500 text-white bg-orange-500' : 'border-gray-700 text-gray-600'}"
                    >
                      {formStep > index + 1 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <span
                      className={`absolute -bottom-6 text-xs whitespace-nowrap transition-all duration-300 ${
                        formStep === index + 1
                          ? "text-orange-500 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto"
            onKeyDown={(e) => {
              // Prevent form submission on Enter key
              if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                e.preventDefault();
              }
            }}
          >
            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Form steps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={formStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-white mb-1.5 block"
                        >
                          Property Title{" "}
                          <span className="text-orange-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="E.g., Luxurious 3BHK with Garden View"
                          required
                          className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-1.5 block">
                          Property Type{" "}
                          <span className="text-orange-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-1">
                          {propertyTypes.map((type) => (
                            <div
                              key={type.value}
                              onClick={() =>
                                handlePropertyTypeChange(type.value)
                              }
                              className={`cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-3 rounded-lg border ${
                                formData.propertyType === type.value
                                  ? "border-orange-500 bg-orange-500/10"
                                  : "border-white/10 hover:border-white/30 bg-black/50"
                              }`}
                            >
                              <div
                                className={`mb-2 ${
                                  formData.propertyType === type.value
                                    ? "text-orange-500"
                                    : "text-white"
                                }`}
                              >
                                {type.icon}
                              </div>
                              <span
                                className={`text-sm ${
                                  formData.propertyType === type.value
                                    ? "text-orange-500"
                                    : "text-white"
                                }`}
                              >
                                {type.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-1.5 block">
                          Listing Type{" "}
                          <span className="text-orange-500">*</span>
                        </Label>
                        <div className="flex gap-4 mt-1">
                          <div
                            onClick={() => handleListingTypeChange("sale")}
                            className={`flex-1 cursor-pointer transition-all duration-300 flex items-center justify-center p-3 rounded-lg border ${
                              formData.listingType === "sale"
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-white/10 hover:border-white/30 bg-black/50"
                            }`}
                          >
                            <span
                              className={
                                formData.listingType === "sale"
                                  ? "text-orange-500"
                                  : "text-white"
                              }
                            >
                              For Sale
                            </span>
                          </div>
                          <div
                            onClick={() => handleListingTypeChange("rent")}
                            className={`flex-1 cursor-pointer transition-all duration-300 flex items-center justify-center p-3 rounded-lg border ${
                              formData.listingType === "rent"
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-white/10 hover:border-white/30 bg-black/50"
                            }`}
                          >
                            <span
                              className={
                                formData.listingType === "rent"
                                  ? "text-orange-500"
                                  : "text-white"
                              }
                            >
                              For Rent
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="price"
                            className="text-white mb-1.5 block"
                          >
                            Price (₹) <span className="text-orange-500">*</span>
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            required
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="area"
                            className="text-white mb-1.5 block"
                          >
                            Area (sq ft){" "}
                            <span className="text-orange-500">*</span>
                          </Label>
                          <Input
                            id="area"
                            name="area"
                            type="number"
                            value={formData.area}
                            onChange={handleInputChange}
                            placeholder="Enter area"
                            required
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="bedrooms"
                            className="text-white mb-1.5 block"
                          >
                            Bedrooms
                          </Label>
                          <Input
                            id="bedrooms"
                            name="bedrooms"
                            type="number"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                            placeholder="Number of bedrooms"
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="bathrooms"
                            className="text-white mb-1.5 block"
                          >
                            Bathrooms
                          </Label>
                          <Input
                            id="bathrooms"
                            name="bathrooms"
                            type="number"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            placeholder="Number of bathrooms"
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                        </div>
                      </div>

                      {/* Owner Details Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">
                          Owner Details
                        </h3>
                        <div>
                          <Label
                            htmlFor="ownerDetails.name"
                            className="text-white mb-1.5 block"
                          >
                            Owner Name{" "}
                            <span className="text-orange-500">*</span>
                          </Label>
                          <Input
                            id="ownerDetails.name"
                            name="ownerDetails.name"
                            value={formData.ownerDetails.name}
                            onChange={handleInputChange}
                            placeholder="Enter owner's name"
                            required
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="ownerDetails.phone"
                            className="text-white mb-1.5 block"
                          >
                            Owner Phone{" "}
                            <span className="text-orange-500">*</span>
                          </Label>
                          <Input
                            id="ownerDetails.phone"
                            name="ownerDetails.phone"
                            value={formData.ownerDetails.phone}
                            onChange={handleInputChange}
                            placeholder="Enter owner's phone number"
                            required
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-6">
                    <div className="relative">
                      <Label
                        htmlFor="description"
                        className="text-white mb-1.5 block"
                      >
                        Property Description{" "}
                        <span className="text-orange-500">*</span>
                      </Label>

                      <div className="absolute right-0 top-0">
                        <Button
                          type="button"
                          onClick={handleGenerateAIDescription}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-xs py-1 px-3"
                          disabled={isGeneratingDescription}
                        >
                          {isGeneratingDescription ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Generate with AI</span>
                            </>
                          )}
                        </Button>
                      </div>

                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={
                          isGeneratingDescription
                            ? "Generating description..."
                            : "Describe your property in detail..."
                        }
                        required
                        disabled={isGeneratingDescription}
                        className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 min-h-[150px]"
                      />

                      {isGeneratingDescription && (
                        <div className="flex items-center mt-2 text-purple-500 text-xs">
                          <div className="animate-pulse">
                            AI is crafting a compelling description based on
                            your property details...
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-1.5 block">
                        Amenities & Features
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                        {amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`amenity-${amenity}`}
                              checked={formData.amenities.includes(amenity)}
                              onCheckedChange={() =>
                                handleAmenityChange(amenity)
                              }
                              className="border-orange-500/50 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <Label
                              htmlFor={`amenity-${amenity}`}
                              className="text-white cursor-pointer"
                            >
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white mb-1.5 block">
                        Property Images{" "}
                        <span className="text-orange-500">*</span>
                        <span className="ml-2 text-orange-500 text-xs">
                          (Minimum 5 images required, currently{" "}
                          {formData.images.length +
                            formData.existingImages.length}
                          )
                        </span>
                      </Label>
                      <div
                        className={`mt-2 border-2 border-dashed rounded-lg transition-all duration-300 ${
                          isDragging
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-white/20 hover:border-orange-500/50 bg-black/50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <label className="flex flex-col items-center justify-center cursor-pointer py-6 px-4">
                          <div className="flex flex-col items-center justify-center">
                            <Camera className="w-10 h-10 mb-3 text-orange-500" />
                            <p className="mb-2 text-sm text-gray-300">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG or JPEG (MAX. 5MB each)
                            </p>
                          </div>
                          <input
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                            multiple
                            accept="image/*"
                          />
                        </label>
                      </div>

                      {/* Image previews */}
                      {imagePreviewUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => {
                            // Determine if this is an existing image or a new upload
                            const isExistingImage =
                              index < formData.existingImages.length;

                            return (
                              <div
                                key={index}
                                className="relative group rounded-lg overflow-hidden h-24"
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeImage(index, isExistingImage)
                                    }
                                    className="p-1.5 bg-red-500/80 rounded-full"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="address.city"
                          className="text-white mb-1.5 block"
                        >
                          City <span className="text-orange-500">*</span>
                        </Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                          required
                          className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="address.locality"
                          className="text-white mb-1.5 block"
                        >
                          Locality <span className="text-orange-500">*</span>
                        </Label>
                        <Input
                          id="address.locality"
                          name="address.locality"
                          value={formData.address.locality}
                          onChange={handleInputChange}
                          placeholder="Enter locality"
                          required
                          className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="address.street"
                        className="text-white mb-1.5 block"
                      >
                        Full Address <span className="text-orange-500">*</span>
                      </Label>
                      <Textarea
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Enter complete property address"
                        required
                        className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500"
                      />
                    </div>

                    {/* Location coordinates */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <Label className="text-white">
                          Location Coordinates{" "}
                          <span className="text-orange-500">*</span>
                        </Label>
                        <Button
                          type="button"
                          onClick={getCurrentLocation}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs py-1 px-3"
                          disabled={isLoadingLocation}
                        >
                          {isLoadingLocation ? (
                            <>
                              <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                              <span>Detecting...</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Use Current Location</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {locationError && (
                        <p className="text-red-500 text-xs mb-2">
                          {locationError}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            id="address.coordinates.latitude"
                            name="address.coordinates.latitude"
                            value={formData.address.coordinates.latitude}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({
                                ...formData,
                                address: {
                                  ...formData.address,
                                  coordinates: {
                                    ...formData.address.coordinates,
                                    latitude: value,
                                  },
                                },
                              });
                            }}
                            placeholder="Latitude (e.g., 28.7041)"
                            required
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                          <p className="text-gray-500 text-xs mt-1">
                            Latitude (North/South position)
                          </p>
                        </div>
                        <div>
                          <Input
                            id="address.coordinates.longitude"
                            name="address.coordinates.longitude"
                            value={formData.address.coordinates.longitude}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({
                                ...formData,
                                address: {
                                  ...formData.address,
                                  coordinates: {
                                    ...formData.address.coordinates,
                                    longitude: value,
                                  },
                                },
                              });
                            }}
                            placeholder="Longitude (e.g., 77.1025)"
                            required
                            className="bg-black/60 border-orange-500/30 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 h-12"
                          />
                          <p className="text-gray-500 text-xs mt-1">
                            Longitude (East/West position)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {formStep > 1 ? (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  variant="outline"
                  className="border-white/20 hover:border-white/40 text-white hover:bg-black/50 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="border-white/20 hover:border-white/40 text-white hover:bg-black/50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}

              {formStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </>
                  ) : (
                    <>
                      {isEditing ? "Update Property" : "Submit Listing"}
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="bg-orange-500/5 px-8 py-4 text-center border-t border-white/10">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
              <Map className="w-4 h-4 text-orange-500" />
              {isEditing
                ? "Your updated property will be reviewed by our team"
                : "Your property will be verified by our team before being published"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
