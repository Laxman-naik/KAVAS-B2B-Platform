"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { suppliers } from "@/data/suppliers";
import { useState, useEffect, useMemo } from "react";
import { fetchSingleProduct } from "@/store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  BadgeCheck,
  ChevronRight,
  CreditCard,
  FileText,
  Globe2,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  XIcon,
  Zap,
} from "lucide-react";

/* ================= COLORS ================= */
const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

/* ================= HELPERS ================= */
const formatCurrency = (value) => {
  const number = Number(String(value || "").replace(/[^0-9.]/g, ""));
  if (!number) return "₹—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const toAbsoluteUrl = (url) => {
  if (!url) return "/placeholder.png";
  if (String(url).startsWith("http") || String(url).startsWith("/")) return url;
  return `${API_BASE}${String(url).startsWith("/") ? "" : "/"}${url}`;
};
const normalizeMedia = (p) => {
  const rawMedia = Array.isArray(p?.media) ? p.media : [];
  const images = Array.isArray(p?.images) ? p.images : [];
  const singleImage = p?.image_url ?? p?.image ?? p?.thumbnail ?? "";

  const media = [
    ...rawMedia.map((item) => ({
      type: item.type || "image",
      src: toAbsoluteUrl(item.src || item.url || item.path),
    })),
    ...images.map((src) => ({
      type: "image",
      src: toAbsoluteUrl(src?.url || src),
    })),
    ...(singleImage
      ? [{ type: "image", src: toAbsoluteUrl(singleImage) }]
      : []),
  ].filter((item) => item.src);

  return media.length ? media : [{ type: "image", src: "/placeholder.png" }];
};

const normalizeRelatedProduct = (p) => ({
  id: p?._id ?? p?.id,
  name: p?.title ?? p?.name ?? "Product",
  brand: p?.brand ?? p?.supplier ?? "",
  price: p?.price ?? p?.sellingPrice ?? p?.unitPrice ?? 0,
  old: p?.mrp ?? p?.compareAtPrice ?? p?.originalPrice ?? 0,
  rating: p?.rating ?? p?.averageRating ?? 4.5,
  reviews: p?.reviewsCount ?? p?.reviewCount ?? 0,
  min: p?.min ?? (p?.minQty ? `${p.minQty} Units` : "50 Units"),
  img: normalizeMedia(p)[0]?.src || "/placeholder.png",
});

