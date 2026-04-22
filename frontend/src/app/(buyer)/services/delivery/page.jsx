"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Truck, Zap, Package, Warehouse } from "lucide-react";
import Link from "next/link";

const deliveryModes = [
  {
    icon: <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />,
    title: "Express Delivery",
    time: "1–2 Business Days",
    desc: "Metro cities & tier-1 towns. Priority handling, real-time tracking. Ideal for urgent restocking.",
    price: "From ₹80/kg",
    highlight: false,
  },
  {
    icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />,
    title: "Standard Delivery",
    time: "3–5 Business Days",
    desc: "Nationwide. Full tracking, SMS updates, doorstep delivery to warehouse or shop.",
    price: "From ₹45/kg",
    highlight: true,
  },
  {
    icon: <Warehouse className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />,
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

const DeliveryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
    
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 sm:p-4 rounded-xl">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Pan-India Delivery Network
          </h1>

          <p className="mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-1">
            From Leh to Kanyakumari — we deliver to every district across 28
            states and 8 Union Territories. Bulky or fragile, we&apos;ve got it
            covered.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-5 sm:mt-6">
            <span className="bg-orange-50 border border-orange-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-gray-700">
              🗺️ 28 States + 8 UTs
            </span>
            <span className="bg-orange-50 border border-orange-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-gray-700">
              📦 800+ Pin Codes
            </span>
            <span className="bg-orange-50 border border-orange-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-gray-700">
              ⚡ 2-Day Express
            </span>
          </div>
        </div>
      </section>

      {/* DELIVERY MODES */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              Choose Your Delivery Mode
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Flexible options for every order size
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {deliveryModes.map((item, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-4 sm:p-5 md:p-6 text-center transition h-full ${
                  item.highlight
                    ? "bg-orange-50 border-orange-400 shadow-md"
                    : "bg-white border-gray-200 hover:shadow-sm"
                }`}
              >
                {item.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] sm:text-xs px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}

                <div className="flex justify-center mb-3 sm:mb-4">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 min-h-10 flex items-center justify-center">
                  {item.title}
                </h3>

                <p className="text-orange-600 font-bold text-lg sm:text-xl">
                  {item.time}
                </p>

                <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed">
                  {item.desc}
                </p>

                <p className="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 md:pb-14">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-5 sm:mb-6 text-gray-900 flex items-center gap-2">
            <span>🤝</span>
            <span>Our Logistics Partners</span>
          </h3>

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            {partners.map((partner, i) => (
              <span
                key={i}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs sm:text-sm text-gray-700 hover:shadow-sm transition"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-5 sm:mt-6">
          <Link href="/">
            <Button
              variant="outline"
              className="px-5 sm:px-6 text-sm sm:text-base rounded-xl w-full sm:w-auto"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DeliveryPage;