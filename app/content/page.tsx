"use client";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

export default function BlogsAndArticles() {
  return (
    <main className="min-h-screen bg-stone-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-brown-dark/30 z-10"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Top-left house silhouette */}
          <div className="absolute -top-6 -left-6 w-36 h-36 text-white/10 transform -rotate-15">
            <HouseIcon />
          </div>
          {/* Bottom-right house silhouette */}
          <div className="absolute -bottom-6 -right-6 w-36 h-36 text-white/10 transform rotate-15">
            <HouseIcon />
          </div>
          {/* Scattered circles */}
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-beige/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-beige/20 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/2 w-4 h-4 bg-beige/20 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block bg-brown/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-beige/20"
            >
              <span className="text-stone-light font-medium">Blogs & Articles</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-sm">
                Insights and Updates
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl text-stone-light mb-10 max-w-2xl mx-auto drop-shadow-sm">
                Stay informed with our latest blogs and articles on real estate trends, market insights, and tips for buyers and sellers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-24 bg-stone-light relative overflow-hidden" id="featured-articles">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 text-brown/5">
          <CirclePattern />
        </div>

        {/* Decorative Houses */}
        <div className="absolute left-0 top-1/3 w-24 h-24 text-brown/10 transform -translate-x-1/2 rotate-30">
          <HouseIcon />
        </div>
        <div className="absolute right-0 bottom-1/3 w-28 h-28 text-brown/10 transform translate-x-1/2 -rotate-30">
          <HouseIcon />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-beige/50 px-4 py-2 rounded-full mb-4"
            >
              <span className="text-brown font-medium">FEATURED ARTICLES</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-brown-dark mb-6"
            >
              Featured Articles
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Top Real Estate Trends in 2024",
                description: "Discover the latest trends shaping the real estate market in 2024 and how you can leverage them for your investments.",
                image: "/blog1.jpg",
                link: "#",
              },
              {
                title: "The Art of Luxury Home Staging",
                description: "Learn how to stage your luxury home to attract potential buyers and maximize your property's appeal.",
                image: "/blog2.jpg",
                link: "#",
              },
              {
                title: "Navigating the Real Estate Market as a First-Time Buyer",
                description: "A comprehensive guide for first-time buyers to navigate the real estate market with confidence.",
                image: "/blog3.jpg",
                link: "#",
              },
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 p-6 rounded-xl shadow-lg"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  width={500}
                  height={300}
                />
                <h3 className="text-xl font-semibold text-brown-dark mb-2">{article.title}</h3>
                <p className="text-brown-dark/80 mb-4">{article.description}</p>
                <a href={article.link} className="text-brown hover:underline">Read More</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-24 bg-beige relative overflow-hidden" id="latest-blogs">
        {/* Decorative Circle Pattern */}
        <div className="absolute inset-0 text-brown/5">
          <CirclePattern />
        </div>

        {/* Floating Houses */}
        <div className="absolute left-1/4 top-0 w-20 h-20 text-brown/10 transform -translate-y-1/2 rotate-45">
          <HouseIcon />
        </div>
        <div className="absolute right-1/4 bottom-0 w-16 h-16 text-brown/10 transform translate-y-1/2 -rotate-45">
          <HouseIcon />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-brown/20 px-4 py-2 rounded-full mb-4"
            >
              <span className="text-brown-dark font-medium">LATEST BLOGS</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-brown-dark mb-6"
            >
              Latest Blogs
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "The Benefits of Investing in Real Estate",
                description: "Explore the advantages of investing in real estate and how it can diversify your investment portfolio.",
                image: "/blog4.jpg",
                link: "#",
              },
              {
                title: "Sustainable Living: Eco-Friendly Home Features",
                description: "Discover eco-friendly home features that promote sustainable living and reduce your carbon footprint.",
                image: "/blog5.jpg",
                link: "#",
              },
              {
                title: "Maximizing Your Property's Value Through Renovations",
                description: "Learn how strategic renovations can increase your property's value and appeal to potential buyers.",
                image: "/blog6.jpg",
                link: "#",
              },
            ].map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 p-6 rounded-xl shadow-lg"
              >
                <Image
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  width={500}
                  height={300}
                />
                <h3 className="text-xl font-semibold text-brown-dark mb-2">{blog.title}</h3>
                <p className="text-brown-dark/80 mb-4">{blog.description}</p>
                <a href={blog.link} className="text-brown hover:underline">Read More</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 text-brown/5">
          <CirclePattern />
        </div>

        {/* Floating Elements */}
        <div className="absolute left-1/3 top-0 w-3 h-3 bg-brown/20 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute right-1/4 bottom-0 w-4 h-4 bg-brown/20 rounded-full transform translate-y-1/2"></div>
        <div className="absolute left-2/3 top-1/2 w-2 h-2 bg-brown/20 rounded-full"></div>

        {/* Corner Houses */}
        <div className="absolute left-0 bottom-0 w-24 h-24 text-brown/10 transform -translate-x-1/2 translate-y-1/2 rotate-90">
          <HouseIcon />
        </div>
        <div className="absolute right-0 top-0 w-20 h-20 text-brown/10 transform translate-x-1/2 -translate-y-1/2 -rotate-90">
          <HouseIcon />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-beige-light to-beige rounded-xl p-12 shadow-xl relative overflow-hidden border border-brown/10"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-brown-dark mb-4 text-center">Stay Updated with Our Blogs</h2>
              <p className="text-lg text-brown-dark/80 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest blogs, market insights, and real estate tips directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-grow px-4 py-3 rounded-md border border-beige focus:outline-none focus:ring-2 focus:ring-brown-light"
                />
                <button
                  type="submit"
                  className="luxury-button"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
