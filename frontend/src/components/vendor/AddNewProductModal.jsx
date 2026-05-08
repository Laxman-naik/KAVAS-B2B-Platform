


"use client";
 
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Info, Plus, Trash2, Upload, X, ChevronRight, ChevronLeft, Check, Package, Image, Layers, Archive, Tag, Settings, Truck, ShieldCheck, Building2 } from "lucide-react";
 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
 
/* ─────────────────────────────────────────────
   Step definitions
───────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Basic Info",       short: "Info",      icon: Package },
  { id: 2, label: "Media",            short: "Media",     icon: Image },
  { id: 3, label: "Variants",         short: "Variants",  icon: Layers },
  { id: 4, label: "Inventory",        short: "Stock",     icon: Archive },
  { id: 5, label: "Pricing",          short: "Price",     icon: Tag },
  { id: 6, label: "Specifications",   short: "Specs",     icon: Settings },
  { id: 7, label: "Shipping",         short: "Ship",      icon: Truck },
  { id: 8, label: "Return & Warranty",short: "Return",    icon: ShieldCheck },
  { id: 9, label: "Supplier",         short: "Supplier",  icon: Building2 },
];
 
/* ─────────────────────────────────────────────
   Tiny shared field components
───────────────────────────────────────────── */
const Field = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
      {label}{required && <span className="ml-0.5 text-blue-500">*</span>}
    </Label>
    {children}
  </div>
);
 
const inputCls =
  "h-9 rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all";
 
/* ─────────────────────────────────────────────
   Step panels
───────────────────────────────────────────── */
 
