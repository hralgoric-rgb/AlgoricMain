"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Home, Mail, Phone, Eye, Trash2, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../_components/Background';
import axios from 'axios';

interface Property {
  _id: string;
  title: string;
  address: string | {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  rent: number;
}

interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  property: Property;
  rentAmount: number;
  status: 'active' | 'overdue' | 'inactive';
  leaseStart: string;
  leaseEnd: string;
}

export default function TenantsPage() {
  const { data: session } = useSession();
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch tenants and properties in parallel
      const [tenantsResponse, propertiesResponse] = await Promise.all([
        axios.get('/microestate/api/landlord/tenants'),
        axios.get('/microestate/api/properties')
      ]);
      
      setTenants(tenantsResponse.data.tenants || []);
      setProperties(propertiesResponse.data.properties || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    if (!tenant.property?._id) {
      alert('Cannot delete tenant: Property information not available');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${tenant.name} from ${tenant.property.title}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingTenantId(tenant._id);
      
      const response = await axios.delete(`/microestate/api/properties/${tenant.property._id}/tenant`);
      
      if (response.data.success) {
        // Refresh the data after successful deletion
        await fetchData();
        alert('Tenant successfully removed from property');
      } else {
        throw new Error(response.data.message || 'Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to remove tenant. Please try again.');
    } finally {
      setDeletingTenantId(null);
    }
  };

  const filteredTenants = propertyFilter === 'all'
    ? tenants
    : tenants.filter(t => t.property?._id === propertyFilter);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <div className="container mx-auto py-4 mt-8 relative z-10">
        {/* Header */}
        <section className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent">Tenants</h1>
              <p className="text-gray-400">Manage your tenants and their properties</p>
            </div>
            <Link href="/microestate/landlord/tenants/add">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                Add Tenant
              </Button>
            </Link>
          </div>

          {/* Property Filter */}
          <div className="flex gap-4 items-center mb-6">
            <Filter className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
            <select
              value={propertyFilter}
              onChange={e => setPropertyFilter(e.target.value)}
              className="px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-transparent transition-colors"
            >
              <option value="all">All Properties</option>
              {properties.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading tenants...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tenants Table */}
        {!loading && !error && (
          <section className="bg-glass border border-transparent transition-colors hover:border-transparent">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2f]">
                    <th className="pb-4 text-gray-400 font-semibold">Tenant</th>
                    <th className="pb-4 text-gray-400 font-semibold">Contact</th>
                    <th className="pb-4 text-gray-400 font-semibold">Property</th>
                    <th className="pb-4 text-gray-400 font-semibold">Rent Amount</th>
                    <th className="pb-4 text-gray-400 font-semibold">Status</th>
                    <th className="pb-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant._id} className="border-b border-[#2a2a2f] hover:bg-[#1a1a1f] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl select-none">
                              {tenant.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{tenant.name}</div>
                            <div className="text-sm text-gray-400">ID: {tenant._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-300"><Mail className="w-4 h-4" /> {tenant.email}</span>
                          <span className="inline-flex items-center gap-1 text-sm text-gray-300"><Phone className="w-4 h-4" /> {tenant.phone}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-sm font-medium">{tenant.property?.title || 'N/A'}</span>
                            <div className="text-xs text-gray-400">
                              {tenant.property?.address ? 
                                (typeof tenant.property.address === 'string' ? 
                                  tenant.property.address : 
                                  [
                                    tenant.property.address.street,
                                    tenant.property.address.city,
                                    tenant.property.address.state
                                  ].filter(Boolean).join(', ')
                                ) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-green-400 font-semibold">₹{tenant.rentAmount?.toLocaleString() || 'N/A'}</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          tenant.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tenant.status || 'active'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-transparent transition-colors hover:border-transparent">
                            <Eye className="w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDeleteTenant(tenant)}
                            disabled={deletingTenantId === tenant._id}
                          >
                            {deletingTenantId === tenant._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTenants.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No tenants found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filter or add a new tenant</p>
                <Link href="/microestate/landlord/tenants/add">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-6 py-3">
                    Add Tenant
                  </Button>
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
} 