"use client";

import React, { useState, useEffect } from 'react';
import { Building, Plus, ArrowLeft, ArrowRight, Check, Upload, MapPin, DollarSign, Users, FileText, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../../_components/Background';
import ProtectedRoute from '../../../../_components/ProtectedRoute';

// Define the type for formData
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface FormData {
  title: string;
  description: string;
  rent: string;
  securityDeposit?: string;
  propertyType: string;
  area: string;
  address: Address;
  images: File[];
  availableFrom?: string;
  status: 'Vacant' | 'Occupied';
  furnished: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  facilities: string[];
  bedrooms: string;
  bathrooms: string;
  assignedTenant?: string;
}

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    rent: '',
    propertyType: 'apartment',
    area: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    images: [],
    status: 'Vacant', // or 'Occupied'
    furnished: 'Unfurnished', // or 'Furnished', 'Semi-Furnished'
    facilities: [],
    bedrooms: '',
    bathrooms: ''
  });
  const [tenants, setTenants] = useState<{id:string, name:string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Info', icon: Home },
    { id: 2, title: 'Rent & Location', icon: DollarSign },
    { id: 3, title: 'Legal Docs', icon: FileText },
    { id: 4, title: 'Review', icon: Check }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' }
  ];

  // Update handleInputChange to use proper typing
  const handleInputChange = (
    field: keyof FormData | 'address',
    value: any,
    nestedField?: keyof Address
  ) => {
    if (field === 'address' && nestedField) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [nestedField]: value
        }
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit form data to API
    console.log('Submitting property:', formData);
  };

  // 3. Fetch tenants on mount
  useEffect(() => {
    fetch('/api/users?role=tenant')
      .then(res => res.json())
      .then(data => setTenants(data.users || []));
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Property Name *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter property name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter property description"
                rows={4}
              />
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Property Type *</label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={formData.rent}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Area (sq ft) *</label>
                <input
                  type="number"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="0"
                />
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Street *</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address', e.target.value, 'street')}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address', e.target.value, 'city')}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address', e.target.value, 'state')}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="State"
                />
              </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code *</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('address', e.target.value, 'zipCode')}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images *</label>
                <input
                  type="file"
                  multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, idx) => (
                    <div key={idx} className="bg-[#23232a] rounded-lg p-2 flex flex-col items-center">
                      <span className="text-xs text-white mb-2">{file.name}</span>
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-24 object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
              </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Property Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Name:</span> <span className="text-white">{formData.title}</span></div>
                    <div><span className="text-gray-400">Type:</span> <span className="text-white capitalize">{formData.propertyType}</span></div>
                    <div><span className="text-gray-400">Description:</span> <span className="text-white">{formData.description}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Rent & Location</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Monthly Rent:</span> <span className="text-white">₹{formData.rent}</span></div>
                    <div><span className="text-gray-400">Area:</span> <span className="text-white">{formData.area} sq ft</span></div>
                    <div><span className="text-gray-400">Street:</span> <span className="text-white">{formData.address.street}</span></div>
                    <div><span className="text-gray-400">City:</span> <span className="text-white">{formData.address.city}</span></div>
                    <div><span className="text-gray-400">State:</span> <span className="text-white">{formData.address.state}</span></div>
                    <div><span className="text-gray-400">Zip Code:</span> <span className="text-white">{formData.address.zipCode}</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Images</h4>
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, idx) => (
                      <div key={idx} className="bg-[#23232a] rounded-lg p-2 flex flex-col items-center">
                        <span className="text-xs text-white mb-2">{file.name}</span>
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-24 object-cover rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">No images uploaded.</span>
                )}
              </div>
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
              <div>
                <h1 className="text-3xl font-bold text-white">Add New Property</h1>
                <p className="text-gray-400">Create a new property listing</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id 
                        ? 'bg-orange-500 border-orange-500 text-white' 
                        : 'border-gray-600 text-gray-400'
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        currentStep > step.id ? 'bg-orange-500' : 'bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Form Content */}
          <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#2a2a2f]">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Create Property
                  </Button>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </ProtectedRoute>
  );
} 