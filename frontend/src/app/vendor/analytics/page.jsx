"use client";

import { useState, useEffect } from "react";
import {
  IndianRupee,
  ShoppingCart,
  BarChart3,
  Percent,
  Calendar
} from "lucide-react";

const COLORS = {
  gold: "#D4AF37",
  border: "#E5E5E5",
  cream: "#FFF8EC",
};

export default function AnalyticsBody() {
  const [range, setRange] = useState("Last 6 Months");

  // ✅ Dummy sales data (in Lakhs)
  const salesData = [
    { month: "Nov", value: 8 },
    { month: "Dec", value: 12 },
    { month: "Jan", value: 10 },
    { month: "Feb", value: 16 },
    { month: "Mar", value: 14 },
    { month: "Apr", value: 18 },
  ];

  const maxValue = Math.max(...salesData.map(d => d.value));

  const categories = [
    { name: "Bearings", value: 485, percent: 17, color: "bg-blue-500" },
    { name: "Fasteners", value: 620, percent: 22, color: "bg-green-500" },
    { name: "Pipes", value: 380, percent: 13, color: "bg-yellow-500" },
    { name: "Wires", value: 285, percent: 10, color: "bg-purple-500" },
    { name: "Seals", value: 425, percent: 15, color: "bg-pink-500" },
    { name: "Sheets", value: 215, percent: 8, color: "bg-cyan-500" },
    { name: "Fittings", value: 175, percent: 6, color: "bg-orange-500" },
    { name: "Others", value: 265, percent: 9, color: "bg-gray-400" },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: COLORS.cream }}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">
            Track your business performance and insights
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-1 border rounded-lg text-sm flex cursor-pointer items-center gap-2 hover:bg-gray-50">
            <Calendar size={16} />
            Last 30 Days
          </button>

          <button
            className="px-4 py-1 text-white rounded-lg cursor-pointer text-sm hover:opacity-90"
            style={{ backgroundColor: COLORS.gold }}
          >
            Export Report
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center cursor-pointer mb-4">
        <Stat icon={<IndianRupee size={18} />} title="Total Revenue" value="₹28.48L" growth="+18.4%" color="bg-green-500" />
        <Stat icon={<ShoppingCart size={18} />} title="Total Orders" value="1,247" growth="+12.3%" color="bg-blue-500" />
        <Stat icon={<BarChart3 size={18} />} title="Avg Order Value" value="₹2283" growth="+5.2%" color="bg-purple-500" />
        <Stat icon={<Percent size={18} />} title="Conversion Rate" value="4.8%" growth="+0.8%" color="bg-yellow-500" />
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* SALES TREND */}
        <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
          <div className="flex justify-between mb-3">
            <h2 className="font-semibold">Sales Trend</h2>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border px-2 py-1 text-sm rounded"
            >
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>

          {/* ✅ DYNAMIC GRAPH */}
          <div className="flex items-end gap-3 h-44">
            {salesData.map((d, i) => {
              const height = (d.value / maxValue) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-orange-500 rounded-t transition-all duration-700 ease-out group-hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      animation: "grow 0.8s ease forwards",
                    }}
                  />

                  <p className="text-xs mt-1 text-gray-500">{d.month}</p>

                  {/* Tooltip */}
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition">
                    ₹{d.value}L
                  </span>
                </div>
              );
            })}
          </div>

          {/* FOOT STATS */}
          <div className="flex justify-between mt-4 text-sm">
            <div>
              <p className="text-gray-500">Avg Monthly Revenue</p>
              <p className="font-semibold">₹10.9L</p>
            </div>

            <div>
              <p className="text-gray-500">Best Month</p>
              <p className="font-semibold">Mar 2026</p>
            </div>

            <div>
              <p className="text-gray-500">Growth Rate</p>
              <p className="font-semibold text-green-600">+18.4%</p>
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
          <h2 className="font-semibold mb-3">Sales by Category</h2>

          <div className="space-y-3">
            {categories.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.name}</span>
                  <span>₹{c.value}K ({c.percent}%)</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className={`${c.color} h-2 rounded transition-all duration-500`}
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* FOOT */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="text-gray-500">Top Category</p>
              <p className="font-semibold">Fasteners (22%)</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="text-gray-500">Total Categories</p>
              <p className="font-semibold">8 Active</p>
            </div>
          </div>
        </div>

      </div>

      {/* ✅ Animation Keyframes */}
      <style jsx>{`
        @keyframes grow {
          from {
            height: 0;
          }
          to {
            height: 100%;
          }
        }
      `}</style>

    </div>
  );
}

/* STAT CARD */
function Stat({ icon, title, value, growth, color }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-1 transition">
      <div className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
        <p className="text-xs text-green-600">{growth}</p>
      </div>
    </div>
  );
}