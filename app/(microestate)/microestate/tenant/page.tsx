"use client";

import React, { useState } from 'react';
import { Building, FileText, Mail, Plus, Home, User, CheckCircle, Inbox, Edit, Users, Calendar, CreditCard, Bell, Settings, Download, Sun, Moon, MessageCircle, Search, Receipt, AlertTriangle, FileDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';

const tenantName = 'Priya Sharma';
const leaseProgress = 0.6; // 60% complete

export default function TenantDashboard() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      {/* Profile Header */}
      <div className="container mx-auto py-10 mt-24 relative z-10">
        <section className="mb-10 flex flex-col md:flex-row items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-4 bg-glass border border-orange-500/30 p-6 rounded-2xl shadow-xl w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold text-white border-4 border-orange-400 shadow">
              {tenantName[0]}
          </div>
          <div>
              <div className="text-lg text-gray-300 font-semibold">Welcome back, <span className="text-orange-400 font-bold">{tenantName}</span></div>
              <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <Home className="w-4 h-4 text-orange-400" /> Urban Loft
                <CreditCard className="w-4 h-4 text-orange-400 ml-4" /> ₹18,000/mo
          </div>
            </div>
          </div>
          {/* Lease Progress Bar */}
          <div className="flex-1 flex flex-col items-center md:items-end w-full">
            <div className="w-full max-w-xs">
              <div className="flex justify-between mb-1 text-xs text-gray-400">
                <span>Lease Progress</span>
                <span>Ends in 5 months</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-700" style={{ width: `${leaseProgress * 100}%` }}></div>
              </div>
              <div className="text-xs text-gray-400">{Math.round(leaseProgress * 100)}% complete</div>
            </div>
          </div>
        </section>

        {/* Dashboard Overview */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 flex flex-col items-center">
            <Home className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">Urban Loft</div>
            <div className="text-sm text-gray-400 font-semibold">Current Property</div>
          </div>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 flex flex-col items-center">
            <Calendar className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">01/01/2024 - 31/12/2024</div>
            <div className="text-sm text-gray-400 font-semibold">Lease Duration</div>
          </div>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 flex flex-col items-center">
            <CreditCard className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">₹18,000</div>
            <div className="text-sm text-gray-400 font-semibold">Upcoming Rent Due</div>
                  </div>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 flex flex-col items-center">
            <AlertTriangle className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">No Issues</div>
            <div className="text-sm text-gray-400 font-semibold">Support Status</div>
                  </div>
        </section>

        {/* Browse Properties */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Search className="w-6 h-6 text-orange-500" /> Browse Properties</h2>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 mb-6">
            <form className="flex flex-col md:flex-row gap-4 mb-4">
              <input className="flex-1 p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Search location, property type..." />
              <select className="p-2 rounded bg-gray-800 text-white border border-orange-500/20">
                <option>All</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
              </select>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-all"><Search className="w-4 h-4" /> Filter</Button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#101014] border border-orange-500/30 rounded-xl p-4 flex flex-col items-center">
                <div className="w-full h-32 bg-gray-700 rounded-lg mb-2"></div>
                <div className="text-white font-semibold mb-1">Family Home</div>
                <div className="text-orange-400 font-bold mb-1">₹35,000/mo</div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all">View Details <ArrowRight className="w-4 h-4" /></Button>
                  </div>
              <div className="bg-[#101014] border border-orange-500/30 rounded-xl p-4 flex flex-col items-center">
                <div className="w-full h-32 bg-gray-700 rounded-lg mb-2"></div>
                <div className="text-white font-semibold mb-1">Luxury Penthouse</div>
                <div className="text-orange-400 font-bold mb-1">₹95,000/mo</div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all">View Details <ArrowRight className="w-4 h-4" /></Button>
                  </div>
              <div className="bg-[#101014] border border-orange-500/30 rounded-xl p-4 flex flex-col items-center">
                <div className="w-full h-32 bg-gray-700 rounded-lg mb-2"></div>
                <div className="text-white font-semibold mb-1">Urban Loft</div>
                <div className="text-orange-400 font-bold mb-1">₹18,000/mo</div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all">View Details <ArrowRight className="w-4 h-4" /></Button>
                </div>
            </div>
          </div>
        </section>

        {/* Lease & Documents */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><FileDown className="w-6 h-6 text-orange-500" /> Lease & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> Lease Agreement</h3>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mb-2 flex items-center gap-2 hover:scale-105 transition-all"><Download className="w-4 h-4" /> Download PDF</Button>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mb-2 flex items-center gap-2 hover:scale-105 transition-all">Request Extension</Button>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-all">Request Termination</Button>
            </div>
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Receipt className="w-5 h-5 text-orange-500" /> Rent Receipts</h3>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mb-2 flex items-center gap-2 hover:scale-105 transition-all"><Receipt className="w-4 h-4" /> Generate Receipt</Button>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-all">View Payment History</Button>
              </div>
          </div>
        </section>

        {/* Rent Payment */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><CreditCard className="w-6 h-6 text-orange-500" /> Rent Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-500" /> Pay Rent Online</h3>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mb-2 flex items-center gap-2 hover:scale-105 transition-all">Pay with Razorpay</Button>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg flex items-center gap-2 hover:scale-105 transition-all">Pay with UPI</Button>
          </div>
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> Payment History</h3>
              <table className="w-full text-left text-gray-300 mb-4">
              <thead>
                  <tr className="border-b border-orange-500/10">
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
              </thead>
              <tbody>
                  <tr className="border-b border-orange-500/10">
                    <td>01/07/2025</td>
                    <td>₹18,000</td>
                    <td><span className="text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span></td>
                  </tr>
                  <tr>
                    <td>01/06/2025</td>
                    <td>₹18,000</td>
                    <td><span className="text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span></td>
                  </tr>
              </tbody>
            </table>
            </div>
          </div>
        </section>

        {/* Maintenance Requests */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Inbox className="w-6 h-6 text-orange-500" /> Maintenance Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> Submit New Request</h3>
              <form className="space-y-3">
                <select className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20">
                  <option>Urban Loft</option>
                  <option>Family Home</option>
                </select>
                <select className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20">
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>General Maintenance</option>
                </select>
                <textarea className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Describe the issue..." />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" type="file" />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Plus className="w-4 h-4" /> Submit Request</Button>
              </form>
            </div>
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Inbox className="w-5 h-5 text-orange-500" /> Track Requests</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center"><span>Leaky faucet</span><span className="text-yellow-400 font-semibold">Pending</span></li>
                <li className="flex justify-between items-center"><span>Broken AC</span><span className="text-green-400 font-semibold">Resolved</span></li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-4 flex items-center gap-2 hover:scale-105 transition-all"><MessageCircle className="w-4 h-4" /> Message Landlord</Button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Bell className="w-6 h-6 text-orange-500" /> Notifications</h2>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-orange-500" /> Rent due on 1st of every month</li>
              <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> Lease expires on 31/12/2024</li>
              <li className="flex items-center gap-2"><Inbox className="w-4 h-4 text-orange-500" /> Maintenance request resolved</li>
            </ul>
          </div>
        </section>

        {/* Profile & Settings */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Settings className="w-6 h-6 text-orange-500" /> Profile & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Edit Profile (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> Edit Personal Info</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Full Name" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Email" />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Edit className="w-4 h-4" /> Save</Button>
              </form>
            </div>
            {/* Payment Preferences (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-500" /> Payment Preferences</h3>
              <form className="space-y-3">
                <select className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20">
                  <option>Razorpay</option>
                  <option>UPI</option>
                  <option>Credit/Debit Card</option>
                </select>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><CreditCard className="w-4 h-4" /> Save</Button>
              </form>
            </div>
            {/* Change Password (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Edit className="w-5 h-5 text-orange-500" /> Change Password</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Current Password" type="password" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="New Password" type="password" />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Edit className="w-4 h-4" /> Change Password</Button>
              </form>
            </div>
          </div>
        </section>

        {/* Bonus: Dark/Light Mode Toggle & Chat */}
        <section className="mb-10 flex flex-col md:flex-row gap-8 items-center animate-fadeIn">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg px-6 py-3 hover:scale-105 transition-all"><Sun className="w-5 h-5" /> Toggle Dark/Light Mode</Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg px-6 py-3 hover:scale-105 transition-all"><MessageCircle className="w-5 h-5" /> Chat with Support</Button>
        </section>
      </div>
    </div>
  );
} 