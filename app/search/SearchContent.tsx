"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaHeart,
  FaMapMarkerAlt,
  FaArrowRight,
  FaNewspaper,
  FaMap,
  FaList,
} from "react-icons/fa";

import Map from "../components/Map";
import Link from "next/link";
import Navbar from "../components/navbar";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";



// Mock property data
const priceRanges = [
  { label: "Any Price", value: [0, 100000000] },
  { label: "Under ₹20 Lakh", value: [0, 2000000] },
  { label: "₹20 Lakh - ₹50 Lakh", value: [2000000, 5000000] },
  { label: "₹50 Lakh - ₹1 Crore", value: [5000000, 10000000] },
  { label: "₹1 Crore - ₹2 Crore", value: [10000000, 20000000] },
  { label: "Above ₹2 Crore", value: [20000000, 100000000] },
];

const areaRanges = [
  { label: "Any Size", value: [0, 10000] },
  { label: "Under 500 sqft", value: [0, 500] },
  { label: "500 - 1000 sqft", value: [500, 1000] },
  { label: "1000 - 2000 sqft", value: [1000, 2000] },
  { label: "2000 - 3000 sqft", value: [2000, 3000] },
  { label: "Above 3000 sqft", value: [3000, 10000] },
];

const mockProperties: Property[] = [
  {
    _id: "1",
    title: "Luxury Penthouse with City View",
    location: "Rohini, New Delhi",
    address: {
      street: "123 Main St",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      location: {
        type: "Point",
        coordinates: [77.1907, 28.7091],
      },
    },
    price: 2500000,
    propertyType: "Apartment",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 2500,
    images: ["/canada.jpeg"],
    tags: ["Luxury", "City View", "Penthouse"],
  },
  {
    _id: "2",
    title: "Modern Villa with Pool",
    location: "Dwarka, New Delhi",
    address: {
      street: "123 Main St",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      location: {
        type: "Point",
        coordinates: [77.1907, 28.7091],
      },
    },
    price: 4200000,
    propertyType: "Villa",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 4800,
    images: ["/airpirt.jpeg"],
    tags: ["Luxury", "Pool", "Modern"],
  },
  {
    _id: "3",
    title: "Waterfront Condo",
    location: "East Delhi",
    address: {
      street: "123 Main St",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      location: {
        type: "Point",
        coordinates: [77.1907, 28.7091],
      },
    },
    price: 1800000,
    propertyType: "Condo",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    images: ["/dwarka.jpeg"],
    tags: ["Waterfront", "Beach", "Modern"],
  },
  {
    _id: "4",
    title: "Historic Townhouse",
    location: "Vasant Vihar, New Delhi",
    address: {
      street: "123 Main St",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      location: {
        type: "Point",
        coordinates: [77.1907, 28.7091],
      },
    },
    price: 1950000,
    propertyType: "Townhouse",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    images: ["/image1.jpg"],
    tags: ["Historic", "Renovated", "Central"],
  },
  {
    _id: "5",
    title: "Luxury Apartment for Rent",
    location: "South Delhi",
    address: {
      street: "123 Main St",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      location: {
        type: "Point",
        coordinates: [77.1907, 28.7091],
      },
    },
    price: 8500,
    propertyType: "Apartment",
    listingType: "rent",
    status: "For Rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    images: ["/image2.avif"],
    tags: ["Luxury", "Furnished", "Doorman"],
  },
  {
    _id: "6",
    title: "Modern Office Space",
    location: "Model Town, New Delhi",
    address: {
      street: "123 Main St",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      location: {
        type: "Point",
        coordinates: [77.1907, 28.7091],
      },
    },
    price: 3200000,
    propertyType: "Commercial",
    listingType: "sale",
    status: "For Sale",
    bedrooms: 0,
    bathrooms: 2,
    area: 2800,
    images: ["/image3.webp"],
    tags: ["Commercial", "Modern", "Downtown"],
  },
];

