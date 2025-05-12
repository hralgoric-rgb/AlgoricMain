"use client";

import React, { useState, useEffect } from 'react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '../../contexts/FavoritesContext';

// Types
interface Project {
  name: string;
  location: string;
  status: 'Completed' | 'Ongoing';
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

export default function BuilderDetailPage({ params }: { params: { id: string } }) {
  const [builder, setBuilder] = useState<Builder | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchBuilder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/builders/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Builder not found');
          }
          throw new Error('Failed to fetch builder details');
        }

        const data = await response.json();
        setBuilder(data.builder);
        setReviews(data.builder.reviews || []);
      } catch (err) {
        console.error('Error fetching builder:', err);
        setError((err as Error).message || 'Failed to load builder details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilder();
  }, [params.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (userName.trim() === '') {
      alert("Please enter your name");
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        user: userName,
        rating: userRating,
        text: reviewText
      };

      const response = await fetch(`/api/builders/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();

      // Update the builder and reviews with the response data
      setBuilder(data.builder);
      setReviews(data.builder.reviews || []);

      // Reset form
      setUserRating(0);
      setReviewText('');
      setUserName('');
      setShowReviewForm(false);

    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            )}
          </button>
        );
      } else {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        if (i <= fullStars) {
          stars.push(
            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          );
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(
            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          );
        } else {
          stars.push(
            <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          );
        }
      }
    }

    return stars;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-orange-600">{error}</h2>
            <p className="mt-4 text-white text-2xl">The builder you`&apos;`re looking for doesn`&apos;`t exist or has been removed.</p>
            <Link href="/builders" className="mt-6 inline-block px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition-colors">
              Back to Builders
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!builder) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-orange-600">Builder not found</h2>
            <p className="mt-4 text-white text-2xl">The builder you`&apos;`re looking for doesn`&apos;`t exist or has been removed.</p>
            <Link href="/builders" className="mt-6 inline-block px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition-colors">
              Back to Builders
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <div className="h-64 md:h-96 w-full relative">
          <Image
            src={builder.image}
            alt={builder.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
          <div className="absolute bottom-0 left-0 w-full p-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white">
                  <Image
                    src={builder.logo}
                    alt={`${builder.title} logo`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{builder.title}</h1>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex mr-2">
                      {renderStars(builder.rating)}
                    </div>
                    <span className="text-white">{builder.rating}</span>
                    <span className="text-white/70">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Builder Info */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white text-black rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">About {builder.title}</h2>
                <p className="text-gray-700 mb-6">{builder.about || builder.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-orange-600 font-medium">Established</div>
                    <div className="text-gray-900 font-bold mt-1">{builder.established}</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-orange-600 font-medium">Headquarters</div>
                    <div className="text-gray-900 font-bold mt-1">{builder.headquarters}</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-orange-600 font-medium">Total Projects</div>
                    <div className="text-gray-900 font-bold mt-1">{builder.projects}</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="text-orange-600 font-medium">Specialization</div>
                    <div className="text-gray-900 font-bold mt-1">{builder.specialization}</div>
                  </div>
                </div>
              </div>

              {/* Projects */}
              {builder.projects_list && builder.projects_list.length > 0 && (
                <div className="bg-white text-black rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">Featured Projects</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left text-orange-600 font-medium">Project Name</th>
                          <th className="py-3 px-4 text-left text-orange-600 font-medium">Location</th>
                          <th className="py-3 px-4 text-left text-orange-600 font-medium">Type</th>
                          <th className="py-3 px-4 text-left text-orange-600 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {builder.projects_list.map((project, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900">{project.name}</td>
                            <td className="py-3 px-4 text-gray-700">{project.location}</td>
                            <td className="py-3 px-4 text-gray-700">{project.type}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {project.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white text-black rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-600">Customer Reviews</h2>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition-colors text-sm"
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {showReviewForm && (
                  <div className="bg-gray-100 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-orange-600 mb-4">Share Your Experience</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-orange-600 mb-2">Your Name</label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-orange-600 mb-2">Your Rating</label>
                        <div className="flex gap-1">
                          {renderStars(0, true)}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-orange-600 mb-2">Your Review</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 h-32"
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={review._id || index} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium text-orange-600">{review.user}</div>
                          <div className="text-gray-600 text-sm">{review.date}</div>
                        </div>
                        <div className="flex mb-3">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-gray-600 text-sm">{review.rating}</span>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No reviews yet. Be the first to leave a review!
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white text-black rounded-xl shadow-md p-6 mb-8 sticky top-20">
                <h3 className="text-xl font-bold text-orange-600 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-orange-600">Corporate Office</div>
                      <div className="text-gray-700">
                        {builder.title} Tower, {builder.headquarters}<br />
                        India - 110001
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div>
                      <div className="font-medium text-orange-600">Phone</div>
                      <div className="text-gray-700">{builder.contact?.phone || "+91-11-42102030"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div>
                      <div className="font-medium text-orange-600">Email</div>
                      <div className="text-gray-700">{builder.contact?.email || `info@${builder.title.toLowerCase().replace(/\s+/g, '')}.com`}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <div>
                      <div className="font-medium text-orange-600">Website</div>
                      <div className="text-gray-700">{builder.contact?.website || `www.${builder.title.toLowerCase().replace(/\s+/g, '')}.com`}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Link
                    href="/contact"
                    className="w-full px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Contact Builder
                  </Link>
                  <button
                    onClick={() => toggleFavorite(builder._id,'builders' )}
                    className={`w-full px-6 py-3 border text-orange-600 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      isFavorite(builder._id,'builders', )
                        ? 'bg-orange-100 border-orange-600'
                        : 'bg-white border-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite(builder._id,'builders') ? 'currentColor' : 'none'} strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {isFavorite(builder._id,'builders') ? 'Saved to Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
