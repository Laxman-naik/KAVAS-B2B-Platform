"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeCheck,
  ChevronRight,
  FileText,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import { fetchProducts, fetchSingleProduct } from "@/store/slices/productSlice";
import CustomerReviewsSection from "@/components/buyer/CustomerReviewsSection";
import SpecificationsSection from "@/components/buyer/SpecificationsSection";
import ProductDetailsSection from "@/components/buyer/ProductDetailsSection";
import ShippingDeliverySection from "@/components/buyer/ShippingDeliverySection";

const C = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
  muted: "rgba(26,26,26,0.6)",
  dimmed: "rgba(26,26,26,0.35)",
};

const fmt = (v) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(n)
    : "₹0.00";
};

const clamp = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

const str = (...vals) => {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
};

const initials = (name) => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "S";
  return `${parts[0][0]}${parts.length > 1 ? parts.at(-1)[0] : ""}`.toUpperCase();
};

const discount = (mrp, price) =>
  mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

const normalizeMedia = (product) => {
  const seen = new Map();

  const add = (src, type = "image") => {
    if (!src) return;
    const s = String(src).trim();
    if (!s) return;

    const key = `${type}:${s}`;
    if (!seen.has(key)) seen.set(key, { src: s, type });
  };

  (product?.images || []).forEach((item) => {
    if (typeof item === "string") {
      add(item, "image");
    } else {
      add(item.image_url || item.url || item.src, item.media_type || "image");
    }
  });

  (product?.videos || []).forEach((item) => {
    if (typeof item === "string") {
      add(item, "video");
    } else {
      add(item.video_url || item.image_url || item.url || item.src, "video");
    }
  });

  add(product?.image_url, "image");
  add(product?.thumbnail, "image");
  add(product?.mainImage, "image");

  const items = Array.from(seen.values());

  return items.length ? items : [{ src: "/placeholder.png", type: "image" }];
};

const Stars = ({ rating, size = 14 }) => {
  const n = clamp(Math.round(Number(rating) || 0), 0, 5);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          color={i < n ? C.gold : C.border}
          fill={i < n ? C.gold : "transparent"}
        />
      ))}
    </div>
  );
};

const Badge = ({ children, variant = "outline" }) => {
  const styles = {
    solid: { background: C.primary, color: C.white },
    soft: { background: C.cream, color: C.primary },
    gold: { background: C.gold, color: C.white },
    outline: { border: `1px solid ${C.border}`, color: C.text },
  };

  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold"
      style={styles[variant]}
    >
      {children}
    </span>
  );
};

const TrustBadge = ({ Icon, label }) => (
  <div
    className="flex items-center gap-2 rounded-sm border px-3 py-2"
    style={{ borderColor: C.border, background: C.cream }}
  >
    <Icon className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
    <span className="text-xs font-semibold" style={{ color: C.text }}>
      {label}
    </span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-3 p-5">
    {[40, 72, 28, 80, 56].map((w, i) => (
      <div
        key={i}
        className="h-5 animate-pulse rounded"
        style={{ width: `${w}%`, background: C.border }}
      />
    ))}
  </div>
);

