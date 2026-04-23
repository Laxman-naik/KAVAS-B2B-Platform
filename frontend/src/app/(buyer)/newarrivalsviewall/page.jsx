"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Heart,ShoppingCart,LayoutGrid,LayoutList,} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {addToFavourites,removeFromFavourites,fetchFavourites,} from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchNewArrivals } from "@/store/slices/productSlice";
import { productapi } from "@/lib/axios";

const COLORS = {
  primary: "#0B1F3A",
  accent: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
  muted: "#6B7280",
  chipBg: "#F8F8F8",
};

const ITEMS_PER_PAGE = 12;

const Page = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({minQty: [],rating: [],supplier: [],});

  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);
  const newArrivals = useSelector((state) => state.products.newArrivals || []);
  const liked = favouriteItems;

  useEffect(() => {
    dispatch(fetchNewArrivals());
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

  const onToggleFavourite = (product) => {
  const productId = String(product.productId);
  const isLiked = liked.map(String).includes(productId);

  if (isLiked) {
    dispatch(removeFromFavourites(productId));
  } else {
    dispatch(addToFavourites(productId));
  }
};

  const onAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product.productId,
        quantity: 1,
        variantId: product?.variantId ?? product?.variant_id,
      })
    );
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
    setFilters({
      minQty: [],
      rating: [],
      supplier: [],
    });
    setActiveCategory("All");
    setSortOption("Most relevant");
    setCurrentPage(1);
  };

  const normalizedProducts = useMemo(() => {
    return newArrivals.map((product) => ({
      ...product,
      productId: product.id || product._id,
      imageUrl: product.image_url || product.imageUrl || "/placeholder.png",
      minOrderQty: Number(product.moq ?? product.minOrderQty ?? 0),
      supplierType: product.supplierType || product.supplier_type || "",
      priceValue: Number(product.priceValue ?? product.price ?? 0),
      categoryName:
        product.category_name ||
        product.categoryName ||
        product.category ||
        "Uncategorized",
      categorySlug: product.category_slug || product.categorySlug || "",
      subcategorySlug:
        product.subcategory_slug ||
        product.subcategorySlug ||
        product.sub_category_slug ||
        "",
      ratingValue: Number(product.rating ?? 0),
    }));
  }, [newArrivals]);

  const categories = useMemo(() => {
    return [
      { name: "All Categories", slug: "All" },
      ...mainCategories.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
      })),
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

          const matchQty = filters.minQty.some((range) => {
            if (range === "Under 50 units") return qty < 50;
            if (range === "50–200 units") return qty >= 50 && qty <= 200;
            if (range === "200–500 units") return qty > 200 && qty <= 500;
            if (range === "500+ units") return qty > 500;
            return false;
          });

          if (!matchQty) return false;
        }

        if (filters.rating.length > 0) {
          const matchRating = filters.rating.some(
            (r) => product.ratingValue >= parseFloat(r)
          );
          if (!matchRating) return false;
        }

        if (filters.supplier.length > 0) {
          const matchSupplier = filters.supplier.includes(product.supplierType);
          if (!matchSupplier) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "Price low to high") {
          return a.priceValue - b.priceValue;
        }
        if (sortOption === "Price high to low") {
          return b.priceValue - a.priceValue;
        }
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
            <span
              className="text-[#0B1F3A] font-medium"
              style={{ color: COLORS.primary }}
            >
              New Arrivals
            </span>
          </p>
        </div>

        <h1
          className="text-3xl font-bold mt-2 text-[#0B1F3A]"
          style={{ color: COLORS.primary }}
        >
          New Arrivals
        </h1>

        <p
          className="text-gray-500 text-sm mt-1"
          style={{ color: COLORS.muted }}
        >
          Discover the latest products freshly added to our collection.
        </p>
      </div>

      <div
        className="bg-white py-5 rounded-sm"
        style={{ backgroundColor: COLORS.white }}
      >
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className="whitespace-nowrap px-4 py-2 rounded-lg text-sm border transition cursor-pointer"
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
          <div className="md:hidden mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full border rounded-lg py-2 text-sm font-medium cursor-pointer"
              style={{
                backgroundColor: COLORS.white,
                color: COLORS.primary,
                borderColor: COLORS.border,
              }}
            >
              Filters {showFilters ? "▲" : "▼"}
            </button>
          </div>

          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block bg-white rounded-xl border p-4 h-fit sticky top-24`}
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <div>
              <h3
                className="font-medium text-sm mb-2 text-[#0B1F3A]"
                style={{ color: COLORS.primary }}
              >
                MIN. ORDER QTY
              </h3>

              <div className="space-y-1 text-xs">
                {[
                  "Under 50 units",
                  "50–200 units",
                  "200–500 units",
                  "500+ units",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.minQty.includes(item)}
                      onChange={() => handleFilterChange("minQty", item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <button
                className="w-full mt-3 bg-[#0B1F3A] text-white py-2 rounded-md text-sm cursor-pointer"
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
              <h3
                className="font-medium text-sm mb-2 text-[#0B1F3A]"
                style={{ color: COLORS.primary }}
              >
                RATING
              </h3>

              {["4.5", "4.0"].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-xs mb-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.rating.includes(item)}
                    onChange={() => handleFilterChange("rating", item)}
                  />
                  <span style={{ color: COLORS.accent }}>
                    {"★".repeat(Math.floor(parseFloat(item)))}
                  </span>
                  <span style={{ color: COLORS.muted }}>{item} & above</span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <h3
                className="font-medium text-sm mb-2 text-[#0B1F3A]"
                style={{ color: COLORS.primary }}
              >
                SUPPLIER TYPE
              </h3>

              {["Verified only", "Manufacturer", "Distributor"].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-xs mb-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.supplier.includes(item)}
                    onChange={() => handleFilterChange("supplier", item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <main>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-700" style={{ color: COLORS.text }}>
                Showing{" "}
                <span className="font-semibold">
                  {totalProducts === 0 ? 0 : startIndex + 1}
                </span>
                –
                <span className="font-semibold">{endIndex}</span> of{" "}
                <span className="font-semibold">{totalProducts}</span> Products
              </p>

              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
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
                  className="h-10 w-10 rounded-lg border border-[#E5E5E5] bg-white flex items-center justify-center cursor-pointer"
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
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                  >
                    <Card
                      className="rounded-xl border bg-white hover:shadow-sm transition overflow-hidden cursor-pointer"
                      style={{
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.white,
                      }}
                    >
                      <CardContent className="p-0">
                        <div
                          className={
                            viewMode === "grid" ? "" : "flex gap-3 items-start"
                          }
                        >
                          <div
                            className={
                              viewMode === "grid"
                                ? "relative h-40 w-full"
                                : "relative h-24 w-24 shrink-0 m-3"
                            }
                          >
                            <span
                              className="absolute top-1 left-1 text-[9px] px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: COLORS.primary,
                                color: COLORS.white,
                              }}
                            >
                              New Arrival
                            </span>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavourite(product);
                              }}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer"
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

                          <div
                            className={
                              viewMode === "grid" ? "p-3" : "flex-1 py-3 pr-3"
                            }
                          >
                            <h3
                              className="text-sm font-semibold line-clamp-2"
                              style={{ color: COLORS.accent }}
                            >
                              {product.name}
                            </h3>

                            <p
                              className="text-sm font-bold mt-1"
                              style={{ color: COLORS.primary }}
                            >
                              ₹{product.priceValue}/unit
                            </p>

                            <p
                              className="text-[11px]"
                              style={{ color: COLORS.muted }}
                            >
                              Min. {product.minOrderQty} units
                            </p>

                            {product.stock ? (
                              <p
                                className="text-[11px] flex items-center gap-1 mt-1"
                                style={{ color: COLORS.muted }}
                              >
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {product.stock}
                              </p>
                            ) : null}

                            <div className="mt-3">
                              <Button
                                className={`flex items-center gap-2 rounded-md cursor-pointer ${
                                  viewMode === "grid"
                                    ? "w-full text-sm py-2 justify-center"
                                    : "text-xs px-3 py-1.5"
                                }`}
                                style={{
                                  backgroundColor: COLORS.accent,
                                  color: COLORS.primary,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onAddToCart(product);
                                }}
                              >
                                <ShoppingCart
                                  size={viewMode === "grid" ? 14 : 12}
                                />
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

            {paginatedProducts.length === 0 && (
              <div
                className="text-center py-12 text-gray-500"
                style={{ color: COLORS.muted }}
              >
                No products found for the selected filters.
              </div>
            )}

            {totalProducts > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
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
                      className="h-9 w-9 rounded-lg border text-sm cursor-pointer"
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
                    <span
                      className="px-1 text-gray-500"
                      style={{ color: COLORS.muted }}
                    >
                      …
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className="h-9 w-9 rounded-lg border text-sm cursor-pointer"
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
                  className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
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

export default Page;