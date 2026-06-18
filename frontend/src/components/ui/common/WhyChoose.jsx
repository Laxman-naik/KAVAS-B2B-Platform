"use client";

import React from "react";
import { BadgePercent, Headset, ShieldCheck, Truck } from "lucide-react";

const WhyChoose = () => {
  const items = [
    {
      title: "Secure Payments",
      desc: "100% safe & secure transactions with encrypted payment gateways.",
      icon: ShieldCheck,
    },
    {
      title: "Best Wholesale Prices",
      desc: "Get the best prices for your business with direct supplier pricing.",
      icon: BadgePercent,
    },
    {
      title: "Fast & Reliable Delivery",
      desc: "Timely delivery across India with trusted logistics partners.",
      icon: Truck,
    },
    {
      title: "24/7 Customer Support",
      desc: "Our support team is always here to help you with any queries.",
      icon: Headset,
    },
  ];

  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-wide text-[#0B1F3A] uppercase">
            Why Choose Kavas Wholesale Hub?
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  bg-[#0B1F3A]
                  rounded-xl
                  p-4
                  flex
                  items-center
                  gap-3
                  border
                  border-[#D4AF37]/20
                  shadow-sm
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  min-h-[135px]
                "
              >
                {/* Icon */}
                <div className="h-12 w-12 shrink-0 rounded-lg bg-[#FFF8EC] flex items-center justify-center">
                  <Icon size={20} className="text-[#D4AF37]" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[11px] text-white/75 leading-5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;