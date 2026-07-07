"use client";
 
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, LayoutGrid, LayoutList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  fetchFavourites,
} from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { productapi } from "@/lib/axios";
 
const COLORS = {
  primary: "#0B1F3A",
  accent: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
  muted: "#6B7280",
};
 
const ITEMS_PER_PAGE = 12;
 
// Filter option definitions live outside the component, same pattern used
// on Trending / New Arrivals / Flash Deals, so the checkbox labels and
// filtering rules always stay in sync.
const MOQ_OPTIONS = [
  { label: "Under 50 units", test: (qty) => qty < 50 },
  { label: "50–200 units", test: (qty) => qty >= 50 && qty <= 200 },
  { label: "200–500 units", test: (qty) => qty > 200 && qty <= 500 },
  { label: "500+ units", test: (qty) => qty > 500 },
];
 
const PRICE_OPTIONS = [
  { label: "Under ₹500", test: (price) => price < 500 },
  { label: "₹500 - ₹1000", test: (price) => price >= 500 && price <= 1000 },
  { label: "₹1000 - ₹5000", test: (price) => price > 1000 && price <= 5000 },
  { label: "₹5000+", test: (price) => price > 5000 },
];
 
const RATING_OPTIONS = [
  { value: "4.5", label: "★★★★★" },
  { value: "4", label: "★★★★" },
];
 
