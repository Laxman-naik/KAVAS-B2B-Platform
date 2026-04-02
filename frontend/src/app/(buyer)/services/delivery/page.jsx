"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Truck, Zap, Package, Warehouse } from "lucide-react";
import Link from "next/link";

const DeliveryPage = () => {
  const deliveryModes = [
    {
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: "Express Delivery",
      time: "1–2 Business Days",
      desc: "Metro cities & tier-1 towns. Priority handling, real-time tracking. Ideal for urgent restocking.",
      price: "From ₹80/kg",
      highlight: false,
    },
    {
      icon: <Package className="w-8 h-8 text-orange-500" />,
      title: "Standard Delivery",
      time: "3–5 Business Days",
      desc: "Nationwide. Full tracking, SMS updates, doorstep delivery to warehouse or shop.",
      price: "From ₹45/kg",
      highlight: true,
    },
    {
      icon: <Warehouse className="w-8 h-8 text-orange-500" />,
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

      {/* 🔵 Gradient Banner */}
      <div className="bg-orange-500 text-white text-center py-16 px-6">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Truck className="w-8 h-8 text-yellow-300" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">
          Pan-India Delivery Network
        </h1>

        <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-gray-200">
          From Leh to Kanyakumari — we deliver to every district across 28 states
          and 8 Union Territories. Bulky or fragile, we've got it covered.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <span className="bg-white/10 px-4 py-2 rounded-lg text-sm">
            🗺️ 28 States + 8 UTs
          </span>
          <span className="bg-white/10 px-4 py-2 rounded-lg text-sm">
            📦 800+ Pin Codes
          </span>
          <span className="bg-white/10 px-4 py-2 rounded-lg text-sm">
            ⚡ 2-Day Express
          </span>
        </div>
      </div>

      {/* 🚚 Delivery Modes */}
      <div className="py-14 px-4 md:px-10 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Choose Your Delivery Mode
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {deliveryModes.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-xl border p-8 text-center transition 
              ${item.highlight
                  ? "bg-yellow-50 border-orange-400 shadow-md scale-105"
                  : "bg-white border-yellow-300 hover:shadow-sm"
                }`}
            >
              {/* Badge */}
              {item.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}

              <div className="flex justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-lg">{item.title}</h3>

              <p className="text-orange-600 font-bold text-xl mt-2">
                {item.time}
              </p>

              <p className="text-gray-500 text-sm mt-3">
                {item.desc}
              </p>

              <p className="text-gray-400 text-sm mt-4">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🤝 Logistics Partners */}
      <div className="px-4 md:px-10 pb-16">
        <div className="bg-white rounded-xl border p-6 md:p-8 max-w-5xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            🤝 Our Logistics Partners
          </h3>

          <div className="flex flex-wrap gap-3">
            {partners.map((partner, i) => (
              <span
                key={i}
                className="px-4 py-2 border rounded-lg bg-yellow-50 text-sm hover:shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Link href="/">
          <Button variant="outline" className="px-6">
            ← Back to Home
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;