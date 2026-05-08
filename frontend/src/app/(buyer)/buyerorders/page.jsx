"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import {
  Package,
  CheckCircle,
  Hourglass,
  IndianRupee,
  Search,
  Truck,
  XCircle,
  FileText,
  RotateCcw,
  Repeat,
  Download,
  ChevronRight,
  Calendar,
} from "lucide-react";

const ordersData = [
  {
    id: "#KVS-10482",
    date: "20 Mar 2025",
    status: "Delivered",
    total: 49000,
    items: [
      {
        name: "Wireless Earbuds TWS Pro 50pcs",
        seller: "TechLink India",
        qty: 50,
        price: 22500,
        image: "https://images.unsplash.com/photo-1518441902110-3c3c8b5e9d52",
      },
      {
        name: "Cotton T-Shirts Wholesale x100",
        seller: "FabricWorld Co.",
        qty: 100,
        price: 8800,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      },
    ],
  },
  {
    id: "#KVS-10391",
    date: "14 Mar 2025",
    status: "Shipped",
    total: 19600,
    items: [
      {
        name: "SS Bolt Set Stainless Steel Kit",
        seller: "BoltCraft Hardware",
        qty: 20,
        price: 19600,
        image: "https://images.unsplash.com/photo-1581091215367-59ab6b6f3d3c",
      },
    ],
  },
];

const Page = () => {
  const [tab, setTab] = useState("All Orders");
  const [timeFilter, setTimeFilter] = useState("All time");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("");
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const filteredOrders = ordersData.filter((order) => {
    const tabMatch = tab === "All Orders" || order.status === tab;

    const statusMatch =
      statusFilter === "All Status" || order.status === statusFilter;

    const search = searchQuery.trim().toLowerCase();
    const searchMatch =
      !search ||
      String(order.id).toLowerCase().includes(search) ||
      order.items.some((it) => String(it.name).toLowerCase().includes(search));

    // TIME FILTER
    const orderDate = new Date(order.date);
    const today = new Date();

    let timeMatch = true;

    if (timeFilter === "Last 30 days") {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      timeMatch = orderDate >= past;
    }

    if (timeFilter === "Last 3 months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 3);
      timeMatch = orderDate >= past;
    }

    if (timeFilter === "Last 6 months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 6);
      timeMatch = orderDate >= past;
    }

    return tabMatch && statusMatch && searchMatch && timeMatch;
  });

  const statusCounts = {
    all: ordersData.length,
    pending: ordersData.filter((o) => o.status === "Processing").length,
    processing: ordersData.filter((o) => o.status === "Processing").length,
    shipped: ordersData.filter((o) => o.status === "Shipped").length,
    delivered: ordersData.filter((o) => o.status === "Delivered").length,
    cancelled: ordersData.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <>
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

                <Button className="bg-[#0B1F3A] text-[#D4AF37] rounded-sm hover:bg-[#0B1F3A]/95 font-semibold w-full sm:w-auto">
                  <Download size={16} className="mr-2" /> Download All Invoices
                </Button>
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
                          placeholder="Search by Order ID, Product or Brand..."
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
                        className="w-full h-10 rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm"
                      >
                        <option>All Status</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
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

                    <div className="lg:col-span-1">
                      <p className="text-xs font-semibold text-[#0B1F3A] mb-2 opacity-0">
                        Reset
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-sm border-[#E5E5E5]"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("All Status");
                          setDateRange("");
                          setTimeFilter("All time");
                          setTab("All Orders");
                        }}
                      >
                        Reset
                      </Button>
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
                        {filteredOrders.flatMap((order) =>
                          order.items.map((item, idx) => (
                            <tr key={`${order.id}-${idx}`} className="border-t">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-sm object-cover border"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500">
                                      Order ID
                                    </p>
                                    <p className="font-semibold text-[#0B1F3A] truncate">
                                      {order.id}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {item.name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-gray-600">
                                {order.date}
                              </td>
                              <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                                ₹{item.price.toLocaleString()}
                              </td>
                              <td className="px-4 py-4">
                                <Badge
                                  className={
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-600"
                                      : order.status === "Shipped"
                                        ? "bg-blue-100 text-blue-600"
                                        : order.status === "Cancelled"
                                          ? "bg-red-100 text-red-600"
                                          : "bg-yellow-100 text-yellow-700"
                                  }
                                >
                                  {order.status}
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
                                    onClick={() => {
                                      setSelectedOrder({
                                        ...order,
                                        selectedItem: item,
                                      });
                                      setShowDetailsModal(true);
                                    }}
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
                          )),
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-4 py-3 border-t text-xs text-gray-500 flex items-center justify-between">
                    <span>
                      Showing 1 to {Math.min(filteredOrders.length, 12)} of{" "}
                      {filteredOrders.length} orders
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0"
                      >
                        1
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0"
                      >
                        2
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0"
                      >
                        3
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-sm shadow-xl border border-[#E5E5E5] animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                Order Details
              </h2>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-xl font-bold text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-[#0B1F3A]">
                    {selectedOrder.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="font-semibold text-[#0B1F3A]">
                    {selectedOrder.date}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Order Status</p>
                  <p className="font-semibold text-green-600">
                    {selectedOrder.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold text-[#0B1F3A]">
                    ₹{selectedOrder.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="border rounded-sm p-4">
                <p className="font-semibold text-[#0B1F3A] mb-4">
                  Product Details
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={selectedOrder.selectedItem.image}
                    alt={selectedOrder.selectedItem.name}
                    className="w-20 h-20 rounded-sm object-cover border"
                  />

                  <div className="space-y-1">
                    <p className="font-semibold text-[#0B1F3A]">
                      {selectedOrder.selectedItem.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Seller: {selectedOrder.selectedItem.seller}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {selectedOrder.selectedItem.qty}
                    </p>

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{selectedOrder.selectedItem.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border rounded-sm p-4">
                <p className="font-semibold text-[#0B1F3A] mb-2">
                  Payment Details
                </p>

                <p className="text-sm text-gray-600">
                  Payment Method: Online Payment
                </p>

                <p className="text-sm text-gray-600">Invoice Status: Paid</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="rounded-sm border-[#E5E5E5]"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>

                <Button className="bg-[#0B1F3A] text-[#D4AF37] rounded-sm hover:bg-[#0B1F3A]/95">
                  <Download size={16} className="mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
