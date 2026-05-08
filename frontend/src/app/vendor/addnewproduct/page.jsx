"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { addProduct } from "../../../store/slices/productSlice";

export default function AddNewProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    try {
      const orgId = localStorage.getItem("organizationId");

      if (!orgId) {
        alert("Organization ID missing");
        return;
      }

      const payload = {
        name: data.name,
        sku: data.sku,
        category: data.category,
        unit: data.unit,
        status: data.status,
        description: data.description,
        price: Number(data.price),
        mrp: Number(data.mrp),
        gst: Number(data.gst || 0),
        moq: Number(data.moq),
        stock: Number(data.stock),
        organizationId: orgId,

        // backend currently accepts image URLs only, not file uploads
        images: [],
      };

      await dispatch(addProduct(payload)).unwrap();

      alert("✅ Product Added");
      router.push("/vendor/products");
    } catch (err) {
      console.error(err);
      alert(err?.message || "❌ Failed to add product");
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