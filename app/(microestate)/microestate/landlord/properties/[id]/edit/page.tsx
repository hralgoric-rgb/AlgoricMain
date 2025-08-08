"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Home, DollarSign, MapPin, Users, Edit, History, Loader2, CheckCircle, AlertTriangle, Image, X, Upload, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FloatingCircles, ParticleBackground, AnimatedGradient } from '../../../../../_components/Background';
import ProtectedRoute from '../../../../../_components/ProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'apartment',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    rent: {
      amount: 0,
      currency: 'INR',
      period: 'monthly'
    },
    securityDeposit: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    features: {
      furnished: false,
      parking: false,
      gym: false,
      pool: false,
      laundry: false,
      airConditioning: false,
      heating: false,
      internet: false,
      balcony: false,
      garden: false
    },
    amenities: [] as string[],
    description: '',
    images: [] as string[]
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'condo', label: 'Condo' }
  ];

  // Fetch property data on component mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/microestate/api/properties/${propertyId}`);
        const property = response.data;
        
        setFormData({
          title: property.title || '',
          propertyType: property.propertyType || 'apartment',
          address: {
            street: property.address?.street || '',
            city: property.address?.city || '',
            state: property.address?.state || '',
            zipCode: property.address?.zipCode || '',
            country: property.address?.country || 'India'
          },
          rent: {
            amount: property.rent?.amount || 0,
            currency: property.rent?.currency || 'INR',
            period: property.rent?.period || 'monthly'
          },
          securityDeposit: property.securityDeposit || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          squareFootage: property.squareFootage || 0,
          features: {
            furnished: property.features?.furnished || false,
            parking: property.features?.parking || false,
            gym: property.features?.gym || false,
            pool: property.features?.pool || false,
            laundry: property.features?.laundry || false,
            airConditioning: property.features?.airConditioning || false,
            heating: property.features?.heating || false,
            internet: property.features?.internet || false,
            balcony: property.features?.balcony || false,
            garden: property.features?.garden || false
          },
          amenities: property.amenities || [],
          description: property.description || '',
          images: property.images || []
        });
      } catch (error: any) {
        console.error('Error fetching property:', error);
        setErrors({ general: 'Failed to load property data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.title) newErrors.title = 'Property name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.address.street) newErrors.street = 'Street address is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.state) newErrors.state = 'State is required';
    if (!formData.address.zipCode) newErrors.zipCode = 'Pincode is required';
    if (!formData.rent.amount || formData.rent.amount <= 0) newErrors.rent = 'Rent must be positive';
    if (formData.securityDeposit < 0) newErrors.securityDeposit = 'Security deposit cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRentChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      rent: { ...prev.rent, [field]: value }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureChange = (feature: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }));
  };

  // Image handling functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    
    if (validFiles.length !== files.length) {
      setErrors(prev => ({ ...prev, images: 'Some files were invalid. Only images under 5MB are allowed.' }));
    }
    
    setNewImages(prev => [...prev, ...validFiles]);
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadPromises = images.map(async (image) => {
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      return data.url;
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      
      let finalImages = [...formData.images];
      
      // Upload new images if any
      if (newImages.length > 0) {
        setUploadingImages(true);
        try {
          const uploadedUrls = await uploadImages(newImages);
          finalImages = [...finalImages, ...uploadedUrls];
        } catch (error) {
          setErrors({ general: 'Failed to upload images. Please try again.' });
          setSaving(false);
          setUploadingImages(false);
          return;
        } finally {
          setUploadingImages(false);
        }
      }
      
      const submitData = {
        ...formData,
        images: finalImages
      };
      
      const response = await axios.put(`/microestate/api/properties/${propertyId}`, submitData);
      
      if (response.data.success) {
        setSuccess('Property updated successfully!');
        setTimeout(() => {
          router.push(`/microestate/landlord/properties/${propertyId}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating property:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update property. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["landlord"]}>
        <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
          <FloatingCircles />
          <ParticleBackground />
          <AnimatedGradient />
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["landlord"]}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <FloatingCircles />
        <ParticleBackground />
        <AnimatedGradient />
        <div className="container mx-auto py-10 mt-24 relative z-10">
          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/microestate/landlord/properties/${propertyId}`}>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Property
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Property</h1>
                <p className="text-gray-400">Update property information</p>
              </div>
            </div>
          </section>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{errors.general}</span>
            </div>
          )}

          {/* Edit Form */}
          <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-8 animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Name *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                      errors.title ? 'border-red-500' : 'border-[#2a2a2f]'
                    }`}
                    placeholder="Enter property name"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-orange-400" />
                  Property Images
                </h3>
                
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">Current Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage(image)}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {newImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">New Images to Upload</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {newImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Add New Images</label>
                  <div className="border-2 border-dashed border-[#2a2a2f] rounded-xl p-6 text-center hover:border-orange-500/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        PNG, JPG, JPEG up to 5MB each
                      </p>
                    </label>
                  </div>
                  {errors.images && <p className="text-red-400 text-sm">{errors.images}</p>}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.street ? 'border-red-500' : 'border-[#2a2a2f]'
                      }`}
                      placeholder="Enter street address"
                    />
                    {errors.street && <p className="text-red-400 text-sm mt-1">{errors.street}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.city ? 'border-red-500' : 'border-[#2a2a2f]'
                      }`}
                      placeholder="Enter city"
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.state ? 'border-red-500' : 'border-[#2a2a2f]'
                      }`}
                      placeholder="Enter state"
                    />
                    {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={formData.address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.zipCode ? 'border-red-500' : 'border-[#2a2a2f]'
                      }`}
                      placeholder="Enter pincode"
                    />
                    {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-orange-400" />
                  Property Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Square Footage</label>
                    <input
                      type="number"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Security Deposit</label>
                    <input
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.securityDeposit ? 'border-red-500' : 'border-[#2a2a2f]'
                      }`}
                      min="0"
                    />
                    {errors.securityDeposit && <p className="text-red-400 text-sm mt-1">{errors.securityDeposit}</p>}
                  </div>
                </div>
              </div>

              {/* Rent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                  Rent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent *</label>
                    <input
                      type="number"
                      value={formData.rent.amount}
                      onChange={(e) => handleRentChange('amount', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.rent ? 'border-red-500' : 'border-[#2a2a2f]'
                      }`}
                      placeholder="Enter monthly rent"
                      min="0"
                    />
                    {errors.rent && <p className="text-red-400 text-sm mt-1">{errors.rent}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                    <select
                      value={formData.rent.currency}
                      onChange={(e) => handleRentChange('currency', e.target.value)}
                      className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rent Period</label>
                    <select
                      value={formData.rent.period}
                      onChange={(e) => handleRentChange('period', e.target.value)}
                      className="w-full px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(formData.features).map(([feature, value]) => (
                    <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-[#2a2a2f] hover:border-orange-500/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                        className="w-4 h-4 text-orange-500 bg-[#1a1a1f] border-[#2a2a2f] rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300 capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-[#1a1a1f] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-[#2a2a2f]'
                  }`}
                  placeholder="Describe your property..."
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {saving || uploadingImages ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadingImages ? 'Uploading Images...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Link href={`/microestate/landlord/properties/${propertyId}`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </section>
        </div>

        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Property image preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}