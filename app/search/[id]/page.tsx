"use client";

import { useEffect, useState } from "react";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaCar,
  FaCalendarAlt,
  FaShoppingBag,
  FaHospital,
  FaTree,
  FaGraduationCap,
} from "react-icons/fa";
import { IoLocationOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsBuilding, BsGraphUp } from "react-icons/bs";
import { motion } from "framer-motion";
import Image from "next/image";

import Footer from "@/app/components/footer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CirclePattern from "../../components/CirclePattern";
import { toast } from "sonner";
import Navbar from "@/app/components/navbar";

// Decorative components matching other pages
// const HouseIcon = () => (
//     <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
//         <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
//     </svg>
// );

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  listingType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lotSize?: number;
  yearBuilt?: string;
  parking?: number;
  address: {
    street?: string;
    city: string;
    state?: string;
    zipCode?: string;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  };
  amenities?: string[];
  features?: string[];
  images: string[];
  views: number;
  owner: {
    name: string;
    email: string;
  };
  ownerDetails: {
    name: string;
    phone: string;
  };
  agent?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Property location amenities
// interface LocalityAmenity {
//   name: string;
//   distance: string;
//   rating?: number;
//   icon: React.ReactNode;
// }

// Locality review interface
// interface LocalityReview {
//   id: string;
//   author: string;
//   rating: number;
//   date: string;
//   comment: string;
//   avatar?: string;
// }

