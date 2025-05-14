"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  MapPin,
  Building,
  Home,
  Key,
  Store,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Property Search Bar Component
function PropertySearchBar() {
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const router = useRouter();
  const listingTypeTabs = [
    { id: "buy", name: "Buy Properties", icon: <Home className="w-5 h-5" /> },
    { id: "rent", name: "Rent Properties", icon: <Key className="w-5 h-5" /> },
  ];

  const propertyTypeTabs = [
    { id: "flat", name: "Flat", icon: <Building className="w-5 h-5" /> },
    {
      id: "apartment",
      name: "Apartment",
      icon: <Building className="w-5 h-5" />,
    },
    { id: "villa", name: "Villa", icon: <Home className="w-5 h-5" /> },
    {
      id: "commercial",
      name: "Commercial",
      icon: <Store className="w-5 h-5" />,
    },
  ];
  const handleSearch = () => {
    const params = new URLSearchParams();

    // Add the search query if it exists
    if (searchQuery.trim()) {
      params.append("location", searchQuery);
    }

    // For the main listing type (buy/rent)
    if (activeTab === "buy") {
      params.append("filter", "sale");
    } else if (activeTab === "rent") {
      params.append("filter", "rent");
    }

    // For specific property types
    if (
      [
        "house",
        "flat",
        "apartment",
        "villa",
        "townhouse",
        "pg",
        "plot",
        "commercial",
      ].includes(activeTab)
    ) {
      // Map the tab ID to the correct property type name expected by the API
      const propertyTypeMap: { [key: string]: string } = {
        house: "House",
        flat: "Flat",
        apartment: "Apartment",
        villa: "Villa",
        townhouse: "Townhouse",
        pg: "PG/Hostel",
        plot: "Plot",
        commercial: "Commercial",
      };

      // Add the property type filter
      params.append("propertyType", propertyTypeMap[activeTab]);

      // Add default listing type (sale) for property types if not already set
      if (!params.has("filter")) {
        // PG is typically for rent, others default to sale
        params.append("filter", activeTab === "pg" ? "rent" : "sale");
      }
    }

    // Navigate to search page with filters
    router.push(`/search?${params.toString()}`);
  };

  // Handle "Near Me" button click - get user's geolocation
  const handleNearMe = () => {
    setIsLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Create params including current active tab filters
          const params = new URLSearchParams();
          params.append("lat", latitude.toString());
          params.append("lng", longitude.toString());
          params.append("nearMe", "true");

          // Add filter based on active tab
          switch (activeTab) {
            case "buy":
              params.append("filter", "sale");
              break;
            case "rent":
              params.append("filter", "rent");
              break;
            case "new":
              params.append("filter", "sale");
              params.append("isNew", "true");
              break;
            case "pg":
              params.append("filter", "rent");
              params.append("propertyType", "PG/Hostel");
              break;
            case "plot":
              params.append("filter", "sale");
              params.append("propertyType", "Plot");
              break;
            case "commercial":
              params.append("filter", "sale");
              params.append("propertyType", "Commercial");
              break;
            default:
              break;
          }

          // Navigate to search page with location and filters
          router.push(`/search?${params.toString()}`);
          setIsLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Unable to get your location. Please check your browser permissions.",
          );
          setIsLocationLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true },
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLocationLoading(false);
    }
  };

  // Handle Enter key press in search input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const allTabs = [...listingTypeTabs, ...propertyTypeTabs];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.8,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      className="max-w-4xl mx-4 sm:mx-auto mt-6 md:mt-10 bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border border-orange-500/30 shadow-xl shadow-orange-900/40"
    >
      <div className="bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border border-orange-500/20 shadow-xl shadow-orange-900/10">
        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border-b border-white/10 overflow-x-auto scrollbar-hide">
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-2 transition-all duration-300
                      ${
                        activeTab === tab.id
                          ? "text-orange-400"
                          : "text-white/70 hover:text-white"
                      }`}
            >
              <div className="mb-1">{tab.icon}</div>
              <div className="text-xs font-medium">
                {tab.name.split(" ")[0]}
              </div>
              <div className="text-xs opacity-70 hidden sm:block">
                {tab.name.split(" ").slice(1).join(" ")}
              </div>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search Input & Filters */}
        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Main Search Input */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by Location, Project, or Builder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-16 sm:pr-28 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-xl
                        text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30
                        transition-all duration-300 text-sm sm:text-base"
              />

              {/* Location Button */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  onClick={handleNearMe}
                  disabled={isLocationLoading}
                  className="flex items-center gap-1 sm:gap-1.5 bg-black/30 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg
                          text-orange-400 border border-orange-500/20 hover:bg-black/50 transition-colors duration-300 text-xs sm:text-sm"
                >
                  {isLocationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium">Loading...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Near me</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex gap-2">
              <button
                className="h-full px-3 py-2 sm:py-1 bg-gradient-to-r from-orange-600 to-orange-500
                        text-white font-medium flex items-center gap-1 sm:gap-2 rounded-xl hover:brightness-110
                        transition-all duration-300 shadow-lg shadow-orange-900/20 text-sm"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Map Search Option */}
          <div className="mt-3 sm:mt-4 inline-flex items-center gap-2">
            <Link
              href="/search?view=map"
              className="flex items-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-3 rounded-full bg-black/40
                      text-white/70 hover:text-white text-xs sm:text-sm border border-white/10 cursor-pointer
                      hover:border-orange-500/20 transition-all duration-300 group"
            >
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
              <span>Search by</span>
              <span className="text-orange-400 font-medium">Map</span>
              <span>View</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Animated gradient component for highlighted text
function AnimatedGradientText({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  return (
    <span className="inline-block relative overflow-hidden">
      {text.split("").map((letter, letterIndex) => (
        <motion.span
          key={`animated-${letterIndex}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: delay + letterIndex * 0.03,
            type: "spring",
            stiffness: 150,
            damping: 25,
          }}
          className="inline-block relative"
        >
          <motion.span
            className="inline-block text-transparent bg-clip-text absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right,rgb(246, 157, 94),rgb(238, 121, 58),rgb(241, 104, 50),rgb(243, 99, 22),rgb(244, 109, 12), #ea580c, rgb(216, 94, 45), #ea580c, rgb(243, 146, 77))",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% center", "100% center", "0% center"],
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            {letter}
          </motion.span>
          <span className="inline-block text-transparent invisible">
            {letter}
          </span>
        </motion.span>
      ))}
    </span>
  );
}

