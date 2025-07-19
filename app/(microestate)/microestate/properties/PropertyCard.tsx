"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, CheckCircle, Star, Zap, MapPin, Home, UserCircle, Calendar, Tag, Ruler, Eye, Mail, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    description: string;
    type: string;
    size: number;
    location: string;
    price: number;
    status: 'Available' | 'Rented' | 'Coming Soon';
    postedDate: string;
    badges?: ('New' | 'Verified' | 'Featured')[];
    amenities?: string[];
    images?: string[];
    isFavorite?: boolean;
    landlord?: {
      name: string;
      avatarUrl?: string;
      verified?: boolean;
    };
    views?: number;
    inquiries?: number;
    engagementScore?: number;
  };
  onFavorite?: (id: string) => void;
  onContact?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const badgeColors: Record<string, string> = {
  New: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
  Verified: 'bg-green-600 text-white',
  Featured: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
};

const amenityIcons: Record<string, React.ReactNode> = {
  Furnished: <Star className="w-4 h-4" />,
  'Wi-Fi': <Zap className="w-4 h-4" />,
  'Pet Friendly': <Heart className="w-4 h-4" />,
  Balcony: <CheckCircle className="w-4 h-4" />,
  Parking: <CheckCircle className="w-4 h-4" />,
};

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Listed today';
  if (diff === 1) return 'Listed 1 day ago';
  return `Listed ${diff} days ago`;
}

export default function PropertyCard({ property, onFavorite, onContact, onViewDetails }: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 8px 32px 0 rgba(251, 146, 60, 0.25)' }}
      className="relative bg-white/10 backdrop-blur-lg border-2 border-orange-400/30 rounded-2xl shadow-xl overflow-visible transition-all duration-300 group flex flex-col hover:shadow-[0_0_24px_4px_rgba(251,146,60,0.4)] hover:border-orange-400"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full rounded-t-2xl overflow-hidden">
        <img
          src={property.images?.[0] || '/images/property1.jpg'}
          alt={property.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {property.badges?.map(badge => (
            <span key={badge} className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${badgeColors[badge]} ring-2 ring-white/30`}>{badge}</span>
          ))}
        </div>
        <button
          className={`absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-orange-500 transition-colors ${property.isFavorite ? 'text-orange-400' : 'text-white'} shadow-lg`}
          onClick={() => onFavorite && onFavorite(property._id)}
          aria-label="Save to favorites"
        >
          <Heart fill={property.isFavorite ? '#fb923c' : 'none'} className="w-5 h-5" />
        </button>
      </div>
      {/* Card Content */}
      <div className="flex-1 flex flex-col p-6 gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-400 font-semibold">{property.type}</span>
          <Ruler className="w-4 h-4 text-gray-400 ml-2" />
          <span className="text-xs text-gray-400">{property.size} sqft</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1 truncate">{property.title}</h2>
        <p className="text-gray-300 text-sm line-clamp-2 mb-2">{property.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-xs">{property.location}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#181c24] text-orange-400 ml-auto">{property.status}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {property.amenities?.map(am => (
            <span key={am} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[#181c24] text-gray-200 shadow">{amenityIcons[am] || null}{am}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto mb-2">
          <span className="text-2xl font-extrabold text-orange-400 drop-shadow">₹{property.price}/mo</span>
          <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" />{formatRelativeDate(property.postedDate)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <UserCircle className="w-5 h-5 text-gray-300" />
          <span className="text-sm text-white font-medium">{property.landlord?.name || 'Landlord'}</span>
          {property.landlord?.verified && (
            <span className="ml-1 px-2 py-0.5 text-xs rounded bg-green-600 text-white flex items-center gap-1"><CheckCircle className="w-3 h-3" />Verified</span>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Button className="flex-1 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold shadow-lg hover:scale-105 transition-transform" onClick={() => onViewDetails && onViewDetails(property._id)}>View Details</Button>
          <Button className="flex-1 bg-[#23232a] border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white font-bold shadow hover:scale-105 transition-transform" onClick={() => onContact && onContact(property._id)}>Contact</Button>
        </div>
      </div>
      {/* Analytics */}
      <div className="flex items-center gap-x-4 mt-4 mb-4 px-6 py-2 mx-4">
        <button type="button" className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-inner text-sm text-gray-200 font-semibold transition-all duration-200 hover:bg-orange-500/80 hover:text-white hover:shadow-orange-400/40 focus:outline-none focus:ring-2 focus:ring-orange-400">
          <Eye className="w-4 h-4 mr-1" />
          {property.views || 0} <span className="ml-1">views</span>
        </button>
        <button type="button" className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-inner text-sm text-gray-200 font-semibold transition-all duration-200 hover:bg-blue-500/80 hover:text-white hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <Mail className="w-4 h-4 mr-1" />
          {property.inquiries || 0} <span className="ml-1">inquiries</span>
        </button>
        <button type="button" className={`flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-inner text-sm font-semibold transition-all duration-200 hover:bg-pink-500/80 hover:text-white hover:shadow-pink-400/40 focus:outline-none focus:ring-2 focus:ring-pink-400 ${property.engagementScore && property.engagementScore > 70 ? 'text-orange-400' : 'text-gray-200'}`}>
          <Flame className={`w-4 h-4 mr-1 ${property.engagementScore && property.engagementScore > 70 ? 'text-orange-400' : 'text-gray-400'}`} />
          {property.engagementScore || 0} <span className="ml-1">Engagement</span>
        </button>
      </div>
    </motion.div>
  );
} 