function StepBasicInfo({ form, update }) {
  const categoriesLevel1 = ["Tools & Equipment","Industrial Hardware","Electrical","Raw Materials","Chemicals"];
  const categoriesLevel2 = ["Cleaning Equipment","Pressure Washers","Bearings","Fasteners","Pipes & Fittings"];
  return (
    <div className="space-y-5">
      <Field label="Product Title" required>
        <Input className={inputCls} value={form.name} onChange={e => update("name")(e.target.value)} placeholder="e.g. High Pressure Washer 2000W" />
      </Field>
      <Field label="Product Description" required>
        <Textarea className="rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 min-h-[110px] transition-all" value={form.description} onChange={e => update("description")(e.target.value)} placeholder="Describe your product…" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" required>
          <Select value={form.category} onValueChange={update("category")}>
            <SelectTrigger className={inputCls}><SelectValue placeholder="Select Category" /></SelectTrigger>
            <SelectContent>{categoriesLevel1.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Sub Category">
          <Select value={form.subCategory} onValueChange={update("subCategory")}>
            <SelectTrigger className={inputCls}><SelectValue placeholder="Select Sub Category" /></SelectTrigger>
            <SelectContent>{categoriesLevel2.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Brand" required>
          <Input className={inputCls} value={form.brand} onChange={e => update("brand")(e.target.value)} />
        </Field>
        <Field label="Model / SKU" required>
          <Input className={inputCls} value={form.modelSku} onChange={e => update("modelSku")(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Field label="HSN Code" required>
            <Input className={inputCls} value={form.hsnCode} onChange={e => update("hsnCode")(e.target.value)} />
          </Field>
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>HSN code classifies products for GST, taxation, invoicing and export/import.</span>
          </div>
        </div>
        <Field label="Status">
          <Select value={form.status} onValueChange={update("status")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Active","Pending Review","Low Stock","Out of Stock"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
      
      </div>
   
  );
}
 
function StepMedia({ form, update, setForm }) {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
 
  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    setForm(s => ({ ...s, images: [...(s.images || []), url].slice(0, 10) }));
    setImageUrl("");
  };
  const removeImage = idx => {
    setForm(s => {
      const next = (s.images || []).filter((_, i) => i !== idx);
      return { ...s, images: next, mainImageIndex: Math.min(s.mainImageIndex || 0, Math.max(0, next.length - 1)) };
    });
  };
  const addVideoUrl = () => {
    const url = videoUrl.trim();
    if (!url) return;
    setForm(s => ({ ...s, videos: [...(s.videos || []), url].slice(0, 5) }));
    setVideoUrl("");
  };
  const removeVideo = idx => setForm(s => ({ ...s, videos: (s.videos || []).filter((_, i) => i !== idx) }));
 
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3 block">Product Images <span className="text-blue-500">*</span></Label>
        <div className="grid grid-cols-5 gap-3">
          {(form.images || []).slice(0, 4).map((url, idx) => (
            <div key={idx} className="relative group h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X className="h-5 w-5 text-white" />
              </button>
              {idx === (form.mainImageIndex || 0) && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">Main</span>
              )}
            </div>
          ))}
          <button onClick={addImageUrl} className="flex h-28 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Add Image</span>
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Input className={inputCls + " flex-1"} placeholder="https://image-url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addImageUrl()} />
          <Button type="button" variant="outline" className="rounded-md h-9 px-4" onClick={addImageUrl}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </div>
        {(form.images || []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {(form.images || []).map((_, idx) => (
              <label key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input type="radio" name="mainImage" checked={(form.mainImageIndex || 0) === idx} onChange={() => setForm(s => ({ ...s, mainImageIndex: idx }))} className="accent-blue-600" />
                Set as main #{idx + 1}
              </label>
            ))}
          </div>
        )}
      </div>
 
      <div>
        <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3 block">Product Videos</Label>
        <div className="flex gap-2">
          <Input className={inputCls + " flex-1"} placeholder="https://video-url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addVideoUrl()} />
          <Button type="button" variant="outline" className="rounded-md h-9 px-4" onClick={addVideoUrl}><Upload className="h-4 w-4 mr-1" />Add</Button>
        </div>
        {(form.videos || []).map((u, idx) => (
          <div key={idx} className="mt-2 flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
            <span className="truncate text-xs text-slate-600">{u}</span>
            <button onClick={() => removeVideo(idx)} className="ml-2 text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function StepVariants({ form, updateRow, addRow, removeRow }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
        {["Variant Name","Value","SKU","Price","Stock / Actions"].map(h => <div key={h}>{h}</div>)}
      </div>
      {(form.variants || []).map((row, i) => (
        <div key={row.id} className="grid grid-cols-5 gap-3 items-center bg-slate-50 rounded-lg p-3 border border-slate-100">
          <Input className={inputCls} value={row.variantName} onChange={e => updateRow("variants", row.id, { variantName: e.target.value })} />
          <Input className={inputCls} value={row.value} onChange={e => updateRow("variants", row.id, { value: e.target.value })} />
          <Input className={inputCls} value={row.sku} onChange={e => updateRow("variants", row.id, { sku: e.target.value })} />
          <Input className={inputCls} value={row.price} onChange={e => updateRow("variants", row.id, { price: e.target.value })} placeholder="$0.00" />
          <div className="flex items-center gap-2">
            <Input className={inputCls + " flex-1"} value={row.stock} onChange={e => updateRow("variants", row.id, { stock: e.target.value })} />
            <button onClick={() => removeRow("variants", row.id)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="rounded-lg mt-2" onClick={() => addRow("variants", { variantName: "", value: "", sku: "", price: "", stock: "" })}>
        <Plus className="h-4 w-4 mr-2" />Add Variant
      </Button>
    </div>
  );
}
 
function StepInventory({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="SKU" required><Input className={inputCls} value={form.sku} onChange={e => update("sku")(e.target.value)} /></Field>
        <Field label="Barcode (ISBN, EAN, UPC)"><Input className={inputCls} value={form.barcode} onChange={e => update("barcode")(e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Stock Quantity" required><Input className={inputCls} value={form.stock} onChange={e => update("stock")(e.target.value)} /></Field>
        <Field label="Low Stock Alert"><Input className={inputCls} value={form.lowStockAlert} onChange={e => update("lowStockAlert")(e.target.value)} /></Field>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Manage Stock</Label>
          <div className="flex h-9 items-center justify-between rounded-md border border-slate-200 bg-white px-3">
            <span className="text-sm text-slate-700">Track inventory</span>
            <Switch checked={!!form.manageStock} onCheckedChange={v => update("manageStock")(!!v)} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="MOQ (Min Order Qty)" required><Input className={inputCls} value={form.moq} onChange={e => update("moq")(e.target.value)} /></Field>
        <Field label="Unit"><Input className={inputCls} value={form.unit} onChange={e => update("unit")(e.target.value)} placeholder="e.g. pcs, kg, litre" /></Field>
      </div>
    </div>
  );
}
 
function StepPricing({ form, update, updateRow, addRow, removeRow }) {
  const taxClasses = ["GST 0%","GST 5%","GST 12%","GST 18%","GST 28%"];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Cost Price (Per Unit)" required>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span><Input className={inputCls + " pl-7"} value={form.costPrice} onChange={e => update("costPrice")(e.target.value)} /></div>
        </Field>
        <Field label="Selling Price (Per Unit)" required>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span><Input className={inputCls + " pl-7"} value={form.price} onChange={e => update("price")(e.target.value)} /></div>
        </Field>
        <Field label="Compare at Price">
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span><Input className={inputCls + " pl-7"} value={form.compareAtPrice} onChange={e => update("compareAtPrice")(e.target.value)} /></div>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Tax Class" required>
          <Select value={form.taxClass} onValueChange={update("taxClass")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{taxClasses.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tax Included</Label>
          <div className="flex h-9 items-center justify-between rounded-md border border-slate-200 bg-white px-3">
            <span className="text-sm text-slate-700">Prices incl. tax</span>
            <Switch checked={!!form.taxIncluded} onCheckedChange={v => update("taxIncluded")(!!v)} />
          </div>
        </div>
        <Field label="Currency" required>
          <Select value={form.currency} onValueChange={update("currency")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{["USD ($)","INR (₹)"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>
 
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Bulk Pricing (Quantity Based)</h3>
          <Button type="button" variant="outline" size="sm" className="rounded-lg h-8 text-xs" onClick={() => addRow("bulkPricing", { minQty: "", maxQty: "", pricePerUnit: "", discount: "" })}>
            <Plus className="h-3.5 w-3.5 mr-1" />Add Slab
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>{["Min. Qty","Max. Qty","Price / Unit","Discount",""].map(h => <th key={h} className="border-b border-slate-200 px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody>
              {(form.bulkPricing || []).map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  {["minQty","maxQty","pricePerUnit","discount"].map(f => (
                    <td key={f} className="border-b border-slate-100 px-4 py-2">
                      <Input className={inputCls} value={row[f]} onChange={e => updateRow("bulkPricing", row.id, { [f]: e.target.value })} />
                    </td>
                  ))}
                  <td className="border-b border-slate-100 px-4 py-2 text-right">
                    <button onClick={() => removeRow("bulkPricing", row.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 
function StepSpecifications({ form, updateRow, addRow, removeRow }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_1fr_40px] gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
        <div>Specification Name</div><div>Value</div><div />
      </div>
      {(form.specifications || []).map(row => (
        <div key={row.id} className="grid grid-cols-[1fr_1fr_40px] gap-3 items-center">
          <Input className={inputCls} value={row.name} onChange={e => updateRow("specifications", row.id, { name: e.target.value })} placeholder="e.g. Power" />
          <Input className={inputCls} value={row.value} onChange={e => updateRow("specifications", row.id, { value: e.target.value })} placeholder="e.g. 2000W" />
          <button onClick={() => removeRow("specifications", row.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <Button type="button" variant="outline" className="rounded-lg mt-2" onClick={() => addRow("specifications", { name: "", value: "" })}>
        <Plus className="h-4 w-4 mr-2" />Add Specification
      </Button>
    </div>
  );
}
 
function StepShipping({ form, update, updateRow, addRow, removeRow }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Product Weight" required><Input className={inputCls} value={form.productWeight} onChange={e => update("productWeight")(e.target.value)} placeholder="e.g. 9.5 kg" /></Field>
        <Field label="Package Dimensions (L × W × H)" required>
          <div className="grid grid-cols-3 gap-2">
            {[["packageLength","L"],["packageWidth","W"],["packageHeight","H"]].map(([k, ph]) => (
              <Input key={k} className={inputCls} placeholder={ph} value={form[k]} onChange={e => update(k)(e.target.value)} />
            ))}
          </div>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Shipping Class" required>
          <Select value={form.shippingClass} onValueChange={update("shippingClass")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{["Standard","Express","Freight"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Ships From" required><Input className={inputCls} value={form.shipsFrom} onChange={e => update("shipsFrom")(e.target.value)} /></Field>
        <Field label="Expected Dispatch Time" required><Input className={inputCls} value={form.expectedDispatchTime} onChange={e => update("expectedDispatchTime")(e.target.value)} placeholder="e.g. 2-3 Business Days" /></Field>
      </div>
 
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Shipping Methods</h3>
          <Button type="button" variant="outline" size="sm" className="rounded-lg h-8 text-xs" onClick={() => addRow("shippingMethods", { method: "", eta: "", cost: "" })}>
            <Plus className="h-3.5 w-3.5 mr-1" />Add Method
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>{["Method","Estimated Delivery","Cost",""].map(h => <th key={h} className="border-b border-slate-200 px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody>
              {(form.shippingMethods || []).map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  {["method","eta","cost"].map(f => (
                    <td key={f} className="border-b border-slate-100 px-4 py-2">
                      <Input className={inputCls} value={row[f]} onChange={e => updateRow("shippingMethods", row.id, { [f]: e.target.value })} />
                    </td>
                  ))}
                  <td className="border-b border-slate-100 px-4 py-2 text-right">
                    <button onClick={() => removeRow("shippingMethods", row.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 
function StepReturnWarranty({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Return Policy" required>
          <Select value={form.returnPolicy} onValueChange={update("returnPolicy")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{["No Returns","7 Days Return","15 Days Return","30 Days Return"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Return Shipping" required>
          <Select value={form.returnShipping} onValueChange={update("returnShipping")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{["Buyer Pays","Seller Pays"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Warranty Period" required>
          <Input className={inputCls} value={form.warrantyPeriod} onChange={e => update("warrantyPeriod")(e.target.value)} placeholder="e.g. 12 Months" />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Warranty Type" required>
          <Select value={form.warrantyType} onValueChange={update("warrantyType")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{["Manufacturer Warranty","Seller Warranty"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Support Email" required>
          <Input className={inputCls} value={form.supportEmail} onChange={e => update("supportEmail")(e.target.value)} type="email" placeholder="support@example.com" />
        </Field>
        <Field label="Support Phone" required>
          <Input className={inputCls} value={form.supportPhone} onChange={e => update("supportPhone")(e.target.value)} />
        </Field>
      </div>
      <Field label="Additional Notes">
        <Textarea className="rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 min-h-[90px] transition-all" value={form.additionalNotes} onChange={e => update("additionalNotes")(e.target.value)} />
      </Field>
    </div>
  );
}
 
function StepSupplier({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Supplier Name" required><Input className={inputCls} value={form.supplierName} onChange={e => update("supplierName")(e.target.value)} /></Field>
        <Field label="Store Name" required><Input className={inputCls} value={form.manufacturerName} onChange={e => update("manufacturerName")(e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Supplier Type" required>
          <Select value={form.supplierType} onValueChange={update("supplierType")}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>{["Manufacturer","Wholesaler","Distributor"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Supplier Email" required><Input className={inputCls} value={form.supplierEmail} onChange={e => update("supplierEmail")(e.target.value)} type="email" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Supplier Phone" required><Input className={inputCls} value={form.supplierPhone} onChange={e => update("supplierPhone")(e.target.value)} /></Field>
        <Field label="Address" required><Input className={inputCls} value={form.supplierAddress} onChange={e => update("supplierAddress")(e.target.value)} /></Field>
      </div>
      
      <div>
        <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Additional Documents</Label>
        <Button type="button" variant="outline" className="rounded-lg">
          <Upload className="h-4 w-4 mr-2" />Upload Certificate / Document
        </Button>
        <p className="mt-1.5 text-xs text-slate-400">PDF, JPG, PNG (Max 10MB)</p>
      </div>
    </div>
  );
}
 
/* ─────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────── */
const AddNewProductModal = ({ open, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [animating, setAnimating] = useState(false);
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
 
  const canSubmit = useMemo(() => !!(form.name.trim() && form.sku.trim() && form.category.trim() && form.description.trim() && form.price.trim() && form.moq.trim() && form.stock.trim()), [form]);
 
  const goTo = (step) => {
    if (animating) return;
    setDirection(step > currentStep ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setAnimating(false);
    }, 250);
  };
 
  const close = () => typeof onClose === "function" && onClose();
  if (!open) return null;
 
  const stepProps = { form, update, updateRow, addRow, removeRow, setForm };
  const panels = [
    <StepBasicInfo {...stepProps} />,
    <StepMedia {...stepProps} />,
    <StepVariants {...stepProps} />,
    <StepInventory {...stepProps} />,
    <StepPricing {...stepProps} />,
    <StepSpecifications {...stepProps} />,
    <StepShipping {...stepProps} />,
    <StepReturnWarranty {...stepProps} />,
    <StepSupplier {...stepProps} />,
  ];
 
  const isLast = currentStep === STEPS.length;
  const isFirst = currentStep === 1;
 
  return (
    <>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft  { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-60px); opacity: 0; } }
        @keyframes slideOutRight{ from { transform: translateX(0); opacity: 1; } to { transform: translateX(60px); opacity: 0; } }
        .slide-in-fwd  { animation: slideInRight 0.28s cubic-bezier(.22,1,.36,1) both; }
        .slide-in-back { animation: slideInLeft  0.28s cubic-bezier(.22,1,.36,1) both; }
        .slide-out-fwd { animation: slideOutLeft 0.22s cubic-bezier(.55,0,1,.45) both; }
      `}</style>
 
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <button className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={close} aria-label="Close" />
 
        {/* Modal shell */}
        <div className="relative z-10 flex w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden" style={{ maxHeight: "92vh" }}>
 
          {/* ── Top bar ── */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 shrink-0">
            <div>
              <p className="text-xs text-slate-400">Dashboard / Products / <span className="font-medium text-slate-600">Add New Product</span></p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Add New Product</h2>
            </div>
            <div className="flex items-center gap-3">
             
              <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
 
          {/* ── Step indicator ── */}
          <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-3 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const done = currentStep > step.id;
                const active = currentStep === step.id;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => goTo(step.id)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
                        ${active ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : done ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{step.short}</span>
                    </button>
                    {idx < STEPS.length - 1 && (
                      <div className={`h-px w-4 shrink-0 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
 
          {/* ── Step content ── */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="px-6 py-6">
              {/* Step heading */}
              <div className="mb-6 flex items-center gap-3">
                {(() => { const Icon = STEPS[currentStep - 1].icon; return <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50"><Icon className="h-4.5 w-4.5 text-blue-600" /></div>; })()}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Step {currentStep} of {STEPS.length}</p>
                  <h3 className="text-base font-bold text-slate-900">{STEPS[currentStep - 1].label}</h3>
                </div>
              </div>
 
              {/* Animated panel */}
              <div key={currentStep} className={animating ? "slide-out-fwd" : (direction === 1 ? "slide-in-fwd" : "slide-in-back")}>
                {panels[currentStep - 1]}
              </div>
            </div>
          </div>
 
          {/* ── Bottom nav ── */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shrink-0">
            <div className="text-xs text-slate-400">{currentStep} / {STEPS.length} steps</div>
            <div className="flex items-center gap-3">
              {!isFirst && (
                <Button type="button" variant="outline" className="rounded-xl gap-2" onClick={() => goTo(currentStep - 1)}>
                  <ChevronLeft className="h-4 w-4" />Previous
                </Button>
              )}
              {!isLast ? (
                <Button type="button" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => goTo(currentStep + 1)}>
                  Next<ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2" disabled={!canSubmit}
                  onClick={() => { if (!canSubmit) return; typeof onSubmit === "function" && onSubmit(form); close(); }}>
                  <Check className="h-4 w-4" />Submit 
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default AddNewProductModal;