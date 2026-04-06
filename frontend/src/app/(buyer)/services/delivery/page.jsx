"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Truck, Zap, Package, Warehouse } from "lucide-react";
import Link from "next/link";

const DeliveryPage = () => {
  const deliveryModes = [
    {
      icon: <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />,
      title: "Express Delivery",
      time: "1–2 Business Days",
      desc: "Metro cities & tier-1 towns. Priority handling, real-time tracking. Ideal for urgent restocking.",
      price: "From ₹80/kg",
      highlight: false,
    },
    {
      icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />,
      title: "Standard Delivery",
      time: "3–5 Business Days",
      desc: "Nationwide. Full tracking, SMS updates, doorstep delivery to warehouse or shop.",
      price: "From ₹45/kg",
      highlight: true,
    },
    {
      icon: <Warehouse className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />,
      title: "Freight / Bulk",
      time: "5–10 Business Days",
      desc: "Heavy machinery, full truckloads, palletized goods. Dedicated logistics partner assigned.",
      price: "Custom quote",
      highlight: false,
    },
  ];

  const partners = [
    "Delhivery",
    "Blue Dart",
    "DTDC",
    "Ecom Express",
    "Xpressbees",
    "FedEx India",
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* 🔵 Banner */}
      <div className="bg-orange-500 text-white text-center py-12 sm:py-16 px-4 sm:px-6">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-3 sm:p-4 rounded-full">
            <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Pan-India Delivery Network
        </h1>

        <p className="mt-3 sm:mt-4 max-w-xl mx-auto text-xs sm:text-sm md:text-base text-gray-200">
          From Leh to Kanyakumari — we deliver to every district across 28 states
          and 8 Union Territories. Bulky or fragile, we've got it covered.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-5 sm:mt-6">
          <span className="bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
            🗺️ 28 States + 8 UTs
          </span>
          <span className="bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
            📦 800+ Pin Codes
          </span>
          <span className="bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
            ⚡ 2-Day Express
          </span>
        </div>
      </div>

      {/* 🚚 Delivery Modes */}
      <div className="py-10 sm:py-14 px-4 sm:px-6 md:px-10 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Choose Your Delivery Mode
        </h2>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">

          {deliveryModes.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-xl border p-5 sm:p-6 md:p-8 text-center transition 
              ${item.highlight
                  ? "bg-yellow-50 border-orange-400 shadow-md sm:scale-105"
                  : "bg-white border-yellow-300 hover:shadow-sm"
                }`}
            >
              {/* Badge */}
              {item.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] sm:text-xs px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}

              <div className="flex justify-center mb-3 sm:mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-base sm:text-lg">
                {item.title}
              </h3>

              <p className="text-orange-600 font-bold text-lg sm:text-xl mt-2">
                {item.time}
              </p>

              <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
                {item.desc}
              </p>

              <p className="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🤝 Partners */}
      <div className="px-4 sm:px-6 md:px-10 pb-12 sm:pb-16">
        <div className="bg-white rounded-xl border p-5 sm:p-6 md:p-8 max-w-5xl mx-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            🤝 Our Logistics Partners
          </h3>

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            {partners.map((partner, i) => (
              <span
                key={i}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg bg-yellow-50 text-xs sm:text-sm hover:shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/">
            <Button variant="outline" className="px-5 sm:px-6 text-sm sm:text-base">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
