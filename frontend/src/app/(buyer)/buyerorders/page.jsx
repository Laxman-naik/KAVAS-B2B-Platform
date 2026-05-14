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
import ProfileSidebar from "@/components/buyer/ProfileSidebar";

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

  const dispatch = useDispatch();
  const router = useRouter();

  const authUser = useSelector((state) => state.auth.user);
  const { orders = [], loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

    if (s === "delivered") return "bg-green-100 text-green-600";
    if (s === "shipped") return "bg-blue-100 text-blue-600";
    if (s === "cancelled") return "bg-red-100 text-red-600";

    return "bg-yellow-100 text-yellow-700";
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
    pending: orders.filter(
      (o) =>
        String(o.status || "").toLowerCase() === "pending" ||
        String(o.status || "").toLowerCase() === "processing"
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
    <div className="bg-white min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                  My Orders
                </h1>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>Home</span>
                  <ChevronRight size={14} />
                  <span className="text-[#0B1F3A]">My Orders</span>
                </div>
              </div>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
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
                        placeholder="Search by Order ID, Buyer or Status..."
                        className="pl-9 rounded-sm"
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
                      className="w-full h-8 rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm"
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
                        placeholder="Select Date Range"
                        className="pr-9 rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-sm bg-blue-50 flex items-center justify-center">
                    <Package className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">All Orders</p>
                    <p className="font-bold text-[#0B1F3A]">
                      {statusCounts.all}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-sm bg-yellow-50 flex items-center justify-center">
                    <Hourglass className="text-yellow-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="font-bold text-[#0B1F3A]">
                      {statusCounts.pending}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-sm bg-indigo-50 flex items-center justify-center">
                    <RotateCcw className="text-indigo-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Processing</p>
                    <p className="font-bold text-[#0B1F3A]">
                      {statusCounts.processing}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-sm bg-purple-50 flex items-center justify-center">
                    <Truck className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shipped</p>
                    <p className="font-bold text-[#0B1F3A]">
                      {statusCounts.shipped}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-sm bg-green-50 flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Delivered</p>
                    <p className="font-bold text-[#0B1F3A]">
                      {statusCounts.delivered}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-sm bg-red-50 flex items-center justify-center">
                    <XCircle className="text-red-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cancelled</p>
                    <p className="font-bold text-[#0B1F3A]">
                      {statusCounts.cancelled}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500">
                        <th className="text-left font-medium px-4 py-3">
                          Order Details
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Date
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Amount
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Status
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Payment
                        </th>
                        <th className="text-right font-medium px-4 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            Loading orders...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-red-500"
                          >
                            {String(error)}
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="border-t">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-sm border bg-gray-50 flex items-center justify-center">
                                  <Package
                                    size={18}
                                    className="text-gray-500"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500">
                                    Order ID
                                  </p>

                                  <p className="font-semibold text-[#0B1F3A] truncate">
                                    #{String(order.id).slice(0, 8).toUpperCase()}
                                  </p>

                                  <p className="text-xs text-gray-500 truncate">
                                    Buyer: {order.buyer_name || "-"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              {formatDate(order.created_at)}
                            </td>

                            <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                              ₹
                              {Number(order.total_amount || 0).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <Badge className={getStatusClass(order.status)}>
                                {order.status || "pending"}
                              </Badge>
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              Online Payment
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  className="rounded-sm border-[#E5E5E5] h-9"
                                >
                                  View Details
                                </Button>

                                <Button
                                  variant="outline"
                                  className="rounded-sm border-[#E5E5E5] h-9 w-9 p-0"
                                  title="Download"
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

                <div className="px-4 py-3 border-t text-xs text-gray-500 flex items-center justify-between">
                  <span>
                    Showing {filteredOrders.length > 0 ? 1 : 0} to{" "}
                    {filteredOrders.length} of {filteredOrders.length} orders
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0"
                    >
                      1
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
