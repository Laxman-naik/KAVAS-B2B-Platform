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
    icon: <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />,
    title: "Net Banking",
    desc: "All major banks",
  },
  {
    icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />,
    title: "UPI",
    desc: "GPay, PhonePe, Paytm",
  },
  {
    icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />,
    title: "Cards",
    desc: "Visa, Mastercard, RuPay",
  },
  {
    icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />,
    title: "NEFT / RTGS",
    desc: "For large orders",
  },
  {
    icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />,
    title: "Credit Line",
    desc: "Up to ₹25L (Pro+)",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />,
    title: "256-bit SSL",
    desc: "PCI-DSS Level 1",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 sm:p-4 rounded-xl">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Secure Payments, Always
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Your money never goes directly to a supplier until your order is
            delivered and approved. Our escrow system keeps every rupee safe.
          </p>

          <div className="mt-5 sm:mt-6">
            <Link href="/signin">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl w-full sm:w-auto">
                Start Buying Securely →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              How Our Escrow Works
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Simple, transparent, buyer-first
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {/* 🔥 changed blue line → orange */}
            <div className="hidden xl:block absolute top-8 left-[8%] right-[8%] h-0.5 bg-orange-200 z-0" />

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative z-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 text-center h-full"
              >
                {/* 🔥 changed step circle */}
                <div className="mx-auto mb-3 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold">
                  {step.id}
                </div>

                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-2 min-h-10 flex items-center justify-center">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENTS */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 md:pb-14">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-5 sm:mb-6 text-gray-900 flex items-center gap-2">
            💳 Accepted Payment Methods
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {payments.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 sm:gap-4 border border-gray-200 rounded-xl px-4 py-4 bg-gray-50 hover:shadow-sm transition h-full"
              >
                <div className="shrink-0 mt-0.5">{item.icon}</div>

                <div>
                  <h4 className="font-medium text-sm sm:text-base text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
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

export default Page;