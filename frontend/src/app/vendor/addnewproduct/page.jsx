
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AddNewProductModal from "../../../components/vendor/AddNewProductModal";

export default function AddNewProductPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <AddNewProductModal
        open={true}
        onClose={() => router.push("/vendor/products")}
        onSubmit={() => {
          router.push("/vendor/products");
        }}
      />
    </div>
  );
}

