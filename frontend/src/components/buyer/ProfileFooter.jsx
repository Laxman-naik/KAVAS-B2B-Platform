"use client";

import React from "react";
import { BadgePercent, Headset, ShieldCheck, Truck } from "lucide-react";

export default function ProfileFooter() {
  const items = [
    {
      title: "Secure Payments",
      desc: "100% safe & secure\ntransactions",
      icon: ShieldCheck,
    },
    {
      title: "Best Wholesale Prices",
      desc: "Get the best prices\nfor your business",
      icon: BadgePercent,
    },
    {
      title: "Fast & Reliable Delivery",
      desc: "Timely delivery across\nIndia with trusted partners",
      icon: Truck,
    },
    {
      title: "24/7 Customer Support",
      desc: "Our support team is always\nhere to help you.",
      icon: Headset,
    },
  ];

  return (
    <div className="bg-[#0B1F3A] mt-3 rounded-sm border border-white/10">
  <div className="mx-auto  px-4 sm:px-6 lg:px-8 py-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  border-white/10">
      
      {items.map((x) => {
        const Icon = x.icon;

        return (
          <div
            key={x.title}
            className="p-5 flex items-start gap-4"
          >
            <div className="h-10 w-10 rounded-sm border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {x.title}
              </p>
              <p className="text-xs text-white/70 mt-1 whitespace-pre-line">
                {x.desc}
              </p>
            </div>
          </div>
        );
      })}

    </div>
  </div>
</div>
  );
}
