"use client";
import { useState, useEffect } from "react";

const statusStyles = {
  Listed: "bg-green-500/20 text-green-400",
  "Under Review": "bg-yellow-500/20 text-yellow-400",
};

// Dummy data
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
  {
    sku: "ST-0022",
    name: "Carbon Steel Sheet 3mm",
    category: "Raw Materials",
    vendor: "SteelWorks",
    moq: "500 kg",
    price: "₹260/kg",
    status: "Listed",
  },
  {
    sku: "TX-0087",
    name: "Polyester Fabric Roll",
    category: "Textiles",
    vendor: "TexLine",
    moq: "200 m",
    price: "₹230/m",
    status: "Listed",
  },
];

export default function ProductCatalog() {
  const [open, setOpen] = useState(false);

  //  Load from localStorage OR dummy
  const [products, setProducts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("products");

      if (saved) {
        return JSON.parse(saved);
      } else {
        localStorage.setItem("products", JSON.stringify(dummyProducts));
        return dummyProducts;
      }
    }
    return [];
  });

  //  Save to localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    vendor: "",
    price: "",
    moq: "",
    unit: "",
    leadTime: "",
    description: "",
    tags: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.sku) return;

    const priceINR = `₹${Number(form.price).toLocaleString("en-IN")}`;

    setProducts([
      ...products,
      {
        ...form,
        price: priceINR,
        status: "Listed",
      },
    ]);

    setOpen(false);

    setForm({
      name: "",
      sku: "",
      category: "",
      vendor: "",
      price: "",
      moq: "",
      unit: "",
      leadTime: "",
      description: "",
      tags: "",
    });
  };

  return (
    <div className="p-6 bg-[#0b1220] min-h-screen text-white">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>

        <div className="flex gap-3">
          <button
            onClick={() => {
              localStorage.setItem("products", JSON.stringify(dummyProducts));
              setProducts(dummyProducts);
            }}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Reset Data
          </button>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            + Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["SKU","Product","Category","Vendor","MOQ","Price","Status"].map((h) => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-[#111827]">
                <td className="p-3 text-blue-400">{p.sku}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.vendor}</td>
                <td className="p-3">{p.moq}</td>
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
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0F1E33] p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">Add new product</h2>

            {/* BASIC INFO */}
            <p className="text-orange-400 text-xs mb-2">BASIC INFORMATION</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <input className="input" placeholder="Product name"
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
              />
              <input className="input" placeholder="SKU"
                value={form.sku}
                onChange={(e)=>setForm({...form,sku:e.target.value})}
              />
              <input className="input" placeholder="Category"
                value={form.category}
                onChange={(e)=>setForm({...form,category:e.target.value})}
              />
              <input className="input" placeholder="Vendor"
                value={form.vendor}
                onChange={(e)=>setForm({...form,vendor:e.target.value})}
              />
            </div>

            {/* PRICING */}
            <p className="text-orange-400 text-xs mb-2">PRICING & QUANTITY</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <input className="input" type="number" placeholder="Unit price (₹)"
                value={form.price}
                onChange={(e)=>setForm({...form,price:e.target.value})}
              />
              <input className="input" placeholder="MOQ"
                value={form.moq}
                onChange={(e)=>setForm({...form,moq:e.target.value})}
              />
              <input className="input" placeholder="Unit (pcs/kg)"
                value={form.unit}
                onChange={(e)=>setForm({...form,unit:e.target.value})}
              />
              <input className="input" placeholder="Lead time (days)"
                value={form.leadTime}
                onChange={(e)=>setForm({...form,leadTime:e.target.value})}
              />
            </div>

            {/* DETAILS */}
            <p className="text-orange-400 text-xs mb-2">DETAILS</p>

            <textarea
              className="input w-full mb-3"
              placeholder="Description"
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
            />

            <input
              className="input w-full mb-4"
              placeholder="Tags"
              value={form.tags}
              onChange={(e)=>setForm({...form,tags:e.target.value})}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={()=>setOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-500 rounded"
              >
                Add Product
              </button>
            </div>

          </div>
        </div>
      )}
      <style jsx>{`.input {padding: 10px; background: #13263C; border-radius: 8px; border: 1px solid #2d3b55; outline: none; color: white;}`}</style>
    </div>
  );
}