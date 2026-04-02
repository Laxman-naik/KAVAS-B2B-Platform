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

const ReturnsPage = () => {
  return (
    <div className="w-full bg-gray-50">
     
      <section className="bg-green-500 text-white text-center py-20 px-6">
        <div className="text-4xl mb-4">♻️</div>

        <h1 className="text-4xl font-bold mb-4">Hassle-Free Returns</h1>

        <p className="max-w-2xl mx-auto text-green-100 mb-8">
          Not happy with what you received? Raise a return in under 60 seconds.
          We'll pick it up from your door and refund within 72 hours — no
          questions asked.
        </p>

        <Button className=" text-green-700  flex items-center gap-2 mx-auto">
          Start Shopping with Confidence
          <ArrowRight size={18} />
        </Button>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-10">
          Return in 4 Easy Steps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card key={step.id} className="rounded-xl shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">
                  {step.id}
                </div>

                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Eligible */}
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-6 text-left">
              <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-4">
                <CheckCircle size={18} /> Eligible for Return
              </h3>

              <ul className="space-y-2 text-sm text-gray-700">
                <li>✔ Damaged or defective goods on arrival</li>
                <li>✔ Wrong product or quantity shipped</li>
                <li>✔ Product description mismatch</li>
                <li>✔ Expired or near-expiry goods</li>
                <li>✔ Missing parts or incomplete sets</li>
              </ul>
            </CardContent>
          </Card>

        
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="p-6 text-left">
              <h3 className="flex items-center gap-2 font-semibold text-orange-600 mb-4">
                <AlertTriangle size={18} /> Not Eligible
              </h3>

              <ul className="space-y-2 text-sm text-gray-700">
                <li>— Change of mind</li>
                <li>— Used products</li>
                <li>— After 7-day window</li>
                <li>— Custom orders</li>
                <li>— Perishable goods</li>
              </ul>
            </CardContent>
          </Card>
        </div>

       
        <Card className="mt-12 border-green-300 bg-green-50">
          <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h4 className="text-2xl font-bold text-green-700">
                72 hrs
              </h4>
              <p className="text-sm text-gray-600">
                Avg. Refund Time
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-green-700">
                98.2%
              </h4>
              <p className="text-sm text-gray-600">
                Satisfaction Rate
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-green-700">
                Free
              </h4>
              <p className="text-sm text-gray-600">
                Pickup
              </p>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-green-700">
                7 Days
              </h4>
              <p className="text-sm text-gray-600">
                Return Window
              </p>
            </div>
          </CardContent>
        </Card>

       
        <div className="mt-10">
          <Link href="/">
          <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReturnsPage;