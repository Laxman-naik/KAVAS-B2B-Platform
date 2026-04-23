"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, LayoutGrid, LayoutList, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourites, removeFromFavourites, } from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchNewArrivals } from "@/store/slices/productSlice";

const categories = [
  "All",
  "Accessories",
  "Electronics",
  "Agriculture",
  "Healthcare",
  "Furniture",
  "Apparel",
  "Chemicals",
  "Hardware",
  "FMCG",
];

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Most relevant");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [filters, setFilters] = useState({
    minQty: [],
    rating: [],
    supplier: [],
  });

  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const favouriteItems = useSelector((state) => state.favourites.items);
  const { newArrivals, loading } = useSelector((state) => state.products);
  const liked = (Array.isArray(favouriteItems) ? favouriteItems : []).map(
    (item) => item?._id ?? item?.id ?? item?.productId
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const onToggleFavourite = (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    const isLiked = liked.includes(productId);
    if (!productId) return;
    if (isLiked) {
      dispatch(removeFromFavourites(productId));
    } else {
      dispatch(addToFavourites(productId));
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

  useEffect(() => {
    setMounted(true);
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const normalizeProduct = (product) => {
    const id = product?._id ?? product?.id ?? product?.productId;
    const category = String(
      product?.category ?? product?.category_name ?? product?.categoryName ?? ""
    ).trim();

    const supplierType = String(
      product?.supplierType ?? product?.supplier_type ?? product?.supplier ?? ""
    ).trim();

    const rawMoq =
      product?.moq ?? product?.minQty ?? product?.min_qty ?? product?.minimumOrderQty;
    const minQty =
      typeof rawMoq === "number"
        ? rawMoq
        : parseInt(String(rawMoq ?? "").match(/\d+/)?.[0] || "0", 10);

    const rating = Number.parseFloat(
      product?.rating ?? product?.ratingValue ?? product?.avgRating ?? 0
    );

    const rawPrice = product?.priceValue ?? product?.price ?? 0;
    const priceValue =
      typeof rawPrice === "number"
        ? rawPrice
        : Number.parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

    return {
      ...product,
      __id: id,
      __category: category,
      __supplierType: supplierType,
      __minQty: minQty,
      __rating: Number.isFinite(rating) ? rating : 0,
      __priceValue: Number.isFinite(priceValue) ? priceValue : 0,
    };
  };

  const normalizedProducts = (newArrivals || []).map(normalizeProduct);

  const maxCatalogPrice = normalizedProducts.reduce(
    (max, p) =>
      typeof p?.__priceValue === "number" ? Math.max(max, p.__priceValue) : max,
    50000
  );

  useEffect(() => {
    setPriceRange((prev) => {
      if (prev.max === 50000 && maxCatalogPrice !== 50000) {
        return { min: 0, max: maxCatalogPrice };
      }
      return prev;
    });
  }, [maxCatalogPrice]);

  const onClearFilters = () => {
    setActiveCategory("All");
    setSortOption("Most relevant");
    setFilters({ minQty: [], rating: [], supplier: [] });
    setPriceRange({ min: 0, max: maxCatalogPrice });
    setCurrentPage(1);
    setShowFilters(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortOption, filters, priceRange]);

  const filteredProducts = normalizedProducts
    .filter((product) => {
      if (
        activeCategory !== "All" &&
        String(product.__category).toLowerCase() !==
          String(activeCategory).toLowerCase()
      ) {
        return false;
      }

      if (typeof product?.__priceValue === "number") {
        if (product.__priceValue < priceRange.min) return false;
        if (product.__priceValue > priceRange.max) return false;
      }

      if (filters.minQty.length > 0) {
        const qty = product.__minQty;

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
          (r) => Number(product.__rating) >= parseFloat(r)
        );
        if (!matchRating) return false;
      }

      if (filters.supplier.length > 0) {
        const matchSupplier = filters.supplier.includes(product.__supplierType);
        if (!matchSupplier) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Price low to high") {
        return (a.__priceValue ?? 0) - (b.__priceValue ?? 0);
      }
      if (sortOption === "Price high to low") {
        return (b.__priceValue ?? 0) - (a.__priceValue ?? 0);
      }
      return 0;
    });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-6">
        <div className="mb-5">
          <p className="text-xs text-gray-600">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">››</span>
            <span className="text-[#0B1F3A] font-medium">New Arrivals</span>
          </p>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">New Arrivals</h1>
          <p className="text-sm text-gray-700 mt-1">
            Explore the latest arrivals in premium quality products, handpicked just for you.
          </p>
        </div>
        

        <div className="rounded-sm bg-white border border-[#E9DDC9] p-4 sm:p-5">
          <div className="px-4 sm:px-6 pb-3">
  <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => {
          setActiveCategory(cat);
          setCurrentPage(1);
        }}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border transition ${
          activeCategory === cat
            ? "bg-[#D4AF37] text-white border-[#D4AF37]"
            : "bg-white text-gray-700 border-[#E5E5E5] hover:bg-[#FFF8EC]"
        }`}
      >
        {cat === "All" ? "All Categories" : cat}
      </button>
    ))}
  </div>
</div>
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white border border-[#E5E5E5] rounded-lg py-2 text-sm font-medium shadow-sm"
            >
              Filters {showFilters ? "▲" : "▼"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-28 border border-[#E5E5E5]">
                
                <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                  <h3 className="font-semibold mb-2 text-sm text-[#0B1F3A]">PRICE RANGE</h3>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, Math.floor(maxCatalogPrice || 0))}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: Math.max(prev.min, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full accent-[#D4AF37]"
                  />

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="border border-[#E5E5E5] rounded-lg px-2 py-1.5">
                      <div className="text-[11px] text-gray-500">Min</div>
                      <input
                        inputMode="numeric"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => {
                            const v =
                              Number(String(e.target.value).replace(/[^0-9]/g, "")) || 0;
                            return { ...prev, min: Math.min(v, prev.max) };
                          })
                        }
                        className="w-full text-sm outline-none"
                      />
                    </div>
                    <div className="border border-[#E5E5E5] rounded-lg px-2 py-1.5">
                      <div className="text-[11px] text-gray-500">Max</div>
                      <input
                        inputMode="numeric"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => {
                            const v =
                              Number(String(e.target.value).replace(/[^0-9]/g, "")) || 0;
                            const bounded = Math.min(v, maxCatalogPrice || v);
                            return { ...prev, max: Math.max(prev.min, bounded) };
                          })
                        }
                        className="w-full text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                  <h3 className="font-semibold mb-2 text-sm text-[#0B1F3A]">SORT BY</h3>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm w-full bg-white"
                  >
                    <option>Most relevant</option>
                    <option>Price low to high</option>
                    <option>Price high to low</option>
                  </select>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                  <h3 className="font-semibold mb-2 text-sm text-[#0B1F3A]">RATING</h3>
                  <div className="space-y-1 text-sm">
                    {["4.5", "4.0"].map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.rating.includes(item)}
                          onChange={() => handleFilterChange("rating", item)}
                          className="accent-[#D4AF37]"
                        />
                        <span className="text-[#D4AF37]">★★★★★</span>
                        <span className="text-gray-700">&amp; above</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                  <h3 className="font-semibold mb-2 text-sm text-[#0B1F3A]">MIN. ORDER QTY</h3>
                  <div className="space-y-1 text-sm">
                    {[
                      "Under 50 units",
                      "50–200 units",
                      "200–500 units",
                      "500+ units",
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.minQty.includes(item)}
                          onChange={() => handleFilterChange("minQty", item)}
                          className="accent-[#D4AF37]"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                  <h3 className="font-semibold mb-2 text-sm text-[#0B1F3A]">SUPPLIER TYPE</h3>
                  <div className="space-y-1 text-sm">
                    {[
                      "Verified only",
                      "Manufacturer",
                      "Distributor",
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.supplier.includes(item)}
                          onChange={() => handleFilterChange("supplier", item)}
                          className="accent-[#D4AF37]"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full mt-5 bg-[#0B1F3A] text-[#FFF8EC] py-2 rounded-lg transition font-semibold"
                  onClick={() => setShowFilters(false)}
                >
                  APPLY FILTERS
                </button>

                <button
                  type="button"
                  className="w-full mt-2 bg-white border border-[#E5E5E5] py-2 rounded-lg hover:bg-[#FFF8EC] transition font-medium text-[#0B1F3A]"
                  onClick={onClearFilters}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div>
              <div className="bg-white border border-[#E5E5E5] rounded-2xl px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-gray-700 text-sm">
                  Showing <span className="font-semibold text-[#0B1F3A]">{totalProducts === 0 ? 0 : startIndex + 1}–{endIndex}</span> of{" "}
                  <span className="font-semibold text-[#0B1F3A]">{totalProducts}</span> Products
                </p>

                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`border rounded-lg px-3 py-2 text-sm flex items-center gap-2 ${
                    viewMode === "grid"
                      ? "border-[#D4AF37] bg-[#FFF8EC] text-[#0B1F3A]"
                      : "border-[#E5E5E5] bg-white text-gray-700"
                  }`}
                >
                  <LayoutGrid size={16} />
                  Grid
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`border rounded-lg px-3 py-2 text-sm flex items-center gap-2 ${
                    viewMode === "list"
                      ? "border-[#D4AF37] bg-[#FFF8EC] text-[#0B1F3A]"
                      : "border-[#E5E5E5] bg-white text-gray-700"
                  }`}
                >
                  <LayoutList size={16} />
                  List
                </button>
              </div>

              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 gap-4"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                }
              >
                {paginatedProducts.map((product) => {
                  const productId = product.__id ?? product.id ?? product._id;
                  const isLiked = liked.includes(productId);

                  return (
                    <Link key={productId} href={`/product/${productId}`} className="block">
                      <Card
                        className={`rounded-2xl bg-white shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer border border-[#E5E5E5] ${
                          viewMode === "list" ? "flex" : "flex flex-col"
                        }`}
                      >
                        <CardContent
                          className={`p-0 flex h-full ${
                            viewMode === "list" ? "flex-row" : "flex-col"
                          }`}
                        >
                          <div
                            className={`relative bg-[#FFF8EC] flex items-center justify-center ${
                              viewMode === "list"
                                ? "w-36 sm:w-44 h-32 sm:h-36 shrink-0"
                                : "h-52 w-full"
                            }`}
                          >
                            <span className="absolute top-3 left-3 bg-green-700 text-white text-[11px] px-2 py-0.5 rounded-md z-10">
                              NEW
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavourite(product);
                              }}
                              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center"
                            >
                              <Heart
                                size={16}
                                className={isLiked ? "text-red-500" : "text-gray-600"}
                                fill={isLiked ? "currentColor" : "none"}
                              />
                            </button>

                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="p-3 flex flex-col flex-1">
                            <h3 className="text-sm font-semibold line-clamp-2 leading-snug text-[#0B1F3A]">
                              {product.name}
                            </h3>
                            <p className="font-bold text-base text-[#D4AF37] mt-2">
                              ₹{product.price}/unit
                            </p>
                            <p className="text-[11px] text-gray-600 mt-0.5">
                              Min. Order: {product.moq} Units
                            </p>

                            <div className="mt-auto pt-3">
                              <Button
                                className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B1F3A] text-xs h-10 rounded-md font-semibold"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onAddToCart(product);
                                }}
                              >
                                <ShoppingCart size={14} className="mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {paginatedProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No products found for the selected filters.
                </div>
              )}

              {totalProducts > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white text-[#0B1F3A]"
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
                        className={`h-9 w-9 rounded-lg border text-sm ${
                          safePage === pageNum
                            ? "bg-[#0B1F3A] text-[#FFF8EC] border-[#0B1F3A]"
                            : "bg-white text-[#0B1F3A] border-[#E5E5E5]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && (
                    <>
                      <span className="px-1 text-gray-500">…</span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        className={`h-9 w-9 rounded-lg border text-sm ${
                          safePage === totalPages
                            ? "bg-[#0B1F3A] text-[#FFF8EC] border-[#0B1F3A]"
                            : "bg-white text-[#0B1F3A] border-[#E5E5E5]"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white text-[#0B1F3A]"
                    disabled={safePage === totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;