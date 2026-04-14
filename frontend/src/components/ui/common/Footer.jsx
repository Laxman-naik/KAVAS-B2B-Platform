"use client";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#063149] dark:bg-gray-900 mt-10 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:flex lg:justify-between lg:gap-6 gap-8">
        <div className="md:col-span-2">
          <img
            src="/LOGOKAVAS.png"
            alt="KAVAS Logo"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain cursor-pointer"
          />
          <p className="text-gray-400 mt-3 text-[14px] leading-relaxed">
            India's trusted B2B wholesale platform connecting verified vendors<br />
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
          <h3 className="font-bold text-[14px] text-white dark:text-white mb-3">For Buyers</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Browse products</li>
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">My cart</li>
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Membership</li>
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Flash deals</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-white dark:text-white mb-3">For Vendors</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <Link href="/vendor">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Sell on Kavas</li>
            </Link>
             <Link
            href="/suppliers/verified">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Supplier directory</li>
            </Link>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-white dark:text-white mb-3">Company</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">About us</li>
            <Link href="/help">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Help centre</li>
            </Link>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[14px] text-white dark:text-white mb-3">Legal</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Privacy policy</li>
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Terms of use</li>
            <Link href="/shipinginfo">
            <li className="hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer">Shipping info</li>
            </Link>
          </ul>
        </div>
      </div>
      <div className="bg-[#063149] dark:bg-black dark:text-gray-400 text-sm border-t border-gray-300 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white">© {new Date().getFullYear()} Kavas Technologies Pvt. Ltd.</p>
          <div className="flex gap-4">
            <span className="text-white cursor-pointer">Privacy</span>
            <span className="text-white cursor-pointer">Terms</span>
            <span className="text-white cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const Icon = ({ children }) => (
  <div className="w-8 h-8 flex items-center justify-center border rounded-md bg-white cursor-pointer transition hover:scale-105 hover:border-orange-500">
    {children}
  </div>
);