"use client"
import { useState } from "react";

const payoutsData = [
  {
    vendor: "NovaParts Ltd",
    period: "Mar 2026",
    orders: 22,
    amount: 42100,
    method: "Wire",
    status: "Paid",
  },
  {
    vendor: "SteelWorks Co",
    period: "Mar 2026",
    orders: 14,
    amount: 18400,
    method: "Wire",
    status: "Scheduled",
  },
  {
    vendor: "TexLine Group",
    period: "Mar 2026",
    orders: 11,
    amount: 9750,
    method: "ACH",
    status: "Scheduled",
  },
  {
    vendor: "MachTech",
    period: "Mar 2026",
    orders: 3,
    amount: 3200,
    method: "ACH",
    status: "On Hold",
  },
  {
    vendor: "GreenSource",
    period: "Mar 2026",
    orders: 8,
    amount: 3200,
    method: "Wire",
    status: "Scheduled",
  },
];

const statusStyles = {
  Paid: "bg-green-500/20 text-green-400",
  Scheduled: "bg-yellow-500/20 text-yellow-400",
  "On Hold": "bg-gray-500/20 text-gray-400",
};

const formatCurrency = (val) =>
  `₹${val.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

export default function VendorPayouts() {
  const [search, setSearch] = useState("");

  const filtered = payoutsData.filter((p) =>
    p.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = payoutsData
    .filter((p) => p.status !== "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Vendor Payouts</h1>

        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
          Process payouts
        </button>
      </div>

      {/* Summary Banner */}
      <div className="mb-6 p-5 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-[#2a1f0f] to-[#111827] flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:opacity-90 transition">
        <div>
          <p className="text-yellow-400 text-sm">Total Pending Payouts</p>
          <p className="text-2xl font-semibold mt-1">
            {formatCurrency(totalPending)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-400 text-sm">Next batch</p>
          <p className="text-yellow-400 font-medium">Apr 5, 2026</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["Vendor", "Period", "Orders", "Amount", "Method", "Status"].map(
                (h) => (
                  <th key={h} className="px-6 py-4 text-left font-medium">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium">{p.vendor}</td>
                <td className="px-6 py-4 text-gray-300">{p.period}</td>
                <td className="px-6 py-4">{p.orders}</td>
                <td
                  className={`px-6 py-4 font-medium ${
                    p.status === "Paid"
                      ? "text-green-400"
                      : p.status === "Scheduled"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-6 py-4">{p.method}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[p.status]}`}
                  >
                    {p.status}
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