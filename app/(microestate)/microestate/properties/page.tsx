"use client";

import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';

const propertyTypes = ['Apartment', 'Villa', 'Studio', 'House', 'Loft'];
const amenitiesList = ['Wi-Fi', 'Furnished', 'Parking', 'Balcony', 'Pet Friendly'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceHigh', label: 'Price High → Low' },
  { value: 'size', label: 'Size' },
];

// Mock data for demonstration
const mockProperties = [
  {
    _id: '1',
    title: 'Luxury Penthouse',
    description: 'Spacious 2BHK apartment with garden view, close to metro.',
    type: '2BHK Apartment',
    size: 950,
    location: 'Indiranagar, Bangalore',
    price: 20000,
    status: 'Available',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['New', 'Verified'],
    amenities: ['Furnished', 'Wi-Fi', 'Parking', 'Balcony'],
    images: ['/images/property1.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Nikhil Sharma',
      avatarUrl: '',
      verified: true,
    },
    views: 123,
    inquiries: 5,
    engagementScore: 87,
  },
  {
    _id: '2',
    title: 'Modern Villa',
    description: 'Modern studio apartment, perfect for singles or students.',
    type: 'Studio',
    size: 400,
    location: 'Koramangala, Bangalore',
    price: 12000,
    status: 'Rented',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['Featured'],
    amenities: ['Wi-Fi', 'Pet Friendly'],
    images: ['/images/property2.jpg'],
    isFavorite: true,
    landlord: {
      name: 'Priya Verma',
      avatarUrl: '',
      verified: true,
    },
    views: 89,
    inquiries: 2,
    engagementScore: 65,
  },
  {
    _id: '3',
    title: 'Waterfront Condo',
    description: '5BHK luxury villa with private pool and garden.',
    type: 'Villa',
    size: 3500,
    location: 'Whitefield, Bangalore',
    price: 95000,
    status: 'Coming Soon',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['New', 'Featured'],
    amenities: ['Furnished', 'Parking', 'Balcony'],
    images: ['/images/property3.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Amit Singh',
      avatarUrl: '',
      verified: false,
    },
    views: 45,
    inquiries: 0,
    engagementScore: 30,
  },
  {
    _id: '4',
    title: 'Urban Loft',
    description: 'Trendy 1BHK loft in the heart of the city, close to nightlife and offices.',
    type: '1BHK Loft',
    size: 650,
    location: 'MG Road, Pune',
    price: 18000,
    status: 'Available',
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['Verified'],
    amenities: ['Wi-Fi', 'Parking'],
    images: ['/images/property4.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Rohit Mehra',
      avatarUrl: '',
      verified: true,
    },
    views: 67,
    inquiries: 1,
    engagementScore: 50,
  },
  {
    _id: '5',
    title: 'Family Home',
    description: 'Spacious 3BHK home with a large backyard, perfect for families and pets.',
    type: '3BHK House',
    size: 1800,
    location: 'Sector 21, Gurgaon',
    price: 35000,
    status: 'Available',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['Featured'],
    amenities: ['Furnished', 'Pet Friendly', 'Parking'],
    images: ['/images/property5.jpg'],
    isFavorite: true,
    landlord: {
      name: 'Sunita Rao',
      avatarUrl: '',
      verified: true,
    },
    views: 150,
    inquiries: 7,
    engagementScore: 92,
  },
  {
    _id: '6',
    title: 'Student Studio',
    description: 'Affordable studio with all basic amenities, walking distance to university.',
    type: 'Studio',
    size: 320,
    location: 'North Campus, Delhi',
    price: 9000,
    status: 'Available',
    postedDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    badges: ['New'],
    amenities: ['Wi-Fi'],
    images: ['/images/property6.jpg'],
    isFavorite: false,
    landlord: {
      name: 'Dr. Anil Kumar',
      avatarUrl: '',
      verified: false,
    },
    views: 33,
    inquiries: 0,
    engagementScore: 25,
  },
];

export default function PropertyListingPage() {
  const [properties] = useState(mockProperties);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSize, setMinSize] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Unique locations for dropdown
  const locations = Array.from(new Set(properties.map(p => p.location)));

  // Filtering logic
  let filtered = properties.filter(p =>
    (!location || p.location === location) &&
    (!minPrice || p.price >= Number(minPrice)) &&
    (!maxPrice || p.price <= Number(maxPrice)) &&
    (!minSize || p.size >= Number(minSize)) &&
    (selectedTypes.length === 0 || selectedTypes.includes(p.type.split(' ')[1] || p.type)) &&
    (selectedAmenities.length === 0 || selectedAmenities.every(a => p.amenities?.includes(a)))
  );

  // Sorting logic
  if (sortBy === 'priceHigh') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'size') filtered = [...filtered].sort((a, b) => b.size - a.size);
  else filtered = [...filtered].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

  // Handlers
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <div className="container mx-auto py-10 mt-24 relative z-10">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
          Available Properties
        </h1>
        {/* Filter Bar */}
        <div className="bg-[#181c24] rounded-xl p-6 mb-8 flex flex-wrap gap-4 items-end shadow-lg">
          {/* Location Dropdown */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <select
              className="w-40 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500"
              value={location}
              onChange={e => setLocation(e.target.value)}
            >
              <option value="">All</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          {/* Price Range */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Min Price</label>
            <Input type="number" min={0} value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" className="w-28" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Max Price</label>
            <Input type="number" min={0} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" className="w-28" />
          </div>
          {/* Size */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Min Size (sqft)</label>
            <Input type="number" min={0} value={minSize} onChange={e => setMinSize(e.target.value)} placeholder="Min sqft" className="w-32" />
          </div>
          {/* Property Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map(type => (
                <label key={type} className={`px-3 py-1 rounded-full cursor-pointer border text-xs ${selectedTypes.includes(type) ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#23232a] text-gray-300 border-orange-500/20'}`}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="mr-1 accent-orange-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          {/* Amenities */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map(am => (
                <label key={am} className={`px-3 py-1 rounded-full cursor-pointer border text-xs ${selectedAmenities.includes(am) ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#23232a] text-gray-300 border-orange-500/20'}`}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(am)}
                    onChange={() => handleAmenityChange(am)}
                    className="mr-1 accent-orange-500"
                  />
                  {am}
                </label>
              ))}
            </div>
          </div>
          {/* Sort By */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Sort By</label>
            <select
              className="w-40 rounded px-3 py-2 bg-[#23232a] text-white border border-orange-500/20 focus:border-orange-500"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        {/* Property Listings Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 