"use client";
 
import React from "react";
import Link from "next/link";
import { productapi } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  MapPin,
  Package,
  Phone,
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
 
const STATUS_BADGE_STYLES = {
  delivered: "bg-green-100 text-green-700 border border-green-200",
  shipped: "bg-blue-100 text-blue-700 border border-blue-200",
  "in transit": "bg-blue-100 text-blue-700 border border-blue-200",
  confirmed: "bg-amber-100 text-amber-700 border border-amber-200",
  pending: "bg-gray-100 text-gray-700 border border-gray-200",
  cancelled: "bg-red-100 text-red-700 border border-red-200",
};
 
const getStatusBadgeClass = (status) => {
  const key = String(status || "").toLowerCase();
  return (
    STATUS_BADGE_STYLES[key] ||
    "bg-gray-100 text-gray-700 border border-gray-200"
  );
};
 
const ORDER_STAGES = [
  { key: "placed", label: "Order Placed", icon: User, match: ["placed", "pending"] },
  { key: "confirmed", label: "Confirmed", icon: ShieldCheck, match: ["confirm"] },
  { key: "shipped", label: "Shipped", icon: Truck, match: ["ship"] },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Package, match: ["out for delivery", "delivery"] },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, match: ["deliver"] },
];
 
const resolveCurrentStageIndex = (steps, orderStatus) => {
  const statuses = steps.map((s) => String(s.status || "").toLowerCase());
  const fallback = String(orderStatus || "").toLowerCase();
  const haystack = statuses.length ? statuses : [fallback];
 
  let lastMatchedIndex = -1;
 
  ORDER_STAGES.forEach((stage, idx) => {
    const isMatched = haystack.some((status) =>
      stage.match.some((keyword) => status.includes(keyword))
    );
    if (isMatched) lastMatchedIndex = idx;
  });
 
  return lastMatchedIndex;
};
 
