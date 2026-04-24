"use client";

import { useState } from "react";
import { Search, Upload, Package, CheckCircle, AlertTriangle, XCircle, DollarSign } from "lucide-react";

const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

export default function InventoryManagementBody() {
  const data = [
    { name: "Industrial Grade Bearings", sku: "SKU-BRG-001", category: "Bearings", stock: 2450, reserved: 750, alert: 500 },
    { name: "Stainless Steel Fasteners", sku: "SKU-FST-042", category: "Fasteners", stock: 8500, reserved: 7000, alert: 2000 },
    { name: "HDPE Pipes 50mm", sku: "SKU-PIP-017", category: "Pipes", stock: 5000, reserved: 1500, alert: 1000 },
    { name: "Copper Wire 2.5mm", sku: "SKU-CWR-009", category: "Wires", stock: 320, reserved: 700, alert: 500 },
    { name: "Hydraulic Seals Kit", sku: "SKU-HSK-033", category: "Seals", stock: 450, reserved: 150, alert: 100 },
    { name: "Aluminum Sheets 4x8ft", sku: "SKU-ALS-021", category: "Sheets", stock: 180, reserved: 50, alert: 100 },
    { name: "PVC Fittings 25mm", sku: "SKU-PVC-008", category: "Fittings", stock: 12000, reserved: 3000, alert: 2000 },
    { name: "Rubber Gaskets Set", sku: "SKU-RGS-015", category: "Gaskets", stock: 890, reserved: 200, alert: 300 },
    { name: "Steel Rods 10mm", sku: "SKU-SRD-101", category: "Rods", stock: 600, reserved: 100, alert: 150 },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const getAvailable = (d) => d.stock - d.reserved;

  const getStatus = (d) => {
    const available = getAvailable(d);
    if (available <= 0) return "Out of Stock";
    if (available <= d.alert) return "Low Stock";
    return "In Stock";
  };

  const categories = ["All Category", ...new Set(data.map(d => d.category))];

  const filtered = data.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.sku.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category === "All" || d.category === category;

    const status = getStatus(d);
    const matchStatus = statusFilter === "All" || status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const statusStyle = (status) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-600";
      case "Low Stock": return "bg-yellow-100 text-yellow-600";
      case "Out of Stock": return "bg-red-100 text-red-600";
      default: return "bg-gray-100";
    }
  };

  return (
    <div className="p-4 md:p-6" style={{ backgroundColor: COLORS.cream }}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <div>
          <h1 className="text-xl font-semibold">Inventory Management</h1>
          <p className="text-sm text-gray-500">Track and manage your product stock levels</p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50" style={{ borderColor: COLORS.border }}>Export</button>
          <button className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: COLORS.gold }}>+ Add Stock</button>
        </div>
      </div>

      {/* STATS WITH ICONS */}
      <div className="grid grid-cols-2 text-center md:grid-cols-5 gap-4 mb-4">

        <StatCard icon={<Package size={16} />} label="Total Products" value={data.length} bg="bg-blue-500" />
        <StatCard icon={<CheckCircle size={16} />} label="In Stock" value={data.filter(d => getStatus(d)==="In Stock").length} bg="bg-green-500" />
        <StatCard icon={<AlertTriangle size={16} />} label="Low Stock" value={data.filter(d => getStatus(d)==="Low Stock").length} bg="bg-yellow-500" />
        <StatCard icon={<XCircle size={16} />} label="Out of Stock" value={data.filter(d => getStatus(d)==="Out of Stock").length} bg="bg-red-500" />
        <StatCard icon={<DollarSign size={16} />} label="Inventory Value" value="₹48.50L" bg="bg-purple-500" />

      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex items-center bg-white border rounded-lg px-3 flex-1" style={{ borderColor: COLORS.border }}>
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search by product name, SKU..."
            className=" px-2 py-2 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
          style={{ borderColor: COLORS.border }}
        >
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
          style={{ borderColor: COLORS.border }}
        >
          {["All Status", "In Stock", "Low Stock", "Out of Stock"].map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl" style={{ border: `1px solid ${COLORS.border}` }}>
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Product","SKU","Category","Stock","Reserved","Available","Low Alert","Status"].map(h => (
                <th key={h} className="p-3 text-left text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((d, i) => {
              const available = getAvailable(d);
              const status = getStatus(d);

              return (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{d.name}</td>
                  <td className="p-3 text-blue-500">{d.sku}</td>
                  <td className="p-3">{d.category}</td>
                  <td className="p-3">{d.stock}</td>
                  <td className="p-3">{d.reserved}</td>
                  <td className={`p-3 ${available < 0 ? "text-red-500" : ""}`}>{available}</td>
                  <td className="p-3">{d.alert}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusStyle(status)}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BULK UPLOAD */}
      <div className="bg-white border rounded-xl p-5 mt-5" style={{ borderColor: COLORS.border }}>
        <h2 className="font-semibold mb-1">Bulk Upload</h2>
        <p className="text-sm text-gray-500 mb-3">Upload inventory via CSV file</p>

        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition">
          <Upload className="mb-2 text-gray-400" />
          <p className="text-sm">Drag & drop CSV file or browse</p>
          <p className="text-xs text-gray-400">Max 5MB</p>
        </div>

        <div className="flex gap-3 mt-3">
          <button className="px-4 py-2 border rounded text-sm">Download Template</button>
          <button className="px-4 py-2 border rounded text-sm">View Instructions</button>
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ icon, label, value, bg }) {
  return (
    <div className="bg-white p-4 rounded-xl border flex items-center gap-3 hover:shadow-md hover:-translate-y-1 transition">
      <div className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}