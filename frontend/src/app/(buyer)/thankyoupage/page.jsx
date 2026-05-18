"use client";

import React from "react";
import {
  Check,
  ClipboardList,
  CalendarDays,
  Package,
  Clock3,
  Truck,
  Box,
  Phone,
  Mail,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  const orderItems = [
    {
      name: "Premium Coffee Beans",
      meta: "1 kg • Pack of 10",
      qty: "Qty: 2",
      price: "$240.00",
    },
    {
      name: "Ceramic Coffee Mug",
      meta: "Black • 350ml • Pack of 24",
      qty: "Qty: 1",
      price: "$120.00",
    },
    {
      name: "Green Tea Leaves",
      meta: "500g • Pack of 20",
      qty: "Qty: 1",
      price: "$200.00",
    },
  ];

  const steps = [
    {
      title: "Order Confirmed",
      text: "We have received your order and it is being processed.",
      icon: Check,
      active: true,
    },
    {
      title: "Processing",
      text: "We are preparing your items for shipment.",
      icon: Clock3,
    },
    {
      title: "Shipped",
      text: "Your order is on its way.",
      icon: Truck,
    },
    {
      title: "Delivered",
      text: "Your order has been delivered.",
      icon: Box,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <main className="mx-auto w-full max-w-[1450px] px-8 py-8">
        <section className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm border-2 border-[#D4AF37] text-[#D4AF37]">
            <Check size={48} />
          </div>

          <h1 className="mt-4 text-4xl font-bold text-[#0B1F3A]">Thank You!</h1>

          <h2 className="mt-2 text-2xl font-bold text-[#D4AF37]">
            Your order has been placed successfully.
          </h2>

          <p className="mt-3 text-sm text-[#666]">
            A confirmation email has been sent to{" "}
            <span className="font-semibold text-[#D4AF37]">
              john.doe@kavasindustries.com
            </span>
          </p>

          <div className="mx-auto mt-5 grid max-w-[680px] grid-cols-1 rounded-sm border border-[#E5E5E5] bg-white shadow-sm md:grid-cols-2">
            <div className="flex items-center gap-4 border-b border-[#E5E5E5] p-5 md:border-b-0 md:border-r">
              <ClipboardList className="text-[#D4AF37]" size={34} />

              <div className="text-left">
                <p className="text-sm text-[#666]">Order Number</p>
                <p className="text-xl font-bold text-[#D4AF37]">
                  #KWH123456789
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5">
              <CalendarDays className="text-[#D4AF37]" size={34} />

              <div className="text-left">
                <p className="text-sm text-[#666]">Order Date</p>
                <p className="font-semibold text-[#1A1A1A]">
                  May 24, 2024 • 10:45 AM
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-[#666]">
            We&apos;re processing your order and will notify you once it&apos;s
            shipped.
          </p>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_540px]">
          <Card className="rounded-sm border border-[#E5E5E5] bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-5 text-xl font-bold text-[#0B1F3A]">
                What&apos;s Next?
              </h3>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="relative flex gap-4">
                        {index !== steps.length - 1 && (
                          <div className="absolute left-[17px] top-10 h-10 border-l border-dashed border-[#D4AF37]" />
                        )}

                        <div
                          className={`z-10 flex h-9 w-9 items-center justify-center rounded-sm border ${
                            step.active
                              ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B1F3A]"
                              : "border-[#D4AF37] bg-white text-[#D4AF37]"
                          }`}
                        >
                          <Icon size={19} />
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0B1F3A]">
                            {step.title}
                          </h4>

                          <p className="mt-1 text-sm text-[#666]">{step.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center rounded-sm bg-white p-6">
                  <div className="flex h-52 w-64 items-center justify-center rounded-sm border border-[#D4AF37] bg-[#0B1F3A] text-center shadow-sm">
                    <div>
                      <Package className="mx-auto text-[#D4AF37]" size={64} />
                      <h2 className="mt-4 text-3xl font-bold text-[#D4AF37]">
                        KAVAS
                      </h2>
                      <p className="text-sm italic text-[#FFF8EC]">
                        Wholesale Hub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm border border-[#E5E5E5] bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-5 text-xl font-bold text-[#0B1F3A]">
                Order Summary
              </h3>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex gap-3">
                    <div className="h-16 w-16 rounded-sm bg-[#FFF8EC]" />

                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <h4 className="text-sm font-bold text-[#0B1F3A]">
                          {item.name}
                        </h4>

                        <p className="text-sm font-bold text-[#D4AF37]">
                          {item.price}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-[#666]">{item.meta}</p>
                      <p className="mt-1 text-xs text-[#666]">{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-[#E5E5E5] pt-4">
                <SummaryRow label="Subtotal" value="$560.00" />
                <SummaryRow label="Shipping" value="FREE" gold />
                <SummaryRow label="Tax (0%)" value="$0.00" />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-4">
                <span className="text-lg font-bold text-[#0B1F3A]">Total</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  $560.00
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="mt-5 rounded-sm border border-[#E5E5E5] bg-white shadow-sm">
          <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-bold text-[#0B1F3A]">Need Help?</h3>

              <p className="mt-2 text-sm text-[#666]">
                If you have any questions, our support team is here to help.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-[#1A1A1A]">
              <span className="flex items-center gap-2">
                <Phone size={16} className="text-[#D4AF37]" />
                +1 123 456 7890
              </span>

              <span className="flex items-center gap-2">
                <Mail size={16} className="text-[#D4AF37]" />
                support@kavaswholesale.com
              </span>

              <span className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[#D4AF37]" />
                Live Chat
              </span>
            </div>

            <div className="flex gap-4">
              <Button className="h-11 rounded-sm border border-[#D4AF37] bg-white px-8 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]">
                <ClipboardList className="mr-2" size={16} />
                View Orders
              </Button>

              <Button className="h-11 rounded-sm bg-[#D4AF37] px-8 text-sm font-bold text-[#0B1F3A] hover:bg-[#c7a22f]">
                <ShoppingBag className="mr-2" size={16} />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const SummaryRow = ({ label, value, gold }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-[#1A1A1A]">{label}</span>

    <span
      className={`text-sm ${
        gold ? "font-bold text-[#D4AF37]" : "text-[#1A1A1A]"
      }`}
    >
      {value}
    </span>
  </div>
);

export default Page;