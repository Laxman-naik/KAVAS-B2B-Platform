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

const normalizeMedia = (p) => {
  const seen = new Map();

  const add = (src, type = "image") => {
    if (!src) return;
    const s = String(src).trim();
    if (!s) return;

    const key = `${type}:${s}`;
    if (!seen.has(key)) seen.set(key, { src: s, type });
  };

  (p?.media ?? p?.mediaItems ?? p?.images ?? p?.productImages ?? []).forEach((m) => {
    if (typeof m === "string") {
      add(m);
      return;
    }
    add(m?.url ?? m?.src ?? m?.imageUrl ?? m?.image_url);
  });

  add(p?.thumbnail);
  add(p?.image);
  add(p?.mainImage);

  if (p?.video ?? p?.videoUrl) add(p.video ?? p.videoUrl, "video");

  const items = Array.from(seen.values());
  return items.length ? items : [{ src: "/placeholder.png", type: "image" }];
};

const Stars = ({ rating, size = 16 }) => {
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

const ErrorState = ({ message }) => (
  <div className="rounded-sm border p-5" style={{ borderColor: C.border, background: C.cream }}>
    <p className="font-semibold" style={{ color: C.primary }}>Failed to load product</p>
    <p className="mt-1 text-sm" style={{ color: C.muted }}>{String(message)}</p>
  </div>
);

const useNormalized = (p) =>
  useMemo(
    () => ({
      title: str(p?.title, p?.name, p?.productName, "Product"),
      brand: str(p?.brand, p?.company, p?.manufacturer, "KAVAS"),
      sku: str(p?.sku, p?.SKU, p?.code, "-"),
      gtin: str(p?.gtin, p?.GTIN, "-"),
      category: str(p?.category, p?.mainCategory, "Home"),
      subCategory: str(p?.subCategory, p?.sub_category, "-"),
      rating: Number(p?.rating ?? p?.averageRating ?? p?.avgRating ?? 0),
      reviewCount:
        Number(p?.reviewsCount ?? p?.reviewCount ?? p?.totalReviews) ||
        (Array.isArray(p?.reviews) ? p.reviews.length : 0),
      mrp: Number(p?.mrp ?? p?.compareAtPrice ?? p?.originalPrice ?? 0),
      baseUnit: Number(p?.price ?? p?.sellingPrice ?? p?.unitPrice ?? 0),
      unit: str(p?.unit, p?.unitType, "unit"),
      minQty: Number(p?.minQty ?? p?.minimumOrderQty ?? p?.moq ?? 1) || 1,
      stock: str(p?.stock, p?.availability, "In Stock"),
      sizes:
        Array.isArray(p?.sizes) && p.sizes.length
          ? p.sizes
          : ["Standard", "Premium"],
      colors:
        Array.isArray(p?.colors) && p.colors.length
          ? p.colors
          : ["White", "Black", "Blue"],
      warranty: str(p?.warranty, "1 Year Manufacturer"),
      returnPolicy: str(p?.returnPolicy, "7 Days Replacement"),
      supplier: p?.supplier ?? p?.vendor ?? null,
      description: str(
        p?.shortDescription,
        p?.description,
        p?.about,
        "Designed for everyday use with reliable performance, bulk-friendly pricing, and support for business buying."
      ),
      specifications: p?.specifications ?? p?.specs ?? p?.attributes ?? [],
      reviews: Array.isArray(p?.reviews) ? p.reviews : [],
      isFeatured: Boolean(p?.isFeatured),
      isTopProduct: Boolean(p?.isTopProduct),
      status: str(p?.status),
    }),
    [p]
  );

const useTiers = (pricingTiers, baseUnit, minQty) =>
  useMemo(() => {
    if (Array.isArray(pricingTiers) && pricingTiers.length > 0) {
      return pricingTiers.map((tier) => ({
        min: Number(tier.min_quantity ?? tier.min ?? minQty),
        max: Number(tier.max_quantity ?? tier.max) || Infinity,
        price: Number(tier.price ?? baseUnit),
        label: tier.label,
      }));
    }

    return [{ min: minQty, max: Infinity, price: baseUnit }];
  }, [pricingTiers, baseUnit, minQty]);

const useSimilar = (products, currentId) =>
  useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    return list
      .filter((item) => String(item?.id || item?._id) !== String(currentId))
      .slice(0, 4)
      .map((x) => {
        const price = Number(x?.price ?? x?.sellingPrice ?? x?.unitPrice ?? 0);
        const mrp = Number(x?.mrp ?? x?.compareAtPrice ?? x?.originalPrice ?? 0);

        return {
          id: x?._id ?? x?.id,
          title: str(x?.title, x?.name, "Product"),
          brand: str(x?.brand, x?.company, "KAVAS"),
          price,
          off: discount(mrp, price),
          minQty: Number(x?.minQty ?? x?.moq ?? 1) || 1,
          img: normalizeMedia(x)[0]?.src ?? "/placeholder.png",
          rating: Number(x?.rating ?? x?.averageRating ?? 0),
          reviewCount:
            Number(x?.reviewsCount ?? x?.reviewCount) ||
            (Array.isArray(x?.reviews) ? x.reviews.length : 0),
        };
      });
  }, [products, currentId]);

