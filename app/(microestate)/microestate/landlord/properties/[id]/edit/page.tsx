"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, FileText, Home, DollarSign, MapPin, Users, Edit, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../../../_components/Background';
import ProtectedRoute from '../../../../../_components/ProtectedRoute';
import { useParams } from 'next/navigation';

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id;
  // Simulated property data (replace with API fetch)
  const [formData, setFormData] = useState({
    name: 'Urban Loft',
    type: 'apartment',
    address: '123 Main Street, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    rent: 18000,
    deposit: 36000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    furnished: true
  });
  const [errors, setErrors] = useState<any>({});
  const [showHistory, setShowHistory] = useState(false);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' }
  ];

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!formData.rent || formData.rent <= 0) newErrors.rent = 'Rent must be positive';
    if (formData.deposit < 0) newErrors.deposit = 'Deposit cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // TODO: Submit updated property data to API
      alert('Property updated!');
    }
  };

  // Simulated change history
  const changeHistory = [
    { date: '2024-06-01', change: 'Updated rent from ₹17,000 to ₹18,000' },
    { date: '2024-05-15', change: 'Changed address' },
    { date: '2024-04-10', change: 'Added new bedroom' }
  ];

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
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Property</h1>
                <p className="text-gray-400">Update property information</p>
              </div>
            </div>
          </section>

          {/* Edit Form */}
          <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={`w-full p-3 bg-[#1a1a1f] border ${errors.name ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="Enter property name"
                />
                {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Type *</label>
                  <select
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    value={formData.rent}
                    onChange={e => handleInputChange('rent', Number(e.target.value))}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.rent ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="0"
                  />
                  {errors.rent && <div className="text-red-400 text-xs mt-1">{errors.rent}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={e => handleInputChange('deposit', Number(e.target.value))}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.deposit ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="0"
                  />
                  {errors.deposit && <div className="text-red-400 text-xs mt-1">{errors.deposit}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Area (sq ft)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={e => handleInputChange('area', Number(e.target.value))}
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={e => handleInputChange('bedrooms', Number(e.target.value))}
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={e => handleInputChange('bathrooms', Number(e.target.value))}
                    className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={e => handleInputChange('furnished', e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                  />
                  <label className="text-white font-medium">Furnished</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.city ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="City"
                  />
                  {errors.city && <div className="text-red-400 text-xs mt-1">{errors.city}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.state ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="State"
                  />
                  {errors.state && <div className="text-red-400 text-xs mt-1">{errors.state}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                    className={`w-full p-3 bg-[#1a1a1f] border ${errors.pincode ? 'border-red-500' : 'border-[#2a2a2f]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors`}
                    placeholder="Pincode"
                  />
                  {errors.pincode && <div className="text-red-400 text-xs mt-1">{errors.pincode}</div>}
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2a2a2f]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <History className="w-4 h-4 mr-2" />
                  {showHistory ? 'Hide' : 'Show'} Change History
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>

            {/* Change History Section */}
            {showHistory && (
              <div className="mt-8 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><History className="w-5 h-5 text-orange-500" /> Change History</h3>
                <ul className="space-y-2">
                  {changeHistory.map((item, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex gap-4 items-center">
                      <span className="text-xs text-gray-500 w-24">{item.date}</span>
                      <span>{item.change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
} 