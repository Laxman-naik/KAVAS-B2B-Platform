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
    <div className="w-full">

      {/* HERO */}
      <section className="bg-orange-500 text-white text-center py-12 md:py-16 px-4">
        <Handshake className="mx-auto mb-4 h-8 w-8 md:h-10 md:w-10" />

        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          Dedicated Account Support
        </h1>

        <p className="max-w-lg mx-auto text-sm md:text-base opacity-90 mb-5">
          You're not a ticket number here. Every Pro+ buyer gets a named account manager.
        </p>

        <Button className="bg-white text-orange-600 hover:bg-gray-100 text-sm md:text-base">
          Get Your Account Manager →
        </Button>
      </section>

      {/* PLANS */}
      <section className="py-10 md:py-14 px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold">Support by Plan</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Every plan gets real support
          </p>
        </div>

        {/* ✅ FIXED GRID */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
          max-w-6xl
          mx-auto
        ">
          {plans.map((plan, i) => {
            const Icon = plan.icon;

            return (
              <Card
                key={i}
                className={`relative p-5 ${
                  plan.highlight
                    ? "border-2 border-orange-500 bg-orange-50"
                    : ""
                }`}
              >
                {/* Badge FIX */}
                {plan.badge && (
                  <Badge className="absolute -top-3 left-4 text-xs bg-orange-500">
                    {plan.badge}
                  </Badge>
                )}

                <CardContent className="p-0 space-y-3">
                  <p className="text-xs text-muted-foreground uppercase">
                    {plan.title}
                  </p>

                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-orange-500" />
                    <h3 className="text-base font-semibold">{plan.name}</h3>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`${
                          plan.disabled?.includes(idx)
                            ? "text-gray-400 line-through"
                            : ""
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

      {/* CONTACT */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto bg-muted rounded-xl p-5">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Reach Us Anytime
          </h3>

          {/* ✅ FIXED GRID */}
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          ">
            {contactOptions.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="bg-orange-50 rounded-lg p-4 text-center"
                >
                  <Icon className="mx-auto mb-2 text-orange-500" />
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BACK */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default page;
