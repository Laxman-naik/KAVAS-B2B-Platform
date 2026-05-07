"use client";

import React, { useMemo, useRef, useState } from "react";
import { X, Info, Tag, Boxes, IndianRupee, Upload } from "lucide-react";

const AddNewProductModal = ({ open, onClose, onSubmit }) => {
  const [step, setStep] = useState(0);
  const dialogRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unit: "",
    status: "Active",
    description: "",
    price: "",
    mrp: "",
    gst: 5,
    moq: "",
    stock: "",
    images: [],
  });

  const categories = useMemo(
    () => [
      "Industrial Hardware",
      "Pipes & Fittings",
      "Electrical",
      "Raw Materials",
      "Chemicals",
      "Organic Food",
      "Handicrafts",
      "Spices & Condiments",
    ],
    []
  );

  const setValue = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const removeImage = (idx) => {
    setForm((s) => ({ ...s, images: s.images.filter((_, i) => i !== idx) }));
  };

  const onImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setForm((s) => ({ ...s, images: [...s.images, ...files].slice(0, 6) }));
  };

  const tabs = useMemo(
    () => [
      { label: "Basic Info", icon: Info },
      { label: "Pricing & Tax", icon: Tag },
      { label: "Inventory", icon: Boxes },
    ],
    []
  );

  const canNext = useMemo(() => {
    if (step === 0) {
      return (
        String(form.name).trim() &&
        String(form.sku).trim() &&
        String(form.category).trim() &&
        String(form.description).trim().length > 0
      );
    }
    if (step === 1) {
      return String(form.price).trim() && String(form.mrp).trim();
    }
    if (step === 2) {
      return String(form.moq).trim() && String(form.stock).trim();
    }
    return true;
  }, [form, step]);

  const close = () => {
    if (typeof onClose === "function") onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-label="Close add product modal"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[92vw] max-w-3xl max-h-[86vh] overflow-hidden rounded-2xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.22)] border border-[#E5E5E5]"
      >
        <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-[#E5E5E5]">
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#0B1F3A]">Add New Product</div>
            <div className="mt-1 text-sm text-gray-500">Fill in the details to list your product</div>
          </div>
          <button
            type="button"
            onClick={close}
            className="h-10 w-10 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex items-center gap-6 border-b border-[#E5E5E5]">
            {tabs.map((t, idx) => {
              const Icon = t.icon;
              const active = idx === step;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={`relative -mb-px flex items-center gap-2 px-2 py-3 text-sm font-bold transition ${
                    active ? "text-[#0B1F3A]" : "text-gray-400 hover:text-[#0B1F3A]"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full ${
                      active ? "bg-[#0B1F3A]" : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[56vh]">
          {step === 0 ? (
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-bold text-[#0B1F3A]">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={setValue("name")}
                  placeholder="e.g. Organic Turmeric Powder 500g"
                  className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.sku}
                    onChange={setValue("sku")}
                    placeholder="e.g. OTP-500-001"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={setValue("category")}
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">Weight / Unit</label>
                  <input
                    value={form.unit}
                    onChange={setValue("unit")}
                    placeholder="e.g. 500g, 1L, 1kg"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">Status</label>
                  <select
                    value={form.status}
                    onChange={setValue("status")}
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <div className="text-xs text-gray-400">({String(form.description).length}/500)</div>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((s) => ({ ...s, description: v.slice(0, 500) }));
                  }}
                  placeholder="Describe your product — sourcing, quality, usage, certifications..."
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#0B1F3A]">Product Images</label>
                <div className="mt-2 rounded-2xl border border-dashed border-[#E5E5E5] bg-[#FFF8EC] p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-white p-6 border border-[#E5E5E5]">
                    <Upload size={22} className="text-gray-400" />
                    <div className="text-sm font-bold text-[#0B1F3A]">Click to upload images</div>
                    <div className="text-xs text-gray-500">Up to 6 images (JPG/PNG)</div>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={onImages} />
                  </label>

                  {form.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {form.images.map((f, idx) => {
                        const url = URL.createObjectURL(f);
                        return (
                          <button
                            type="button"
                            key={`${f.name}-${idx}`}
                            onClick={() => removeImage(idx)}
                            className="relative h-14 w-full rounded-xl overflow-hidden border border-[#E5E5E5]"
                            title="Remove"
                          >
                            <img
                              src={url}
                              alt=""
                              className="h-full w-full object-cover"
                              onLoad={() => URL.revokeObjectURL(url)}
                            />
                            <span className="absolute inset-0 bg-black/0 hover:bg-black/25 transition" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex items-center h-11 rounded-xl border border-[#E5E5E5] bg-white px-4">
                    <IndianRupee size={16} className="text-gray-400" />
                    <input
                      value={form.price}
                      onChange={setValue("price")}
                      inputMode="numeric"
                      placeholder="0"
                      className="w-full pl-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    MRP (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex items-center h-11 rounded-xl border border-[#E5E5E5] bg-white px-4">
                    <IndianRupee size={16} className="text-gray-400" />
                    <input
                      value={form.mrp}
                      onChange={setValue("mrp")}
                      inputMode="numeric"
                      placeholder="0"
                      className="w-full pl-2 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-[#0B1F3A]">GST Rate</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[0, 5, 12, 18, 28].map((x) => {
                    const active = form.gst === x;
                    return (
                      <button
                        key={x}
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, gst: x }))}
                        className={`h-11 rounded-2xl px-6 text-sm font-extrabold border transition ${
                          active
                            ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                            : "bg-white text-[#0B1F3A] border-[#E5E5E5] hover:bg-[#FFF8EC]"
                        }`}
                      >
                        {x}%
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    Minimum Order Quantity (MOQ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.moq}
                    onChange={setValue("moq")}
                    inputMode="numeric"
                    placeholder="e.g. 10"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                  />
                  <div className="mt-2 text-xs text-gray-400">Minimum units a buyer must order</div>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#0B1F3A]">
                    Current Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.stock}
                    onChange={setValue("stock")}
                    inputMode="numeric"
                    placeholder="e.g. 500"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm outline-none focus:border-[#0B1F3A]"
                  />
                </div>
              </div>

              <div className="mt-2 rounded-2xl border border-[#E5E5E5] bg-[#FFF8EC] p-4">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-[#0B1F3A] mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">Inventory Tips</div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>• Set MOQ based on your minimum profitable batch size</div>
                      <div>• Keep stock updated to avoid order cancellations</div>
                      <div>• Products with 0 stock are automatically hidden</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-2.5 rounded-full transition ${i === step ? "w-10 bg-[#0B1F3A]" : "w-2.5 bg-gray-200"}`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={close}
              className="h-11 rounded-xl border border-[#E5E5E5] bg-white px-6 text-sm font-extrabold text-[#0B1F3A] hover:bg-[#FFF8EC]"
            >
              Cancel
            </button>

            {step < 2 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => Math.min(2, s + 1))}
                className={`h-11 rounded-xl px-6 text-sm font-extrabold text-white ${
                  canNext ? "bg-[#0B1F3A] hover:opacity-95" : "bg-[#0B1F3A]/40 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => {
                  if (!canNext) return;
                  if (typeof onSubmit === "function") onSubmit(form);
                  close();
                }}
                className={`h-11 rounded-xl px-6 text-sm font-extrabold text-white inline-flex items-center gap-2 ${
                  canNext ? "bg-[#0B1F3A] hover:opacity-95" : "bg-[#0B1F3A]/40 cursor-not-allowed"
                }`}
              >
                Add Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewProductModal;
