"use client"
import { useState } from "react";

const buyersData = [
  {
    company: "Acme Corp",
    contact: "Sara Lee",
    email: "sara@acme.com",
    tier: "Premium",
    orders: 87,
    status: "Active",
  },
  {
    company: "TechSource Ltd",
    contact: "Jay Patel",
    email: "jay@techsource.io",
    tier: "Standard",
    orders: 52,
    status: "Active",
  },
  {
    company: "BuildMart",
    contact: "Lena Müller",
    email: "lena@buildmart.de",
    tier: "Premium",
    orders: 41,
    status: "Active",
  },
  {
    company: "GlobeTraders",
    contact: "Marco Diaz",
    email: "marco@globe.co",
    tier: "Standard",
    orders: 29,
    status: "Review",
  },
  {
    company: "Nexlane Inc",
    contact: "Amy Cho",
    email: "amy@nexlane.com",
    tier: "Standard",
    orders: 18,
    status: "Inactive",
  },
  {
    company: "ClearPath Co",
    contact: "Dan White",
    email: "dan@clearpath.co",
    tier: "Enterprise",
    orders: 103,
    status: "Active",
  },
];

const tierStyles = {
  Premium: "bg-yellow-500/20 text-yellow-400",
  Standard: "bg-gray-500/20 text-gray-300",
  Enterprise: "bg-blue-500/20 text-blue-400",
};

const statusStyles = {
  Active: "bg-green-500/20 text-green-400",
  Review: "bg-yellow-500/20 text-yellow-400",
  Inactive: "bg-gray-500/20 text-gray-400",
};

export default function BuyersTable() {
  const [search, setSearch] = useState("");

  const filtered = buyersData.filter((b) =>
    b.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4  text-white ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4  mb-6">
        <h1 className="text-2xl font-semibold"></h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-lg  border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-200 cursor-pointer">
            Export
          </button>

          <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition duration-200 cursor-pointer">
            + Add buyer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "Company",
                "Contact",
                "Email",
                "Tier",
                "Orders",
                "Status",
              ].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((b, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 bg-[#0b1220]"
              >
                <td className="px-6 py-4 font-medium">{b.company}</td>
                <td className="px-6 py-4">{b.contact}</td>
                <td className="px-6 py-4 text-blue-400 hover:underline cursor-pointer transition">
                  {b.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${tierStyles[b.tier]}`}
                  >
                    {b.tier}
                  </span>
                </td>
                <td className="px-6 py-4">{b.orders}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[b.status]}`}
                  >
                    {b.status}
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