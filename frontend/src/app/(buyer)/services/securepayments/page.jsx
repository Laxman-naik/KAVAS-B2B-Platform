"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Landmark,
  CreditCard,
  Smartphone,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const page = () => {
  const steps = [
    {
      id: 1,
      title: "You Pay Kavas",
      desc: "Funds held in our secure escrow — never sent directly to supplier",
    },
    {
      id: 2,
      title: "Order Dispatched",
      desc: "Supplier ships only after payment is confirmed in escrow",
    },
    {
      id: 3,
      title: "You Approve",
      desc: "Inspect goods within 48 hours. Raise a dispute if anything is wrong",
    },
    {
      id: 4,
      title: "Supplier Paid",
      desc: "Funds released to supplier only after your approval",
    },
  ];

  const payments = [
    {
      icon: <Landmark className="w-6 h-6 text-gray-600" />,
      title: "Net Banking",
      desc: "All major banks",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-gray-600" />,
      title: "UPI",
      desc: "GPay, PhonePe, Paytm",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-gray-600" />,
      title: "Cards",
      desc: "Visa, Mastercard, RuPay",
    },
    {
      icon: <FileText className="w-6 h-6 text-gray-600" />,
      title: "NEFT / RTGS",
      desc: "For large orders",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-gray-600" />,
      title: "Credit Line",
      desc: "Up to ₹25L (Pro+)",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gray-600" />,
      title: "256-bit SSL",
      desc: "PCI-DSS Level 1",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">

      {/* 🔵 Banner */}
      <div className="bg-blue-600 text-white py-12 sm:py-14 md:py-16 px-4 sm:px-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-3 sm:p-4 rounded-full">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Secure Payments, Always
        </h1>

        <p className="mt-4 text-sm sm:text-base max-w-xl mx-auto text-gray-200">
          Your money never goes directly to a supplier until your order is delivered and approved.
          Our escrow system keeps every rupee safe.
        </p>

        <Link href="/signin">
          <Button className="mt-6 bg:white px-5 sm:px-6 py-2 text-sm sm:text-base">
            Start Buying Securely →
          </Button>
        </Link>
      </div>

      {/* ⚪ Escrow Steps */}
      <div className="py-10 sm:py-12 md:py-14 px-4 sm:px-6 md:px-10 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          How Our Escrow Works
        </h2>

        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Simple, transparent, buyer-first
        </p>

        {/* GRID FIX (IMPORTANT) */}
        <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* LINE (only desktop) */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-blue-200 z-0" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 bg-white rounded-xl shadow-sm border p-5 sm:p-6 text-center"
            >
              <div className="mx-auto mb-3 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {step.id}
              </div>

              <h3 className="font-semibold text-sm sm:text-base lg:text-lg">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 💳 Payments */}
      <div className="px-4 sm:px-6 md:px-10 pb-12 md:pb-16">
        <div className="bg-white rounded-xl border p-5 sm:p-6 md:p-8 max-w-6xl mx-auto">

          <h3 className="text-base sm:text-lg font-semibold mb-6 flex items-center gap-2">
            💳 Accepted Payment Methods
          </h3>

          {/* GRID FIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {payments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 border rounded-lg px-3 sm:px-4 py-3 sm:py-4 bg-yellow-50 hover:shadow-sm transition"
              >
                <div>{item.icon}</div>
                <div>
                  <h4 className="font-medium text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BACK */}
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

export default page;
