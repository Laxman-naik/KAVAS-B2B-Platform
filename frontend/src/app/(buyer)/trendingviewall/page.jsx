"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  LayoutGrid,
  LayoutList,
  Heart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchTrendingProducts } from "@/store/slices/productSlice";
import {
  addToFavourites,
  removeFromFavourites,
} from "@/store/slices/favouritesSlice";
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

const TrendingViewAllV1 = () => {
  const dispatch = useDispatch();
  const { trending } = useSelector((state) => state.products);
  const favouriteItems = useSelector((state) => state.favourites.items);

  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("Most relevant");
  const [currentPage, setCurrentPage] = useState(1);

  const [priceRange, setPriceRange] = useState(50000);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const ITEMS_PER_PAGE = 12;

  const liked = favouriteItems.map((item) => item.id || item._id);

  useEffect(() => {
    dispatch(fetchTrendingProducts());

    const loadCategories = async () => {
      try {
        const res = await productapi.get("/api/categories");

        const rawCategories = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const parentCategories = rawCategories.filter(
          (cat) => cat.parent_id == null || cat.parentId == null
        );

        setMainCategories(parentCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, [dispatch]);

  const categories = useMemo(() => {
    return [
      { name: "All Categories", slug: "All" },
      ...mainCategories.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
      })),
    ];
  }, [mainCategories]);

  const normalizedProducts = useMemo(() => {
    const products = Array.isArray(trending) ? trending : [];

    return products.map((product) => ({
      ...product,
      productId: product?._id ?? product?.id,
      imageUrl: product.image_url || product.imageUrl || "/placeholder.png",
      priceValue: Number(product.price ?? product.priceValue ?? 0),
      minOrderQty: Number(product.moq ?? product.minOrderQty ?? 1),
      categorySlug: product.category_slug || product.categorySlug || "",
      ratingValue: Number(product.rating ?? 0),
      brandName:
        product.brand ||
        product.brand_name ||
        product.brandName ||
        "Unknown Brand",
    }));
  }, [trending]);

  const availableBrands = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(
        normalizedProducts
          .map((product) => product.brandName)
          .filter((brand) => brand && brand.trim() !== "")
      )
    );

    return uniqueBrands.filter((brand) =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [normalizedProducts, brandSearch]);

  const filteredProducts = useMemo(() => {
    let data = [...normalizedProducts];

    if (activeCategory !== "All") {
      data = data.filter((product) => product.categorySlug === activeCategory);
    }

    data = data.filter((product) => product.priceValue <= priceRange);

    if (selectedRatings.length > 0) {
      data = data.filter((product) =>
        selectedRatings.some((rating) => product.ratingValue >= rating)
      );
    }

    if (selectedBrands.length > 0) {
      data = data.filter((product) =>
        selectedBrands.includes(product.brandName)
      );
    }

    if (sortOption === "Price low to high") {
      data.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortOption === "Price high to low") {
      data.sort((a, b) => b.priceValue - a.priceValue);
    }

    return data;
  }, [
    normalizedProducts,
    activeCategory,
    priceRange,
    selectedRatings,
    selectedBrands,
    sortOption,
  ]);

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
  }, [activeCategory, sortOption, priceRange, selectedRatings, selectedBrands]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product.productId,
        quantity: product.minOrderQty || 1,
      })
    );
  };

  const toggleFavourite = (product) => {
    const id = product.productId;

    if (liked.includes(id)) {
      dispatch(removeFromFavourites(id));
    } else {
      dispatch(addToFavourites(id));
    }
  };

  const toggleRating = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((item) => item !== rating)
        : [...prev, rating]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setPriceRange(50000);
    setSelectedRatings([]);
    setBrandSearch("");
    setSelectedBrands([]);
    setActiveCategory("All");
    setSortOption("Most relevant");
    setCurrentPage(1);
  };

  return (
    <div
      className="bg-[#FFF8EC] min-h-screen text-[#1A1A1A]"
      style={{ backgroundColor: COLORS.cream, color: COLORS.text }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-5">
          <p className="text-xs text-gray-600" style={{ color: COLORS.muted }}>
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">››</span>
            <span className="text-[#0B1F3A] font-medium" style={{ color: COLORS.primary }}>
              Trending products
            </span>
          </p>
        </div>

        <h1 className="text-3xl font-bold mt-2 text-[#0B1F3A]" style={{ color: COLORS.primary }}>
          Trending Products
        </h1>

        <p className="text-gray-500 text-sm mt-1" style={{ color: COLORS.muted }}>
          Shop the most popular and in-demand products loved by customers.
        </p>
      </div>

      <div className="bg-white py-5 rounded-sm" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className="whitespace-nowrap px-4 py-2 rounded-lg text-sm border transition"
                style={
                  activeCategory === cat.slug
                    ? {
                        backgroundColor: COLORS.accent,
                        color: COLORS.primary,
                        borderColor: COLORS.accent,
                      }
                    : {
                        backgroundColor: COLORS.white,
                        color: COLORS.text,
                        borderColor: COLORS.border,
                      }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div
            className="bg-white rounded-xl border p-4 h-fit sticky top-24"
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
          >
            <div>
              <h3 className="font-medium text-sm mb-2 text-[#0B1F3A]" style={{ color: COLORS.primary }}>
                PRICE RANGE
              </h3>

              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />

              <div className="flex justify-between text-xs mt-1">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}</span>
              </div>

              <button
                className="w-full mt-3 bg-[#0B1F3A] text-white py-2 rounded-md text-sm"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
              >
                APPLY FILTERS
              </button>

              <p
                className="text-xs text-gray-500 mt-2 cursor-pointer"
                style={{ color: COLORS.muted }}
                onClick={clearAllFilters}
              >
                Clear All
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-sm mb-2 text-[#0B1F3A]" style={{ color: COLORS.primary }}>
                RATING
              </h3>

              {[5, 4, 3, 2].map((r) => (
                <div key={r} className="flex items-center gap-2 text-xs mb-1">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(r)}
                    onChange={() => toggleRating(r)}
                  />
                  <span className="text-[#D4AF37]" style={{ color: COLORS.accent }}>
                    {"★".repeat(r)}
                  </span>
                  <span className="text-gray-500" style={{ color: COLORS.muted }}>
                    & above
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-sm mb-2 text-[#0B1F3A]" style={{ color: COLORS.primary }}>
                BRAND
              </h3>

              <input
                placeholder="Search brand..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-md px-2 py-1 text-sm mb-2"
                style={{ borderColor: COLORS.border }}
              />

              {availableBrands.slice(0, 5).map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs mb-1">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  <span>{b}</span>
                </div>
              ))}

              <p className="text-xs text-gray-500 mt-1 cursor-pointer" style={{ color: COLORS.muted }}>
                View More
              </p>
            </div>
          </div>

          <main>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-700" style={{ color: COLORS.text }}>
                Showing <span className="font-semibold">{totalProducts === 0 ? 0 : startIndex + 1}</span>–
                <span className="font-semibold">{endIndex}</span> of{" "}
                <span className="font-semibold">{totalProducts}</span> Products
              </p>

              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.white,
                    color: COLORS.text,
                  }}
                >
                  <option>Most relevant</option>
                  <option>Price low to high</option>
                  <option>Price high to low</option>
                </select>

                <button
                  onClick={() =>
                    setViewMode((m) => (m === "grid" ? "list" : "grid"))
                  }
                  className="h-10 w-10 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.white,
                    color: COLORS.primary,
                  }}
                >
                  {viewMode === "grid" ? (
                    <LayoutGrid size={16} />
                  ) : (
                    <LayoutList size={16} />
                  )}
                </button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "grid grid-cols-1 gap-3"
              }
            >
              {paginatedProducts.map((product) => {
                const isLiked = liked.includes(product.productId);

                return (
                  <Link key={product.productId} href={`/product/${product.productId}`}>
                    <Card
                      className="rounded-xl border bg-white hover:shadow-sm transition overflow-hidden"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
                    >
                      <CardContent className="p-0">
                        <div className={viewMode === "grid" ? "" : "flex gap-3 items-start"}>
                          <div
                            className={
                              viewMode === "grid"
                                ? "relative h-40 w-full"
                                : "relative h-24 w-24 shrink-0 m-3"
                            }
                          >
                            <span
                              className="absolute top-1 left-1 text-[9px] px-2 py-[2px] rounded"
                              style={{
                                backgroundColor: COLORS.primary,
                                color: COLORS.white,
                              }}
                            >
                              Trending
                            </span>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavourite(product);
                              }}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                              style={{ backgroundColor: COLORS.white }}
                            >
                              <Heart
                                size={14}
                                className={
                                  isLiked ? "text-red-500" : "text-gray-600"
                                }
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
                            <h3
                              className="text-sm font-semibold line-clamp-2"
                              style={{ color: COLORS.accent }}
                            >
                              {product.name}
                            </h3>

                            <p
                              className="text-[11px] mt-1"
                              style={{ color: COLORS.muted }}
                            >
                              {product.brandName}
                            </p>

                            <p
                              className="text-sm font-bold mt-1"
                              style={{ color: COLORS.primary }}
                            >
                              ₹{product.priceValue}
                            </p>

                            <p
                              className="text-[11px]"
                              style={{ color: COLORS.muted }}
                            >
                              Min. Order: {product.minOrderQty}
                            </p>

                            <div className="mt-3">
                              <Button
                                className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
                                style={{
                                  backgroundColor: COLORS.accent,
                                  color: COLORS.primary,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                              >
                                <ShoppingCart size={12} />
                                Add
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

            {paginatedProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500" style={{ color: COLORS.muted }}>
                No products found for the selected filters.
              </div>
            )}

            {totalProducts > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-lg border bg-white"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.white,
                    color: COLORS.primary,
                  }}
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
                      className="h-9 w-9 rounded-lg border text-sm"
                      style={
                        safePage === pageNum
                          ? {
                              backgroundColor: COLORS.primary,
                              color: COLORS.cream,
                              borderColor: COLORS.primary,
                            }
                          : {
                              backgroundColor: COLORS.white,
                              color: COLORS.primary,
                              borderColor: COLORS.border,
                            }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <span className="px-1 text-gray-500" style={{ color: COLORS.muted }}>
                      …
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className="h-9 w-9 rounded-lg border text-sm"
                      style={
                        safePage === totalPages
                          ? {
                              backgroundColor: COLORS.primary,
                              color: COLORS.cream,
                              borderColor: COLORS.primary,
                            }
                          : {
                              backgroundColor: COLORS.white,
                              color: COLORS.primary,
                              borderColor: COLORS.border,
                            }
                      }
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="h-9 w-9 rounded-lg border bg-white"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.white,
                    color: COLORS.primary,
                  }}
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

export default TrendingViewAllV1;