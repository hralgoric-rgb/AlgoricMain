"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TenantNavbar from "../components/TenantNavbar";
import TenantFooter from "../components/TenantFooter";
import ProgressBar from "../components/ProgressBar";
import Timeline from "../components/Timeline";
import Background from "../../../_components/Background";
import { FileText, CreditCard, User, QrCode, Bell, Phone, Calendar, FileDown, Eye, Download, BadgeCheck, AlertCircle, MessageCircle, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from '../../../_components/ProtectedRoute';

// Modal component
function Modal({ open, onClose, children, slideFrom = "center" }: { open: boolean, onClose: () => void, children: React.ReactNode, slideFrom?: "center" | "bottom" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={slideFrom === "bottom" ? { y: 100, opacity: 0 } : { scale: 0.95, opacity: 0 }}
            animate={slideFrom === "bottom" ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={slideFrom === "bottom" ? { y: 100, opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 bg-[#181c24] border border-orange-500/30 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mock data
const leaseSummary = {
  start: "2024-01-01",
  end: "2025-12-31",
  noticePeriod: "2 months",
  terms: "No subletting. Rent due 1st of each month. No pets allowed.",
};
const paymentHistory = [
  { month: "July 2025", amount: 18000, status: "Paid", date: "2025-07-01", invoice: true },
  { month: "June 2025", amount: 18000, status: "Paid", date: "2025-06-01", invoice: true },
  { month: "May 2025", amount: 18000, status: "Pending", date: "2025-05-01", invoice: false },
];
const outstandingDues = [
  { type: "Maintenance", amount: 1200, dueDate: "2025-07-15" },
];
const tickets = [
  { id: 1, subject: "Leaky faucet", status: "Open", created: "2025-07-10 09:30" },
  { id: 2, subject: "AC not cooling", status: "Closed", created: "2025-06-20 14:00" },
];
const moveOut = { noticeGiven: true, moveOutDate: "2025-08-31" };
const landlord = { name: "Amit Verma", phone: "+91 9876543211", visiting: "Mon-Fri 10am-6pm" };
const notifications = [
  { id: 1, message: "Rent due in 3 days!", type: "alert", date: "2025-07-28" },
  { id: 2, message: "Maintenance scheduled for 15th July.", type: "info", date: "2025-07-10" },
];
const activityLog = [
  { action: "Viewed Rent Agreement", date: "2025-07-12 18:00" },
  { action: "Paid June Rent", date: "2025-06-01 10:15" },
  { action: "Submitted maintenance ticket", date: "2025-06-20 14:01" },
];

// Add more mock data for expanded sections
const expandedPaymentHistory = [
  { month: "July 2025", amount: 18000, status: "Paid", date: "2025-07-01", invoice: true },
  { month: "June 2025", amount: 18000, status: "Paid", date: "2025-06-01", invoice: true },
  { month: "May 2025", amount: 18000, status: "Paid", date: "2025-05-01", invoice: true },
  { month: "April 2025", amount: 18000, status: "Paid", date: "2025-04-01", invoice: true },
  { month: "March 2025", amount: 18000, status: "Paid", date: "2025-03-01", invoice: true },
  { month: "Feb 2025", amount: 18000, status: "Paid", date: "2025-02-01", invoice: true },
  { month: "Jan 2025", amount: 18000, status: "Paid", date: "2025-01-01", invoice: true },
];
const expandedOutstandingDues = [
  { type: "Maintenance", amount: 1200, dueDate: "2025-07-15" },
  { type: "Club Fee", amount: 500, dueDate: "2025-07-20" },
];
const expandedTickets = [
  { id: 1, subject: "Leaky faucet", status: "Open", created: "2025-07-10 09:30" },
  { id: 2, subject: "AC not cooling", status: "Closed", created: "2025-06-20 14:00" },
  { id: 3, subject: "Broken window", status: "Open", created: "2025-07-15 11:00" },
];
const expandedNotifications = [
  { id: 1, message: "Rent due in 3 days!", type: "alert", date: "2025-07-28" },
  { id: 2, message: "Maintenance scheduled for 15th July.", type: "info", date: "2025-07-10" },
  { id: 3, message: "New document uploaded.", type: "info", date: "2025-07-05" },
];
const expandedActivityLog = [
  { action: "Viewed Rent Agreement", date: "2025-07-12 18:00" },
  { action: "Paid June Rent", date: "2025-06-01 10:15" },
  { action: "Submitted maintenance ticket", date: "2025-06-20 14:01" },
  { action: "Downloaded Invoice", date: "2025-06-01 10:16" },
];
const landlordCard = { name: "Amit Verma", phone: "+91 9876543211", visiting: "Mon-Fri 10am-6pm" };

function Skeleton({ className = "h-6 w-full rounded bg-gray-700 animate-pulse" }) {
  return <div className={className}></div>;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      type: "spring",
      stiffness: 60,
    },
  }),
};

// Add this utility class for card hover effect
const cardClass = "bg-glass border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-orange-400 hover:shadow-orange-400/30 focus-within:border-orange-400 focus-within:shadow-orange-400/30 backdrop-blur-xl";

export default function TenantDashboard() {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "profile" | "receipt" | "confirm">(null);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Download invoice handler
  const handleDownload = (month: string) => {
    toast.success(`Invoice for ${month} downloaded!`);
  };

  // Move-out countdown
  const daysLeft = moveOut.noticeGiven ? Math.max(0, Math.ceil((new Date(moveOut.moveOutDate).getTime() - Date.now()) / (1000*60*60*24))) : null;

  // Handlers for modals
  const openProfileModal = () => setModal("profile");
  const openReceiptModal = (data: any) => { setModalData(data); setModal("receipt"); };
  const openConfirmModal = (data: any) => { setModalData(data); setModal("confirm"); };
  const closeModal = () => { setModal(null); setModalData(null); };

  return (
    <ProtectedRoute allowedRoles={['tenant']} redirectTo="/microestate/auth">
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <TenantNavbar />
        <main className="flex-1 container mx-auto px-4 py-12 md:py-16 mx-4 md:mx-12">
          <h1 className="text-5xl font-extrabold mb-10 bg-gradient-to-r from-orange-500 via-white to-orange-400 bg-clip-text text-transparent">Dashboard</h1>
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{}}
              className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16"
            >
              {/* Main Left Column */}
              <div className="md:col-span-2 flex flex-col gap-10">
                {/* Lease Summary */}
                <motion.section
                  custom={1}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-400" /> Lease Summary</h3>
                  {loading ? <Skeleton className="h-24 w-full" /> : (
                    <div className="grid grid-cols-2 gap-6 text-white">
                      <div><span className="text-gray-400">Start:</span> {leaseSummary.start}</div>
                      <div><span className="text-gray-400">End:</span> {leaseSummary.end}</div>
                      <div><span className="text-gray-400">Notice Period:</span> {leaseSummary.noticePeriod}</div>
                      <div className="col-span-2"><span className="text-gray-400">Terms:</span> {leaseSummary.terms}</div>
                    </div>
                  )}
                </motion.section>
                {/* Payment History */}
                <motion.section
                  custom={2}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-400" /> Rent Payment History</h3>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 md:gap-6">
                      {expandedPaymentHistory.map((p, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#23232a] rounded-2xl px-6 py-4 shadow hover:shadow-orange-500/20 transition gap-2 md:gap-0">
                          <span className="text-white text-base md:text-lg font-medium">{p.month}</span>
                          <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <span className="text-white font-semibold">₹{p.amount}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === "Paid" ? "bg-gradient-to-r from-green-500 to-green-400 text-white" : "bg-gradient-to-r from-orange-500 to-orange-400 text-white"}`}>{p.status}</span>
                            <span className="text-xs text-gray-400">{p.date}</span>
                            {p.invoice && (
                              <button
                                onClick={() => handleDownload(p.month)}
                                className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-700 hover:from-orange-700 hover:to-red-800 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 btn-glow shadow-md"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.section>
                {/* Outstanding Dues */}
                <motion.section
                  custom={3}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-orange-400" /> Outstanding Dues</h3>
                  {loading ? <Skeleton className="h-10 w-full" /> : (
                    expandedOutstandingDues.length === 0 ? <span className="text-green-400">No outstanding dues!</span> : (
                        <ul className="text-white space-y-4">
                        {expandedOutstandingDues.map((d, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-[#23232a] rounded-2xl px-6 py-4 shadow hover:shadow-orange-500/20 transition">
                            <span>{d.type} (Due {d.dueDate})</span>
                            <span className="font-bold text-orange-400">₹{d.amount}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </motion.section>
                {/* Maintenance Tickets */}
                <motion.section
                  custom={4}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-400" /> Maintenance/Support Tickets</h3>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <ul className="text-white space-y-4">
                      {expandedTickets.map((t) => (
                        <li key={t.id} className={`flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 rounded-2xl shadow ${t.status === "Open" ? "bg-orange-500/10 border-l-4 border-orange-500" : "bg-gray-700/40"} gap-2 md:gap-0`}>
                          <span>{t.subject}</span>
                          <div className="flex gap-2 items-center">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.status === "Open" ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white" : "bg-gradient-to-r from-green-500 to-green-400 text-white"}`}>{t.status}</span>
                            <span className="text-xs text-gray-400">{t.created}</span>
                            <button
                              onClick={() => openConfirmModal(t)}
                              className="ml-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-3 py-1 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 btn-glow shadow-md"
                            >Delete Ticket</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
                {/* Move-out Timeline */}
                {moveOut.noticeGiven && (
                  <motion.section
                    custom={5}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-400" /> Move-out Countdown</h3>
                    {loading ? <Skeleton className="h-10 w-full" /> : (
                      daysLeft !== null && (
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <span className="text-white text-lg">Move-out in <span className="font-bold text-orange-400">{daysLeft} days</span> ({moveOut.moveOutDate})</span>
                          <ProgressBar percent={Math.max(0, 100 - (daysLeft/60)*100)} label="Lease End Approaching" />
                        </div>
                      )
                    )}
                  </motion.section>
                )}
                {/* Activity Log */}
                <motion.section
                  custom={6}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-orange-400" /> Activity Log</h3>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <ul className="text-white space-y-4">
                      {expandedActivityLog.map((a, idx) => (
                        <li key={idx} className="flex justify-between items-center px-6 py-4 rounded-2xl bg-[#23232a] shadow hover:shadow-orange-500/20 transition">
                          <span>{a.action}</span>
                          <span className="text-xs text-gray-400">{a.date}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-10">
                {/* Landlord Contact */}
                <motion.section
                  custom={7}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-orange-400" /> Landlord Contact</h3>
                  {loading ? <Skeleton className="h-16 w-full" /> : (
                    <div className="text-white text-center">
                        <div className="font-bold text-lg mb-2">{landlordCard.name}</div>
                        <div className="text-gray-400 mb-2 flex items-center justify-center gap-2"><Phone className="w-4 h-4" />{landlordCard.phone}</div>
                      <div className="text-xs text-orange-400">Visiting: {landlordCard.visiting}</div>
                    </div>
                  )}
                </motion.section>
                {/* Notifications */}
                <motion.section
                  custom={8}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${cardClass} mb-2 hover:scale-[1.02] transition-transform duration-300 p-8 md:p-10 lg:p-12`}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-orange-400" /> Notifications</h3>
                  {loading ? <Skeleton className="h-10 w-full" /> : (
                    expandedNotifications.length === 0 ? <span className="text-gray-400">No notifications.</span> : (
                        <ul className="space-y-4">
                        {expandedNotifications.map((n) => (
                            <li key={n.id} className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow ${n.type === "alert" ? "bg-orange-500/10 border-l-4 border-orange-500" : "bg-gray-700/40"}`}>
                            <span className="text-white">{n.message}</span>
                            <span className="text-xs text-gray-400 ml-auto">{n.date}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </motion.section>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
        <TenantFooter />
        {/* Modal integration */}
        <Modal open={modal === "profile"} onClose={closeModal} slideFrom="center">
          <h2 className="text-xl font-bold text-white mb-4">Update Profile</h2>
          <div className="mb-4 text-gray-300">(Mock profile form goes here)</div>
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => { toast.success("Profile updated!"); closeModal(); }}
          >Save Changes</button>
        </Modal>
        <Modal open={modal === "receipt"} onClose={closeModal} slideFrom="bottom">
          <h2 className="text-xl font-bold text-white mb-4">Payment Receipt</h2>
          <div className="mb-4 text-gray-300">(Mock receipt for {modalData?.month || "July 2025"})</div>
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => { toast.success("Receipt downloaded!"); closeModal(); }}
          >Download PDF</button>
        </Modal>
        <Modal open={modal === "confirm"} onClose={closeModal} slideFrom="center">
          <h2 className="text-xl font-bold text-white mb-4">Confirm Action</h2>
          <div className="mb-4 text-gray-300">Are you sure you want to proceed?</div>
          <div className="flex gap-4">
            <button
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg shadow transition-all duration-200"
              onClick={closeModal}
            >Cancel</button>
            <button
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow transition-all duration-200"
              onClick={() => { toast.success("Action confirmed!"); closeModal(); }}
            >Confirm</button>
          </div>
        </Modal>
        <style jsx global>{`
          .pulse-glow {
            box-shadow: 0 0 0 0 #ff6a00, 0 0 8px 2px #ff3c00;
            animation: pulseGlow 2s infinite alternate;
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 #ff6a00, 0 0 8px 2px #ff3c00; }
            100% { box-shadow: 0 0 0 4px #ff6a00, 0 0 16px 8px #ff3c00; }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
} 