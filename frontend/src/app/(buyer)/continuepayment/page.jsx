"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowLeft,
  ArrowRight,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  const [selectedPayment, setSelectedPayment] = useState("net30");

  const paymentMethods = [
    {
      id: "net30",
      title: "Net 30",
      subtitle: "Pay within 30 days",
      badge: "Recommended",
      iconText: "NET30",
      features: [
        "Ideal for business customers",
        "30 days to pay",
        "Invoice sent after order shipment",
      ],
    },
    {
      id: "net60",
      title: "Net 60",
      subtitle: "Pay within 60 days",
      iconText: "NET60",
      features: [
        "Extended 60 days terms",
        "For established business",
        "Invoice sent after order shipment",
      ],
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      subtitle: "Pay securely using your card",
      iconText: "VISA  ●  AMEX",
      features: [
        "Instant payment",
        "Secure encrypted transaction",
        "Accepted worldwide",
      ],
    },
    {
      id: "bank",
      title: "Bank Transfer",
      subtitle: "Secure bank transfer",
      iconText: "BANK",
      features: [
        "Direct bank transfer",
        "Upload payment proof",
        "Order processed after confirmation",
      ],
    },
  ];

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
    
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <main className="w-full px-8 py-5">
        <div className="mb-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_640px]">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1F3A]">Checkout</h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-[#1A1A1A]">
              Secure checkout for your wholesale order
              <ShieldCheck className="text-[#D4AF37]" size={18} />
            </p>
          </div>

          <div className="flex items-start justify-between pt-1">
            {["Shipping", "Payment", "Review", "Complete"].map(
              (step, index) => (
                <div key={step} className="flex flex-1 items-start">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-sm border text-sm font-semibold ${
                        index === 1
                          ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B1F3A]"
                          : "border-[#E5E5E5] bg-white text-[#1A1A1A]"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`mt-2 text-xs ${
                        index === 1
                          ? "font-semibold text-[#D4AF37]"
                          : "text-[#1A1A1A]"
                      }`}
                    >
                      {step}
                    </p>
                  </div>

                  {index !== 3 && (
                    <div
                      className={`mt-4 h-px flex-1 ${
                        index < 1 ? "bg-[#D4AF37]" : "bg-[#E5E5E5]"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_430px]">
          <Card className="rounded-sm border border-[#E5E5E5] bg-white text-[#1A1A1A] shadow-sm">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#D4AF37] text-sm font-bold text-[#0B1F3A]">
                    3
                  </span>

                  <div>
                    <h2 className="text-xl font-bold text-[#0B1F3A]">
                      Payment Method
                    </h2>

                    <p className="mt-1 text-sm text-[#666]">
                      Select a secure payment method
                    </p>
                  </div>
                </div>

                <CreditCard className="text-[#D4AF37]" size={28} />
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full rounded-sm border p-4 text-left transition ${
                      selectedPayment === method.id
                        ? "border-[#D4AF37] bg-[#FFF8EC]"
                        : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_150px_260px]">
                      <div className="flex gap-3">
                        <span
                          className={`mt-1 h-4 w-4 rounded-full border ${
                            selectedPayment === method.id
                              ? "border-[#D4AF37] bg-[#D4AF37]"
                              : "border-[#999]"
                          }`}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-[#0B1F3A]">
                              {method.title}
                            </h3>

                            {method.badge && (
                              <span className="rounded-sm bg-[#D4AF37] px-2 py-0.5 text-[11px] font-semibold text-[#0B1F3A]">
                                {method.badge}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-[#666]">
                            {method.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center border-l border-[#E5E5E5]">
                        <div className="text-2xl font-bold text-[#D4AF37]">
                          {method.id === "bank" ? (
                            <Building2 size={30} />
                          ) : (
                            method.iconText
                          )}
                        </div>
                      </div>

                      <div className="border-l border-[#E5E5E5] pl-5">
                        <div className="space-y-1.5">
                          {method.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm font-bold text-[#D4AF37]">
                                ✓
                              </span>

                              <p className="text-sm text-[#1A1A1A]">
                                {feature}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-sm border border-[#D4AF37] bg-[#FFF8EC] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="text-[#D4AF37]" size={30} />

                  <div>
                    <h3 className="text-base font-bold text-[#0B1F3A]">
                      Secure & Encrypted Payment
                    </h3>

                    <p className="mt-1 text-sm text-[#666]">
                      Your payment information is protected with
                      industry-standard encryption.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <Button className="h-11 rounded-sm border border-[#D4AF37] bg-white px-5 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]">
                  <ArrowLeft className="mr-2" size={17} />
                  Back to Shipping
                </Button>

                <Button className="h-11 rounded-sm bg-[#D4AF37] px-8 text-sm font-bold text-[#0B1F3A] hover:bg-[#c7a22f]">
                  Continue to Review
                  <ArrowRight className="ml-2" size={17} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm border border-[#E5E5E5] bg-white text-[#1A1A1A] shadow-sm">
            <CardContent className="p-5">
              <h2 className="mb-4 flex items-center gap-2 border-b border-[#E5E5E5] pb-4 text-xl font-bold text-[#0B1F3A]">
                <Package className="text-[#D4AF37]" size={26} />
                Order Summary
              </h2>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex gap-3">
                    <div className="h-16 w-16 rounded-sm bg-[#FFF8EC]" />

                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <h3 className="text-sm font-bold text-[#0B1F3A]">
                          {item.name}
                        </h3>

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

              <div className="mt-4 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="text-[#D4AF37]" size={26} />

                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      Secure Checkout
                    </h3>

                    <p className="mt-1 text-xs text-[#666]">
                      Your information is safe with us
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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