const Page = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    minQty: [],
    price: [],
    rating: [],
  });
 
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);
  const { products: dbProducts, loading } = useSelector(
    (state) => state.products
  );
 
  const liked = useMemo(() => {
    return (Array.isArray(favouriteItems) ? favouriteItems : [])
      .map((item) =>
        String(
          item?.productId ?? item?.product_id ?? item?.id ?? item?._id ?? item
        )
      )
      .filter(Boolean);
  }, [favouriteItems]);
 
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchFavourites());
 
    const loadCategories = async () => {
      try {
        const res = await productapi.get("/api/categories");
 
        const rawCategories = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
 
        const parentCategories = rawCategories.filter((cat) => !cat.parent_id);
        setMainCategories(parentCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
 
    loadCategories();
  }, [dispatch]);
 
  const onToggleFavourite = async (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    if (!productId) return;
 
    const isLiked = liked.includes(String(productId));
 
    try {
      if (isLiked) {
        await dispatch(removeFromFavourites(productId)).unwrap();
      } else {
        await dispatch(addToFavourites(productId)).unwrap();
      }
    } catch (error) {
      console.error("Favourite error:", error);
      alert(error || "Unable to update favourites");
    }
  };
 
  const onAddToCart = (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    if (!productId) return;
 
    dispatch(
      addToCart({
        productId,
        quantity: 1,
        variantId: product?.variantId ?? product?.variant_id,
      })
    );
  };
 
  const normalizeDbProduct = (p) => {
    if (!p) return null;
 
    const id = p._id ?? p.id ?? p.productId;
 
    const price =
      typeof p.price === "number"
        ? p.price
        : Number(p.priceValue ?? p.price ?? 0);
 
    const minQty =
      typeof p.minQty === "number"
        ? p.minQty
        : typeof p.moq === "number"
        ? p.moq
        : Number(String(p.min ?? "").match(/\d+/)?.[0] ?? 0);
 
    return {
      ...p,
      _id: id,
      id,
      productId: id,
      name: p.name ?? p.title ?? "",
      categoryName:
        p.category_name || p.categoryName || p.category || "Uncategorized",
      categorySlug: p.category_slug || p.categorySlug || "",
      priceValue: price,
      minOrderQty: minQty,
      ratingValue: Number(p.rating ?? p.ratingValue ?? 0),
      imageUrl: p.image ?? p.image_url ?? p.imageUrl ?? "/placeholder.png",
    };
  };
 
  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };
 
  const clearAllFilters = () => {
    setFilters({ minQty: [], price: [], rating: [] });
    setActiveCategory("All");
    setSortOption("Most relevant");
    setCurrentPage(1);
  };
 
  const activeFilterCount =
    filters.minQty.length + filters.price.length + filters.rating.length;
 
  const normalizedProducts = useMemo(() => {
    return (Array.isArray(dbProducts) ? dbProducts : [])
      .map(normalizeDbProduct)
      .filter(Boolean);
  }, [dbProducts]);
 
  const categories = useMemo(() => {
    return [
      { name: "All Categories", slug: "All" },
      ...mainCategories.map((cat) => ({ name: cat.name, slug: cat.slug })),
    ];
  }, [mainCategories]);
 
  const filteredProducts = useMemo(() => {
    return [...normalizedProducts]
      .filter((product) => {
        if (
          activeCategory !== "All" &&
          product.categorySlug !== activeCategory
        ) {
          return false;
        }
 
        if (filters.minQty.length > 0) {
          const qty = product.minOrderQty;
          const matchQty = MOQ_OPTIONS.some(
            (opt) => filters.minQty.includes(opt.label) && opt.test(qty)
          );
          if (!matchQty) return false;
        }
 
        if (filters.price.length > 0) {
          const price = product.priceValue;
          const matchPrice = PRICE_OPTIONS.some(
            (opt) => filters.price.includes(opt.label) && opt.test(price)
          );
          if (!matchPrice) return false;
        }
 
        if (filters.rating.length > 0) {
          const matchRating = filters.rating.some(
            (r) => product.ratingValue >= parseFloat(r)
          );
          if (!matchRating) return false;
        }
 
        return true;
      })
      .sort((a, b) => {
        if (sortOption === "Price low to high") return a.priceValue - b.priceValue;
        if (sortOption === "Price high to low") return b.priceValue - a.priceValue;
        return 0;
      });
  }, [normalizedProducts, activeCategory, filters, sortOption]);
 
  useEffect(() => {
    if (
      activeCategory !== "All" &&
      categories.length > 1 &&
      !categories.some((cat) => cat.slug === activeCategory)
    ) {
      setActiveCategory("All");
    }
  }, [categories, activeCategory]);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortOption, filters]);
 
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
 
  return (
    <div className="bg-white min-h-screen text-[#1A1A1A]" style={{ backgroundColor: COLORS.white, color: COLORS.text }}>
      <div className="max-w-350 mx-auto px-4 py-6">
        <div className="mb-5">
          <p className="text-xs text-gray-600" style={{ color: COLORS.muted }}>
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">››</span>
            <span className="text-[#0B1F3A] font-medium" style={{ color: COLORS.primary }}>
              All Products
            </span>
          </p>
        </div>
 
        <h1 className="text-3xl font-bold mt-2 text-[#0B1F3A]" style={{ color: COLORS.primary }}>
          All Products
        </h1>
 
        <p className="text-gray-500 text-sm mt-1" style={{ color: COLORS.muted }}>
          Discover our wide range of premium quality products at unbeatable wholesale prices
        </p>
      </div>
 
      <div className="bg-white py-5 rounded-sm" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-350 mx-auto px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className="whitespace-nowrap px-4 py-2 rounded-lg text-sm border transition cursor-pointer"
                style={
                  activeCategory === cat.slug
                    ? { backgroundColor: COLORS.accent, color: COLORS.primary, borderColor: COLORS.accent }
                    : { backgroundColor: COLORS.white, color: COLORS.text, borderColor: COLORS.border }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
 
        <div className="max-w-350 mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div className="md:hidden mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full border rounded-lg py-2 text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.white, color: COLORS.primary, borderColor: COLORS.border }}
            >
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="text-[11px] px-1.5 py-[1px] rounded-full"
                  style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
                >
                  {activeFilterCount}
                </span>
              )}
              <span>{showFilters ? "▲" : "▼"}</span>
            </button>
          </div>
 
          <div
            className={`${showFilters ? "block" : "hidden"} md:block bg-white rounded-2xl border p-5 h-fit sticky top-24 shadow-sm`}
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>
 
            {/* Min. Order Qty */}
            <div className="border-b pb-5 mb-5" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: COLORS.primary }}>
                Min. Order Qty
              </h3>
              {MOQ_OPTIONS.map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.minQty.includes(opt.label)}
                    onChange={() => handleFilterChange("minQty", opt.label)}
                    className="accent-[#D4AF37]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
 
            {/* Price Range */}
            <div className="border-b pb-5 mb-5" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: COLORS.primary }}>
                  Price Range
                </h3>
                {filters.price.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, price: [] }))}
                    className="text-[11px] text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              {PRICE_OPTIONS.map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.price.includes(opt.label)}
                    onChange={() => handleFilterChange("price", opt.label)}
                    className="accent-[#D4AF37]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
 
            {/* Rating */}
            <div>
              <h3 className="font-semibold text-sm mb-3" style={{ color: COLORS.primary }}>
                Rating
              </h3>
              {RATING_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex gap-2 items-center text-sm mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.rating.includes(opt.value)}
                    onChange={() => handleFilterChange("rating", opt.value)}
                    className="accent-[#D4AF37]"
                  />
                  <span className="text-yellow-500">{opt.label}</span>
                  <span>&amp; above</span>
                </label>
              ))}
            </div>
 
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer md:hidden"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
            >
              APPLY FILTERS
            </button>
          </div>
 
          <main>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm" style={{ color: COLORS.text }}>
                Showing <span className="font-semibold">{totalProducts === 0 ? 0 : startIndex + 1}</span>–
                <span className="font-semibold">{endIndex}</span> of{" "}
                <span className="font-semibold">{totalProducts}</span> Products
              </p>
 
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-lg border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.text }}
                >
                  <option>Most relevant</option>
                  <option>Price low to high</option>
                  <option>Price high to low</option>
                </select>
 
                <button
                  onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                  className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center cursor-pointer"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.primary }}
                >
                  {viewMode === "grid" ? <LayoutGrid size={16} /> : <LayoutList size={16} />}
                </button>
              </div>
            </div>
 
            {loading ? (
              <div className="py-10 text-center text-sm" style={{ color: COLORS.muted }}>
                Loading products...
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "grid grid-cols-1 gap-3"
                }
              >
                {paginatedProducts.map((product) => {
                  const isLiked = liked.includes(String(product.productId));
 
                  return (
                    <Link key={product.productId} href={`/product/${product.productId}`}>
                      <Card
                        className="rounded-xl border bg-white hover:shadow-sm transition overflow-hidden cursor-pointer"
                        style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
                      >
                        <CardContent className="p-0">
                          <div className={viewMode === "grid" ? "" : "flex gap-3 items-start"}>
                            <div
                              className={
                                viewMode === "grid" ? "relative h-40 w-full" : "relative h-24 w-24 shrink-0 m-3"
                              }
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onToggleFavourite(product);
                                }}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer z-10"
                                style={{ backgroundColor: COLORS.white }}
                              >
                                <Heart
                                  size={14}
                                  className={isLiked ? "text-red-500" : "text-gray-600"}
                                  fill={isLiked ? "currentColor" : "none"}
                                />
                              </button>
 
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
 
                            <div className={viewMode === "grid" ? "p-3" : "flex-1 py-3 pr-3"}>
                              <h3 className="text-sm font-semibold line-clamp-2" style={{ color: COLORS.accent }}>
                                {product.name}
                              </h3>
 
                              <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                                ₹{product.priceValue}/unit
                              </p>
 
                              <p className="text-[11px]" style={{ color: COLORS.muted }}>
                                Min. {product.minOrderQty} units
                              </p>
 
                              <div className="mt-3">
                                <Button
                                  className={`flex items-center gap-2 rounded-md cursor-pointer ${
                                    viewMode === "grid" ? "w-full text-sm py-2 justify-center" : "text-xs px-3 py-1.5"
                                  }`}
                                  style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onAddToCart(product);
                                  }}
                                >
                                  <ShoppingCart size={viewMode === "grid" ? 14 : 12} />
                                  Add to cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
 
            {!loading && paginatedProducts.length === 0 && (
              <div className="text-center py-12" style={{ color: COLORS.muted }}>
                No products found for the selected filters.
              </div>
            )}
 
            {totalProducts > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.primary }}
                  disabled={safePage === 1}
                >
                  ‹
                </button>
 
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-9 w-9 rounded-lg border text-sm cursor-pointer"
                      style={
                        safePage === pageNum
                          ? { backgroundColor: COLORS.primary, color: COLORS.cream, borderColor: COLORS.primary }
                          : { backgroundColor: COLORS.white, color: COLORS.primary, borderColor: COLORS.border }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
 
                {totalPages > 5 && (
                  <>
                    <span className="px-1" style={{ color: COLORS.muted }}>
                      …
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className="h-9 w-9 rounded-lg border text-sm cursor-pointer"
                      style={
                        safePage === totalPages
                          ? { backgroundColor: COLORS.primary, color: COLORS.cream, borderColor: COLORS.primary }
                          : { backgroundColor: COLORS.white, color: COLORS.primary, borderColor: COLORS.border }
                      }
                    >
                      {totalPages}
                    </button>
                  </>
                )}
 
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.primary }}
                  disabled={safePage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
 
export default Page;