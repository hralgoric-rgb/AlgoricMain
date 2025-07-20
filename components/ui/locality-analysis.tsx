"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaShoppingCart, FaHospital, FaGraduationCap, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';

interface AreaData {
  area: string;
  description?: string;
  connectivity: {
    metro_stations: Array<{
      name: string;
      distance: string;
      line?: string;
    }>;
    bus_stops: Array<{
      name: string;
      distance: string;
    }>;
    major_roads: string[];
  };
  amenities: {
    schools: Array<{
      name: string;
      distance: string;
      rating?: number;
    }>;
    hospitals: Array<{
      name: string;
      distance: string;
      type?: string;
    }>;
    shopping: Array<{
      name: string;
      distance: string;
      type?: string;
    }>;
    parks: Array<{
      name: string;
      distance: string;
    }>;
  };
  lifestyle: {
    safety_rating: number;
    traffic_rating: number;
    pollution_level: string;
    cost_of_living: string;
  };
  investment_outlook: {
    growth_potential: string;
    appreciation_rate: string;
    rental_yield: string;
  };
}

interface LocalityAnalysisProps {
  locality: string;
}

export function LocalityAnalysis({ locality }: LocalityAnalysisProps) {
  const [areaData, setAreaData] = useState<AreaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://delhi-area-analyzer.onrender.com/api/location/${encodeURIComponent(locality)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch area data');
        }
        
        const data = await response.json();
        setAreaData(data);
      } catch (err) {
        console.error('Error fetching area data:', err);
        setError('Unable to load area analysis. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (locality) {
      fetchAreaData();
    }
  }, [locality]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Analyzing area data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <FaExclamationTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!areaData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No area data available for {locality}</p>
      </div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return 'bg-green-100';
    if (rating >= 3) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Area Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200"
      >
        <div className="flex items-center mb-3">
          <IoLocationOutline className="h-6 w-6 text-orange-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">{areaData.area}</h3>
        </div>
        {areaData.description && (
          <p className="text-gray-700">{areaData.description}</p>
        )}
      </motion.div>

      {/* Connectivity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg p-6 border border-gray-200"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Connectivity</h4>
        
        {areaData.connectivity.metro_stations.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 mb-2">Metro Stations</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {areaData.connectivity.metro_stations.slice(0, 4).map((station, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                  <span className="text-gray-700">{station.name}</span>
                  <span className="text-sm font-medium text-blue-600">{station.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {areaData.connectivity.bus_stops.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 mb-2">Bus Stops</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {areaData.connectivity.bus_stops.slice(0, 4).map((stop, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                  <span className="text-gray-700">{stop.name}</span>
                  <span className="text-sm font-medium text-green-600">{stop.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {areaData.connectivity.major_roads.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Major Roads</h5>
            <div className="flex flex-wrap gap-2">
              {areaData.connectivity.major_roads.map((road, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {road}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Amenities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg p-6 border border-gray-200"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Nearby Amenities</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schools */}
          {areaData.amenities.schools.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <FaGraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                <h5 className="font-medium text-gray-800">Schools</h5>
              </div>
              <div className="space-y-2">
                {areaData.amenities.schools.slice(0, 3).map((school, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                    <div>
                      <span className="text-gray-700">{school.name}</span>
                      {school.rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-3 w-3 ${i < school.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-blue-600">{school.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hospitals */}
          {areaData.amenities.hospitals.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <FaHospital className="h-5 w-5 text-red-600 mr-2" />
                <h5 className="font-medium text-gray-800">Hospitals</h5>
              </div>
              <div className="space-y-2">
                {areaData.amenities.hospitals.slice(0, 3).map((hospital, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 rounded-lg p-3">
                    <div>
                      <span className="text-gray-700">{hospital.name}</span>
                      {hospital.type && (
                        <div className="text-xs text-gray-500 mt-1">{hospital.type}</div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-red-600">{hospital.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shopping */}
          {areaData.amenities.shopping.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <FaShoppingCart className="h-5 w-5 text-purple-600 mr-2" />
                <h5 className="font-medium text-gray-800">Shopping</h5>
              </div>
              <div className="space-y-2">
                {areaData.amenities.shopping.slice(0, 3).map((shop, index) => (
                  <div key={index} className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                    <div>
                      <span className="text-gray-700">{shop.name}</span>
                      {shop.type && (
                        <div className="text-xs text-gray-500 mt-1">{shop.type}</div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-purple-600">{shop.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parks */}
          {areaData.amenities.parks.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <FaMapMarkerAlt className="h-5 w-5 text-green-600 mr-2" />
                <h5 className="font-medium text-gray-800">Parks & Recreation</h5>
              </div>
              <div className="space-y-2">
                {areaData.amenities.parks.slice(0, 3).map((park, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                    <span className="text-gray-700">{park.name}</span>
                    <span className="text-sm font-medium text-green-600">{park.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lifestyle & Investment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lifestyle Ratings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg p-6 border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Ratings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Safety Rating</span>
              <div className={`px-3 py-1 rounded-full ${getRatingBg(areaData.lifestyle.safety_rating)}`}>
                <span className={`font-medium ${getRatingColor(areaData.lifestyle.safety_rating)}`}>
                  {areaData.lifestyle.safety_rating}/5
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Traffic Rating</span>
              <div className={`px-3 py-1 rounded-full ${getRatingBg(areaData.lifestyle.traffic_rating)}`}>
                <span className={`font-medium ${getRatingColor(areaData.lifestyle.traffic_rating)}`}>
                  {areaData.lifestyle.traffic_rating}/5
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pollution Level</span>
              <span className="font-medium text-gray-700">{areaData.lifestyle.pollution_level}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Cost of Living</span>
              <span className="font-medium text-gray-700">{areaData.lifestyle.cost_of_living}</span>
            </div>
          </div>
        </motion.div>

        {/* Investment Outlook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg p-6 border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Outlook</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Growth Potential</span>
              <span className="font-medium text-green-600">{areaData.investment_outlook.growth_potential}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Appreciation Rate</span>
              <span className="font-medium text-blue-600">{areaData.investment_outlook.appreciation_rate}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Rental Yield</span>
              <span className="font-medium text-orange-600">{areaData.investment_outlook.rental_yield}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