const getStageTimestamp = (steps, stage) => {
  const found = [...steps]
    .reverse()
    .find((s) =>
      stage.match.some((keyword) =>
        String(s.status || "").toLowerCase().includes(keyword)
      )
    );
  return found?.changed_at || null;
};
 
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
 
  const currentStageIndex = React.useMemo(
    () => resolveCurrentStageIndex(steps, order?.delivery_status || order?.status),
    [steps, order]
  );
 
  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>
 
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col gap-1">
              
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight">
                Track Order
              </h1>
              <p className="text-sm text-gray-500">
                Stay up to date with the live status of your shipment.
              </p>
            </div>
 

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
              <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
                <CardContent className="p-5">
                  <p className="font-semibold text-[#0B1F3A]">
                    Track Your Order
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your Order ID below to view the latest tracking
                    status.
                  </p>
 
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && trackOrder()}
                        placeholder="Enter Order ID"
                        className="pl-9 rounded-sm h-11"
                      />
                    </div>
 
                    <Button
                      onClick={trackOrder}
                      disabled={loading}
                      className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/90 h-11 px-6 font-medium"
                    >
                      {loading ? "Tracking..." : "Track Order"}
                    </Button>
                  </div>
 
                  {error && (
                    <p className="mt-2 text-xs text-red-600 font-medium">
                      {error}
                    </p>
                  )}
                </CardContent>
              </Card>
 
              <Card className="rounded-sm border border-[#E5E5E5] bg-[#0B1F3A]  text-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-300" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                      Need help?
                    </p>
                  </div>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Your Order ID was sent to your registered email upon
                    purchase. Enter it above to see real-time delivery
                    progress.
                  </p>
                </CardContent>
              </Card>
            </div>
 
            {!order ? (
              <Card className="rounded-sm border border-dashed border-[#E5E5E5]">
                <CardContent className="p-12 flex flex-col items-center text-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package size={22} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-[#0B1F3A]">
                    No order tracked yet
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Enter your Order ID above and click Track Order to view
                    tracking details.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Order summary + tracking timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
                  <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Order ID</p>
                          <p className="font-semibold text-[#0B1F3A]">
                            {order.id}
                          </p>
                        </div>
                        <Badge
                          className={`rounded-sm capitalize font-medium ${getStatusBadgeClass(
                            order.delivery_status || order.status
                          )}`}
                        >
                          {order.delivery_status || order.status}
                        </Badge>
                      </div>
 
                      <div className="h-px bg-[#E5E5E5]" />
 
                      <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-xs">
                        <div>
                          <p className="text-gray-500">Order Date</p>
                          <p className="text-[#0B1F3A] font-medium mt-0.5">
                            {formatDate(order.created_at)},{" "}
                            {formatTime(order.created_at)}
                          </p>
                        </div>
 
                        <div>
                          <p className="text-gray-500">Total Amount</p>
                          <p className="text-[#0B1F3A] font-semibold mt-0.5">
                            ₹{Number(order.total_amount || 0).toLocaleString()}
                          </p>
                        </div>
 
                        <div>
                          <p className="text-gray-500">Payment Status</p>
                          <p className="text-[#0B1F3A] font-medium mt-0.5 capitalize">
                            {order.status || "N/A"}
                          </p>
                        </div>
                      </div>
 
                      <div className="h-px bg-[#E5E5E5]" />
 
                      <div>
                        <p className="text-gray-500 text-xs mb-2 flex items-center gap-1.5">
                          <MapPin size={13} />
                          Delivery Address
                        </p>
                        <p className="text-[#0B1F3A] font-medium text-sm">
                          {order.buyer_name || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                          {deliveryAddress || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1.5">
                          <Phone size={12} />
                          {order.phone || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
 
                  <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        Order Tracking Status
                      </p>
 
                      <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
                          {ORDER_STAGES.map((stage, idx) => {
                            const Icon = stage.icon;
                            const isCompleted = idx < currentStageIndex;
                            const isCurrent = idx === currentStageIndex;
                            const isUpcoming = idx > currentStageIndex;
                            const timestamp = getStageTimestamp(steps, stage);
 
                            const circleClass = isCompleted
                              ? "border-green-600 bg-green-600 text-white"
                              : isCurrent
                              ? "border-[#E8891C] bg-amber-50 text-[#E8891C] ring-4 ring-amber-100"
                              : "border-gray-200 bg-gray-50 text-gray-300";
 
                            const lineClass =
                              idx < currentStageIndex
                                ? "bg-green-600"
                                : "bg-gray-200";
 
                            return (
                              <div key={stage.key} className="relative">
                                <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                                  <div className="relative shrink-0">
                                    <div
                                      className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition ${circleClass}`}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 size={18} />
                                      ) : (
                                        <Icon size={17} />
                                      )}
                                    </div>
 
                                    {idx < ORDER_STAGES.length - 1 && (
                                      <div
                                        className={`hidden md:block absolute left-10 top-1/2 -translate-y-1/2 h-0.5 w-[calc(100%+0.5rem)] transition ${lineClass}`}
                                      />
                                    )}
                                  </div>
 
                                  <div>
                                    <p
                                      className={`text-xs font-semibold ${
                                        isUpcoming
                                          ? "text-gray-400"
                                          : "text-[#0B1F3A]"
                                      }`}
                                    >
                                      {stage.label}
                                    </p>
                                    {isCurrent && (
                                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#E8891C] bg-amber-50 border border-amber-200 rounded-sm px-1.5 py-0.5">
                                        In progress
                                      </span>
                                    )}
                                    {timestamp && !isUpcoming && (
                                      <>
                                        <p className="text-[11px] text-gray-500 mt-1">
                                          {formatDate(timestamp)}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                          {formatTime(timestamp)}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
 
                        <div className="mt-6 border border-green-200 bg-green-50 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="text-xs text-green-800">
                            <span className="font-semibold">
                              Current Status:{" "}
                              <span className="capitalize">
                                {order.delivery_status || order.status}
                              </span>
                            </span>
                            <div className="text-green-700 mt-0.5">
                              Last updated from backend tracking history
                            </div>
                          </div>
 
                          <Button
                            variant="outline"
                            className="rounded-sm border-[#E5E5E5] bg-white hover:bg-gray-50"
                          >
                            <Download size={16} className="mr-2" />
                            Download Invoice
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
 
                {/* Order items + shipment details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="rounded-sm border border-[#E5E5E5] shadow-sm lg:col-span-2">
                    <CardContent className="p-0">
                      <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
                        <p className="font-semibold text-[#0B1F3A] text-sm">
                          Order Items
                        </p>
                        <Badge className="rounded-sm bg-gray-100 text-gray-600 font-medium">
                          {items.length} {items.length === 1 ? "item" : "items"}
                        </Badge>
                      </div>
 
                      <div className="divide-y divide-[#E5E5E5]">
                        {items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center gap-3 px-5 py-4"
                          >
                            <div className="h-12 w-12 rounded-sm border border-[#E5E5E5] bg-gray-50 shrink-0" />
 
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#0B1F3A] truncate">
                                {it.product_name || "Product"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                SKU: {it.sku || "N/A"} · {it.unit || "Unit"}
                              </p>
                            </div>
 
                            <div className="text-xs text-gray-500 shrink-0">
                              Qty: {it.quantity}
                            </div>
 
                            <div className="text-sm font-semibold text-[#0B1F3A] shrink-0 w-24 text-right">
                              ₹{Number(it.price || 0).toLocaleString()}
                            </div>
                          </div>
                        ))}
 
                        <div className="px-5 py-4 flex items-center justify-between bg-gray-50">
                          <p className="text-sm font-semibold text-[#0B1F3A]">
                            Total
                          </p>
                          <p className="text-sm font-bold text-[#0B1F3A]">
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
                    <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
                      <CardContent className="p-5">
                        <p className="font-semibold text-[#0B1F3A] text-sm">
                          Shipment Details
                        </p>
 
                        <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-3 text-xs">
                          <div>
                            <p className="text-gray-500">Courier Partner</p>
                            <p className="font-semibold text-[#0B1F3A] mt-0.5">
                              {order.courier || order.courier_name || "N/A"}
                            </p>
                          </div>
 
                          <div>
                            <p className="text-gray-500">Delivery</p>
                            <p className="font-semibold text-[#0B1F3A] uppercase mt-0.5">
                              {order.delivery_status || order.status}
                            </p>
                          </div>
 
                          <div className="col-span-2">
                            <p className="text-gray-500">AWB Number</p>
                            <div className="mt-1.5 flex items-center justify-between gap-2 bg-gray-50 border border-[#E5E5E5] rounded-sm px-3 py-2">
                              <p className="font-semibold text-[#0B1F3A] break-all text-xs">
                                {order.awb || order.tracking_number || "N/A"}
                              </p>
 
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-sm border-[#E5E5E5] h-7 px-2 shrink-0 bg-white"
                                onClick={copyAwb}
                              >
                                <Copy size={13} className="mr-1.5" />
                                {awbCopied ? "Copied" : "Copy"}
                              </Button>
                            </div>
                          </div>
 
                          <div>
                            <p className="text-gray-500">Shipping Date</p>
                            <p className="font-medium text-[#0B1F3A] mt-0.5">
                              {formatDate(
                                order.shipping_date || order.shipped_at
                              )}
                            </p>
                          </div>
 
                          <div>
                            <p className="text-gray-500">
                              Estimated Delivery
                            </p>
                            <p className="font-medium text-[#0B1F3A] mt-0.5">
                              {formatDate(order.estimated_delivery)}
                            </p>
                          </div>
 
                          <div className="col-span-2 pt-1">
                            <p className="text-gray-500">Delivery Address</p>
                            <div className="mt-1.5 flex items-start gap-2">
                              <MapPin
                                size={14}
                                className="text-gray-400 mt-0.5 shrink-0"
                              />
 
                              <div>
                                <p className="font-semibold text-[#0B1F3A]">
                                  {order.buyer_name || "N/A"}
                                </p>
                                <p className="text-gray-500 mt-0.5 leading-relaxed">
                                  {deliveryAddress || "N/A"}
                                </p>
                                <p className="text-gray-500 mt-0.5">
                                  {order.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
 
                    <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
                      <CardContent className="p-5">
                        <p className="font-semibold text-[#0B1F3A] text-sm">
                          Tracking History
                        </p>
 
                        <div className="mt-4 space-y-4">
                          {steps.map((s, idx) => (
                            <div
                              key={s.id || idx}
                              className="flex items-start gap-3"
                            >
                              <div className="flex flex-col items-center self-stretch">
                                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600 shrink-0" />
                                {idx < steps.length - 1 && (
                                  <div className="w-px flex-1 bg-[#E5E5E5] mt-1" />
                                )}
                              </div>
                              <div className="min-w-0 pb-1">
                                <p className="text-xs font-semibold text-[#0B1F3A] capitalize">
                                  {s.status}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
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