"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Building2, TrendingUp, DollarSign, Users, Target, Zap, Calendar, Shield, Trophy, Star, ChevronRight, MapPin, Briefcase, Store, Warehouse, Server, UserPlus, Coffee, Play, CheckCircle, ArrowDown, Sparkles, Globe, BarChart3, PieChart, Brain, Lightbulb, Coins, Timer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EquityLandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const platformStats = [
    { value: "₹2.5B+", label: "Total Assets", icon: Building2 },
    { value: "15,000+", label: "Active Investors", icon: Users },
    { value: "8.9%", label: "Average Returns", icon: TrendingUp },
    { value: "150+", label: "Premium Properties", icon: Star }
  ];

  const features = [
    {
      icon: Coins,
      title: "Fractional Ownership",
      description: "Start investing with as little as ₹2,500 per share in premium commercial properties"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms analyze market trends and predict property performance"
    },
    {
      icon: Calendar,
      title: "Monthly Passive Income",
      description: "Receive rental income distributions based on your ownership percentage every month"
    },
    {
      icon: Shield,
      title: "Professional Management",
      description: "Expert property management ensures optimal performance and tenant satisfaction"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track your portfolio performance with detailed analytics and market insights"
    },
    {
      icon: Globe,
      title: "Diversified Portfolio",
      description: "Invest across office buildings, data centers, warehouses, and retail spaces"
    }
  ];

  const propertyTypes = [
    {
      icon: Briefcase,
      title: "Office Buildings",
      description: "Grade A office spaces with multinational tenants",
      yield: "7-9%",
      risk: "Medium",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Server,
      title: "Data Centers",
      description: "Tier-3 facilities with cloud service providers",
      yield: "10-12%",
      risk: "Low",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Warehouse,
      title: "Warehouses",
      description: "Strategic logistics hubs for e-commerce",
      yield: "8-11%",
      risk: "Medium",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Store,
      title: "Retail Spaces",
      description: "Shopping malls and retail complexes",
      yield: "6-8%",
      risk: "Low",
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software Engineer",
      image: "/testimonials/user1.jpg",
      quote: "I've been earning ₹25,000 monthly from my commercial property investments. The platform makes it so easy to track everything.",
      return: "+18.5%"
    },
    {
      name: "Priya Sharma",
      role: "Marketing Director",
      image: "/testimonials/user2.jpg",
      quote: "Started with just ₹50,000 and now my portfolio is worth ₹2.8 lakhs. The AI insights are incredibly accurate.",
      return: "+22.3%"
    },
    {
      name: "Amit Patel",
      role: "Business Owner",
      image: "/testimonials/user3.jpg",
      quote: "Diversified across 8 properties now. The passive income helps fund my children's education. Highly recommended!",
      return: "+15.7%"
    }
  ];

  const investmentSteps = [
    {
      step: "01",
      title: "Sign Up & Verify",
      description: "Create your account and complete KYC verification in minutes"
    },
    {
      step: "02",
      title: "Browse Properties",
      description: "Explore our curated selection of premium commercial properties"
    },
    {
      step: "03",
      title: "Invest & Own",
      description: "Purchase shares and become a fractional owner instantly"
    },
    {
      step: "04",
      title: "Earn Returns",
      description: "Receive monthly rental income and watch your investment grow"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-purple-500/20" />
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Floating Geometric Shapes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Invest in
              <motion.span 
                className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Commercial Real Estate
              </motion.span>
              Like Never Before
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Own fractional shares in premium office buildings, data centers, and warehouses. 
              Start with just ₹2,500 and earn passive income every month.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link href="/equity/property">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25">
                  Start Investing Now
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Platform Stats */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {platformStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-orange-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="w-8 h-8 text-orange-500 mb-3 mx-auto" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-orange-500"
            >
              <ArrowDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-orange-500">100Gaj Equity</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We democratize commercial real estate investing with cutting-edge technology and expert curation
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/5 to-red-500/5 transform skew-y-1" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Diversified <span className="text-orange-500">Property Portfolio</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Invest across different commercial property types to maximize returns and minimize risk
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {propertyTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300 group overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`bg-gradient-to-r ${type.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Expected Yield</div>
                      <div className="text-2xl font-bold text-white">{type.yield}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-3">{type.title}</h3>
                  <p className="text-gray-300 mb-4">{type.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-400">Risk Level:</div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        type.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                        type.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {type.risk}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Start Investing in <span className="text-orange-500">4 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From signup to earning passive income, we've made commercial real estate investing accessible to everyone
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {investmentSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  {index < investmentSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link href="/equity/property">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                Get Started Today
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Real Stories, <span className="text-orange-500">Real Returns</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of investors who are already earning passive income from commercial real estate
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </span>
              </div>
              
              <blockquote className="text-xl text-gray-300 mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-6">
                <div>
                  <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{testimonials[currentTestimonial].return}</div>
                  <div className="text-sm text-gray-400">Returns</div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-orange-500' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Build Your <span className="text-black">Wealth Portfolio</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join the future of commercial real estate investing. Start with just ₹2,500 and watch your money grow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/equity/property">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                  Start Investing Now
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/equity/dashboard">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
                  View Dashboard
                  <BarChart3 className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold mb-2">Demo Video</h3>
                <p className="text-gray-400">Video content would be embedded here</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
