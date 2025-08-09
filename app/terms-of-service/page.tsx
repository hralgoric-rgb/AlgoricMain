"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-stone-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.avif"
            alt="Luxury real estate"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-orange-dark/40 z-10"></div>

          {/* Add decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-orange/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-light/10 rounded-full -ml-32 -mb-32"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-light/10 rounded-full -mr-32 -mt-32"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block bg-orange-600/60 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-orange-300/20"
            >
              <span className="font-medium tracking-wide">
                Terms of Service
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
                <span className="text-orange-500">Terms</span> of Service
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
                Please read these terms carefully before using our services. By accessing our platform, you agree to be bound by these terms.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-100 p-8 rounded-xl shadow-lg space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">1. Acceptance of Terms</h2>
                <p className="text-lg text-black">
                  By accessing and using the Algoric website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">2. Eligibility</h2>
                <p className="text-lg text-black">
                  You must be at least 18 years old to use this website. By using our services, you represent and warrant that you have the legal capacity to enter into this agreement.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">3. User Responsibilities</h2>
                <p className="text-lg text-black">
                  By using this site, you agree to:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>Provide accurate and current information when creating an account or listing properties</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the website in compliance with applicable laws and regulations</li>
                  <li>Refrain from posting any prohibited, harmful, or illegal content</li>
                  <li>Not use the service for any unauthorized commercial purposes</li>
                  <li>Respect the intellectual property rights of others</li>
                  <li>Not engage in any activity that could harm or disrupt our services</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">4. Property Listings</h2>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>Users are solely responsible for the accuracy of the information provided in property listings</li>
                  <li>All property information must be truthful, accurate, and not misleading</li>
                  <li>Listings that violate our policies or applicable laws may be removed without notice</li>
                  <li>We reserve the right to moderate, edit, or delete content at our discretion</li>
                  <li>Users must have proper authorization to list any property on our platform</li>
                  <li>Duplicate or spam listings are prohibited</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">5. User-Generated Content</h2>
                <p className="text-lg text-black">
                  By submitting content to our platform, you grant Algoric a non-exclusive, worldwide, royalty-free license to use, modify, and display such content for the purpose of providing our services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">6. Intellectual Property</h2>
                <p className="text-lg text-black">
                  All content on this website—including logos, text, images, software, and design—is the property of Algoric or its content suppliers, and is protected by intellectual property laws. Unauthorized use of any content is strictly prohibited.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">7. Privacy and Data Protection</h2>
                <p className="text-lg text-black">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using our services, you consent to the collection and use of your information as outlined in our Privacy Policy.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">8. Limitation of Liability</h2>
                <p className="text-lg text-black">
                  Algoric is not liable for:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>Any direct, indirect, incidental, or consequential damages arising from the use of the site</li>
                  <li>Errors, omissions, or inaccuracies in property listings or user-generated content</li>
                  <li>Unauthorized access to user data or system interruptions</li>
                  <li>Any transactions or disputes between users</li>
                  <li>Content or actions of third-party service providers</li>
                  <li>Loss of data, profits, or business opportunities</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">9. Indemnification</h2>
                <p className="text-lg text-black">
                  You agree to indemnify and hold harmless Algoric, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">10. Service Availability</h2>
                <p className="text-lg text-black">
                  We strive to maintain continuous service availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">11. Termination</h2>
                <p className="text-lg text-black">
                  We reserve the right to suspend or terminate user accounts for any violation of these terms, misuse of our platform, or at our sole discretion. Upon termination, your right to use our services will immediately cease.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">12. Governing Law and Dispute Resolution</h2>
                <p className="text-lg text-black">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of courts in Delhi, India.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">13. Changes to Terms</h2>
                <p className="text-lg text-black">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after any changes constitutes acceptance of the new terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">14. Severability</h2>
                <p className="text-lg text-black">
                  If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">15. Contact Information</h2>
                <p className="text-lg text-black">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-lg text-black">
                    <strong>Email:</strong> legal@algoric.com<br />
                    <strong>Phone:</strong> +91 98765 43210<br />
                    <strong>Address:</strong> SN-259/3/2/2, PN-47, KALWAD NR OLD Airport (Pune), Pune City, Pune- 411032, Maharashtra
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
