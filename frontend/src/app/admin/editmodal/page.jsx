"use client";

import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditProductModal({ open, product, onClose, onUpdate }) {
  const [form, setForm] = useState({
    status: "pending",
    rejection_reason: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        status: product.status || "pending",
        rejection_reason:
          product.rejection_reason ||
          product.rejectionReason ||
          product.reject_reason ||
          "",
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value !== "rejected"
        ? { rejection_reason: "" }
        : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.status === "rejected" && !form.rejection_reason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    onUpdate({
      id: product.id,
      status: form.status,
      rejection_reason: form.rejection_reason,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-[#111827] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Update Product Status
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Approve, reject, or keep this product pending.
            </p>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-700 bg-[#0b1220] p-4">
            <img
              src={image}
              alt={product.name || "product"}
              className="h-16 w-16 rounded-lg object-cover"
            />

            <div>
              <h3 className="font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-gray-400">
                Price: ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Product Status <span className="text-red-400">*</span>
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-[#0b1220] px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {form.status === "rejected" && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Rejection Reason <span className="text-red-400">*</span>
              </label>

              <textarea
                name="rejection_reason"
                value={form.rejection_reason}
                onChange={handleChange}
                rows={4}
                placeholder="Example: Product image is unclear, price details are invalid, or product information is incomplete."
                className="w-full resize-none rounded-lg border border-red-500/50 bg-[#0b1220] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-red-400"
              />

              <div className="mt-3 flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <AlertCircle size={18} />
                <p>
                  This reason will be shown to the vendor/customer for why the
                  product was rejected.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-700 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-5 py-2.5 text-white hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-yellow-400 px-6 py-2.5 font-semibold text-black hover:bg-yellow-300"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}