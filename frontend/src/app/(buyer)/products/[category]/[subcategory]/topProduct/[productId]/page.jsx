"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slugLabel = (value = "") =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function ProductDetailPage({ params }) {
  const [route, setRoute] = useState({
    category: "",
    subcategory: "",
    product: "",
    id: "",
  });

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const resolved = await params;
      const { category, subcategory, product, id } = resolved;

      setRoute({ category, subcategory, product, id });

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/listing/${id}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white border rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <Link
            href={`/products/${route.category}/${route.subcategory}/${route.product}`}
            className="text-orange-500 mt-3 inline-block hover:underline"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="px-4 sm:px-6 py-3 bg-white border-b text-sm text-gray-600 flex flex-wrap gap-2">
        <Link
          href={`/products/${route.category}`}
          className="hover:text-orange-500 capitalize"
        >
          {slugLabel(route.category)}
        </Link>
        <span>/</span>
        <Link
          href={`/products/${route.category}/${route.subcategory}`}
          className="hover:text-orange-500"
        >
          {slugLabel(route.subcategory)}
        </Link>
        <span>/</span>
        <Link
          href={`/products/${route.category}/${route.subcategory}/${route.product}`}
          className="hover:text-orange-500"
        >
          {slugLabel(route.product)}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border rounded-lg p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 sm:h-80 md:h-[420px] object-cover rounded"
            />

            <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
            <p className="text-blue-600 text-2xl mt-2">₹{product.price}/unit</p>
            <p className="mt-1 text-sm text-gray-500">
              Min Qty: {product.minOrderQty}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {product.supplierType || product.organizationName}
            </p>

            {product.description && (
              <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-sm text-gray-600 leading-6">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-3">Product Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">
                    {slugLabel(route.category)}
                  </p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Subcategory</p>
                  <p className="font-medium">
                    {slugLabel(route.subcategory)}
                  </p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Supplier Type</p>
                  <p className="font-medium">
                    {product.supplierType || "Supplier"}
                  </p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Minimum Order</p>
                  <p className="font-medium">{product.minOrderQty} units</p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{product.price}/unit</p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Stock</p>
                  <p className="font-medium">
                    {product.stock ?? "Available"}
                  </p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Dispatch Time</p>
                  <p className="font-medium">
                    {product.dispatchTimeDays
                      ? `${product.dispatchTimeDays} days`
                      : "N/A"}
                  </p>
                </div>

                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-gray-500">Unit</p>
                  <p className="font-medium">{product.unit || "Piece"}</p>
                </div>
              </div>
            </div>

            {Array.isArray(product.specifications) &&
              product.specifications.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h2 className="text-lg font-semibold mb-3">
                    Specifications
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec.id || `${spec.key}-${spec.value}`}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <p className="text-gray-500">{spec.key}</p>
                        <p className="font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="bg-white border rounded-lg p-4 h-fit">
            <h3 className="text-lg font-semibold">Send Inquiry</h3>
            <p className="text-sm text-gray-500 mt-1">
              Contact supplier for bulk pricing and order details.
            </p>

            <div className="space-y-3 mt-4">
              <button className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition">
                Request Quote
              </button>

              <button className="w-full border py-3 rounded hover:border-orange-500 hover:text-orange-500 transition">
                Contact Supplier
              </button>
            </div>

            <div className="mt-6 border-t pt-4 text-sm space-y-3">
              <div>
                <p className="text-gray-500">Supplier</p>
                <p className="font-medium">
                  {product.organizationName || "Supplier"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Supplier Type</p>
                <p className="font-medium">
                  {product.supplierType || "Verified Supplier"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">MOQ</p>
                <p className="font-medium">{product.minOrderQty} units</p>
              </div>

              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-medium">₹{product.price}/unit</p>
              </div>

              <div>
                <p className="text-gray-500">Dispatch</p>
                <p className="font-medium">
                  {product.dispatchTimeDays
                    ? `${product.dispatchTimeDays} days`
                    : "N/A"}
                </p>
              </div>
            </div>

            {Array.isArray(product.pricingTiers) &&
              product.pricingTiers.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold mb-3">Pricing Tiers</h4>

                  <div className="space-y-2">
                    {product.pricingTiers.map((tier) => (
                      <div
                        key={tier.id || `${tier.minQuantity}-${tier.price}`}
                        className="border rounded p-3 text-sm bg-gray-50"
                      >
                        <p className="text-gray-500">
                          Min Qty: {tier.minQuantity}
                        </p>
                        <p className="font-medium">₹{tier.price}</p>
                        {tier.label && (
                          <p className="text-xs text-gray-500 mt-1">
                            {tier.label}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}