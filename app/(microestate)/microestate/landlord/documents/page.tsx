"use client";

import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, Edit, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Background from '../../../_components/Background';
import ProtectedRoute from '../../../_components/ProtectedRoute';

const initialDocs = [
  {
    id: 1,
    name: 'Rent Agreement.pdf',
    type: 'agreement',
    uploaded: '2024-06-01',
    expires: '2025-06-01',
  },
  {
    id: 2,
    name: 'Electricity Bill.pdf',
    type: 'utility',
    uploaded: '2024-06-10',
    expires: '',
  },
  {
    id: 3,
    name: 'Tax Papers.pdf',
    type: 'tax',
    uploaded: '2024-05-20',
    expires: '',
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocs);

  // Placeholder handlers
  const handleUpload = () => alert('Upload new document');
  const handleDownload = (doc: any) => alert('Download ' + doc.name);
  const handleReplace = (doc: any) => alert('Replace ' + doc.name);
  const handleDelete = (doc: any) => setDocuments(docs => docs.filter(d => d.id !== doc.id));

  return (
    <ProtectedRoute allowedRoles={['landlord']}>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <div className="container mx-auto py-10 mt-24 relative z-10">
          {/* Header */}
          <section className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
                <p className="text-gray-400">Upload and manage your legal documents</p>
              </div>
              <Button onClick={handleUpload} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </section>

          {/* Documents List */}
          <section className="bg-glass border border-orange-500/30 shadow-xl rounded-2xl p-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map(doc => (
                <div key={doc.id} className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8 text-orange-400" />
                    <div>
                      <div className="text-white font-semibold">{doc.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{doc.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <Calendar className="w-4 h-4" /> Uploaded: {doc.uploaded}
                    {doc.expires && <><span className="mx-2">|</span><Calendar className="w-4 h-4" /> Expires: {doc.expires}</>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={() => handleDownload(doc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" onClick={() => handleReplace(doc)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleDelete(doc)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {documents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No documents found</h3>
                <p className="text-gray-400 mb-6">Upload your first document</p>
                <Button onClick={handleUpload} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
} 