export default function ProductView() {
  const params = useParams() || {};
  const id = params.id || params.Id;

  const dispatch = useDispatch();
  const { product, loading, error, products } = useSelector((s) => s.products);
  useEffect(() => { if (id) dispatch(fetchSingleProduct(id)); }, [dispatch, id]);
  const p = product ?? {};
  const norm = useNormalized(p);

  const mediaItems = useMemo(() => normalizeMedia(p), [p]);
  const tiers = useTiers(product?.pricingTiers, norm.baseUnit, norm.minQty);
  const similar = useSimilar(products, p?._id ?? p?.id);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [qty, setQty] = useState(norm.minQty);
  const [selectedSize, setSelectedSize] = useState(norm.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(norm.colors[0]);
  const [wishlisted, setWishlisted] = useState(false);

  const thumbsRef = useRef(null);

  useEffect(() => {
    if (id) dispatch(fetchSingleProduct(id));
    dispatch(fetchProducts());
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedMedia(mediaItems[0]);
  }, [mediaItems]);

  useEffect(() => {
    setQty((prev) => prev || norm.minQty);

    if (!selectedSize && norm.sizes.length) {
      setSelectedSize(norm.sizes[0]);
    }

    if (!selectedColor && norm.colors.length) {
      setSelectedColor(norm.colors[0]);
    }
  }, [norm.minQty, norm.sizes, norm.colors, selectedSize, selectedColor]);

  const activeTier = useMemo(
    () => tiers.find((tier) => qty >= tier.min && qty <= tier.max) || tiers[0],
    [qty, tiers]
  );

  const unitPrice = activeTier?.price ?? norm.baseUnit;
  const discountPct = discount(norm.mrp, unitPrice);
  const bulkSavings = Math.max(0, ((tiers[0]?.price ?? unitPrice) - unitPrice) * qty);

  if (!id) {
    return (
      <div className="min-h-screen" style={{ background: C.cream }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-sm border p-6" style={{ background: C.white, borderColor: C.border }}>
            <p className="font-semibold" style={{ color: C.primary }}>Product ID is missing.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-5" style={{ background: C.cream }}>
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ color: C.text }}>
      <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-3">
            <div className="relative rounded-sm border" style={{ background: C.white, borderColor: C.border }}>
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

              <div className="flex h-[320px] items-center justify-center p-4 lg:h-[460px]" style={{ background: C.cream }}>
                {selectedMedia?.type === "video" ? (
                  <video src={selectedMedia.src} controls className="h-full w-full object-contain" />
                ) : (
                  <img
                    src={selectedMedia?.src ?? "/placeholder.png"}
                    alt={norm.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => thumbsRef.current?.scrollBy({ left: -220, behavior: "smooth" })}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow-sm"
                style={{ borderColor: C.border }}
              >
                <ChevronRight className="h-4 w-4 rotate-180" style={{ color: C.primary }} />
              </button>

              <button
                type="button"
                onClick={() => thumbsRef.current?.scrollBy({ left: 220, behavior: "smooth" })}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow-sm"
                style={{ borderColor: C.border }}
              >
                <ChevronRight className="h-4 w-4" style={{ color: C.primary }} />
              </button>

              <div
                ref={thumbsRef}
                className="flex gap-3 overflow-x-auto px-10 pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E5E5E5]"
              >
                {mediaItems.slice(0, 6).map((item, i) => {
                  const extra = Math.max(0, mediaItems.length - 6);
                  const isLast = i === 5 && extra > 0;
                  const active = selectedMedia?.src === item.src;

                  return (
                    <button
                      key={`${item.src}-${i}`}
                      type="button"
                      onClick={() => setSelectedMedia(item)}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border bg-white p-1"
                      style={{ borderColor: active ? C.primary : C.border }}
                    >
                      <div className="relative h-full w-full">
                        {item.type === "image" ? (
                          <img src={item.src} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold" style={{ background: C.primary, color: C.white }}>
                            VIDEO
                          </div>
                        )}

                        {isLast && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ background: "rgba(11,31,58,0.65)", color: C.white }}>
                            +{extra}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-sm border p-5" style={{ background: C.white, borderColor: C.border }}>
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
                      <Stars rating={norm.rating} />
                      <span className="text-xs font-semibold" style={{ color: C.muted }}>
                        {norm.rating.toFixed(1)} ({norm.reviewCount})
                      </span>
                    </div>
                  </div>

                  <h1 className="mt-3 text-2xl font-bold tracking-tight" style={{ color: C.text }}>
                    {norm.title}
                  </h1>

                  <p className="mt-1 text-xs" style={{ color: C.muted }}>
                    {norm.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: C.muted }}>
                    <span>
                      Brand: <b style={{ color: C.primary }}>{norm.brand}</b>
                    </span>
                    <span>SKU: {norm.sku}</span>
                    <span>GTIN: {norm.gtin}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <span className="text-3xl font-extrabold" style={{ color: C.primary }}>
                      {fmt(unitPrice)}
                    </span>

                    <span className="pb-1 text-sm" style={{ color: C.muted }}>
                      / {norm.unit}
                    </span>

                    {norm.mrp > 0 && (
                      <span className="pb-1 text-sm line-through" style={{ color: C.dimmed }}>
                        {fmt(norm.mrp)}
                      </span>
                    )}

                    {discountPct > 0 && <Badge variant="gold">{discountPct}% OFF</Badge>}
                  </div>

                  <p className="mt-1 text-xs" style={{ color: C.muted }}>
                    Prices are exclusive of GST
                  </p>

                  <div className="mt-5 rounded-sm border p-3" style={{ background: C.cream, borderColor: C.border }}>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" style={{ color: C.gold }} />
                      <span className="text-sm font-semibold" style={{ color: C.primary }}>
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
                            type="button"
                            onClick={() => setQty(tier.min)}
                            className="rounded-sm border px-2 py-2 text-left text-xs"
                            style={{
                              borderColor: active ? C.primary : C.border,
                              background: active ? C.white : "#ffffffcc",
                              boxShadow: active ? "0 4px 12px rgba(11,31,58,0.1)" : "none",
                            }}
                          >
                            <p className="font-semibold" style={{ color: C.text }}>
                              {tier.label || (tier.max === Infinity ? `${tier.min}+` : `${tier.min}–${tier.max}`)}
                            </p>

                            <p className="mt-1 font-bold" style={{ color: C.primary }}>
                              {fmt(tier.price)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>
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
                              type="button"
                              onClick={() => setSelectedColor(color)}
                              className="relative flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-semibold"
                              style={{
                                borderColor: active ? C.primary : C.border,
                                background: active ? C.cream : C.white,
                              }}
                            >
                              <span className="h-4 w-4 rounded-sm border" style={{ background: swatch, borderColor: C.border }} />
                              {color}

                              {active && (
                                <BadgeCheck
                                  className="absolute -right-1.5 -top-1.5 h-4 w-4"
                                  style={{ fill: C.primary, color: C.white }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>
                        Warranty
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {norm.sizes.map((size) => {
                          const active = selectedSize === size;

                          return (
                            <button
                              key={size}
                              type="button"
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

                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>
                        Quantity ({norm.unit}s)
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex overflow-hidden rounded-sm border" style={{ borderColor: C.border }}>
                          <button
                            type="button"
                            className="w-10 py-2"
                            style={{ background: C.cream }}
                            onClick={() => setQty((q) => Math.max(norm.minQty, q - 1))}
                          >
                            <Minus className="mx-auto h-4 w-4" />
                          </button>

                          <input
                            value={qty}
                            onChange={(e) => setQty(Math.max(norm.minQty, Number(e.target.value) || norm.minQty))}
                            className="w-16 border-x text-center text-sm font-semibold outline-none"
                            style={{ borderColor: C.border }}
                          />

                          <button
                            type="button"
                            className="w-10 py-2"
                            style={{ background: C.cream }}
                            onClick={() => setQty((q) => q + 1)}
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
                              MOQ: <strong>{norm.minQty} units</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button className="flex w-full items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm font-bold text-white" style={{ background: C.primary }}>
                        <ShoppingCart className="h-5 w-5" /> Add to Cart
                      </button>

                      <button className="flex w-full items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm font-bold" style={{ borderColor: C.primary, color: C.primary }}>
                        <FileText className="h-5 w-5" /> Request for Quote (RFQ)
                      </button>

                      <p className="text-center text-xs" style={{ color: C.muted }}>
                        Submit RFQ for larger quantities — our team will respond promptly.
                      </p>
                    </div>
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

            {!loading && !error && (
              <div className="rounded-sm border p-4" style={{ background: C.white, borderColor: C.border }}>
                <p className="text-xs" style={{ color: C.muted }}>
                  Sold & Fulfilled by
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm text-sm font-bold text-white" style={{ background: C.primary }}>
                      {initials(norm.supplier?.name ?? norm.brand)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {norm.supplier?.name ?? norm.brand}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Stars rating={4.6} size={14} />
                        <span className="text-xs font-semibold" style={{ color: C.muted }}>
                          4.6 ({Math.max(1, norm.reviewCount)} ratings)
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="rounded-sm border px-4 py-2 text-xs font-semibold" style={{ borderColor: C.primary, color: C.primary }}>
                    Contact Supplier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <ProductDetailsSection product={product} />
          <SpecificationsSection specifications={norm.specifications} />
          <CustomerReviewsSection product={product} reviews={norm.reviews} />
          <ShippingDeliverySection product={product} />

          <section className="mt-6 rounded-sm border p-5" style={{ background: C.white, borderColor: C.border }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Similar Products</h2>

              <Link href="/" className="text-sm font-semibold" style={{ color: C.primary }}>
                View All
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(similar.length ? similar : Array.from({ length: 4 }, (_, i) => null)).map((item, i) =>
                item ? (
                  <article
                    key={item.id || i}
                    className="overflow-hidden rounded-sm border"
                    style={{ background: C.white, borderColor: C.border }}
                  >
                    <div className="flex h-48 items-center justify-center p-4" style={{ background: C.cream }}>
                      <img src={item.img} alt={item.title} className="h-full w-full object-contain" />
                    </div>

                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-bold">{item.title}</p>

                      <p className="mt-1 text-xs" style={{ color: C.muted }}>
                        {item.brand}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <Stars rating={item.rating} size={14} />

                        <span className="text-xs" style={{ color: C.muted }}>
                          {(item.rating || 0).toFixed(1)} ({item.reviewCount})
                        </span>
                      </div>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-xl font-extrabold" style={{ color: C.primary }}>
                          {fmt(item.price)}
                        </span>

                        <span className="text-xs" style={{ color: C.muted }}>
                          / unit
                        </span>
                      </div>

                      {item.off > 0 && <Badge variant="gold">{item.off}% OFF</Badge>}

                      <p className="mt-2 text-xs" style={{ color: C.muted }}>
                        Min. Order: {item.minQty} units
                      </p>

                      <Link
                        href={item.id ? `/product/${item.id}` : "#"}
                        className="mt-4 block w-full rounded-sm border px-4 py-2 text-center text-sm font-semibold"
                        style={{ borderColor: C.primary, color: C.primary }}
                      >
                        View Product
                      </Link>
                    </div>
                  </article>
                ) : (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-sm border"
                    style={{ background: C.cream, borderColor: C.border }}
                  />
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}