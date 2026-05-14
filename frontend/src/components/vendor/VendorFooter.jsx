"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const VendorFooter = () => {
  return (
    <footer className="border-t border-[#E5E5E5] bg-[#0B1F3A]">
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/LOGOKAVAS.png"
              alt="KAVAS"
              width={130}
              height={40}
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <div className="text-[10px] font-semibold tracking-wide text-[#0B1F3A]">
                SELLER HUB
              </div>
              <div className="mt-1 text-xs text-gray-500">
                © {new Date().getFullYear()} Kavas. All rights reserved.
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-gray-600">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/termsandconditions" className="hover:text-white">
              Terms & Conditions
            </Link>
            <a href="#" className="hover:text-white">
              Seller Policy
            </a>
            <Link href="/help" className="hover:text-white">
              Help Center
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {[ 
              { Icon: FaFacebook, href: "#", label: "Facebook" },
              { Icon: FaInstagram, href: "#", label: "Instagram" },
              { Icon: FaYoutube, href: "#", label: "YouTube" },
              { Icon: FaLinkedin, href: "#", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] text-gray-600 hover:bg-[#FFF8EC] hover:text-[#0B1F3A]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VendorFooter;
