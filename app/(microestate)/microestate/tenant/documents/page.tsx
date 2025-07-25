"use client";

import React, { useState } from "react";
import { FileText, Download, Search, Filter, Calendar, ChevronDown, ChevronUp, Grid, List, BadgeCheck, AlertTriangle, Info, UploadCloud, Eye, XCircle, CheckCircle } from "lucide-react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Mock Data
const leaseAgreement = {
  start: "2024-01-01",
  end: "2025-12-31",
  type: "Residential",
  status: "Active",
  file: "Lease_Agreement_2024-25.pdf",
};
const documents = [
  { name: "March 2025 Rent Receipt", type: "Rent Receipt", date: "2025-03-05", size: "210 KB", tag: "Rent", file: "March_2025_Receipt.pdf" },
  { name: "Lease Agreement (2024-25)", type: "Lease Agreement", date: "2024-01-01", size: "1.2 MB", tag: "Lease", file: "Lease_Agreement_2024-25.pdf" },
  { name: "Plumbing Repair Bill", type: "Maintenance Bill", date: "2025-04-15", size: "90 KB", tag: "Maintenance", file: "Plumbing_Repair_Bill.pdf" },
  { name: "Tax Statement FY 2024-25", type: "Tax Document", date: "2025-04-01", size: "300 KB", tag: "Tax", file: "Tax_Statement_2024-25.pdf" },
  { name: "Eviction Notice (if any)", type: "Notice", date: "2025-07-01", size: "120 KB", tag: "Notice", file: "Eviction_Notice.pdf" },
];
const receiptsArchive = {
  2025: [
    { month: "July 2025", file: "July_2025_Receipt.pdf" },
    { month: "June 2025", file: "June_2025_Receipt.pdf" },
    { month: "May 2025", file: "May_2025_Receipt.pdf" },
  ],
  2024: [
    { month: "Dec 2024", file: "Dec_2024_Receipt.pdf" },
  ],
};
const maintenanceBills = [
  { name: "Pest Control Service", cost: 500, date: "2025-05-10", notes: "Shared as part of quarterly maintenance", file: "Pest_Control_Invoice.pdf" },
];
const adminNotes = [
  "Lease renewed successfully.",
  "New maintenance policy effective from August.",
];
const notifications = [
  { type: "warning", message: "Your lease agreement is expiring in 30 days. Please renew or contact your landlord." },
  { type: "success", message: "Your March 2025 rent receipt is now available." },
];
const taxSummary = { year: "2024-2025", amount: 144000, file: "Tax_Summary_2024-25.pdf" };

const docTypes = ["All", "Rent Receipt", "Lease Agreement", "Maintenance Bill", "Notice", "Tax Document"];
const sortOptions = ["Date", "Name", "Type"];

