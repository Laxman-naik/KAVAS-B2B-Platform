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
  {
    title: "Live Chat",
    desc: "9am–9pm daily",
    icon: MessageCircle,
  },
  {
    title: "WhatsApp",
    desc: "+91 98765 43210",
    icon: Phone,
  },
  {
    title: "Email",
    desc: "support@kavas.in",
    icon: Mail,
  },
  {
    title: "Help Centre",
    desc: "Browse FAQs →",
    icon: HelpCircle,
  },
];

const page = () => {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="bg-orange-500 text-white text-center py-20 px-6 mb-5">
        <Handshake className="mx-auto mb-4 h-10 w-10" />
        <h1 className="text-4xl font-bold mb-4">
          Dedicated Account Support
        </h1>
        <p className="max-w-xl mx-auto text-sm opacity-90 mb-6">
          You're not a ticket number here. Every Pro+ buyer gets a named account
          manager — one human who knows your business inside out.
        </p>
        <Button className="bg-white text-orange-600 hover:bg-gray-100">
          Get Your Account Manager →
        </Button>
      </section>

      {/* PLANS */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Support by Plan</h2>
        <p className="text-muted-foreground mb-10">
          Every plan gets real support — higher plans get more of us
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;

            return (
              <Card
                key={i}
                className={`relative p-6 text-left ${
                  plan.highlight
                    ? "border-2 border-orange-500 bg-orange-50"
                    : ""
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
                    {plan.badge}
                  </Badge>
                )}

                <CardContent className="p-0 space-y-4">
                  <p className="text-sm text-muted-foreground uppercase">
                    {plan.title}
                  </p>

                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 ${
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
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto bg-muted rounded-xl p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Reach Us Anytime
          </h3>

          <div className="grid md:grid-cols-4 gap-4">
            {contactOptions.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="bg-orange-50 rounded-lg p-5 text-center hover:shadow-sm transition"
                >
                  <Icon className="mx-auto mb-2 text-orange-500" />
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10">
           <Link href="/">
          <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default page;