"use client";

import React, { useState, useEffect } from 'react';
import { Building, FileText, Mail, Plus, Home, User, CheckCircle, Inbox, Edit, Users, Calendar, CreditCard, Bell, Settings, Download, Trash2, Edit2, FileDown, AlertTriangle, TrendingUp, DollarSign, Clock, MapPin, Eye, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';
import ProtectedRoute from '../../_components/ProtectedRoute';
import { useAuth } from '../../Context/AuthProvider';

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
    <ProtectedRoute allowedRoles={['landlord']}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <div className="container mx-auto py-10 mt-24 relative z-10">
          
          {/* Welcome Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 bg-glass border border-orange-500/30 p-6 rounded-2xl shadow-xl">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold text-white border-4 border-orange-400 shadow">
                  {landlordName ? landlordName[0] : 'U'}
                </div>
                <div>
                  <div className="text-2xl text-gray-300 font-semibold">Welcome back, <span className="text-orange-400 font-bold">{landlordName || 'User'}</span></div>
                  <div className="text-sm text-gray-400 mt-1">Here's your property overview</div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </div>
          </section>

          {/* Key Metrics Cards */}
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Building className="w-8 h-8 text-orange-500" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardData.totalProperties}</div>
              <div className="text-sm text-gray-400 font-semibold">Total Properties</div>
              <div className="text-xs text-green-400 mt-2">+2 this month</div>
            </div>

            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-orange-500" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">₹{dashboardData.monthlyIncome.toLocaleString()}</div>
              <div className="text-sm text-gray-400 font-semibold">Monthly Income</div>
              <div className="text-xs text-green-400 mt-2">+12% from last month</div>
            </div>

            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-orange-500" />
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardData.activeTenants}</div>
              <div className="text-sm text-gray-400 font-semibold">Active Tenants</div>
              <div className="text-xs text-green-400 mt-2">All payments on time</div>
            </div>

            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-orange-500" />
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{dashboardData.upcomingRentDue}</div>
              <div className="text-sm text-gray-400 font-semibold">Upcoming Rent Due</div>
              <div className="text-xs text-yellow-400 mt-2">Due in 5 days</div>
            </div>
          </section>

          {/* Main Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            
            {/* Properties Overview */}
            <div className="lg:col-span-2 bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-orange-500" />
                  Recent Properties
                </h2>
                <Link href="/microestate/landlord/properties">
                  <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl border border-[#2a2a2f]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Urban Loft</div>
                      <div className="text-sm text-gray-400">₹18,000/month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Occupied</span>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl border border-[#2a2a2f]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Family Home</div>
                      <div className="text-sm text-gray-400">₹35,000/month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Vacant</span>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-[#1a1a1f] rounded-lg border border-[#2a2a2f]">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="text-sm text-white">{activity.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                      {activity.amount && (
                        <div className="text-xs text-green-400 mt-1">{activity.amount}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Lease Progress Section */}
          <section className="mt-8 bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
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
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-700" 
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
    </ProtectedRoute>
  );
} 