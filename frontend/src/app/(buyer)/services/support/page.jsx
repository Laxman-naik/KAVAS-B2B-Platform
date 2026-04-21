"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
  Crown,
  Handshake,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    title: "Starter Plan",
    name: "Email Support",
    icon: Mail,
    features: [
      "Email support 9am–6pm",
      "Help centre access",
      "48-hour response SLA",
      "Dedicated account manager",
      "Phone / WhatsApp",
    ],
    disabled: [3, 4],
  },
  {
    title: "Pro Plan",
    name: "Account Manager",
    icon: Handshake,
    badge: "PRO",
    features: [
      "Dedicated named manager",
      "WhatsApp + phone",
      "4-hour response SLA",
      "Quarterly business reviews",
      "24/7 hotline",
    ],
    disabled: [4],
    highlight: true,
  },
  {
    title: "Enterprise Plan",
    name: "Concierge Support",
    icon: Crown,
    features: [
      "Senior account team",
      "24/7 hotline",
      "1-hour response SLA",
      "On-site visits available",
      "Custom integrations & API",
    ],
  },
];

const contactOptions = [
  { title: "Live Chat", desc: "9am–9pm daily", icon: MessageCircle },
  { title: "WhatsApp", desc: "+91 98765 43210", icon: Phone },
  { title: "Email", desc: "support@kavas.in", icon: Mail },
  { title: "Help Centre", desc: "Browse FAQs →", icon: HelpCircle },
];

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 text-center">
        <Handshake className="mx-auto mb-4 h-8 w-8 md:h-10 md:w-10 text-orange-500" />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900">
          Dedicated Account Support
        </h1>

        <p className="max-w-lg mx-auto text-sm sm:text-base text-gray-600 mb-5">
          You're not a ticket number here. Every Pro+ buyer gets a named account manager.
        </p>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl w-full sm:w-auto">
          Get Your Account Manager →
        </Button>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            Support by Plan
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Every plan gets real support
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;

            return (
              <Card
                key={i}
                className={`relative rounded-2xl p-4 sm:p-5 md:p-6 h-full transition ${
                  plan.highlight
                    ? "border-2 border-orange-500 bg-orange-50 shadow-md"
                    : "border border-gray-200 bg-white hover:shadow-sm"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-4 text-xs bg-orange-600">
                    {plan.badge}
                  </Badge>
                )}

                <CardContent className="p-0 space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {plan.title}
                  </p>

                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-orange-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`leading-relaxed ${
                          plan.disabled?.includes(idx)
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 md:pb-14">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
          <h3 className="font-semibold mb-5 flex items-center gap-2 text-gray-900 text-base sm:text-lg">
            <Phone className="h-4 w-4" />
            Reach Us Anytime
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {contactOptions.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center hover:shadow-sm transition"
                >
                  <Icon className="mx-auto mb-2 text-orange-500 h-5 w-5" />
                  <p className="font-medium text-sm text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-6">
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

export default page;