"use client";

import { ShieldCheck, Tag, Truck, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "100% safe & secure transactions",
  },
  {
    icon: Tag,
    title: "Best Wholesale Prices",
    desc: "Get the best prices for your business",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    desc: "Timely delivery across India with trusted partners",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "Our support team is always here to help you.",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white w-full">
      <div className="max-w-8xl mx-auto px-5 py-6">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-4 group border border-[#E5E5E5]/10 rounded-md p-4 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-md"
              >
                {/* ICON */}
                <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-md border border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/10 transition">
                  <Icon
                    size={24}
                    className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* TEXT */}
                <div>
                  <h4 className="text-sm font-semibold mb-1 group-hover:text-[#D4AF37] transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}