const useNormalizedProduct = (product) =>
  useMemo(() => {
    const categories = Array.isArray(product?.categories)
      ? product.categories
      : [];

    const variants = Array.isArray(product?.variants) ? product.variants : [];

    return {
      id: product?.id || product?._id,
      title: str(product?.name, product?.title, "Product"),
      description: str(product?.description, "No description available"),
      brand: str(
        product?.brand,
        product?.manufacturer,
        product?.organization_name,
        product?.vendor_name,
        "KAVAS"
      ),
      sku: str(product?.sku, "-"),
      slug: str(product?.slug, ""),
      unit: str(product?.unit, "unit"),
      gtin: str(product?.gtin, "-"),
      price: Number(product?.price || 0),
      mrp: Number(product?.mrp || 0),
      moq: Number(product?.moq || 1),
      stock: Number(product?.stock || 0),
      weight: Number(product?.weight || 0),
      dispatchTimeDays: Number(product?.dispatch_time_days || 3),
      avgRating: Number(product?.avg_rating || product?.rating || 0),
      totalReviews: Number(
        product?.total_reviews ||
          product?.reviewsCount ||
          product?.reviewCount ||
          0
      ),
      status: str(product?.status, "pending"),
      isActive: product?.is_active,
      isFeatured: product?.is_featured,
      isTopProduct: product?.is_top_product,
      viewsCount: Number(product?.views_count || 0),
      salesCount: Number(product?.sales_count || 0),
      viewsLast7Days: Number(product?.views_last_7_days || 0),
      salesLast7Days: Number(product?.sales_last_7_days || 0),
      category: str(categories?.[0]?.name, product?.category, "Home"),
      subCategory: str(categories?.[1]?.name, product?.subCategory, "-"),
      categories,
      variants,
      specifications: Array.isArray(product?.specifications)
        ? product.specifications
        : [],
      pricingTiers: Array.isArray(product?.pricingTiers)
        ? product.pricingTiers
        : Array.isArray(product?.bulkPricing)
        ? product.bulkPricing
        : [],
      reviews: Array.isArray(product?.reviews) ? product.reviews : [],
      colors:
        variants.length > 0
          ? [
              ...new Set(
                variants
                  .filter((v) =>
                    String(v.variant_type || v.type || "")
                      .toLowerCase()
                      .includes("color")
                  )
                  .map((v) => v.variant_value || v.value)
                  .filter(Boolean)
              ),
            ]
          : ["White", "Black", "Blue"],
      sizes:
        variants.length > 0
          ? [
              ...new Set(
                variants
                  .filter((v) => {
                    const type = String(v.variant_type || v.type || "").toLowerCase();
                    return type.includes("size") || type.includes("warranty");
                  })
                  .map((v) => v.variant_value || v.value)
                  .filter(Boolean)
              ),
            ]
          : ["Standard", "Premium"],
    };
  }, [product]);

const useTiers = (product, baseUnit, minQty) =>
  useMemo(() => {
    const dbTiers = Array.isArray(product?.pricingTiers)
      ? product.pricingTiers
      : [];

    const bulkPricing = Array.isArray(product?.bulkPricing)
      ? product.bulkPricing
      : [];

    const source = dbTiers.length ? dbTiers : bulkPricing;

    if (source.length) {
      return source.map((tier, index, arr) => ({
        min: Number(tier.min_quantity || tier.minQty || minQty),
        max:
          Number(tier.max_quantity || tier.maxQty) ||
          (index < arr.length - 1
            ? Number(arr[index + 1].min_quantity || arr[index + 1].minQty) - 1
            : Infinity),
        price: Number(tier.price || tier.pricePerUnit || baseUnit),
        label: tier.label || "",
      }));
    }

    return [
      { min: minQty, max: 99, price: baseUnit },
      { min: 100, max: 499, price: baseUnit * 0.97 },
      { min: 500, max: 999, price: baseUnit * 0.94 },
      { min: 1000, max: Infinity, price: baseUnit * 0.9 },
    ];
  }, [product, baseUnit, minQty]);

const useSimilar = (products, currentId) =>
  useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    return list
      .filter((item) => (item?.id || item?._id) !== currentId)
      .slice(0, 4)
      .map((item) => {
        const price = Number(item?.price || 0);
        const mrp = Number(item?.mrp || 0);

        return {
          id: item?.id || item?._id,
          title: str(item?.name, item?.title, "Product"),
          brand: str(item?.brand, item?.organization_name, "KAVAS"),
          price,
          off: discount(mrp, price),
          minQty: Number(item?.moq || 1),
          img: normalizeMedia(item)[0]?.src || "/placeholder.png",
          rating: Number(item?.avg_rating || item?.rating || 0),
          reviewCount: Number(item?.total_reviews || item?.reviewCount || 0),
        };
      });
  }, [products, currentId]);

