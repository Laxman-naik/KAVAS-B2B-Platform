"use client";

import React from "react";
import {
  BarChart3,
  Boxes,
  Megaphone,
  ShieldCheck,
  ShoppingCart,
  Headset,
} from "lucide-react";

const VendorFeatures = () => {
  const items = [
    {
      icon: Boxes,
      title: "Easy Product Management",
      desc: "Add, update and manage your catalog with ease.",
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#4F46E5]",
    },
    {
      icon: ShoppingCart,
      title: "Order Management",
      desc: "Process orders efficiently and deliver on time.",
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#10B981]",
    },
    {
      icon: BarChart3,
      title: "Business Insights",
      desc: "Track performance and grow with smart insights.",
      iconBg: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
    },
    {
      icon: ShieldCheck,
      title: "Secure payments",
      desc: "Get paid securely and manage your earnings.",
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
    },
    {
      icon: Megaphone,
      title: "Advertising Tools",
      desc: "Boost visibility and increase your sales.",
      iconBg: "bg-[#FCE7F3]",
      iconColor: "text-[#DB2777]",
    },
    {
      icon: Headset,
      title: "24/7 Seller Support",
      desc: "We are here to help you at every step.",
      iconBg: "bg-[#ECFEFF]",
      iconColor: "text-[#06B6D4]",
    },
  ];

  return (
    <section id="features" className="bg-[#FFF8EC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            Everything You Need to Succeed
          </h2>
          <div className="mt-3 mx-auto h-0.75 w-10 rounded-full bg-[#D4AF37]" />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {items.map((x) => {
            const Icon = x.icon;
            return (
              <div
                key={x.title}
                className="rounded-sm border border-[#E5E5E5] bg-white px-4 py-6 text-center shadow-[0_1px_0_rgba(0,0,0,0.02)] hover:shadow-sm transition-shadow"
              >
                <div className={`mx-auto h-12 w-12 rounded-full ${x.iconBg} flex items-center justify-center`}>
                  <Icon size={20} className={x.iconColor} />
                </div>

                <div className="mt-4 text-sm font-semibold text-[#1A1A1A]">
                  {x.title}
                </div>
                <div className="mt-2 text-xs leading-relaxed text-gray-500">
                  {x.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VendorFeatures;