// News article interface
// interface NewsArticle {
//   title: string;
//   description: string;
//   url: string;
//   image: string;
//   publishedAt: string;
//   source: {
//     name: string;
//   };
// }

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in this property...",
  });
  const [contactFormSubmitting, setContactFormSubmitting] = useState(false);
  const [contactFormSuccess, setContactFormSuccess] = useState(false);
  const [contactFormError, setContactFormError] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/properties/${params.id}`);
      console.log("Property: ", response.data);
      setProperty(response.data);

      // Fetch similar properties (same area, property type, etc.)
      fetchSimilarProperties(response.data);

      // Check if property is in user's favorites
      if (session?.user) {
        checkFavoriteStatus();
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      setError("Failed to load property details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPropertyData();
  }, [params.id]);

  const fetchSimilarProperties = async (currentProperty: Property) => {
    try {
      // In a real implementation, you would call a specific endpoint for similar properties
      // For now, we'll just filter properties with the same property type from the general endpoint
      const response = await axios.get("/api/properties", {
        params: {
          propertyType: currentProperty.propertyType,
          limit: 3,
        },
      });

      if (response.data.success) {
        // Filter out the current property and limit to 3 similar properties
        const similar = response.data.properties
          .filter((p: Property) => p._id !== currentProperty._id)
          .slice(0, 3);

        setSimilarProperties(similar);
      }
    } catch (err) {
      console.error("Error fetching similar properties:", err);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      // In a real implementation, you would check if this property is in the user's favorites
      // For now, we'll just simulate the check
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  };

  // const toggleFavorite = async () => {

  //     try {
  //         // In a real implementation, you would call an API to toggle the favorite status
  //         // For now, we'll just toggle the state
  //         setIsFavorite(!isFavorite);
  //     } catch (err) {
  //         console.error('Error toggling favorite status:', err);
  //     }
  // };

  // const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //     const { name, value } = e.target;
  //     setContactForm(prev => ({
  //         ...prev,
  //         [name]: value
  //     }));
  // };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    // Validate form
    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.phone ||
      !contactForm.message
    ) {
      setContactFormError("All fields are required");
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setContactFormSubmitting(true);
      setContactFormError(null);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          propertyTitle: property.title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setContactFormSuccess(true);
        // Reset form after success
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "I'm interested in this property...",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setContactFormError("Failed to send your message. Please try again.");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setContactFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-xl text-black mb-4">
          {error || "Property not found"}
        </div>
        <button
          onClick={() => router.push("/search")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Property Main Image */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-orange-500 z-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/20"
              >
                <span className="text-white font-medium">
                  {property.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-block bg-orange-500/80 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <span className="text-white font-medium">
                  {property.propertyType}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/20"
              >
                <span className="text-white font-medium">
                  {property.status}
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
                {property.title}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center mt-2 text-white"
            >
              <IoLocationOutline className="h-5 w-5 mr-2" />
              <span>{`${property.address.street ? property.address.street + ", " : ""}${property.address.city}${property.address.state ? `, ${property.address.state}` : ""}${property.address.zipCode ? ` - ${property.address.zipCode}` : ""}`}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-4 flex items-center justify-between"
            >
              <div className="text-3xl font-bold text-white">
                ₹{property.price.toLocaleString()}
                <span className="text-sm ml-2 opacity-80">
                  {property.listingType === "rent" ? "/ month" : ""}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  className="h-10 w-10 flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full shadow-sm transition-colors"
                  aria-label="Add to favorites"
                >
                  <FaHeart className="h-5 w-5 text-white hover:text-orange-500" />
                </button>

                <button
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-sm transition-colors flex items-center gap-2"
                  onClick={handleShare}
                >
                  <span>Share</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10"
            >
              <div className="flex flex-col items-center text-center text-white">
                <FaBed className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm opacity-80">Bedrooms</span>
                <span className="text-xl font-semibold">
                  {property.bedrooms}
                </span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaBath className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm opacity-80">Bathrooms</span>
                <span className="text-xl font-semibold">
                  {property.bathrooms}
                </span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaRulerCombined className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm opacity-80">Area</span>
                <span className="text-xl font-semibold">
                  {property.area} sqft
                </span>
              </div>

              <div className="flex flex-col items-center text-center text-white">
                <FaCar className="h-6 w-6 text-orange-400 mb-1" />
                <span className="text-sm opacity-80">Parking</span>
                <span className="text-xl font-semibold">
                  {property.parking || "N/A"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Navigation Menu */}
      <div className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap py-4 gap-8 scrollbar-hide">
            <a
              href="#overview"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Overview
            </a>
            <a
              href="#details"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Details
            </a>
            <a
              href="#gallery"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Gallery
            </a>
            <a
              href="#amenities"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Amenities
            </a>
            <a
              href="#locality"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Locality
            </a>
            <a
              href="#reviews"
              className="text-black font-medium hover:text-orange-500 transition-colors"
            >
              Reviews
            </a>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Property Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                id="overview"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-black">
                    Property Overview
                  </h2>
                  <div className="px-3 py-1.5 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                    {property.views} people viewed
                  </div>
                </div>

                <div className="prose max-w-none text-black mb-8">
                  <p className="text-lg leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaBed className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black/70">Bedrooms</span>
                    <span className="text-xl font-semibold text-black">
                      {property.bedrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaBath className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black/70">Bathrooms</span>
                    <span className="text-xl font-semibold text-black">
                      {property.bathrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaRulerCombined className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black/70">Built-up Area</span>
                    <span className="text-xl font-semibold text-black">
                      {property.area} sqft
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-orange-50 border border-orange-100 rounded-lg transition-all hover:shadow-md">
                    <FaCalendarAlt className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black/70">Year Built</span>
                    <span className="text-xl font-semibold text-black">
                      {property.yearBuilt || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-start">
                    <BsBuilding className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-black/70 text-sm">
                        Property Type
                      </span>
                      <p className="text-black font-medium">
                        {property.propertyType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <IoLocationOutline className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-black/70 text-sm">Location</span>
                      <p className="text-black font-medium">
                        {property.address.city}
                        {property.address.state
                          ? `, ${property.address.state}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaCar className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-black/70 text-sm">Parking</span>
                      <p className="text-black font-medium">
                        {property.parking
                          ? `${property.parking} car space${property.parking > 1 ? "s" : ""}`
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BsGraphUp className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-black/70 text-sm">Status</span>
                      <p className="text-black font-medium">
                        {property.status}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Property Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                id="details"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Property Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-4 border-b border-black/10 pb-2">
                      Basic Information
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-black/70">Property ID</dt>
                        <dd className="font-medium text-black">
                          {property._id.slice(-8)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Property Type</dt>
                        <dd className="font-medium text-black">
                          {property.propertyType}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Price</dt>
                        <dd className="font-medium text-black">
                          ₹{property.price.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Area</dt>
                        <dd className="font-medium text-black">
                          {property.area} sqft
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Bedrooms</dt>
                        <dd className="font-medium text-black">
                          {property.bedrooms}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Bathrooms</dt>
                        <dd className="font-medium text-black">
                          {property.bathrooms}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-black mb-4 border-b border-black/10 pb-2">
                      Additional Details
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-black/70">Year Built</dt>
                        <dd className="font-medium text-black">
                          {property.yearBuilt || "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Status</dt>
                        <dd className="font-medium text-black">
                          {property.status}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Parking</dt>
                        <dd className="font-medium text-black">
                          {property.parking || "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Lot Size</dt>
                        <dd className="font-medium text-black">
                          {property.lotSize
                            ? `${property.lotSize} sqft`
                            : "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-black/70">Listed</dt>
                        <dd className="font-medium text-black">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </motion.div>

              {/* Property Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                id="gallery"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Property Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.images.slice(0, 6).map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-black/10 group"
                    >
                      <Image
                        src={`${img}`}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                {property.images.length > 6 && (
                  <div className="mt-4 text-center">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                      View All {property.images.length} Photos
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Amenities Section */}
              {property.amenities && property.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  id="amenities"
                  className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
                >
                  <h2 className="text-2xl font-semibold text-black mb-6">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <IoCheckmarkCircleOutline className="h-5 w-5 text-orange-500" />
                        </div>
                        <span className="text-black">{amenity}</span>
                      </div>
                    ))}
                    {property.features &&
                      property.features.map((feature, index) => (
                        <div
                          key={`feature-${index}`}
                          className="flex items-center"
                        >
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <IoCheckmarkCircleOutline className="h-5 w-5 text-orange-500" />
                          </div>
                          <span className="text-black">{feature}</span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Locality Info Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                id="locality"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Locality Information
                </h2>

                <div className="mb-8">
                  <div className="aspect-video relative rounded-lg overflow-hidden border border-black/10 mb-4">
                    <Image
                      src="/airpirt.jpeg"
                      alt="Location Map"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button className="px-4 py-2 bg-white text-black rounded-md hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View on Map
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-black mb-4">
                    About {property.address.city}
                  </h3>
                  <p className="text-black mb-4">
                    {property.address.city} is a vibrant area known for its
                    excellent connectivity, infrastructure, and quality of life.
                    The locality offers a blend of residential comfort with
                    urban conveniences, making it a preferred choice for
                    homebuyers and investors alike.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-black mb-4">
                  Nearby Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    {
                      name: "City Center Mall",
                      distance: "1.2 km",
                      rating: 4.2,
                      icon: (
                        <FaShoppingBag className="h-5 w-5 text-orange-500" />
                      ),
                    },
                    {
                      name: "Global Hospital",
                      distance: "2.5 km",
                      rating: 4.5,
                      icon: <FaHospital className="h-5 w-5 text-orange-500" />,
                    },
                    {
                      name: "Central Park",
                      distance: "0.8 km",
                      rating: 4.3,
                      icon: <FaTree className="h-5 w-5 text-orange-500" />,
                    },
                    {
                      name: "International School",
                      distance: "1.5 km",
                      rating: 4.7,
                      icon: (
                        <FaGraduationCap className="h-5 w-5 text-orange-500" />
                      ),
                    },
                  ].map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                        {amenity.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-black">
                          {amenity.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-black/70">
                            {amenity.distance}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full flex items-center">
                            {amenity.rating} ★
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                id="reviews"
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-black">
                    Locality Reviews
                  </h2>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                    Add Review
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      id: "1",
                      author: "Rahul Sharma",
                      rating: 4.5,
                      date: "2 months ago",
                      comment:
                        "Great locality with all amenities nearby. The area is safe and well-connected to major parts of the city.",
                      avatar: "/a1.jpg",
                    },
                    {
                      id: "2",
                      author: "Priya Patel",
                      rating: 5,
                      date: "3 months ago",
                      comment:
                        "I've been living in this area for over 5 years and have seen tremendous development. Schools, hospitals, and shopping centers are all within reach.",
                      avatar: "/a2.jpg",
                    },
                    {
                      id: "3",
                      author: "Vikram Singh",
                      rating: 4,
                      date: "1 month ago",
                      comment:
                        "Good investment opportunity. Property prices have been steadily increasing due to the upcoming metro station and commercial complexes.",
                      avatar: "/a4.jpg",
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex items-start">
                        <div className="h-12 w-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={review.avatar || "/a5.jpg"}
                            alt={review.author}
                            width={48}
                            height={48}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-black">
                              {review.author}
                            </h4>
                            <span className="text-sm text-black/60">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${i < Math.floor(review.rating) ? "text-yellow-500" : "text-gray-300"}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm font-medium text-black/70">
                              {review.rating} out of 5
                            </span>
                          </div>
                          <p className="text-black">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors">
                    View All Reviews
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white sticky top-24"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">
                    ₹{property.price.toLocaleString()}
                  </h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {property.listingType === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-white/80 text-sm">Area</p>
                      <p className="font-semibold">{property.area} sqft</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Price/sqft</p>
                      <p className="font-semibold">
                        ₹
                        {Math.round(
                          property.price / property.area,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <button className="w-full py-3 bg-white text-orange-600 font-semibold rounded-md hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Owner
                  </button>
                  <button className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email Owner
                  </button>
                </div>
                <div className="text-sm text-white/70 text-center">
                  Listed on {new Date(property.createdAt).toLocaleDateString()}
                </div>
              </motion.div>

              {/* Agent Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-xl font-semibold text-black mb-4">
                  Listed By
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mr-4 relative overflow-hidden">
                    <span className="text-orange-500 font-medium text-xl">
                      {property.ownerDetails.name?.[0] || "PO"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-black text-lg">
                      {property.ownerDetails.name || "Property Owner"}
                    </p>
                    <p className="text-sm text-black/70 mb-2">
                      {property.ownerDetails.phone || "Contact via phone"}
                    </p>
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors">
                        View Profile
                      </button>
                      <button className="text-xs px-2 py-1 bg-black/10 text-black rounded-md hover:bg-black/20 transition-colors">
                        All Listings
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-xl font-semibold text-black mb-4">
                  Interested in this property?
                </h3>

                {contactFormSuccess ? (
                  <div className="p-4 bg-orange-50 rounded-md text-black mb-4 border border-orange-500/20">
                    <p className="font-medium">Thank you for your inquiry!</p>
                    <p className="text-sm mt-1">
                      The owner will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactFormSubmit}
                    className="space-y-4"
                  >
                    {contactFormError && (
                      <div className="p-3 bg-black/5 text-black rounded-md text-sm border border-black/10">
                        {contactFormError}
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="name"
                        className="text-black text-sm mb-1 block"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-black text-sm mb-1 block"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-black text-sm mb-1 block"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactForm.phone}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="text-black text-sm mb-1 block"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        placeholder="I'm interested in this property..."
                        rows={4}
                        className="w-full px-4 py-2 rounded-md border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={contactFormSubmitting}
                      className="w-full px-4 py-3 bg-orange-500 text-white font-semibold rounded-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70"
                    >
                      {contactFormSubmitting ? "Sending..." : "Contact Owner"}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* EMI Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-xl font-semibold text-black mb-4">
                  EMI Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-black/70 block mb-1">
                      Loan Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={Math.round(
                          property.price * 0.8,
                        ).toLocaleString()}
                        readOnly
                        className="w-full pl-8 pr-3 py-2 border border-black/20 rounded-md text-black"
                      />
                    </div>
                    <p className="text-xs text-black/60 mt-1">
                      80% of property value
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-black/70 block mb-1">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="8.5"
                        readOnly
                        className="w-full pl-3 pr-8 py-2 border border-black/20 rounded-md text-black"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-black/70 block mb-1">
                      Loan Tenure
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="20"
                        readOnly
                        className="w-full pl-3 pr-8 py-2 border border-black/20 rounded-md text-black"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
                        years
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/10">
                    <div className="flex justify-between items-center">
                      <span className="text-black/70">Monthly EMI</span>
                      <span className="text-lg font-semibold text-orange-600">
                        ₹
                        {Math.round(
                          property.price * 0.8 * 0.00861,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-black/70">Total Interest</span>
                      <span className="text-black">
                        ₹
                        {Math.round(
                          property.price * 0.8 * 0.00861 * 20 * 12 -
                            property.price * 0.8,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      router.push("/contact");
                    }}
                    className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm cursor-pointer z-40"
                  >
                    Get Pre-Approved Loan
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section
          id="similar"
          className="py-16 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
        >
          <div className="absolute inset-0 text-white/5">
            <CirclePattern />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-block bg-orange-500 px-4 py-2 rounded-full mb-4"
              >
                <span className="text-white font-medium">EXPLORE MORE</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Similar Properties
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-lg text-white/80"
              >
                Discover other properties you might be interested in
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((property) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black text-white px-2 py-1 rounded text-xs font-medium">
                        {property.listingType === "rent"
                          ? "For Rent"
                          : "For Sale"}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-black line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-black/70 mt-1 flex items-center">
                      <FaMapMarkerAlt className="h-3 w-3 mr-1 text-orange-500" />
                      {property.address?.city}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full">
                        {property.bedrooms} Beds
                      </span>
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full">
                        {property.bathrooms} Baths
                      </span>
                      <span className="text-xs bg-black/5 px-2 py-0.5 rounded-full">
                        {property.area} sqft
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-orange-500 font-medium">
                        ₹{property.price.toLocaleString()}
                      </div>
                      <a
                        href={`/search/${property._id}`}
                        className="px-3 py-1 bg-black text-white text-xs rounded-md hover:bg-orange-500 transition-colors flex items-center gap-1"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Property News Section */}
      <section id="news" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 text-black/5 opacity-30">
          <CirclePattern />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full mb-4"
            >
              <span className="font-medium">STAY UPDATED</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-black mb-6"
            >
              Latest Real Estate News
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-black/70 max-w-3xl mx-auto"
            >
              Stay informed about the latest trends, policies, and developments
              in the real estate market
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Home Loan Interest Rates Reduced by Major Banks",
                description:
                  "Several major banks have announced a reduction in home loan interest rates, making property purchase more affordable for homebuyers.",
                url: "#",
                image: "/image1.jpg",
                publishedAt: "2023-06-15T10:30:00Z",
                source: { name: "Financial Express" },
              },
              {
                title:
                  "New Metro Line to Boost Property Values in Eastern Suburbs",
                description:
                  "The upcoming metro line connecting eastern suburbs to the city center is expected to significantly increase property values in the region.",
                url: "#",
                image: "/airpirt.jpeg",
                publishedAt: "2023-06-10T14:15:00Z",
                source: { name: "Urban News" },
              },
              {
                title: "Sustainable Housing: The Future of Real Estate",
                description:
                  "Developers are increasingly focusing on eco-friendly and sustainable housing projects to meet the growing demand for green living spaces.",
                url: "#",
                image: "/canada.jpeg",
                publishedAt: "2023-06-05T09:45:00Z",
                source: { name: "Green Living" },
              },
              {
                title:
                  "Government Announces New Housing Scheme for First-time Buyers",
                description:
                  "The government has introduced a new scheme offering subsidies and tax benefits to first-time homebuyers to promote affordable housing.",
                url: "#",
                image: "/dwarka.jpeg",
                publishedAt: "2023-06-01T11:20:00Z",
                source: { name: "Policy Times" },
              },
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden border border-black/10 hover:border-orange-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <a href={article.url} className="block">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="text-xs text-orange-500">
                        {article.source.name}
                      </span>
                      <span className="mx-2 text-black/20">•</span>
                      <span className="text-xs text-black/50">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-black/70 text-sm line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                  <div className="px-5 pb-5 pt-2">
                    <div className="flex items-center text-orange-500 text-sm font-medium">
                      Read Article
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5-5 5M5 7l5 5-5 5"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              View All News & Articles
            </a>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-orange-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-black mb-6"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-black/70"
            >
              Get answers to common questions about this property and the buying
              process
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question:
                  "What documents will I need to purchase this property?",
                answer:
                  "You'll need identity proof (Aadhar, PAN), address proof, income proof such as salary slips or ITR, bank statements for the last 6 months, and passport-sized photographs. For loan applications, additional documents may be required by the bank.",
              },
              {
                question:
                  "Are there any additional costs beyond the listed price?",
                answer:
                  "Yes, you should budget for stamp duty (typically 5-7% of property value), registration charges (approximately 1%), GST (if applicable), maintenance deposit, legal fees, and loan processing fees if you're financing the purchase.",
              },
              {
                question: "Is the property part of a housing society?",
                answer:
                  "Yes, this property is part of a registered housing society with common amenities. Monthly maintenance charges apply and are used for security, cleaning, and maintenance of common areas.",
              },
              {
                question:
                  "How is the water and electricity supply in this area?",
                answer:
                  "The area has a reliable 24-hour water supply from the municipal corporation and minimal power outages. The property also has power backup for common areas and essential services.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden"
              >
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-black">
                    <h3 className="font-medium">{faq.question}</h3>
                    <svg
                      className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-black/70">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
