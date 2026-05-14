"use client";

import { X, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditProductModal({ open, product, onClose, onUpdate }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        price: product.price || "",
        mrp: product.mrp || "",
        moq: product.moq || "",
        stock: product.stock || "",
        dispatch_time_days: product.dispatch_time_days || "",
        weight: product.weight || "",
        sales_count: product.sales_count || 0,
        views_count: product.views_count || 0,
        avg_rating: product.avg_rating || 0,
        status: product.status || "pending",
        description: product.description || "",
      });
    }
  }, [product]);

  if (!open || !product) return null;

  const image =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "/placeholder.png";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...product, ...form });
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-[#0b1220] px-4 py-3 text-white outline-none focus:border-yellow-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#111827] shadow-2xl scrollbar-hide">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-[#111827] px-8 py-5">
          <h2 className="text-2xl font-semibold text-white">Edit Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Product Image
              </label>

              <img
                src={image}
                alt={form.name}
                className="h-36 w-36 rounded-lg border border-slate-700 object-cover"
              />

              <button
                type="button"
                className="mt-3 flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-500/10"
              >
                <Upload size={16} />
                Change Image
              </button>

              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG or WEBP. Max size 2MB.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Product Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">SKU</label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Selling Price *
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  MRP *
                </label>
                <input
                  name="mrp"
                  type="number"
                  value={form.mrp}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <inputField label="MOQ *" />
            <div>
              <label className="mb-2 block text-sm text-gray-300">MOQ *</label>
              <input
                name="moq"
                type="number"
                value={form.moq}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Stock *
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Unit *
              </label>
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Dispatch Time Days *
              </label>
              <input
                name="dispatch_time_days"
                type="number"
                value={form.dispatch_time_days}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Sales Count
              </label>
              <input
                name="sales_count"
                value={form.sales_count}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Views Count
              </label>
              <input
                name="views_count"
                value={form.views_count}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Average Rating
              </label>
              <input
                name="avg_rating"
                value={form.avg_rating}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Status *
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-6 py-3 text-white hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-yellow-400 px-7 py-3 font-semibold text-black hover:bg-yellow-300"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}