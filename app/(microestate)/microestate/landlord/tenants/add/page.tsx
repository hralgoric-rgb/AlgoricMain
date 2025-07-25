"use client";

import React, { useState } from 'react';
import { ArrowLeft, User, Home, Mail, Phone, Calendar, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../../_components/Background';

export default function AddTenantPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    leaseStart: '',
    leaseEnd: ''
  });
  const [errors, setErrors] = useState<any>({});
  const properties = [
    { id: 1, name: 'Urban Loft' },
    { id: 2, name: 'Family Home' }
  ];

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Valid phone required';
    if (!formData.propertyId) newErrors.propertyId = 'Select a property';
    if (!formData.leaseStart) newErrors.leaseStart = 'Lease start required';
    if (!formData.leaseEnd) newErrors.leaseEnd = 'Lease end required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // TODO: Submit new tenant data to API
      alert('Tenant added!');
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <div className="container mx-auto py-10 mt-24 relative z-10">
        {/* Header */}
        <section className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/microestate/landlord/tenants">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tenants
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Add New Tenant</h1>
              <p className="text-gray-400">Assign a tenant to a property</p>
            </div>
          </div>
        </section>

        {/* Add Tenant Form */}
        <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tenant Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`w-full p-3 bg-[#1a1a1f] border ${errors.name ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                placeholder="Enter tenant name"
              />
              {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.email ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter email"
                />
                {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.phone ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <div className="text-red-400 text-xs mt-1">{errors.phone}</div>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Property *</label>
              <select
                value={formData.propertyId}
                onChange={e => handleInputChange('propertyId', e.target.value)}
                className={`w-full p-3 bg-[#1a1a1f] border ${errors.propertyId ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors`}
              >
                <option value="">Select property</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.propertyId && <div className="text-red-400 text-xs mt-1">{errors.propertyId}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lease Start *</label>
                <input
                  type="date"
                  value={formData.leaseStart}
                  onChange={e => handleInputChange('leaseStart', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.leaseStart ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.leaseStart && <div className="text-red-400 text-xs mt-1">{errors.leaseStart}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lease End *</label>
                <input
                  type="date"
                  value={formData.leaseEnd}
                  onChange={e => handleInputChange('leaseEnd', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.leaseEnd ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                />
                {errors.leaseEnd && <div className="text-red-400 text-xs mt-1">{errors.leaseEnd}</div>}
              </div>
            </div>

            <div className="flex items-center justify-end mt-8 pt-6 border-t border-[#2a2a2f]">
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
} 