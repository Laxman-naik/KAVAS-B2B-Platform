"use client";

import { useState } from "react";
import { Search, Eye, Users, UserCheck, UserPlus, Repeat } from "lucide-react";

const COLORS = {
  gold: "#D4AF37",
  border: "#E5E5E5",
  cream: "#FFF8EC",
};

export default function BuyersManagementBody() {

  const buyersData = [
    {
      company: "Sharma Industries Pvt Ltd",
      email: "procurement@sharmaind.com",
      contact: "Amit Sharma",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      type: "Manufacturer",
      orders: 45,
      spent: "₹28.45L",
      lastOrder: "2026-04-21",
      status: "Active",
    },
    {
      company: "Mehta Traders",
      email: "orders@mehtatraders.in",
      contact: "Ravi Mehta",
      phone: "+91 98765 43211",
      location: "Delhi, NCR",
      type: "Distributor",
      orders: 32,
      spent: "₹18.50L",
      lastOrder: "2026-04-20",
      status: "Active",
    },
    {
      company: "Gupta Manufacturing Co.",
      email: "purchase@guptamfg.com",
      contact: "Priya Gupta",
      phone: "+91 98765 43212",
      location: "Ahmedabad, Gujarat",
      type: "Manufacturer",
      orders: 28,
      spent: "₹16.50L",
      lastOrder: "2026-04-19",
      status: "Active",
    },
    {
      company: "Patel Enterprises",
      email: "buy@patelent.com",
      contact: "Suresh Patel",
      phone: "+91 98765 43213",
      location: "Surat, Gujarat",
      type: "Wholesaler",
      orders: 24,
      spent: "₹14.20L",
      lastOrder: "2026-04-18",
      status: "Inactive",
    },
    {
      company: "Rajesh Steel Works",
      email: "admin@rajeshsteel.in",
      contact: "Rajesh Kumar",
      phone: "+91 98765 43214",
      location: "Jaipur, Rajasthan",
      type: "Manufacturer",
      orders: 56,
      spent: "₹38.50L",
      lastOrder: "2026-04-17",
      status: "Active",
    },
  ];

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filtered = buyersData.filter((b) => {
    const matchSearch =
      b.company.toLowerCase().includes(search.toLowerCase()) ||
      b.contact.toLowerCase().includes(search.toLowerCase());

    const matchType =
      typeFilter === "All Types" || b.type === typeFilter;

    return matchSearch && matchType;
  });

  const typeStyle = (type) => {
    switch (type) {
      case "Manufacturer":
        return "bg-blue-100 text-blue-600";
      case "Distributor":
        return "bg-purple-100 text-purple-600";
      case "Wholesaler":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100";
    }
  };

  const statusStyle = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-600"
      : "bg-gray-200 text-gray-600";
  };

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: COLORS.cream }}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Buyer Management</h1>
          <p className="text-sm text-gray-500">Manage your B2B buyer relationships</p>
        </div>

        <button className="px-5 py-1 border rounded-lg text-bold bg-amber-100 cursor-pointer hover:bg-gray-50 flex items-center gap-2">
          Export List
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4  gap-4 h-20 text-center mb-4">
        <Stat icon={<Users size={18} />} title="Total Buyers" value="156" color="bg-blue-500" />
        <Stat icon={<UserCheck size={18} />} title="Active Buyers" value="142" color="bg-green-500" />
        <Stat icon={<UserPlus size={18} />} title="New This Month" value="12" color="bg-purple-500" />
        <Stat icon={<Repeat size={18} />} title="Repeat Rate" value="78%" color="bg-yellow-500" />
      </div>

      {/* SEARCH */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex items-center bg-white border rounded-lg px-3 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search by company name, contact person..."
            className="w-full px-2 py-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {["All Types", "Manufacturer", "Distributor", "Wholesaler"].map((t, i) => (
            <option key={i}>{t}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Company","Contact Person","Location","Type","Orders","Total Spent","Last Order","Status","Actions"].map(h => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((b, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">
                  <p className="font-medium">{b.company}</p>
                  <p className="text-xs text-gray-400">{b.email}</p>
                </td>

                <td className="p-3">
                  <p>{b.contact}</p>
                  <p className="text-xs text-gray-400">{b.phone}</p>
                </td>

                <td className="p-3">{b.location}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${typeStyle(b.type)}`}>
                    {b.type}
                  </span>
                </td>

                <td className="p-3">{b.orders}</td>
                <td className="p-3">{b.spent}</td>
                <td className="p-3">{new Date(b.lastOrder).toLocaleDateString()}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusStyle(b.status)}`}>
                    {b.status}
                  </span>
                </td>

                <td className="p-3">
                  <button className="p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-3">
        {filtered.map((b, i) => (
          <div key={i} className="bg-white border rounded-lg p-3 hover:shadow transition">
            <div className="flex justify-between">
              <p className="font-medium">{b.company}</p>
              <span className={`text-xs px-2 py-1 rounded ${statusStyle(b.status)}`}>
                {b.status}
              </span>
            </div>

            <p className="text-sm">{b.contact}</p>
            <p className="text-xs text-gray-400">{b.location}</p>

            <div className="flex justify-between mt-2 text-sm">
              <span>{b.spent}</span>
              <span className={`px-2 py-1 text-xs rounded ${typeStyle(b.type)}`}>
                {b.type}
              </span>
            </div>

            <button className="mt-2 w-full bg-gray-100 py-1 rounded text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

/* STAT CARD */
function Stat({ icon, title, value, color }) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-1 transition">
      <div className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}