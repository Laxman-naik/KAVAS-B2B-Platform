"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AlertTriangle, BadgeCheck, BookOpen, Box, ClipboardList, Clock, Globe, MapPin, Package, PhoneCall, RefreshCw, ShieldCheck, Truck, Wallet, XCircle, FileText, Edit3, Mail } from "lucide-react";
const page = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="bg-[#0B1F3A] overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Shipping & Returns{" "}
                <span className="text-[#D4AF37]">Policy</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#D4AF37] font-bold">
                Fast Delivery. Easy Returns. Trusted Support.
              </p>
              <p className="mt-3 max-w-xl text-sm text-white/80 leading-relaxed">
                We ensure safe and timely delivery of your orders.
                Please read our Shipping & Returns Policy carefully.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 border border-white/10 px-4 py-2 text-xs text-white/85 backdrop-blur-sm">
                <BadgeCheck className="h-4 w-4 text-[#D4AF37]" />
                <span className="font-semibold">Last Updated:</span>
                <span>01 August 2025</span>
              </div>
            </div>

            <div className="hidden lg:flex justify-end relative">
              <div className="absolute inset-0 flex justify-end items-center">
                <div className="w-[320px] h-80 bg-[#D4AF37]/10 rounded-full blur-3xl" />
              </div>

              <Image
                src="/returnpolicyimage.png"
                alt="Shipping & Returns Policy"
                width={420}
                height={350}
                priority
                className=" relative object-contain -ml-16 drop-shadow-[0_15px_35px_rgba(212,175,55,0.18)] hover:scale-105 transition-transform duration-500 "
              />
            </div>

          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-6 items-start">
          <div className="space-y-4">
            <Card id="order-processing" className="rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 bg-white">
                <div className="h-8 w-8 rounded-sm bg-[#FFF1D6] border border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#0B1F3A]">01</div>
                <p className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">Order Processing & Shipping Time</p>
              </div>
              <CardContent className="p-4 sm:p-5 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border border-[#E5E5E5] rounded-sm p-3 text-center">
                    <Box className="h-6 w-6 mx-auto text-[#D4AF37]" />
                    <p className="mt-2 text-sm font-extrabold text-[#1A1A1A]">1 - 3 Business Days</p>
                    <p className="text-xs text-gray-600">Order Processing</p>
                  </div>
                  <div className="border border-[#E5E5E5] rounded-sm p-3 text-center">
                    <Truck className="h-6 w-6 mx-auto text-[#D4AF37]" />
                    <p className="mt-2 text-sm font-extrabold text-[#1A1A1A]">5 - 10 Business Days</p>
                    <p className="text-xs text-gray-600">Standard Shipping</p>
                  </div>
                  <div className="border border-[#E5E5E5] rounded-sm p-3 text-center">
                    <Clock className="h-6 w-6 mx-auto text-[#D4AF37]" />
                    <p className="mt-2 text-sm font-extrabold text-[#1A1A1A]">2 - 5 Business Days</p>
                    <p className="text-xs text-gray-600">Express Shipping</p>
                  </div>
                  <div className="border border-[#E5E5E5] rounded-sm p-3 text-center">
                    <Package className="h-6 w-6 mx-auto text-[#D4AF37]" />
                    <p className="mt-2 text-sm font-extrabold text-[#1A1A1A]">Multiple Packages</p>
                    <p className="text-xs text-gray-600">May be shipped separately</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
              <CardContent className="p-0 bg-white">
                <div className="divide-y divide-[#E5E5E5]">
                  {[
                    {
                      id: "shipping-charges",
                      n: "02",
                      icon: Wallet,
                      title: "Shipping Charges",
                      bullets: [
                        "Shipping charges depend on order weight, volume, and delivery location",
                        "Final shipping cost is displayed at checkout before payment",
                        "Free shipping may be available on bulk orders or promotions",
                      ],
                    },
                    {
                      id: "tracking",
                      n: "03",
                      icon: MapPin,
                      title: "Tracking Your Order",
                      bullets: [
                        "Tracking details will be shared via email and SMS after dispatch",
                        "Orders can be tracked from the “My Orders” section",
                      ],
                    },
                    {
                      id: "international",
                      n: "04",
                      icon: Globe,
                      title: "International Shipping",
                      bullets: [
                        "Available for select locations",
                        "Customs duties and additional charges must be borne by the customer",
                      ],
                    },
                    {
                      id: "delivery-delays",
                      n: "05",
                      icon: AlertTriangle,
                      title: "Delivery Delays",
                      bullets: [
                        "Delivery timelines may be affected by external factors",
                        "Support team will assist in tracking and resolving such cases",
                      ],
                    },
                  ].map((s) => (
                    <div key={s.id} id={s.id} className="flex items-start gap-4 px-4 sm:px-5 py-4">
                      <div className="h-8 w-8 rounded-sm bg-[#FFF1D6] border border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#0B1F3A]">
                        {s.n}
                      </div>
                      <div className="h-10 w-10 rounded-sm bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">{s.title}</p>
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          {s.bullets.map((b) => (
                            <p key={b}>- {b}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-sm border border-[#E5E5E5] bg-[#FFF1D6] px-4 sm:px-5 py-3">
              <p className="font-extrabold text-sm text-[#1A1A1A]">Returns & Refunds Policy</p>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
              <CardContent className="p-0 bg-white">
                <div className="divide-y divide-[#E5E5E5]">
                  {[
                    {
                      id: "return-eligibility",
                      n: "06",
                      icon: RefreshCw,
                      title: "Return Eligibility",
                      bullets: [
                        "Returns accepted only for damaged, defective, or incorrect products",
                        "Return request must be raised within 48 hours of delivery",
                      ],
                    },
                    {
                      id: "non-returnable",
                      n: "07",
                      icon: XCircle,
                      title: "Non-Returnable Items",
                      bullets: [
                        "Customized or special-order products",
                        "Products damaged due to misuse or improper handling",
                      ],
                    },
                    {
                      id: "return-conditions",
                      n: "08",
                      icon: ShieldCheck,
                      title: "Return Conditions",
                      bullets: [
                        "Items must be unused and in original packaging",
                        "All tags, invoices, and accessories must be included",
                      ],
                    },
                  ].map((s) => (
                    <div key={s.id} id={s.id} className="flex items-start gap-4 px-4 sm:px-5 py-4">
                      <div className="h-8 w-8 rounded-sm bg-[#FFF1D6] border border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#0B1F3A]">
                        {s.n}
                      </div>
                      <div className="h-10 w-10 rounded-sm bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">{s.title}</p>
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          {s.bullets.map((b) => (
                            <p key={b}>- {b}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="return-process" className="rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 px-4 sm:px-5 py-4 bg-white">
                <div className="h-10 w-10 rounded-sm bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-sm bg-[#FFF1D6] border border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#0B1F3A]">09</div>
                    <p className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">Return Process</p>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { n: "01", t: "Contact customer support", d: "via email or phone" },
                      { n: "02", t: "Provide order details", d: "and images of the issue" },
                      { n: "03", t: "Return pickup", d: "arranged after approval" },
                      { n: "04", t: "Inspection", d: "before refund/replacement" },
                    ].map((step) => (
                      <div key={step.n} className="rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-3">
                        <p className="text-xs font-black text-[#D4AF37]">{step.n}</p>
                        <p className="text-sm font-extrabold text-[#1A1A1A] mt-1">{step.t}</p>
                        <p className="text-xs text-gray-600 mt-1">{step.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
              <CardContent className="p-0 bg-white">
                <div className="divide-y divide-[#E5E5E5]">
                  {[
                    {
                      id: "refund-policy",
                      n: "10",
                      icon: FileText,
                      title: "Refund Policy",
                      bullets: [
                        "Refunds processed within 5 - 10 business days after approval",
                        "Refunds credited to original payment method",
                        "Shipping charges are non-refundable except defective/incorrect items",
                        "Timelines may vary depending on payment provider",
                      ],
                    },
                    {
                      id: "cancellations",
                      n: "11",
                      icon: Edit3,
                      title: "Cancellations & Modifications",
                      bullets: [
                        "Orders can be cancelled only before shipment",
                        "Once shipped, cancellation is not allowed",
                        "Modifications must be requested before processing",
                      ],
                    },
                    {
                      id: "delivery-issues",
                      n: "12",
                      icon: AlertTriangle,
                      title: "Delivery Issues",
                      bullets: [
                        "Incorrect address or failed attempts may incur re-delivery charges",
                        "Contact support immediately for assistance",
                      ],
                    },
                  ].map((s) => (
                    <div key={s.id} id={s.id} className="flex items-start gap-4 px-4 sm:px-5 py-4">
                      <div className="h-8 w-8 rounded-sm bg-[#FFF1D6] border border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#0B1F3A]">
                        {s.n}
                      </div>
                      <div className="h-10 w-10 rounded-sm bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-sm sm:text-base text-[#1A1A1A]">{s.title}</p>
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          {s.bullets.map((b) => (
                            <p key={b}>- {b}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-sm overflow-hidden border border-[#E5E5E5] shadow-sm">
              <div className="bg-[#0B1F3A] px-5 py-5 text-white">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                  <p className="font-extrabold text-sm">Quick Navigation</p>
                </div>

                <div className="mt-4 bg-[#0B1F3A] border border-white/10 rounded-sm">
                  {[
                    { n: "01", t: "Order Processing & Shipping Time", id: "order-processing" },
                    { n: "02", t: "Shipping Charges", id: "shipping-charges" },
                    { n: "03", t: "Tracking Your Order", id: "tracking" },
                    { n: "04", t: "International Shipping", id: "international" },
                    { n: "05", t: "Delivery Delays", id: "delivery-delays" },
                    { n: "06", t: "Return Eligibility", id: "return-eligibility" },
                    { n: "07", t: "Non-Returnable Items", id: "non-returnable" },
                    { n: "08", t: "Return Conditions", id: "return-conditions" },
                    { n: "09", t: "Return Process", id: "return-process" },
                    { n: "10", t: "Refund Policy", id: "refund-policy" },
                    { n: "11", t: "Cancellations & Modifications", id: "cancellations" },
                    { n: "12", t: "Delivery Issues", id: "delivery-issues" },
                  ].map((item, idx, arr) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-sm bg-[#D4AF37] text-[#0B1F3A] text-[11px] font-black flex items-center justify-center">{item.n}</span>
                        <span className="text-white/90 font-semibold text-xs leading-snug">{item.t}</span>
                      </div>
                      <span className="text-white/50">›</span>
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="rounded-sm overflow-hidden border border-[#E5E5E5] shadow-sm">
              <div className="bg-[#FFF1D6] px-5 py-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-sm bg-[#FFF1D6] border border-[#E5E5E5] flex items-center justify-center">
                    <PhoneCall className="h-6 w-6 text-[#0B1F3A]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A1A]">Need Help?</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600 font-semibold">Our support team is ready to assist you with Shipping & Returns.</p>

                <div className="mt-4 bg-[#0B1F3A] rounded-sm">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                    <Mail className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-white/60">Email</p>
                      <p className="text-sm font-semibold text-white">info@kavaswholesalehub.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <PhoneCall className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-white/60">Call</p>
                      <p className="text-sm font-semibold text-white">+91 6302259849</p>
                    </div>
                  </div>
                </div>

                <Button className="mt-5 w-full bg-[#D4AF37] text-[#0B1F3A] hover:opacity-90 font-bold rounded-sm">Contact Support</Button>
                <p className="mt-2 text-xs text-gray-500">Support available during business hours.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-[#0B1F3A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-[#D4AF37]" />
              <div>
                <p className="font-extrabold text-sm">We’re Here to Help!</p>
                <p className="text-xs text-white/70">For any shipping or return related questions, reach out to our support team.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm">
              <div className="flex items-center gap-2">
                <Mail className="text-[#D4AF37]" />
                <span className="text-white">info@kavaswholesalehub.com</span>
              </div>

              <div className="hidden sm:block h-4 w-px bg-white" />

              <div className="flex items-center gap-2">
                <PhoneCall className="text-[#D4AF37]" />
                <span className="text-white">+91 6302259849</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;