const ProductView = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const favouriteItems = useSelector((state) => state.favourites?.items || []);
  const id = params?.Id ?? params?.id;
  const productId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  const {
    product: apiProduct,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [qty, setQty] = useState(100);
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [selectedColor, setSelectedColor] = useState("White");
  const [activeTab, setActiveTab] = useState("Specifications");
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    if (productId) dispatch(fetchSingleProduct(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizeProduct = (p) => {
    if (!p) return null;

    const normalizedId = p._id ?? p.id;
    const title = p.title ?? p.name ?? "";
    const price = p.price ?? "";
    const mrp = p.mrp ?? p.compareAtPrice ?? p.originalPrice ?? "3999";
    const min = p.min ?? (p.minQty ? `${p.minQty} units` : "50 units");
    const company = p.company ?? p.supplier ?? "KAWAS Audio Pvt. Ltd.";
    const brand = p.brand ?? p.supplier ?? "KAWAS Audio";
    const image = p.image_url ?? p.image ?? "";
    const media = normalizeMedia(p);

    return {
      ...p,
      id: normalizedId,
      title,
      price,
      mrp,
      min,
      company,
      brand,
      image,
      media,
      sku: p.sku || "KW-EBPM-001",
      gtin: p.gtin || "8906123456789",
      category: p.category || "Electronics",
      subCategory: p.subCategory || "Audio & Video",
      type: p.type || "In-Ear Wireless Earbuds",
      warranty: p.warranty || "1 Year Manufacturer",
      returnPolicy: p.returnPolicy || "7 Days Replacement",
      stock: p.stock || "In Stock",
      stockText: p.stockText || "500+ units",
      colors: p.colors || ["White", "Black", "Blue"],
      sizes: p.sizes || ["Standard", "Premium"],
    };
  };

  const product = normalizeProduct(apiProduct);

  const mediaItems = useMemo(() => {
    if (product?.media?.length) return product.media;
    return [{ type: "image", src: product?.image || "/placeholder.png" }];
  }, [product]);

  useEffect(() => {
    setActiveImage(product?.media?.[0] || null);
  }, [product?.id]);

  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!product?.id) return;

      setSimilarLoading(true);

      try {
        const query = new URLSearchParams({
          category: product.category || "",
          exclude: String(product.id),
          limit: "4",
        });

        const res = await fetch(
          `${API_BASE}/api/products/related?${query.toString()}`
        );

        if (!res.ok) throw new Error("Failed to fetch related products");

        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        setSimilarProducts(list.map(normalizeRelatedProduct));
      } catch (err) {
        setSimilarProducts([]);
      } finally {
        setSimilarLoading(false);
      }
    };

    loadSimilarProducts();
  }, [product?.id, product?.category]);

  const selectedMedia = activeImage || mediaItems[0];

  const reviews =
    Array.isArray(product?.reviews) && product.reviews.length
      ? product.reviews.map((r, index) => ({
          id: r._id || r.id || index,
          name: r.name || r.userName || r.user?.name || "Business Buyer",
          rating: Number(r.rating || 0),
          date: r.date || r.createdAt || "",
          title: r.title || "Verified purchase",
          comment: r.comment || r.review || r.description || "",
        }))
      : [
          {
            id: 1,
            name: "Procurement Manager",
            rating: 5,
            date: "Mar 2026",
            title: "Consistent quality and on-time delivery",
            comment:
              "Good packaging and reliable fulfillment. Batch quality was consistent for our retail stock.",
          },
          {
            id: 2,
            name: "Wholesale Buyer",
            rating: 4,
            date: "Feb 2026",
            title: "Value for bulk orders",
            comment:
              "Pricing is competitive at higher quantities. Support helped confirm specs before dispatch.",
          },
        ];

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      reviews.length
    : Number(product?.rating || product?.averageRating || 0);

  const tiers =
    Array.isArray(product?.bulkPricing) && product.bulkPricing.length
      ? product.bulkPricing.map((tier) => ({
          min: Number(tier.minQty || tier.min || 1),
          max:
            tier.maxQty || tier.max
              ? Number(tier.maxQty || tier.max)
              : Infinity,
          price: Number(tier.price || tier.unitPrice || product?.price || 0),
        }))
      : [
          { min: 50, max: 99, price: 2499 },
          { min: 100, max: 249, price: 2349 },
          { min: 250, max: 499, price: 2199 },
          { min: 500, max: Infinity, price: 1999 },
        ];

  const activeTier = tiers.find((t) => qty >= t.min && qty <= t.max) || tiers[0];
  const basePrice = Number(tiers[0]?.price || 0);
  const unitPrice = Number(activeTier?.price || product?.price || 0);
  const totalSavings = Math.max(0, (basePrice - unitPrice) * qty);

  const safeMrp = Number(product?.mrp || 0);
  const discountPercent =
    safeMrp > 0 ? Math.round(((safeMrp - unitPrice) / safeMrp) * 100) : 0;

  const isWishlisted = mounted
    ? favouriteItems.some(
        (item) => String(item._id ?? item.id) === String(product?.id)
      )
    : false;

  const normalizeName = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\b(pvt|pvt\s+ltd|ltd|limited|co|company|india)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const supplier = useMemo(() => {
    const normalizedCompany = normalizeName(product?.company);

    return suppliers.find((s) => {
      const normalizedSupplier = normalizeName(s.name);

      if (!normalizedSupplier || !normalizedCompany) return false;

      return (
        normalizedSupplier === normalizedCompany ||
        normalizedSupplier.includes(normalizedCompany) ||
        normalizedCompany.includes(normalizedSupplier)
      );
    });
  }, [product?.company]);

  const supplierInitials = (name) =>
    String(name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  const resetReviewForm = () => {
    reviewPhotos.forEach((p) => URL.revokeObjectURL(p.url));
    setReviewRating(0);
    setReviewTitle("");
    setReviewComment("");
    setReviewPhotos([]);
  };

  const handleReviewDialogChange = (open) => {
    setIsWriteReviewOpen(open);
    if (!open) resetReviewForm();
  };

  const handleAddReviewPhotos = (e) => {
    const files = Array.from(e.target.files || []);

    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(16)
        .slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setReviewPhotos((prev) => [...prev, ...next].slice(0, 6));
    e.target.value = "";
  };

  const removeReviewPhoto = (id) => {
    setReviewPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };
    const renderStars = (rating) => {
    const rounded = Math.round(rating);

    return (
      <div
        className="flex items-center gap-0.5"
        aria-label={`Rating ${rounded} out of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rounded
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const WriteReviewDialog = () => {
    const isSubmitDisabled = !reviewRating || !reviewComment.trim();

    return (
      <Dialog open={isWriteReviewOpen} onOpenChange={handleReviewDialogChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-base font-semibold">
            Write a review
          </DialogTitle>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                Rating
              </p>

              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          value <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.border,
              }}
            />

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review here..."
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.border,
              }}
            />

            <div>
              <label
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
                style={{
                  borderColor: COLORS.border,
                  background: COLORS.white,
                }}
              >
                + Upload photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddReviewPhotos}
                  className="hidden"
                />
              </label>

              {reviewPhotos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {reviewPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="relative overflow-hidden rounded-lg border"
                      style={{
                        background: COLORS.cream,
                        borderColor: COLORS.border,
                      }}
                    >
                      <img
                        src={p.url}
                        alt="Review upload"
                        className="h-24 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeReviewPhoto(p.id)}
                        className="absolute right-1 top-1 rounded-md bg-white p-1 shadow"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(false)}
                className="w-1/2 rounded-lg border px-4 py-2 text-sm font-semibold"
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.text,
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitDisabled}
                onClick={() => setIsWriteReviewOpen(false)}
                className="w-1/2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{
                  background: isSubmitDisabled ? "#cccccc" : COLORS.primary,
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const MoreInfoDrawer = () => (
    <Dialog open={isMoreInfoOpen} onOpenChange={setIsMoreInfoOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-0! right-0! left-auto! translate-x-0! translate-y-0! h-dvh w-full sm:max-w-md rounded-none sm:rounded-l-xl p-0"
      >
        <DialogTitle className="sr-only">Easy Exchange & Return</DialogTitle>

        <div className="flex h-dvh flex-col" style={{ background: COLORS.white }}>
          <div
            className="border-b px-4 py-3 flex items-center justify-between"
            style={{ borderColor: COLORS.border }}
          >
            <button
              onClick={() => setIsMoreInfoOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="text-center">
              <h2 className="text-lg font-bold" style={{ color: COLORS.text }}>
                Easy Exchange & Return
              </h2>
              <p className="text-xs tracking-widest text-gray-500">
                HOW IT WORKS?
              </p>
            </div>

            <div className="h-10 w-10" />
          </div>

          <div className="flex-1 overflow-auto px-5 py-6 space-y-6">
            {[
              [
                "Go to Menu > My Orders > Exchange",
                "Select the time slot for exchange",
                PackageCheck,
              ],
              [
                "Delivery agent will deliver the new product",
                "And pick up the old one",
                Truck,
              ],
              [
                "Refund will be processed in 7–14 days",
                "After the quality check",
                CreditCard,
              ],
            ].map(([title, description, Icon], index) => (
              <div key={title} className="flex gap-4">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: COLORS.primary }}
                >
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                </div>

                <Icon className="h-5 w-5" style={{ color: COLORS.primary }} />
              </div>
            ))}

            <p
              className="border-t pt-4 text-sm text-gray-600"
              style={{ borderColor: COLORS.border }}
            >
              The product should not be damaged and original packaging should be
              intact. T&C applicable.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!productId) {
    return <div className="p-10 text-center">Product Not Found</div>;
  }

  if (loading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  if (error && !product) {
    return <div className="p-10 text-center">Failed to load product.</div>;
  }

  if (!product) {
    return <div className="p-10 text-center">Product Not Found</div>;
  }

  const specs =
    product.specifications && typeof product.specifications === "object"
      ? Object.entries(product.specifications)
      : [
          ["Bluetooth Version", product.bluetoothVersion || "5.3"],
          ["Battery Life", product.batteryLife || "24 Hours (with case)"],
          ["Charging Time", product.chargingTime || "1.5 Hours"],
          ["Water Resistance", product.waterResistance || "IPX4"],
          ["Type", product.type],
          ["Color Options", product.colors.join(", ")],
          [
            "Package Contents",
            product.packageContents ||
              "Earbuds, Charging Case, USB-C Cable, User Manual",
          ],
          ["Warranty", product.warranty],
        ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: COLORS.cream,
        color: COLORS.text,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link href="/" style={{ color: COLORS.primary }}>
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{product.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span>{product.subCategory}</span>
          <ChevronRight className="h-3 w-3" />
          <span style={{ color: COLORS.text }}>{product.title}</span>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.85fr_0.48fr]">
          <section className="grid gap-3 sm:grid-cols-[76px_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
              {mediaItems.slice(0, 5).map((item, idx) => {
                const isActive = selectedMedia?.src === item.src;

                return (
                  <button
                    key={`${item.src}-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(item)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white p-1 transition"
                    style={{
                      borderColor: isActive ? COLORS.primary : COLORS.border,
                      boxShadow: isActive
                        ? `0 0 0 1px ${COLORS.primary}`
                        : "none",
                    }}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src || "/placeholder.png"}
                        alt="Product thumbnail"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-black text-xs text-white">
                        ▶
                      </span>
                    )}
                  </button>
                );
              })}

              {mediaItems.length > 5 && (
                <div
                  className="h-20 w-20 rounded-lg border bg-white text-center text-sm font-semibold flex items-center justify-center"
                  style={{ borderColor: COLORS.border }}
                >
                  +{mediaItems.length - 5}
                  <br />
                  More
                </div>
              )}
            </div>

            <div
              className="relative order-1 rounded-xl border p-4 sm:order-2"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <button
                type="button"
                // onClick={() => dispatch(toggleFavourite(product))}
                className="absolute right-4 top-4 z-10 rounded-full border bg-white p-2 shadow-sm hover:bg-gray-50"
                style={{ borderColor: COLORS.border }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                  style={!isWishlisted ? { color: COLORS.primary } : undefined}
                />
              </button>

              <div
                className="flex h-[100px] items-center justify-center rounded-lg lg:h-[420px]"
                style={{ background: COLORS.cream }}
              >
                {selectedMedia?.type === "image" ? (
                  <img
                    src={selectedMedia?.src || "/placeholder.png"}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia?.src}
                    controls
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            </div>
          </section>

          <section
            className="rounded-xl border p-5"
            style={{
              background: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <span
              className="inline-flex rounded px-2 py-1 text-xs font-semibold"
              style={{
                background: COLORS.cream,
                color: COLORS.primary,
              }}
            >
              Best Seller
            </span>

            <h1
              className="mt-3 text-2xl font-bold tracking-tight"
              style={{ color: COLORS.text }}
            >
              {product.title}
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
              <span>
                Brand: <b style={{ color: COLORS.primary }}>{product.brand}</b>
              </span>
              <span>SKU: {product.sku}</span>
              <span>GTIN: {product.gtin}</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-sm font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <button
                onClick={() => setIsWriteReviewOpen(true)}
                className="text-sm text-gray-500"
              >
                ({reviews.length * 64} Reviews)
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p
                className="text-3xl font-extrabold"
                style={{ color: COLORS.primary }}
              >
                {formatCurrency(unitPrice)}
              </p>

              <span className="pb-1 text-sm text-gray-700">/ unit</span>

              <span className="pb-1 text-sm text-gray-400 line-through">
                {formatCurrency(product.mrp)}
              </span>

              <span
                className="mb-1 rounded px-2 py-1 text-xs font-bold text-white"
                style={{ background: COLORS.gold }}
              >
                {discountPercent}% OFF
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Prices are exclusive of GST
            </p>

            <div
              className="mt-5 rounded-lg border p-3"
              style={{
                background: COLORS.cream,
                borderColor: COLORS.border,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4" style={{ color: COLORS.gold }} />
                  <span
                    className="font-semibold"
                    style={{ color: COLORS.primary }}
                  >
                    Bulk Pricing
                  </span>
                  <span className="text-gray-500">
                    Save more on higher quantities
                  </span>
                </div>

                <button
                  className="text-xs font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  View Pricing Table
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {tiers.map((tier) => {
                  const active = qty >= tier.min && qty <= tier.max;

                  return (
                    <button
                      key={tier.min}
                      onClick={() => setQty(tier.min)}
                      className="rounded-lg border px-2 py-2 text-left text-xs"
                      style={{
                        borderColor: active ? COLORS.primary : COLORS.border,
                        background: active ? COLORS.white : "#ffffffcc",
                        boxShadow: active
                          ? "0 6px 16px rgba(11,31,58,0.12)"
                          : "none",
                      }}
                    >
                      <p className="font-semibold" style={{ color: COLORS.text }}>
                        {tier.max === Infinity
                          ? `${tier.min}+`
                          : `${tier.min}-${tier.max}`}
                      </p>

                      <p
                        className="mt-1 font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrency(tier.price)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-gray-700">
              {[
                ["Active Noise Cancellation", ShieldCheck],
                ["24 Hours Battery Life", PackageCheck],
                ["Touch Control", Zap],
                ["Fast Charging Support", RefreshCcw],
                ["Sweat & Water Resistant (IPX4)", ShieldCheck],
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="h-4 w-4" style={{ color: COLORS.primary }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div
              className="mt-6 grid grid-cols-3 gap-3 border-t pt-5 text-xs"
              style={{ borderColor: COLORS.border }}
            >
              <div>
                <p className="font-semibold">Warranty</p>
                <p className="mt-1 text-gray-500">{product.warranty}</p>
              </div>

              <div>
                <p className="font-semibold">Return Policy</p>
                <p className="mt-1 text-gray-500">{product.returnPolicy}</p>
              </div>

              <div>
                <p className="font-semibold">Availability</p>
                <p className="mt-1 text-green-600">
                  {product.stock}
                  <br />
                  <span className="text-gray-500">({product.stockText})</span>
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div
              className="rounded-xl border p-5"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <p className="text-sm font-semibold">Select Size</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="rounded-lg border px-3 py-3 text-sm font-medium"
                    style={{
                      borderColor:
                        selectedSize === size ? COLORS.primary : COLORS.border,
                      background:
                        selectedSize === size ? COLORS.cream : COLORS.white,
                      color:
                        selectedSize === size ? COLORS.primary : COLORS.text,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-sm font-semibold">Select Color</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="relative rounded-lg border p-3 text-xs font-medium"
                    style={{
                      borderColor:
                        selectedColor === color
                          ? COLORS.primary
                          : COLORS.border,
                      background:
                        selectedColor === color ? COLORS.cream : COLORS.white,
                    }}
                  >
                    <span
                      className="mx-auto mb-2 block h-5 w-5 rounded"
                      style={{
                        background:
                          color === "Black"
                            ? "#0f172a"
                            : color === "Blue"
                            ? COLORS.primary
                            : COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    />

                    {selectedColor === color && (
                      <BadgeCheck
                        className="absolute right-1 top-1 h-4 w-4"
                        style={{
                          fill: COLORS.primary,
                          color: COLORS.white,
                        }}
                      />
                    )}

                    {color}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-sm font-semibold">
                Select Quantity (Units)
              </p>

              <div
                className="mt-3 flex overflow-hidden rounded-lg border"
                style={{ borderColor: COLORS.border }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 hover:bg-gray-100"
                  style={{ background: COLORS.cream }}
                >
                  <Minus className="mx-auto h-4 w-4" />
                </button>

                <input
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full border-x text-center text-sm font-semibold outline-none"
                  style={{ borderColor: COLORS.border }}
                />

                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 hover:bg-gray-100"
                  style={{ background: COLORS.cream }}
                >
                  <Plus className="mx-auto h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 text-sm text-green-600">
                You save {formatCurrency(totalSavings)} (
                {basePrice > 0
                  ? Math.round(((basePrice - unitPrice) / basePrice) * 100)
                  : 0}
                %)
              </p>

              <button
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-sm"
                style={{ background: COLORS.gold }}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <button
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold"
                style={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  background: COLORS.white,
                }}
              >
                <FileText className="h-5 w-5" />
                Request for Quote (RFQ)
              </button>

              <button
                className="mt-4 flex w-full items-center justify-between rounded-lg p-4 text-left"
                style={{ background: COLORS.cream }}
              >
                <span>
                  <b className="block text-sm">Need bigger quantities?</b>
                  <span className="text-xs text-gray-500">
                    Submit RFQ and our sales team will contact you.
                  </span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <p className="text-xs text-gray-500">Sold & Fulfilled by</p>

              <div className="mt-2 flex items-center gap-2">
                <p className="font-bold">{product.company}</p>
                <BadgeCheck
                  className="h-4 w-4"
                  style={{
                    fill: COLORS.primary,
                    color: COLORS.white,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm">
                {renderStars(4.6)}
                <span className="font-semibold">4.6</span>
                <span className="text-gray-500">2,350 Business Ratings</span>
              </div>

              {supplier ? (
                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="mt-4 block rounded-lg border px-4 py-2 text-center text-sm font-semibold"
                  style={{
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                  }}
                >
                  Contact Supplier
                </Link>
              ) : (
                <button
                  className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-semibold"
                  style={{
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                  }}
                >
                  Contact Supplier
                </button>
              )}

              <div className="mt-5 space-y-4 text-sm">
                {[
                  ["GST Invoice Available", "Get GST invoice for all orders", FileText],
                  ["Bulk Discounts", "Best prices for bulk purchases", Star],
                  [
                    "Priority Support",
                    "Dedicated support for business customers",
                    ShieldCheck,
                  ],
                  ["Worldwide Shipping", "Ship to 50+ countries", Globe2],
                ].map(([title, text, Icon]) => (
                  <div key={title} className="flex gap-3">
                    <Icon className="h-5 w-5" style={{ color: COLORS.primary }} />
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-xs text-gray-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.48fr]">
          <section
            className="rounded-xl border"
            style={{
              background: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <div
              className="flex overflow-x-auto border-b"
              style={{ borderColor: COLORS.border }}
            >
              {[
                "Specifications",
                "Product Details",
                "Reviews",
                "Shipping & Delivery",
                "Return Policy",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="whitespace-nowrap px-5 py-4 text-sm font-semibold"
                  style={{
                    color: activeTab === tab ? COLORS.primary : COLORS.text,
                    borderBottom:
                      activeTab === tab
                        ? `2px solid ${COLORS.primary}`
                        : "2px solid transparent",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "Specifications" && (
                <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
                  {specs.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-2 border-b py-3 text-sm"
                      style={{ borderColor: COLORS.border }}
                    >
                      <span className="font-semibold text-gray-700">
                        {label}
                      </span>
                      <span className="text-gray-600">{value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Product Details" && (
                <div className="text-sm leading-6 text-gray-700">
                  <p>
                    {product.description ||
                      `Experience premium sound quality with advanced noise cancellation, deep bass, and crystal clear calls. Designed for comfort and long-lasting performance.`}
                  </p>

                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    <li>Advanced Active Noise Cancellation</li>
                    <li>Bluetooth 5.3 Connectivity</li>
                    <li>Touch Control & Voice Assistant</li>
                    <li>Water & Sweat Resistant (IPX4)</li>
                    <li>Includes Charging Case</li>
                  </ul>
                </div>
              )}

              {activeTab === "Reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderStars(averageRating)}
                      <b>{averageRating.toFixed(1)}</b>
                      <span className="text-sm text-gray-500">
                        ({reviews.length})
                      </span>
                    </div>

                    <button
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="rounded-lg border px-3 py-2 text-sm font-semibold"
                      style={{ borderColor: COLORS.border }}
                    >
                      Write a review
                    </button>
                  </div>

                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border p-4"
                      style={{
                        background: COLORS.cream,
                        borderColor: COLORS.border,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <b>{review.name}</b>
                        <span className="text-xs text-gray-500">
                          {review.date}
                        </span>
                      </div>

                      <div className="mt-1">{renderStars(review.rating)}</div>

                      <p className="mt-2 font-semibold">{review.title}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Shipping & Delivery" && (
                <p className="text-sm text-gray-700">
                  Free delivery on eligible prepaid orders. Bulk orders are
                  shipped through verified logistics partners.
                </p>
              )}

              {activeTab === "Return Policy" && (
                <button
                  onClick={() => setIsMoreInfoOpen(true)}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: COLORS.primary }}
                >
                  View easy return and exchange policy
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div
              className="rounded-xl border p-5"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-lg font-bold text-white"
                  style={{ background: COLORS.primary }}
                >
                  {supplierInitials(supplier?.name || product.company)}
                </div>

                <div>
                  <p className="font-semibold">{product.company}</p>
                  <p className="text-xs text-gray-500">
                    {supplier
                      ? `${supplier.location} • ${supplier.category}`
                      : "Verified supplier"}
                  </p>
                </div>
              </div>

              <button
                className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-semibold"
                style={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                }}
              >
                View Profile →
              </button>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                background: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <p className="font-semibold">Secure Payments</p>
              <p className="mt-1 text-xs text-gray-500">
                100% secure payments via Visa, Mastercard, UPI and Net Banking
              </p>
            </div>
          </aside>
        </div>

        <section
          className="mt-6 rounded-xl border p-5"
          style={{
            background: COLORS.white,
            borderColor: COLORS.border,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Similar Products</h2>

            <div className="flex items-center gap-2">
              <button
                className="text-sm font-semibold hover:underline"
                style={{ color: COLORS.primary }}
              >
                View All
              </button>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50"
                aria-label="Previous products"
                style={{ borderColor: COLORS.border }}
              >
                ‹
              </button>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50"
                aria-label="Next products"
                style={{ borderColor: COLORS.border }}
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-xl border"
                  style={{
                    background: COLORS.cream,
                    borderColor: COLORS.border,
                  }}
                />
              ))}

            {!similarLoading &&
              (similarProducts.length
                ? similarProducts
                : [
                    {
                      name: "Wireless Earbuds Air Plus",
                      price: 1999,
                      old: 2999,
                      rating: 4.5,
                      reviews: 98,
                      min: "50 Units",
                      img:
                        mediaItems[0]?.src ||
                        product.image ||
                        "/placeholder.png",
                    },
                    {
                      name: "Wireless Earbuds Pro",
                      price: 2799,
                      old: 4199,
                      rating: 4.4,
                      reviews: 86,
                      min: "50 Units",
                      img:
                        mediaItems[1]?.src ||
                        mediaItems[0]?.src ||
                        product.image ||
                        "/placeholder.png",
                    },
                    {
                      name: "Wireless Earbuds Max",
                      price: 3299,
                      old: 4999,
                      rating: 4.6,
                      reviews: 112,
                      min: "50 Units",
                      img:
                        mediaItems[2]?.src ||
                        mediaItems[0]?.src ||
                        product.image ||
                        "/placeholder.png",
                    },
                    {
                      name: "Wireless Neckband Pro",
                      price: 1499,
                      old: 2299,
                      rating: 4.3,
                      reviews: 75,
                      min: "50 Units",
                      img:
                        mediaItems[3]?.src ||
                        mediaItems[0]?.src ||
                        product.image ||
                        "/placeholder.png",
                    },
                  ]).map((item) => (
                <article
                  key={item.name}
                  className="overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: COLORS.white,
                    borderColor: COLORS.border,
                  }}
                >
                  <div
                    className="flex h-56 items-center justify-center p-4"
                    style={{ background: COLORS.cream }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 text-sm font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {product.brand}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      {renderStars(item.rating)}
                      <span className="text-xs text-gray-500">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>

                    <div className="mt-3 flex items-end gap-2">
                      <span
                        className="text-xl font-extrabold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrency(item.price)}
                      </span>

                      <span className="text-xs text-gray-500">/ unit</span>

                      <span className="text-xs text-gray-400 line-through">
                        {formatCurrency(item.old)}
                      </span>
                    </div>

                    <span className="mt-2 inline-flex rounded px-2 py-1 text-xs font-semibold text-white" style={{ background: COLORS.gold }}>
                      {item.old > 0
                        ? Math.round(((item.old - item.price) / item.old) * 100)
                        : 0}
                      % OFF
                    </span>

                    <p className="mt-2 text-xs text-gray-500">
                      Min. Order: {item.min}
                    </p>

                    <button
                      className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-semibold"
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.primary,
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>

      <MoreInfoDrawer />
      <WriteReviewDialog />
    </div>
  );
};

export default ProductView;