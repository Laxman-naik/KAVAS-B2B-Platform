"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Users } from "lucide-react";

const AboutUsPage = () => {
  return (
    <div className="min-h-[70vh] bg-[#FFF8EC]">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="rounded-2xl bg-[#0B1F3A] px-6 py-8 sm:px-10 sm:py-10 text-[#FFF8EC] shadow-sm">
          <div className="text-sm text-white/80">KAVAS Wholesale Hub</div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
            About Us
          </h1>
          <p className="mt-3 max-w-3xl text-white/85 leading-relaxed">
            We help businesses source quality products at competitive wholesale
            prices with a smooth ordering experience, reliable fulfilment, and
            responsive support.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#caa734]"
            >
              Continue Shopping
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Help & Support
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-[#ECFFF6] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-700" />
            </div>
            <div className="mt-4 font-extrabold text-[#0B1F3A]">Trusted Platform</div>
            <div className="mt-2 text-sm text-[#0B1F3A]/70">
              Built for B2B buyers with verified suppliers and dependable service.
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-[#EAF3FF] flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-700" />
            </div>
            <div className="mt-4 font-extrabold text-[#0B1F3A]">Reliable Fulfilment</div>
            <div className="mt-2 text-sm text-[#0B1F3A]/70">
              Track orders easily and get updates from dispatch to delivery.
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-[#F3EEFF] flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-700" />
            </div>
            <div className="mt-4 font-extrabold text-[#0B1F3A]">Business First</div>
            <div className="mt-2 text-sm text-[#0B1F3A]/70">
              MOQ-friendly catalog and pricing designed for repeat procurement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
