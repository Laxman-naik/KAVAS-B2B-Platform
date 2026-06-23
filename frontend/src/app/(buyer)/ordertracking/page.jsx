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
import { productapi } from "@/services/api";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);

  const fullName =
    authUser?.full_name || authUser?.fullName || authUser?.name || "";

  const [firstName = "", ...rest] = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || rest.join(" "),
    email: authUser?.email || "",
  };

  const [query, setQuery] = React.useState("");
  const [awbCopied, setAwbCopied] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [steps, setSteps] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStepIcon = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("placed") || s.includes("pending")) return User;
    if (s.includes("confirm")) return ShieldCheck;
    if (s.includes("ship")) return Truck;
    if (s.includes("delivery")) return Package;
    if (s.includes("deliver")) return CheckCircle2;

    return CheckCircle2;
  };

  const trackOrder = async () => {
    if (!query.trim()) {
      setError("Please enter Order ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await productapi.get(
        `/api/orders/by-id/${query.trim()}`
      );

      setOrder(data.order);
      setItems(data.items || []);
      setSteps(data.history || []);
    } catch (err) {
      console.error("Track order error:", err);
      setError(err.response?.data?.message || "Order not found");
      setOrder(null);
      setItems([]);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  const copyAwb = async () => {
    try {
      await navigator.clipboard.writeText(order?.awb || "");
      setAwbCopied(true);
      window.setTimeout(() => setAwbCopied(false), 1200);
    } catch {
      setAwbCopied(false);
    }
  };

  const deliveryAddress = order
    ? [
        order.address_line1,
        order.address_line2,
        order.city,
        order.state,
        order.country,
        order.postal_code,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                Track Order
              </h1>
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
                  <p className="font-semibold text-[#0B1F3A]">
                    Track Your Order
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your Order ID to track the status of your order
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
                        placeholder="Enter Order ID"
                        className="pl-9 rounded-sm"
                      />
                    </div>

                    <Button
                      onClick={trackOrder}
                      disabled={loading}
                      className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95"
                    >
                      {loading ? "Tracking..." : "Track Order"}
                    </Button>
                  </div>

                  {error && (
                    <p className="mt-2 text-xs text-red-600">{error}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5] bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-[#0B1F3A]">
                    How to track your order?
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your Order ID and click Track Order to get order
                    updates.
                  </p>
                </CardContent>
              </Card>
            </div>

            {!order ? (
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-8 text-center text-sm text-gray-500">
                  Enter your order ID to view tracking details.
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
                  <Card className="rounded-sm border border-[#E5E5E5]">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Order ID</p>
                          <p className="font-semibold text-[#0B1F3A]">
                            {order.id}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {order.delivery_status || order.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500">Order Date</p>
                          <p className="text-[#0B1F3A] font-medium">
                            {formatDate(order.created_at)},{" "}
                            {formatTime(order.created_at)}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">Total Amount</p>
                          <p className="text-[#0B1F3A] font-semibold">
                            ₹{Number(order.total_amount || 0).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">Payment Status</p>
                          <p className="text-[#0B1F3A] font-medium">
                            {order.status || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">Delivery Address</p>
                          <p className="text-[#0B1F3A] font-medium">
                            {order.buyer_name || "N/A"}
                          </p>
                          <p className="text-gray-500 mt-1">
                            {deliveryAddress || "N/A"}
                          </p>
                          <p className="text-gray-500">
                            Phone: {order.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-sm border border-[#E5E5E5]">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500">
                        Order Tracking Status
                      </p>

                      <div className="mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          {steps.map((s, idx) => {
                            const Icon = getStepIcon(s.status);

                            return (
                              <div key={s.id || idx} className="relative">
                                <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                                  <div className="relative">
                                    <div className="h-9 w-9 rounded-full border-2 border-green-600 bg-green-50 flex items-center justify-center">
                                      <Icon
                                        size={16}
                                        className="text-green-700"
                                      />
                                    </div>

                                    {idx < steps.length - 1 && (
                                      <div className="hidden md:block absolute left-9 top-1/2 h-0.5 w-[calc(100%+16px)] bg-green-600" />
                                    )}
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-[#0B1F3A] capitalize">
                                      {s.status}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                      {formatDate(s.changed_at)}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                      {formatTime(s.changed_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 border border-green-100 bg-green-50 rounded-sm p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="text-xs text-green-800">
                            <span className="font-semibold">
                              Current Status:{" "}
                              {order.delivery_status || order.status}
                            </span>
                            <div className="text-green-700">
                              Last updated from backend tracking history
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            className="rounded-sm border-[#E5E5E5]"
                          >
                            <Download size={16} className="mr-2" />
                            Download Invoice
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="rounded-sm border border-[#E5E5E5] lg:col-span-2">
                    <CardContent className="p-0">
                      <div className="px-4 py-3 border-b border-[#E5E5E5]">
                        <p className="font-semibold text-[#0B1F3A] text-sm">
                          Order Items ({items.length})
                        </p>
                      </div>

                      <div className="p-4 space-y-4">
                        {items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center gap-3"
                          >
                            <div className="h-12 w-12 rounded-sm border border-[#E5E5E5] bg-gray-50 shrink-0" />

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#0B1F3A] truncate">
                                {it.product_name || "Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                SKU: {it.sku || "N/A"} | {it.unit || "Unit"}
                              </p>
                            </div>

                            <div className="text-xs text-gray-500">
                              Qty: {it.quantity}
                            </div>

                            <div className="text-sm font-semibold text-[#0B1F3A]">
                              ₹{Number(it.price || 0).toLocaleString()}
                            </div>
                          </div>
                        ))}

                        <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#0B1F3A]">
                            Total
                          </p>
                          <p className="text-sm font-semibold text-[#0B1F3A]">
                            ₹
                            {Number(
                              order.total_amount || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <Card className="rounded-sm border border-[#E5E5E5]">
                      <CardContent className="p-4">
                        <p className="font-semibold text-[#0B1F3A] text-sm">
                          Shipment Details
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500">Courier Partner</p>
                            <p className="font-semibold text-[#0B1F3A]">
                              {order.courier || order.courier_name || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500">Delivery</p>
                            <p className="font-semibold text-[#0B1F3A] uppercase">
                              {order.delivery_status || order.status}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <p className="text-gray-500">AWB Number</p>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <p className="font-semibold text-[#0B1F3A] break-all">
                                {order.awb || order.tracking_number || "N/A"}
                              </p>

                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-sm border-[#E5E5E5] h-8 px-2"
                                onClick={copyAwb}
                              >
                                <Copy size={14} className="mr-2" />
                                {awbCopied ? "Copied" : "Copy"}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-500">Shipping Date</p>
                            <p className="font-medium text-[#0B1F3A]">
                              {formatDate(
                                order.shipping_date || order.shipped_at
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500">
                              Estimated Delivery
                            </p>
                            <p className="font-medium text-[#0B1F3A]">
                              {formatDate(order.estimated_delivery)}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <p className="text-gray-500">Delivery Address</p>
                            <div className="mt-1 flex items-start gap-2">
                              <MapPin
                                size={14}
                                className="text-gray-500 mt-0.5"
                              />

                              <div>
                                <p className="font-semibold text-[#0B1F3A]">
                                  {order.buyer_name || "N/A"}
                                </p>
                                <p className="text-gray-500">
                                  {deliveryAddress || "N/A"}
                                </p>
                                <p className="text-gray-500">
                                  {order.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-sm border border-[#E5E5E5]">
                      <CardContent className="p-4">
                        <p className="font-semibold text-[#0B1F3A] text-sm">
                          Tracking History
                        </p>

                        <div className="mt-3 space-y-3">
                          {steps.map((s, idx) => (
                            <div
                              key={s.id || idx}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#0B1F3A] capitalize">
                                  {s.status}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {formatDate(s.changed_at)},{" "}
                                  {formatTime(s.changed_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;