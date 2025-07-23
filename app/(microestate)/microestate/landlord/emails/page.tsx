"use client";

import React, { useState } from 'react';
import { Mail, Eye, Filter, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Background from '../../../_components/Background';
import ProtectedRoute from '../../../_components/ProtectedRoute';

const emailsData = [
  {
    id: 1,
    subject: 'Rent Payment Reminder',
    recipient: 'Priya Sharma',
    recipientEmail: 'priya@example.com',
    status: 'sent',
    date: '2024-07-01',
    body: 'Dear Priya,\nThis is a reminder that your rent is due on 5th July. Please ensure timely payment. Regards, Landlord.'
  },
  {
    id: 2,
    subject: 'Maintenance Update',
    recipient: 'Rahul Verma',
    recipientEmail: 'rahul@example.com',
    status: 'delivered',
    date: '2024-06-28',
    body: 'Hi Rahul,\nThe maintenance request for AC has been resolved. Let us know if you need further assistance.'
  },
  {
    id: 3,
    subject: 'Lease Renewal Notice',
    recipient: 'Sia Mehta',
    recipientEmail: 'sia@example.com',
    status: 'failed',
    date: '2024-06-20',
    body: 'Dear Sia,\nYour lease is due for renewal next month. Please contact us to discuss terms.'
  }
];

export default function EmailsPage() {
  const [tenantFilter, setTenantFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const tenants = [
    { id: 1, name: 'Priya Sharma' },
    { id: 2, name: 'Rahul Verma' },
    { id: 3, name: 'Sia Mehta' }
  ];

  const filteredEmails = emailsData.filter(email => {
    const matchesTenant = tenantFilter === 'all' || email.recipient === tenantFilter;
    const matchesDate = !dateFilter || email.date === dateFilter;
    return matchesTenant && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Sent</span>;
      case 'delivered':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Delivered</span>;
      case 'failed':
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">Failed</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <div className="container mx-auto py-10 mt-24 relative z-10">
          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Emails</h1>
                <p className="text-gray-400">History of automated and manual emails sent to tenants</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center mb-6">
              <Filter className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />
              <select
                value={tenantFilter}
                onChange={e => setTenantFilter(e.target.value)}
                className="px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-transparent transition-colors"
              >
                <option value="all">All Tenants</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="px-4 py-3 bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl text-white focus:outline-none focus:border-transparent transition-colors"
              />
            </div>
          </section>

          {/* Emails Table */}
          <section className="bg-glass border border-transparent rounded-2xl p-6 animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2a2a2f]">
                    <th className="pb-4 text-gray-400 font-semibold">Subject</th>
                    <th className="pb-4 text-gray-400 font-semibold">Recipient</th>
                    <th className="pb-4 text-gray-400 font-semibold">Status</th>
                    <th className="pb-4 text-gray-400 font-semibold">Date</th>
                    <th className="pb-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {filteredEmails.map((email) => (
                    <React.Fragment key={email.id}>
                      <tr className="border-b border-[#2a2a2f] hover:bg-[#1a1a1f] transition-colors">
                        <td className="py-4 font-semibold">{email.subject}</td>
                        <td className="py-4 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{email.recipient}</span>
                        </td>
                        <td className="py-4">{getStatusBadge(email.status)}</td>
                        <td className="py-4">{email.date}</td>
                        <td className="py-4">
                          <Button size="sm" variant="outline" className="border-transparent text-transparent hover:bg-transparent hover:text-transparent"
                            onClick={() => setExpanded(expanded === email.id ? null : email.id)}
                          >
                            {expanded === email.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            Preview
                          </Button>
                        </td>
                      </tr>
                      {expanded === email.id && (
                        <tr>
                          <td colSpan={5} className="bg-[#1a1a1f] p-6 text-gray-300 text-sm border-b border-[#2a2a2f]">
                            <div className="mb-2 font-semibold text-white">To: {email.recipient} ({email.recipientEmail})</div>
                            <pre className="whitespace-pre-wrap text-gray-300">{email.body}</pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmails.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No emails found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
} 