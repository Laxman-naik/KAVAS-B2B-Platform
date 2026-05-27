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

        category: form.category || null,
        subCategory: form.subCategory || null,

        unit: form.unit || "pcs",
        status: "active",
        description: form.description,

        price: Number(form.price || 0),
        mrp: Number(form.mrp || 0),
        moq: Number(form.moq || 1),
        stock: Number(form.stock || 0),

        gst: form.taxClass || "",
        brand: form.brand || "",
        barcode: form.barcode || "",

        weight: form.productWeight || null,
        dispatchTimeDays: Number(form.expectedDispatchTime || 0),

        images: Array.isArray(form.images)
          ? form.images.filter((url) => typeof url === "string" && url.trim())
          : [],

        videos: Array.isArray(form.videos)
          ? form.videos.filter((url) => typeof url === "string" && url.trim())
          : [],

        specifications: Array.isArray(form.specifications)
          ? form.specifications
            .filter((s) => s.name?.trim() && s.value?.trim())
            .map((s) => ({
              name: s.name.trim(),
              value: s.value.trim(),
            }))
          : [],

        bulkPricing: Array.isArray(form.bulkPricing)
          ? form.bulkPricing
            .filter((p) => p.minQty && p.pricePerUnit)
            .map((p) => ({
              minQty: Number(p.minQty),
              maxQty: p.maxQty ? Number(p.maxQty) : null,
              pricePerUnit: Number(p.pricePerUnit),
            }))
          : [],

        variants: Array.isArray(form.variants)
          ? form.variants
            .filter((v) => v.value?.trim())
            .map((v) => ({
              variant_type: v.variantName,
              variant_value: v.value,
              sku: v.sku || null,
              price: Number(v.price || form.price || 0),
              mrp: Number(v.mrp || form.mrp || 0),
              stock: Number(v.stock || 0),
              unit: form.unit || "pcs",
            }))
          : [],
      };

      console.log("FINAL PRODUCT PAYLOAD:", payload);

      await dispatch(addProduct(payload)).unwrap();
      router.push("/vendor/products");
    } catch (error) {
      console.error("Product create failed:", error);

      alert(
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to create product"
      );
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