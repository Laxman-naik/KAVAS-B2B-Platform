"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Upload, X, Check, Package, Image, Layers, Archive, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { getMainCategoriesThunk, getSubcategoriesByParentThunk, clearSubcategories, } from "@/store/slices/categorySlice";

const Field = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
      {label}{required && <span className="ml-0.5 text-blue-500">*</span>}
    </Label>
    {children}
  </div>
);

const inputCls = "h-9 rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all";
const VARIANT_TYPES = ["Color", "Size", "Unit", "Custom"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Standard", "Premium"];
const UNIT_OPTIONS = ["pcs", "kg", "litre", "meter", "box", "set"];
const COLOR_OPTIONS = [
  { label: "Black", value: "Black", swatch: "#0f172a" },
  { label: "White", value: "White", swatch: "#ffffff" },
  { label: "Blue", value: "Blue", swatch: "#2563eb" },
  { label: "Red", value: "Red", swatch: "#ef4444" },
  { label: "Green", value: "Green", swatch: "#22c55e" },
  { label: "Yellow", value: "Yellow", swatch: "#eab308" },
];

const parseCsv = (value) =>
  String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const toggleCsvValue = (csv, value) => {
  const set = new Set(parseCsv(csv));
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set).join(", ");
};

const AddNewProductModal = ({ open, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const { mainCategories, subcategories, loading, } = useSelector((state) => state.category);

  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [form, setForm] = useState({
    name: "", sku: "", category: "", subCategory: "", brand: "", modelSku: "",
    hsnCode: "", countryOfOrigin: "", unit: "", status: "Active", description: "",
    price: "", mrp: "", costPrice: "", compareAtPrice: "", taxClass: "GST 18%",
    taxIncluded: false, currency: "USD ($)", moq: "", stock: "", lowStockAlert: "",
    barcode: "", manageStock: true, images: [], mainImageIndex: 0, videos: [],
    variants: [
      { id: 1, variantName: "Color", value: "", sku: "", price: "", stock: "" },
      { id: 2, variantName: "Plug Type", value: "", sku: "", price: "", stock: "" },
    ],
    bulkPricing: [{ id: 1, minQty: "", maxQty: "", pricePerUnit: "", discount: "" }],
    specifications: [{ id: 1, name: "", value: "" }],
    shippingMethods: [
      { id: 1, method: "Standard Shipping", eta: "7-10 Business Days", cost: "" },
      { id: 2, method: "Express Shipping", eta: "3-5 Business Days", cost: "" },
      { id: 3, method: "Freight (Bulk Orders)", eta: "10-15 Business Days", cost: "" },
    ],
    productWeight: "", packageLength: "", packageWidth: "", packageHeight: "",
    shipsFrom: "", expectedDispatchTime: "", shippingClass: "Standard",
    returnPolicy: "30 Days Return", returnShipping: "Buyer Pays",
    warrantyPeriod: "12 Months", warrantyType: "Manufacturer Warranty",
    supportEmail: "", supportPhone: "", additionalNotes: "",
    supplierName: "", manufacturerName: "", supplierType: "Manufacturer",
    supplierEmail: "", supplierPhone: "", supplierAddress: "",
    website: "", certification: "", businessLicenseNo: "", additionalDocuments: [],
  });

  const update = (key) => (value) => setForm(s => ({ ...s, [key]: value }));
  const updateRow = (key, id, patch) => setForm(s => ({ ...s, [key]: (s[key] || []).map(r => r.id === id ? { ...r, ...patch } : r) }));
  const addRow = (key, emptyRow) => setForm(s => {
    const nextId = Math.max(0, ...(s[key] || []).map(x => x.id)) + 1;
    return { ...s, [key]: [...(s[key] || []), { ...emptyRow, id: nextId }] };
  });
  const removeRow = (key, id) => setForm(s => ({ ...s, [key]: (s[key] || []).filter(r => r.id !== id) }));

  const addImageUrl = () => {
    const url = String(imageUrl || "").trim();
    if (!url) return;
    setForm((s) => ({ ...s, images: [...(s.images || []), url].slice(0, 10) }));
    setImageUrl("");
  };

  const addVideoUrl = () => {
    const url = String(videoUrl || "").trim();
    if (!url) return;
    setForm((s) => ({ ...s, videos: [...(s.videos || []), url].slice(0, 5) }));
    setVideoUrl("");
  };

  const removeVideo = (idx) => setForm((s) => ({ ...s, videos: (s.videos || []).filter((_, i) => i !== idx) }));
  const canSubmit = useMemo(() => !!(form.name.trim() && form.sku.trim() && form.category.trim() && form.description.trim() && form.price.trim() && form.moq.trim() && form.stock.trim()), [form]);
  const close = () => typeof onClose === "function" && onClose();

  // const categoriesLevel1 = ["Tools & Equipment","Industrial Hardware","Electrical","Raw Materials","Chemicals"];
  // const categoriesLevel2 = ["Cleaning Equipment","Pressure Washers","Bearings","Fasteners","Pipes & Fittings"];
  useEffect(() => {
    dispatch(getMainCategoriesThunk());
  }, [dispatch]);

  const summary = useMemo(() => {
    const variantsCount = Array.isArray(form.variants) ? form.variants.filter(v => String(v?.value || "").trim()).length : 0;
    const tiersCount = Array.isArray(form.bulkPricing) ? form.bulkPricing.length : 0;
    return {
      title: form.name || "—",
      category: form.category || "—",
      sellingPrice: form.price ? `₹ ${form.price}` : "—",
      stock: form.stock ? `${form.stock} units` : "—",
      variants: variantsCount ? `${variantsCount} Variants` : "—",
      bulkTiers: tiersCount ? `${tiersCount} Pricing Tiers` : "—",
    };
  }, [form]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <button className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={close} aria-label="Close" />

        <div className="relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl" style={{ maxHeight: "92vh" }}>
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 shrink-0">
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold text-slate-900">Add New Product</h2>
              <p className="mt-1 text-xs text-slate-500">Fill in the information below to add a new product to your catalog.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" className="h-9 rounded-sm text-xs font-semibold">
                Save as Draft
              </Button>
              <Button
                type="button"
                className="h-9 rounded-sm bg-amber-500 text-xs font-semibold text-white hover:bg-amber-600"
                disabled={!canSubmit}
                onClick={() => {
                  if (!canSubmit) return;
                  typeof onSubmit === "function" && onSubmit(form);
                  close();
                }}
              >
                Publish Product
              </Button>
              <button
                onClick={close}
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                  <div className="rounded-sm border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber-50 text-amber-700">
                          <Package className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Product Information</p>
                          <p className="text-xs text-slate-500">Enter the basic information about your product.</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-5">
                      <div className="grid gap-4 lg:grid-cols-3">
                        <Field label="Product Title" required>
                          <Input className={inputCls} value={form.name} onChange={(e) => update("name")(e.target.value)} placeholder="Enter product title" />
                        </Field>
                        <Field label="Brand" required>
                          <Input className={inputCls} value={form.brand} onChange={(e) => update("brand")(e.target.value)} placeholder="Enter brand name" />
                        </Field>
                        <Field label="Category" required>
                          <Select value={form.category} onValueChange={(value) => { update("category")(value); update("subCategory")(""); dispatch(getSubcategoriesByParentThunk(value)); }}>
                            <SelectTrigger className={inputCls + " w-full"}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                              {mainCategories.map((cat) => (<SelectItem key={cat.id} value={cat.id}> {cat.name} </SelectItem>))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <Field label="Sub Category" required>
                          <Select value={form.subCategory} onValueChange={update("subCategory")}>
                            <SelectTrigger className={inputCls + " w-full"}>
                              <SelectValue placeholder="Select sub category" />
                            </SelectTrigger>
                            <SelectContent position="popper" align="start">
                              {subcategories.length > 0 ? (subcategories.map((sub) => (<SelectItem key={sub.id} value={sub.id}> {sub.name}</SelectItem>))) : (<div className="px-3 py-2 text-sm text-gray-500">No subcategories found </div>)}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="SKU" required>
                          <Input className={inputCls} value={form.sku} onChange={(e) => update("sku")(e.target.value)} placeholder="Enter SKU" />
                        </Field>
                        <Field label="GTIN / Barcode">
                          <Input className={inputCls} value={form.barcode} onChange={(e) => update("barcode")(e.target.value)} placeholder="Enter GTIN or barcode" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <Field label="Selling Price (Per Unit)" required>
                          <Input className={inputCls} value={form.price} onChange={(e) => update("price")(e.target.value)} placeholder="0.00" />
                        </Field>
                        <Field label="MRP (Per Unit)">
                          <Input className={inputCls} value={form.mrp} onChange={(e) => update("mrp")(e.target.value)} placeholder="0.00" />
                        </Field>
                        <Field label="Minimum Order Quantity" required>
                          <Input className={inputCls} value={form.moq} onChange={(e) => update("moq")(e.target.value)} placeholder="Enter minimum quantity" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <Field label="Stock Availability" required>
                          <Input className={inputCls} value={form.stock} onChange={(e) => update("stock")(e.target.value)} placeholder="Enter stock quantity" />
                        </Field>
                        <Field label="Warranty">
                          <Input className={inputCls} value={form.warrantyPeriod} onChange={(e) => update("warrantyPeriod")(e.target.value)} placeholder="e.g. 1 Year Manufacturer" />
                        </Field>
                        <Field label="Return Policy">
                          <Input className={inputCls} value={form.returnPolicy} onChange={(e) => update("returnPolicy")(e.target.value)} placeholder="e.g. 7 Days Replacement" />
                        </Field>
                      </div>

                      <div className="mt-4">
                        <Field label="Product Description" required>
                          <Textarea
                            className="min-h-[110px] rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                            value={form.description}
                            onChange={(e) => update("description")(e.target.value)}
                            placeholder="Write detailed product description, features, and benefits..."
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber-50 text-amber-700">
                          <Settings className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Specifications</p>
                          <p className="text-xs text-slate-500">Add technical specifications for your product.</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="h-8 rounded-sm bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                        onClick={() => addRow("specifications", { name: "", value: "" })}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />Add Specification
                      </Button>
                    </div>

                    <div className="px-5 py-5">
                      <div className="grid grid-cols-[1fr_1fr_40px] gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <div>Specification Name</div>
                        <div>Specification Value</div>
                        <div />
                      </div>
                      <div className="mt-3 space-y-3">
                        {(form.specifications || []).map((row) => (
                          <div key={row.id} className="grid grid-cols-[1fr_1fr_40px] items-center gap-3">
                            <Input
                              className={inputCls}
                              value={row.name}
                              onChange={(e) => updateRow("specifications", row.id, { name: e.target.value })}
                              placeholder="e.g. Bluetooth Version"
                            />
                            <Input
                              className={inputCls}
                              value={row.value}
                              onChange={(e) => updateRow("specifications", row.id, { value: e.target.value })}
                              placeholder="e.g. 5.3"
                            />
                            <button onClick={() => removeRow("specifications", row.id)} className="text-red-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber-50 text-amber-700">
                          <Tag className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Bulk Pricing</p>
                          <p className="text-xs text-slate-500">Set different prices for different quantity ranges.</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="h-8 rounded-sm bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                        onClick={() => addRow("bulkPricing", { minQty: "", maxQty: "", pricePerUnit: "", discount: "" })}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />Add Pricing Tier
                      </Button>
                    </div>

                    <div className="px-5 py-5">
                      <div className="overflow-hidden rounded-sm border border-slate-200">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              {["Min Quantity", "Max Quantity", "Price (Per Unit)", "Action"].map((h) => (
                                <th key={h} className="border-b border-slate-200 px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(form.bulkPricing || []).map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50/50">
                                <td className="border-b border-slate-100 px-4 py-2"><Input className={inputCls} value={row.minQty} onChange={(e) => updateRow("bulkPricing", row.id, { minQty: e.target.value })} /></td>
                                <td className="border-b border-slate-100 px-4 py-2"><Input className={inputCls} value={row.maxQty} onChange={(e) => updateRow("bulkPricing", row.id, { maxQty: e.target.value })} /></td>
                                <td className="border-b border-slate-100 px-4 py-2"><Input className={inputCls} value={row.pricePerUnit} onChange={(e) => updateRow("bulkPricing", row.id, { pricePerUnit: e.target.value })} /></td>
                                <td className="border-b border-slate-100 px-4 py-2">
                                  <button onClick={() => removeRow("bulkPricing", row.id)} className="text-red-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-sm border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber-50 text-amber-700">
                          <Image className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Product Media</p>
                          <p className="text-xs text-slate-500">Upload high quality images of your product.</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-5">
                      {/* Main image */}
                      <div className="relative overflow-hidden rounded-sm border border-slate-200 bg-slate-50">
                        <div className="absolute left-3 top-3 rounded-sm bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                          Main Image
                        </div>
                        <div className="flex h-44 items-center justify-center p-3">
                          {(form.images || []).length ? (
                            <img
                              src={(form.images || [])[form.mainImageIndex || 0]}
                              alt="Main"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                              <Upload className="h-6 w-6 text-slate-500" />
                              <p className="mt-2 text-xs font-semibold text-slate-800">Add image URLs below</p>
                              <p className="mt-1 text-[11px] text-slate-500">You can add up to 10 images</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image URL input */}
                      <div className="mt-3 flex gap-2">
                        <Input
                          className={inputCls + " flex-1"}
                          placeholder="Paste image URL"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addImageUrl()}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-sm px-4 text-xs font-semibold"
                          onClick={addImageUrl}
                        >
                          <Plus className="mr-1 h-4 w-4" />Add
                        </Button>
                      </div>

                      {/* Sub images */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-700">Sub Images</p>
                          <p className="text-[11px] text-slate-500">Click an image to set it as main</p>
                        </div>

                        <div className="mt-2 grid grid-cols-5 gap-3">
                          {(form.images || []).map((url, idx) => {
                            const active = idx === (form.mainImageIndex || 0);
                            return (
                              <button
                                key={`${url}-${idx}`}
                                type="button"
                                onClick={() => setForm((s) => ({ ...s, mainImageIndex: idx }))}
                                className="relative h-16 overflow-hidden rounded-sm border bg-white"
                                style={{ borderColor: active ? "#2563eb" : "#e2e8f0" }}
                              >
                                <img src={url} alt="" className="h-full w-full object-cover" />
                                {active ? (
                                  <span className="absolute bottom-1 left-1 rounded-sm bg-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                                    Main
                                  </span>
                                ) : null}
                                <span
                                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 shadow"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setForm((s) => {
                                      const next = (s.images || []).filter((_, i) => i !== idx);
                                      const nextMain = Math.min(s.mainImageIndex || 0, Math.max(0, next.length - 1));
                                      return { ...s, images: next, mainImageIndex: nextMain };
                                    });
                                  }}
                                  role="button"
                                  aria-label="Remove image"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Videos */}
                      <div className="mt-5">
                        <p className="text-xs font-semibold text-slate-700">Product Videos</p>
                        <div className="mt-2 flex gap-2">
                          <Input
                            className={inputCls + " flex-1"}
                            placeholder="Paste video URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addVideoUrl()}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-sm px-4 text-xs font-semibold"
                            onClick={addVideoUrl}
                          >
                            Add
                          </Button>
                        </div>

                        {(form.videos || []).length ? (
                          <div className="mt-3 space-y-2">
                            {(form.videos || []).map((u, idx) => (
                              <div key={`${u}-${idx}`} className="flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-white px-3 py-2">
                                <span className="truncate text-xs text-slate-600">{u}</span>
                                <button
                                  type="button"
                                  onClick={() => removeVideo(idx)}
                                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber-50 text-amber-700">
                          <Layers className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Product Variants</p>
                          <p className="text-xs text-slate-500">Add available sizes / variants for this product.</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-5">
                      <div className="space-y-3">
                        {(form.variants || []).map((row) => (
                          <div key={row.id} className="rounded-sm border border-slate-200 bg-white p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Variant Type</p>
                                <Select
                                  value={row.variantName || "Custom"}
                                  onValueChange={(v) => updateRow("variants", row.id, { variantName: v, value: "" })}
                                >
                                  <SelectTrigger className={inputCls + " w-full"}>
                                    <SelectValue placeholder="Select variant" />
                                  </SelectTrigger>
                                  <SelectContent position="popper" align="start">
                                    {VARIANT_TYPES.map((t) => (
                                      <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeRow("variants", row.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 text-slate-500 hover:bg-slate-50"
                                aria-label="Remove variant"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Values</p>
                              <div className="mt-2">
                                {row.variantName === "Color" ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    {COLOR_OPTIONS.map((c) => {
                                      const selected = parseCsv(row.value);
                                      const active = selected.includes(c.value);
                                      return (
                                        <button
                                          key={c.value}
                                          type="button"
                                          onClick={() => updateRow("variants", row.id, { value: toggleCsvValue(row.value, c.value) })}
                                          className="flex w-full items-center justify-start gap-2 rounded-sm border px-2 py-2 text-xs font-semibold"
                                          style={{
                                            borderColor: active ? "#0B1F3A" : "#e2e8f0",
                                            background: active ? "#FFF8EC" : "#ffffff",
                                            color: "#1A1A1A",
                                          }}
                                        >
                                          <span className="relative h-4 w-4 rounded-sm border" style={{ background: c.swatch, borderColor: "#e2e8f0" }}>
                                            {active ? (
                                              <span className="absolute inset-0 grid place-items-center">
                                                <Check className="h-3 w-3" style={{ color: c.value === "White" ? "#0f172a" : "#ffffff" }} />
                                              </span>
                                            ) : null}
                                          </span>
                                          {c.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : row.variantName === "Size" ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    {SIZE_OPTIONS.map((s) => {
                                      const selected = parseCsv(row.value);
                                      const checked = selected.includes(s);
                                      return (
                                        <label
                                          key={s}
                                          className="flex w-full cursor-pointer items-center gap-2 rounded-sm border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                        >
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-slate-900"
                                            checked={checked}
                                            onChange={() => updateRow("variants", row.id, { value: toggleCsvValue(row.value, s) })}
                                          />
                                          {s}
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : row.variantName === "Unit" ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    {UNIT_OPTIONS.map((u) => {
                                      const selected = parseCsv(row.value);
                                      const checked = selected.includes(u);
                                      return (
                                        <label
                                          key={u}
                                          className="flex w-full cursor-pointer items-center gap-2 rounded-sm border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                        >
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-slate-900"
                                            checked={checked}
                                            onChange={() => updateRow("variants", row.id, { value: toggleCsvValue(row.value, u) })}
                                          />
                                          {u}
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <Input
                                    className={inputCls + " w-full"}
                                    value={row.value}
                                    onChange={(e) => updateRow("variants", row.id, { value: e.target.value })}
                                    placeholder="Enter value"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                              <span className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 font-semibold text-slate-700">
                                {row.variantName || "Custom"}
                              </span>
                              {parseCsv(row.value).map((v) => (
                                <span key={v} className="rounded-sm border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700">
                                  {v}
                                </span>
                              ))}
                              {!parseCsv(row.value).length ? (
                                <span className="text-slate-500">No values selected</span>
                              ) : null}
                            </div>
                          </div>
                        ))}
                        <Button type="button" variant="outline" className="h-9 w-full rounded-sm text-xs font-semibold" onClick={() => addRow("variants", { variantName: "", value: "", sku: "", price: "", stock: "" })}>
                          <Plus className="mr-1 h-4 w-4" />Add Variant
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber-50 text-amber-700">
                          <Archive className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Product Summary</p>
                          <p className="text-xs text-slate-500">Review your product information before publishing.</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-5">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Product Title</span><span className="font-semibold text-slate-900">{summary.title}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Category</span><span className="font-semibold text-slate-900">{summary.category}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Selling Price</span><span className="font-semibold text-slate-900">{summary.sellingPrice}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Stock</span><span className="font-semibold text-slate-900">{summary.stock}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Variants</span><span className="font-semibold text-slate-900">{summary.variants}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Bulk Tiers</span><span className="font-semibold text-slate-900">{summary.bulkTiers}</span></div>
                      </div>

                      <div className="mt-5 rounded-sm border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs font-semibold text-amber-900">Please review all information before publishing.</p>
                        <p className="mt-1 text-[11px] text-amber-900/70">Your product will be visible to buyers after approval.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shrink-0">
            <Button type="button" variant="outline" className="h-9 rounded-sm text-xs font-semibold" onClick={close}>
              Cancel
            </Button>
            <Button
              type="button"
              className="h-9 rounded-sm bg-amber-500 text-xs font-semibold text-white hover:bg-amber-600"
              disabled={!canSubmit}
              onClick={() => {
                if (!canSubmit) return;
                typeof onSubmit === "function" && onSubmit(form);
                close();
              }}
            >
              Publish Product
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewProductModal;