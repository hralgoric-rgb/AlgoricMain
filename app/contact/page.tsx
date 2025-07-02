"use client";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { useState } from 'react';

const HouseIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
  </svg>
);

const CirclePattern = () => (
  <div className="absolute inset-0 opacity-10">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <pattern id="circle-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#circle-pattern)" />
    </svg>
  </div>
);

export default function ContactUs() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formStatus, setFormStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({
        type: null,
        message: ''
    });
    const [fieldErrors, setFieldErrors] = useState<{
        fullName?: string;
        email?: string;
        phone?: string;
        message?: string;
    }>({});

    const validateForm = () => {
        const errors: any = {};
        
        // Full Name validation
        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            errors.fullName = 'Full name must be at least 2 characters';
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Phone validation (optional but if provided, should be valid)
        if (formData.phone.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
            if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
                errors.phone = 'Please enter a valid phone number';
            }
        }
        
        // Message validation
        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear field error when user starts typing
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        
        // Clear form status when user modifies form
        if (formStatus.type) {
            setFormStatus({ type: null, message: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            setFormStatus({
                type: 'error',
                message: 'Please correct the errors above and try again.'
            });
            return;
        }
        
        setIsLoading(true);
        setFormStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus({
                    type: 'success',
                    message: 'Thank you for your message! We will get back to you within 24 hours.'
                });
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setFieldErrors({});
            } else {
                setFormStatus({
                    type: 'error',
                    message: data.error || 'Failed to send message. Please try again or contact us directly.'
                });
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setFormStatus({
                type: 'error',
                message: 'Network error occurred. Please check your connection and try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.avif"
            alt="Luxury real estate"
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50 z-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block bg-orange-500/80 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-white font-medium tracking-wider text-sm">CONTACT US</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Get in <span className="text-orange-500">Touch</span> with us
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              We are here to help you with your property needs.
            </p>
          </motion.div>
        </div>
      </section>

            {/* Contact Form Section */}
            <section className="py-24 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden" id="contact-form">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 text-orange-500/5">
                    <CirclePattern />
                </div>

                {/* Decorative Houses */}
                <div className="absolute left-0 top-1/4 w-24 h-24 text-orange-500/10 transform -translate-x-1/2 animate-float-slow">
                    <HouseIcon />
                </div>
                <div className="absolute right-0 bottom-1/4 w-28 h-28 text-orange-500/10 transform translate-x-1/2 rotate-180 animate-float-slow-reverse">
                    <HouseIcon />
                </div>
                
                {/* Background glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-around items-center gap-12 relative z-10">
                    <div className="w-full md:w-[45%]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-4"
                        >
                            <span className="text-orange-400 font-medium">REACH OUT</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-white mb-6"
                        >
                            Contact Form
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-br from-orange-600/30 to-orange-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-zinc-900 to-black p-8 rounded-xl shadow-xl border border-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300">
                                {formStatus.type && (
                                    <div className={`mb-6 p-4 rounded-md ${formStatus.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {formStatus.message}
                                    </div>
                                )}
                                
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Full Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className={`w-full px-4 py-3 rounded-md bg-black/60 border focus:outline-none focus:ring-2 text-white ${
                                                fieldErrors.fullName 
                                                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                                    : 'border-orange-500/20 focus:ring-orange-500/50 focus:border-orange-500/50'
                                            }`}
                                        />
                                        {fieldErrors.fullName && (
                                            <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Email Address <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            className={`w-full px-4 py-3 rounded-md bg-black/60 border focus:outline-none focus:ring-2 text-white ${
                                                fieldErrors.email 
                                                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                                    : 'border-orange-500/20 focus:ring-orange-500/50 focus:border-orange-500/50'
                                            }`}
                                        />
                                        {fieldErrors.email && (
                                            <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Phone Number <span className="text-gray-500">(optional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            className={`w-full px-4 py-3 rounded-md bg-black/60 border focus:outline-none focus:ring-2 text-white ${
                                                fieldErrors.phone 
                                                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                                    : 'border-orange-500/20 focus:ring-orange-500/50 focus:border-orange-500/50'
                                            }`}
                                        />
                                        {fieldErrors.phone && (
                                            <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Message <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your inquiry, requirements, or how we can help you..."
                                            rows={4}
                                            className={`w-full px-4 py-3 rounded-md bg-black/60 border focus:outline-none focus:ring-2 text-white resize-vertical ${
                                                fieldErrors.message 
                                                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                                                    : 'border-orange-500/20 focus:ring-orange-500/50 focus:border-orange-500/50'
                                            }`}
                                        ></textarea>
                                        {fieldErrors.message && (
                                            <p className="text-red-400 text-xs mt-1">{fieldErrors.message}</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            {formData.message.length}/500 characters
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </span>
                                            ) : 'Send Message'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                    
                    <div className="w-full md:w-[45%]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-br from-orange-600/30 to-orange-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-zinc-900 to-black p-8 rounded-xl shadow-xl border border-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300">
                                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Visit Us</h3>
                                <div className="aspect-w-16 aspect-h-9">
                                    {/* Embed a Google Map here */}
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.702790309935!2d77.2244053150386!3d28.61279598242898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b36e3efc7%3A0x5015cc5bcb6105a1!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1635201593297!5m2!1sen!2sin"
                                        width="600"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full rounded-lg"
                                    ></iframe>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Customer Service Approach Section */}
            <section className="py-24 bg-white relative overflow-hidden" id="customer-service">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Background patterns */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_70%)]"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_70%)]"></div>
                    
                    {/* Orange accents */}
                    <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
                    
                    {/* Floating Houses */}
                    <div className="absolute left-1/3 top-0 w-20 h-20 text-orange-500/10 transform -translate-y-1/2 rotate-45 animate-float-slow">
                        <HouseIcon />
                    </div>
                    <div className="absolute right-1/3 bottom-0 w-16 h-16 text-orange-500/10 transform translate-y-1/2 -rotate-45 animate-float-slow-reverse">
                        <HouseIcon />
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-block bg-orange-500/10 px-4 py-2 rounded-full mb-4"
                        >
                            <span className="text-orange-600 font-medium">OUR APPROACH</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
                        >
                            Our Commitment to You
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            At 100gaj, we are dedicated to providing exceptional customer service. Our approach is centered around understanding your unique needs and delivering personalized solutions that exceed your expectations.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden" id="testimonials">
                {/* Decorative Background */}
                <div className="absolute inset-0 text-orange-500/5">
                    <CirclePattern />
                </div>

                {/* Background glow */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl transform -translate-y-1/2"></div>

                {/* Animated particles */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-500/40 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-orange-500/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute left-2/3 top-1/2 w-4 h-4 bg-orange-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Corner Houses */}
                <div className="absolute left-0 bottom-0 w-24 h-24 text-orange-500/10 transform -translate-x-1/2 translate-y-1/2 animate-float-slow">
                    <HouseIcon />
                </div>
                <div className="absolute right-0 top-0 w-20 h-20 text-orange-500/10 transform translate-x-1/2 -translate-y-1/2 rotate-90 animate-float-slow-reverse">
                    <HouseIcon />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-block bg-orange-500/20 px-4 py-2 rounded-full mb-4"
                        >
                            <span className="text-orange-400 font-medium">CLIENT FEEDBACK</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-white mb-6"
                        >
                            What Our Clients Say
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "The 100gaj team made the process of finding our dream home effortless. Their attention to detail and personalized service were exceptional.",
                                author: "Rahul Sharma",
                                role: "Homeowner",
                            },
                            {
                                quote: "As a first-time buyer, I was nervous, but 100gaj guided me through every step. I couldn't be happier with my new home.",
                                author: "Priya Patel",
                                role: "First-time Buyer",
                            },
                            {
                                quote: "Selling my property was quick and hassle-free thanks to 100gaj. Their professionalism and market knowledge are unmatched.",
                                author: "Vikram Malhotra",
                                role: "Property Seller",
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-br from-orange-600/30 to-orange-500/30 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative bg-gradient-to-br from-zinc-900 to-black p-8 rounded-xl shadow-xl border border-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300">
                                    <p className="text-gray-300 mb-6 italic">`&quot;`{testimonial.quote}`&quot;`</p>
                                    <div className="h-px w-full bg-gradient-to-r from-orange-600/0 via-orange-600/50 to-orange-600/0 mb-6"></div>
                                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors duration-300">{testimonial.author}</h3>
                                    <p className="text-orange-500/80">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white relative overflow-hidden" id="faq">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Background patterns */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_70%)]"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_70%)]"></div>
                    
                    {/* Orange accents */}
                    <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
                    
                    {/* Floating Houses */}
                    <div className="absolute left-1/3 top-0 w-20 h-20 text-orange-500/10 transform -translate-y-1/2 rotate-45 animate-float-slow">
                        <HouseIcon />
                    </div>
                    <div className="absolute right-1/3 bottom-0 w-16 h-16 text-orange-500/10 transform translate-y-1/2 -rotate-45 animate-float-slow-reverse">
                        <HouseIcon />
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-block bg-orange-500/10 px-4 py-2 rounded-full mb-4"
                        >
                            <span className="text-orange-600 font-medium">FAQ</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
                        >
                            Frequently Asked Questions
                        </motion.h2>
                    </div>

                    <div className="space-y-6 max-w-4xl mx-auto">
                        {[
                            {
                                question: "How do I start the process of buying a property?",
                                answer: "You can start by browsing our curated listings and contacting our team for personalized assistance. We'll guide you through the entire process.",
                            },
                            {
                                question: "What kind of properties do you offer?",
                                answer: "We specialize in luxury properties, including modern apartments, villas, and exclusive estates tailored to discerning tastes.",
                            },
                            {
                                question: "How can I schedule a property viewing?",
                                answer: "You can schedule a viewing by filling out our contact form or calling our office. Our team will arrange a convenient time for you to visit the property.",
                            },
                            {
                                question: "What services do you offer for sellers?",
                                answer: "We provide comprehensive services for sellers, including property valuation, marketing, and guidance throughout the selling process.",
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative bg-white p-6 rounded-xl shadow-md border border-orange-100 group-hover:border-orange-200 transition-all duration-300">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">{faq.question}</h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
