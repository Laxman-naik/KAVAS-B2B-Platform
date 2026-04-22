"use client";

import { useState } from "react";
import { Search, Eye, Check, X } from "lucide-react";

export default function OrdersManagementBody() {
  const ordersData = [
    {
      id: "ORD-2024-8821",
      buyer: "Sharma Industries Pvt Ltd",
      email: "procurement@sharmaind.com",
      product: "Industrial Grade Bearings x 500",
      amount: 124000,
      status: "Pending",
      payment: "Pending",
      date: "2026-04-21",
    },
    {
      id: "ORD-2024-8820",
      buyer: "Mehta Traders",
      email: "orders@mehtatraders.in",
      product: "Stainless Steel Fasteners x 2000",
      amount: 56500,
      status: "Shipped",
      payment: "Paid",
      date: "2026-04-20",
    },
    {
      id: "ORD-2024-8819",
      buyer: "Gupta Manufacturing Co.",
      email: "purchase@guptamfg.com",
      product: "HDPE Pipes 50mm x 1000m",
      amount: 210000,
      status: "Delivered",
      payment: "Paid",
      date: "2026-04-19",
    },
    {
      id: "ORD-2024-8818",
      buyer: "Patel Enterprises",
      email: "buy@patelent.com",
      product: "Copper Wire 2.5mm x 500kg",
      amount: 88750,
      status: "Cancelled",
      payment: "Refunded",
      date: "2026-04-18",
    },
    {
      id: "ORD-2024-8817",
      buyer: "Rajesh Steel Works",
      email: "admin@rajeshsteel.in",
      product: "Hydraulic Seals Kit x 100",
      amount: 345200,
      status: "Delivered",
      payment: "Paid",
      date: "2026-04-17",
    },
  ];

  const [orders, setOrders] = useState(ordersData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= STATS ================= */

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  /* ================= FILTER ================= */

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || o.status === statusFilter;

    const matchDate =
      (!fromDate || new Date(o.date) >= new Date(fromDate)) &&
      (!toDate || new Date(o.date) <= new Date(toDate));

    return matchSearch && matchStatus && matchDate;
  });

  /* ================= ACTIONS ================= */

  const handleApprove = (id) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: "Shipped" } : o
      )
    );
  };

  const handleCancel = (id) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: "Cancelled" } : o
      )
    );
  };

  /* ================= STYLES ================= */

  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Shipped":
        return "bg-purple-100 text-purple-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100";
    }
  };

  const paymentStyle = (payment) => {
    return payment === "Paid"
      ? "bg-green-100 text-green-600"
      : payment === "Refunded"
      ? "bg-gray-200 text-gray-600"
      : "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="p-4 md:p-5 bg-[#FFF8EC] min-h-screen">

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 text-center lg:grid-cols-5 h-20   gap-4 mb-4">

        <StatCard title="Total Orders" value={stats.total} color="bg-blue-500" />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
        <StatCard title="Shipped" value={stats.shipped} color="bg-purple-500" />
        <StatCard title="Delivered" value={stats.delivered} color="bg-green-500" />
        <StatCard title="Cancelled" value={stats.cancelled} color="bg-red-500" />

      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex flex-col lg:flex-row gap-2 mb-4">

        <div className="flex flex-wrap gap-2 w-full">

          <div className="flex items-center bg-white border border-[#E5E5E5] rounded-md px-2 w-full sm:w-64">
            <Search size={14} className="text-gray-400" />
            <input
              placeholder="Search order ID, buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-8 py-1.5 text-sm outline-none"
            />
          </div>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-[#E5E5E5] rounded-md px-10  py-1.5 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-[#E5E5E5] rounded-md px-10 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-22 py-1.5 text-sm rounded-md cursor-pointer transition ${
              statusFilter === tab
                ? "bg-[#D4AF37] text-white"
                : "bg-yellow-100 border border-[#E5E5E5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Buyer</th>
              <th className="p-3">Products</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{o.id}</td>

                <td className="p-3">
                  <p>{o.buyer}</p>
                  <p className="text-xs text-gray-400">{o.email}</p>
                </td>

                <td className="p-3">{o.product}</td>

                <td className="p-3 font-medium">
                  ₹{o.amount.toLocaleString()}
                </td>

                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusStyle(o.status)}`}>
                    {o.status}
                  </span>
                </td>

                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${paymentStyle(o.payment)}`}>
                    {o.payment}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(o.date).toLocaleDateString()}
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <button className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                    <Eye size={14} />
                  </button>

                  {o.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(o.id)}
                        className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                      >
                        <Check size={14} />
                      </button>

                      <button
                        onClick={() => handleCancel(o.id)}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((o) => (
          <div key={o.id} className="bg-white border rounded-lg p-3">
            <div className="flex justify-between">
              <p className="font-medium">{o.id}</p>
              <span className={`text-xs px-2 py-1 rounded ${statusStyle(o.status)}`}>
                {o.status}
              </span>
            </div>

            <p className="text-sm mt-1">{o.buyer}</p>
            <p className="text-xs text-gray-400">{o.product}</p>

            <div className="flex justify-between mt-2 text-sm">
              <span>₹{o.amount.toLocaleString()}</span>
              <span className={`px-2 py-1 rounded text-xs ${paymentStyle(o.payment)}`}>
                {o.payment}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-gray-100 py-1 rounded text-sm">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition">
      <div className={`w-8 h-8 rounded-md ${color}`} />
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}