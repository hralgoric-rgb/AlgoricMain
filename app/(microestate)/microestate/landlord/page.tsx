"use client";

import React, { useState } from 'react';
import { Building, FileText, Mail, Plus, Home, User, CheckCircle, Inbox, Edit, Users, Calendar, CreditCard, Bell, Settings, Download, Trash2, Edit2, FileDown, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';

// TODO: Protect this page for role === 'landlord' using useSession() or JWT check

const landlordName = 'Rajesh';
const leaseProgress = 0.6; // 60% complete
const stats = [
  {
    label: 'Total Properties',
    value: 6,
    icon: <Building className="w-7 h-7 text-orange-500" />,
    sub: 'You have 6 total listings',
  },
  {
    label: 'Available Now',
    value: 4,
    icon: <CheckCircle className="w-7 h-7 text-green-500" />,
    sub: '4 properties are available',
  },
  {
    label: 'Inquiries Pending',
    value: 2,
    icon: <Inbox className="w-7 h-7 text-blue-400" />,
    sub: '2 inquiries need response',
  },
  {
    label: 'Docs Uploaded',
    value: 9,
    icon: <FileText className="w-7 h-7 text-purple-400" />,
    sub: '9 documents uploaded',
  },
];
// Update recentProperties to include multiple images per property
const recentProperties = [
  { id: 1, title: 'Urban Loft', price: 18000, status: 'Available', date: '09 Jul 25', images: ['/images/property4.jpg', '/images/property1.jpg', '/images/property5.jpg'] },
  { id: 2, title: 'Family Home', price: 35000, status: 'Available', date: '08 Jul 25', images: ['/images/property5.jpg', '/images/property4.jpg', '/images/property1.jpg'] },
  { id: 3, title: 'Luxury Penthouse', price: 95000, status: 'Rented', date: '05 Jul 25', images: ['/images/property1.jpg', '/images/property5.jpg', '/images/property4.jpg'] },
];
const quickActions = [
  { label: 'Add New Property', icon: <Plus className="w-6 h-6" />, href: '#' },
  { label: 'View Inquiries', icon: <Mail className="w-6 h-6" />, href: '#' },
  { label: 'Manage Documents', icon: <FileText className="w-6 h-6" />, href: '#' },
  { label: 'Edit Profile', icon: <Edit className="w-6 h-6" />, href: '#' },
];
const recentInquiries = [
  { property: 'Lakeview Flat', tenant: 'Aman Gupta', message: 'Is this still...', date: '11 Jul 25' },
  { property: 'Garden Apt', tenant: 'Sia Mehta', message: 'Can I schedule...', date: '10 Jul 25' },
  { property: 'Urban Loft', tenant: 'Amit Kumar', message: 'Interested in...', date: '09 Jul 25' },
];

export default function LandlordDashboard() {
  // TODO: Add role-based protection here (e.g., useSession() or JWT check)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <div className="container mx-auto py-10 mt-24 relative z-10">
        {/* Profile Header */}
        <section className="mb-10 flex flex-col md:flex-row items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-4 bg-glass p-6 rounded-2xl shadow-xl w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold text-white border-4 border-orange-400 shadow">
              {landlordName[0]}
            </div>
              <div>
              <div className="text-lg text-gray-300 font-semibold">Welcome back, <span className="text-orange-400 font-bold">{landlordName}</span></div>
              <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-400" /> 6 Properties
                <CreditCard className="w-4 h-4 text-orange-400 ml-4" /> ₹1,20,000/mo
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
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
            <Building className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">6</div>
            <div className="text-sm text-gray-400 font-semibold">Total Properties</div>
          </div>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
            <Users className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-sm text-gray-400 font-semibold">Active Tenants</div>
          </div>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
            <CreditCard className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">₹1,20,000</div>
            <div className="text-sm text-gray-400 font-semibold">Monthly Income</div>
          </div>
          <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
            <Calendar className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-gray-400 font-semibold">Upcoming Rent Due</div>
          </div>
        </section>

        {/* Properties Management */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Home className="w-6 h-6 text-orange-500" /> Properties Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add New Property Form (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> List New Property</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Property Name" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Address" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Rent Amount (₹)" type="number" />
                <select className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20">
                  <option>Available</option>
                  <option>Occupied</option>
                </select>
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" type="file" multiple />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Plus className="w-4 h-4" /> Add Property</Button>
              </form>
            </div>
            {/* Properties Table (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> Existing Properties</h3>
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-orange-500/10">
                    <th>Name</th>
                    <th>Status</th>
                    <th>Rent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-orange-500/10">
                    <td>Urban Loft</td>
                    <td><span className="text-green-400 font-semibold">Occupied</span></td>
                    <td>₹18,000</td>
                    <td className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1 hover:scale-105 transition-all"><Edit2 className="w-4 h-4" /> Edit</Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1 hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /> Delete</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Family Home</td>
                    <td><span className="text-yellow-400 font-semibold">Vacant</span></td>
                    <td>₹35,000</td>
                    <td className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1 hover:scale-105 transition-all"><Edit2 className="w-4 h-4" /> Edit</Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1 hover:scale-105 transition-all"><Trash2 className="w-4 h-4" /> Delete</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tenants Management */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Users className="w-6 h-6 text-orange-500" /> Tenants Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tenants Table (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> Tenants per Property</h3>
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-orange-500/10">
                    <th>Name</th>
                    <th>Property</th>
                    <th>Lease</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-orange-500/10">
                    <td>Priya Sharma</td>
                    <td>Urban Loft</td>
                    <td>01/01/2024 - 31/12/2024</td>
                    <td className="flex gap-2"><Button size="sm" variant="outline" className="hover:scale-105 transition-all">Remove</Button></td>
                  </tr>
                  <tr>
                    <td>Rahul Verma</td>
                    <td>Family Home</td>
                    <td>01/03/2024 - 28/02/2025</td>
                    <td className="flex gap-2"><Button size="sm" variant="outline" className="hover:scale-105 transition-all">Remove</Button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Add/Assign Tenant Form (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> Add/Assign Tenant</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Tenant Name" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Property Name" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Lease Start Date" type="date" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Lease End Date" type="date" />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Plus className="w-4 h-4" /> Assign Tenant</Button>
              </form>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><CreditCard className="w-6 h-6 text-orange-500" /> Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment History Table (preview) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> Payment History</h3>
              <table className="w-full text-left text-gray-300 mb-4">
                <thead>
                  <tr className="border-b border-orange-500/10">
                    <th>Date</th>
                    <th>Tenant</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-orange-500/10">
                    <td>01/07/2025</td>
                    <td>Priya Sharma</td>
                    <td>₹18,000</td>
                    <td><span className="text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span></td>
                  </tr>
                  <tr>
                    <td>01/07/2025</td>
                    <td>Rahul Verma</td>
                    <td>₹35,000</td>
                    <td><span className="text-yellow-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Pending</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1 hover:scale-105 transition-all"><Download className="w-4 h-4" /> Export PDF</Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1 hover:scale-105 transition-all"><Download className="w-4 h-4" /> Export CSV</Button>
              </div>
            </div>
            {/* Pending/Completed Rents (preview) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-500" /> Pending/Completed Rents</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center"><span>Priya Sharma (Urban Loft)</span><span className="text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span></li>
                <li className="flex justify-between items-center"><span>Rahul Verma (Family Home)</span><span className="text-yellow-400 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Pending</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Requests & Notifications */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Bell className="w-6 h-6 text-orange-500" /> Requests & Notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tenant Requests Table (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Inbox className="w-5 h-5 text-orange-500" /> Tenant Requests</h3>
              <table className="w-full text-left text-gray-300">
              <thead>
                  <tr className="border-b border-orange-500/10">
                    <th>Request</th>
                    <th>Tenant</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  <tr className="border-b border-orange-500/10">
                    <td>Leaky faucet</td>
                    <td>Priya Sharma</td>
                    <td><span className="text-yellow-400 font-semibold">Pending</span></td>
                    <td className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:scale-105 transition-all">Approve</Button>
                      <Button size="sm" variant="destructive" className="hover:scale-105 transition-all">Deny</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Broken AC</td>
                    <td>Rahul Verma</td>
                    <td><span className="text-green-400 font-semibold">Resolved</span></td>
                    <td className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:scale-105 transition-all" disabled>Approve</Button>
                      <Button size="sm" variant="destructive" className="hover:scale-105 transition-all" disabled>Deny</Button>
                    </td>
                  </tr>
              </tbody>
            </table>
            </div>
            {/* Send Notification Form (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-orange-500" /> Send Notification</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Message" />
                <select className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20">
                  <option>All Tenants</option>
                  <option>Priya Sharma</option>
                  <option>Rahul Verma</option>
                </select>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Mail className="w-4 h-4" /> Send</Button>
              </form>
            </div>
          </div>
        </section>

        {/* Profile & Settings */}
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-4 flex items-center gap-2"><Settings className="w-6 h-6 text-orange-500" /> Profile & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Edit Profile (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> Edit Profile</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Full Name" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Email" />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><Edit className="w-4 h-4" /> Save</Button>
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
            {/* Bank/UPI Details (placeholder) */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-500" /> Bank/UPI Details</h3>
              <form className="space-y-3">
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="Bank Account Number" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="IFSC Code" />
                <input className="w-full p-2 rounded bg-gray-800 text-white border border-orange-500/20" placeholder="UPI ID (optional)" />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg mt-2 flex items-center gap-2 hover:scale-105 transition-all"><CreditCard className="w-4 h-4" /> Save</Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 