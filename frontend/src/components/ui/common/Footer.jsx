"use client";
import Link from "next/link";
import { Clock, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { FaLinkedin, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 text-white">
      <div className="bg-[#0B1F3A] to-[#07162A]">
        <div className="max-w-350 mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[340px_repeat(4,minmax(0,1fr))] gap-y-10 gap-x-6">
            <div className="lg:pr-6">
              <Link href="/" className="inline-block">
                <img
                  src="/LOGOKAVAS.png"
                  alt="KAVAS Logo"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </Link>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">
                India's trusted B2B wholesale platform connecting verified
                vendors with buyers across every industry.
              </p>
              <p className="mt-6 text-xs font-extrabold tracking-wide text-[#D4AF37]">
                FOLLOW US
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-white text-lg" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-white text-lg" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-white text-lg" />
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-white text-lg" />
                </a>
              </div>
            </div>
            <div className="lg:px-6">
              <h3 className="text-sm font-extrabold tracking-wide text-[#D4AF37]">
                CUSTOMER SUPPORT
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li>
                  <Link href="/shipinginfo" className="hover:text-white">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/trackorder" className="hover:text-white">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/termsandconditions" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contactus" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:px-6">
              <h3 className="text-sm font-extrabold tracking-wide text-[#D4AF37]">
                SELLER PLATFORM
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li>
                  <Link href="/vendor" className="hover:text-white">
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link href="/vendor" className="hover:text-white">
                    Vendor Registration
                  </Link>
                </li>
                <li>
                  <Link href="/vendor" className="hover:text-white">
                    Vendor Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/termsandconditions" className="hover:text-white">
                    Seller Policies
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
              </ul>
            </div>
            <div className="lg:px-6">
              <h3 className="text-sm font-extrabold tracking-wide text-[#D4AF37]">
                ABOUT US
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li>
                  <Link href="/" className="hover:text-white">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="lg:pl-1">
              <h3 className="text-sm font-extrabold tracking-wide text-[#D4AF37]">
                CONTACT US
              </h3>

              <div className="mt-4 space-y-4 text-sm text-white/75">

                <div className="flex items-start gap-3">
                  <Mail className="h-7 w-7 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <p className="text-white/80">Email</p>
                    <a
                      href="mailto:support@kavas.com"
                      className="text-white/80 hover:text-[#D4AF37] transition-colors"
                    >
                      support@kavas.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-7 w-7 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <p className="text-white/80">Phone Number</p>
                    <a
                      href="tel:+911234567890"
                      className="text-white/80 hover:text-[#D4AF37] transition-colors"
                    >
                      +91 12345 67890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="h-7 w-7 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <p className="text-white/80">Live Chat Available</p>
                    <p className="text-white">9 AM - 7 PM (Mon - Sat)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-7 w-7 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <p className="text-white/80">Business Hours</p>
                    <p className="text-white/80">9 AM - 7 PM (Mon - Sat)</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <ShieldCheck className="h-9 w-9 text-[#D4AF37]" />
              <p>
                {new Date().getFullYear()} <span className="text-[#D4AF37] font-semibold">KAVAS Wholesale Hub</span> | All Rights Reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img src="/payments/visa.svg" alt="Visa" className="h-10 w-auto" />
              <img src="/payments/mastercard.svg" alt="Mastercard" className="h-10 w-auto" />
              <img src="/payments/upi.svg" alt="UPI" className="h-10 w-auto" />
              <img src="/payments/rupay.svg" alt="RuPay" className="h-10 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;