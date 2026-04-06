"use client";
import { useState } from "react";

const ordersData = [
  {
    id: "#10482",
    buyer: "Acme Corp",
    vendor: "NovaParts",
    value: 14200,
    date: "Mar 30",
    status: "Fulfilled",
  },
  {
    id: "#10481",
    buyer: "BuildMart",
    vendor: "SteelWorks",
    value: 8750,
    date: "Mar 30",
    status: "Processing",
  },
  {
    id: "#10480",
    buyer: "TechSource",
    vendor: "NovaParts",
    value: 31000,
    date: "Mar 29",
    status: "Fulfilled",
  },
  {
    id: "#10479",
    buyer: "GlobeTraders",
    vendor: "MachTech",
    value: 5200,
    date: "Mar 28",
    status: "Disputed",
  },
  {
    id: "#10478",
    buyer: "Nexlane",
    vendor: "TexLine",
    value: 9100,
    date: "Mar 27",
    status: "Fulfilled",
  },
];

const statusStyles = {
  Fulfilled: "bg-green-500/20 text-green-400",
  Processing: "bg-yellow-500/20 text-yellow-400",
  Disputed: "bg-red-500/20 text-red-400",
};

export default function OrdersTable() {
  const [search, setSearch] = useState("");

  // ✅ Improved Search Filter
  const filtered = ordersData.filter((o) => {
    const term = search.toLowerCase().trim();

    return (
      o.id.toLowerCase().includes(term) ||
      o.buyer.toLowerCase().includes(term) ||
      o.vendor.toLowerCase().includes(term) ||
      o.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-48 md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition cursor-pointer duration-200">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "Order ID",
                "Buyer",
                "Vendor",
                "Value",
                "Date",
                "Status",
              ].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((o, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-blue-400 hover:underline">
                    {o.id}
                  </td>
                  <td className="px-6 py-4">{o.buyer}</td>
                  <td className="px-6 py-4 text-gray-300">{o.vendor}</td>

                  {/* ✅ INR FORMAT */}
                  <td className="px-6 py-4 text-orange-400 font-medium">
                    ₹{o.value.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">{o.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${statusStyles[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}