"use client";
import React from "react";
import { CheckCircle, Lock, Truck, Handshake, RefreshCcw } from "lucide-react";
import Link from "next/link";

const TrustedSlide = () => {
  const items = [
    {
      icon: <CheckCircle className="text-green-600 w-6 h-6" />,
      title: "Verified Suppliers",
      desc: "Every vendor vetted",
      desc1: "Learn More",
      bg: "bg-green-100",
      color: "bg-green-50",
      link: "/services/suppliers",
    },
    {
      icon: <Lock className="text-yellow-600 w-6 h-6" />,
      title: "Secure Payments",
      desc: "Escrow on all orders",
      desc1: "Learn More",
      bg: "bg-yellow-100",
      color: "bg-yellow-50",
      link: "/services/securepayments",
    },
    {
      icon: <Truck className="text-orange-600 w-6 h-6" />,
      title: "Pan-India Delivery",
      desc: "Across 28 states",
      desc1: "Learn More",
      bg: "bg-orange-100",
      color: "bg-orange-50",
      link: "/services/delivery",
    },
    {
      icon: <Handshake className="text-yellow-700 w-6 h-6" />,
      title: "Dedicated Support",
      desc: "Account manager",
      desc1: "Learn More",
      bg: "bg-yellow-100",
      color: "bg-yellow-50",
      link: "/services/support",
    },
    {
      icon: <RefreshCcw className="text-green-600 w-6 h-6" />,
      title: "Easy Returns",
      desc: "Hassle-free",
      desc1: "Learn More",
      bg: "bg-green-100",
      color: "bg-green-50",
      link: "/services/returns",
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">


        <h1 className="text-xl md:text-2xl font-semibold border-l-4 pl-2 border-orange-500 mb-6">
          Our Services
        </h1>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">

          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center gap-3 
                            p-4 sm:p-5 rounded-xl shadow-sm
                            hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${item.color}`}
            >
              <div className={`p-2 sm:p-3 rounded-lg ${item.bg}`}>
                {item.icon}
              </div>

              <p className="font-semibold text-sm">
                {item.title}
              </p>

              <p className="text-xs text-gray-500">
                {item.desc}
              </p>
              <Link href={item.link}>
                <p className="text-xs text-gray-600 cursor-pointer hover:underline">
                  {item.desc1} →
                </p>
              </Link>
            </div>
          ))}

        </div>

      </div>

    </div>

  );
};

export default TrustedSlide;