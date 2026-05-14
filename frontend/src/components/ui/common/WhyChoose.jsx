"use client";

import React from "react";
import { BadgePercent, Headset, ShieldCheck, Truck } from "lucide-react";

export default function WhyChoose() {
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
    <section className="bg-white">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center">
          <div className="text-xl font-bold tracking-widest text-[#0B1F3A] uppercase">
            Why Choose Kavas Wholesale Hub?
          </div>
        </div>

        <div className="mt-6 rounded-sm border border-black/10 bg-[#0B1F3A]">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => {
            const Icon = x.icon;

            return (
              <div
                key={x.title}
                className="flex items-start gap-3 px-4 py-4 border-b border-white/10 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <div className="h-10 w-10 shrink-0 rounded-sm border border-[#D4AF37]/35 bg-[#FFF8EC] flex items-center justify-center">
                  <Icon size={18} className="text-[#D4AF37]" />
                </div>

                <div>
                  <div className="text-sm font-extrabold text-white">
                    {x.title}
                  </div>
                  <div className="mt-1 text-xs text-white/70 whitespace-pre-line leading-relaxed">
                    {x.desc}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
