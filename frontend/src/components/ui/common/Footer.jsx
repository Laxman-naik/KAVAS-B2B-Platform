"use client";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-white">
      <div className="bg-[#0B1F3A]">
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
              <p className="mt-4 text-sm text-white/75 leading-relaxed max-w-sm">
                Your trusted wholesale partner for quality products at the best prices.
                Built for businesses, delivered with trust.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-white text-lg" />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-white text-lg" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-white text-lg" />
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center hover:border-[#D4AF37]/70 hover:bg-white/10 transition"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-white text-lg" />
                </a>
              </div>
            </div>
            <div className="lg:px-6">
              <h3 className="text-sm font-extrabold tracking-wide text-white">Quick Links</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                <li>
                  <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-[#D4AF37] transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/flashdeals" className="hover:text-[#D4AF37] transition-colors">
                    Flash Deals
                  </Link>
                </li>
                {/* <li>
                  <Link href="/help" className="hover:text-[#D4AF37] transition-colors">
                    Bulk Orders
                  </Link>
                </li> */}
                <li>
                  <Link href="/trackorder" className="hover:text-[#D4AF37] transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/aboutus" className="hover:text-[#D4AF37] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contactus" className="hover:text-[#D4AF37] transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:px-6">
              <h3 className="text-sm font-extrabold tracking-wide text-white">Customer Service</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                <li>
                  <Link href="/help" className="hover:text-[#D4AF37] transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/shipinginfo" className="hover:text-[#D4AF37] transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termsandconditions"
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refundpolicy" className="hover:text-[#D4AF37] transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-[#D4AF37] transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:px-6">
              <h3 className="text-sm font-extrabold tracking-wide text-white">My Account</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                <li>
                  <Link href="/profile" className="hover:text-[#D4AF37] transition-colors">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buyerorders"
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link href="/favourites" className="hover:text-[#D4AF37] transition-colors">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vendor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Become a Seller
                  </Link>
                </li>
                <li>
                  {/* <Link
                    href="/signin"
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    Login / Register
                  </Link> */}
                </li>
              </ul>
            </div>

            <div className="lg:pl-1">
              <h3 className="text-sm font-extrabold tracking-wide text-white">Contact Us</h3>

              <div className="mt-4 space-y-3 text-sm text-white/75">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <a
                    href="tel:+916302259849"
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    +91 6302259849
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <a
                    href="mailto:info@kavaswholesalehub.com"
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    info@kavaswholesalehub.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="text-white/75">
                    <div>Kavas Wholesale Hub</div>
                    <div>Hyderabad, Telangana,</div>
                    <div>India - 500001</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-350 mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white/75">
              <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
              <p>
                {new Date().getFullYear()} Kavas Wholesale Hub. All Rights Reserved.
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-sm text-white/75">We Accept</span>
              <div className="flex items-center gap-3">
                <img src="/visa.png" alt="Visa" className="h-9 w-16 object-contain bg-white rounded-sm p-1" />
                <img src="/Mastercardlogo.svg.png" alt="Mastercard" className="h-9 w-16 object-contain bg-white rounded-sm p-1" />
                <img src="/RuPay.svg.png" alt="RuPay" className="h-9 w-16 object-contain bg-white rounded-sm p-1" />
                <img src="/UPIlogo.svg.png" alt="UPI" className="h-9 w-16 object-contain bg-white rounded-sm p-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;