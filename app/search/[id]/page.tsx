"use client";

import { useEffect, useState } from "react";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";
import { IoLocationOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsBuilding } from "react-icons/bs";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CirclePattern from "../../components/CirclePattern";
import { toast } from "sonner";

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

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Property Main Image */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={`${property.images[0]}`}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-orange-500 z-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-orange-500/20"
            >
              <span className="text-white font-medium">
                {property.listingType === "rent" ? "For Rent" : "For Sale"}
              </span>
            </motion.div>

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
              <span>{`${property.address.city}${property.address.state ? `, ${property.address.state}` : ""}`}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-4 flex items-center"
            >
              <div className="text-3xl font-bold text-white">
                ₹{property.price.toLocaleString()}
              </div>
              {/* <button
                                onClick={toggleFavorite}
                                className="ml-4 h-10 w-10 flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full shadow-sm transition-colors"
                            >
                                <FaHeart className={`h-5 w-5 ${isFavorite ? 'text-orange-500' : 'text-white'}`} />
                            </button> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Decorative Background Pattern */}
        {/* <div className="absolute inset-0 text-black/5">
                    <CirclePattern />
                </div> */}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Property Overview
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="flex flex-col items-center text-center p-4 bg-black/5 rounded-lg">
                    <FaBed className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black">Bedrooms</span>
                    <span className="text-xl font-semibold text-black">
                      {property.bedrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-black/5 rounded-lg">
                    <FaBath className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black">Bathrooms</span>
                    <span className="text-xl font-semibold text-black">
                      {property.bathrooms}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-black/5 rounded-lg">
                    <FaRulerCombined className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-sm text-black">Area</span>
                    <span className="text-xl font-semibold text-black">
                      {property.area} sqft
                    </span>
                  </div>
                </div>
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-orange-500">
                      Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center p-2 rounded text-sm font-medium bg-orange-700 text-white"
                        >
                          {amenity[0].toUpperCase() + amenity.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start">
                    <BsBuilding className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                    <div>
                      <span className="text-black text-sm">Property Type</span>
                      <p className="text-black font-medium">
                        {property.propertyType}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-semibold text-black mb-4">
                  Description
                </h2>
                <p className="text-black leading-relaxed">
                  {property.description}
                </p>
              </motion.div>

              {/* Property Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg border border-black/10"
              >
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Property Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {property.images.slice(0, 6).map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-black/10"
                    >
                      <Image
                        src={`${img}`}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Agent Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
              >
                <h3 className="text-xl font-semibold text-black mb-4">
                  Listed By
                </h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-black/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-black font-medium">
                      {property.ownerDetails.name[0] || "PO"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-black">
                      {property.ownerDetails.name || "property.owner.name"}
                    </p>
                    <p className="text-sm text-black/70">
                      {property.ownerDetails.phone || "Contact via phone"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
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

              {/* Features/Tags */}
              {property.features && property.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
                >
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-black/5 text-black px-3 py-1 rounded-full text-sm border border-black/10"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-black/10"
                >
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Amenities
                  </h3>
                  <ul className="space-y-2">
                    {property.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-black">
                        <IoCheckmarkCircleOutline className="h-5 w-5 text-orange-500 mr-2" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section className="py-16 bg-black relative overflow-hidden">
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
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black text-white px-2 py-1 rounded text-xs font-medium">
                        {property.listingType === "rent"
                          ? "For Rent"
                          : "For Sale"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-black line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-black/70 mt-1 flex items-center">
                      <FaMapMarkerAlt className="h-3 w-3 mr-1 text-orange-500" />
                      {property.address?.city}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-orange-500 font-medium">
                        ₹{property.price.toLocaleString()}
                      </div>
                      <a
                        href={`/search/${property._id}`}
                        className="px-3 py-1 bg-black text-white text-xs rounded-md hover:bg-black/80 transition-colors flex items-center gap-1"
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

      <Footer />
    </main>
  );
}
