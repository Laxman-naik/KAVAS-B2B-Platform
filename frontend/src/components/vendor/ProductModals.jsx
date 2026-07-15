"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Trash2,
  AlertTriangle,
  Star,
  Package,
  Tag,
  Info,
  BarChart2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  BadgeCheck,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────── */
const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `https://kavas-b2b-platform-4.onrender.com${path}`;
};

const getPrimaryImage = (product) =>
  getImageUrl(
    product?.images?.find((img) => img.is_primary)?.image_url ||
      product?.images?.[0]?.image_url
  );

const statusPill = (s) => {
  if (s === "active") return "bg-green-100 text-green-700 border-green-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
  if (s === "inactive") return "bg-gray-100 text-gray-500 border-gray-200";
  return "bg-gray-100 text-gray-500 border-gray-200";
};

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const boolIcon = (v) =>
  v ? (
    <CheckCircle2 className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-400" />
  );

/* ──────────────────────────────────────────────────────────────
   DELETE CONFIRMATION MODAL
   ────────────────────────────────────────────────────────────── */
export function DeleteProductModal({ product, onConfirm, onClose, loading }) {
  if (!product) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 flex flex-col gap-5">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mx-auto">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-[17px] font-extrabold text-[#0B1F3A]">
            Delete Product?
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            You're about to permanently delete{" "}
            <span className="font-bold text-[#0B1F3A]">
              "{product.name}"
            </span>
            . This action cannot be undone and will remove all associated
            images, variants, and pricing data.
          </p>
        </div>

        {/* Product preview */}
        <div className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] bg-slate-50 p-3">
          <img
            src={getPrimaryImage(product)}
            alt={product.name}
            className="h-12 w-12 rounded-lg object-cover bg-gray-100 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#0B1F3A] truncate">
              {product.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
          </div>
          <span
            className={`ml-auto shrink-0 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusPill(
              product.status
            )}`}
          >
            {product.status}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-[#E5E5E5] bg-white text-sm font-semibold text-gray-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(product.id)}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ──────────────────────────────────────────────────────────────
   PRODUCT DETAIL MODAL
   ────────────────────────────────────────────────────────────── */
export function ProductDetailModal({ product, onClose, onEdit, onDelete }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = useMemo(
    () =>
      (product?.images || []).map((img) => getImageUrl(img.image_url)),
    [product]
  );

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product) return null;

  const specs = product.specifications || [];
  const variants = product.variants || [];
  const bulkPricing = product.bulk_pricing || product.bulkPricing || [];

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div
        className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#E5E5E5] px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[17px] font-extrabold text-[#0B1F3A] truncate">
              {product.name}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              SKU: {product.sku} &nbsp;·&nbsp;
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusPill(
                  product.status
                )}`}
              >
                {product.status}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(product)}
              className="h-9 px-4 rounded-xl bg-[#0B1F3A] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="h-9 w-9 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl border border-[#E5E5E5] hover:bg-slate-50 flex items-center justify-center"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="grid lg:grid-cols-[340px_1fr] gap-0">
            {/* ── Left: Images ───────────────────────────────── */}
            <div className="bg-white border-r border-[#E5E5E5] p-5 flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                {images.length > 0 ? (
                  <img
                    src={images[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImg((i) =>
                          i === 0 ? images.length - 1 : i - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImg((i) => (i + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImg
                          ? "border-[#0B1F3A]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { label: "Price", value: `₹${fmt(product.price)}` },
                  { label: "Stock", value: fmt(product.stock) },
                  { label: "MOQ", value: fmt(product.moq) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#E5E5E5] bg-slate-50 p-3 text-center"
                  >
                    <p className="text-[13px] font-extrabold text-[#0B1F3A]">
                      {value}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Details ─────────────────────────────── */}
            <div className="p-5 flex flex-col gap-5">
              {/* Description */}
              <Section icon={<Info className="h-4 w-4" />} title="Description">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || "No description provided."}
                </p>
              </Section>

              {/* Pricing */}
              <Section
                icon={<Tag className="h-4 w-4" />}
                title="Pricing & Inventory"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Selling Price", value: `₹${fmt(product.price)}` },
                    { label: "MRP", value: `₹${fmt(product.mrp)}` },
                    { label: "Stock", value: `${fmt(product.stock)} units` },
                    { label: "MOQ", value: fmt(product.moq) },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[#E5E5E5] bg-white p-3"
                    >
                      <p className="text-[11px] text-gray-400 font-medium">
                        {label}
                      </p>
                      <p className="text-sm font-extrabold text-[#0B1F3A] mt-0.5">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bulk Pricing */}
                {bulkPricing.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Bulk Pricing Tiers
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-[#E5E5E5]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-[#E5E5E5]">
                            <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">
                              Min Qty
                            </th>
                            <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">
                              Max Qty
                            </th>
                            <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500">
                              Price/Unit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkPricing.map((tier, i) => (
                            <tr
                              key={i}
                              className="border-b border-[#E5E5E5] last:border-0"
                            >
                              <td className="px-3 py-2 text-[#0B1F3A]">
                                {tier.min_qty || tier.minQty}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {tier.max_qty || tier.maxQty || "—"}
                              </td>
                              <td className="px-3 py-2 font-semibold text-[#0B1F3A]">
                                ₹{fmt(tier.price_per_unit || tier.pricePerUnit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Section>

              {/* Specifications */}
              {specs.length > 0 && (
                <Section
                  icon={<BarChart2 className="h-4 w-4" />}
                  title="Specifications"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-3 py-2"
                      >
                        <span className="text-xs text-gray-500">
                          {spec.name}
                        </span>
                        <span className="text-xs font-semibold text-[#0B1F3A]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <Section
                  icon={<Package className="h-4 w-4" />}
                  title="Variants"
                >
                  <div className="overflow-x-auto rounded-xl border border-[#E5E5E5]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-[#E5E5E5]">
                          {["Type", "Value", "SKU", "Price", "Stock"].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500"
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v, i) => (
                          <tr
                            key={i}
                            className="border-b border-[#E5E5E5] last:border-0"
                          >
                            <td className="px-3 py-2 text-gray-500 text-xs">
                              {v.variant_type}
                            </td>
                            <td className="px-3 py-2 font-medium text-[#0B1F3A]">
                              {v.variant_value}
                            </td>
                            <td className="px-3 py-2 text-gray-400 text-xs">
                              {v.sku || "—"}
                            </td>
                            <td className="px-3 py-2">₹{fmt(v.price)}</td>
                            <td className="px-3 py-2">{fmt(v.stock)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}

              {/* Product Flags */}
              <Section
                icon={<BadgeCheck className="h-4 w-4" />}
                title="Product Flags"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "COD Available", val: product.cod_available },
                    { label: "Original Product", val: product.is_original },
                    {
                      label: "GST Invoice",
                      val: product.gst_invoice_available,
                    },
                    {
                      label: "Secure Payment",
                      val: product.secure_payment_available,
                    },
                    {
                      label: "Return/Exchange",
                      val: product.return_exchange_available,
                    },
                    {
                      label: "Fast Delivery",
                      val: product.fast_delivery_available,
                    },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2"
                    >
                      {boolIcon(val)}
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Section wrapper ─────────────────────────────────────────── */
function Section({ icon, title, children }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#E5E5E5] px-4 py-3">
        <span className="text-[#0B1F3A]">{icon}</span>
        <span className="text-sm font-bold text-[#0B1F3A]">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
