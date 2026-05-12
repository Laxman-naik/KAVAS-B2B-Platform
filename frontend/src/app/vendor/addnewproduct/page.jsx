"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { createProduct as createProductAPI } from "../../../services/productService";

export default function AddNewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
<<<<<<< HEAD
    const payload = {
      name: data?.name,
      sku: data?.sku,
      category: data?.category,
      unit: data?.unit,
      status: data?.status,
      description: data?.description,
      price: Number(data?.price || 0),
      mrp: Number(data?.mrp || 0),
      gst: data?.gst,
      moq: Number(data?.moq || 0),
      stock: Number(data?.stock || 0),
      images: Array.isArray(data?.images) ? data.images.filter((x) => typeof x === "string" && x.trim()) : [],
    };

    await createProductAPI(payload);
    router.push("/vendor/products");
=======
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
>>>>>>> dacb9434a2740621473dc5129e65304e26b294b7
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