export default function TenantDocumentsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Date");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [view, setView] = useState("table");
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [expandedYears, setExpandedYears] = useState<{ [year: string]: boolean }>({});
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadTag, setUploadTag] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  // Filtered documents
  const filteredDocs = documents.filter(doc =>
    (type === "All" || doc.type === type) &&
    (search === "" || doc.name.toLowerCase().includes(search.toLowerCase()) || doc.type.toLowerCase().includes(search.toLowerCase())) &&
    (!fromDate || new Date(doc.date) >= new Date(fromDate)) &&
    (!toDate || new Date(doc.date) <= new Date(toDate))
  ).sort((a, b) => {
    if (sort === "Date") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === "Name") return a.name.localeCompare(b.name);
    if (sort === "Type") return a.type.localeCompare(b.type);
    return 0;
  });

  // Tag color map
  const tagColor = {
    "Rent": "bg-blue-500",
    "Lease": "bg-green-500",
    "Maintenance": "bg-yellow-500",
    "Tax": "bg-purple-500",
    "Notice": "bg-red-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden">
      <TenantNavbar />
      {/* Notifications/Alerts */}
      <div className="max-w-4xl mx-auto w-full mt-6">
        {showAlert && notifications.map((n, i) => (
          <div key={i} className={`flex items-center gap-2 px-4 py-3 mb-2 rounded-lg text-white shadow-lg ${n.type === "warning" ? "bg-yellow-700/80" : "bg-green-700/80"}`}>
            {n.type === "warning" ? <AlertTriangle className="w-5 h-5 text-yellow-300" /> : <CheckCircle className="w-5 h-5 text-green-300" />}
            <span>{n.message}</span>
            <button className="ml-auto" onClick={() => setShowAlert(false)}><XCircle className="w-5 h-5 text-white/60 hover:text-white" /></button>
          </div>
        ))}
      </div>
      {/* Sticky Search/Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-[#181c24] border-b border-[#23232a] shadow-lg w-full py-4 px-2 md:px-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 md:gap-6 items-center">
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-orange-400" />
            <Input placeholder="Search... (e.g., 'receipt', 'maintenance')" value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-400" />
            <select className="rounded-md border border-input bg-transparent px-2 py-1 text-sm text-white" value={type} onChange={e => setType(e.target.value)}>
              {docTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-28" />
            <span className="text-white/60">→</span>
            <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-28" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Sort by</span>
            <select className="rounded-md border border-input bg-transparent px-2 py-1 text-sm text-white" value={sort} onChange={e => setSort(e.target.value)}>
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-full ${view === "table" ? "bg-orange-500/20" : "bg-transparent"}`} onClick={() => setView("table")}> <List className="w-5 h-5 text-orange-400" /> </button>
            <button className={`p-2 rounded-full ${view === "grid" ? "bg-orange-500/20" : "bg-transparent"}`} onClick={() => setView("grid")}> <Grid className="w-5 h-5 text-orange-400" /> </button>
          </div>
        </div>
      </div>
      {/* Lease Agreement Highlight Card */}
      <motion.div
        className="max-w-6xl mx-auto w-full mt-8 mb-6 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-gradient-to-r from-green-700/80 to-green-900/80 border-2 border-green-500 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6 items-center md:items-start sticky top-[120px] z-30 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(34,197,94,0.35)] hover:border-green-400">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-3 text-white text-2xl font-bold"><BadgeCheck className="w-7 h-7 text-green-400" /> Lease Agreement</div>
            <div className="text-green-300 text-xs font-semibold bg-green-500/10 px-2 py-1 rounded w-fit">{leaseAgreement.type} • {leaseAgreement.status}</div>
            <div className="flex items-center gap-2 text-gray-200 text-sm mt-2"><Calendar className="w-4 h-4 text-green-400" /> Lease: {leaseAgreement.start} - {leaseAgreement.end}</div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-800 transition-all text-sm" onClick={() => setShowLeaseModal(true)}><Eye className="w-4 h-4" /> View Full Agreement</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-sm"><Download className="w-4 h-4" /> Download Lease PDF</button>
          </div>
        </div>
      </motion.div>
      {/* Lease Modal */}
      {showLeaseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#181c24] rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">
            <button className="absolute top-4 right-4" onClick={() => setShowLeaseModal(false)}><XCircle className="w-6 h-6 text-white/70 hover:text-white" /></button>
            <div className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-green-400" /> Lease Agreement Preview</div>
            <div className="bg-black/40 rounded-lg p-4 text-white text-sm">[PDF Preview Placeholder]</div>
          </div>
        </div>
      )}
      {/* Document List Table/Grid */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {view === "table" ? (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-orange-400 border-b border-orange-500/20">
                  <th className="py-2 px-2">Document Name</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Date Uploaded</th>
                  <th className="py-2 px-2">Size</th>
                  <th className="py-2 px-2">Tag</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc, i) => (
                  <tr key={i} className="border-b border-orange-500/10 text-white">
                    <td className="py-2 px-2 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" /> {doc.name}</td>
                    <td className="py-2 px-2">{doc.type}</td>
                    <td className="py-2 px-2">{doc.date}</td>
                    <td className="py-2 px-2">{doc.size}</td>
                    <td className="py-2 px-2"><span className={`px-2 py-1 rounded text-xs text-white ${tagColor[doc.tag]}`}>{doc.tag}</span></td>
                    <td className="py-2 px-2 flex gap-2">
                      <button className="flex items-center gap-1 text-orange-400 hover:underline"><Download className="w-4 h-4" /> Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc, i) => (
              <div key={i} className="bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-4 flex flex-col gap-2 text-white">
                <div className="flex items-center gap-2 text-lg font-bold"><FileText className="w-5 h-5 text-orange-400" /> {doc.name}</div>
                <div className="flex items-center gap-2 text-xs"><span className={`px-2 py-1 rounded text-xs text-white ${tagColor[doc.tag]}`}>{doc.tag}</span> <span className="text-orange-300">{doc.type}</span></div>
                <div className="text-xs text-gray-300">Uploaded: {doc.date}</div>
                <div className="text-xs text-gray-300">Size: {doc.size}</div>
                <div className="flex gap-2 mt-2">
                  <button className="flex items-center gap-1 text-orange-400 hover:underline"><Download className="w-4 h-4" /> Download</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      {/* Bulk Download Option */}
      <div className="max-w-6xl mx-auto w-full mb-8 px-2 flex gap-2 items-center">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-sm disabled:opacity-50" disabled={selectedFiles.length === 0}><Download className="w-4 h-4" /> Bulk Download</button>
        <span className="text-xs text-gray-400">(Select files to enable bulk download)</span>
      </div>
      {/* Rent Receipts Archive (Accordion/List) */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-white/5 border-2 border-gradient-to-r from-blue-500 to-blue-700 rounded-2xl shadow-xl p-6">
          <div className="text-lg font-bold text-white flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-blue-400" /> Rent Receipts Archive</div>
          {Object.keys(receiptsArchive).sort((a, b) => Number(b) - Number(a)).map(year => (
            <div key={year} className="mb-2">
              <button className="flex items-center gap-2 text-white font-semibold text-base" onClick={() => setExpandedYears(y => ({ ...y, [year]: !y[year] }))}>
                {expandedYears[year] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />} {year}
              </button>
              {expandedYears[year] && (
                <div className="ml-8 mt-2 flex flex-col gap-2">
                  {receiptsArchive[year].map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/90">
                      <span>{r.month}</span>
                      <button className="flex items-center gap-1 text-orange-400 hover:underline"><Download className="w-4 h-4" /> Download</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      {/* Maintenance Bills & Work Orders */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-white/5 border-2 border-gradient-to-r from-yellow-500 to-yellow-700 rounded-2xl shadow-xl p-6">
          <div className="text-lg font-bold text-white flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-yellow-400" /> Maintenance Bills & Work Orders</div>
          {maintenanceBills.map((m, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mb-2 bg-yellow-500/10 rounded-lg p-3">
              <div className="flex-1">
                <div className="font-semibold text-yellow-300">{m.name}</div>
                <div className="text-xs text-gray-300">Cost: ₹{m.cost} | Date: {m.date}</div>
                <div className="text-xs text-gray-400">{m.notes}</div>
              </div>
              <button className="flex items-center gap-1 text-yellow-500 hover:underline"><Download className="w-4 h-4" /> Download Invoice</button>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Upload Section */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400">
          <div className="text-lg font-bold text-white flex items-center gap-2 mb-2"><UploadCloud className="w-5 h-5 text-orange-400" /> Upload Your Own Documents</div>
          <form className="flex flex-col md:flex-row gap-4 items-center">
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="text-white" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
            <Input type="text" placeholder="Description (optional)" value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} className="w-48" />
            <Input type="text" placeholder="Tag (e.g., 'ID Proof')" value={uploadTag} onChange={e => setUploadTag(e.target.value)} className="w-32" />
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-sm" type="submit">Upload</button>
          </form>
          <div className="text-xs text-gray-400">Limit: Max 5MB, PDF/JPG/PNG</div>
        </div>
      </motion.div>
      {/* Yearly Tax Statement Summary */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-white/5 border-2 border-gradient-to-r from-purple-500 to-purple-700 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="text-lg font-bold text-white flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-purple-400" /> Yearly Tax Statement Summary</div>
            <div className="text-white/80 text-sm mb-1">FY {taxSummary.year} Rent Paid: <span className="text-purple-300 font-bold">₹{taxSummary.amount.toLocaleString()}</span></div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition-all text-sm"><Download className="w-4 h-4" /> Download Statement</button>
        </div>
      </motion.div>
      {/* Admin Notes */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-16 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="bg-white/5 border-2 border-gradient-to-r from-gray-500 to-gray-700 rounded-2xl shadow-xl p-6">
          <div className="text-lg font-bold text-white flex items-center gap-2 mb-2"><Info className="w-5 h-5 text-gray-300" /> Admin Notes</div>
          <ul className="text-gray-300 text-sm list-disc pl-6 mt-2 flex flex-col gap-2">
            {adminNotes.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
        </div>
      </motion.div>
      <TenantFooter />
    </div>
  );
} 