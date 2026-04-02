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
    <div className="w-full min-h-screen bg-gray-100">

      {/* 🔵 Top Banner */}
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Lock className="w-8 h-8 text-yellow-300" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">
          Secure Payments, Always
        </h1>

        <p className="mt-4 text-sm md:text-base max-w-xl mx-auto text-gray-200">
          Your money never goes directly to a supplier until your order is delivered and approved.
          Our escrow system keeps every rupee safe.
        </p>
<Link href="/signin">
        <Button className="mt-6  text-blue-700  px-6 py-2 rounded-lg">
          Start Buying Securely →
        </Button>
        </Link>
      </div>

      {/* ⚪ Escrow Steps */}
      <div className="py-14 px-4 md:px-10 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          How Our Escrow Works
        </h2>
        <p className="text-gray-500 mt-2">
          Simple, transparent, buyer-first
        </p>

       
        <div className="relative mt-10 flex flex-col md:flex-row items-center justify-between gap-6">

         
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-blue-200 z-0" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 bg-white rounded-xl shadow-sm border w-full md:w-[23%] p-6 text-center"
            >
              <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {step.id}
              </div>

              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 💳 Payment Methods */}
      <div className="px-4 md:px-10 pb-16">
        <div className="bg-white rounded-xl border p-6 md:p-8 max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            💳 Accepted Payment Methods
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {payments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border rounded-lg px-4 py-4 bg-yellow-50 hover:shadow-sm transition"
              >
                <div>{item.icon}</div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
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

export default page;