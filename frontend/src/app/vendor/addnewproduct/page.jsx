
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { createProduct as createProductAPI } from "../../../services/productService";

export default function AddNewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
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
