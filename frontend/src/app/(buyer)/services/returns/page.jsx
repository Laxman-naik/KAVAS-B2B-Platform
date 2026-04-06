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
    <div className="w-full bg-gray-50 overflow-x-hidden">

      {/* HERO */}
      <section className="bg-green-500 text-white text-center py-12 sm:py-16 lg:py-20 px-4">
        <div className="text-3xl sm:text-4xl mb-4">♻️</div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
          Hassle-Free Returns
        </h1>

        <p className="max-w-2xl mx-auto text-green-100 mb-6 text-sm sm:text-base">
          Not happy with what you received? Raise a return in under 60 seconds.
          We'll pick it up from your door and refund within 72 hours — no
          questions asked.
        </p>

        <Button className="bg-white text-green-700 flex items-center gap-2 mx-auto text-sm sm:text-base px-5 py-2">
          Start Shopping with Confidence
          <ArrowRight size={18} />
        </Button>
      </section>

      {/* CONTENT */}
      <section className="py-10 sm:py-14 px-4 max-w-7xl mx-auto">

        {/* TITLE */}
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-10">
          Return in 4 Easy Steps
        </h2>

        {/* STEPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <Card key={step.id} className="rounded-xl shadow-sm">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">
                  {step.id}
                </div>

                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  {step.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ELIGIBILITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">

          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-5">
              <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-4 text-sm sm:text-base">
                <CheckCircle size={18} /> Eligible for Return
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li>✔ Damaged or defective goods on arrival</li>
                <li>✔ Wrong product or quantity shipped</li>
                <li>✔ Product description mismatch</li>
                <li>✔ Expired or near-expiry goods</li>
                <li>✔ Missing parts or incomplete sets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="p-5">
              <h3 className="flex items-center gap-2 font-semibold text-orange-600 mb-4 text-sm sm:text-base">
                <AlertTriangle size={18} /> Not Eligible
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li>— Change of mind</li>
                <li>— Used products</li>
                <li>— After 7-day window</li>
                <li>— Custom orders</li>
                <li>— Perishable goods</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* STATS */}
        <Card className="mt-10 border-green-300 bg-green-50">
          <CardContent className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700">
                72 hrs
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Avg. Refund Time
              </p>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700">
                98.2%
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Satisfaction Rate
              </p>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700">
                Free
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Pickup
              </p>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-green-700">
                7 Days
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Return Window
              </p>
            </div>

          </CardContent>
        </Card>

        {/* BACK */}
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="outline" className="text-sm px-5">
              ← Back to Home
            </Button>
          </Link>
        </div>

      </section>
    </div>
  );
}
