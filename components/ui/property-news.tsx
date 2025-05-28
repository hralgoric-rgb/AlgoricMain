"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";


// Define type for news articles
type NewsArticle = {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
  };
};

export function PropertyNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Define fetchPropertyNews outside useEffect so it can be reused
  const fetchPropertyNews = async (pageNum = 1, loadMore = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Using the Gnews API (has a free tier)
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=real+estate+property+market+india&lang=en&max=4&page=${pageNum}&apikey=ee109d074f15362d67dd776ff2b449e8`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        if (loadMore) {
          setArticles(prev => [...prev, ...data.articles]);
        } else {
          setArticles(data.articles);
        }
        
        // If we received fewer articles than requested, there are no more to load
        setHasMore(data.articles.length === 4);
      } else {
        throw new Error("Invalid response format");
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    } catch (err) {
      console.error("Error fetching property news:", err);
      setError("Unable to load the latest property news");
      setIsLoading(false);
      setIsLoadingMore(false);

      // Fallback content in case the API fails
      const fallbackArticles: NewsArticle[] = [
          {
            title: "Housing Market Trends: What to Expect in 2023",
            description:
              "Experts predict steady growth in the housing market with increased focus on sustainable properties.",
            url: "#",
            image:
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80",
            publishedAt: "2023-06-15T09:30:00Z",
            source: { name: "Property Insights" },
          },
          {
            title: "New Tax Benefits for First-Time Home Buyers",
            description:
              "Government introduces new incentives to help first-time buyers enter the property market.",
            url: "#",
            image:
              "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=996&q=80",
            publishedAt: "2023-06-12T14:45:00Z",
            source: { name: "Real Estate Daily" },
          },
          {
            title: "Smart Home Technology: The Future of Living",
            description:
              "How smart technology is revolutionizing homes and changing buyer expectations.",
            url: "#",
            image:
              "https://images.unsplash.com/photo-1558002038-bb4237d2e3e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            publishedAt: "2023-06-10T11:20:00Z",
            source: { name: "Tech & Homes" },
          },
          {
            title: "Commercial Real Estate: Post-Pandemic Recovery",
            description:
              "Office spaces see gradual return as companies adopt hybrid work models.",
            url: "#",
            image:
              "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
            publishedAt: "2023-06-08T16:10:00Z",
            source: { name: "Business Property Review" },
          },
        ];

        setArticles(fallbackArticles);
      }
    };

  useEffect(() => {
    fetchPropertyNews(1, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const loadMoreArticles = async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    
    try {
      await fetchPropertyNews(nextPage, true);
    } catch (err) {
      console.error("Error loading more articles:", err);
      
      // Generate 8 more fallback articles when API fails
      const moreFallbackArticles: NewsArticle[] = Array(8).fill(0).map((_, index) => ({
        title: `Property Market Insight #${articles.length + index + 1}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl.",
        url: "#",
        image: `https://images.unsplash.com/photo-${1560518883 + (index * 10)}-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80`,
        publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
        source: { name: "Property Insights" }
      }));
      
      setArticles(prev => [...prev, ...moreFallbackArticles]);
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading && !articles.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="text-center text-orange-500 mb-8">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 group"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={
                    article.image ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80"
                  }
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80";
                  }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-orange-400">
                    {article.source?.name || "Property News"}
                  </span>
                  <span className="mx-2 text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-3">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <button
          onClick={loadMoreArticles}
          disabled={isLoadingMore || !hasMore}
          className={`px-6 py-3 border border-orange-500/30 text-orange-400 font-medium rounded-md hover:bg-orange-500/10 transition-all duration-300 inline-flex items-center ${!hasMore ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoadingMore ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mr-2"></div>
              Loading More...
            </>
          ) : !hasMore ? (
            "No More Articles"
          ) : (
            <>
              Load More Articles
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-7 7l7-7-7-7"
                />
              </svg>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
