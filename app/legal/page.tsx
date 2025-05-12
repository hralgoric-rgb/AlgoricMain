"use client";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Legal() {
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
              <span className="font-medium tracking-wide">Legal Information</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
                <span className="text-orange-500">Legal</span> Information
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
                Welcome to our legal page. Here you will find important information about our terms of service, privacy policy, and other legal disclosures.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section className="py-24 bg-black" id="terms-of-service">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-500/50 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-white font-medium">TERMS OF SERVICE</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-brown-dark mb-6 text-center text-white"
            >
              Terms of Service
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-100 p-8 rounded-xl shadow-lg space-y-4"
            >
              <p className="text-lg text-black">
                Welcome to 100 Gaj. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions in full.
              </p>
              <p className="text-lg text-black">
                <strong>Use License:</strong> Permission is granted to temporarily download one copy of the materials on EstateElite`&apos;`s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-lg text-black space-y-2">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display;</li>
                <li>Attempt to decompile or reverse engineer any software contained on EstateElite`&apos;`s website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or `&quot;`mirror`&quot;`` the materials on any other server.</li>
              </ul>
              <p className="text-lg text-black">
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by EstateElite at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-24 bg-orange-500" id="privacy-policy">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-white px-4 py-2 rounded-full mb-6"
            >
              <span className="text-gray-950 font-medium">PRIVACY POLICY</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-black mb-6 text-center"
            >
              Privacy Policy
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-100 p-8 rounded-xl shadow-lg space-y-4"
            >
              <p className="text-lg text-black">
                At EstateElite, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information.
              </p>
              <p className="text-lg text-black">
                <strong>Information We Collect:</strong> We may collect personal information such as your name, email address, phone number, and property preferences when you use our services or communicate with us.
              </p>
              <p className="text-lg text-black">
                <strong>How We Use Your Information:</strong> We use the collected information to provide and improve our services, communicate with you, and personalize your experience. We may also use this information for marketing and analytical purposes.
              </p>
              <p className="text-lg text-black">
                <strong>Sharing Your Information:</strong> We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
              <p className="text-lg text-black">
                <strong>Protecting Your Information:</strong> We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-24 bg-black" id="disclaimer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-500/50 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-white font-medium">DISCLAIMER</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6 text-center"
            >
              Disclaimer
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-100 p-8 rounded-xl shadow-lg space-y-4"
            >
              <p className="text-lg text-black">
                The information contained on this website is for general information purposes only. EstateElite makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
              </p>
              <p className="text-lg text-black">
                In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
