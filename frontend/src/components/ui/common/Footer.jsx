"use client";
import { FaLinkedin, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:flex lg:justify-between lg:gap-6 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-orange-500">Kavas</h2>
          <p className="text-gray-400 mt-3 text-[14px] leading-relaxed">
            India's trusted B2B wholesale platform connecting verified vendors<br/>
            with buyers across every industry.
          </p>
          <div className="flex gap-3 mt-4">
            <Icon><FaLinkedin /></Icon>
            <Icon><FaTwitter /></Icon>
            <Icon><FaFacebook /></Icon>
            <Icon><FaYoutube /></Icon>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-gray-800 mb-3">For Buyers</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer">Browse products</li>
            <li className="hover:text-orange-500 cursor-pointer">My cart</li>
            <li className="hover:text-orange-500 cursor-pointer">Membership</li>
            <li className="hover:text-orange-500 cursor-pointer">Flash deals</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-gray-800 mb-3">For Vendors</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer">Sell on Kavas</li>
            <li className="hover:text-orange-500 cursor-pointer">Supplier directory</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-gray-800 mb-3">Company</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer">About us</li>
            <li className="hover:text-orange-500 cursor-pointer">Help centre</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-gray-800 mb-3">Legal</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer">Privacy policy</li>
            <li className="hover:text-orange-500 cursor-pointer">Terms of use</li>
            <li className="hover:text-orange-500 cursor-pointer">Shipping info</li>
          </ul>
        </div>
      </div>
      <div className="bg-black text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Kavas Technologies Pvt. Ltd.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const Icon = ({ children }) => (
  <div className="w-8 h-8 flex items-center justify-center border rounded-md text-gray-600 cursor-pointer transition hover:bg-orange-100 hover:text-orange-500  hover:ring-1 hover:ring-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none">
    {children}
  </div>
);