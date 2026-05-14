"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import VendorNavbar from "./VendorNavbar";
import VendorFeatures from "./VendorFeatures";
import VendorBenefits from "./VendorBenefits";
import VendorPricing from "./VendorPricing";
import VendorReviews from "./VendorReviews";
import VendorFooter from "./VendorFooter";

const VendorLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <VendorNavbar />

      <section className="bg-[#FFF8EC]">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-6">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold leading-tight text-[#0B1F3A]">
                Grow Your Business
                <br />
                with Kavas
              </h1>

              <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl">
                Everything you need to list, manage and grow your online business
                — all in one powerful platform.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/vendor/vendorlogin"
                  className="inline-flex items-center justify-center rounded-sm bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Login to Seller Hub
                </Link>

                <Link
                  href="/vendor/vendorregister"
                  className="inline-flex items-center justify-center rounded-sm border border-[#0B1F3A]/25 bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={16} className="text-[#0B1F3A]" />
                Trusted by lakhs of sellers across India
              </div>
            </div>


            <div className="lg:col-span-6">
              <div className="relative">
                <div className="absolute inset-0 -z-10 blur-2xl opacity-40 bg-[#0B1F3A]/10" />
                <div className="rounded-sm border border-[#E5E5E5] bg-white shadow-lg overflow-hidden">
                  <Image
                    src="/vendorlandingimage.png"
                    alt="Vendor dashboard"
                    width={1100}
                    height={700}
                    className="h-auto w-full"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* STATS SECTION */}
        <div className="bg-[#0B1F3A] rounded-2xl max-w-350 mx-auto mt-6">
          <div className="px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { k: "2L+", v: "Active Sellers" },
                { k: "5Cr+", v: "Products Listed" },
                { k: "98%", v: "Payment Success" },
                { k: "48hr", v: "Avg. Payout Time" },
              ].map((m) => (
                <div key={m.v} className="text-center">
                  <div className="text-2xl font-extrabold text-[#D4AF37]">
                    {m.k}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-white/75">
                    {m.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VendorFeatures />
      <VendorBenefits />
      {/* <VendorPricing /> */}
      <VendorReviews />
      <VendorFooter />
    </div>
  );
};

export default VendorLanding;
