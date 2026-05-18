"use client";

import React from "react";
import {
  ShieldCheck,
  MapPin,
  Truck,
  CreditCard,
  Package,
  Pencil,
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
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

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#1A1A1A]">
      <main className="w-full px-8 py-5">
        <div className="mb-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_640px]">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1F3A]">Checkout</h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-[#1A1A1A]">
              Review your order and confirm
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
                        index === 2
                          ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B1F3A]"
                          : "border-[#E5E5E5] bg-white text-[#1A1A1A]"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`mt-2 text-xs ${
                        index === 2
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
                        index < 2 ? "bg-[#D4AF37]" : "bg-[#E5E5E5]"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_430px]">
          <div className="space-y-3">
            <ReviewCard
              number="1"
              title="Shipping Information"
              icon={MapPin}
              editText="Edit"
            >
              <div className="rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[70px_1fr_1fr_1fr]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-white">
                    <MapPin className="text-[#D4AF37]" size={28} />
                  </div>

                  <InfoBlock label="Company Name" value="Kavas Industries Pvt. Ltd." />
                  <InfoBlock label="Contact Person" value="John Doe" />
                  <InfoBlock label="Phone Number" value="+1 123 456 7890" />
                </div>

                <div className="mt-4 border-t border-[#E5E5E5] pt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <InfoBlock
                      label="Address"
                      value="123 Business Park, Industrial Area"
                    />
                    <InfoBlock label="City" value="New York" />
                    <InfoBlock label="State / Province" value="New York" />
                    <InfoBlock label="ZIP / Postal Code" value="10001" />
                    <InfoBlock label="Country" value="United States" />
                  </div>
                </div>
              </div>
            </ReviewCard>

            <ReviewCard
              number="2"
              title="Shipping Method"
              icon={Truck}
              editText="Edit"
            >
              <div className="flex items-center justify-between rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-white">
                    <Truck className="text-[#D4AF37]" size={28} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0B1F3A]">
                      Standard Shipping
                    </h3>
                    <p className="text-sm text-[#666]">5–7 Business Days</p>
                  </div>
                </div>

                <p className="font-bold text-[#D4AF37]">FREE</p>
              </div>
            </ReviewCard>

            <ReviewCard
              number="3"
              title="Payment Method"
              icon={CreditCard}
              editText="Edit"
            >
              <div className="flex items-center justify-between rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-white">
                    <CreditCard className="text-[#D4AF37]" size={28} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#0B1F3A]">
                        Net 30
                      </h3>

                      <span className="rounded-sm bg-[#D4AF37] px-2 py-0.5 text-[11px] font-semibold text-[#0B1F3A]">
                        Recommended
                      </span>
                    </div>

                    <p className="text-sm text-[#666]">Pay within 30 days</p>
                  </div>
                </div>

                <p className="text-xl font-bold text-[#D4AF37]">NET30</p>
              </div>
            </ReviewCard>

            <div className="rounded-sm border border-[#D4AF37] bg-white p-4">
              <div className="flex gap-3">
                <ShieldCheck className="text-[#D4AF37]" size={30} />

                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">
                    Secure & Encrypted Checkout
                  </h3>

                  <p className="mt-1 text-sm text-[#666]">
                    Your information is protected with industry-standard
                    encryption.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <Button className="h-11 rounded-sm border border-[#D4AF37] bg-white px-5 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]">
                <ArrowLeft className="mr-2" size={17} />
                Back to Payment
              </Button>

              <Button className="h-11 rounded-sm bg-[#D4AF37] px-12 text-sm font-bold text-[#0B1F3A] hover:bg-[#c7a22f]">
                Place Order
                <ArrowRight className="ml-2" size={17} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
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
        </div>
      </main>
    </div>
  );
};

const ReviewCard = ({ number, title, icon: Icon, editText, children }) => (
  <Card className="rounded-sm border border-[#E5E5E5] bg-white text-[#1A1A1A] shadow-sm">
    <CardContent className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#D4AF37] text-sm font-bold text-[#0B1F3A]">
            {number}
          </span>

          <h2 className="text-lg font-bold text-[#0B1F3A]">{title}</h2>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-[#D4AF37]">
          <Pencil size={15} />
          {editText}
        </button>
      </div>

      {children}
    </CardContent>
  </Card>
);

const InfoBlock = ({ label, value }) => (
  <div>
    <p className="text-xs text-[#666]">{label}</p>
    <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{value}</p>
  </div>
);

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

const Feature = ({ icon: Icon, title, text }) => (
  <div className="text-center">
    <Icon className="mx-auto text-[#D4AF37]" size={28} />

    <h3 className="mt-2 text-xs font-bold text-[#D4AF37]">{title}</h3>

    <p className="mt-1 text-xs text-[#666]">{text}</p>
  </div>
);

export default Page;