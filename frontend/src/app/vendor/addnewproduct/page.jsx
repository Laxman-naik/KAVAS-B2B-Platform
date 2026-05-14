"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { addProduct } from "../../../redux/slices/productSlice";

export default function AddNewProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (form) => {
    try {
      const payload = {
        name: form.name?.trim(),
        sku: form.sku?.trim(),

        categories: form.subCategoryId
          ? [Number(form.subCategoryId)]
          : form.categoryId
          ? [Number(form.categoryId)]
          : [],

        category: form.subCategory || form.category,

        unit: form.unit || "pcs",
        status: "active",
        description: form.description,

        price: Number(form.price || 0),
        mrp: Number(form.mrp || 0),
        moq: Number(form.moq || 0),
        stock: Number(form.stock || 0),

        gst: form.taxClass || "",
        brand: form.brand || "",
        barcode: form.barcode || "",

        weight: form.productWeight || null,
        dispatchTimeDays: Number(form.expectedDispatchTime || 0),

        images: Array.isArray(form.images)
          ? form.images.filter(
              (url) => typeof url === "string" && url.trim()
            )
          : [],

        specifications: Array.isArray(form.specifications)
          ? form.specifications
              .filter((s) => s.name?.trim() && s.value?.trim())
              .map((s) => ({
                key: s.name.trim(),
                value: s.value.trim(),
              }))
          : [],

        pricingTiers: Array.isArray(form.bulkPricing)
          ? form.bulkPricing
              .filter((p) => p.minQty && p.pricePerUnit)
              .map((p) => ({
                min_quantity: Number(p.minQty),
                price: Number(p.pricePerUnit),
                label: p.maxQty ? `${p.minQty}-${p.maxQty}` : `${p.minQty}+`,
              }))
          : [],
      };

      await dispatch(addProduct(payload)).unwrap();

      router.push("/vendor/products");
    } catch (error) {
      console.error("Product create failed:", error);
      alert(error?.message || "Failed to create product");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <AddNewProductModal
        open={true}
        onClose={() => router.push("/vendor/products")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}