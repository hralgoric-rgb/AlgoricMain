"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PrivacyPolicy() {
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
                Privacy Policy
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
                <span className="text-orange-500">Privacy</span> Policy
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
                Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
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
                <h2 className="text-2xl font-bold text-black">1. Information We Collect</h2>
                <p className="text-lg text-black">
                  We may collect the following types of information:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>
                    <strong>Personal Information:</strong> Your name, email address, phone number, and residential address.
                  </li>
                  <li>
                    <strong>Property Details:</strong> Information related to properties you list or search for on our platform.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information such as IP address, browser type, device type, pages visited, and time spent on the site.
                  </li>
                  <li>
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance user experience and analyze website usage.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">2. How We Use Your Information</h2>
                <p className="text-lg text-black">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>To facilitate property listings and search functionality.</li>
                  <li>To communicate with you regarding your account or inquiries.</li>
                  <li>To improve our services and develop new features.</li>
                  <li>To send promotional communications (you may opt-out at any time).</li>
                  <li>To provide customer support and respond to your requests.</li>
                  <li>To comply with legal obligations and protect our rights.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">3. Sharing Your Information</h2>
                <p className="text-lg text-black">
                  We may share your information under the following circumstances:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>
                    <strong>With Service Providers:</strong> Trusted partners who assist us in operating the website and providing services.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, regulation, or legal process.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly consent to sharing your information.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">4. Data Security</h2>
                <p className="text-lg text-black">
                  We implement appropriate security measures to protect your information from unauthorized access, disclosure, or misuse. These measures include:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">5. Your Rights</h2>
                <p className="text-lg text-black">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-lg text-black space-y-2 ml-4">
                  <li><strong>Access:</strong> Request access to the personal data we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                </ul>
                <p className="text-lg text-black mt-4">
                  To exercise these rights, please contact us at: <strong>privacy@algoric.com</strong>
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">6. Data Retention</h2>
                <p className="text-lg text-black">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">7. Cookies and Tracking</h2>
                <p className="text-lg text-black">
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">8. Third-Party Links</h2>
                <p className="text-lg text-black">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">9. Updates to This Policy</h2>
                <p className="text-lg text-black">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black">10. Contact Us</h2>
                <p className="text-lg text-black">
                  If you have any questions about this privacy policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-200 p-4 rounded-lg">
                  <p className="text-lg text-black">
                    <strong>Email:</strong> privacy@algoric.com<br />
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
