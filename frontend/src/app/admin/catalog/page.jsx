"use client"
import { useState } from "react";

const productsData = [
  {
    sku: "EL-0041",
    name: "Industrial PCB Module",
    category: "Electronics",
    vendor: "NovaParts",
    moq: "100 pcs",
    price: "$48.00",
    status: "Listed",
  },
  {
    sku: "ST-0022",
    name: "Carbon Steel Sheet 3mm",
    category: "Raw Materials",
    vendor: "SteelWorks",
    moq: "500 kg",
    price: "$3.20/kg",
    status: "Listed",
  },
  {
    sku: "TX-0087",
    name: "Polyester Fabric Roll",
    category: "Textiles",
    vendor: "TexLine",
    moq: "200 m",
    price: "$2.80/m",
    status: "Listed",
  },
  {
    sku: "MC-0011",
    name: "Hydraulic Press 50T",
    category: "Machinery",
    vendor: "MachTech",
    moq: "1 unit",
    price: "$12,400",
    status: "Under Review",
  },
];

const statusStyles = {
  Listed: "bg-green-500/20 text-green-400",
  "Under Review": "bg-yellow-500/20 text-yellow-400",
};

export default function ProductCatalog() {
  const [search, setSearch] = useState("");

  const filtered = productsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition  cursor-pointer duration-200">
            Export
          </button>

          <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition cursor-pointer duration-200">
            + Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "SKU",
                "Product",
                "Category",
                "Vendor",
                "MOQ",
                "Price",
                "Status",
              ].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 text-blue-400 font-medium">
                  {p.sku}
                </td>
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-gray-300">{p.category}</td>
                <td className="px-6 py-4">{p.vendor}</td>
                <td className="px-6 py-4">{p.moq}</td>
                <td className="px-6 py-4 text-orange-400 font-medium">
                  {p.price}
                </td>
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
