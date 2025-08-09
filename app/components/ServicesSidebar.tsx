"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

export default function ServicesSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button - Sticky on the left side */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-4 rounded-r-lg shadow-lg transition-all duration-300 group"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </motion.button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl z-[70] overflow-y-auto"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-orange-500">
                    More Services
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Services Content */}
                <div className="space-y-6">
                  {/* Equity Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative p-4 rounded-lg bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/20 to-transparent rounded-lg blur opacity-30"></div>
                    <div className="relative">
                      <div className="flex items-center mb-3">
                        <div className="bg-orange-500/20 rounded-full p-2 mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          Equity Platform
                        </h3>
                      </div>
                      <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                        Invest in premium real estate with fractional ownership. 
                        Start building your property portfolio with as little as ₹10,000.
                      </p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                          Fractional Investment
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                          Monthly Returns
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                          Capital Growth
                        </div>
                      </div>
                      <Link
                        href="/equity"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-md transition-all duration-300 group"
                      >
                        Explore Equity
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Microestate Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg blur opacity-30"></div>
                    <div className="relative">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          Microestate
                        </h3>
                      </div>
                      <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                        Discover compact, affordable housing solutions perfect for 
                        young professionals and first-time buyers.
                      </p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                          Affordable Housing
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                          Prime Locations
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                          Smart Design
                        </div>
                      </div>
                      <Link
                        href="/microestate"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-all duration-300 group"
                      >
                        Explore Microestate
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Additional Services Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                  >
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Why Choose Our Services?
                    </h4>
                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Expert guidance from professionals</span>
                      </div>
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Transparent pricing</span>
                      </div>
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-green-400 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Secure transactions</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 pt-4 border-t border-gray-700"
                >
                  <p className="text-xs text-gray-400 text-center mb-2">
                    Need help choosing the right service?
                  </p>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-3 py-2 bg-transparent border border-orange-500/50 text-orange-400 text-xs font-medium rounded-md text-center hover:bg-orange-500/10 transition-all duration-300"
                  >
                    Contact Our Experts
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
