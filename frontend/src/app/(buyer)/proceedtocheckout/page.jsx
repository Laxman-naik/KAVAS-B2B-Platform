"use client";

import React, { useMemo, useState } from "react";
import {
  MapPin,
  FileText,
  Package,
  CreditCard,
  ShieldCheck,
  LockKeyhole,
  Download,
  Plus,
} from "lucide-react";

const Page = () => {
  const [selectedAddress, setSelectedAddress] = useState("office");
  const [selectedPayment, setSelectedPayment] = useState("net30");

  const products = [
    {
      id: 1,
      name: "Premium Coffee Beans",
      desc: "1kg • Pack of 10",
      qty: 2,
      unitPrice: 120,
      image: "/coffee.png",
    },
    {
      id: 2,
      name: "Ceramic Coffee Mug",
      desc: "Black • 350ml • Pack of 24",
      qty: 1,
      unitPrice: 120,
      image: "/mug.png",
    },
    {
      id: 3,
      name: "Green Tea Leaves",
      desc: "500g • Pack of 20",
      qty: 1,
      unitPrice: 200,
      image: "/tea.png",
    },
  ];

  const addresses = [
    {
      id: "office",
      title: "Office Address",
      tag: "Default",
      name: "Kavas Industries Pvt. Ltd.",
      address:
        "123 Business Park, Industrial Area, New York, NY 10001, United States",
      person: "John Doe",
      phone: "+1 123 456 7890",
    },
    {
      id: "warehouse",
      title: "Warehouse Address",
      name: "Kavas Industries Pvt. Ltd.",
      address:
        "456 Logistics Hub, Warehouse Zone, New Jersey, NJ 07001, United States",
      person: "Michael Smith",
      phone: "+1 987 654 3210",
    },
    {
      id: "home",
      title: "Home Address",
      name: "John Doe",
      address: "789 Residential St, New York, NY 10002, United States",
      person: "John Doe",
      phone: "+1 123 456 7890",
    },
  ];

  const paymentMethods = [
    ["net30", "Net 30", "Pay within 30 days"],
    ["net60", "Net 60", "Pay within 60 days"],
    ["card", "Credit / Debit Card", "Visa • Mastercard • Amex"],
    ["bank", "Bank Transfer", "Secure bank transfer"],
  ];

  const subtotal = useMemo(
    () => products.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    []
  );

  return (
    <main className="min-h-screen bg-[#001a35] px-4 py-5 text-[#0b1324] md:px-8">
      <section className="mb-5 flex flex-col gap-5 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Checkout</h1>
          <p className="mt-1 text-sm text-white/75">
            Review your order and complete your purchase
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <Card>
            <SectionTitle
              icon={MapPin}
              title="Delivery Address"
              subtitle="Select a saved delivery location"
            />

            <div className="mt-5 flex items-center justify-between border-t border-[#d8dee8] pt-4">
              <h3 className="text-sm font-bold">Saved Addresses</h3>
              <button className="flex items-center gap-2 rounded-sm border border-[#f3a51c] px-3 py-2 text-sm font-semibold text-[#0b1324]">
                <Plus size={15} />
                Add New Address
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {addresses.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedAddress(item.id)}
                  className={`rounded-sm border p-4 text-left transition ${
                    selectedAddress === item.id
                      ? "border-[#f3a51c] bg-[#fff8ea]"
                      : "border-[#d8dee8] bg-white hover:border-[#f3a51c]"
                  }`}
                >
                  <div className="flex gap-3">
                    <Radio active={selectedAddress === item.id} />
                    <div>
                      <h4 className="text-sm font-bold">
                        {item.title}
                        {item.tag && (
                          <span className="ml-2 rounded-sm bg-[#fff2d2] px-2 py-1 text-[11px] text-[#d48800]">
                            {item.tag}
                          </span>
                        )}
                      </h4>
                      <p className="mt-2 text-sm">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-[#536072]">
                        {item.address}
                      </p>
                      <p className="mt-2 text-sm">
                        {item.person} <span className="mx-2 text-[#a5adba]">|</span>
                        {item.phone}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <SectionTitle
                icon={FileText}
                title="Invoice Preview"
                subtitle="Review invoice details before payment"
              />
              <button className="flex w-fit items-center gap-2 rounded-sm border border-[#d8dee8] px-4 py-2.5 text-sm font-semibold hover:border-[#f3a51c]">
                <Download size={16} />
                Download Invoice
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-sm border border-[#d8dee8]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-[#f8fafc] text-left">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((item) => {
                      const total = item.qty * item.unitPrice;

                      return (
                        <tr key={item.id} className="border-t border-[#d8dee8]">
                          <td className="px-4 py-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-16 rounded-sm bg-[#f3f5f8] object-contain"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="mt-1 text-[#536072]">{item.desc}</p>
                          </td>
                          <td className="px-4 py-3 text-center">{item.qty}</td>
                          <td className="px-4 py-3 text-right">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            ${total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto w-full max-w-sm space-y-2 px-5 py-4 text-sm">
                <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <SummaryRow label="Shipping" value="FREE" gold />
                <SummaryRow label="Tax (0%)" value="$0.00" />
                <div className="flex justify-between border-t border-[#d8dee8] pt-3 text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-[#d48800]">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-sm border border-[#f3c77b] bg-[#fff8ea] px-4 py-3 text-sm text-[#536072]">
              <ShieldCheck size={18} className="text-[#d48800]" />
              This is a proforma invoice. Final invoice will be available after
              order confirmation.
            </div>
          </Card>
        </div>

        <aside className="h-fit rounded-sm border border-[#d8dee8] bg-white p-5 shadow-xl xl:sticky xl:top-5">
          <SectionTitle icon={Package} title="Order Summary" />

          <div className="my-4 h-px bg-[#d8dee8]" />

          <div className="space-y-4">
            {products.map((item) => {
              const total = item.qty * item.unitPrice;

              return (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-sm bg-[#f3f5f8] object-contain"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <h4 className="text-sm font-bold">{item.name}</h4>
                      <p className="text-sm font-bold text-[#d48800]">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-[#536072]">{item.desc}</p>
                    <p className="mt-1 text-xs">Qty: {item.qty}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="my-4 h-px bg-[#d8dee8]" />

          <div className="space-y-3 text-sm">
            <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <SummaryRow label="Shipping" value="FREE" gold />
            <SummaryRow label="Tax (0%)" value="$0.00" />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#d8dee8] pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-3xl font-bold text-[#d48800]">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="my-5 h-px bg-[#d8dee8]" />

          <SectionTitle
            icon={CreditCard}
            title="Payment Method"
            subtitle="Select preferred payment method"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {paymentMethods.map(([id, title, subtitle]) => (
              <button
                key={id}
                onClick={() => setSelectedPayment(id)}
                className={`rounded-sm border p-3 text-left transition ${
                  selectedPayment === id
                    ? "border-[#f3a51c] bg-[#fff8ea]"
                    : "border-[#d8dee8] bg-white hover:border-[#f3a51c]"
                }`}
              >
                <div className="flex gap-3">
                  <Radio active={selectedPayment === id} />
                  <div>
                    <h4 className="text-sm font-bold">{title}</h4>
                    <p className="mt-1 text-xs text-[#536072]">{subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-sm bg-[#f3a51c] text-base font-bold text-[#0b1324] transition hover:bg-[#d99513]">
            <LockKeyhole size={18} />
            Continue to Payment
          </button>

          <div className="mt-5 flex justify-center gap-3 text-center">
            <ShieldCheck size={28} className="text-[#001a35]" />
            <div>
              <h4 className="text-sm font-bold">Secure & Encrypted Checkout</h4>
              <p className="text-xs text-[#536072]">
                Your information is safe with us
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

const Card = ({ children }) => {
  return (
    <section className="rounded-sm border border-[#d8dee8] bg-white p-5 shadow-xl">
      {children}
    </section>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#f3a51c] bg-[#fff8ea]">
        <Icon size={23} className="text-[#d48800]" />
      </span>

      <div>
        <h3 className="text-xl font-bold text-[#0b1324]">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-[#536072]">{subtitle}</p>}
      </div>
    </div>
  );
};

const Radio = ({ active }) => {
  return (
    <span
      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        active ? "border-[#f3a51c]" : "border-[#9aa4b2]"
      }`}
    >
      {active && <span className="h-2 w-2 rounded-full bg-[#f3a51c]" />}
    </span>
  );
};

const SummaryRow = ({ label, value, gold }) => {
  return (
    <div className="flex justify-between">
      <span className="text-[#536072]">{label}</span>
      <span className={gold ? "font-bold text-[#d48800]" : "text-[#0b1324]"}>
        {value}
      </span>
    </div>
  );
};

export default Page;