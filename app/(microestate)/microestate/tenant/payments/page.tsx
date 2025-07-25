"use client";

import React, { useState } from "react";
import { User, Home, Calendar, Phone, Mail, FileText, CheckCircle, AlertCircle, XCircle, CreditCard, QrCode, Download, BarChart3, Info, MessageCircle, HelpCircle, ToggleRight, ToggleLeft, ChevronDown, ChevronUp, PieChart } from "lucide-react";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Mock Data
const tenant = {
  name: "Priya Sharma",
  id: "TNT-1001",
  property: "Urban Loft Apartment, 123 Main Street, Cityville, 100001",
  leaseStart: "2024-01-01",
  leaseEnd: "2025-12-31",
  landlord: { name: "Amit Verma", phone: "+91 9876543211", email: "amit.verma@microestate.com" },
};
const paymentOverview = {
  rentAmount: 12000,
  dueDate: "5th of every month",
  status: "Paid", // "Pending", "Overdue"
  nextDueIn: 10,
  lastPayment: "2025-06-05",
  currentBalance: 0,
};
const paymentHistory = [
  { date: "2025-07-05", amount: 12000, status: "Paid", method: "UPI", receipt: true },
  { date: "2025-06-05", amount: 12000, status: "Paid", method: "Credit Card", receipt: true },
  { date: "2025-05-05", amount: 12000, status: "Missed", method: "-", receipt: false },
];
const months = ["August 2025", "July 2025", "June 2025"];
const paymentMethods = ["UPI", "Debit/Credit Card", "Net Banking"];

