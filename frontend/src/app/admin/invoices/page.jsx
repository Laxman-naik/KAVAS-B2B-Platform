"use client"
import { useState } from "react";

const invoicesData = [
  {
    id: "#INV-4421",
    buyer: "Acme Corp",
    amount: 14200,
    issued: "Mar 20",
    due: "Apr 5",
    status: "Paid",
  },
  {
    id: "#INV-4420",
    buyer: "TechSource",
    amount: 31000,
    issued: "Mar 22",
    due: "Apr 10",
    status: "Pending",
  },
  {
    id: "#INV-4419",
    buyer: "BuildMart",
    amount: 8750,
    issued: "Mar 25",
    due: "Apr 12",
    status: "Pending",
  },
  {
    id: "#INV-4418",
    buyer: "GlobeTraders",
    amount: 5200,
    issued: "Mar 10",
    due: "Mar 30",
    status: "Overdue",
  },
];

const statusStyles = {
  Paid: "bg-green-500/20 text-green-400",
  Pending: "bg-yellow-500/20 text-yellow-400",
  Overdue: "bg-red-500/20 text-red-400",
};

const formatCurrency = (val) =>
  `$${val.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

export default function InvoicesPage() {
  const [search, setSearch] = useState("");

  const filtered = invoicesData.filter((i) =>
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const totals = invoicesData.reduce(
    (acc, i) => {
      acc.total += i.amount;
      if (i.status === "Paid") acc.paid += i.amount;
      if (i.status === "Pending") acc.pending += i.amount;
      if (i.status === "Overdue") acc.overdue += i.amount;
      return acc;
    },
    { total: 0, paid: 0, pending: 0, overdue: 0 }
  );

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search invoices..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600  cursor-pointer transition duration-200">
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1f2a44] border border-gray-800 rounded-xl p-4 hover:bg-[#24304d] transition">
          <p className="text-gray-400 text-sm">Total Billed</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(totals.total)}</p>
        </div>

        <div className="bg-[#1f2a44] border border-gray-800 rounded-xl p-4 hover:bg-[#24304d] transition">
          <p className="text-gray-400 text-sm">Paid</p>
          <p className="text-xl font-semibold mt-1 text-green-400">
            {formatCurrency(totals.paid)}
          </p>
        </div>

        <div className="bg-[#1f2a44] border border-gray-800 rounded-xl p-4 hover:bg-[#24304d] transition">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-xl font-semibold mt-1 text-yellow-400">
            {formatCurrency(totals.pending)}
          </p>
        </div>

        <div className="bg-[#1f2a44] border border-gray-800 rounded-xl p-4 hover:bg-[#24304d] transition">
          <p className="text-gray-400 text-sm">Overdue</p>
          <p className="text-xl font-semibold mt-1 text-red-400">
            {formatCurrency(totals.overdue)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["Invoice", "Buyer", "Amount", "Issued", "Due Date", "Status"].map(
                (h) => (
                  <th key={h} className="px-6 py-4 text-left font-medium">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map((i, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 text-blue-400 font-medium">{i.id}</td>
                <td className="px-6 py-4">{i.buyer}</td>
                <td
                  className={`px-6 py-4 font-medium ${
                    i.status === "Paid"
                      ? "text-green-400"
                      : i.status === "Pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(i.amount)}
                </td>
                <td className="px-6 py-4">{i.issued}</td>
                <td className="px-6 py-4">{i.due}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[i.status]}`}
                  >
                    {i.status}
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
