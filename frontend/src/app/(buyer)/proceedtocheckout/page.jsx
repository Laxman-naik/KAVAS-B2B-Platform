"use client";

import React, { useState } from "react";

import {
  ChevronDown,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  LockKeyhole,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
  const [selectedShipping, setSelectedShipping] =
    useState("standard");

  const [selectedPayment, setSelectedPayment] =
    useState("net30");

  const [shippingInfo, setShippingInfo] =
    useState({
      companyName: "",
      contactPerson: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const shippingMethods = [
    {
      id: "standard",
      title: "Standard Shipping",
      subtitle: "5–7 Business Days",
      price: "FREE",
      amount: 0,
    },

    {
      id: "expedited",
      title: "Expedited Shipping",
      subtitle: "3–4 Business Days",
      price: "$24.99",
      amount: 24.99,
    },

    {
      id: "express",
      title: "Express Shipping",
      subtitle: "1–2 Business Days",
      price: "$49.99",
      amount: 49.99,
    },
  ];

  const paymentMethods = [
    {
      id: "net30",
      title: "Net 30",
      subtitle: "Pay within 30 days",
    },

    {
      id: "net60",
      title: "Net 60",
      subtitle: "Pay within 60 days",
    },

    {
      id: "card",
      title: "Credit / Debit Card",
      subtitle: "VISA ● AMEX",
    },

    {
      id: "bank",
      title: "Bank Transfer",
      subtitle: "Secure bank transfer",
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

  const subtotal = 360;

  const selectedShippingData =
    shippingMethods.find(
      (item) => item.id === selectedShipping
    );

  const shippingAmount =
    selectedShippingData?.amount || 0;

  const total = subtotal + shippingAmount;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <main className="w-full px-10 py-8">
        <div className="mb-7 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_720px]">
          <div>
            <h2 className="text-4xl font-bold text-[#0B1F3A]">
              Checkout
            </h2>

            <p className="mt-2 flex items-center gap-3 text-[#1A1A1A]">
              Secure checkout for your wholesale order

              <ShieldCheck
                className="text-[#D4AF37]"
                size={20}
              />
            </p>
          </div>

         
        </div>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_510px]">
          <div className="space-y-4">
            <Card className="rounded-sm border-[#E5E5E5] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#D4AF37] text-lg font-bold text-[#0B1F3A]">
                      1
                    </span>

                    <div>
                      <h3 className="text-xl font-bold text-[#0B1F3A]">
                        Shipping Information
                      </h3>

                      <p className="text-sm text-[#666]">
                        Where should we deliver your
                        order?
                      </p>
                    </div>
                  </div>

                  <MapPin
                    className="text-[#D4AF37]"
                    size={34}
                  />
                </div>

                <div className="space-y-3">
                  <InputField
                    label="Company Name"
                    name="companyName"
                    value={
                      shippingInfo.companyName
                    }
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField
                      label="Contact Person"
                      name="contactPerson"
                      value={
                        shippingInfo.contactPerson
                      }
                      onChange={handleInputChange}
                      placeholder="Enter contact person"
                    />

                    <InputField
                      label="Phone Number"
                      name="phoneNumber"
                      value={
                        shippingInfo.phoneNumber
                      }
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <InputField
                    label="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <InputField
                      label="City"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />

                    <InputField
                      label="State / Province"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />

                    <InputField
                      label="ZIP / Postal Code"
                      name="zipCode"
                      value={
                        shippingInfo.zipCode
                      }
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                    />
                  </div>

                  <InputField
                    label="Country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm border-[#E5E5E5] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#D4AF37] text-lg font-bold text-[#0B1F3A]">
                      2
                    </span>

                    <div>
                      <h3 className="text-xl font-bold text-[#0B1F3A]">
                        Shipping Method
                      </h3>

                      <p className="text-sm text-[#666]">
                        Choose your preferred
                        shipping option
                      </p>
                    </div>
                  </div>

                  <Truck
                    className="text-[#D4AF37]"
                    size={34}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {shippingMethods.map(
                    (method) => (
                      <OptionCard
                        key={method.id}
                        active={
                          selectedShipping ===
                          method.id
                        }
                        title={method.title}
                        subtitle={
                          method.subtitle
                        }
                        price={method.price}
                        onClick={() =>
                          setSelectedShipping(
                            method.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </CardContent>
            </Card>

           
          </div>

          <Card className="rounded-sm border-[#E5E5E5] bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-3 border-b border-[#E5E5E5] pb-4 text-2xl font-bold text-[#0B1F3A]">
                <Package
                  className="text-[#D4AF37]"
                  size={30}
                />
                Order Summary
              </h3>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex gap-4"
                  >
                    <div className="h-[72px] w-[72px] rounded-sm bg-[#FFF8EC]" />

                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <h4 className="font-bold text-[#0B1F3A]">
                          {item.name}
                        </h4>

                        <p className="font-bold text-[#D4AF37]">
                          {item.price}
                        </p>
                      </div>

                      <p className="text-sm text-[#666]">
                        {item.meta}
                      </p>

                      <p className="mt-1 text-sm text-[#666]">
                        {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#E5E5E5] pt-5">
                <SummaryRow
                  label="Subtotal"
                  value={`$${subtotal.toFixed(
                    2
                  )}`}
                />

                <SummaryRow
                  label="Shipping"
                  value={
                    shippingAmount === 0
                      ? "FREE"
                      : `$${shippingAmount.toFixed(
                          2
                        )}`
                  }
                  gold
                />

                <SummaryRow
                  label="Tax (0%)"
                  value="$0.00"
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E5E5E5] pt-5">
                <span className="text-xl font-bold text-[#0B1F3A]">
                  Total
                </span>

                <span className="text-3xl font-bold text-[#D4AF37]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Button className="mt-6 h-14 w-full rounded-sm bg-[#D4AF37] text-lg font-bold text-[#0B1F3A] hover:bg-[#c9a02f]">
                <LockKeyhole
                  className="mr-2"
                  size={20}
                />
                Continue to Payment
              </Button>

              <div className="mt-6 flex justify-center gap-3 text-center">
                <ShieldCheck
                  className="text-[#D4AF37]"
                  size={28}
                />

                <div>
                  <h4 className="font-bold text-[#0B1F3A]">
                    Secure & Encrypted
                    Checkout
                  </h4>

                  <p className="text-sm text-[#666]">
                    Your information is safe with
                    us
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] px-4 py-3">
    <p className="mb-2 text-xs text-[#666]">
      {label}
    </p>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-transparent text-[#1A1A1A] outline-none placeholder:text-[#999]"
    />
  </div>
);

const OptionCard = ({
  active,
  title,
  subtitle,
  price,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-sm border px-4 py-3 text-left transition ${
      active
        ? "border-[#D4AF37] bg-[#FFF8EC]"
        : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
    }`}
  >
    <div className="flex gap-3">
      <span
        className={`mt-1 h-4 w-4 rounded-full border ${
          active
            ? "border-[#D4AF37] bg-[#D4AF37]"
            : "border-[#999]"
        }`}
      />

      <div>
        <h4 className="font-bold text-[#0B1F3A]">
          {title}
        </h4>

        <p className="mt-1 text-sm text-[#666]">
          {subtitle}
        </p>
      </div>
    </div>

    <p className="font-bold text-[#D4AF37]">
      {price}
    </p>
  </button>
);

const PaymentCard = ({
  active,
  title,
  subtitle,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-sm border px-4 py-4 text-left transition ${
      active
        ? "border-[#D4AF37] bg-[#FFF8EC]"
        : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
    }`}
  >
    <div className="flex gap-3">
      <span
        className={`mt-1 h-4 w-4 rounded-full border ${
          active
            ? "border-[#D4AF37] bg-[#D4AF37]"
            : "border-[#999]"
        }`}
      />

      <div>
        <h4 className="font-bold text-[#0B1F3A]">
          {title}
        </h4>

        <p className="mt-2 text-sm text-[#666]">
          {subtitle}
        </p>
      </div>
    </div>
  </button>
);

const SummaryRow = ({
  label,
  value,
  gold,
}) => (
  <div className="flex justify-between">
    <span className="text-[#1A1A1A]">
      {label}
    </span>

    <span
      className={
        gold
          ? "font-bold text-[#D4AF37]"
          : "text-[#1A1A1A]"
      }
    >
      {value}
    </span>
  </div>
);

export default Page;