"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeCheck, ChevronRight, ClipboardList, FileText, Heart,
  MessageSquareText, Minus, Plus, RefreshCcw, Share2, ShieldCheck,
  ShoppingCart, Star, Truck, Zap,
} from "lucide-react";
import { fetchSingleProduct } from "@/store/slices/productSlice";
import CustomerReviewsSection from "@/components/buyer/CustomerReviewsSection";
import SpecificationsSection from "@/components/buyer/SpecificationsSection";
import ProductDetailsSection from "@/components/buyer/ProductDetailsSection";
import ShippingDeliverySection from "@/components/buyer/ShippingDeliverySection";

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Utilities ────────────────────────────────────────────────────────────────

const fmt = (v) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)
    : "₹0.00";
};

const clamp = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

const str = (...vals) => {
  for (const v of vals) if (typeof v === "string" && v.trim()) return v.trim();
  return "";
};

const initials = (name) => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "S";
  return `${parts[0][0]}${parts.length > 1 ? parts.at(-1)[0] : ""}`.toUpperCase();
};

const discount = (mrp, price) =>
  mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

// ─── Media normalizer ─────────────────────────────────────────────────────────

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
    if (typeof m === "string") { add(m); return; }
    add(m?.url ?? m?.src ?? m?.imageUrl ?? m?.image_url);
  });

  add(p?.thumbnail);
  add(p?.image);
  add(p?.mainImage);
  if (p?.video ?? p?.videoUrl) add(p.video ?? p.videoUrl, "video");

  const items = Array.from(seen.values());
  return items.length ? items : [{ src: "/placeholder.png", type: "image" }];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Stars = ({ rating, size = 4 }) => {
  const n = clamp(Math.round(Number(rating) || 0), 0, 5);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
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
    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold" style={styles[variant]}>
      {children}
    </span>
  );
};

const TrustBadge = ({ Icon, label }) => (
  <div className="flex items-center gap-2 rounded-sm border px-3 py-2" style={{ borderColor: C.border, background: C.cream }}>
    <Icon className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
    <span className="text-xs font-semibold" style={{ color: C.text }}>{label}</span>
  </div>
);

const InfoCard = ({ title, text }) => (
  <div className="rounded-sm border p-4" style={{ borderColor: C.border, background: C.cream }}>
    <p className="text-xs font-bold" style={{ color: C.primary }}>{title}</p>
    <p className="mt-1 text-xs" style={{ color: C.muted }}>{text}</p>
  </div>
);

const SectionHeader = ({ Icon, title, linkTo, linkLabel }) => (
  <div className="grid gap-4 sm:grid-cols-[44px_1fr]">
    <div className="flex h-10 w-10 items-center justify-center rounded-sm" style={{ background: C.cream }}>
      <Icon className="h-5 w-5" style={{ color: C.primary }} />
    </div>
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-bold" style={{ color: C.text }}>{title}</p>
      <Link href={linkTo} className="text-xs font-semibold" style={{ color: C.primary }}>{linkLabel}</Link>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-3 p-5">
    {[40, 72, 28, 80, 56].map((w, i) => (
      <div key={i} className="h-5 animate-pulse rounded" style={{ width: `${w}%`, background: C.border }} />
    ))}
  </div>
);

const ErrorState = ({ message }) => (
  <div className="rounded-sm border p-5" style={{ borderColor: C.border, background: C.cream }}>
    <p className="font-semibold" style={{ color: C.primary }}>Failed to load product</p>
    <p className="mt-1 text-sm" style={{ color: C.muted }}>{String(message)}</p>
  </div>
);

// ─── Data hooks / memos ───────────────────────────────────────────────────────

