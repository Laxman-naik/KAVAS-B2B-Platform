"use client";

import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Raise Request",
    desc: 'Log in → My Orders → tap "Return / Dispute" within 7 days of delivery',
  },
  {
    id: 2,
    title: "Quick Review",
    desc: "Our team reviews your request and approves eligible returns within 4 business hours",
  },
  {
    id: 3,
    title: "Free Pickup",
    desc: "We arrange doorstep pickup at no cost. Just have the goods ready and packed",
  },
  {
    id: 4,
    title: "Refund in 72 hrs",
    desc: "Full refund to original payment method within 72 hours of pickup",
  },
];

export default function ReturnsPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 text-center">
        <div className="text-3xl sm:text-4xl mb-4">♻️</div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">
          Hassle-Free Returns
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 mb-5 text-sm sm:text-base md:text-lg leading-relaxed">
          Not happy with what you received? Raise a return in under 60 seconds.
          We&apos;ll pick it up from your door and refund within 72 hours — no
          questions asked.
        </p>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 mx-auto text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl w-full sm:w-auto">
          Start Shopping with Confidence
          <ArrowRight size={18} />
        </Button>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8 text-gray-900">
          Return in 4 Easy Steps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {steps.map((step) => (
            <Card
              key={step.id}
              className="rounded-2xl border border-gray-200 shadow-sm h-full"
            >
              <CardContent className="p-4 sm:p-5 text-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto mb-3 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm sm:text-base">
                  {step.id}
                </div>

                <h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-900">
                  {step.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-8 sm:mt-10">
          <Card className="border-orange-300 bg-orange-50 rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <h3 className="flex items-center gap-2 font-semibold text-orange-500 mb-4 text-sm sm:text-base">
                <CheckCircle size={18} /> Eligible for Return
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <li>✔ Damaged or defective goods on arrival</li>
                <li>✔ Wrong product or quantity shipped</li>
                <li>✔ Product description mismatch</li>
                <li>✔ Expired or near-expiry goods</li>
                <li>✔ Missing parts or incomplete sets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/60 rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <h3 className="flex items-center gap-2 font-semibold text-orange-500 mb-4 text-sm sm:text-base">
                <AlertTriangle size={18} /> Not Eligible
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <li>— Change of mind</li>
                <li>— Used products</li>
                <li>— After 7-day window</li>
                <li>— Custom orders</li>
                <li>— Perishable goods</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 sm:mt-10 border-orange-300 bg-orange-50 rounded-2xl">
          <CardContent className="p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 text-center">
            <div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
                72 hrs
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Avg. Refund Time
              </p>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
                98.2%
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Satisfaction Rate
              </p>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
                Free
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Pickup
              </p>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
                7 Days
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Return Window
              </p>
            </div>
          </CardContent>
        </Card>

        {/* BACK */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="text-sm sm:text-base px-5 sm:px-6 rounded-xl w-full sm:w-auto"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}