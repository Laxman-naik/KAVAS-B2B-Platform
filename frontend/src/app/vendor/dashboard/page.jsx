"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const DashboardBody = () => {

  /* ---------------- STATE ---------------- */
  const [activeTab, setActiveTab] = useState("Month");

  /* ---------------- DUMMY DATA ---------------- */

  const salesData = {
    Today: [20, 30, 25, 35, 40],
    Week: [40, 50, 45, 60, 70, 65, 80],
    Month: [40, 60, 50, 70, 90, 80],
  };

  const orders = [
    {
      id: "ORD-2024-881",
      buyer: "Sharma Industries",
      amount: 124000,
      date: "21 Apr 2026",
      status: "Pending",
    },
    {
      id: "ORD-2024-882",
      buyer: "Mehta Traders",
      amount: 56500,
      date: "20 Apr 2026",
      status: "Shipped",
    },
    {
      id: "ORD-2024-883",
      buyer: "Gupta Manufacturing",
      amount: 210000,
      date: "19 Apr 2026",
      status: "Delivered",
    },
    {
      id: "ORD-2024-884",
      buyer: "Patel Enterprises",
      amount: 88750,
      date: "18 Apr 2026",
      status: "Cancelled",
    },
  ];

  const topProducts = [
    { name: "Industrial Bearings", sku: "SKU-BRG-01", sold: 1240 },
    { name: "Steel Fasteners", sku: "SKU-STL-02", sold: 980 },
    { name: "HDPE Pipes", sku: "SKU-PIP-03", sold: 760 },
    { name: "Copper Wire", sku: "SKU-CWR-04", sold: 640 },
    { name: "Hydraulic Seals", sku: "SKU-HSK-05", sold: 520 },
  ];

  /* ---------------- CALCULATIONS ---------------- */

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  const lowStock = 12;

  const statsData = [
    {
      title: "TOTAL REVENUE (MONTH)",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      change: "+18.4%",
      positive: true,
    },
    {
      title: "PENDING ORDERS",
      value: pendingOrders,
      change: "-5.2%",
      positive: false,
    },
    {
      title: "TOTAL PRODUCTS",
      value: "284",
      change: "+3.1%",
      positive: true,
    },
    {
      title: "LOW STOCK ALERTS",
      value: lowStock,
      change: "-2",
      positive: false,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {statsData.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="text-xs text-gray-500">{card.title}</p>
            <h2 className="text-xl font-bold text-[#1A1A1A] mt-1">
              {card.value}
            </h2>

            <div className="flex items-center gap-1 mt-2 text-xs">
              {card.positive ? (
                <ArrowUpRight size={14} className="text-green-500" />
              ) : (
                <ArrowDownRight size={14} className="text-red-500" />
              )}
              <span
                className={`${
                  card.positive ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.change}
              </span>
              <span className="text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SALES TREND */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A]">
                Sales Trend
              </h3>
              <p className="text-xs text-gray-500">Revenue over time</p>
            </div>
            <div className="flex gap-2 text-xs">
              {["Today", "Week", "Month"].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full transition ${
                    tab === activeTab
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 hover:bg-[#FFF8EC]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Fake Chart Bars */}
          <div className="flex items-end gap-3 h-40">
            {salesData[activeTab].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-linear-to-t from-[#D4AF37] to-orange-300 rounded-md hover:scale-105 transition"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Total (6 months) ₹76,97,000</span>
            <span className="text-green-600">+18.4% growth</span>
          </div>
        </div>

        {/* TOP SELLING */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="text-sm font-semibold">Top Selling Products</h3>
            <span className="text-xs text-[#D4AF37] cursor-pointer hover:underline">
              View All
            </span>
          </div>

          {topProducts.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 hover:bg-[#FFF8EC] px-2 rounded-lg transition"
            >
              <span className="text-xs text-gray-400">{i + 1}</span>
              <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
              <div className="flex-1">
                <p className="text-xs font-medium">{item.name}</p>
                <p className="text-[10px] text-gray-400">{item.sku}</p>
                <div className="h-1 bg-gray-200 mt-1 rounded">
                  <div
                    className="h-1 bg-[#D4AF37] rounded"
                    style={{ width: `${(item.sold / 1300) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-semibold">{item.sold}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT ORDERS */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-xl shadow-sm">
          <div className="flex justify-between p-4 border-b">
            <h3 className="text-sm font-semibold">Recent Orders</h3>
            <span className="text-xs text-[#D4AF37] cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-gray-500">
                <tr>
                  <th className="p-3 text-left">ORDER ID</th>
                  <th className="p-3 text-left">BUYER</th>
                  <th className="p-3 text-left">AMOUNT</th>
                  <th className="p-3 text-left">DATE</th>
                  <th className="p-3 text-left">STATUS</th>
                  <th className="p-3 text-left">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-[#FFF8EC] transition"
                  >
                    <td className="p-3 font-medium">{o.id}</td>
                    <td className="p-3">{o.buyer}</td>
                    <td className="p-3">₹{o.amount.toLocaleString("en-IN")}</td>
                    <td className="p-3">{o.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#D4AF37] cursor-pointer hover:underline">
                      View
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold">Quick Actions</h3>

          {[
            "Add New Product",
            "Update Inventory",
            "View Payouts",
            "Manage Orders",
          ].map((action, i) => (
            <div
              key={i}
              className="border border-[#E5E5E5] rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-[#FFF8EC] transition"
            >
              <span className="text-sm">{action}</span>
              <span>›</span>
            </div>
          ))}

          <div className="bg-red-50 border border-red-200 p-3 rounded-lg mt-3">
            <p className="text-xs font-semibold text-red-600">
              Low Stock Alert
            </p>
            <p className="text-xs text-red-500 mt-1">
              {lowStock} products are running low on stock.
            </p>
            <span className="text-xs text-red-600 cursor-pointer hover:underline">
              Review Now →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;