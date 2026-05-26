"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useDispatch, useSelector } from "react-redux";

import { logoutUserThunk } from "../../../store/slices/authSlice";
import { fetchOrders } from "../../../store/slices/orderSlice";
import { fetchProfile } from "../../../store/slices/profileSlice";
import { fetchAddresses } from "../../../store/slices/addressSlice";

import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import ViewOrderDetails from "@/components/buyer/ViewOrderDetails";

import {
  Package,
  CheckCircle,
  Hourglass,
  Search,
  Truck,
  XCircle,
  RotateCcw,
  Download,
  ChevronRight,
  Calendar,
} from "lucide-react";

const Page = () => {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const authUser = useSelector((state) => state.auth.user);
  const { profile } = useSelector((state) => state.profile);
  const { orders = [], loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProfile());
    dispatch(fetchAddresses());
  }, [dispatch]);

  const activeUser = profile || authUser || {};

  const fullName =
    activeUser?.full_name ||
    activeUser?.fullName ||
    activeUser?.name ||
    "";

  const [firstName = "", ...rest] = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const user = {
    firstName: activeUser?.firstName || firstName,
    lastName: activeUser?.lastName || rest.join(" "),
    email: activeUser?.email || "",
    phone: activeUser?.phone || "",
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "delivered") return "bg-green-100 text-green-700 hover:bg-green-100";
    if (s === "shipped") return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    if (s === "cancelled") return "bg-red-100 text-red-700 hover:bg-red-100";

    return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = String(order.status || "").toLowerCase();
    const selectedStatus = statusFilter.toLowerCase();

    const statusMatch =
      statusFilter === "All Status" || orderStatus === selectedStatus;

    const search = searchQuery.trim().toLowerCase();

    const searchMatch =
      !search ||
      String(order.id).toLowerCase().includes(search) ||
      String(order.buyer_name || "").toLowerCase().includes(search) ||
      String(order.total_amount || "").toLowerCase().includes(search) ||
      String(order.status || "").toLowerCase().includes(search);

    return statusMatch && searchMatch;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) =>
      ["pending", "processing"].includes(String(o.status || "").toLowerCase())
    ).length,
    processing: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "processing"
    ).length,
    shipped: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "shipped"
    ).length,
    delivered: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "delivered"
    ).length,
    cancelled: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "cancelled"
    ).length,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A]">My Orders</h1>

              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>Home</span>
                <ChevronRight size={14} />
                <span className="text-[#0B1F3A] font-medium">My Orders</span>
              </div>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5] shadow-none">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                  <div className="lg:col-span-5">
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-2">
                      Search Orders
                    </p>

                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />

                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order id, buyer or status..."
                        className="pl-9 rounded-sm border-[#E5E5E5] h-10"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-2">
                      Order Status
                    </p>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-10 rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm outline-none"
                    >
                      <option>All Status</option>
                      <option>pending</option>
                      <option>processing</option>
                      <option>shipped</option>
                      <option>delivered</option>
                      <option>cancelled</option>
                    </select>
                  </div>

                  <div className="lg:col-span-3">
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-2">
                      Date Range
                    </p>

                    <div className="relative">
                      <Calendar
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />

                      <Input
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        placeholder="Select date range"
                        className="pr-9 rounded-sm border-[#E5E5E5] h-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                ["All Orders", statusCounts.all, Package, "bg-blue-50 text-blue-600"],
                ["Pending", statusCounts.pending, Hourglass, "bg-yellow-50 text-yellow-600"],
                ["Processing", statusCounts.processing, RotateCcw, "bg-indigo-50 text-indigo-600"],
                ["Shipped", statusCounts.shipped, Truck, "bg-purple-50 text-purple-600"],
                ["Delivered", statusCounts.delivered, CheckCircle, "bg-green-50 text-green-600"],
                ["Cancelled", statusCounts.cancelled, XCircle, "bg-red-50 text-red-600"],
              ].map(([label, count, Icon, color]) => (
                <Card
                  key={label}
                  className="rounded-sm border border-[#E5E5E5] shadow-none"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-sm flex items-center justify-center ${color}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-bold text-[#0B1F3A] text-lg">
                        {count}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-sm border border-[#E5E5E5] shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-xs text-gray-500 border-b">
                        <th className="text-left font-medium px-5 py-4">
                          Order Details
                        </th>
                        <th className="text-left font-medium px-5 py-4">Date</th>
                        <th className="text-left font-medium px-5 py-4">
                          Amount
                        </th>
                        <th className="text-left font-medium px-5 py-4">
                          Status
                        </th>
                        <th className="text-left font-medium px-5 py-4">
                          Payment
                        </th>
                        <th className="text-right font-medium px-5 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-gray-500"
                          >
                            Loading orders...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-red-500"
                          >
                            {String(error)}
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-gray-500"
                          >
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-sm border border-[#E5E5E5] bg-gray-50 flex items-center justify-center">
                                  <Package size={20} className="text-[#0B1F3A]" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500">
                                    Order ID
                                  </p>

                                  <p className="font-semibold text-[#0B1F3A] truncate">
                                    #{String(order.id).slice(0, 8).toUpperCase()}
                                  </p>

                                  <p className="text-xs text-gray-500 truncate">
                                    Buyer: {order.buyer_name || user.firstName || "-"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              {formatDate(order.created_at)}
                            </td>

                            <td className="px-5 py-4 font-semibold text-[#0B1F3A]">
                              ₹
                              {Number(order.total_amount || 0).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <Badge className={getStatusClass(order.status)}>
                                {order.status || "pending"}
                              </Badge>
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              {order.payment_method || "Online Payment"}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedOrder(order)}
                                  className="h-9 rounded-sm border-[#E5E5E5] hover:bg-[#0B1F3A] hover:text-white transition-all duration-200"
                                >
                                  View Details
                                </Button>

                                <Button
                                  variant="outline"
                                  className="rounded-sm border-[#E5E5E5] h-9 w-9 p-0"
                                >
                                  <Download size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t text-xs text-gray-500 flex items-center justify-between bg-white">
                  <span>Showing {filteredOrders.length} orders</span>

                  <Button
                    variant="outline"
                    className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0"
                  >
                    1
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ViewOrderDetails
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default Page;