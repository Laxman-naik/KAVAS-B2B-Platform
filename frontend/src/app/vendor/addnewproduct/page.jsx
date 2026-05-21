"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { addProduct } from "../../../redux/slices/productSlice";

export default function AddNewProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    try {
      const payload = {
        name: data.name?.trim(),
        description: data.description?.trim(),
        price: Number(data.price || 0),
        mrp: Number(data.mrp || 0),
        moq: Number(data.moq || 1),
        stock: Number(data.stock || 0),
        sku: data.sku?.trim(),
        unit: data.unit || "pcs",
        images: Array.isArray(data.images)
          ? data.images.filter((url) => typeof url === "string" && url.trim())
          : [],
      };

      console.log("FINAL PRODUCT PAYLOAD:", payload);

      await dispatch(addProduct(payload)).unwrap();

      router.push("/vendor/products");
    } catch (error) {
      console.log("PAGE CREATE ERROR:", error);
      alert(
        typeof error === "string"
          ? error
          : error?.message || "Failed to create product"
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