const useNormalized = (p) =>
  useMemo(() => ({
    title: str(p?.title, p?.name, p?.productName, "Product"),
    brand: str(p?.brand, p?.company, p?.manufacturer, "KAVAS"),
    sku: str(p?.sku, p?.SKU, p?.code, "-"),
    gtin: str(p?.gtin, p?.GTIN, "-"),
    category: str(p?.category, p?.mainCategory, "Home"),
    subCategory: str(p?.subCategory, p?.sub_category, "-"),
    rating: Number(p?.rating ?? p?.averageRating ?? 0),
    reviewCount: Number(p?.reviewsCount ?? p?.reviewCount) || (Array.isArray(p?.reviews) ? p.reviews.length : 0),
    mrp: Number(p?.mrp ?? p?.compareAtPrice ?? p?.originalPrice ?? 0),
    baseUnit: Number(p?.price ?? p?.sellingPrice ?? p?.unitPrice ?? 0),
    minQty: Number(p?.minQty ?? p?.minimumOrderQty ?? p?.moq ?? 1) || 1,
    stock: str(p?.stock, p?.availability, "In Stock"),
    sizes: (Array.isArray(p?.sizes) && p.sizes.length) ? p.sizes : ["Standard", "Premium"],
    colors: (Array.isArray(p?.colors) && p.colors.length) ? p.colors : ["White", "Black", "Blue"],
    warranty: str(p?.warranty, "1 Year Manufacturer"),
    returnPolicy: str(p?.returnPolicy, "7 Days Replacement"),
    supplier: p?.supplier ?? p?.vendor ?? null,
    description: str(p?.shortDescription, p?.description, p?.about, "Designed for everyday use with reliable performance, bulk-friendly pricing, and support for business buying."),
    highlights: (Array.isArray(p?.highlights ?? p?.features) ? (p.highlights ?? p.features) : [])
      .map((x) => (typeof x === "string" ? x : str(x?.text, x?.title, ""))).filter(Boolean).slice(0, 5),
    specs: (() => {
      const raw = p?.specifications ?? p?.specs ?? p?.attributes ?? null;
      if (raw && typeof raw === "object" && !Array.isArray(raw))
        return Object.entries(raw).map(([k, v]) => ({ label: k, value: String(v) })).filter(x => x.label && x.value).slice(0, 10);
      if (Array.isArray(raw))
        return raw.map(x => ({ label: str(x?.label, x?.name), value: str(x?.value, x?.val) })).filter(x => x.label && x.value).slice(0, 10);
      return [
        { label: "Driver Size", value: "40mm Dynamic Driver" },
        { label: "Frequency Response", value: "20Hz – 20kHz" },
        { label: "Connectivity", value: "Bluetooth 5.3, AUX" },
        { label: "Battery Life", value: "Up to 30 Hours" },
        { label: "Charging", value: "USB Type-C" },
      ];
    })(),
    reviews: (() => {
      const list = Array.isArray(p?.reviews) ? p.reviews : [];
      const mapped = list.map((r, i) => ({
        id: r?._id ?? r?.id ?? String(i),
        name: str(r?.name, r?.userName, r?.user?.name, "Verified Buyer"),
        rating: Number(r?.rating ?? 0),
        comment: str(r?.comment, r?.review, r?.text),
        timeAgo: str(r?.timeAgo, r?.date, r?.createdAt),
      })).filter(x => x.comment).slice(0, 2);
      return mapped.length ? mapped : [
        { id: "r1", name: "Rohit Verma", rating: 5, comment: "Excellent build quality and comfort. ANC works perfectly.", timeAgo: "2 days ago" },
        { id: "r2", name: "Neha Sharma", rating: 4, comment: "Battery backup is amazing. Great product for office use.", timeAgo: "5 days ago" },
      ];
    })(),
  }), [p]);

const useTiers = (pricingTiers, baseUnit, minQty) =>
  useMemo(() => {
    if (Array.isArray(pricingTiers) && pricingTiers.length > 0) {
      return pricingTiers.map((tier) => ({
        min: Number(tier.min_quantity || minQty),
        max: Number(tier.max_quantity) || Infinity,
        price: Number(tier.price || baseUnit),
        label: tier.label,
      }));
    }

    return [{ min: minQty, max: Infinity, price: baseUnit }];
  }, [pricingTiers, baseUnit, minQty]);

