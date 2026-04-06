"use client"
import { useState } from "react";

const vendorsData = [
  {
    name: "NovaParts Ltd",
    category: "Electronics",
    rating: 4.8,
    orders: 340,
    revenue: "₹420K",
    status: "Approved",
  },
  {
    name: "SteelWorks Co",
    category: "Raw Materials",
    rating: 4.5,
    orders: 210,
    revenue: "₹185K",
    status: "Approved",
  },
  {
    name: "ChemFirst Inc",
    category: "Chemicals",
    rating: 3.9,
    orders: 88,
    revenue: "₹76K",
    status: "Pending KYC",
  },
  {
    name: "TexLine Group",
    category: "Textiles",
    rating: 4.1,
    orders: 157,
    revenue: "₹98K",
    status: "Approved",
  },
  {
    name: "MachTech",
    category: "Machinery",
    rating: 2.8,
    orders: 44,
    revenue: "₹32K",
    status: "Flagged",
  },
  {
    name: "GreenSource",
    category: "Organic",
    rating: 4.7,
    orders: 73,
    revenue: "₹54K",
    status: "Pending KYC",
  },
];

const statusStyles = {
  Approved: "bg-green-500/20 text-green-400",
  "Pending KYC": "bg-yellow-500/20 text-yellow-400",
  Flagged: "bg-red-500/20 text-red-400",
};

export default function VendorsTable() {
  const [search, setSearch] = useState("");

  const filtered = vendorsData.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#0b1220]  text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Vendors</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search vendors..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-200">
            Export
          </button>

          <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition duration-200">
            + Invite vendor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "Vendor",
                "Category",
                "Rating",
                "Orders",
                "Revenue",
                "Status",
              ].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium ">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((v, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#0d1424] transition duration-200 bg-[#111827]"
              >
                <td className="px-6 py-4 font-medium">{v.name}</td>
                <td className="px-6 py-4 text-gray-300">{v.category}</td>
                <td
                  className={`px-6 py-4 font-medium flex items-center gap-1 ${
                    v.rating < 3
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  ★ {v.rating}
                </td>
                <td className="px-6 py-4">{v.orders}</td>
                <td className="px-6 py-4">{v.revenue}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[v.status]}`}
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}