"use client";

import React, { useState } from 'react';
import { Building, Plus, ArrowLeft, ArrowRight, Check, Upload, MapPin, DollarSign, Users, FileText, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../../_components/Background';
import ProtectedRoute from '../../../../_components/ProtectedRoute';

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    type: 'apartment',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Rent & Location
    rent: '',
    deposit: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: false,
    
    // Legal Docs
    documents: [],
    
    // 100gaj Integration
    from100gaj: false,
    propertyId: ''
  });

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Property Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter property name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Pincode"
                />
              </div>
            </div>

            {/* 100gaj Integration */}
            <div className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="from100gaj"
                  checked={formData.from100gaj}
                  onChange={(e) => handleInputChange('from100gaj', e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                />
                <label htmlFor="from100gaj" className="text-white font-medium">Import from 100gaj</label>
              </div>
              
              {formData.from100gaj && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.propertyId}
                      onChange={(e) => handleInputChange('propertyId', e.target.value)}
                      className="flex-1 p-3 bg-[#0a0a0f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Enter 100gaj property ID"
                    />
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">This will auto-fill property details from your 100gaj listing</p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange('deposit', e.target.value)}
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
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Area (sq ft)</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full p-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => handleInputChange('furnished', e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500"
                />
                Furnished Property
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Documents</label>
              <div className="border-2 border-dashed border-[#2a2a2f] rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drag and drop files here, or click to select</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl cursor-pointer inline-block">
                  Choose Files
                </label>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Uploaded Documents:</h4>
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a1f] rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-orange-400" />
                        <span className="text-white text-sm">{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          const newDocs = formData.documents.filter((_, i) => i !== index);
                          handleInputChange('documents', newDocs);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <div><span className="text-gray-400">Name:</span> <span className="text-white">{formData.name}</span></div>
                    <div><span className="text-gray-400">Type:</span> <span className="text-white capitalize">{formData.type}</span></div>
                    <div><span className="text-gray-400">Address:</span> <span className="text-white">{formData.address}</span></div>
                    <div><span className="text-gray-400">City:</span> <span className="text-white">{formData.city}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Rent Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Monthly Rent:</span> <span className="text-white">₹{formData.rent}</span></div>
                    <div><span className="text-gray-400">Deposit:</span> <span className="text-white">₹{formData.deposit}</span></div>
                    <div><span className="text-gray-400">Bedrooms:</span> <span className="text-white">{formData.bedrooms}</span></div>
                    <div><span className="text-gray-400">Bathrooms:</span> <span className="text-white">{formData.bathrooms}</span></div>
                  </div>
                </div>
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