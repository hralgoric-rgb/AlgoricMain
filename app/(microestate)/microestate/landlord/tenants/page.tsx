"use client";

import React, { useState } from 'react';
import { User, Home, Mail, Phone, Eye, Trash2, MessageCircle, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Background from '../../../_components/Background';
import ProtectedRoute from '../../../_components/ProtectedRoute';

export default function TenantsPage() {
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [tenants] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      property: 'Urban Loft',
      propertyId: 1,
      avatar: '',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '+91 91234 56789',
      property: 'Family Home',
      propertyId: 2,
      avatar: '',
    },
    {
      id: 3,
      name: 'Sia Mehta',
      email: 'sia@example.com',
      phone: '+91 99887 66554',
      property: 'Urban Loft',
      propertyId: 1,
      avatar: '',
    }
  ]);
  const properties = [
    { id: 1, name: 'Urban Loft' },
    { id: 2, name: 'Family Home' }
  ];

  const filteredTenants = propertyFilter === 'all'
    ? tenants
    : tenants.filter(t => t.propertyId === Number(propertyFilter));

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
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
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Tenants Table */}
          <section className="bg-glass border border-transparent transition-colors hover:border-transparent">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2f]">
                    <th className="pb-4 text-gray-400 font-semibold">Tenant</th>
                    <th className="pb-4 text-gray-400 font-semibold">Contact</th>
                    <th className="pb-4 text-gray-400 font-semibold">Property</th>
                    <th className="pb-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-[#2a2a2f] hover:bg-[#1a1a1f] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            {tenant.avatar ? (
                              <img src={tenant.avatar} alt={tenant.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <span className="text-white font-bold text-xl select-none">
                                {tenant.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{tenant.name}</div>
                            <div className="text-sm text-gray-400">ID: {tenant.id}</div>
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
                          <span className="text-sm">{tenant.property}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-transparent transition-colors hover:border-transparent">
                            <Eye className="w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            <Trash2 className="w-4 h-4" />
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
        </div>
      </div>
    </ProtectedRoute>
  );
} 