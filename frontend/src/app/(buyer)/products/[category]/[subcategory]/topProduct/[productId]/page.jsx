"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slugLabel = (value = "") =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const COLORS = {
  primary: "#0B1F3A",
  accent: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

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
      setLoading(true);

      try {
        const resolved = await params;
        const { category, subcategory, product, id } = resolved;

        setRoute({ category, subcategory, product, id });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/listing/${id}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        setProduct({
          ...data,
          imageUrl: data.image_url || data.imageUrl || "/placeholder.png",
          minOrderQty: data.moq ?? data.minOrderQty ?? 0,
          supplierType: data.supplierType || data.supplier_type || "",
          organizationName: data.organizationName || data.organization_name || "",
          dispatchTimeDays: data.dispatchTimeDays || data.dispatch_time_days,
          pricingTiers: data.pricingTiers || data.pricing_tiers || [],
          specifications: data.specifications || [],
        });
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
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold">Product not found</h2>
          <Link
            href={`/products/${route.category}/${route.subcategory}/${route.product}`}
            className="inline-block mt-3 hover:underline"
            style={{ color: COLORS.accent }}
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream, color: COLORS.text }}>
      <div
        className="px-4 sm:px-6 py-3 bg-white border-b text-sm flex flex-wrap gap-2"
        style={{ borderColor: COLORS.border }}
      >
        <Link href={`/products/${route.category}`}>{slugLabel(route.category)}</Link>
        <span>/</span>
        <Link href={`/products/${route.category}/${route.subcategory}`}>
          {slugLabel(route.subcategory)}
        </Link>
        <span>/</span>
        <Link href={`/products/${route.category}/${route.subcategory}/${route.product}`}>
          {slugLabel(route.product)}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 sm:h-80 md:h-[420px] object-cover rounded"
            />

            <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
            <p className="text-2xl mt-2 font-semibold" style={{ color: COLORS.accent }}>
              ₹{product.price}/unit
            </p>
            <p className="mt-1 text-sm" style={{ color: "#666" }}>
              Min Qty: {product.minOrderQty}
            </p>
            <p className="mt-1 text-sm" style={{ color: "#666" }}>
              {product.supplierType || product.organizationName}
            </p>

            {product.description && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Description
                </h2>
                <p className="text-sm leading-6" style={{ color: "#555" }}>
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                Product Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ["Category", slugLabel(route.category)],
                  ["Subcategory", slugLabel(route.subcategory)],
                  ["Supplier Type", product.supplierType || "Supplier"],
                  ["Minimum Order", `${product.minOrderQty} units`],
                  ["Price", `₹${product.price}/unit`],
                  ["Stock", product.stock ?? "Available"],
                  [
                    "Dispatch Time",
                    product.dispatchTimeDays ? `${product.dispatchTimeDays} days` : "N/A",
                  ],
                  ["Unit", product.unit || "Piece"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border rounded p-3"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                  >
                    <p style={{ color: "#666" }}>{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.id || `${spec.key}-${spec.value}`}
                      className="border rounded p-3"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                    >
                      <p style={{ color: "#666" }}>{spec.key}</p>
                      <p className="font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border rounded-lg p-4 h-fit" style={{ borderColor: COLORS.border }}>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
              Send Inquiry
            </h3>
            <p className="text-sm mt-1" style={{ color: "#666" }}>
              Contact supplier for bulk pricing and order details.
            </p>

            <div className="space-y-3 mt-4">
              <button
                className="w-full py-3 rounded transition"
                style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
              >
                Request Quote
              </button>

              <button
                className="w-full border py-3 rounded transition"
                style={{ borderColor: COLORS.border, color: COLORS.primary }}
              >
                Contact Supplier
              </button>
            </div>

            <div className="mt-6 border-t pt-4 text-sm space-y-3" style={{ borderColor: COLORS.border }}>
              <div>
                <p style={{ color: "#666" }}>Supplier</p>
                <p className="font-medium">{product.organizationName || "Supplier"}</p>
              </div>

              <div>
                <p style={{ color: "#666" }}>Supplier Type</p>
                <p className="font-medium">{product.supplierType || "Verified Supplier"}</p>
              </div>

              <div>
                <p style={{ color: "#666" }}>MOQ</p>
                <p className="font-medium">{product.minOrderQty} units</p>
              </div>

              <div>
                <p style={{ color: "#666" }}>Price</p>
                <p className="font-medium">₹{product.price}/unit</p>
              </div>

              <div>
                <p style={{ color: "#666" }}>Dispatch</p>
                <p className="font-medium">
                  {product.dispatchTimeDays ? `${product.dispatchTimeDays} days` : "N/A"}
                </p>
              </div>
            </div>

            {Array.isArray(product.pricingTiers) && product.pricingTiers.length > 0 && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Pricing Tiers
                </h4>

                <div className="space-y-2">
                  {product.pricingTiers.map((tier) => (
                    <div
                      key={tier.id || `${tier.minQuantity}-${tier.price}`}
                      className="border rounded p-3 text-sm"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                    >
                      <p style={{ color: "#666" }}>Min Qty: {tier.minQuantity}</p>
                      <p className="font-medium">₹{tier.price}</p>
                      {tier.label && <p className="text-xs mt-1" style={{ color: "#666" }}>{tier.label}</p>}
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