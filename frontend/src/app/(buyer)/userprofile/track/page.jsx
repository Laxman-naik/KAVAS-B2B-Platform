"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Copy,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  MapPin,
  CircleHelp,
} from "lucide-react";

const trackingSteps = [
  {
    title: "Order Placed",
    date: "15 May 2024",
    time: "02:30 PM",
    icon: Package,
  },
  {
    title: "Confirmed",
    date: "15 May 2024",
    time: "03:15 PM",
    icon: ShieldCheck,
  },
  {
    title: "Shipped",
    date: "16 May 2024",
    time: "10:45 AM",
    icon: Truck,
  },
  {
    title: "Out for Delivery",
    date: "17 May 2024",
    time: "09:30 AM",
    icon: Truck,
  },
  {
    title: "Delivered",
    date: "17 May 2024",
    time: "02:20 PM",
    icon: CheckCircle2,
  },
];

const orderItems = [
  {
    name: "Premium Wooden Chair",
    sku: "CHR-001",
    color: "Beige",
    qty: 2,
    price: "₹1,500.00",
  },
  {
    name: "Modern Pendant Light",
    sku: "LGT-002",
    color: "Black",
    qty: 1,
    price: "₹750.00",
  },
  {
    name: "Wooden Dining Table",
    sku: "TBL-003",
    color: "Brown",
    qty: 1,
    price: "₹2,200.00",
  },
];

export default function TrackOrderBodyPage() {
  const [trackingId, setTrackingId] = useState("#KAVAS1234");
  const [copied, setCopied] = useState(false);

  const total = useMemo(() => "₹2,450.00", []);

  const copyAwb = async () => {
    await navigator.clipboard.writeText("1234567890123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-[#EAEAEA] bg-white p-4 sm:p-6 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#02223B]">
            Track Order
          </h1>
          <p className="mt-1 text-sm text-gray-500">Home &gt; Track Order</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1.3fr]">
          <div className="rounded-2xl border border-[#EAEAEA] p-5">
            <h2 className="text-lg font-semibold text-[#02223B]">
              Track Your Order
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your Order ID / AWB Number to track the status of your order
            </p>

            <div className="mt-5 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Order ID / AWB Number"
                  className="h-14 w-full rounded-xl border border-[#E5E5E5] px-4 pr-12 outline-none transition-all duration-300 focus:border-[#D4A24C]"
                />
                <Search
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>

              <button className="h-14 rounded-xl bg-[#02223B] px-8 text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                Track Order
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] p-5">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8E8C7]">
                <CircleHelp className="text-[#02223B]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[#02223B]">
                  How to track your order?
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-7">
                  Enter your Order ID / AWB Number and click on “Track Order”
                  button to get real-time updates on your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#EAEAEA] p-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <h3 className="text-2xl font-bold text-[#02223B] mt-1">
                {trackingId}
              </h3>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium">15 May 2024, 02:30 PM</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">{total}</p>
                </div>
                <div>
                  <p className="text-gray-500">Delivery Address</p>
                  <div className="mt-1 flex gap-2">
                    <MapPin size={18} className="mt-1" />
                    <p>
                      Rahul Kumar<br />123, Green Hills Colony,<br />Hyderabad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#02223B] mb-6">
                Order Tracking Status
              </h3>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="text-center transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-300 bg-green-50">
                        <Icon className="text-green-700" size={20} />
                      </div>
                      <p className="mt-3 font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.date}</p>
                      <p className="text-xs text-gray-500">{step.time}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-xl border border-green-100 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-green-800 font-medium">
                  Your order has been delivered successfully.
                </p>

                <button className="flex items-center gap-2 rounded-xl border border-[#D9D9D9] bg-white px-5 py-3 font-medium transition-all duration-300 hover:border-[#D4A24C]">
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#EAEAEA] p-5 xl:col-span-1">
            <h3 className="text-lg font-semibold text-[#02223B] mb-4">
              Order Items (3)
            </h3>

            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#F0F0F0] p-4 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        SKU: {item.sku} | {item.color}
                      </p>
                      <p className="text-sm mt-1">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <p className="font-semibold">Total</p>
              <p className="text-lg font-bold">{total}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] p-5">
            <h3 className="text-lg font-semibold text-[#02223B] mb-4">
              Shipment Details
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Courier Partner</p>
                <p className="font-medium">Delhivery</p>
              </div>

              <div>
                <p className="text-gray-500">AWB Number</p>
                <div className="mt-1 flex items-center gap-3">
                  <p className="font-medium">1234567890123</p>
                  <button
                    onClick={copyAwb}
                    className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    <Copy size={14} />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Estimated Delivery</p>
                <p className="font-medium">17 May 2024</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] p-5">
            <h3 className="text-lg font-semibold text-[#02223B] mb-4">
              Tracking History
            </h3>

            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={index} className="border-l-2 border-green-300 pl-4">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-gray-500">
                    {step.date}, {step.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
