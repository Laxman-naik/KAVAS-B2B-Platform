"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";

export default function ProductManagementBody() {
  const productsData = [
  {
    id: 1,
    name: "Industrial Grade Bearings",
    sku: "BRG-001",
    category: "Industrial Hardware",
    price: 850,
    moq: 100,
    stock: 4200,
    status: "Active",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
  },
  {
    id: 2,
    name: "Stainless Steel Fasteners Set",
    sku: "FST-042",
    category: "Industrial Hardware",
    price: 320,
    moq: 500,
    stock: 18500,
    status: "Active",
    image: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c",
  },
  {
    id: 3,
    name: "HDPE Pipes 50mm Diameter",
    sku: "PIP-017",
    category: "Pipes & Fittings",
    price: 145,
    moq: 200,
    stock: 320,
    status: "Active",
    image: "https://images.unsplash.com/photo-1581091012184-7e0cdfbb6791",
  },
  {
    id: 4,
    name: "Rubber O-Ring Set",
    sku: "ORG-222",
    category: "Industrial Hardware",
    price: 90,
    moq: 300,
    stock: 0,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0",
  },
  {
    id: 5,
    name: "PVC Water Pipes",
    sku: "PVC-111",
    category: "Pipes & Fittings",
    price: 200,
    moq: 150,
    stock: 980,
    status: "Active",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  },
  {
    id: 6,
    name: "Hydraulic Valves",
    sku: "VAL-009",
    category: "Industrial Hardware",
    price: 1200,
    moq: 50,
    stock: 150,
    status: "Active",
    image: "https://images.unsplash.com/photo-1581091870627-3b5d3c7bdb6d",
  },
  {
    id: 7,
    name: "Copper Wiring Bundle",
    sku: "CWR-555",
    category: "Electrical",
    price: 600,
    moq: 200,
    stock: 0,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1581092334442-9b8e7d8d3e7d",
  },
  {
    id: 8,
    name: "Aluminium Sheets",
    sku: "ALM-876",
    category: "Raw Materials",
    price: 450,
    moq: 300,
    stock: 760,
    status: "Active",
    image: "https://images.unsplash.com/photo-1616627981155-5d7c6e7e0b8f",
  },
  {
    id: 9,
    name: "Industrial Lubricant Oil",
    sku: "LUB-333",
    category: "Chemicals",
    price: 250,
    moq: 100,
    stock: 50,
    status: "Active",
    image: "https://images.unsplash.com/photo-1581091014534-8987c1b8c9b6",
  },
];

  const [products, setProducts] = useState(productsData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState("All");

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "All" || p.category === category;
    const matchTab =
      tab === "All" ||
      (tab === "Active" && p.status === "Active") ||
      (tab === "Draft" && p.status === "Draft");

    return matchSearch && matchCategory && matchTab;
  });

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  /* ================= UI ================= */

  return (
    <div className="p-3 md:p-4 lg:p-5 bg-[#FFF8EC] min-h-screen">
      {/* TOP CONTROLS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
        
        <div className="flex flex-col h-10 sm:flex-row gap-3 w-full">
          
          {/* SEARCH */}
          <div className="flex items-center bg-white border border-[#E5E5E5] rounded-lg px-3 w-full sm:w-64">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-2 outline-none text-sm"
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-[#E5E5E5] rounded-lg px-3 py-2 bg-white text-sm"
          >
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          {/* TABS */}
          <div className="flex bg-white border border-[#E5E5E5] rounded-lg  overflow-hidden">
            {["All", "Active", "Draft"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm transition cursor-pointer ${
                  tab === t
                    ? "bg-[#D4AF37] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ADD BUTTON */}
        <button className="flex items-center gap-2 h-10 bg-[#D4AF37] text-white px-8 py-5 rounded-lg hover:brightness-110 cursor-pointer transition">
          <Plus size={16} />Add_Product
        </button>
      </div>

      {/* COUNT */}
      <p className="text-sm mb-4 text-gray-600">
        Showing {filteredProducts.length} products
      </p>

      {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-h-7 gap-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
          className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden hover:shadow-md transition transform hover:-translate-y-0.75"
>
            {/* IMAGE */}
            <div className="relative">
              <img
                src={product.image}
                alt=""
                className="w-full h-50 object-cover"
              />

              <span className="absolute top-3 right-3 bg-yellow-950 text-white text-xs px-3 py-1 rounded-full">
                {product.status}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-3">

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[13px]">
                    {product.name}
                  </h3>
                  <p className="text-base text-gray-400">
                    SKU-{product.sku}
                  </p>
                </div>

                <MoreVertical size={16} className="cursor-pointer" />
              </div>

              <span className="inline-block mt-2 text-[11px] bg-gray-100 px-2 py-1 rounded-full">
                {product.category}
              </span>

              <p className="text-lg font-semibold mt-2 text-[#D4AF37]">
                ₹{product.price}
              </p>

              <p className="text-xs text-gray-500">
                MOQ: {product.moq} units
              </p>

              {/* STOCK BAR */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Stock</span>
                  <span>{product.stock} units</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 ${
                      product.stock === 0
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(product.stock / 200, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* ACTION */}
              <button
                onClick={() => alert(`Edit ${product.name}`)}
                className="mt-3 w-full border rounded-md py-1 cursor-pointer bg-orange-300 hover:bg-orange-400 text-[12px]"
>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}