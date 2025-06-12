"use client";

import { useState, useEffect, useCallback } from "react";
import { FavoritesAPI } from "../lib/api-helpers";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, HomeIcon, Building, Users, MapPin } from "lucide-react";
import Navbar from "../components/navbar";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  beds: number;
  baths: number;
  area: number;
  images: string[];
  tags?: string[];
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  address?: {
    city?: string;
    state?: string;
  };
  isAgent: boolean;
  agentInfo: {
    role?: string;
    experience: number;
    rating: number;
    specializations: string[];
    languages: string[];
    properties?: number;
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
  reviews?: Array<{ user: string; rating: number; date: string; text: string }>;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
}

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== "undefined") {
      const authToken = sessionStorage.getItem("authToken") || document.cookie.split(";").find((cookie) => cookie.startsWith("authToken="))?.split("=")[1];
      if (authToken) {
        setToken(authToken);
        console.log("authToken: ", token);
      } else {
        toast.error("Please login to proceed!! Redirecting to home page!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      switch (activeTab) {
        case "properties":
          const propertiesData = await FavoritesAPI.getProperties();
          setProperties(propertiesData.favorites || []);
          break;
        case "agents":
          const agentsData = await FavoritesAPI.getAgents();
          setAgents(agentsData.favorites || []);
          break;
        case "builders":
          const buildersData = await FavoritesAPI.getBuilders();
          
          if (buildersData.favorites && buildersData.favorites.length > 0) {
            toast.info(`Loading details for ${buildersData.favorites.length} builders...`);
            
            // Fetch detailed information for each builder
            const builderDetailsPromises = buildersData.favorites.map(async (builder: any) => {
              try {
                const response = await fetch(`/api/builders/${builder._id}`);
                if (response.ok) {
                  const data = await response.json();
                  return data.builder;
                }
                console.warn(`Could not fetch details for builder ${builder._id}, using basic data`);
                return builder; // Fall back to basic data if fetch fails
              } catch (error) {
                console.error(`Error fetching details for builder ${builder._id}:`, error);
                return builder; // Fall back to basic data if fetch fails
              }
            });
            
            const builderDetails = await Promise.all(builderDetailsPromises);
            const validBuilders = builderDetails.filter(builder => builder !== null && builder !== undefined);
            
            if (validBuilders.length < builderDetails.length) {
              toast.warning(`Some builder details could not be loaded completely.`);
            }
            
            setBuilders(validBuilders);
          } else {
            setBuilders([]);
          }
          break;
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites. Please try again later.");
      toast.error("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  },[activeTab]);

  useEffect(() => {
    fetchFavorites();
  }, [activeTab, fetchFavorites]);

  const removeFromFavorites = async (type: string, id: string) => {
    try {
      toast.info(`Removing ${type} from favorites...`);
      
      switch (type) {
        case "property":
          await FavoritesAPI.removeProperty(id);
          setProperties(properties.filter((p) => p._id !== id));
          toast.success(`Property removed from favorites`);
          break;
        case "agent":
          await FavoritesAPI.removeAgent(id);
          setAgents(agents.filter((a) => a._id !== id));
          toast.success(`Agent removed from favorites`);
          break;
        case "builder":
          await FavoritesAPI.removeBuilder(id);
          setBuilders(builders.filter((b) => b._id !== id));
          toast.success(`Builder removed from favorites`);
          break;
      }
    } catch (error) {
      console.error(`Error removing ${type} from favorites:`, error);
      setError(`Failed to remove ${type} from favorites. Please try again.`);
      toast.error(`Failed to remove ${type} from favorites. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-orange-500 mb-6"
        >
          My Favorites
        </motion.h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-gray-900 shadow-sm border border-gray-800 rounded-lg mr-2">
            <TabsTrigger
              value="properties"
              className={`flex items-center gap-2 py-2 rounded-lg transition-colors duration-300 ${
                activeTab === "properties" ? "bg-orange-500 text-white" : ""
              }`}
            >
              <HomeIcon size={16} />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                activeTab === "agents" ? "bg-orange-500 text-white" : ""
              }`}
            >
              <Users size={16} />
              <span>Agents</span>
            </TabsTrigger>
            <TabsTrigger
              value="builders"
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${
                activeTab === "builders" ? "bg-orange-500 text-white" : ""
              }`}
            >
              <Building size={16} />
              <span>Builders</span>
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="rounded-full h-12 w-12 border-b-2 border-orange-500"
              ></motion.div>
            </div>
          ) : error ? (
            <div className="bg-red-700 border border-red-600 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          ) : (
            <>
              <TabsContent value="properties">
                {properties.length === 0 ? (
                  <EmptyState type="properties" />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {properties.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onRemove={() =>
                          removeFromFavorites("property", property._id)
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="agents">
                {agents.length === 0 ? (
                  <EmptyState type="agents" />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {agents.map((agent) => (
                      <AgentCard
                        key={agent._id}
                        agent={agent}
                        onRemove={() => removeFromFavorites("agent", agent._id)}
                      />
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="builders">
                {builders.length === 0 ? (
                  <EmptyState type="builders" />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {builders.map((builder) => (
                      <BuilderCard
                        key={builder._id}
                        builder={builder}
                        onRemove={() =>
                          removeFromFavorites("builder", builder._id)
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

function EmptyState({ type }: { type: string }) {
  const messages = {
    properties: {
      title: "No favorite properties yet",
      description: "Start exploring properties and save your favorites here.",
      action: "Browse Properties",
      link: "/properties",
      icon: <HomeIcon className="w-16 h-16 text-gray-500" />,
    },
    agents: {
      title: "No favorite agents yet",
      description:
        "Discover real estate agents and add them to your favorites.",
      action: "Find Agents",
      link: "/agents",
      icon: <Users className="w-16 h-16 text-gray-500" />,
    },
    builders: {
      title: "No favorite builders yet",
      description: "Explore builders and add them to your favorites.",
      action: "Explore Builders",
      link: "/builders",
      icon: <Building className="w-16 h-16 text-gray-500" />,
    },
  };

  const { title, description, action, link, icon } =
    messages[type as keyof typeof messages];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 bg-gray-900 border border-gray-700 rounded-lg shadow-sm"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-orange-500 mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 text-center max-w-md">{description}</p>
      <Link href={link}>
        <Button className="bg-orange-600">{action}</Button>
      </Link>
    </motion.div>
  );
}

function PropertyCard({
  property,
  onRemove,
}: {
  property: Property;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gray-900 border border-gray-700 text-white">
        <div className="relative h-48 w-full">
          <Image
            src={property.images?.[0] || "/images/property-placeholder.jpg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1 text-orange-500">
            {property.title}
          </CardTitle>
          <CardDescription className="flex items-center text-gray-400">
            <MapPin size={14} className="mr-1" />
            {property.address.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-orange-500">
            ₹{property.price?.toLocaleString()}
          </p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Area</p>
              <p className="font-medium text-gray-300">
                {property.area} sq.ft.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium text-gray-300">
                {property.propertyType}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/search/${property._id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function AgentCard({
  agent,
  onRemove,
}: {
  agent: Agent;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border border-gray-700 text-white">
        <div className="relative">
          <div className="h-48 bg-gray-700 flex items-center justify-center">
            {agent.image ? (
              <Image
                src={agent.image}
                alt={agent.name}
                width={150}
                height={150}
                className="rounded-full object-cover h-28 w-28"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-gray-600 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-300" />
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-orange-500">{agent.name}</CardTitle>
          <CardDescription className="text-gray-400">
            {agent.agentInfo.agency || "Independent Agent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            {agent.agentInfo.experience} years experience
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-300">
              {agent.agentInfo.properties || 0}
            </span>{" "}
            properties sold
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href={`/agents/${agent._id}`}>
            <Button variant="outline">View Profile</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function BuilderCard({
  builder,
  onRemove,
}: {
  builder: Builder;
  onRemove: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border border-gray-700 text-white overflow-hidden hover:border-orange-500 transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-900">
          <Image
            src={imageError ? "/images/builder-placeholder.jpg" : (builder.logo || "/images/builder-placeholder.jpg")}
            alt={builder.title}
            fill
            className="object-contain p-4"
            onError={() => setImageError(true)}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="text-center text-orange-500">
            {builder.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-gray-300">
            {builder.description || builder.about || "Premier building developer and constructor"}
          </CardDescription>
          <CardDescription className="text-center text-gray-400">
            {builder.established ? `Est. ${builder.established}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center flex-grow">
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= builder.rating ? "currentColor" : "none"}
                  stroke={star <= builder.rating ? "none" : "currentColor"}
                  className={`w-4 h-4 ${
                    star <= builder.rating ? "text-orange-500" : "text-gray-500"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-orange-500">{builder.rating ? builder.rating.toFixed(1) : "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-900 p-2 rounded">
              <p className="text-xs text-gray-400">Projects</p>
              <p className="font-semibold">{builder.projects || 0}</p>
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <p className="text-xs text-gray-400">Completed</p>
              <p className="font-semibold">{builder.completed || 0}</p>
            </div>
          </div>
          <div className="bg-gray-900 p-2 rounded mb-3">
            <p className="text-xs text-gray-400">Specialization</p>
            <p className="text-sm truncate">{builder.specialization || "Real Estate"}</p>
          </div>
          <p className="text-xs text-gray-400">
            {builder.headquarters ? `HQ: ${builder.headquarters}` : ""}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center mt-auto">
          <Link href={`/builders/${builder._id}`}>
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// function LocalityCard({ locality, onRemove }: { locality: Locality; onRemove: () => void }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card className="bg-gray-800 border border-gray-700 text-white">
//         <div className="relative h-48 w-full">
//           <Image
//             src={locality.image || "/images/locality-placeholder.jpg"}
//             alt={locality.name}
//             fill
//             className="object-cover"
//           />
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <h3 className="text-white text-2xl font-bold">{locality.name}</h3>
//           </div>
//           <Button
//             variant="destructive"
//             size="icon"
//             className="absolute top-2 right-2 z-10"
//             onClick={onRemove}
//           >
//             <Trash2 size={16} />
//           </Button>
//         </div>
//         <CardContent className="pt-4">
//           <div className="flex items-start gap-2">
//             <MapPin size={18} className="text-gray-500 mt-0.5" />
//             <p className="text-gray-400">
//               {locality.city}{locality.state ? `, ${locality.state}` : ""}
//             </p>
//           </div>
//           {locality.description && (
//             <p className="mt-3 text-gray-500 line-clamp-2">{locality.description}</p>
//           )}
//         </CardContent>
//         <CardFooter>
//           <Link href={`/properties?locality=${encodeURIComponent(locality.name)}`} className="w-full">
//             <Button variant="outline" className="w-full">
//               Browse Properties
//             </Button>
//           </Link>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }
