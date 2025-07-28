"use client";

import React, { useState, useEffect } from 'react';
import { Building, FileText, Mail, Plus, Home, User, CheckCircle, Inbox, Edit, Users, Calendar, CreditCard, Bell, Settings, Download, Trash2, Edit2, FileDown, AlertTriangle, TrendingUp, DollarSign, Clock, MapPin, Eye, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';
import { useAuth } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const leaseProgress = 0.6; // 60% complete

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [landlordName, setLandlordName] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalProperties: 6,
    monthlyIncome: 120000,
    activeTenants: 12,
    upcomingRentDue: 3,
    leaseProgress: 60,
    recentActivity: [
      { type: 'payment', message: 'Rent received from Urban Loft', time: '2 hours ago', amount: '₹18,000' },
      { type: 'inquiry', message: 'New inquiry for Family Home', time: '4 hours ago' },
      { type: 'maintenance', message: 'Maintenance request resolved', time: '1 day ago' },
      { type: 'tenant', message: 'New tenant moved in', time: '2 days ago' }
    ]
  });
  useEffect(() => {
    if (user) {
      const firstName = user.name ? user.name.split(' ')[0] : 'User';
      setLandlordName(firstName);
    }
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'inquiry': return <Mail className="w-4 h-4 text-blue-400" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-orange-400" />;
      case 'tenant': return <User className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <div className="container mx-auto py-10 mt-8 relative z-10">
        {/* Welcome Header */}
        <motion.section className="mb-8" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl shadow-xl" whileHover={{ scale: 1.03, rotate: 1 }}>
              <motion.div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl font-bold text-transparent bg-clip-text" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                {landlordName ? landlordName[0] : 'U'}
              </motion.div>
              <div>
                <div className="text-4xl font-bold text-gray-300 font-sans">Welcome back, <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">{landlordName || 'User'}</span></div>
                <div className="text-sm text-gray-400 mt-1">Here's your property overview</div>
              </div>
            </motion.div>
            {/* Quick Actions */}
            <div className="flex gap-3">
              <Link href="/microestate/landlord/properties/add">
                <motion.div whileHover={{ scale: 1.08, boxShadow: '0 0 16px 4px #ff6a00' }} className="relative group">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300">
                    <motion.span initial={{ scale: 1 }} whileHover={{ scale: 1.2, rotate: 10 }} className="inline-block">
                      <Plus className="w-4 h-4 mr-2" />
                    </motion.span>
                  </Button>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">Add a new property</span>
                </motion.div>
              </Link>
              <Button variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105">
                <BarChart3 className="w-4 h-4 mr-2 text-orange-500" />
                View Reports
              </Button>
            </div>
          </div>
        </motion.section>
        {/* Key Metrics Cards */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Building className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.totalProperties,
              label: 'Total Properties',
              sub: '+2 this month',
              subColor: 'text-green-400',
              trendIcon: <TrendingUp className="w-5 h-5 text-green-400" />,
            },
            {
              icon: <DollarSign className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.monthlyIncome,
              label: 'Monthly Income',
              sub: '+12% from last month',
              subColor: 'text-green-400',
              trendIcon: <TrendingUp className="w-5 h-5 text-green-400" />,
              prefix: '₹',
            },
            {
              icon: <Users className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.activeTenants,
              label: 'Active Tenants',
              sub: 'All payments on time',
              subColor: 'text-green-400',
              trendIcon: <CheckCircle className="w-5 h-5 text-green-400" />,
            },
            {
              icon: <Calendar className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />,
              stat: dashboardData.upcomingRentDue,
              label: 'Upcoming Rent Due',
              sub: 'Due in 5 days',
              subColor: 'text-yellow-400',
              trendIcon: <Clock className="w-5 h-5 text-yellow-400" />,
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              className="bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 h-full flex flex-col justify-between cursor-pointer group"
              style={{ perspective: 1000 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring' }}
              whileHover={{ scale: 1.04, rotateX: 8, translateZ: 40 }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div whileHover={{ rotate: 10 }} className="transition-transform duration-300">
                  {card.icon}
                </motion.div>
                {card.trendIcon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {card.prefix || ''}
                <CountUp end={card.stat} duration={1.2} separator="," />
              </div>
              <div className="text-sm text-gray-400 font-semibold">{card.label}</div>
              <div className={`text-xs mt-2 ${card.subColor}`}>{card.sub}</div>
            </motion.div>
          ))}
        </section>
        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Properties Overview */}
          <div className="lg:col-span-2 bg-glass border border-transparent border-gradient-to-r from-orange-500 to-red-500 shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                Recent Properties
              </h2>
              <Link href="/microestate/landlord/properties">
                <Button variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white text-sm">
                  View All
                </Button>
              </Link>
            </div>
            {/* Property overview cards section (replace the property cards with the correct structure) */}
            <div className="space-y-4">
              <div className="dashboard-gradient-card">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Urban Loft</div>
                      <div className="text-sm text-gray-400">₹18,000/month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Occupied</span>
                    <Button size="sm" variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white">
                      <Eye className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="dashboard-gradient-card">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Family Home</div>
                      <div className="text-sm text-gray-400">₹35,000/month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Vacant</span>
                    <Button size="sm" variant="outline" className="border-transparent border-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 hover:bg-red-500 hover:text-white">
                      <Eye className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="bg-glass border border-transparent border-gradient-to-r from-orange-500 to-red-500 shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="dashboard-gradient-card">
                  <div className="flex items-start gap-3 p-3 bg-[#1a1a1f] rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="text-sm text-white">{activity.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                      {activity.amount && (
                        <div className="text-xs text-green-400 mt-1">{activity.amount}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Lease Progress Section */}
        <section className="mt-8 bg-glass border border-transparent border-gradient-to-r from-orange-500 to-red-500 shadow-xl rounded-2xl p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
            Lease Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{dashboardData.leaseProgress}%</div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2 text-sm text-gray-400">
                <span>Current Period</span>
                <span>Ends in 5 months</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-600 h-3 rounded-full transition-all duration-700" 
                  style={{ width: `${dashboardData.leaseProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">₹18,000</div>
              <div className="text-sm text-gray-400">Monthly Rent</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 