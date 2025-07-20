import Image from "next/image";
import Link from "next/link";

export default function EquityFooter() {
  return (
    <footer className="bg-black text-white relative border-t border-[#a78bfa]/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#a78bfa]/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-[#B6FF3F]/10 rounded-full -ml-48 -mb-48"></div>
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <Image src="/logo.png" alt="100 Gaj Logo" width={50} height={50} />
              <h3 className="text-2xl font-bold text-[#a78bfa] ml-4">100Gaj Equity</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              Invest in premium commercial real estate with ease. Build your wealth, diversify your portfolio, and earn monthly income with 100Gaj Equity Platform.
            </p>
            <div className="flex space-x-5">
              <a href="https://www.instagram.com/100.gaj" className="h-10 w-10 rounded-full bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] hover:text-[#B6FF3F] hover:bg-[#B6FF3F]/20 transition-all duration-300">
                {/* Instagram icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/100-gaj/" className="h-10 w-10 rounded-full bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] hover:text-[#B6FF3F] hover:bg-[#B6FF3F]/20 transition-all duration-300">
                {/* LinkedIn icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/equity" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Dashboard</Link></li>
              <li><Link href="/equity/properties" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Properties</Link></li>
              <li><Link href="/equity/portfolio" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Portfolio</Link></li>
              <li><Link href="/equity/analytics" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Analytics</Link></li>
              <li><Link href="/equity/support" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Support</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Invest</h4>
            <ul className="space-y-3">
              <li><Link href="/equity" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">How It Works</Link></li>
              <li><Link href="/equity/projects" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Projects</Link></li>
              <li><Link href="/equity/faq" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">FAQ</Link></li>
              <li><Link href="/equity/legal" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Legal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/equity/contact" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Contact Us</Link></li>
              <li><Link href="/equity/support" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Help Center</Link></li>
              <li><Link href="/equity/legal" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Privacy Policy</Link></li>
              <li><Link href="/equity/legal" className="hover:text-[#B6FF3F] transition-all duration-300 inline-block">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-[#a78bfa] mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#B6FF3F] group-hover:text-[#a78bfa] transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="group-hover:text-[#B6FF3F] transition-all duration-300">Delhi, India</span>
              </li>
              <li className="flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#B6FF3F] group-hover:text-[#a78bfa] transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 2a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2h8zm0 0v4m0 0H8m8 0v4m0 0H8" /></svg>
                <span className="group-hover:text-[#B6FF3F] transition-all duration-300">info@100gaj.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#a78bfa]/20 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} 100Gaj Equity Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 