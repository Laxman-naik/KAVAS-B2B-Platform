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
  ChevronLeft,
  Calendar,
  Loader2,
  AlertCircle,
  Inbox,
} from "lucide-react";

const ORDERS_PER_PAGE = 8;

const Page = () => {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const router = useRouter();

  const authUser = useSelector((state) => state.auth.user);
  console.log("AUTH USER:", authUser);
  console.log("BUYER ORG:", authUser?.organization_id);
  const { profile } = useSelector((state) => state.profile);
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const loggedUserId =
    authUser?.id || authUser?._id || profile?.id || profile?._id;

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProfile());
    dispatch(fetchAddresses());
  }, [dispatch]);

  const activeUser = profile || authUser || {};

  const fullName =
    activeUser?.full_name || activeUser?.fullName || activeUser?.name || "";

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

    if (s === "delivered")
      return "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50";
    if (s === "shipped")
      return "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50";
    if (s === "cancelled")
      return "bg-red-50 text-red-700 border border-red-200 hover:bg-red-50";

    return "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50";
  };

  const myOrders = orders.filter((order) => {
    const orderUserId =
      order.user_id ||
      order.userId ||
      order.buyer_id ||
      order.buyerId ||
      order.user?.id ||
      order.user?._id;

    return String(orderUserId) === String(loggedUserId);
  });

  const filteredOrders = myOrders.filter((order) => {
    const orderStatus = String(order.status || "").toLowerCase();
    const selectedStatus = statusFilter.toLowerCase();

    const statusMatch =
      statusFilter === "All Status" || orderStatus === selectedStatus;

    const search = searchQuery.trim().toLowerCase();

    const searchMatch =
      !search ||
      String(order.id).toLowerCase().includes(search) ||
      String(order.buyer_name || "")
        .toLowerCase()
        .includes(search) ||
      String(order.total_amount || "")
        .toLowerCase()
        .includes(search) ||
      String(order.status || "")
        .toLowerCase()
        .includes(search);

    return statusMatch && searchMatch;
  });

  // Reset to page 1 whenever filters change so you don't land on an empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * ORDERS_PER_PAGE,
    safePage * ORDERS_PER_PAGE
  );

  const goToPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  const statusCounts = {
    all: myOrders.length,
    pending: myOrders.filter((o) =>
      ["pending", "processing"].includes(String(o.status || "").toLowerCase()),
    ).length,
    processing: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "processing",
    ).length,
    shipped: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "shipped",
    ).length,
    delivered: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "delivered",
    ).length,
    cancelled: orders.filter(
      (o) => String(o.status || "").toLowerCase() === "cancelled",
    ).length,
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A] tracking-tight">
                My Orders
              </h1>

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                <span className="hover:text-[#0B1F3A] transition-colors cursor-pointer">
                  Home
                </span>
                <ChevronRight size={13} className="text-gray-300" />
                <span className="text-[#0B1F3A] font-medium">My Orders</span>
              </div>
            </div>

            {/* Filters */}
            <Card className="rounded-sm border border-[#E8E9ED] shadow-sm">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                  <div className="lg:col-span-5">
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-2 tracking-wide">
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
                        className="pl-9 rounded-sm border-[#E5E5E5] h-10 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-2 tracking-wide">
                      Order Status
                    </p>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-10 rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm text-[#0B1F3A] outline-none cursor-pointer focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
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
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-2 tracking-wide">
                      Date Range
                    </p>

                    <div className="relative">
                      <Calendar
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={16}
                      />

                      <Input
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        placeholder="Select date range"
                        className="pr-9 rounded-sm border-[#E5E5E5] h-10 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                [
                  "All Orders",
                  statusCounts.all,
                  Package,
                  "bg-blue-50 text-blue-600",
                ],
                [
                  "Pending",
                  statusCounts.pending,
                  Hourglass,
                  "bg-amber-50 text-amber-600",
                ],
                [
                  "Processing",
                  statusCounts.processing,
                  RotateCcw,
                  "bg-indigo-50 text-indigo-600",
                ],
                [
                  "Shipped",
                  statusCounts.shipped,
                  Truck,
                  "bg-purple-50 text-purple-600",
                ],
                [
                  "Delivered",
                  statusCounts.delivered,
                  CheckCircle,
                  "bg-green-50 text-green-600",
                ],
                [
                  "Cancelled",
                  statusCounts.cancelled,
                  XCircle,
                  "bg-red-50 text-red-600",
                ],
              ].map(([label, count, Icon, color]) => (
                <Card
                  key={label}
                  className="rounded-sm border border-[#E8E9ED] shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className={`h-11 w-11 shrink-0 rounded-sm flex items-center justify-center ${color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 truncate">{label}</p>
                      <p className="font-bold text-[#0B1F3A] text-lg leading-tight">
                        {count}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders Table */}
            <Card className="rounded-sm border border-[#E8E9ED] shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-[11px] uppercase tracking-wide text-gray-500 border-b border-[#E8E9ED]">
                        <th className="text-left font-semibold px-5 py-3.5">
                          Order Details
                        </th>
                        <th className="text-left font-semibold px-5 py-3.5">
                          Date
                        </th>
                        <th className="text-left font-semibold px-5 py-3.5">
                          Amount
                        </th>
                        <th className="text-left font-semibold px-5 py-3.5">
                          Status
                        </th>
                        <th className="text-left font-semibold px-5 py-3.5">
                          Payment
                        </th>
                        <th className="text-right font-semibold px-5 py-3.5">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center">
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Loader2 size={22} className="animate-spin text-[#0B1F3A]" />
                              <span className="text-sm text-gray-500">
                                Loading orders...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <AlertCircle size={22} className="text-red-400" />
                              <span className="text-sm text-red-500">
                                {String(error)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center">
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Inbox size={26} className="text-gray-300" />
                              <span className="text-sm text-gray-500">
                                No orders found.
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-[#F0F1F3] last:border-b-0 hover:bg-[#FAFBFC] transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 shrink-0 rounded-sm border border-[#E8E9ED] bg-[#F8FAFC] flex items-center justify-center">
                                  <Package
                                    size={18}
                                    className="text-[#0B1F3A]"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                                    Order ID
                                  </p>

                                  <p className="font-semibold text-[#0B1F3A] truncate">
                                    #
                                    {String(order.id).slice(0, 40).toUpperCase()}
                                  </p>

                                  <p className="text-xs text-gray-500 truncate">
                                    Buyer:{" "}
                                    {order.buyer_name || user.firstName || "-"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                              {formatDate(order.created_at)}
                            </td>

                            <td className="px-5 py-4 font-semibold text-[#0B1F3A] whitespace-nowrap">
                              ₹
                              {Number(order.total_amount || 0).toLocaleString(
                                "en-IN",
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <Badge
                                className={`rounded-sm font-medium px-2.5 py-1 capitalize ${getStatusClass(order.status)}`}
                              >
                                {order.status || "pending"}
                              </Badge>
                            </td>

                            <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                              {order.payment_method
                                ? order.payment_method.toUpperCase() === "COD"
                                  ? "Cash on Delivery"
                                  : "Online Payment"
                                : "Online Payment"}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedOrder(order)}
                                  className="h-9 rounded-sm border-[#E5E5E5] text-[#0B1F3A] font-medium hover:bg-[#0B1F3A] hover:text-white hover:border-[#0B1F3A] transition-all duration-200"
                                >
                                  View Details
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-[#E8E9ED] text-xs text-gray-500 flex items-center justify-between bg-white">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-[#0B1F3A]">
                      {filteredOrders.length === 0 ? 0 : (safePage - 1) * ORDERS_PER_PAGE + 1}
                      –
                      {Math.min(safePage * ORDERS_PER_PAGE, filteredOrders.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#0B1F3A]">
                      {filteredOrders.length}
                    </span>{" "}
                    orders
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      onClick={goToPrevPage}
                      disabled={safePage === 1}
                      className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#0B1F3A]"
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    <span className="min-w-[70px] text-center text-xs font-medium text-[#0B1F3A]">
                      Page {safePage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={safePage === totalPages}
                      className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#0B1F3A]"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
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