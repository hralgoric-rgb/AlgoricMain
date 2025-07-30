"use client";

import React, { useState } from 'react';
import { ArrowLeft, User, Home, Mail, Phone, Calendar, Save, DollarSign, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../../_components/Background';

export default function AddTenantPage() {
  const [formData, setFormData] = useState({
    tenantEmail: '',
    tenantFirstName: '',
    tenantLastName: '',
    tenantPhone: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    rentDueDate: '1',
    terms: ''
  });
  const [errors, setErrors] = useState<any>({});
  const properties = [
    { id: 1, name: 'Urban Loft' },
    { id: 2, name: 'Family Home' }
  ];

  const validate = () => {
    const newErrors: any = {};
    if (!formData.tenantFirstName) newErrors.tenantFirstName = 'First name is required';
    if (!formData.tenantLastName) newErrors.tenantLastName = 'Last name is required';
    if (!formData.tenantEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.tenantEmail)) newErrors.tenantEmail = 'Valid email required';
    if (!formData.tenantPhone || !/^\+?\d{10,15}$/.test(formData.tenantPhone)) newErrors.tenantPhone = 'Valid phone required';
    if (!formData.startDate) newErrors.startDate = 'Start date required';
    if (!formData.endDate) newErrors.endDate = 'End date required';
    if (!formData.monthlyRent || parseFloat(formData.monthlyRent) <= 0) newErrors.monthlyRent = 'Valid monthly rent required';
    if (!formData.securityDeposit || parseFloat(formData.securityDeposit) <= 0) newErrors.securityDeposit = 'Valid security deposit required';
    if (!formData.rentDueDate || parseInt(formData.rentDueDate) < 1 || parseInt(formData.rentDueDate) > 31) newErrors.rentDueDate = 'Valid rent due date required (1-31)';
    if (!formData.terms) newErrors.terms = 'Terms and conditions required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        // TODO: Submit new tenant data to API
        const response =  await axios.post("/api/")
        console.log('Submitting tenant data:', formData);
        alert('Tenant added successfully!');
      } catch (error) {
        console.error('Error adding tenant:', error);
        alert('Error adding tenant. Please try again.');
      }
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
              <p className="text-gray-400">Assign a tenant to a property with lease details</p>
            </div>
          </div>
        </section>

        {/* Add Tenant Form */}
        <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Personal Information */}
            <div className="border-b border-[#2a2a2f] pb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Tenant Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.tenantFirstName}
                    onChange={e => handleInputChange('tenantFirstName', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantFirstName ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="Enter first name"
                  />
                  {errors.tenantFirstName && <div className="text-red-400 text-xs mt-1">{errors.tenantFirstName}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.tenantLastName}
                    onChange={e => handleInputChange('tenantLastName', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantLastName ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="Enter last name"
                  />
                  {errors.tenantLastName && <div className="text-red-400 text-xs mt-1">{errors.tenantLastName}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.tenantEmail}
                    onChange={e => handleInputChange('tenantEmail', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantEmail ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="Enter email address"
                  />
                  {errors.tenantEmail && <div className="text-red-400 text-xs mt-1">{errors.tenantEmail}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.tenantPhone}
                    onChange={e => handleInputChange('tenantPhone', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.tenantPhone ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="Enter phone number"
                  />
                  {errors.tenantPhone && <div className="text-red-400 text-xs mt-1">{errors.tenantPhone}</div>}
                </div>
              </div>
            </div>

            {/* Lease Dates */}
            <div className="border-b border-[#2a2a2f] pb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Lease Period
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => handleInputChange('startDate', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.startDate ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                  {errors.startDate && <div className="text-red-400 text-xs mt-1">{errors.startDate}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.endDate ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  />
                  {errors.endDate && <div className="text-red-400 text-xs mt-1">{errors.endDate}</div>}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="border-b border-[#2a2a2f] pb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                Financial Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyRent}
                    onChange={e => handleInputChange('monthlyRent', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.monthlyRent ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="0.00"
                  />
                  {errors.monthlyRent && <div className="text-red-400 text-xs mt-1">{errors.monthlyRent}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Security Deposit *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.securityDeposit}
                    onChange={e => handleInputChange('securityDeposit', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.securityDeposit ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="0.00"
                  />
                  {errors.securityDeposit && <div className="text-red-400 text-xs mt-1">{errors.securityDeposit}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rent Due Date *</label>
                  <select
                    value={formData.rentDueDate}
                    onChange={e => handleInputChange('rentDueDate', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.rentDueDate ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  {errors.rentDueDate && <div className="text-red-400 text-xs mt-1">{errors.rentDueDate}</div>}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Terms and Conditions
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lease Terms *</label>
                <textarea
                  value={formData.terms}
                  onChange={e => handleInputChange('terms', e.target.value)}
                  rows={4}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.terms ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none`}
                  placeholder="Enter lease terms and conditions..."
                />
                {errors.terms && <div className="text-red-400 text-xs mt-1">{errors.terms}</div>}
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