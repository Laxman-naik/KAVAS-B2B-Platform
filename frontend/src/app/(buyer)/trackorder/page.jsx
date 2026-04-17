"use client";

import React, { useState } from "react";
import {
  Truck,
  Package,
  CheckCircle,
  XCircle,
  MapPin,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Hash,
  User,
  ShieldCheck,Headset
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const Page = () => {
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");

  const onTrack = (e) => {
    e.preventDefault();
  };

  const statuses = [
    {
      icon: <Package className="h-5 w-5 text-[#0B1F3A]" />,
      title: "Processing",
      desc: "Your order has been received and is being prepared.",
      bg: "bg-[#EAF2FF]",
    },
    {
      icon: <Truck className="h-5 w-5 text-[#0B1F3A]" />,
      title: "Shipped",
      desc: "Your order has been dispatched and is on its way.",
      bg: "bg-[#FFF4E6]",
    },
    {
      icon: <MapPin className="h-5 w-5 text-[#0B1F3A]" />,
      title: "Out for Delivery",
      desc: "Your order is with the courier and will be delivered soon.",
      bg: "bg-[#EEF2FF]",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-[#0B1F3A]" />,
      title: "Delivered",
      desc: "Your order has been successfully delivered.",
      bg: "bg-[#E8FFF3]",
    },
    {
      icon: <XCircle className="h-5 w-5 text-[#0B1F3A]" />,
      title: "Failed Delivery",
      desc: "The courier was unable to deliver to the address.",
      bg: "bg-[#FFECEC]",
    },
  ];

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Standard delivery takes 5–10 business days. Express delivery takes 2–5 business days.",
    },
    {
      q: "What happens if I miss my delivery?",
      a: "The courier will attempt delivery 2–3 times. If unsuccessful, the package may be returned to our warehouse.",
    },
    {
      q: "What if my tracking number is not working?",
      a: "Tracking details may take up to 24–48 hours to update. If it still doesn’t work, please contact support.",
    },
    {
      q: "Will my order be delivered in multiple shipments?",
      a: "Yes, depending on product availability, your order may be shipped in multiple packages. Each will have its own tracking details.",
    },
    {
      q: "Can I change my delivery address after placing an order?",
      a: "If your order hasn’t shipped yet, contact support immediately and we’ll try to help.",
    },
    {
      q: "What if my order is delayed or lost?",
      a: "Contact support with your Order ID. We’ll coordinate with the courier partner to resolve the issue.",
    },
  ];

  return (
     <div className="min-h-screen bg-[#FFF8EC]">
      <div className="bg-[#FFF8EC]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <p className="text-xs text-gray-500">
            <Link href="/">
              <span className="hover:text-[#D4AF37]">Home</span>
            </Link>
            <span className="mx-1">››</span>
            <span className="text-gray-900 font-semibold">Track Order</span>
          </p>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-[#0B1F3A] px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                TRACK ORDER
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#0B1F3A]">
                Track <span className="text-[#D4AF37]">Your Order</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl">
                Stay updated with your shipment. Enter your details below to check the latest status of your order.
              </p>

              <div className="mt-6">
                <Card className="overflow-hidden rounded-sm border-0 shadow-[0_12px_40px_rgba(11,31,58,0.18)] bg-[#0B1F3A] ">
                  <CardContent className="p-5 sm:p-6">
                    <form onSubmit={onTrack} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-end">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white">Order ID</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Enter Order ID"
                            className="pl-10 h-12 bg-white border-0 focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white">Mobile Number or Email</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter Registered Mobile or Email"
                            className="pl-10 h-12 bg-white/95 border-0 focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="h-12 w-full bg-[#D4AF37] text-black font-semibold flex items-center justify-center gap-2 rounded-lg shadow-md hover:opacity-95"
                      >
                        <Search size={18} />
                        TRACK ORDER
                      </Button>
                    </form>

                    <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
                      <ShieldCheck size={16} className="text-[#D4AF37]" />
                      <span>Your information is safe and secure</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 bg-white lg:px-8 py-10">
        <p className="text-[11px] font-bold tracking-widest text-[#D4AF37]">HOW TO TRACK YOUR ORDER</p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#0B1F3A]">Simple Steps to Track</h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="rounded-sm border-0 shadow-sm bg-[#FFF8EC]">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center font-extrabold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0B1F3A]">Track via Our Website</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>Go to the “Track Order” page</li>
                  <li>Enter your Order ID and registered Mobile/Email</li>
                  <li>Click “Track Order” to view your current status</li>
                </ul>
              </div>
              <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-[#FFF8EC] items-center justify-center">
                <Search className="h-6 w-6 text-[#0B1F3A]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-0 shadow-sm bg-[#FFF8EC]">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center font-extrabold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0B1F3A]">Track via Courier Partner</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>Check your tracking number in the confirmation email or SMS</li>
                  <li>Visit the courier partner’s official tracking website</li>
                  <li>Enter the tracking number to see real-time updates</li>
                </ul>
              </div>
              <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-[#FFF8EC] items-center justify-center">
                <MapPin className="h-6 w-6 text-[#0B1F3A]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-[#EEF2F7]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[11px] font-bold tracking-widest text-[#D4AF37]">ORDER STATUS EXPLANATIONS</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#0B1F3A]">Understand Your Order Status</h2>

          <div className="mt-8 relative">
            <div className="hidden md:block absolute left-0 right-0 top-7 border-t border-dashed border-[#0B1F3A]/25 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {statuses.map((s) => (
                <div key={s.title} className="text-center">
                  <div className={`relative z-10 mx-auto h-14 w-14 rounded-full ${s.bg} flex items-center justify-center shadow-sm border border-white`}>
                    {s.icon}
                  </div>
                  <p className="mt-3 font-bold text-sm text-[#0B1F3A]">{s.title}</p>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-[11px] font-bold tracking-widest text-[#D4AF37]">FREQUENTLY ASKED QUESTIONS</p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#0B1F3A]">Quick Answers</h2>

        <Card className="mt-6 rounded-sm border border-gray-100 shadow-sm">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 sm:p-6 md:border-r">
                <Accordion type="single" collapsible>
                  {faqs.slice(0, 3).map((f) => (
                    <AccordionItem key={f.q} value={f.q}>
                      <AccordionTrigger className="no-underline hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="p-4 sm:p-6">
                <Accordion type="single" collapsible>
                  {faqs.slice(3).map((f) => (
                    <AccordionItem key={f.q} value={f.q}>
                      <AccordionTrigger className="no-underline hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12">
  <div className="rounded-2xl bg-[#0B1F3A] text-white px-6 py-6">
    <div className="flex flex-col md:flex-row justify-between gap-8">

      <div className="flex items-start gap-4 py-9 max-w-md justify-center">
        <div className="h-12 w-12   flex items-center justify-center">
         <Headset color="#D4AF37" />
        </div>

        <div>
          <h3 className="font-bold text-lg">Need Help? We’re Here!</h3>
          <p className="text-sm text-gray-300">
            Our support team is ready to assist you with any tracking or delivery questions.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <p className="text-sm font-semibold">Email Us</p>
            <p className="text-sm text-gray-300">
              info@kavaswholesalehub.com
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <p className="text-sm font-semibold">Call Us</p>
            <p className="text-sm text-gray-300">+91 6302259849</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MessageCircle className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <p className="text-sm font-semibold">Live Chat</p>
            <p className="text-sm text-gray-300">
              Available During Business Hours
            </p>
          </div>
        </div>

      </div>

    </div>

  </div>
</div>
    </div>
  );
};

export default Page;