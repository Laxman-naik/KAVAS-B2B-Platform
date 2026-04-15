"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const statusStyles = {
  Listed: "bg-green-500/20 text-green-400",
};

const dummyProducts = [
  {
    sku: "EL-0041",
    name: "Industrial PCB Module",
    category: "Electronics",
    vendor: "NovaParts",
    moq: "100 pcs",
    price: "₹4,000",
    status: "Listed",
  },
];

export default function ProductCatalog() {
  const [open, setOpen] = useState(false);

  const [products, setProducts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products");
      if (saved) return JSON.parse(saved);
      localStorage.setItem("products", JSON.stringify(dummyProducts));
      return dummyProducts;
    }
    return [];
  });

  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    slug: "",
    organizationId: "",
    parentProductId: "",
    unit: "",
    price: "",
    mrp: "",
    minOrderQty: "",
    stock: "",
    imageUrl: "",
  });

  const handleSubmit = () => {
    if (!form.name) return;

    const priceINR = `₹${Number(form.price || 0).toLocaleString("en-IN")}`;

    setProducts([
      ...products,
      { ...form, price: priceINR, status: "Listed" },
    ]);

    setOpen(false);
  };

  return (
    <div className="p-6 bg-[#0b1220] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>
        <Link href="/admin/catalog/addnewproduct">
          <button className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600">
            + Add Product
          </button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["SKU", "Product", "Category", "Vendor", "MOQ", "Price", "Status"].map((h) => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-[#111827]">
                <td className="p-3 text-blue-400">{p.sku || "-"}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.categoryId}</td>
                <td className="p-3">{p.organizationId}</td>
                <td className="p-3">{p.minOrderQty}</td>
                <td className="p-3 text-orange-400">{p.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded ${statusStyles[p.status]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div >    
    </div>
  );
}