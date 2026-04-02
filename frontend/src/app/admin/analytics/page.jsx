"use client";

import { useEffect, useState } from "react";

const stats = [
  {
    title: "CONVERSION RATE",
    value: "18.3%",
    change: "+1.2%",
    positive: true,
  },
  {
    title: "AVG ORDER VALUE",
    value: "₹6,250",
    change: "+₹320",
    positive: true,
  },
  {
    title: "QUOTE ACCEPT",
    value: "62%",
    change: "-3%",
    positive: false,
  },
  {
    title: "REPEAT BUYERS",
    value: "74%",
    change: "+5%",
    positive: true,
  },
];

const revenueData = [
  { name: "Electronics", value: "₹8.2L", percent: 85 },
  { name: "Machinery", value: "₹6.5L", percent: 65 },
  { name: "Chemicals", value: "₹4.8L", percent: 48 },
  { name: "Raw Materials", value: "₹3.2L", percent: 32 },
  { name: "Textiles", value: "₹1.3L", percent: 15 },
];

const buyers = [
  { name: "Acme Corp", orders: 24, spend: "₹1.42L" },
  { name: "TechSource", orders: 18, spend: "₹98K" },
  { name: "BuildMart", orders: 15, spend: "₹76K" },
  { name: "GlobeTraders", orders: 11, spend: "₹55K" },
  { name: "ClearPath Co", orders: 9, spend: "₹43K" },
];

export default function AnalyticsPage() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(revenueData.map((item) => item.percent));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-white p-6 space-y-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-[#162544] rounded-xl p-5 border border-[#22345a] shadow-lg 
            transition transform hover:scale-105 cursor-pointer"
          >
            <p className="text-sm text-gray-400">{item.title}</p>

            <h2 className="text-3xl font-bold mt-2">{item.value}</h2>

            <p
              className={`text-sm mt-2 ${
                item.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.positive ? "↑" : "↓"} {item.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#162544] rounded-xl p-6 border border-[#22345a] shadow-lg">
          <h3 className="font-semibold mb-5 text-lg">
            Revenue by category
          </h3>
          {revenueData.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm mb-1 text-gray-300">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>

              <div className="w-full bg-[#1f3157] rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-yellow-400 transition-all duration-1000"
                  style={{ width: progress[i] ? `${progress[i]}%` : "0%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#162544] rounded-xl p-6 border border-[#22345a] shadow-lg">
          <h3 className="font-semibold mb-5 text-lg">
            Top buyers this month
          </h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-[#22345a]">
              <tr>
                <th className="text-left py-2">COMPANY</th>
                <th>ORDERS</th>
                <th className="text-right">SPEND</th>
              </tr>
            </thead>

            <tbody>
              {buyers.map((b, i) => (
                <tr
                  key={i}
                  className="border-b border-[#22345a] hover:bg-[#1f3157] transition cursor-pointer"
                >
                  <td className="py-3">{b.name}</td>
                  <td className="text-center text-gray-300">
                    {b.orders}
                  </td>
                  <td className="text-right text-yellow-400 font-semibold">
                    {b.spend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}