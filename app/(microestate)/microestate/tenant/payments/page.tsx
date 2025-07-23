"use client";
import React, { useState } from "react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import StatusBadge from "../components/StatusBadge";
import { Eye, Download, Calendar, CreditCard, FileDown, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import Background from "../../../_components/Background";

const mockPayments = [
  { date: "2025-07-01", amount: 18000, method: "UPI", status: "Paid", receipt: true },
  { date: "2025-06-01", amount: 18000, method: "Card", status: "Paid", receipt: true },
  { date: "2025-05-01", amount: 18000, method: "UPI", status: "Pending", receipt: false },
  { date: "2025-04-01", amount: 18000, method: "Bank", status: "Paid", receipt: true },
  { date: "2025-03-01", amount: 18000, method: "Cash", status: "Paid", receipt: true },
  { date: "2025-02-01", amount: 18000, method: "UPI", status: "Paid", receipt: true },
  { date: "2025-01-01", amount: 18000, method: "UPI", status: "Paid", receipt: true },
];
const paymentTrends = [18000, 18000, 18000, 18000, 18000, 18000];
const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export default function TenantPayments() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filteredPayments = filter
    ? mockPayments.filter((p) => p.date.includes(filter))
    : mockPayments;
  const paginated = filteredPayments.slice((page - 1) * pageSize, page * pageSize);

  const handleDownload = (date: string) => {
    toast.success(`Receipt for ${date} downloaded!`);
  };
  const handleView = (date: string) => {
    toast.info(`Viewing receipt for ${date} (mock)`);
  };
  const handleDownloadAll = () => {
    toast.success("All receipts downloaded as ZIP!");
  };

  // Summary values
  const totalPaid = mockPayments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const currentDue = mockPayments.find(p => p.status === "Pending")?.amount || 0;
  const lastPayment = mockPayments.find(p => p.status === "Paid")?.date || "-";
  const nextDue = "2025-08-01";
  const rentCycle = "1st of every month";
  const autopayEnabled = false;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <Background />
      <TenantNavbar />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-8 flex flex-col gap-8">
        <div className="mb-4">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent drop-shadow-lg">Payments</h2>
          <p className="text-lg text-gray-300 mt-2 font-medium">Manage your rent payments, view receipts, and track your payment history.</p>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-glass border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 flex flex-col items-center shadow-2xl hover:shadow-orange-500/40 transition relative">
            <CreditCard className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-orange-400 bg-black rounded-full p-2 shadow-lg" />
            <span className="text-gray-400 text-xs mt-6">Total Paid</span>
            <span className="text-2xl font-bold text-green-400">₹{totalPaid.toLocaleString()}</span>
          </div>
          <div className="bg-glass border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 flex flex-col items-center shadow-2xl hover:shadow-orange-500/40 transition relative">
            <TrendingUp className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-orange-400 bg-black rounded-full p-2 shadow-lg" />
            <span className="text-gray-400 text-xs mt-6">Current Due</span>
            <span className="text-2xl font-bold text-orange-400">₹{currentDue.toLocaleString()}</span>
          </div>
          <div className="bg-glass border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 flex flex-col items-center shadow-2xl hover:shadow-orange-500/40 transition relative">
            <Calendar className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-orange-400 bg-black rounded-full p-2 shadow-lg" />
            <span className="text-gray-400 text-xs mt-6">Last Payment</span>
            <span className="text-2xl font-bold text-white">{lastPayment}</span>
          </div>
          <div className="bg-glass border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 flex flex-col items-center shadow-2xl hover:shadow-orange-500/40 transition relative">
            <Zap className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 text-orange-400 bg-black rounded-full p-2 shadow-lg" />
            <span className="text-gray-400 text-xs mt-6">Next Due</span>
            <span className="text-2xl font-bold text-orange-300">{nextDue}</span>
          </div>
        </div>
        {/* Rent Cycle */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-xl p-4 flex items-center gap-2 shadow mb-4">
          <Calendar className="w-5 h-5 text-orange-400" />
          <span className="text-white font-semibold">Rent Cycle:</span>
          <span className="text-orange-400 font-bold ml-2">{rentCycle}</span>
        </div>
        {/* Payment Trends Chart (Mock) */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-xl p-4 shadow flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <span className="text-white font-semibold">Payment Trends (Last 6 Months)</span>
          </div>
          {/* Replace with Chart.js or recharts for real chart */}
          <div className="flex items-end gap-2 h-24">
            {paymentTrends.map((amt, i) => (
              <div key={i} className="flex flex-col items-center w-8">
                <div className="bg-orange-400/80 rounded-t-lg" style={{ height: `${amt / 400}px`, minHeight: '10px', width: '100%' }} />
                <span className="text-xs text-gray-400 mt-1">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Autopay Status */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-xl p-4 flex items-center gap-4 shadow mb-4">
          <Zap className="w-5 h-5 text-orange-400" />
          <span className="text-white font-semibold">Autopay:</span>
          <span className={`font-bold px-2 py-1 rounded ${autopayEnabled ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>{autopayEnabled ? "Enabled" : "Not Enabled"}</span>
          {!autopayEnabled && <button className="ml-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 rounded-lg transition" onClick={() => toast.info("Autopay activation requested!")}>Request Autopay</button>}
        </div>
        {/* Download Receipts Panel */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow mb-4">
          <div className="flex-1 flex gap-2 items-center">
            <CreditCard className="w-5 h-5 text-orange-400" />
            <span className="text-white font-semibold">Download Receipts:</span>
            <input type="month" className="bg-[#23232a] text-white border border-orange-500/20 rounded px-2 py-1 ml-2" />
            <input type="month" className="bg-[#23232a] text-white border border-orange-500/20 rounded px-2 py-1" />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition" onClick={handleDownloadAll}><FileDown className="w-4 h-4 inline mr-1" />Download All</button>
        </div>
        {/* Payment Table */}
        <div className="bg-[#181c24] border border-orange-500/20 rounded-xl shadow-lg overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 gap-2">
            <span className="text-lg font-bold text-white">Payment History</span>
            <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by date (YYYY-MM)"
              value={filter}
              onChange={e => setFilter(e.target.value)}
                className="p-2 rounded-lg bg-[#23232a] text-white border border-orange-500/20 w-full sm:w-64 shadow focus:ring-2 focus:ring-orange-400"
            />
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-4 py-2 rounded-lg shadow hover:shadow-orange-500/40 transition flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                More Filters
              </button>
            </div>
          </div>
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-orange-500/10">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Method</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-4">No payments found.</td></tr>
              ) : paginated.map((p, idx) => (
                <tr key={idx} className="border-b border-orange-500/5 hover:bg-orange-500/5 transition">
                  <td className="py-2 px-2 text-white">{p.date}</td>
                  <td className="py-2 px-2 text-white">₹{p.amount}</td>
                  <td className="py-2 px-2 text-white">{p.method}</td>
                  <td className="py-2 px-2"><StatusBadge status={p.status} /></td>
                  <td className="py-2 px-2">
                    {p.receipt ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(p.date)}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 btn-glow shadow-lg"
                          title="View Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(p.date)}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 btn-glow shadow-lg"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ) : <span className="text-gray-500">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 px-4 py-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-[#23232a] text-white/80 border border-orange-500/20 disabled:opacity-50">Prev</button>
            <span className="text-white">Page {page}</span>
            <button disabled={page * pageSize >= filteredPayments.length} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-[#23232a] text-white/80 border border-orange-500/20 disabled:opacity-50">Next</button>
          </div>
        </div>
      </main>
      <TenantFooter />
    </div>
  );
} 