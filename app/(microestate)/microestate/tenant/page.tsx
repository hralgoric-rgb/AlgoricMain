"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  Calendar,
  CreditCard,
  QrCode,
  User,
  Mail,
  Phone,
  Edit,
  Home,
  FileText,
  MessageCircle,
  AlertCircle,
  BarChart3,
  LogOut,
  PlusCircle,
  CheckCircle,
  Clock,
  Download,
  AlertTriangle,
  Users,
  Settings,
  Loader2,
} from "lucide-react";
import TenantNavbar from "./components/TenantNavbar";
import TenantFooter from "./components/TenantFooter";
import Background from "../../_components/Background";
import { motion } from "framer-motion";
import axios from "axios";

// --- Data Interfaces for API Response ---
interface PopulatedLandlord {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface PopulatedProperty {
  _id: string;
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface LeaseDetails {
  _id: string;
  propertyId: PopulatedProperty;
  landlordId: PopulatedLandlord;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: number;
  status: "draft" | "active" | "expired" | "terminated";
  terms: string;
}

// --- Mock Data (will be replaced, but kept for reference) ---
const tenant = {
  name: "Priya Sharma",
  id: "TNT-1001",
  avatar: "",
};
const paymentStatus = {
  currentBalance: 0,
  lastPayment: "2025-07-01",
  nextDue: "2025-08-01",
  status: "Paid",
};
const reminders = [
  {
    icon: <CreditCard className="w-5 h-5 text-orange-400" />,
    text: "Rent due on 1st August",
    type: "rent",
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    text: "Lease expires in 5 months",
    type: "lease",
  },
  {
    icon: <Settings className="w-5 h-5 text-blue-400" />,
    text: "AC maintenance scheduled: 15th July",
    type: "maintenance",
  },
];
const maintenanceRequests = [
  { id: 1, subject: "Leaky faucet", status: "Pending", date: "2025-07-10" },
  { id: 2, subject: "AC not cooling", status: "Resolved", date: "2025-06-20" },
];
const documents = [
  {
    name: "Lease Agreement",
    icon: <FileText className="w-5 h-5 text-orange-400" />,
    date: "2024-01-01",
  },
  {
    name: "Rent Receipt - July",
    icon: <FileText className="w-5 h-5 text-green-400" />,
    date: "2025-07-01",
  },
];
const messages = [
  {
    from: "Landlord",
    text: "Rent due soon. Please pay by 1st.",
    date: "2025-07-28",
  },
  {
    from: "Support",
    text: "Your maintenance request is in progress.",
    date: "2025-07-11",
  },
];
const emergencyContacts = [
  { label: "Maintenance Helpline", value: "+91 9999999999" },
  { label: "Security", value: "+91 8888888888" },
];
const rentHistory = [18000, 18000, 18000, 18000, 18000, 18000, 18000];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export default function TenantDashboard() {
  const [lease, setLease] = useState<LeaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaseData = async () => {
      // console.log("Fetching property and lease data...");
      try {
        setLoading(true);
        const response = await axios.get("/microestate/api/tenants/property");

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const activeLease =
            response.data.find((l) => l.status === "active") ||
            response.data[0];
          setLease(activeLease);
          console.log("Lease data fetched:", activeLease);
        } else {
          setError("No active lease found for your account.");
        }
      } catch (err: any) {
        console.error("Error fetching lease data:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching your details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaseData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-white ml-4">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-x-hidden">
      <Background />
      <TenantNavbar />

      {error && !lease && (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-white z-10">
          <AlertTriangle className="w-16 h-16 text-red-500 mt-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Could Not Load Dashboard</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      )}

      {lease && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10 md:py-16 z-10 mt-[72px]">
          {/* Welcome/Profile Section */}
          <motion.section
            className="flex flex-col md:flex-row gap-8 mb-10 items-center md:items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 w-full md:w-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl font-bold text-white">
                {tenant.avatar ? (
                  <img
                    src={tenant.avatar}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  tenant.name[0]
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  {tenant.name}{" "}
                  <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                    ID: {tenant.id}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mt-1">Welcome back!</div>
                <button className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all text-sm">
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>
          </motion.section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Current Property
                </span>
              </div>
              <div className="text-white font-semibold text-xl">
                {lease.propertyId.title}
              </div>
              <div className="text-gray-300 text-sm mb-2">{`${lease.propertyId.address.street}, ${lease.propertyId.address.city}, ${lease.propertyId.address.state}`}</div>
              <div className="flex flex-col gap-1 text-sm">
                <span>
                  <span className="text-gray-400">Lease:</span>{" "}
                  {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                </span>
                <span>
                  <span className="text-gray-400">Rent Due Day:</span>{" "}
                  {lease.rentDueDate}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-orange-400" />
                <span className="text-white font-semibold">
                  Landlord: {lease.landlordId.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs">
                <Phone className="w-4 h-4 text-orange-400" />{" "}
                {lease.landlordId.phone}
                <Mail className="w-4 h-4 text-orange-400 ml-4" />{" "}
                {lease.landlordId.email}
              </div>
            </motion.section>

            {/* Payment Status */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Rent Payment Status
                </span>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                ₹{lease.monthlyRent.toLocaleString()}
                <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                  per month
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-300">
                <span>
                  <span className="text-gray-400">Current Balance:</span> ₹
                  {paymentStatus.currentBalance}
                </span>
                <span>
                  <span className="text-gray-400">Last Payment:</span>{" "}
                  {paymentStatus.lastPayment}
                </span>
                <span>
                  <span className="text-gray-400">Next Due:</span>{" "}
                  {paymentStatus.nextDue}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {paymentStatus.status === "Paid" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span
                  className={
                    paymentStatus.status === "Paid"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {paymentStatus.status}
                </span>
              </div>
              <button className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold flex items-center gap-2 justify-center hover:from-orange-600 hover:to-red-600 transition-all text-lg">
                <QrCode className="w-5 h-5" /> Pay Now
              </button>
            </motion.section>

            {/* Activity & Reminders (using mock data) */}
            <motion.section
              className="col-span-1 lg:col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Activity & Reminders
                </span>
              </div>
              <ul className="space-y-3">
                {reminders.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    {r.icon} {r.text}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-orange-400 font-semibold">
                  <Settings className="w-4 h-4" /> Maintenance Requests
                </div>
                <button className="mb-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all text-sm">
                  <PlusCircle className="w-4 h-4" /> Raise New Request
                </button>
                <ul className="space-y-2">
                  {maintenanceRequests.map((req) => (
                    <li
                      key={req.id}
                      className="flex items-center gap-2 text-xs text-gray-300"
                    >
                      <span className="font-semibold text-white">
                        {req.subject}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ml-2 ${
                          req.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : req.status === "Resolved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="ml-auto text-gray-400">{req.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Documents Section (using mock data) */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">Documents</span>
              </div>
              <ul className="space-y-3">
                {documents.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-200"
                  >
                    {doc.icon} {doc.name}
                    <span className="ml-auto text-xs text-gray-400">
                      {doc.date}
                    </span>
                    <button className="ml-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg flex items-center gap-1 text-xs hover:from-orange-600 hover:to-red-600 transition-all">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Communication Section (using mock data) */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">
                  Communication
                </span>
              </div>
              <ul className="space-y-3">
                {messages.map((msg, i) => (
                  <li key={i} className="flex flex-col text-sm text-gray-200">
                    <span className="font-semibold text-white">
                      {msg.from}:
                    </span>
                    <span>{msg.text}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {msg.date}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-orange-400 font-semibold">
                  <AlertCircle className="w-4 h-4" /> Emergency Contacts
                </div>
                <ul className="space-y-2">
                  {emergencyContacts.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-gray-300"
                    >
                      <Users className="w-4 h-4 text-orange-400" />{" "}
                      <span className="font-semibold text-white">
                        {c.label}:
                      </span>{" "}
                      {c.value}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Analytics Section (using mock data) */}
            <motion.section
              className="col-span-1 bg-white/5 backdrop-blur-xl border-2 border-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_32px_8px_rgba(251,146,60,0.35)] hover:border-orange-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-orange-400" />
                <span className="text-lg font-bold text-white">Analytics</span>
              </div>
              <div className="text-white font-semibold mb-2">Rent History</div>
              <div className="flex items-end gap-2 h-32 w-full">
                {rentHistory.map((amt, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-end flex-1"
                  >
                    <div
                      className="w-6 rounded-t-lg bg-gradient-to-b from-orange-500 to-red-500"
                      style={{ height: `${amt / 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-1">
                      {months[i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                All payments on time. Usage stats coming soon.
              </div>
            </motion.section>
          </div>
        </main>
      )}
      <TenantFooter />
    </div>
  );
}
