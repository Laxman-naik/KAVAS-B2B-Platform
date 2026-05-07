"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);

  const fullName = authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || rest.join(" "),
    email: authUser?.email || "",
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const [query, setQuery] = React.useState("");
  const [awbCopied, setAwbCopied] = React.useState(false);

  const order = {
    orderId: "#KAVAS1234",
    status: "Delivered",
    orderDate: "15 May 2024",
    orderTime: "02:30 PM",
    total: 2450,
    paymentMethod: "Online Payment (Visa)",
    deliveryName: "Rahul Kumar",
    deliveryAddress: "123, Green Hills Colony, Hyderabad, Telangana - 500001",
    deliveryPhone: "+91 6302259849",
    awb: "1234567890123",
    courier: "DELHIVERY",
    shippingDate: "16 May 2024, 10:45 AM",
    estimatedDelivery: "17 May 2024",
  };

  const steps = [
    { label: "Order Placed", date: "15 May 2024", time: "02:30 PM", icon: User },
    { label: "Confirmed", date: "15 May 2024", time: "03:15 PM", icon: ShieldCheck },
    { label: "Shipped", date: "16 May 2024", time: "10:45 AM", icon: Truck },
    { label: "Out for Delivery", date: "17 May 2024", time: "05:30 AM", icon: Package },
    { label: "Delivered", date: "17 May 2024", time: "02:20 PM", icon: CheckCircle2 },
  ];

  const items = [
    { name: "Premium Wooden Chair", sku: "CHR-001", variant: "Beige", qty: 2, price: 1500 },
    { name: "Modern Pendant Light", sku: "LGT-002", variant: "Black", qty: 1, price: 750 },
    { name: "Wooden Dining Table", sku: "TBL-003", variant: "Brown", qty: 1, price: 2200 },
  ];

  const copyAwb = async () => {
    try {
      await navigator.clipboard.writeText(order.awb);
      setAwbCopied(true);
      window.setTimeout(() => setAwbCopied(false), 1200);
    } catch {
      setAwbCopied(false);
    }
  };

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">Track Order</h1>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <ChevronRight size={14} />
                <span className="text-[#0B1F3A]">Track Order</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4">
                  <p className="font-semibold text-[#0B1F3A]">Track Your Order</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your Order ID / AWB Number to track the status of your order
                  </p>

                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter Order ID / AWB Number"
                        className="pl-9 rounded-sm"
                      />
                    </div>
                    <Button className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95">
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5] bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-[#0B1F3A]">How to track your order?</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your Order ID / AWB Number and click on “Track Order” button to get
                    real-time updates on your order.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    You will receive email & SMS updates for every step.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-semibold text-[#0B1F3A]">{order.orderId}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">{order.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="text-[#0B1F3A] font-medium">
                        {order.orderDate}, {order.orderTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount</p>
                      <p className="text-[#0B1F3A] font-semibold">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="text-[#0B1F3A] font-medium">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery Address</p>
                      <p className="text-[#0B1F3A] font-medium">{order.deliveryName}</p>
                      <p className="text-gray-500 mt-1">{order.deliveryAddress}</p>
                      <p className="text-gray-500">Phone: {order.deliveryPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500">Order Tracking Status</p>

                  <div className="mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {steps.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                          <div key={s.label} className="relative">
                            <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                              <div className="relative">
                                <div className="h-9 w-9 rounded-full border-2 border-green-600 bg-green-50 flex items-center justify-center">
                                  <Icon size={16} className="text-green-700" />
                                </div>
                                {idx < steps.length - 1 ? (
                                  <div className="hidden md:block absolute left-9 top-1/2 h-[2px] w-[calc(100%+16px)] bg-green-600" />
                                ) : null}
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-[#0B1F3A]">{s.label}</p>
                                <p className="text-[11px] text-gray-500">{s.date}</p>
                                <p className="text-[11px] text-gray-500">{s.time}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 border border-green-100 bg-green-50 rounded-sm p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-xs text-green-800">
                        <span className="font-semibold">Your order has been delivered successfully.</span>
                        <div className="text-green-700">Delivered on 17 May 2024 at 02:20 PM</div>
                      </div>
                      <Button variant="outline" className="rounded-sm border-[#E5E5E5]">
                        <Download size={16} className="mr-2" /> Download Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="rounded-sm border border-[#E5E5E5] lg:col-span-2">
                <CardContent className="p-0">
                  <div className="px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
                    <p className="font-semibold text-[#0B1F3A] text-sm">Order Items (3)</p>
                    <span className="text-xs text-gray-500"> </span>
                  </div>

                  <div className="p-4 space-y-4">
                    {items.map((it) => (
                      <div key={it.sku} className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-sm border border-[#E5E5E5] bg-gray-50 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#0B1F3A] truncate">{it.name}</p>
                          <p className="text-xs text-gray-500">
                            SKU: {it.sku} | {it.variant}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">Qty: {it.qty}</div>
                        <div className="text-sm font-semibold text-[#0B1F3A]">₹{it.price.toLocaleString()}</div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0B1F3A]">Total</p>
                      <p className="text-sm font-semibold text-[#0B1F3A]">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-4">
                    <p className="font-semibold text-[#0B1F3A] text-sm">Shipment Details</p>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500">Courier Partner</p>
                        <p className="font-semibold text-[#0B1F3A]">{order.courier}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Delivery</p>
                        <p className="font-semibold text-[#0B1F3A]">{order.status.toUpperCase()}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-500">AWB Number</p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="font-semibold text-[#0B1F3A] break-all">{order.awb}</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-sm border-[#E5E5E5] h-8 px-2"
                            onClick={copyAwb}
                          >
                            <Copy size={14} className="mr-2" /> {awbCopied ? "Copied" : "Copy"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500">Shipping Date</p>
                        <p className="font-medium text-[#0B1F3A]">{order.shippingDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estimated Delivery</p>
                        <p className="font-medium text-[#0B1F3A]">{order.estimatedDelivery}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-500">Delivery Address</p>
                        <div className="mt-1 flex items-start gap-2">
                          <MapPin size={14} className="text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#0B1F3A]">{order.deliveryName}</p>
                            <p className="text-gray-500">{order.deliveryAddress}</p>
                            <p className="text-gray-500">{order.deliveryPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-4">
                    <p className="font-semibold text-[#0B1F3A] text-sm">Tracking History</p>

                    <div className="mt-3 space-y-3">
                      {steps.map((s) => (
                        <div key={s.label} className="flex items-start gap-3">
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#0B1F3A]">{s.label}</p>
                            <p className="text-[11px] text-gray-500">
                              {s.date}, {s.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
