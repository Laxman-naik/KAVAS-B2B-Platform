"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const VendorPricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "For new vendors to get started",
      featured: false,
      items: [
        "Basic storefront",
        "Product listings",
        "Enquiry management",
        "Standard support",
      ],
    },
    {
      name: "Growth",
      price: "₹1,999/mo",
      desc: "For scaling catalog & orders",
      featured: true,
      items: [
        "Everything in Starter",
        "Priority verification",
        "Advanced analytics",
        "Featured placements",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large manufacturers & brands",
      featured: false,
      items: [
        "Dedicated manager",
        "API / integrations",
        "Custom onboarding",
        "Custom reporting",
      ],
    },
  ];

  return (
    <section id="pricing" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
            Pricing
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            Simple plans for every stage
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Pick a plan and upgrade when you are ready.
          </p>
          <div className="mt-4 mx-auto h-[3px] w-10 rounded-full bg-[#D4AF37]" />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-sm border p-6 ${
                p.featured
                  ? "border-[#D4AF37] bg-[#FFF8EC] shadow-sm"
                  : "border-[#E5E5E5] bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#1A1A1A]">{p.name}</div>
                {p.featured && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-sm bg-[#0B1F3A] text-[#D4AF37]">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="mt-2 text-2xl font-bold text-[#0B1F3A]">{p.price}</div>
              <div className="mt-1 text-sm text-gray-600">{p.desc}</div>

              <div className="mt-5 grid gap-2">
                {p.items.map((x) => (
                  <div key={x} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="mt-0.5 h-5 w-5 rounded-sm bg-white border border-[#E5E5E5] flex items-center justify-center">
                      <Check size={14} className="text-[#0B1F3A]" />
                    </div>
                    <div>{x}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/vendor/vendorregister"
                  className={`inline-flex w-full items-center justify-center rounded-sm px-4 py-2 text-sm font-semibold ${
                    p.featured
                      ? "bg-[#0B1F3A] text-white hover:opacity-90"
                      : "border border-[#E5E5E5] text-[#0B1F3A] hover:bg-[#FFF8EC]"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorPricing;