// Update the property interface to match API response
interface Property {
  _id: string;
  title: string;
  location?: string;
  address: {
    street?: string;
    city: string;
    state?: string;
    zipCode?: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  price: number;
  propertyType: string;
  listingType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  tags?: string[];
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface FilterState {
  priceRange: [number, number];
  propertyType: string[];
  status: string[];
  beds: number[];
  baths: number[];
  area: [number, number];
  mapBounds?: MapBounds;
}

// Interface for articles
interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string; // We'll map GNews 'image' to this field
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}
// const isServer = () => typeof window === 'undefined';

const SearchPage = () => {
  // if(isServer())return null;
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const authToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("authToken")
        : null;
    if (authToken) {
      setToken(authToken);
    }
  }, []);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    propertyType: [],
    status: [],
    beds: [],
    baths: [],
    area: [0, 5000],
  });
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 }); // Delhi coordinates
  const [zoom, setZoom] = useState(12);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [showArticles, setShowArticles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newlyAddedProperties, setNewlyAddedProperties] = useState<Set<string>>(
    new Set(),
  );
  const [favorites, setFavorites] = useState<{ properties: string[] }>({
    properties: [],
  });
  const router = useRouter();
  // Property types from backend
  const propertyTypes = [
    "House",
    "Flat",
    "PG/Hostel",
    "Plot",
    "Commercial",
    "Apartment",
    "Villa",
    "Townhouse",
  ];
  const bedOptions = [1, 2, 3, 4, 5, 6];

  // Fetch initial properties on component mount
  useEffect(() => {
    fetchProperties();
    const filterParam = searchParams.get("filter");
    if (filterParam === "sale") {
      setSelectedFilters((prev) => ({
        ...prev,
        status: ["sale"],
      }));
    } else if (filterParam === "rent") {
      setSelectedFilters((prev) => ({
        ...prev,
        status: ["rent"],
      }));
    }

    const propertyTypeParam = searchParams.get("propertyType");
    if (propertyTypeParam) {
      setSelectedFilters((prev) => {
        // Only add the property type if it's not already in the list
        if (!prev.propertyType.includes(propertyTypeParam)) {
          return {
            ...prev,
            propertyType: [...prev.propertyType, propertyTypeParam],
          };
        }
        return prev;
      });
    }

    const locationParam = searchParams.get("location");
    if (locationParam) {
      setSearchQuery(locationParam);
    }

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const nearMe = searchParams.get("nearMe");

    if (lat && lng && nearMe === "true") {
      // Update map center to user's location
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      setMapCenter({ lat: userLat, lng: userLng });
      setZoom(14); // Closer zoom for near me
    }
  }, [searchParams]);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("/api/properties");

      if (response.data.success) {
        const properties = response.data.properties;
        console.log("Properties: ", properties);
        // Store the properties in sessionStorage for quick access on refresh
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              "cachedProperties",
              JSON.stringify(properties),
            );
            sessionStorage.setItem(
              "propertiesCacheTime",
              new Date().toString(),
            );
          } catch (e) {
            console.warn("Failed to cache properties in sessionStorage:", e);
          }
        }
        setAllProperties(properties);
        setFilteredProperties(properties);
      } else {
        // Use mock data as fallback
        setAllProperties(mockProperties);
        setFilteredProperties(mockProperties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);

      // Try to get cached properties from sessionStorage
      if (typeof window !== "undefined") {
        try {
          const cachedProperties = sessionStorage.getItem("cachedProperties");
          if (cachedProperties) {
            const properties = JSON.parse(cachedProperties);
            setAllProperties(properties);
            setFilteredProperties(properties);
            return;
          }
        } catch (e) {
          console.warn("SessionStorage error:", e);
        }
      }

      // Use mock data as fallback if no cache
      setAllProperties(mockProperties);
      setFilteredProperties(mockProperties);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the searchPropertiesInMapBounds function
  const searchPropertiesInMapBounds = async () => {
    if (!mapBounds) return;

    try {
      setIsLoading(true);

      const { north, south, east, west } = mapBounds;

      // Prepare query parameters for filters
      const params: Record<string, string | number> = {
        north,
        south,
        east,
        west,
        zoom,
      };

      // Add other filters if they are set
      if (selectedFilters.propertyType.length > 0) {
        params.propertyType = selectedFilters.propertyType.join(",");
      }

      if (selectedFilters.status.includes("sale")) {
        params.listingType = "sale";
      } else if (selectedFilters.status.includes("rent")) {
        params.listingType = "rent";
      }

      if (selectedFilters.priceRange[0] > 0) {
        params.minPrice = selectedFilters.priceRange[0];
      }

      if (selectedFilters.priceRange[1] < 100000000) {
        params.maxPrice = selectedFilters.priceRange[1];
      }

      if (selectedFilters.beds.length > 0) {
        params.bedrooms = Math.min(...selectedFilters.beds);
      }

      if (selectedFilters.baths.length > 0) {
        params.bathrooms = Math.min(...selectedFilters.baths);
      }

      if (searchQuery && searchQuery.trim() !== "") {
        params.search = searchQuery.trim();
      }

      // Log the params for debugging
      console.log("Search params:", params);

      try {
        const response = await axios.get("/api/properties/map-search", {
          params,
        });

        if (response.data.properties && response.data.properties.length > 0) {
          const apiProperties = response.data.properties;

          // Update filteredProperties with the API results
          setFilteredProperties(apiProperties);
        } else {
          // If API returns no results, filter current properties based on bounds
          const propertiesInBounds = allProperties.filter((prop) => {
            if (!prop.address?.location?.coordinates) return false;

            const lat = prop.address.location.coordinates[1];
            const lng = prop.address.location.coordinates[0];

            // Apply client-side filters for map-bound properties
            if (!isPropertyMatchingFilters(prop)) return false;

            return lat <= north && lat >= south && lng <= east && lng >= west;
          });

          setFilteredProperties(propertiesInBounds);
        }
      } catch (error) {
        console.error("Error fetching properties in map bounds:", error);

        // Fallback to client-side filtering based on map bounds
        fallbackToClientFiltering();
      }
    } catch (error) {
      console.error("Error in searchPropertiesInMapBounds:", error);
      fallbackToClientFiltering();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a property matches current filters
  const isPropertyMatchingFilters = (property: Property) => {
    // Search query filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        (property.location &&
          property.location.toLowerCase().includes(query)) ||
        (property.address?.city &&
          property.address.city.toLowerCase().includes(query)) ||
        (property.address?.state &&
          property.address.state.toLowerCase().includes(query)) ||
        (property.propertyType &&
          property.propertyType.toLowerCase().includes(query)) ||
        (property.tags &&
          property.tags.some((tag) => tag.toLowerCase().includes(query)));

      if (!matchesSearch) return false;
    }

    // Property type filter
    if (
      selectedFilters.propertyType.length > 0 &&
      !selectedFilters.propertyType.some(
        (type) =>
          property.propertyType &&
          property.propertyType.toLowerCase() === type.toLowerCase(),
      )
    ) {
      return false;
    }

    // Status filter
    if (
      selectedFilters.status.length > 0 &&
      !selectedFilters.status.some((status) => property.listingType === status)
    ) {
      return false;
    }

    // Beds filter
    if (
      selectedFilters.beds.length > 0 &&
      !selectedFilters.beds.includes(property.bedrooms)
    ) {
      return false;
    }

    // Baths filter
    if (
      selectedFilters.baths.length > 0 &&
      !selectedFilters.baths.includes(property.bathrooms)
    ) {
      return false;
    }

    // Area filter
    if (
      property.area < selectedFilters.area[0] ||
      property.area > selectedFilters.area[1]
    ) {
      return false;
    }

    // Price filter
    if (
      property.price < selectedFilters.priceRange[0] ||
      property.price > selectedFilters.priceRange[1]
    ) {
      return false;
    }

    return true;
  };

  // Fallback function for client-side filtering with map bounds
  const fallbackToClientFiltering = () => {
    if (!mapBounds) return;

    const { north, south, east, west } = mapBounds;

    const propertiesInBounds = allProperties.filter((prop) => {
      if (!prop.address?.location?.coordinates) return false;

      const lat = prop.address.location.coordinates[1];
      const lng = prop.address.location.coordinates[0];

      // Check if the property is within map bounds
      const isInBounds =
        lat <= north && lat >= south && lng <= east && lng >= west;

      // Apply additional filters
      return isInBounds && isPropertyMatchingFilters(prop);
    });

    setFilteredProperties(propertiesInBounds);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SearchQuery: ", searchQuery);
    filterProperties();
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleMapBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
    // searchPropertiesInMapBounds();
    setSelectedFilters((prev) => ({
      ...prev,
      mapBounds: bounds,
    }));
  };

  // Update filterProperties function to properly filter properties
  const filterProperties = useCallback(() => {
    // if (mapBounds) {
    //     // If map bounds exist, use API for map-based search
    //     searchPropertiesInMapBounds();
    //     return;
    // }

    // Otherwise perform client-side filtering
    const filtered = allProperties.filter((property) => {
      // Skip properties without proper coordinates
      if (!property.address?.location?.coordinates) {
        return false;
      }

      // Search query filter
      if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          property.title.toLowerCase().includes(query) ||
          (property.location &&
            property.location.toLowerCase().includes(query)) ||
          (property.address?.city &&
            property.address.city.toLowerCase().includes(query)) ||
          (property.address?.state &&
            property.address.state.toLowerCase().includes(query)) ||
          (property.propertyType &&
            property.propertyType.toLowerCase().includes(query)) ||
          (property.tags &&
            property.tags.some((tag) => tag.toLowerCase().includes(query)));

        if (!matchesSearch) return false;
      }

      // Property type filter - case insensitive comparison
      if (
        selectedFilters.propertyType.length > 0 &&
        !selectedFilters.propertyType.some(
          (type) =>
            property.propertyType &&
            property.propertyType.toLowerCase() === type.toLowerCase(),
        )
      ) {
        return false;
      }

      // Status filter (rent or sale) - check listingType property
      if (
        selectedFilters.status.length > 0 &&
        !selectedFilters.status.some(
          (status) => property.listingType === status,
        )
      ) {
        return false;
      }

      // Beds filter - exact match
      if (
        selectedFilters.beds.length > 0 &&
        !selectedFilters.beds.includes(property.bedrooms)
      ) {
        return false;
      }

      // Baths filter - exact match
      if (
        selectedFilters.baths.length > 0 &&
        !selectedFilters.baths.includes(property.bathrooms)
      ) {
        return false;
      }

      // Area filter
      if (
        property.area < selectedFilters.area[0] ||
        property.area > selectedFilters.area[1]
      ) {
        return false;
      }

      // Price filter
      if (
        property.price < selectedFilters.priceRange[0] ||
        property.price > selectedFilters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });

    setFilteredProperties(filtered);
  },[allProperties,searchQuery,selectedFilters]);

  // Move useEffect to the end of the component
  useEffect(() => {
    // Add a small delay to prevent too many rapid calls when changing filters
    const timer = setTimeout(() => {
      console.log("Filtering properties due to filter/search change");
      console.log("Current filters:", selectedFilters);
      console.log("Search query:", searchQuery);
      filterProperties();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedFilters, searchQuery, filterProperties]);

  // Make a separate useEffect for property data changes
  useEffect(() => {
    if (allProperties.length > 0) {
      console.log("Filtering properties due to data change");
      filterProperties();
    }
  }, [allProperties, filterProperties]);

  // Detect screen size and set initial map visibility
  useEffect(() => {
    const handleResize = () => {
      // On larger screens (md and up), both map and list are visible
      // On mobile, default to showing the list view
      const isMobile = window.innerWidth < 768;
      setShowMap(!isMobile);
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset filters function
  const resetFilters = () => {
    setSelectedFilters({
      priceRange: [0, 100000000],
      propertyType: [],
      status: [],
      beds: [],
      baths: [],
      area: [0, 10000],
    });
    setSearchQuery("");
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string) => {
    try {
      // Check if property is already in favorites
      const isFavorited = favorites?.properties?.includes(propertyId);

      if (isFavorited) {
        // Remove from favorites
        await axios.delete(`/api/users/favorites/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Removed from favorites");
        // Update local state
        setFavorites((prev) => ({
          ...prev,
          properties: prev?.properties?.filter((id) => id !== propertyId) || [],
        }));
      } else {
        // Add to favorites
        await axios.post(
          "/api/users/favorites",
          { propertyId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Added to favorites");
        // Update local state
        setFavorites((prev) => ({
          ...prev,
          properties: [...(prev?.properties || []), propertyId],
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Please login to add or remove favorites");
    }
  };

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      setArticlesLoading(true);
      setArticlesError(null);

      try {
        // Using GNews API instead of NewsAPI.org
        const response = await axios.get("https://gnews.io/api/v4/search", {
          params: {
            q: "real estate property market",
            lang: "en",
            max: 100,
            apikey: "ee109d074f15362d67dd776ff2b449e8", // GNews API key
          },
        });

        if (response.data && response.data.articles) {
          // Transform the data to match our interface
          const transformedArticles = response.data.articles.map(
            (
              article: {
                title: string;
                description?: string;
                url: string;
                image?: string; // GNews uses 'image' instead of 'urlToImage'
                publishedAt: string;
                source: { name: string };
              },
              index: number,
            ) => ({
              id: `article-${index}`,
              title: article.title,
              description: article.description || "No description available",
              url: article.url,
              urlToImage: article.image || "/placeholder-news.jpg", // Map image to urlToImage
              publishedAt: article.publishedAt,
              source: article.source,
              category: categorizeArticle(
                article.title,
                article.description || "",
              ),
            }),
          );

          setArticles(transformedArticles);
        } else {
          setArticlesError("No articles found");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticlesError("Failed to fetch articles");

        // Use fallback articles similar to what we do in property-news.tsx
        const fallbackArticles = Array(10)
          .fill(0)
          .map((_, index) => ({
            id: `article-${index}`,
            title: `Property Market Insight #${index + 1}`,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget ultricies ultrices, nisl nisl aliquam nisl.",
            url: "#",
            urlToImage: `https://images.unsplash.com/photo-${1560518883 + index * 10}-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=773&q=80`,
            publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
            source: { name: "Property Insights" },
            category: index % 2 === 0 ? "Market Analysis" : "Investment Tips",
          }));
        setArticles(fallbackArticles);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Helper function to categorize articles
  const categorizeArticle = (title: string, description: string): string => {
    const content = `${title} ${description}`.toLowerCase();

    if (
      content.includes("market") ||
      content.includes("price") ||
      content.includes("investment")
    ) {
      return "Market";
    } else if (
      content.includes("policy") ||
      content.includes("regulation") ||
      content.includes("law")
    ) {
      return "Policy";
    } else if (
      content.includes("tips") ||
      content.includes("advice") ||
      content.includes("guide")
    ) {
      return "Advice";
    } else {
      return "News";
    }
  };

  // Mock articles for fallback
  // const mockArticles: Article[] = [
  //   {
  //     id: "1",
  //     title: "Real Estate Trends in India for 2024",
  //     description:
  //       "Find out the latest market trends and investment opportunities in the Indian real estate sector for 2024.",
  //     url: "#",
  //     urlToImage: "/article1.jpg",
  //     publishedAt: "2024-05-01T10:00:00Z",
  //     source: { name: "Real Estate News" },
  //     category: "Market",
  //   },
  //   {
  //     id: "2",
  //     title: "New Housing Policies Announced in Delhi",
  //     description:
  //       "The Delhi government has announced new housing policies to make affordable housing accessible to more citizens.",
  //     url: "#",
  //     urlToImage: "/article2.jpg",
  //     publishedAt: "2024-05-02T09:30:00Z",
  //     source: { name: "Delhi News" },
  //     category: "Policy",
  //   },
  //   {
  //     id: "3",
  //     title: "Tips for First-Time Home Buyers in India",
  //     description:
  //       "Essential advice for first-time home buyers navigating the complex real estate market in India.",
  //     url: "#",
  //     urlToImage: "/article3.jpg",
  //     publishedAt: "2024-05-03T11:15:00Z",
  //     source: { name: "Home Buying Guide" },
  //     category: "Advice",
  //   },
  //   {
  //     id: "4",
  //     title: "Luxury Real Estate Booming in Mumbai",
  //     description:
  //       "The luxury real estate segment in Mumbai is experiencing unprecedented growth despite economic challenges.",
  //     url: "#",
  //     urlToImage: "/image1.jpg",
  //     publishedAt: "2024-05-04T08:45:00Z",
  //     source: { name: "Mumbai Property News" },
  //     category: "Market",
  //   },
  //   {
  //     id: "5",
  //     title: "Environmental Considerations in Modern Housing",
  //     description:
  //       "How sustainable practices are being incorporated into modern housing developments across India.",
  //     url: "#",
  //     urlToImage: "/image2.avif",
  //     publishedAt: "2024-05-05T14:20:00Z",
  //     source: { name: "Green Living" },
  //     category: "News",
  //   },
  //   {
  //     id: "6",
  //     title: "Commercial Real Estate Outlook Post-Pandemic",
  //     description:
  //       "Analysis of how commercial real estate in India has evolved after the pandemic and what to expect in the future.",
  //     url: "#",
  //     urlToImage: "/image3.webp",
  //     publishedAt: "2024-05-06T16:10:00Z",
  //     source: { name: "Business Property Review" },
  //     category: "Market",
  //   },
  // ];

  // Format publication date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const navItems = [{ label: "Home", href: "/" }];

  // Initialize from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedNewProperties = sessionStorage.getItem(
          "newlyAddedProperties",
        );
        if (storedNewProperties) {
          setNewlyAddedProperties(new Set(JSON.parse(storedNewProperties)));
        }
      } catch (e) {
        console.warn("SessionStorage error:", e);
      }
    }
  }, []);

  // This function will be called when new properties are added to the system
  // Add a useEffect to fetch user favorites when the component loads
  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       // Fetch user's favorite properties
  //       const response = await axios.get("/api/users/favorites/properties");
  //       setFavorites({
  //         properties: response.data.favorites.map(
  //           (fav: { _id: string }) => fav._id,
  //         ),
  //       });
  //     } catch (error) {
  //       console.error("Error fetching favorites:", error);
  //     }
  //   };

  //   fetchFavorites();
  // }, [mockArticles]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Fixed Search Bar */}
      <div className="sticky top-0 z-50 bg-black shadow-orange-500 shadow-md">
        <div className="container mx-auto px-0 md:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center pl-4 md:pl-0">
              <Image src="/logo.png" alt="100Gaj" width={64} height={64}/>
            </div>

            <div className="flex items-center gap-3 flex-1 px-4 md:px-0 md:ml-8 md:max-w-xl">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      filterProperties();
                    }
                  }}
                  placeholder="Search location, property type..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-black"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="px-3 py-2 bg-orange-500 text-white rounded-md transition-colors flex items-center gap-1 hover:bg-orange-600"
              >
                <FaFilter className="h-3 w-3" />
                <span className="text-sm">Filters</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 pr-4 md:pr-0">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-orange-600">
                  {filteredProperties.length}
                </span>{" "}
                properties found
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedFilters.propertyType.length > 0 ||
            selectedFilters.beds.length > 0 ||
            selectedFilters.priceRange[0] > 0 ||
            selectedFilters.priceRange[1] < 100000000 ||
            selectedFilters.area[0] > 0 ||
            selectedFilters.area[1] < 10000 ||
            selectedFilters.status.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400">Active filters:</span>

              {selectedFilters.status.includes("sale") && (
                <button
                  onClick={() => {
                    const newStatus = selectedFilters.status.filter(
                      (s) => s !== "sale",
                    );
                    handleFilterChange("status", newStatus);
                  }}
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                >
                  For Sale <FaTimes className="h-2 w-2" />
                </button>
              )}

              {selectedFilters.status.includes("rent") && (
                <button
                  onClick={() => {
                    const newStatus = selectedFilters.status.filter(
                      (s) => s !== "rent",
                    );
                    handleFilterChange("status", newStatus);
                  }}
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                >
                  For Rent <FaTimes className="h-2 w-2" />
                </button>
              )}

              {selectedFilters.propertyType.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    const newTypes = selectedFilters.propertyType.filter(
                      (t) => t !== type,
                    );
                    handleFilterChange("propertyType", newTypes);
                  }}
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                >
                  {type} <FaTimes className="h-2 w-2" />
                </button>
              ))}

              {selectedFilters.beds.length > 0 && (
                <button
                  onClick={() => handleFilterChange("beds", [])}
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                >
                  {selectedFilters.beds.join(", ")} BHK{" "}
                  <FaTimes className="h-2 w-2" />
                </button>
              )}

              {(selectedFilters.priceRange[0] > 0 ||
                selectedFilters.priceRange[1] < 100000000) && (
                <button
                  onClick={() =>
                    handleFilterChange("priceRange", [0, 100000000])
                  }
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                >
                  ₹{selectedFilters.priceRange[0] / 100000}L - ₹
                  {selectedFilters.priceRange[1] / 100000}L{" "}
                  <FaTimes className="h-2 w-2" />
                </button>
              )}

              {(selectedFilters.area[0] > 0 ||
                selectedFilters.area[1] < 10000) && (
                <button
                  onClick={() => handleFilterChange("area", [0, 10000])}
                  className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 border border-gray-700"
                >
                  {selectedFilters.area[0]}-{selectedFilters.area[1]} sqft{" "}
                  <FaTimes className="h-2 w-2" />
                </button>
              )}

              <button
                onClick={resetFilters}
                className="px-2 py-2 bg-orange-600 hover:text-orange-600 text-xs transition-colors font-medium rounded-lg"
              >
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal - Simple Design */}
      <AnimatePresence>
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/50 flex items-start justify-end z-[1000]"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="bg-black h-full w-full md:max-w-md overflow-y-auto shadow-orange-500 shadow-sm"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 z-10 flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Filters</h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-700"
                  onClick={() => setShowFilters(false)}
                >
                  <FaTimes className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Property Status */}
                <div>
                  <h3 className="font-medium mb-3 text-white">Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const newStatus = selectedFilters.status.includes(
                          "sale",
                        )
                          ? selectedFilters.status.filter((s) => s !== "sale")
                          : [...selectedFilters.status, "sale"];
                        handleFilterChange("status", newStatus);
                      }}
                      className={`px-4 py-2 rounded-md text-sm ${
                        selectedFilters.status.includes("sale")
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      For Sale
                    </button>
                    <button
                      onClick={() => {
                        const newStatus = selectedFilters.status.includes(
                          "rent",
                        )
                          ? selectedFilters.status.filter((s) => s !== "rent")
                          : [...selectedFilters.status, "rent"];
                        handleFilterChange("status", newStatus);
                      }}
                      className={`px-4 py-2 rounded-md text-sm ${
                        selectedFilters.status.includes("rent")
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      For Rent
                    </button>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h3 className="font-medium mb-3 text-white">Property Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          const newTypes =
                            selectedFilters.propertyType.includes(type)
                              ? selectedFilters.propertyType.filter(
                                  (t) => t !== type,
                                )
                              : [...selectedFilters.propertyType, type];
                          handleFilterChange("propertyType", newTypes);
                        }}
                        className={`px-3 py-2 rounded-md text-sm ${
                          selectedFilters.propertyType.includes(type)
                            ? "bg-orange-500 text-white"
                            : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BHK Configuration */}
                <div>
                  <h3 className="font-medium mb-3 text-white">Bedrooms</h3>
                  <div className="flex gap-1">
                    {bedOptions.map((bed) => (
                      <button
                        key={bed}
                        onClick={() => {
                          const newBeds = selectedFilters.beds.includes(bed)
                            ? selectedFilters.beds.filter((b) => b !== bed)
                            : [...selectedFilters.beds, bed];
                          handleFilterChange("beds", newBeds);
                        }}
                        className={`flex-1 py-2 rounded-md text-sm ${
                          selectedFilters.beds.includes(bed)
                            ? "bg-orange-500 text-white"
                            : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                        }`}
                      >
                        {bed} BHK
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3 text-white">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleFilterChange("priceRange", range.value)
                        }
                        className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                          selectedFilters.priceRange[0] === range.value[0] &&
                          selectedFilters.priceRange[1] === range.value[1]
                            ? "bg-orange-500 text-white"
                            : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area Range */}
                <div>
                  <h3 className="font-medium mb-3 text-white">Area (sqft)</h3>
                  <div className="space-y-2">
                    {areaRanges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => handleFilterChange("area", range.value)}
                        className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                          selectedFilters.area[0] === range.value[0] &&
                          selectedFilters.area[1] === range.value[1]
                            ? "bg-orange-500 text-white"
                            : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-black p-4 border-t border-gray-700 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-md bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setShowFilters(false);
                    filterProperties();
                  }}
                  className="flex-1 py-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Map Toggle Button - Only visible on small screens */}
      <div className="md:hidden sticky top-[85px] z-20 bg-black py-2 px-4 flex justify-between border-b border-gray-800">
        <Image src="/logo.png" height={64} width={64} alt="100Gaj"/>
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-3 py-1.5 bg-orange-500 text-white rounded-md text-sm font-medium flex items-center gap-1.5"
        >
          {showMap ? (
            <>
              <FaList className="h-3 w-3" />
              <span>Show List</span>
            </>
          ) : (
            <>
              <FaMap className="h-3 w-3" />
              <span>Show Map</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col md:flex-row ${showFilters ? "h-[calc(100vh-125px)]" : "h-[calc(100vh-85px)]"}`}
      >
        {/* Map Section */}
        <div
          className={`${showMap ? "block" : "hidden"} md:block md:w-1/2 relative h-[calc(100vh-150px)] md:h-auto`}
        >
          <Map
            center={mapCenter}
            zoom={zoom}
            properties={filteredProperties.map((property) => ({
              id: property._id,
              coordinates: property.address?.location?.coordinates
                ? {
                    lat: property.address.location.coordinates[1],
                    lng: property.address.location.coordinates[0],
                  }
                : { lat: 28.7041, lng: 77.1025 }, // Default to Delhi if no coordinates
              title: property.title,
              price:
                typeof property.price === "string"
                  ? property.price
                  : `₹${property.price.toLocaleString()}`,
              type: property.propertyType,
              isNew: newlyAddedProperties.has(property._id), // Mark as new if in our tracked set
            }))}
            onMarkerClick={(propertyId) => {
              const element = document.getElementById(`property-${propertyId}`);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            onBoundsChanged={handleMapBoundsChange}
            // mapStyle="dark" // Set the map style to dark
          />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center z-10">
            <button
              onClick={() => {
                if (mapBounds) {
                  searchPropertiesInMapBounds();
                  setShowMap(false); // Hide map after search
                }
              }}
              className="bg-orange-500 text-white px-3 py-1 rounded-md shadow-orange-500 shadow-sm hover:bg-orange-600 transition-colors font-bold"
            >
              Search this area
            </button>

            {/* List view toggle button - only visible on mobile when map is shown */}
            
          </div>
        </div>

        {/* Properties List + Articles Section */}
        <div
          className={`${!showMap ? "block" : "hidden"} md:block md:w-1/2 bg-black overflow-y-auto`}
        >
          <div className="p-4 md:p-6">
            {/* Properties Count + Article Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-orange-600">
                  {filteredProperties.length}
                </span>{" "}
                properties found
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowArticles(!showArticles)}
                  className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <FaNewspaper className="h-3 w-3" />
                  <span>
                    {showArticles ? "Hide Articles" : "Show Articles"}
                  </span>
                </button>
              </div>
            </div>

            {/* Properties List */}
            {!showArticles && (
              <>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProperties.map((property) => (
                      <motion.div
                        key={property._id}
                        id={`property-${property._id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`bg-gray-900 rounded-md shadow-orange-500 shadow-md overflow-hidden hover:shadow-md transition-shadow text-white`}
                      >
                        <div className="flex flex-col md:flex-row cursor-pointer" onClick={() => {
                          router.push(`/search/${property._id}`)
                        }}>
                          <div className="relative md:w-2/5">
                            <img
                              src={
                                property.images && property.images.length > 0
                                  ? property.images[0]
                                  : "/placeholder.jpg"
                              }
                              alt={property.title}
                              className="w-full h-48 md:h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="bg-orange-600/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                                {property.listingType === "rent"
                                  ? "For Rent"
                                  : "For Sale"}
                              </span>
                            </div>
                            {newlyAddedProperties.has(property._id) && (
                              <div className="absolute top-2 left-2">
                                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  New
                                </span>
                              </div>
                            )}
                            <button
                              className="absolute top-2 left-2 h-8 w-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm transition"
                              onClick={() => toggleFavorite(property._id)}
                              style={{
                                left: newlyAddedProperties.has(property._id)
                                  ? "55px"
                                  : "10px",
                              }}
                            >
                              <FaHeart
                                className={`h-4 w-4 ${favorites?.properties?.includes(property._id) ? "text-orange-500" : "text-gray-400 hover:text-orange-500"}`}
                              />
                            </button>
                          </div>
                          <div className="p-4 md:w-3/5 flex flex-col">
                            <div className="mb-auto">
                              <h3 className="text-base font-medium text-white line-clamp-1">
                                {property.title}
                              </h3>
                              <p className="text-xs mt-1 flex items-center text-white/60">
                                <FaMapMarkerAlt className="h-3 w-3 mr-1 text-orange-400" />
                                {property.address?.city
                                  ? `${property.address.city}, ${property.address.state || ""}`
                                  : "Location unavailable"}
                              </p>

                              <div className="mt-3 flex items-center text-xs text-white/70">
                                {property.bedrooms > 0 && (
                                  <div className="flex items-center mr-3">
                                    <FaBed className="h-3 w-3 mr-1 text-white" />
                                    <span>{property.bedrooms} BHK</span>
                                  </div>
                                )}
                                {property.bathrooms > 0 && (
                                  <div className="flex items-center mr-3">
                                    <FaBath className="h-3 w-3 mr-1 text-white" />
                                    <span>{property.bathrooms} Baths</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <FaRulerCombined className="h-3 w-3 mr-1 text-white" />
                                  <span>
                                    {typeof property.area === "string"
                                      ? property.area
                                      : `${property.area} sqft`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                              <div className="text-orange-500 font-medium">
                                {typeof property.price === "string"
                                  ? property.price
                                  : `₹${property.price.toLocaleString()}`}
                              </div>
                              <Link
                                href={`/search/${property._id}`}
                                className="px-3 py-1 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1 border border-gray-700"
                              >
                                View Details{" "}
                                <FaArrowRight className="h-2 w-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 bg-white rounded-md shadow-orange-500 shadow-sm border border-gray-700">
                    <FaSearch className="h-6 w-6 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      No properties found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm rounded-md hover:shadow-md"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Articles Section */}
            {showArticles && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Real Estate News
                  </h2>
                </div>

                {articlesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : articlesError ? (
                  <div className="text-center py-8 px-4 bg-white rounded-md shadow-orange-500 shadow-sm border border-gray-700">
                    <p className="text-gray-500">{articlesError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-md shadow-orange-500 shadow-sm overflow-hidden border border-gray-700 flex flex-col"
                      >
                        <div className="relative h-40">
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                            {article.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatDate(article.publishedAt)}
                            </span>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1 border border-gray-700"
                            >
                              Read Article <FaArrowRight className="h-2 w-2" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div
        className="fixed bottom-1 left-0 right-0 z-50 flex justify-center items-center pb-4 md:pb-6 pointer-events-none"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="backdrop-blur-lg rounded-full shadow-lg border border-white/20 px-2 py-1.5 pointer-events-auto bg-orange-600 hover:bg-orange-800">
          <div className="flex space-x-1 relative">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2 py-1 text-base rounded-full transition-all duration-300 font-bold ${
                  item.href === "/search" ? "text-white" : "text-white"
                }`}
              >
                {item.href === "/search" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black to-orange-500 rounded-full -z-10"
                    layoutId="indicator"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchPage;
