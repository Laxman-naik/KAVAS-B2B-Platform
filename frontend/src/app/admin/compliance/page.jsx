"use client";
import { useState } from "react";

const complianceData = [
  {
    company: "ChemFirst Inc",
    type: "Vendor",
    check: "KYC / AML",
    date: "Mar 28",
    status: "Pending",
  },
  {
    company: "MachTech",
    type: "Vendor",
    check: "Sanctions Screening",
    date: "Mar 25",
    status: "Flagged",
  },
  {
    company: "NovaParts Ltd",
    type: "Vendor",
    check: "KYC / AML",
    date: "Mar 20",
    status: "Approved",
  },
  {
    company: "SteelWorks Co",
    type: "Vendor",
    check: "Risk Assessment",
    date: "Mar 18",
    status: "Approved",
  },
];

const statusStyles = {
  Approved: "bg-green-500/20 text-green-400",
  Pending: "bg-yellow-500/20 text-yellow-400",
  Flagged: "bg-red-500/20 text-red-400",
};

export default function CompliancePage() {
  const [search, setSearch] = useState("");

  const filtered = complianceData.filter((item) =>
    item.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Compliance</h1>

        {/* <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        /> */}
        <button className="bg-amber-600 cursor-pointer text-white h-auto rounded-2xl p-2 hover:bg-amber-500">Run checks</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["Company", "Type", "Check", "Date", "Status"].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium">{item.company}</td>
                <td className="px-6 py-4 text-gray-300">{item.type}</td>
                <td className="px-6 py-4 text-gray-300">{item.check}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[item.status]}`}
                  >
                    {item.status}
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