export function BackgroundPaths() {
  // Split the title into individual words for proper animation
  const firstPartWords = ["Find", "your"];
  const highlightWord = "Perfect";
  const secondPartWords = ["Home", "with"];
  const brandNameWords = ["100", "Gaj"];

  // Calculate delays for animations
  const firstPartDelay = 0;
  const highlightDelay =
    (firstPartWords.join("").length + firstPartWords.length) * 0.03;
  const secondPartDelay = highlightDelay + highlightWord.length * 0.03;
  const brandNameDelay =
    secondPartDelay +
    (secondPartWords.join("").length + secondPartWords.length) * 0.03;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 flex flex-col">
            <span className="mb-4">
              {/* First part - "Find your" - handling each word */}
              {firstPartWords.map((word, wordIndex) => (
                <span key={`word-${wordIndex}`} className="inline-block mr-4">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`first-${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay:
                          firstPartDelay +
                          (wordIndex * word.length + letterIndex) * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text
                                            bg-gradient-to-r from-white to-white/80"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}

              {/* Perfect - with animated gradient */}
              <AnimatedGradientText
                text={highlightWord}
                delay={highlightDelay}
              />
            </span>

            <span className="mb-4">
              {/* Second part - "Home with" - handling each word */}
              {secondPartWords.map((word, wordIndex) => (
                <span
                  key={`second-word-${wordIndex}`}
                  className="inline-block mr-4"
                >
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`second-${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay:
                          secondPartDelay +
                          (wordIndex > 0 ? secondPartWords[0].length + 1 : 0) *
                            0.03 +
                          letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text
                                            bg-gradient-to-r from-white to-white/80"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>

            <span>
              {/* Brand name - "100 Gaj" with animated gradient */}
              {brandNameWords.map((word, wordIndex) => (
                <span
                  key={`brand-word-${wordIndex}`}
                  className="inline-block mr-4"
                >
                  <AnimatedGradientText
                    text={word}
                    delay={
                      brandNameDelay +
                      (wordIndex > 0 ? brandNameWords[0].length + 1 : 0) * 0.03
                    }
                  />
                </span>
              ))}
            </span>
          </h1>

          {/* Property Search Bar */}
          <PropertySearchBar />
        </motion.div>
      </div>
    </div>
  );
}