const useSimilar = (products, currentId, currentProduct) =>
  useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list
      .filter(x => (x?._id ?? x?.id) !== currentId)
      .slice(0, 4)
      .map(x => {
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
          reviewCount: Number(x?.reviewsCount ?? x?.reviewCount) || (Array.isArray(x?.reviews) ? x.reviews.length : 0),
        };
      });
  }, [products, currentId]);

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductView() {
  const { Id: paramId, id: paramIdLower } = useParams() ?? {};
  const id = paramId ?? paramIdLower;
  const dispatch = useDispatch();
  const { product, loading, error, products } = useSelector((s) => s.products);
  console.log("PRODUCT FROM BACKEND:", product);

  useEffect(() => { if (id) dispatch(fetchSingleProduct(id)); }, [dispatch, id]);

  const p = product ?? {};
  const norm = useNormalized(p);
  const mediaItems = useMemo(() => normalizeMedia(p), [product]);
  const tiers = useTiers(product?.pricingTiers, norm.baseUnit, norm.minQty);
  const similar = useSimilar(products, p?._id ?? p?.id);
  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);
  const [qty, setQty] = useState(norm.minQty);
  const [selectedSize, setSelectedSize] = useState(norm.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(norm.colors[0]);
  const [wishlisted, setWishlisted] = useState(false);

  const thumbsRef = useRef(null);

  useEffect(() => setSelectedMedia(mediaItems[0]), [mediaItems]);
  useEffect(() => {
    setQty(norm.minQty);
    setSelectedSize(norm.sizes[0]);
    setSelectedColor(norm.colors[0]);
  }, [norm.minQty, norm.sizes, norm.colors]);

  const activeTier = useMemo(
    () => tiers.find((t) => qty >= t.min && qty <= t.max) ?? tiers[0],
    [qty, tiers]
  );
  const unitPrice = activeTier?.price ?? norm.baseUnit;
  const discountPct = discount(norm.mrp, unitPrice);
  const bulkSavings = Math.max(0, (tiers[0].price - unitPrice) * qty);

  if (!id) return (
    <div className="min-h-screen" style={{ background: C.cream }}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-sm border p-6" style={{ background: C.white, borderColor: C.border }}>
          <p className="font-semibold" style={{ color: C.primary }}>Product ID is missing.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ color: C.text }}>
      <div className="w-full px-4 py-5 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        {/* <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs" style={{ color: C.muted }}>
          {[
            { label: "Home", href: "/" },
            { label: norm.category },
            { label: norm.subCategory },
            { label: norm.title, active: true },
          ].map((crumb, i, arr) => (
            <span key={i} className="flex items-center gap-1.5">
              {crumb.href
                ? <Link href={crumb.href} style={{ color: C.primary }}>{crumb.label}</Link>
                : <span style={crumb.active ? { color: C.text } : {}}>{crumb.label}</span>}
              {i < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
            </span>
          ))}
        </nav> */}

        {/* Main grid */}
        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">

          {/* ── Media column ── */}
          <div className="grid gap-3">

            {/* Main image */}
            <div className="relative rounded-sm border" style={{ background: C.white, borderColor: C.border }}>
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => setWishlisted(v => !v)}
                  className="rounded-full border bg-white p-2 shadow-sm"
                  style={{ borderColor: C.border }}
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5" fill={wishlisted ? "#ef4444" : "none"} color={wishlisted ? "#ef4444" : C.primary} />
                </button>
                <button type="button" className="rounded-full border bg-white p-2 shadow-sm" style={{ borderColor: C.border }} aria-label="Share">
                  <Share2 className="h-5 w-5" style={{ color: C.primary }} />
                </button>
              </div>

              <div className="flex h-[320px] items-center justify-center p-4 lg:h-[460px]" style={{ background: C.cream }}>
                {selectedMedia?.type === "video"
                  ? <video src={selectedMedia.src} controls className="h-full w-full object-contain" />
                  : <img src={selectedMedia?.src ?? "/placeholder.png"} alt={norm.title} className="h-full w-full object-contain" />}
              </div>

            </div>

            {/* Thumbnails */}
            <div className="relative">
              <button
                type="button"
                onClick={() => thumbsRef.current?.scrollBy({ left: -220, behavior: "smooth" })}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow-sm"
                style={{ borderColor: C.border }}
                aria-label="Scroll thumbnails left"
              >
                <ChevronRight className="h-4 w-4" style={{ color: C.primary, transform: "rotate(180deg)" }} />
              </button>

              <button
                type="button"
                onClick={() => thumbsRef.current?.scrollBy({ left: 220, behavior: "smooth" })}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow-sm"
                style={{ borderColor: C.border }}
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="h-4 w-4" style={{ color: C.primary }} />
              </button>

              <div
                ref={thumbsRef}
                className="flex gap-3 overflow-x-auto px-10 pb-2 [-ms-overflow-style:auto] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E5E5E5]"
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
                        {item.type === "image"
                          ? <img src={item.src} alt="" className="h-full w-full object-contain" />
                          : <div className="flex h-full w-full items-center justify-center text-[10px] font-bold" style={{ background: C.primary, color: C.white }}>VIDEO</div>}
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

          {/* ── Info column ── */}
          <div className="space-y-5">
            <div className="rounded-sm border p-5" style={{ background: C.white, borderColor: C.border }}>
              {loading ? <LoadingSkeleton /> : error ? <ErrorState message={error} /> : (
                <>
                  {/* Badges + rating */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Badge variant="soft">Best Seller</Badge>
                      <Badge variant="solid">New Launch</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars rating={norm.rating} />
                      <Link href="/customerreviews" className="text-xs font-semibold" style={{ color: C.muted }}>
                        {(norm.rating || 0).toFixed(1)} ({norm.reviewCount})
                      </Link>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="mt-3 text-2xl font-bold tracking-tight" style={{ color: C.text }}>{norm.title}</h1>
                  <p className="mt-1 text-xs" style={{ color: C.muted }}>
                    {norm.description}
                  </p>
                  {/* Meta */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: C.muted }}>
                    <span>Brand: <b style={{ color: C.primary }}>{norm.brand}</b></span>
                    <span>SKU: {norm.sku}</span>
                    <span>GTIN: {norm.gtin}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <span className="text-3xl font-extrabold" style={{ color: C.primary }}>{fmt(unitPrice)}</span>
                    <span className="pb-1 text-sm" style={{ color: C.muted }}>/ unit</span>
                    {norm.mrp > 0 && <span className="pb-1 text-sm line-through" style={{ color: C.dimmed }}>{fmt(norm.mrp)}</span>}
                    {discountPct > 0 && <Badge variant="gold">{discountPct}% OFF</Badge>}
                  </div>
                  <p className="mt-1 text-xs" style={{ color: C.muted }}>Prices are exclusive of GST</p>

                  {/* Bulk pricing tiers */}
                  <div className="mt-5 rounded-sm border p-3" style={{ background: C.cream, borderColor: C.border }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" style={{ color: C.gold }} />
                        <span className="text-sm font-semibold" style={{ color: C.primary }}>Bulk Pricing</span>
                        <span className="text-xs" style={{ color: C.muted }}>Save more at higher quantities</span>
                      </div>
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
                              boxShadow: active ? "0 4px 12px rgba(11,31,58,0.1)" : "none",
                            }}
                          >
                            <p className="font-semibold" style={{ color: C.text }}>
                              {tier.max === Infinity ? `${tier.min}+` : `${tier.min}–${tier.max}`}
                            </p>
                            <p className="mt-1 font-bold" style={{ color: C.primary }}>{fmt(tier.price)}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selectors + CTA */}
                  <div className="mt-5 space-y-5">
                    {/* Color */}
                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>Color</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {norm.colors.map((color) => {
                          const active = selectedColor === color;
                          const swatch = color === "Black" ? "#0f172a" : color === "Blue" ? C.primary : C.white;
                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className="relative flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-semibold"
                              style={{ borderColor: active ? C.primary : C.border, background: active ? C.cream : C.white }}
                            >
                              <span className="h-4 w-4 rounded-sm border" style={{ background: swatch, borderColor: C.border }} />
                              {color}
                              {active && <BadgeCheck className="absolute -right-1.5 -top-1.5 h-4 w-4" style={{ fill: C.primary, color: C.white }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Warranty */}
                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>Warranty</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {norm.sizes.map((size) => {
                          const active = selectedSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className="rounded-sm border px-4 py-2 text-xs font-semibold"
                              style={{ borderColor: active ? C.primary : C.border, background: active ? C.cream : C.white, color: active ? C.primary : C.text }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.muted }}>Quantity (Units)</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex overflow-hidden rounded-sm border" style={{ borderColor: C.border }}>
                          <button
                            className="w-10 py-2"
                            style={{ background: C.cream }}
                            onClick={() => setQty(q => Math.max(norm.minQty, q - 1))}
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
                            className="w-10 py-2"
                            style={{ background: C.cream }}
                            onClick={() => setQty(q => q + 1)}
                          >
                            <Plus className="mx-auto h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs" style={{ color: C.primary }}>
                          {bulkSavings > 0
                            ? <span>You save <strong>{fmt(bulkSavings)}</strong></span>
                            : <span>MOQ: <strong>{norm.minQty} units</strong></span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button className="flex w-full items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm font-bold text-white" style={{ background: C.primary }}>
                        <ShoppingCart className="h-5 w-5" /> Add to Cart
                      </button>
                      <button className="flex w-full items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm font-bold" style={{ borderColor: C.primary, color: C.primary }}>
                        <FileText className="h-5 w-5" /> Request for Quote (RFQ)
                      </button>
                      <p className="text-center text-xs" style={{ color: C.muted }}>Submit RFQ for larger quantities — our team will respond promptly.</p>
                    </div>
                  </div>

                  {/* Trust badges */}
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
                <p className="text-xs" style={{ color: C.muted }}>Sold & Fulfilled by</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm font-bold text-white text-sm" style={{ background: C.primary }}>
                      {initials(norm.supplier?.name ?? norm.brand)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{norm.supplier?.name ?? norm.brand}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars rating={4.6} size={14} />
                        <span className="text-xs font-semibold" style={{ color: C.muted }}>4.6 ({Math.max(1, norm.reviewCount)} ratings)</span>
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
          <SpecificationsSection specifications={product?.specifications} />
          <CustomerReviewsSection product={product} />
          <ShippingDeliverySection product={product} />

          {/* Similar Products */}
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
                  <article key={item.id ?? i} className="overflow-hidden rounded-sm border" style={{ background: C.white, borderColor: C.border }}>
                    <div className="flex h-48 items-center justify-center p-4" style={{ background: C.cream }}>
                      <img src={item.img} alt={item.title} className="h-full w-full object-contain" />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-bold">{item.title}</p>
                      <p className="mt-1 text-xs" style={{ color: C.muted }}>{item.brand}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Stars rating={item.rating} />
                        <span className="text-xs" style={{ color: C.muted }}>
                          {(item.rating || 0).toFixed(1)} ({item.reviewCount})
                        </span>
                      </div>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-xl font-extrabold" style={{ color: C.primary }}>{fmt(item.price)}</span>
                        <span className="text-xs" style={{ color: C.muted }}>/ unit</span>
                      </div>
                      {item.off > 0 && <Badge variant="gold">{item.off}% OFF</Badge>}
                      <p className="mt-2 text-xs" style={{ color: C.muted }}>Min. Order: {item.minQty} units</p>
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
                  <div key={i} className="h-80 animate-pulse rounded-sm border" style={{ background: C.cream, borderColor: C.border }} />
                )
              )}
            </div>
          </section>

        </div>

      </div>
    </div>
  );

}
