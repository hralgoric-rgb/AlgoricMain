"use client";

import React, { useState, useEffect } from 'react';
import { Building, ArrowLeft, Edit, Trash2, MapPin, DollarSign, Users, Calendar, FileText, CreditCard, Eye, Download, Plus, User, Phone, Mail, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../../_components/Background';
import ProtectedRoute from '../../../../_components/ProtectedRoute';
import { useParams } from 'next/navigation';

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id;
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState({
    id: propertyId,
    name: 'Urban Loft',
    address: '123 Main Street, Delhi',
    rent: 18000,
    deposit: 36000,
    status: 'occupied',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    furnished: true,
    images: ['/images/property1.jpg', '/images/property2.jpg'],
    documents: [
      { name: 'Rental Agreement.pdf', type: 'agreement', date: '2024-01-01' },
      { name: 'Property Tax Receipt.pdf', type: 'tax', date: '2024-01-15' },
      { name: 'Maintenance Records.pdf', type: 'maintenance', date: '2024-01-20' }
    ],
    tenants: [
      {
        id: 1,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 98765 43210',
        leaseStart: '2024-01-01',
        leaseEnd: '2024-12-31',
        rentPaid: true,
        lastPayment: '2025-01-01',
        nextPayment: '2025-02-01'
      }
    ],
    payments: [
      {
        id: 1,
        tenant: 'Priya Sharma',
        amount: 18000,
        date: '2025-01-01',
        status: 'paid',
        method: 'UPI'
      },
      {
        id: 2,
        tenant: 'Priya Sharma',
        amount: 18000,
        date: '2024-12-01',
        status: 'paid',
        method: 'Bank Transfer'
      }
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'payments', label: 'Payment Logs', icon: CreditCard }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Occupied</span>;
      case 'vacant':
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Vacant</span>;
      case 'maintenance':
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">Maintenance</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Pending</span>;
      case 'overdue':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">Overdue</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Property Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Property Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bedrooms:</span>
                    <span className="text-white">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bathrooms:</span>
                    <span className="text-white">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Area:</span>
                    <span className="text-white">{property.area} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Furnished:</span>
                    <span className="text-white">{property.furnished ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">₹{property.rent.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Monthly Rent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">₹{property.deposit.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Security Deposit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{property.tenants.length}</div>
                  <div className="text-sm text-gray-400">Active Tenants</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Property Documents</h3>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.documents.map((doc, index) => (
                <div key={index} className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-8 h-8 text-orange-400" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-white font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-400 capitalize">{doc.type}</div>
                    <div className="text-xs text-gray-500">{doc.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tenants':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Property Tenants</h3>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </div>

            <div className="space-y-4">
              {property.tenants.map((tenant) => (
                <div key={tenant.id} className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{tenant.name}</div>
                        <div className="text-sm text-gray-400">{tenant.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tenant.rentPaid ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Phone</div>
                      <div className="text-white">{tenant.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Lease Period</div>
                      <div className="text-white">{tenant.leaseStart} - {tenant.leaseEnd}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Last Payment</div>
                      <div className="text-white">{tenant.lastPayment}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Next Payment</div>
                      <div className="text-white">{tenant.nextPayment}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Payment History</h3>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-4 py-2 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2f]">
                    <th className="text-left p-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left p-4 text-gray-400 font-semibold">Tenant</th>
                    <th className="text-left p-4 text-gray-400 font-semibold">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-semibold">Method</th>
                    <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left p-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {property.payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[#2a2a2f] hover:bg-[#0a0a0f] transition-colors">
                      <td className="p-4 text-white">{payment.date}</td>
                      <td className="p-4 text-white">{payment.tenant}</td>
                      <td className="p-4 text-white">₹{payment.amount.toLocaleString()}</td>
                      <td className="p-4 text-white">{payment.method}</td>
                      <td className="p-4">
                        {getPaymentStatusBadge(payment.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <div className="container mx-auto py-10 mt-24 relative z-10">
          
          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/microestate/landlord/properties">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{property.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}</span>
                  </div>
                  {getStatusBadge(property.status)}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </Button>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-2">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1f]'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Tab Content */}
          <section className="animate-fadeIn">
            {renderTabContent()}
          </section>

        </div>
      </div>
    </ProtectedRoute>
  );
} 