"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FaChartLine, 
  FaBuilding, 
  FaUsers, 
  FaShieldAlt, 
  FaRocket,
  FaArrowRight,
  FaPlay
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function EquityLandingPage() {
  const [stats, setStats] = useState({
    totalInvestment: 0,
    activeInvestors: 0,
    propertiesListed: 0,
    avgROI: 0
  });

  useEffect(() => {
    // Animate counters
    const targetStats = {
      totalInvestment: 50000000,
      activeInvestors: 2500,
      propertiesListed: 75,
      avgROI: 14.5
    };

    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        totalInvestment: Math.floor(targetStats.totalInvestment * progress),
        activeInvestors: Math.floor(targetStats.activeInvestors * progress),
        propertiesListed: Math.floor(targetStats.propertiesListed * progress),
        avgROI: Math.floor(targetStats.avgROI * progress * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const features = [
    {
      icon: <FaBuilding className="w-8 h-8" />,
      title: "Fractional Ownership",
      description: "Own shares in premium commercial properties starting from ₹1 Lakh"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "High ROI Potential",
      description: "Enjoy 12-18% annual returns with appreciation and rental income"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Professional Management",
      description: "Expert property management and tenant relations handled for you"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Transparent & Secure",
      description: "Complete transparency with regular updates and secure transactions"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Browse Properties",
      description: "Explore our curated selection of high-yield commercial properties"
    },
    {
      step: "02", 
      title: "Invest in Shares",
      description: "Choose your investment amount and purchase equity shares"
    },
    {
      step: "03",
      title: "Earn Returns",
      description: "Receive rental income and benefit from property appreciation"
    },
    {
      step: "04",
      title: "Trade or Exit",
      description: "Sell your shares anytime through our secondary marketplace"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                Equity Investment
              </span>
              <br />
              <span className="text-white">in Real Estate</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Start your real estate investment journey with fractional ownership. 
              Invest in premium commercial properties and earn steady returns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/equity/auth">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                  Start Investing
                  <FaArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/equity/properties">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300">
                  <FaPlay className="mr-2 w-5 h-5" />
                  View Properties
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {formatCurrency(stats.totalInvestment)}
                </div>
                <div className="text-gray-400">Total Investment</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stats.activeInvestors.toLocaleString()}+
                </div>
                <div className="text-gray-400">Active Investors</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stats.propertiesListed}+
                </div>
                <div className="text-gray-400">Properties Listed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stats.avgROI}%
                </div>
                <div className="text-gray-400">Average ROI</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Why Choose</span>{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                Equity Investment?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of real estate investment with our innovative platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500 transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="text-orange-500 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">How It</span>{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start your investment journey in just 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500 transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl font-bold text-orange-500 mb-4 opacity-20">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-500">
                    <FaArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Ready to</span>{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                Start Investing?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of investors who are already building wealth through real estate equity
            </p>
            <Link href="/equity/auth">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                <FaRocket className="mr-2 w-6 h-6" />
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
