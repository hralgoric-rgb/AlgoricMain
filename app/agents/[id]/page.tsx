"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FavoritesAPI } from "@/app/lib/api-helpers";
import { useRouter } from "next/navigation";

// Type definitions
interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  isAgent: boolean;
  agentInfo: {
    role?: string;
    experience: number;
    rating: number;
    specializations: string[];
    languages: string[];
    agency?: string;
    verified: boolean;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  lastActive?: string;
}

interface AgentStats {
  activeListings: number;
  soldProperties: number;
  rentedProperties: number;
}

interface Property {
  _id: string;
  title: string;
  price: number;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  status: string;
  createdAt: string;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  text: string;
}

// Sample reviews - we'll keep these for now since the API doesn't include reviews yet
// const sampleReviews = [
//   {
//     id: 1,
//     user: "Amit Patel",
//     rating: 4.9,
//     date: "2023-05-15",
//     text: "Helped me find my dream home within a week! Knowledge of the local market is exceptional.",
//   },
//   {
//     id: 2,
//     user: "Priya Singh",
//     rating: 4.7,
//     date: "2023-04-22",
//     text: "Very professional and responsive. Made the process of buying our first home smooth and stress-free.",
//   },
//   {
//     id: 3,
//     user: "Vikram Malhotra",
//     rating: 4.8,
//     date: "2023-03-10",
//     text: "Great negotiation skills. Got us a great deal on our property.",
//   },
// ];

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string>('');

  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Agent[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setAgentId(resolvedParams.id);
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
        const agentsData = await FavoritesAPI.getAgents();
        setFavorites(agentsData.favorites);

        // Check if current agent is in favorites
        if (
          agent &&
          agentsData.favorites.some((fav: Agent) => fav._id === agent._id)
        ) {
          setIsFavorited(true);
        } else {
          setIsFavorited(false);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to fetch favorites");
      }
    }
  };
  useEffect(() => {
    if (token) {
      fetchFavorite();
    }
  }, [token]);
  const fetchReviews = async () => {
    if (!agentId) return;
    try {
      const response = await fetch(`/api/agents/${agentId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  useEffect(() => {
    // Fetch agent details when component mounts
    if (agentId) {
      fetchAgentDetails();
      fetchReviews();
    }
  }, [agentId]);

  // Update isFavorited when agent or favorites change
  useEffect(() => {
    if (agent && favorites.length > 0) {
      setIsFavorited(favorites.some((fav) => fav._id === agent._id));
    }
  }, [agent, favorites]);

  const fetchAgentDetails = async (page = 1) => {
    if (!agentId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/agents/${agentId}?page=${page}&limit=6`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch agent details");
      }

      const data = await response.json();
      setAgent(data.agent);
      setStats(data.stats);
      setProperties(data.properties);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching agent details:", err);
      setError("Failed to load agent details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (userName.trim() === "") {
      alert("Please enter your name");
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName,
          rating: userRating,
          comment: reviewText,
          title: "Review",
        }),
      });

      if (response.ok) {
        // Reset form fields
        setUserRating(0);
        setReviewText("");
        setUserName("");
        setShowReviewForm(false);

        // Fetch updated reviews and agent data (for updated rating)
        fetchReviews();
        fetchAgentDetails();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to submit review"}`);
      }
    } catch (error: any) {
      toast.error(error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setShowReviewForm(false);
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
            className="focus:outline-none"
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

  const toggleFavorite = async (agentId: string) => {
    if (!token) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      // Optimistically update UI first for responsive feedback
      setIsFavorited((prev) => !prev);

      if (isFavorited) {
        // Remove from favorites
        await FavoritesAPI.removeAgent(agentId);
        toast.success("Agent removed from favorites");
        // Update local state
        setFavorites(favorites.filter((agent) => agent._id !== agentId));
      } else {
        // Add to favorites
        await FavoritesAPI.addAgent(agentId);
        toast.success("Agent added to favorites");
        // Refresh favorites to get the updated list
        fetchFavorite();
      }
    } catch (error) {
      // Revert UI state if operation fails
      setIsFavorited((prev) => !prev);
      console.error("Error toggling favorite status:", error);
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !agent) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-orange-500">
              Agent not found
            </h2>
            <p className="mt-4 text-gray-400">
              {error ||
                "The agent you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              href="/agents"
              className="mt-6 inline-block px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Back to Agents
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Agent Profile Section */}
      <section className="pt-20 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden shadow-md shadow-orange-600/70">
                <div className="relative h-96 md:h-[450px] ">
                  <Image
                    src={agent.image || "/placeholder-agent.png"}
                    alt={agent.name}
                    fill
                    className="object-cover "
                  />
                  <div
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-800/70 flex items-center justify-center cursor-pointer hover:bg-gray-700/70 transition-all duration-300 transform hover:scale-110"
                    onClick={() => toggleFavorite(agent._id)}
                  >
                    {isFavorited ? (
                      <FaHeart className="h-5 w-5 text-red-600" />
                    ) : (
                      <FaRegHeart className="h-5 w-5 text-white hover:text-red-600 transition-colors duration-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-orange-500">
                {agent.name}
              </h1>
              <p className="text-gray-300 mt-1">
                {agent.agentInfo.role || "Real Estate Agent"}
              </p>

              <div className="flex items-center mt-2 mb-4">
                <div className="flex mr-2">
                  {renderStars(agent.agentInfo.rating)}
                </div>
                <span className="text-orange-500">
                  {agent.agentInfo.rating.toFixed(1)}
                </span>
                <span className="text-gray-400 ml-1">
                  ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-gray-300 mb-6">
                {agent.bio ||
                  `Experienced ${agent.agentInfo.role || "real estate agent"} specializing in ${agent.agentInfo.specializations?.join(", ") || "property sales and acquisition"}.`}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-200">Experience</h3>
                  <p className="text-gray-400">
                    {agent.agentInfo.experience} years
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">Specialization</h3>
                  <p className="text-gray-400">
                    {agent.agentInfo.specializations?.join(", ") ||
                      "Residential Properties"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">Properties</h3>
                  <p className="text-gray-400">
                    {stats?.activeListings || 0} active listings
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">Languages</h3>
                  <p className="text-gray-400">
                    {agent.agentInfo.languages?.join(", ") || "English"}
                  </p>
                </div>
                {agent.agentInfo.agency && (
                  <div>
                    <h3 className="font-medium text-gray-200">Agency</h3>
                    <p className="text-gray-400">{agent.agentInfo.agency}</p>
                  </div>
                )}
                {agent.address?.city && (
                  <div>
                    <h3 className="font-medium text-gray-200">Location</h3>
                    <p className="text-gray-400">
                      {agent.address.city}
                      {agent.address.state ? `, ${agent.address.state}` : ""}
                    </p>
                  </div>
                )}
              </div>

              {stats && (
                <div className="flex flex-wrap gap-4 mb-6 bg-gray-900 p-4 rounded-lg">
                  <div className="text-center px-4">
                    <div className="text-xl font-bold text-orange-500">
                      {stats.activeListings}
                    </div>
                    <div className="text-sm text-gray-400">Active Listings</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-xl font-bold text-orange-500">
                      {stats.soldProperties}
                    </div>
                    <div className="text-sm text-gray-400">Sold Properties</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-xl font-bold text-orange-500">
                      {stats.rentedProperties}
                    </div>
                    <div className="text-sm text-gray-400">
                      Rented Properties
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {agent.phone && (
                  <div className="flex items-center gap-3">
                    <svg
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
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                    <div className="text-gray-300">{agent.phone}</div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <svg
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
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <div className="text-gray-300">{agent.email}</div>
                </div>
              </div>

              <div className="mt-8 space-x-4">
                <button
                  className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  onClick={() => router.push("/contact")}
                >
                  Contact Agent
                </button>
                <button
                  className="px-6 py-3 bg-transparent border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500/10 transition-colors"
                  onClick={() => router.push("/contact")}
                >
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Listings */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">
            Properties Listed by {agent.name}
          </h2>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-gray-950 rounded-xl overflow-hidden shadow-md shadow-orange-600/70"
                >
                  <div className="relative h-48">
                    <Image
                      src={property.images[0] || "/placeholder-property.jpg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-orange-500 text-lg">
                      {property.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {property.address?.city}
                      {property.address?.state
                        ? `, ${property.address.state}`
                        : ""}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-bold text-white">
                        ₹{property.price.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {property.area} sq.ft
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <Link
                        href={`/search/${property._id}`}
                        className="block w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-950 rounded-xl">
              <p className="text-gray-400">
                No properties currently listed by this agent.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => fetchAgentDetails(page)}
                      className={`px-4 py-2 rounded ${
                        pagination.page === page
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Client Reviews
            </h2>
            <button
              onClick={() => {
                if (!token) {
                  toast.error("Please login to write a review");
                } else {
                  setShowReviewForm(!showReviewForm);
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <div className="bg-gray-950 rounded-lg shadow-xl shadow-orange-600/70 p-6 mb-8">
              <h3 className="text-lg font-semibold text-orange-500 mb-4">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-gray-200 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200 mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-1">{renderStars(0, true)}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 text-white"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="border-b border-gray-700 pb-6 last:border-0"
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-gray-200">
                      {review.user}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {review.createdAt.toLocaleString().substring(0, 10)}
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-gray-400 text-sm">
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No reviews yet. Be the first to leave a review!
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
