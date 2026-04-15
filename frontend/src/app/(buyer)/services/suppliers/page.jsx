"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ShieldCheck,
  Building2,
  UserCheck,
  Factory,
  PackageCheck,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Business Registration",
    desc: "GST, MSME, or ROC certificate verified by our compliance team",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "KYC & Identity Check",
    desc: "Aadhaar / PAN of authorized signatory cross-referenced",
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Factory / Warehouse Audit",
    desc: "Physical or video inspection of facility",
    icon: <Factory className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Product Sample Review",
    desc: "Quality and compliance checks",
    icon: <PackageCheck className="w-5 h-5" />,
  },
  {
    id: 5,
    title: "Trade Reference Check",
    desc: "Minimum 3 buyer references verified",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: 6,
    title: "Pricing Audit",
    desc: "Ensures competitive wholesale pricing",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 7,
    title: "Ongoing Monitoring",
    desc: "Quarterly audits + AI monitoring",
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 rounded-2xl p-3 sm:p-4 shadow-sm">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Verified Suppliers Only
            </h1>

            <p className="mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2">
              Every supplier goes through a strict 7-step verification process.
            </p>

            <div className="mt-5 sm:mt-6">
              <Link href="/suppliers/verified">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl w-full sm:w-auto">
                  Browse Verified Suppliers →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              Our 7-Step Verification Process
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Every supplier passes all 7 gates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {steps.map((step) => (
              <Card
                key={step.id}
                className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-full"
              >
                <CardContent className="p-4 sm:p-5 md:p-6 text-center h-full flex flex-col justify-start">
                  <div className="flex justify-center mb-3">
                    <div className="bg-orange-500 text-white w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full font-semibold text-sm sm:text-base">
                      {step.id}
                    </div>
                  </div>

                  <div className="flex justify-center mb-3 text-orange-600">
                    {step.icon}
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base md:text-[17px] text-gray-900 mb-2 leading-snug min-h-10 flex items-center justify-center">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}

            <Card className="rounded-2xl border-2 border-orange-400 bg-orange-50 shadow-sm h-full">
              <CardContent className="p-4 sm:p-5 md:p-6 text-center h-full flex flex-col items-center justify-center">
                <BadgeCheck className="w-10 h-10 sm:w-11 sm:h-11 text-orange-600 mb-3" />
                <h3 className="font-semibold text-orange-700 text-sm sm:text-base md:text-[17px] mb-2">
                  Verified Badge Earned
                </h3>
                <p className="text-xs sm:text-sm text-orange-600 leading-relaxed">
                  Only 1 in 4 applicants qualify
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 sm:px-6 lg:px-8 pt-2 pb-10 sm:pb-12 md:pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white border border-orange-200 rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 sm:gap-x-6 text-center">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">
                  12,400+
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Verified Suppliers
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">
                  98.7%
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Success Rate
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">
                  &lt;0.3%
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Fraud Rate
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">
                  24 hrs
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Verification Time
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5 sm:mt-6">
            <Link href="/">
              <Button
                variant="outline"
                className="text-sm sm:text-base rounded-xl px-5 sm:px-6 w-full sm:w-auto"
              >
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;