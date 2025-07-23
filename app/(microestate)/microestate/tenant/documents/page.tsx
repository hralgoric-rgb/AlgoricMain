"use client";
import React, { useState } from "react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import FileCard from "../components/FileCard";
import { FileText, FileDown, Eye, UploadCloud, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import Background from "../../../_components/Background";

const mockDocuments = [
  { name: "Rent Agreement.pdf", type: "Agreement", uploaded: "2024-01-01", uploadedBy: "Landlord", size: "1.2MB", expires: "2025-12-31", signed: true },
  { name: "Electricity Bill July.pdf", type: "Bills", uploaded: "2025-07-05", uploadedBy: "Tenant", size: "350KB", expires: null, signed: false },
  { name: "Notice - Maintenance.pdf", type: "Notices", uploaded: "2025-06-20", uploadedBy: "Landlord", size: "220KB", expires: null, signed: false },
  { name: "ID Proof.pdf", type: "ID", uploaded: "2025-07-10", uploadedBy: "Tenant", size: "500KB", expires: "2026-07-10", signed: true },
];
const categories = ["All", "Agreement", "Bills", "Notices", "ID"];

export default function TenantDocuments() {
  const [tab, setTab] = useState("All");
  const [preview, setPreview] = useState<null | any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredDocs = mockDocuments.filter(doc =>
    (tab === "All" || doc.type === tab) &&
    (doc.name.toLowerCase().includes(search.toLowerCase()) || doc.type.toLowerCase().includes(search.toLowerCase()) || (doc.uploaded && doc.uploaded.includes(search)))
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success("Document uploaded successfully!");
    }, 1200);
  };

  const isExpiringSoon = (expires: string | null) => {
    if (!expires) return false;
    const exp = new Date(expires);
    const now = new Date();
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 30;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <TenantNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent">Documents</h2>
        <p className="text-gray-400 text-lg mb-10">Upload and manage your legal documents</p>
        <div className="flex justify-end mb-8">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Upload Document
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </button>
        </div>
        {/* Search/Filter */}
        <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by name, type, or date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 rounded bg-[#23232a] text-white border border-orange-500/20 w-full md:w-64"
          />
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setTab(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${tab === cat ? "bg-orange-500 text-white shadow-lg scale-105" : "bg-[#23232a] text-gray-300 hover:bg-orange-500/20"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.length === 0 ? (
              <div className="text-gray-400 col-span-full">No documents found.</div>
            ) : filteredDocs.map((doc, idx) => {
              let icon = <FileText className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500" />;
              if (doc.type === 'Agreement') icon = <FileText className="w-8 h-8 text-orange-500 bg-clip-text" />;
              else if (doc.type === 'Bills') icon = <FileDown className="w-8 h-8 text-yellow-400 bg-clip-text" />;
              else if (doc.type === 'Notices') icon = <AlertTriangle className="w-8 h-8 text-red-400 bg-clip-text" />;
              else if (doc.type === 'ID') icon = <CheckCircle className="w-8 h-8 text-green-400 bg-clip-text" />;
              return (
                <div key={idx} className="bg-[#1a1a1f] border border-[#2a2a2f] rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    {icon}
                    <div>
                      <div className="text-white font-semibold">{doc.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{doc.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Uploaded: {doc.uploaded}</span>
                    {doc.expires && <><span className="mx-2">|</span><Calendar className="w-4 h-4" /> Expires: {doc.expires}</>}
                    </div>
                    <div className="flex gap-2 mt-2">
                    <button className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white border-2 rounded-lg p-2 transition" onClick={() => toast.success(`Downloaded ${doc.name}`)}><FileDown className="w-4 h-4" /></button>
                    <button className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white border-2 rounded-lg p-2 transition"><Eye className="w-4 h-4" /></button>
                    <button className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white border-2 rounded-lg p-2 transition"><AlertTriangle className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Preview Modal */}
        <AnimatePresence>
          {preview && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreview(null)} />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative z-10 bg-[#181c24] border border-orange-500/30 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto"
              >
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-400" /> {preview.name}</h3>
                <div className="text-gray-300 mb-2">Uploaded: {preview.uploaded} by {preview.uploadedBy}</div>
                <div className="text-gray-300 mb-2">Size: {preview.size}</div>
                <div className="text-gray-300 mb-2">{preview.expires ? `Expires: ${preview.expires}` : "No Expiry"}</div>
                <div className="text-gray-300 mb-2">Signed: {preview.signed ? "Yes" : "No"}</div>
                <button
                  onClick={() => setPreview(null)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
                >Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <TenantFooter />
    </div>
  );
} 