export default function ProductView() {
  const params = useParams() || {};
  const id = params.id || params.Id;

  const dispatch = useDispatch();
  const { product, products, loading } = useSelector((state) => state.products);

  const p = product || {};
  const norm = useNormalizedProduct(p);
  const mediaItems = useMemo(
  () => normalizeMedia(p),
  [p?.id, p?.updated_at]
);
  const tiers = useTiers(p, norm.price, norm.moq);
  const similar = useSimilar(products, norm.id);

  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);
  const [qty, setQty] = useState(norm.moq);
  const [selectedColor, setSelectedColor] = useState(norm.colors[0]);
  const [selectedSize, setSelectedSize] = useState(norm.sizes[0]);
  const [wishlisted, setWishlisted] = useState(false);

  const thumbsRef = useRef(null);

  useEffect(() => {
    if (id) dispatch(fetchSingleProduct(id));
    dispatch(fetchProducts());
  }, [dispatch, id]);

useEffect(() => {
  if (!selectedMedia?.src && mediaItems.length) {
    setSelectedMedia(mediaItems[0]);
  }
}, [mediaItems, selectedMedia]);

 useEffect(() => {
  setQty((prev) => prev || norm.moq);

  if (!selectedColor && norm.colors.length) {
    setSelectedColor(norm.colors[0]);
  }

  if (!selectedSize && norm.sizes.length) {
    setSelectedSize(norm.sizes[0]);
  }
}, [norm.moq, norm.colors, norm.sizes, selectedColor, selectedSize]);

  const activeTier = useMemo(
    () => tiers.find((tier) => qty >= tier.min && qty <= tier.max) || tiers[0],
    [qty, tiers]
  );

  const activeVariant = useMemo(() => {
    if (!Array.isArray(norm.variants)) return null;

    return (
      norm.variants.find((v) => {
        const value = v.variant_value || v.value;
        return value === selectedColor || value === selectedSize;
      }) || null
    );
  }, [norm.variants, selectedColor, selectedSize]);

  const unitPrice = Number(activeVariant?.price || activeTier?.price || norm.price);
  const finalMrp = Number(activeVariant?.mrp || norm.mrp);
  const finalStock = Number(activeVariant?.stock ?? norm.stock);
  const finalSku = activeVariant?.sku || norm.sku;
  const discountPct = discount(finalMrp, unitPrice);
  const bulkSavings = Math.max(0, (tiers[0]?.price - unitPrice) * qty);

  const supplierName =
    p?.vendor?.business_name ||
    p?.supplier?.name ||
    p?.organization?.name ||
    p?.organization_name ||
    p?.vendor_name ||
    norm.brand;

  const supplierRating = Number(
    p?.vendor?.rating || p?.supplier?.rating || p?.supplier_rating || 4.6
  );

  const supplierReviewCount = Number(
    p?.vendor?.reviewCount ||
      p?.supplier?.reviewCount ||
      p?.supplier_review_count ||
      norm.totalReviews ||
      1
  );

  if (!id) {
    return (
      <div className="min-h-screen" style={{ background: C.cream }}>
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div
            className="rounded-sm border p-6"
            style={{ background: C.white, borderColor: C.border }}
          >
            <p className="font-semibold" style={{ color: C.primary }}>
              Product ID is missing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ color: C.text }}>
      <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[600px_1fr]">
          <div className="grid gap-3">
            <div
              className="relative rounded-sm border"
              style={{ background: C.white, borderColor: C.border }}
            >
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => setWishlisted((value) => !value)}
                  className="rounded-full border bg-white p-2 shadow-sm"
                  style={{ borderColor: C.border }}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={wishlisted ? "#ef4444" : "none"}
                    color={wishlisted ? "#ef4444" : C.primary}
                  />
                </button>

                <button
                  type="button"
                  className="rounded-full border bg-white p-2 shadow-sm"
                  style={{ borderColor: C.border }}
                >
                  <Share2 className="h-5 w-5" style={{ color: C.primary }} />
                </button>
              </div>

              <div
                className="flex h-[500px] items-center justify-center p-4 lg:h-[600px]"
                style={{ background: C.cream }}
              >
                {selectedMedia?.type === "video" ? (
                  <video
                    src={selectedMedia.src}
                    controls
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedMedia?.src || "/placeholder.png"}
                    alt={norm.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  thumbsRef.current?.scrollBy({
                    left: -220,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow-sm"
                style={{ borderColor: C.border }}
              >
                <ChevronRight
                  className="h-4 w-4"
                  style={{ color: C.primary, transform: "rotate(180deg)" }}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  thumbsRef.current?.scrollBy({
                    left: 220,
                    behavior: "smooth",
                  })
                }
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow-sm"
                style={{ borderColor: C.border }}
              >
                <ChevronRight className="h-4 w-4" style={{ color: C.primary }} />
              </button>

              <div
                ref={thumbsRef}
                className="flex gap-3 overflow-x-auto px-10 pb-2 [-ms-overflow-style:auto] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E5E5E5]"
              >
                {mediaItems.map((item, index) => {
                  const active = selectedMedia?.src === item.src;

                  return (
                    <button
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => setSelectedMedia(item)}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border bg-white p-1"
                      style={{ borderColor: active ? C.primary : C.border }}
                    >
                      {item.type === "video" ? (
                        <div
                          className="flex h-full w-full items-center justify-center text-[10px] font-bold"
                          style={{ background: C.primary, color: C.white }}
                        >
                          VIDEO
                        </div>
                      ) : (
                        <img
                          src={item.src}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div
              className="rounded-sm border p-5"
              style={{ background: C.white, borderColor: C.border }}
            >
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      {norm.isFeatured && <Badge variant="soft">Featured</Badge>}
                      {norm.isTopProduct && <Badge variant="solid">Top Product</Badge>}
                      {norm.status && <Badge variant="outline">{norm.status}</Badge>}
                    </div>

                    <div className="flex items-center gap-2">
                      <Stars rating={norm.avgRating} />

                      <span
                        className="text-xs font-semibold"
                        style={{ color: C.muted }}
                      >
                        {norm.avgRating.toFixed(1)} ({norm.totalReviews})
                      </span>
                    </div>
                  </div>

                  <h1
                    className="mt-3 text-2xl font-bold tracking-tight"
                    style={{ color: C.text }}
                  >
                    {norm.title}
                  </h1>

                  <p className="mt-1 text-xs" style={{ color: C.muted }}>
                    {norm.description}
                  </p>

                  <div
                    className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs"
                    style={{ color: C.muted }}
                  >
                    <span>
                      Brand: <b style={{ color: C.primary }}>{norm.brand}</b>
                    </span>
                    <span>SKU: {finalSku}</span>
                    <span>Category: {norm.category}</span>
                    <span>Subcategory: {norm.subCategory}</span>
                    <span>Stock: {finalStock}</span>
                    {norm.weight > 0 && <span>Weight: {norm.weight} kg</span>}
                  </div>

                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <span
                      className="text-3xl font-extrabold"
                      style={{ color: C.primary }}
                    >
                      {fmt(unitPrice)}
                    </span>

                    <span className="pb-1 text-sm" style={{ color: C.muted }}>
                      / {norm.unit}
                    </span>

                    {finalMrp > 0 && (
                      <span
                        className="pb-1 text-sm line-through"
                        style={{ color: C.dimmed }}
                      >
                        {fmt(finalMrp)}
                      </span>
                    )}

                    {discountPct > 0 && (
                      <Badge variant="gold">{discountPct}% OFF</Badge>
                    )}
                  </div>

                  <p className="mt-1 text-xs" style={{ color: C.muted }}>
                    Prices are exclusive of GST
                  </p>

                  <div
                    className="mt-5 rounded-sm border p-3"
                    style={{ background: C.cream, borderColor: C.border }}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" style={{ color: C.gold }} />

                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.primary }}
                      >
                        Bulk Pricing
                      </span>

                      <span className="text-xs" style={{ color: C.muted }}>
                        Save more at higher quantities
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {tiers.map((tier) => {
                        const active = qty >= tier.min && qty <= tier.max;

                        return (
                          <button
                            key={`${tier.min}-${tier.max}`}
                            onClick={() => setQty(tier.min)}
                            className="rounded-sm border px-2 py-2 text-left text-xs"
                            style={{
                              borderColor: active ? C.primary : C.border,
                              background: active ? C.white : "#ffffffcc",
                              boxShadow: active
                                ? "0 4px 12px rgba(11,31,58,0.1)"
                                : "none",
                            }}
                          >
                            <p
                              className="font-semibold"
                              style={{ color: C.text }}
                            >
                              {tier.label ||
                                (tier.max === Infinity
                                  ? `${tier.min}+`
                                  : `${tier.min}–${tier.max}`)}
                            </p>

                            <p
                              className="mt-1 font-bold"
                              style={{ color: C.primary }}
                            >
                              {fmt(tier.price)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {norm.colors.length > 0 && (
                    <div className="mt-5">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: C.muted }}
                      >
                        Color
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {norm.colors.map((color) => {
                          const active = selectedColor === color;

                          const swatch =
                            color === "Black"
                              ? "#0f172a"
                              : color === "Blue"
                              ? C.primary
                              : color === "White"
                              ? C.white
                              : C.gold;

                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className="relative flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-semibold"
                              style={{
                                borderColor: active ? C.primary : C.border,
                                background: active ? C.cream : C.white,
                              }}
                            >
                              <span
                                className="h-4 w-4 rounded-sm border"
                                style={{
                                  background: swatch,
                                  borderColor: C.border,
                                }}
                              />

                              {color}

                              {active && (
                                <BadgeCheck
                                  className="absolute -right-1.5 -top-1.5 h-4 w-4"
                                  style={{
                                    fill: C.primary,
                                    color: C.white,
                                  }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {norm.sizes.length > 0 && (
                    <div className="mt-5">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: C.muted }}
                      >
                        Variant
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {norm.sizes.map((size) => {
                          const active = selectedSize === size;

                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className="rounded-sm border px-4 py-2 text-xs font-semibold"
                              style={{
                                borderColor: active ? C.primary : C.border,
                                background: active ? C.cream : C.white,
                                color: active ? C.primary : C.text,
                              }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: C.muted }}
                    >
                      Quantity ({norm.unit})
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div
                        className="flex overflow-hidden rounded-sm border"
                        style={{ borderColor: C.border }}
                      >
                        <button
                          className="w-10 py-2"
                          style={{ background: C.cream }}
                          onClick={() =>
                            setQty((value) => Math.max(norm.moq, value - 1))
                          }
                        >
                          <Minus className="mx-auto h-4 w-4" />
                        </button>

                        <input
                          value={qty}
                          onChange={(e) =>
                            setQty(
                              Math.max(
                                norm.moq,
                                Number(e.target.value) || norm.moq
                              )
                            )
                          }
                          className="w-16 border-x text-center text-sm font-semibold outline-none"
                          style={{ borderColor: C.border }}
                        />

                        <button
                          className="w-10 py-2"
                          style={{ background: C.cream }}
                          onClick={() => setQty((value) => value + 1)}
                        >
                          <Plus className="mx-auto h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-xs" style={{ color: C.primary }}>
                        {bulkSavings > 0 ? (
                          <span>
                            You save <strong>{fmt(bulkSavings)}</strong>
                          </span>
                        ) : (
                          <span>
                            MOQ:{" "}
                            <strong>
                              {norm.moq} {norm.unit}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm font-bold text-white"
                      style={{ background: C.primary }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>

                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm font-bold"
                      style={{
                        borderColor: C.primary,
                        color: C.primary,
                      }}
                    >
                      <FileText className="h-5 w-5" />
                      Request for Quote (RFQ)
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <TrustBadge Icon={FileText} label="GST Invoice" />
                    <TrustBadge Icon={ShieldCheck} label="Secure Payments" />
                    <TrustBadge Icon={RefreshCcw} label="Easy Returns" />
                    <TrustBadge Icon={Truck} label="Fast Delivery" />
                  </div>
                </>
              )}
            </div>

            <div
              className="rounded-sm border p-4"
              style={{ background: C.white, borderColor: C.border }}
            >
              <p className="text-xs" style={{ color: C.muted }}>
                Sold & Fulfilled by
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-sm font-bold text-white text-sm"
                    style={{ background: C.primary }}
                  >
                    {initials(supplierName)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{supplierName}</p>

                    <div className="mt-1 flex items-center gap-2">
                      <Stars rating={supplierRating} size={14} />

                      <span
                        className="text-xs font-semibold"
                        style={{ color: C.muted }}
                      >
                        {supplierRating.toFixed(1)} ({supplierReviewCount} ratings)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="rounded-sm border px-4 py-2 text-xs font-semibold"
                  style={{ borderColor: C.primary, color: C.primary }}
                >
                  Contact Supplier
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full space-y-5 lg:col-span-2">
            <ProductDetailsSection product={p} />

            <SpecificationsSection specifications={norm.specifications} />

            <CustomerReviewsSection reviews={norm.reviews} />

            <ShippingDeliverySection product={p} />

            <section
              className="mt-6 rounded-sm border p-5"
              style={{ background: C.white, borderColor: C.border }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Similar Products</h2>

                <Link
                  href="/"
                  className="text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  View All
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(similar.length
                  ? similar
                  : Array.from({ length: 4 }, (_, i) => null)
                ).map((item, i) =>
                  item ? (
                    <article
                      key={item.id || i}
                      className="overflow-hidden rounded-sm border"
                      style={{ background: C.white, borderColor: C.border }}
                    >
                      <div
                        className="flex h-48 items-center justify-center p-4"
                        style={{ background: C.cream }}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="p-4">
                        <p className="line-clamp-2 text-sm font-bold">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs" style={{ color: C.muted }}>
                          {item.brand}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <Stars rating={item.rating} />

                          <span
                            className="text-xs"
                            style={{ color: C.muted }}
                          >
                            {(item.rating || 0).toFixed(1)} ({item.reviewCount})
                          </span>
                        </div>

                        <div className="mt-3 flex items-end gap-2">
                          <span
                            className="text-xl font-extrabold"
                            style={{ color: C.primary }}
                          >
                            {fmt(item.price)}
                          </span>

                          <span className="text-xs" style={{ color: C.muted }}>
                            / unit
                          </span>
                        </div>

                        {item.off > 0 && (
                          <Badge variant="gold">{item.off}% OFF</Badge>
                        )}

                        <p className="mt-2 text-xs" style={{ color: C.muted }}>
                          Min. Order: {item.minQty} units
                        </p>

                        <Link
                          href={item.id ? `/product/${item.id}` : "#"}
                          className="mt-4 block w-full rounded-sm border px-4 py-2 text-center text-sm font-semibold"
                          style={{
                            borderColor: C.primary,
                            color: C.primary,
                          }}
                        >
                          View Product
                        </Link>
                      </div>
                    </article>
                  ) : (
                    <div
                      key={i}
                      className="h-80 animate-pulse rounded-sm border"
                      style={{
                        background: C.cream,
                        borderColor: C.border,
                      }}
                    />
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}