"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";

import {
  Home,
  Upload,
  Clock,
  Users,
  CheckCircle,
  MapPin,
  PenTool,
  ArrowRight,
  Phone,
  Shield,
  DollarSign,
  Zap,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { toast } from "sonner";

import PropertyForm from "../components/ui/propertyform";
import { useRouter } from "next/navigation";
export default function SellProperty() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window === "undefined") return;
    const token = sessionStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleOpenForm = () => {
    if (!isAuthenticated) {
      // Redirect to login page with callback URL
      toast.message(
        "Please login to sell a property. Redirecting you to the Home Page!",
      );
      setTimeout(() => {
        router.push("/?modal=auth");
      }, 1000);
      return;
    }
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  interface PropertyData {
    title: string;
    description: string;
    price: number;
    location: string;
    [key: string]: any; // Add additional fields as needed
  }

  const handleFormSubmit = async (data: PropertyData) => {
    try {
      // Store the new property in sessionStorage
      const existingProperties = JSON.parse(
        sessionStorage.getItem("properties") || "[]",
      );
      const newProperty = {
        ...data,
        id: Date.now().toString(), // Generate a unique ID
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(
        "properties",
        JSON.stringify([...existingProperties, newProperty]),
      );

      toast.success("Property listed successfully!");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Failed to submit property. Please try again.");
    }
  };

  const stats = [
    {
      title: "Property Sold Every",
      value: "30",
      unit: "Minutes",
      color: "bg-gradient-to-r from-orange-500/20 to-orange-400/10",
      icon: <Clock className="w-8 h-8 text-orange-500" />,
    },
    {
      title: "Active Buyers",
      value: "10K+",
      unit: "Daily",
      color: "bg-gradient-to-r from-white/10 to-white/5",
      icon: <Users className="w-8 h-8 text-white" />,
    },
  ];

  const steps = [
    {
      title: "Create Your Profile",
      description:
        "Sign up and complete your profile with your contact information",
      icon: <PenTool className="w-6 h-6" />,
      image: "/images/step1.png",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "List Your Property",
      description:
        "Add property details, photos, amenities, and set your price",
      icon: <Home className="w-6 h-6" />,
      image: "/images/step2.png",
      color: "from-white to-gray-200",
    },
    {
      title: "Get Verified",
      description:
        "Our team reviews and verifies your listing for quality assurance",
      icon: <CheckCircle className="w-6 h-6" />,
      image: "/images/step3.png",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Connect with Buyers",
      description:
        "Receive inquiries and connect directly with interested buyers",
      icon: <Phone className="w-6 h-6" />,
      image: "/images/step4.png",
      color: "from-white to-gray-200",
    },
  ];

  const benefits = [
    {
      title: "Zero Commission",
      description: "No hidden fees or commissions on your property sale",
      icon: <DollarSign className="w-10 h-10 text-orange-500" />,
    },
    {
      title: "Verified Buyers",
      description: "Connect with serious, verified buyers only",
      icon: <Shield className="w-10 h-10 text-white" />,
    },
    {
      title: "Expert Support",
      description: "Get assistance from our real estate experts anytime",
      icon: <Phone className="w-10 h-10 text-orange-500" />,
    },
  ];

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Add the Toaster component for showing notifications */}

      {/* Show the property form when isFormOpen is true */}
      {isFormOpen && (
        <PropertyForm onClose={handleFormClose} onSubmit={handleFormSubmit} />
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFA500"
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-white mb-6">
              Post Property for <span className="text-white">FREE</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              List your property and reach thousands of verified buyers and
              tenants. No hidden charges, no complications.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`${stat.color} rounded-2xl p-6 backdrop-blur-sm border border-white/10`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 mb-2">{stat.title}</p>
                    <h3 className="text-5xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-orange-500">{stat.unit}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why Choose <span className="text-orange-500">100Gaj</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            We make selling or renting properties easier than ever before with
            our powerful platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/5 h-full shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center mb-6 border border-orange-500/30">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section - Enhanced */}
      <section className="py-24 px-4 relative overflow-hidden bg-black">
        <div className="absolute right-0 top-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How it <span className="text-orange-500">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow these simple steps to list your property and start
              connecting with potential buyers
            </p>
          </div>

          <div className="relative">
            {/* Horizontal connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-white hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  {/* Step number with pulsing effect */}
                  <div className="relative mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-xl border-4 border-black`}
                    >
                      <span className="text-2xl font-bold text-black">
                        {index + 1}
                      </span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center border-2 border-orange-500">
                      {step.icon}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center h-full border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{step.description}</p>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                      >
                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Success Stories</h2>
              <p className="text-gray-400 mt-2">
                Properties recently sold on our platform
              </p>
            </div>
            <Button className="bg-white text-black hover:bg-gray-200">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-white/10">
                  <div className="h-48 bg-gray-800 relative">
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      SOLD
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                      ₹{(Math.random() * 100 + 50).toFixed(2)}L
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-500 transition-colors">
                      {
                        ["Luxury Apartment", "Modern Villa", "Spacious House"][
                          item - 1
                        ]
                      }{" "}
                      in {["Mumbai", "Delhi", "Bangalore"][item - 1]}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {["Bandra West", "South Delhi", "Koramangala"][item - 1]}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-400">
                        <Home className="w-4 h-4 mr-1" />
                        {item + 1} BHK
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Zap className="w-4 h-4 mr-1" />
                        Sold in {item * 5 + 10} days
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to List Your Property?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of successful property sellers on 100Gaj. Start
              your journey today!
            </p>
            <Button
              onClick={handleOpenForm}
              className="bg-white text-orange-500 hover:bg-white/90 px-8 py-6 text-lg"
            >
              List Your Property Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Sticky Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <Button
            onClick={handleOpenForm}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Post Now!
          </Button>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
