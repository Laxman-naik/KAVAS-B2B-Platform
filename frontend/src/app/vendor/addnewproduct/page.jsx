
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
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append("category", data.category);
    formData.append("unit", data.unit);
    formData.append("status", data.status);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("mrp", Number(data.mrp));
    formData.append("gst", Number(data.gst || 0));
    formData.append("moq", Number(data.moq));
    formData.append("stock", Number(data.stock));

    // ✅ FIX UUID ISSUE HERE
    const orgId = localStorage.getItem("organizationId");
    if (!orgId) {
      alert("Organization ID missing");
      return;
    }
    formData.append("organizationId", orgId);

    // ✅ FIX IMAGE UPLOAD HERE
    data.images.forEach((file) => {
      formData.append("images", file);
    });

    await dispatch(addProduct(formData)).unwrap();

    alert("✅ Product Added");
    router.push("/vendor/products");

  } catch (err) {
    console.error(err);
    alert("❌ Failed to add product");
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