export default function TenantPaymentsPage() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [autoPay, setAutoPay] = useState(false);
  const [emailRem, setEmailRem] = useState(true);
  const [smsRem, setSmsRem] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Filtered payment history
  const filteredHistory = paymentHistory.filter(row =>
    row.date.includes(search) || String(row.amount).includes(search) || row.status.toLowerCase().includes(search.toLowerCase()) || row.method.toLowerCase().includes(search.toLowerCase())
  );

  // Donut chart data (mock)
  const paid = paymentHistory.filter(p => p.status === "Paid").length;
  const missed = paymentHistory.filter(p => p.status !== "Paid").length;
  const total = paymentHistory.length;
  const paidPercent = Math.round((paid / total) * 100);
  const missedPercent = 100 - paidPercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden mt-[72px]">
      <TenantNavbar />
      {/* Tenant Info Section */}
      <motion.div
        className="max-w-6xl mx-auto w-full mt-10 mb-6 px-6 py-6 rounded-2xl bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 shadow-xl flex flex-col md:flex-row gap-6 items-center md:items-start"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3 text-white text-2xl font-bold"><User className="w-7 h-7 text-orange-400" /> {tenant.name}</div>
          <div className="text-orange-400 text-xs font-semibold bg-orange-500/10 px-2 py-1 rounded w-fit">ID: {tenant.id}</div>
          <div className="flex items-center gap-2 text-gray-300 text-sm mt-2"><Home className="w-4 h-4 text-orange-400" /> {tenant.property}</div>
          <div className="flex items-center gap-2 text-gray-300 text-sm"><Calendar className="w-4 h-4 text-orange-400" /> Lease: {tenant.leaseStart} - {tenant.leaseEnd}</div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-sm"><Phone className="w-4 h-4" /> Contact Landlord</button>
      </motion.div>

      {/* Payment Overview */}
      <div className="max-w-6xl mx-auto w-full mb-8 px-2">
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div
            className="flex-1 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-2 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 text-lg font-bold text-white"><CreditCard className="w-6 h-6 text-orange-400" /> Rent Amount: <span className="text-orange-400">₹{paymentOverview.rentAmount}/month</span></div>
            <div className="text-gray-300 text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-400" /> Due Date: {paymentOverview.dueDate}</div>
            <div className="flex items-center gap-2 text-sm">
              Status:
              {paymentOverview.status === "Paid" && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span>}
              {paymentOverview.status === "Pending" && <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Pending</span>}
              {paymentOverview.status === "Overdue" && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><XCircle className="w-4 h-4" /> Overdue</span>}
            </div>
            <div className="text-sm text-gray-300">Next Payment Due In: <span className="text-orange-400 font-bold">{paymentOverview.nextDueIn} days</span></div>
            <div className="text-sm text-gray-300">Last Payment Date: <span className="text-orange-400 font-bold">{paymentOverview.lastPayment}</span></div>
            <div className="text-sm text-gray-300">Current Balance: <span className="text-orange-400 font-bold">₹{paymentOverview.currentBalance}</span></div>
            <button className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:from-orange-600 hover:to-red-600 transition-all text-lg"><QrCode className="w-5 h-5" /> Pay Rent Now</button>
          </motion.div>
          {/* Donut Chart */}
          <motion.div
            className="flex flex-col items-center justify-center bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 min-w-[220px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <PieChart className="w-8 h-8 text-orange-400 mb-2" />
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Donut chart mock */}
              <svg width="96" height="96" viewBox="0 0 36 36" className="rotate-[-90deg]">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#23232a" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#fb923c" strokeWidth="4" strokeDasharray={`${paidPercent},${missedPercent}`} strokeDashoffset="0" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">{paidPercent}%</span>
            </div>
            <div className="flex flex-col items-center mt-2 text-xs text-gray-300">
              <span><span className="text-green-400 font-bold">{paid}</span> Paid</span>
              <span><span className="text-red-400 font-bold">{missed}</span> Missed</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment History Table */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="text-lg font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-orange-400" /> Payment History</div>
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
            <Input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-xl bg-white/10 border border-orange-400/30 text-white placeholder:text-orange-200 shadow focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-orange-400 border-b border-orange-500/20">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Payment Method</th>
                <th className="py-2 px-2">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {(showAll ? filteredHistory : filteredHistory.slice(0, 5)).map((row, i) => (
                <tr key={i} className="border-b border-orange-500/10 text-white">
                  <td className="py-2 px-2">{row.date}</td>
                  <td className="py-2 px-2">₹{row.amount}</td>
                  <td className="py-2 px-2">
                    {row.status === "Paid" && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span>}
                    {row.status === "Missed" && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold flex items-center gap-1"><XCircle className="w-4 h-4" /> Missed</span>}
                  </td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    {row.method === "UPI" && <QrCode className="w-4 h-4 text-orange-400" />} 
                    {row.method === "Credit Card" && <CreditCard className="w-4 h-4 text-orange-400" />} 
                    {row.method === "-" && <span>-</span>}
                    <span>{row.method}</span>
                  </td>
                  <td className="py-2 px-2">
                    {row.receipt ? <button className="flex items-center gap-1 text-orange-400 hover:underline"><Download className="w-4 h-4" /> Download</button> : <span className="text-gray-500 flex items-center gap-1"><XCircle className="w-4 h-4" /> Not Available</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredHistory.length > 5 && (
          <button className="mt-4 flex items-center gap-1 text-orange-400 hover:underline" onClick={() => setShowAll(v => !v)}>
            {showAll ? <>Show Less <ChevronUp className="w-4 h-4" /></> : <>Show All <ChevronDown className="w-4 h-4" /></>}
          </button>
        )}
      </motion.div>

      {/* Make a Payment Section */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-lg font-bold text-white flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-orange-400" /> Make a Payment</div>
        <form onSubmit={e => { e.preventDefault(); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000); }} className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <label className="text-sm text-gray-300">Amount</label>
            <Input type="number" value={paymentOverview.rentAmount} readOnly className="mb-2" />
            <label className="text-sm text-gray-300">Payment for Month</label>
            <select className="mb-2 flex h-9 w-full rounded-xl border border-input bg-[#181c24] px-3 py-1 text-base text-white shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-400 md:text-sm appearance-none" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {months.map(m => <option key={m}>{m}</option>)}
            </select>
            <label className="text-sm text-gray-300">Payment Method</label>
            <select className="mb-2 flex h-9 w-full rounded-xl border border-input bg-[#181c24] px-3 py-1 text-base text-white shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-400 md:text-sm appearance-none" value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
              {paymentMethods.map(m => <option key={m}>{m}</option>)}
            </select>
            <label className="text-sm text-gray-300">Add Comment (optional)</label>
            <Input type="text" className="mb-2" value={comment} onChange={e => setComment(e.target.value)} placeholder="e.g., Paid early" />
            <button type="submit" className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:from-orange-600 hover:to-red-600 transition-all text-lg">Confirm & Pay</button>
            {showSuccess && <div className="mt-2 text-green-400 font-bold">Payment Successful!</div>}
          </div>
        </form>
      </motion.div>

      {/* Auto Pay & Reminders */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-4 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-lg font-bold text-white flex items-center gap-2"><ToggleRight className="w-5 h-5 text-orange-400" /> Auto Pay & Reminders</div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={autoPay} onChange={() => setAutoPay(v => !v)} className="accent-orange-500 w-5 h-5" />
              <span className="text-gray-300">Enable Auto-Pay (on 5th of every month)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={emailRem} onChange={() => setEmailRem(v => !v)} className="accent-orange-500 w-5 h-5" />
              <span className="text-gray-300">Email Reminder (3 days before due date)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={smsRem} onChange={() => setSmsRem(v => !v)} className="accent-orange-500 w-5 h-5" />
              <span className="text-gray-300">SMS Reminder (if number linked)</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Documents */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-8 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-4 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-lg font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-orange-400" /> Documents</div>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="flex-1 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"><Download className="w-5 h-5" /> Latest Rent Receipt</button>
          <button className="flex-1 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"><Download className="w-5 h-5" /> Rent Summary Report (6 months)</button>
          <button className="flex-1 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"><Download className="w-5 h-5" /> Annual Rent Statement (PDF)</button>
        </div>
      </motion.div>

    
      

      {/* FAQs */}
      <motion.div
        className="max-w-6xl mx-auto w-full mb-16 bg-white/5 border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 flex flex-col gap-4 px-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-lg font-bold text-white flex items-center gap-2"><Info className="w-5 h-5 text-orange-400" /> FAQs on Rent Payment</div>
        <ul className="text-gray-300 text-sm list-disc pl-6 mt-2 flex flex-col gap-2">
          <li>How do I pay my rent online?</li>
          <li>What payment methods are supported?</li>
          <li>How do I enable auto-pay?</li>
          <li>How do I download my rent receipts?</li>
          <li>Who do I contact for payment issues?</li>
        </ul>
      </motion.div>
      <TenantFooter />
    </div>
  );
} 