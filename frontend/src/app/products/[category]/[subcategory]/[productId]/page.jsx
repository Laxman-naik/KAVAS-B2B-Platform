"use client";

import { use } from "react";
import { productsData } from "@/app/(buyer)/product/productData";
import { slugify } from "@/utils/slugify";

export default function ProductPage({ params }) {
  const { category, subcategory, productId } = use(params);

  const product = (productsData[category] || []).find(
    (p) =>
      p.id === Number(productId) &&
      slugify(p.subcategory) === subcategory   
  );

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <img src={product.image} className="w-64 mt-4" />

      <p className="text-blue-600 text-xl mt-2">₹{product.price}</p>

      <p className="mt-1">Min Qty: {product.minQty}</p>

      <p className="mt-1 text-sm text-gray-500">{product.supplier}</p>
    </div>
  );
}
