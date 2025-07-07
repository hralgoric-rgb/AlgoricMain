"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FavoritesAPI } from "@/app/lib/api-helpers";

// Types
interface Project {
  name: string;
  location: string;
  status: "Completed" | "Ongoing";
  type: string;
}

interface Review {
  _id?: string;
  user: string;
  rating: number;
  date: string;
  text: string;
}

interface Builder {
  _id: string;
  title: string;
  image: string;
  logo: string;
  projects: number;
  description: string;
  established: string;
  headquarters: string;
  specialization: string;
  rating: number;
  completed: number;
  ongoing: number;
  about?: string;
  projects_list?: Project[];
  reviews?: Review[];
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
}

export default function BuilderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [builder, setBuilder] = useState<Builder | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Builder[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [builderId, setBuilderId] = useState<string>('');

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setBuilderId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== "undefined") {
      const authToken = sessionStorage.getItem("authToken");
      if (authToken) {
        setToken(authToken);
      }
    }
  }, []);

  const fetchFavorite = async () => {
    if (token) {
      try {
        const buildersData = await FavoritesAPI.getBuilders();
        setFavorites(buildersData.favorites);

        // Check if current builder is in favorites
        if (
          builder &&
          buildersData.favorites.some((fav: Builder) => fav._id === builder._id)
        ) {
          setIsFavorited(true);
        } else {
          setIsFavorited(false);
        }
      } catch (_error) {
        toast.error("Failed to fetch favorites");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorite();
    }
  }, [token]);

  // Update isFavorited when builder or favorites change
  useEffect(() => {
    if (builder && favorites.length > 0) {
      setIsFavorited(favorites.some((fav) => fav._id === builder._id));
    }
  }, [builder, favorites]);

  useEffect(() => {
    const fetchBuilder = async () => {
      if (!builderId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/builders/${builderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Builder not found");
          }
          throw new Error("Failed to fetch builder details");
        }

        const data = await response.json();
        setBuilder(data.builder);
        setReviews(data.builder.reviews || []);
      } catch (_err) {
        setError((_err as Error).message || "Failed to load builder details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilder();
  }, [builderId]);

  const handleSubmitReview = async (_e: React.FormEvent) => {
    _e.preventDefault();

    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (userName.trim() === "") {
      alert("Please enter your name");
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        user: userName,
        rating: userRating,
        text: reviewText,
      };

      const response = await fetch(`/api/builders/${builderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();

      // Update the builder and reviews with the response data
      setBuilder(data.builder);
      setReviews(data.builder.reviews || []);

      // Reset form
      setUserRating(0);
      setReviewText("");
      setUserName("");
      setShowReviewForm(false);
    } catch (_err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle favorite status for builder
  const toggleFavorite = async (builderId: string) => {
    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      // Optimistically update UI first for responsive feedback
      setIsFavorited((prev) => !prev);

      if (isFavorited) {
        // Remove from favorites
        await FavoritesAPI.removeBuilder(builderId);
        toast.success("Builder removed from favorites");
        // Update local state
        setFavorites(favorites.filter((builder) => builder._id !== builderId));
      } else {
        // Add to favorites
        await FavoritesAPI.addBuilder(builderId);
        toast.success("Builder added to favorites");
        // Refresh favorites to get the updated list
        fetchFavorite();
      }
    } catch (_error) {
      // Revert UI state if operation fails
      setIsFavorited((prev) => !prev);
      toast.error("Failed to update favorites");
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating: number, interactive = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => setUserRating(i)}
            onMouseEnter={() => setHoveredRating(i)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-colors duration-200"
          >
            {i <= (hoveredRating || userRating) ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-orange-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            )}
          </button>,
        );
      } else {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        if (i <= fullStars) {
          stars.push(
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-orange-500"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>,
          );
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-orange-500"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>,
          );
        } else {
          stars.push(
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>,
          );
        }
      }
    }

    return stars;
  };

  if (isLoading) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-black/30 border-b border-orange-500/20"
          >
            <Navbar />
          </motion.div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex justify-center items-center py-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 border-t-4 border-b-4 border-orange-500 rounded-full relative"
              >
                <div className="absolute inset-2 border-t-2 border-orange-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <Footer />
      </motion.main>
    );
  }

  if (error) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-black/30 border-b border-orange-500/20"
          >
            <Navbar />
          </motion.div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6"
              >
                {error}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-gray-300 text-xl mb-8"
              >
                The builder you&apos;re looking for doesn&apos;t exist or has been removed.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/builders"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 font-semibold"
                >
                  Back to Builders
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </motion.main>
    );
  }

  if (!builder) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-black/30 border-b border-orange-500/20"
          >
            <Navbar />
          </motion.div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6"
              >
                Builder not found
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-gray-300 text-xl mb-8"
              >
                The builder you&apos;re looking for doesn&apos;t exist or has been removed.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/builders"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 font-semibold"
                >
                  Back to Builders
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </motion.main>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Navbar */}
      <div className="relative z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-black/30 border-b border-orange-500/20"
        >
          <Navbar />
        </motion.div>
      </div>

      {/* Enhanced Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="h-64 md:h-96 w-full relative overflow-hidden">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={builder.image}
              alt={builder.title}
              fill
              className="object-cover"
            />
          </motion.div>
          
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
          
          {/* Enhanced favorite button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-all duration-300"
            onClick={() => toggleFavorite(builder._id)}
          >
            <AnimatePresence mode="wait">
              {isFavorited ? (
                <motion.div
                  key="filled"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaHeart className="h-6 w-6 text-red-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="outline"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaRegHeart className="h-6 w-6 text-white hover:text-red-500 transition-colors duration-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Enhanced hero content */}
          <div className="absolute bottom-0 left-0 w-full p-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center gap-6 mb-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 backdrop-blur-sm bg-white/10 shadow-xl"
                >
                  <Image
                    src={builder.logo}
                    alt={`${builder.title} logo`}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  >
                    {builder.title}
                  </motion.h1>
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex items-center gap-3 mt-3"
                  >
                    <div className="flex">
                      {renderStars(builder.rating)}
                    </div>
                    <span className="text-white font-semibold text-lg">{builder.rating}</span>
                    <span className="text-white/70 text-sm">
                      ({reviews.length} reviews)
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Builder Info */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16 relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white rounded-2xl shadow-2xl p-8 mb-8 hover:shadow-orange-500/10 transition-all duration-500 group hover:border-orange-500/30"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6"
                >
                  About {builder.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-gray-300 mb-8 leading-relaxed text-lg"
                >
                  {builder.about || builder.description}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 p-6 rounded-xl group hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
                  >
                    <div className="text-orange-500 font-medium mb-2 text-sm">
                      Established
                    </div>
                    <div className="text-white font-bold text-xl group-hover:text-orange-400 transition-colors">
                      {builder.established}
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 p-6 rounded-xl group hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
                  >
                    <div className="text-orange-500 font-medium mb-2 text-sm">
                      Headquarters
                    </div>
                    <div className="text-white font-bold text-xl group-hover:text-orange-400 transition-colors">
                      {builder.headquarters}
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 p-6 rounded-xl group hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
                  >
                    <div className="text-orange-500 font-medium mb-2 text-sm">
                      Total Projects
                    </div>
                    <div className="text-white font-bold text-xl group-hover:text-orange-400 transition-colors">
                      {builder.projects}
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 p-6 rounded-xl group hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
                  >
                    <div className="text-orange-500 font-medium mb-2 text-sm">
                      Specialization
                    </div>
                    <div className="text-white font-bold text-xl group-hover:text-orange-400 transition-colors">
                      {builder.specialization}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Enhanced Projects */}
              {builder.projects_list && builder.projects_list.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white rounded-2xl shadow-2xl p-8 mb-8 hover:shadow-orange-500/10 transition-all duration-500 group hover:border-orange-500/30"
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6"
                  >
                    Featured Projects
                  </motion.h2>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="overflow-x-auto rounded-xl border border-gray-700/50"
                  >
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm">
                          <th className="py-4 px-6 text-left text-orange-500 font-semibold text-sm uppercase tracking-wider">
                            Project Name
                          </th>
                          <th className="py-4 px-6 text-left text-orange-500 font-semibold text-sm uppercase tracking-wider">
                            Location
                          </th>
                          <th className="py-4 px-6 text-left text-orange-500 font-semibold text-sm uppercase tracking-wider">
                            Type
                          </th>
                          <th className="py-4 px-6 text-left text-orange-500 font-semibold text-sm uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {builder.projects_list.map((project, index) => (
                          <motion.tr 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                            className="hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                          >
                            <td className="py-4 px-6 text-white font-medium group-hover:text-orange-400 transition-colors">
                              {project.name}
                            </td>
                            <td className="py-4 px-6 text-gray-300 group-hover:text-white transition-colors">
                              {project.location}
                            </td>
                            <td className="py-4 px-6 text-gray-300 group-hover:text-white transition-colors">
                              {project.type}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                  project.status === "Completed" 
                                    ? "bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-400 border border-green-500/30" 
                                    : "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 text-yellow-400 border border-yellow-500/30"
                                }`}
                              >
                                {project.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </motion.div>
              )}

              {/* Enhanced Reviews */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white rounded-2xl shadow-2xl p-8 hover:shadow-orange-500/10 transition-all duration-500 group hover:border-orange-500/30"
              >
                <div className="flex justify-between items-center mb-8">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                  >
                    Customer Reviews
                  </motion.h2>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!token) {
                        toast.error("Please login to write a review");
                      } else {
                        setShowReviewForm(!showReviewForm);
                      }
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 font-semibold"
                  >
                    {showReviewForm ? "Cancel Review" : "Write a Review"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 mb-8 overflow-hidden"
                    >
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
                        Share Your Experience
                      </h3>
                      <form onSubmit={handleSubmitReview} className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <label className="block text-orange-500 font-medium mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={userName}
                            onChange={(_e) => setUserName(_e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-600/50 bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                            placeholder="Enter your name"
                            required
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <label className="block text-orange-500 font-medium mb-2">
                            Your Rating
                          </label>
                          <div className="flex gap-1">{renderStars(0, true)}</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <label className="block text-orange-500 font-medium mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewText}
                            onChange={(_e) => setReviewText(_e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-600/50 bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 h-32 resize-none"
                            placeholder="Share your experience with this builder..."
                            required
                          />
                        </motion.div>
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 font-semibold ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <motion.svg
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </motion.svg>
                              Submitting...
                            </span>
                          ) : (
                            "Submit Review"
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {reviews.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="space-y-6"
                  >
                    {reviews.map((review, index) => (
                      <motion.div
                        key={review._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.8 + index * 0.1 }}
                        className="border-b border-gray-700/50 pb-6 last:border-0 p-6 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-700/30 backdrop-blur-sm hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-semibold text-orange-500 group-hover:text-orange-400 transition-colors">
                            {review.user}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {review.date}
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-gray-400 text-sm font-medium">
                            {review.rating}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                          {review.text}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-lg mb-4">No reviews yet</div>
                    <div className="text-gray-500">Be the first to leave a review!</div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white rounded-2xl shadow-2xl p-8 mb-8 sticky top-24 hover:shadow-orange-500/10 transition-all duration-500 group hover:border-orange-500/30"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6"
                >
                  Contact Information
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-700/30 backdrop-blur-sm hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-500 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-orange-500 mb-1">
                        Corporate Office
                      </div>
                      <div className="text-gray-300 leading-relaxed">
                        {builder.title} Tower, {builder.headquarters}
                        <br />
                        India - 110001
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-700/30 backdrop-blur-sm hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-500 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-orange-500 mb-1">Phone</div>
                      <div className="text-gray-300">
                        {builder.contact?.phone || "+91-11-42102030"}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-700/30 backdrop-blur-sm hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-500 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-orange-500 mb-1">Email</div>
                      <div className="text-gray-300">
                        {builder.contact?.email ||
                          `info@${builder.title.toLowerCase().replace(/\s+/g, "")}.com`}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-700/30 backdrop-blur-sm hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-500 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-orange-500 mb-1">Website</div>
                      <div className="text-gray-300">
                        {builder.contact?.website ||
                          `www.${builder.title.toLowerCase().replace(/\s+/g, "")}.com`}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mt-8 space-y-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/contact"
                      className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-orange-500/25 font-semibold group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      Contact Builder
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => toggleFavorite(builder._id)}
                      className={`w-full px-6 py-4 border-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold group ${
                        isFavorited
                          ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/60 text-orange-400 hover:from-orange-500/30 hover:to-red-500/30"
                          : "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50 text-gray-300 hover:border-orange-500/50 hover:text-orange-400"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isFavorited ? "currentColor" : "none"}
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </motion.div>
                      {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </motion.main>
  );
}
