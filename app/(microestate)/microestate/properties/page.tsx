"use client";

import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Background from '../../_components/Background';
import { FaHome, FaBuilding, FaWarehouse, FaHotel, FaCouch, FaWifi, FaCar, FaDog, FaCheckSquare, FaSortAmountDown, FaSortAmountUp, FaRupeeSign } from 'react-icons/fa';
import { Building, Home, MapPin, CreditCard, Edit, Trash2, Eye } from 'lucide-react';

const propertyTypes = [
  { label: 'Apartment', icon: <FaBuilding className="inline-block mr-1" /> },
  { label: 'Villa', icon: <FaHome className="inline-block mr-1" /> },
  { label: 'Studio', icon: <FaHotel className="inline-block mr-1" /> },
  { label: 'House', icon: <FaCouch className="inline-block mr-1" /> },
  { label: 'Loft', icon: <FaWarehouse className="inline-block mr-1" /> },
];
const amenitiesList = [
  { label: 'Wi-Fi', icon: <FaWifi className="inline-block mr-1" /> },
  { label: 'Furnished', icon: <FaCouch className="inline-block mr-1" /> },
  { label: 'Parking', icon: <FaCar className="inline-block mr-1" /> },
  { label: 'Balcony', icon: <FaBuilding className="inline-block mr-1" /> },
  { label: 'Pet Friendly', icon: <FaDog className="inline-block mr-1" /> },
];
const sortOptions = [
  { value: 'newest', label: 'Newest', icon: <FaSortAmountDown className="inline-block mr-1" /> },
  { value: 'oldest', label: 'Oldest', icon: <FaSortAmountUp className="inline-block mr-1" /> },
  { value: 'priceLow', label: 'Price (Low to High)', icon: <FaRupeeSign className="inline-block mr-1" /> },
  { value: 'priceHigh', label: 'Price (High to Low)', icon: <FaRupeeSign className="inline-block mr-1" /> },
  { value: 'size', label: 'Size', icon: <FaCheckSquare className="inline-block mr-1" /> },
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

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState('newest');

  // Filtering logic
  const filteredProperties = mockProperties
    .filter((property) =>
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase())
    )
    .filter((property) =>
      !selectedType || property.type.toLowerCase().includes(selectedType.toLowerCase())
    )
    .filter((property) =>
      selectedAmenities.length === 0 || selectedAmenities.every(a => property.amenities?.includes(a))
    )
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      if (sort === 'oldest') return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
      if (sort === 'priceLow') return a.price - b.price;
      if (sort === 'priceHigh') return b.price - a.price;
      if (sort === 'size') return b.size - a.size;
      return 0;
    });

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto py-10 mt-24 relative z-10">
        <section className="mb-10 animate-fadeIn">
          <h2 className="text-2xl font-bold heading-gradient mb-6 flex items-center gap-2"><Building className="w-6 h-6 text-orange-500" /> Properties</h2>
          {/* Filter/Search/Sort Bar */}
          <div className="bg-glass border border-orange-500/20 rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <Input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/4 bg-[#181c24] text-white border-orange-500/20 focus:border-orange-500"
            />
            <div className="flex gap-2 flex-wrap">
              {propertyTypes.map(pt => (
                <Button
                  key={pt.label}
                  size="sm"
                  variant={selectedType === pt.label ? 'default' : 'outline'}
                  className={`flex items-center gap-1 ${selectedType === pt.label ? 'bg-orange-500 text-white' : 'text-orange-400 border-orange-500/30'}`}
                  onClick={() => setSelectedType(selectedType === pt.label ? '' : pt.label)}
                >
                  {pt.icon}{pt.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {amenitiesList.map(am => (
                <Button
                  key={am.label}
                  size="sm"
                  variant={selectedAmenities.includes(am.label) ? 'default' : 'outline'}
                  className={`flex items-center gap-1 ${selectedAmenities.includes(am.label) ? 'bg-orange-500 text-white' : 'text-orange-400 border-orange-500/30'}`}
                  onClick={() => handleAmenityToggle(am.label)}
                >
                  {am.icon}{am.label}
                </Button>
              ))}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-[#181c24] text-orange-400 border border-orange-500/30 rounded px-3 py-2 focus:outline-none focus:border-orange-500"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Button
              size="sm"
              variant="ghost"
              className="text-orange-400 hover:text-white"
              onClick={() => {
                setSearch('');
                setSelectedType('');
                setSelectedAmenities([]);
                setSort('newest');
              }}
            >
              Reset
            </Button>
          </div>
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">No properties found.</div>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
} 