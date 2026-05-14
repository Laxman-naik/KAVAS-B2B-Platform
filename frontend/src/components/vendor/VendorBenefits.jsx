"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, Building2, Headset, IndianRupee, MapPin } from "lucide-react";

const VendorBenefits = () => {
  const items = [
    {
      icon: BadgeCheck,
      title: "GST-Ready Invoicing",
      desc: "Auto-generate GST-compliant invoices for every order.",
    },
    {
      icon: IndianRupee,
      title: "Fast Payouts",
      desc: "Get paid within 48 hours directly to your bank account.",
    },
    {
      icon: MapPin,
      title: "Pan-India Reach",
      desc: "Sell to buyers across India with strong logistics support.",
    },
    {
      icon: Building2,
      title: "Dedicated Account Manager",
      desc: "Gold sellers get a personal account manager for growth support.",
    },
  ];

  return (
    <section id="benefits" className="bg-[#FFF8EC] py-14">
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-sm border border-[#E5E5E5] bg-white">
              <Image
                src="/vendor-benefits.jpg"
                alt="Vendor success"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
              Why Choose Kavas
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
              Built for Indian Wholesalers & Sellers
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl">
              Kavas Seller Hub is designed from the ground up for the unique needs of
              Indian B2B sellers — from GST compliance to fast payouts.
            </p>

            <div className="mt-6 grid gap-4">
              {items.map((x) => {
                const Icon = x.icon;
                return (
                  <div key={x.title} className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-10 rounded-sm bg-[#F3F5F9] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">
                        {x.title}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">{x.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-sm bg-[#0B1F3A] flex items-center justify-center shrink-0">
                  <Headset size={18} className="text-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0B1F3A]">24/7 Seller Support</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Our support team is always here to help you.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorBenefits;
