"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EquityNavigation from "@/app/equity/components/EquityNavigation";

export default function PostPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<"accepted" | "pending" | "rejected" | null>(null);
  const [kycData, setKycData] = useState<any>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.replace("/equity/login-signup?redirect=/equity/property/post");
      return;
    }
    // Fetch KYC status for the user
    const fetchKycStatus = async () => {
      try {
        const res = await fetch("/api/kyc", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.reviewed) {
          // Find the accepted KYC for the current user
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const userId = tokenPayload.userId || tokenPayload.sub;
          const myKyc = data.reviewed.find((k: any) => k.userId === userId && k.status === "accepted");
          if (myKyc) {
            setKycStatus(myKyc.status);
            setKycData(myKyc);
            setOtpVerified(myKyc.otpVerified || false);
          } else {
            setKycStatus(null);
            setKycData(null);
          }
        } else {
          setKycStatus(null);
          setKycData(null);
        }
      } catch {
        setKycStatus(null);
        setKycData(null);
      }
      setLoading(false);
    };
    fetchKycStatus();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/kyc/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kycId: kycData._id,
          otp: otp,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        setShowOtpModal(false);
        setOtp("");
        setSuccess("OTP verified successfully! You can now post your property.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setOtpError(data.error || "Failed to verify OTP");
      }
    } catch (err) {
      setOtpError("An error occurred. Please try again.");
    }
    setOtpLoading(false);
  };

  // New: handle Post Now click
  const handlePostNow = async () => {
    setOtpError("");
    setSuccess("");
    setOtp("");
    setOtpVerified(false);
    setShowOtpModal(false);
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setOtpError("You must be logged in to post a property.");
        setOtpLoading(false);
        setShowOtpModal(true);
        return;
      }
      // Fetch KYC to get userId
      const resKyc = await fetch("/api/kyc", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataKyc = await resKyc.json();
      if (resKyc.ok && dataKyc.reviewed) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.userId || tokenPayload.sub;
        const myKyc = dataKyc.reviewed.find((k: any) => k.userId === userId && k.status === "accepted");
        if (!myKyc) {
          setOtpError("Your KYC must be accepted before posting a property.");
          setOtpLoading(false);
          setShowOtpModal(true);
          return;
        }
        setKycData(myKyc);
        // Call backend to generate/send OTP
        const resOtp = await fetch("/api/kyc", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: myKyc.userId }),
        });
        const dataOtp = await resOtp.json();
        if (!resOtp.ok) {
          setOtpError(dataOtp.error || "Failed to send OTP");
          setOtpLoading(false);
          setShowOtpModal(true);
          return;
        }
        setSuccess("OTP sent to your email. Please check your inbox.");
        setShowOtpModal(true);
      } else {
        setOtpError("Your KYC must be accepted before posting a property.");
        setOtpLoading(false);
        setShowOtpModal(true);
      }
    } catch (err) {
      setOtpError("An error occurred. Please try again.");
      setShowOtpModal(true);
    }
    setOtpLoading(false);
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    await handlePostNow();
    setTimeout(() => setResendDisabled(false), 30000); // 30 seconds cooldown
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to post a property.");
        setSubmitting(false);
        return;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      if (image) formData.append("image", image);

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post property");
        setSubmitting(false);
        return;
      }
      setSuccess("Property posted successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setLocation("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSubmitting(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#2d1a4a] to-[#a78bfa] px-4 relative">
      <EquityNavigation />
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl mx-auto text-center pt-24 pb-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#a78bfa] to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          Post Property for <span className="text-white">FREE</span>
        </h1>
        <p className="text-lg sm:text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          List your property and reach thousands of verified buyers and tenants. No hidden charges, no complications.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <div className="flex-1 bg-black/70 rounded-xl p-6 border border-purple-400/30 flex flex-col items-center shadow-lg">
            <span className="text-5xl font-bold text-[#a78bfa] mb-2">30</span>
            <span className="text-purple-200 text-lg">Property Sold Every</span>
            <span className="text-purple-400 text-md mt-1">Minutes</span>
          </div>
          <div className="flex-1 bg-black/70 rounded-xl p-6 border border-purple-400/30 flex flex-col items-center shadow-lg">
            <span className="text-5xl font-bold text-[#a78bfa] mb-2">10K+</span>
            <span className="text-purple-200 text-lg">Active Buyers</span>
            <span className="text-purple-400 text-md mt-1">Daily</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            className="bg-gradient-to-r from-[#a78bfa] to-purple-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-md hover:from-purple-500 hover:to-purple-800 transition-all duration-300"
            onClick={handlePostNow}
          >
            Post Now
          </Button>
        </div>
      </motion.div>
      {/* Conditional Property Form or KYC Status Message */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-black/90 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-lg z-10 border border-purple-400/30 mb-12"
      >
        {otpVerified ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-2 text-white">
              Post a Property
            </h2>
            <p className="text-center text-purple-300 mb-6">
              List your property and reach thousands of buyers on 100Gaj Equity.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Premium Office Space in Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  placeholder="Describe your property, amenities, etc."
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-300 mb-1">Price (INR)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    min={0}
                    placeholder="e.g. 2500000"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                    placeholder="e.g. Bandra Kurla Complex, Mumbai"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="w-full text-white"
                />
                {image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-purple-400/30"
                    />
                    <span className="text-gray-400 text-xs">{image.name}</span>
                  </div>
                )}
              </div>
              {error && <div className="text-red-400 text-sm text-center">{error}</div>}
              {success && <div className="text-green-400 text-sm text-center">{success}</div>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2 rounded-lg mt-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Property"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center text-purple-200 text-lg font-semibold py-8">
            Click &apos;Post Now&apos; to start the property posting process.
          </div>
        )}
      </motion.div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Decorative blurred gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700 rounded-full opacity-20 blur-2xl" />
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 rounded-2xl p-8 w-full max-w-md border border-purple-400/30"
          >
            <h3 className="text-2xl font-bold text-center mb-4 text-white">
              Verify OTP
            </h3>
            <p className="text-center text-purple-300 mb-6">
              Enter the 6-digit OTP sent to your email when your KYC was approved.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-purple-400/30 focus:border-purple-400 outline-none text-center text-xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              {otpError && (
                <div className="text-red-400 text-sm text-center">{otpError}</div>
              )}
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp("");
                    setOtpError("");
                  }}
                  className="flex-1 bg-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otpLoading || otp.length !== 6}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800"
                >
                  {otpLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={handleResendOtp}
                  disabled={resendDisabled || otpLoading}
                  className="flex-1 bg-gradient-to-r from-purple-400 to-purple-700 text-white hover:from-purple-500 hover:to-purple-800"
                >
                  {resendDisabled ? `Resend OTP (wait...)` : "Resend OTP"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 