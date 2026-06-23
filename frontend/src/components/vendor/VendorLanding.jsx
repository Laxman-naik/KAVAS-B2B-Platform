"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import VendorNavbar from "./VendorNavbar";
import VendorFeatures from "./VendorFeatures";
import VendorBenefits from "./VendorBenefits";
import VendorReviews from "./VendorReviews";
import VendorFooter from "./VendorFooter";

const VendorLanding = () => {
  const stats = [
    { k: "2L+", v: "Active Sellers" },
    { k: "5Cr+", v: "Products Listed" },
    { k: "98%", v: "Payment Success" },
    { k: "48hr", v: "Avg. Payout Time" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <VendorNavbar />

      <section className="relative overflow-hidden bg-[#FFF8EC]">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#0B1F3A]/10 blur-3xl" />

        <div className="relative mx-auto max-w-360 px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-white px-4 py-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D4AF37]">
                  Kavas Seller Hub
                </span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[52px] font-extrabold leading-tight text-[#0B1F3A]">
                Grow Your Wholesale
                <br />
                Business with Kavas
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-gray-600">
                Everything you need to list products, manage orders, receive
                secure payments, and grow your online wholesale business from one
                professional seller platform.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/vendor/vendorregister"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Start Selling Now
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/vendor/vendorlogin"
                  className="inline-flex items-center justify-center rounded-sm border border-[#0B1F3A]/25 bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#FFF8EC]"
                >
                  Login to Seller Hub
                </Link>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CheckCircle2 size={17} className="text-[#0B1F3A]" />
                  Verified buyers across India
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CheckCircle2 size={17} className="text-[#0B1F3A]" />
                  Secure payouts and order tracking
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-[#0B1F3A]/10 blur-2xl" />

                <div className="relative overflow-hidden rounded-xl border border-[#E5E5E5] bg-white p-3 shadow-2xl">
                  <Image
                    src="/vendorlandingimage.png"
                    alt="Vendor dashboard"
                    width={1100}
                    height={700}
                    className="h-auto w-full rounded-lg"
                    priority
                  />
                </div>

                <div className="absolute -bottom-5 left-6 rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 shadow-lg">
                  <div className="text-xs font-semibold text-gray-500">
                    Monthly Growth
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-[#0B1F3A]">
                    +42%
                  </div>
                </div>

                <div className="absolute -right-2 top-6 hidden rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 shadow-lg sm:block">
                  <div className="text-xs font-semibold text-gray-500">
                    New Orders
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-[#D4AF37]">
                    1,250+
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-xl bg-[#0B1F3A] px-4 py-8 shadow-lg sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((item) => (
                <div key={item.v} className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">
                    {item.k}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-semibold text-white/75">
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VendorFeatures />
      <VendorBenefits />
      <VendorReviews />
      <VendorFooter />
    </div>
  );
};

export default VendorLanding;