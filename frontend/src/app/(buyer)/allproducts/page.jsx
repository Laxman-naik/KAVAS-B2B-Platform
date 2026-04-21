"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, LayoutGrid, Rows3, ShoppingCart } from "lucide-react";
import { productsData } from "@/app/(buyer)/product/productData";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState({
    minQty: [],
    rating: [],
    supplier: [],
  });

  const [sortOption, setSortOption] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [viewMode, setViewMode] = useState("grid");

  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);

  const onToggleFavourite = (product) => {
    dispatch(toggleFavourite(product));
  };

  const onAddToCart = (product) => {
    dispatch(addToCart(product));
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

  const allProducts = Object.values(productsData).flat();

  const categoryCounts = allProducts.reduce((acc, p) => {
    const key = p?.category || "";
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const maxCatalogPrice = allProducts.reduce(
    (max, p) => (typeof p?.price === "number" ? Math.max(max, p.price) : max),
    50000
  );

  const filteredProducts = allProducts
    .filter((product) => {
      if (
        activeCategory !== "All" &&
        product.category.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }

      if (typeof product?.price === "number") {
        if (product.price < priceRange.min) return false;
        if (product.price > priceRange.max) return false;
      }

      if (filters.minQty.length > 0) {
        const qty = product.minQty;

        const matchQty = filters.minQty.some((range) => {
          if (range === "Under 50 units") return qty < 50;
          if (range === "50–200 units") return qty >= 50 && qty <= 200;
          if (range === "200–500 units") return qty > 200 && qty <= 500;
          if (range === "500+ units") return qty > 500;
        });

        if (!matchQty) return false;
      }
      if (filters.rating.length > 0) {
        const matchRating = filters.rating.some(
          (r) => (product.rating || 0) >= parseFloat(r)
        );
        if (!matchRating) return false;
      }
      if (filters.supplier.length > 0) {
        const matchSupplier = filters.supplier.includes(product.supplier);
        if (!matchSupplier) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Price low to high") {
        return a.price - b.price;
      }
      if (sortOption === "Price high to low") {
        return b.price - a.price;
      }
      return 0;
    });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const onClearFilters = () => {
    setFilters({ minQty: [], rating: [], supplier: [] });
    setActiveCategory("All");
    setPriceRange({ min: 0, max: maxCatalogPrice });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-6">
        <div className="mb-5">
          <p className="text-xs text-gray-600">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">››</span>
            <span className="font-semibold text-gray-900">Products</span>
          </p>

          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            All Products
          </h1>
          <p className="mt-1 text-sm text-gray-700 max-w-2xl">
            Discover our wide range of premium quality products at unbeatable wholesale prices.
          </p>
        </div>
        <div className="rounded-sm bg-white border border-[#E9DDC9] p-4 sm:p-5">
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowFilters((s) => !s)}
            >
              Filters
              <span className="text-xs">{showFilters ? "▲" : "▼"}</span>
            </Button>
          </div>

          <div className="grid md:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
            <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="rounded-2xl border border-[#E9DDC9] bg-white p-4 sticky top-24">
                <div className="pb-3 border-b border-[#F0E6D6]">
                  <h3 className="text-xs font-extrabold tracking-wide text-gray-700">CATEGORIES</h3>
                </div>

                <div className="mt-3 space-y-1">
                  {categories.map((cat) => {
                    const count =
                      cat === "All"
                        ? allProducts.length
                        : categoryCounts[cat] || 0;

                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition border ${isActive
                            ? "bg-[#FFF3D6] border-[#D4AF37] text-[#0B1F3A]"
                            : "bg-white border-transparent hover:bg-[#FFF3D6]/60 text-gray-700"
                          }`}
                      >
                        <span className="font-medium">{cat === "All" ? "All Categories" : cat}</span>
                        <span className="text-xs text-gray-600">({count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0E6D6]">
                  <h3 className="text-xs font-extrabold tracking-wide text-gray-700">PRICE RANGE</h3>

                  <div className="mt-3 space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={maxCatalogPrice}
                      value={priceRange.min}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setPriceRange((prev) => ({ ...prev, min: Math.min(value, prev.max) }));
                        setCurrentPage(1);
                      }}
                      className="w-full accent-[#0B1F3A]"
                    />
                    <input
                      type="range"
                      min={0}
                      max={maxCatalogPrice}
                      value={priceRange.max}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setPriceRange((prev) => ({ ...prev, max: Math.max(value, prev.min) }));
                        setCurrentPage(1);
                      }}
                      className="w-full accent-[#0B1F3A]"
                    />

                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span>₹{priceRange.min}</span>
                      <span>₹{priceRange.max}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <Button
                      className="w-full bg-[#0B1F3A] hover:bg-[#07162A] text-white"
                      onClick={() => setCurrentPage(1)}
                    >
                      Apply Filters
                    </Button>

                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="text-xs text-gray-600 hover:underline text-left"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-[#0B1F3A]  p-4 text-white">
                  <p className="text-xs font-extrabold tracking-wide opacity-90">BULK ORDER?</p>
                  <p className="mt-1 text-sm font-semibold">Get Special Wholesale Pricing!</p>
                  <Button className="mt-3 w-full bg-[#D4AF37] hover:bg-[#caa734] text-[#0B1F3A]">
                    Enquire Now
                  </Button>
                </div>
              </div>
            </aside>

            <main>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span>–
                  <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalProducts}</span> Products
                </p>

                <div className="flex items-center gap-2">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-[#E9DDC9] bg-white px-3 py-2 text-sm"
                  >
                    <option>Most relevant</option>
                    <option>Price low to high</option>
                    <option>Price high to low</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                    className="h-10 w-10 rounded-lg border border-[#E9DDC9] bg-white flex items-center justify-center text-[#0B1F3A] hover:bg-[#FFF3D6] transition"
                    aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                  >
                    {viewMode === "grid" ? (
                      <LayoutGrid className="h-4 w-4" />
                    ) : (
                      <Rows3 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "grid grid-cols-1 gap-4"
                }
              >
                {paginatedProducts.map((product, index) => {
                  const productId = product?._id ?? product?.id ?? product?.productId;
                  const isLiked = favouriteItems.some(
                    (i) => String(i._id ?? i.id) === String(productId)
                  );
                  const discount = index % 2 === 0 ? 25 : 30;
                  const originalPrice =
                    typeof product?.price === "number"
                      ? Math.round(product.price * (1 + discount / 100))
                      : null;

                  return (
                    <Link key={productId} href={`/product/${productId}`} className="block">
                      <Card className="rounded-2xl border border-[#E9DDC9] bg-white hover:shadow-md transition overflow-hidden">
                        <CardContent className={viewMode === "grid" ? "p-0" : "p-0"}>
                          <div className={viewMode === "grid" ? "" : "flex gap-4"}>
                            <div
                              className={
                                viewMode === "grid"
                                  ? "relative h-40 sm:h-44 w-full overflow-hidden"
                                  : "relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl m-3"
                              }
                            >
                              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-[#0B1F3A]">
                                -{discount}%
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onToggleFavourite({ ...product, _id: productId });
                                }}
                                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center border border-[#E9DDC9]"
                                aria-label="Toggle favourite"
                              >
                                <Heart
                                  size={16}
                                  className={isLiked ? "text-red-500" : "text-gray-600"}
                                  fill={isLiked ? "currentColor" : "none"}
                                />
                              </button>

                              <img
                                src={product.image}
                                alt={product.name}
                                className={viewMode === "grid" ? "w-full h-full object-contain p-2" : "w-full h-full object-contain p-2"}
                              />
                            </div>

                            <div className={viewMode === "grid" ? "p-3" : "flex-1 py-4 pr-4"}>
                              <h3 className={viewMode === "grid" ? "text-sm font-semibold text-[#0B1F3A] line-clamp-2 min-h-10" : "text-sm sm:text-base font-semibold text-[#0B1F3A] line-clamp-2"}>
                                {product.name}
                              </h3>

                              <div className="mt-1">
                                <span className="text-sm font-extrabold text-[#0B1F3A]">₹{product.price}</span>
                                {originalPrice ? (
                                  <span className="ml-2 text-xs text-gray-500 line-through">₹{originalPrice}</span>
                                ) : null}
                              </div>

                              <p className="mt-1 text-xs text-gray-600">
                                Min. Order: <span className="font-semibold">{product.minQty}</span> Units
                              </p>

                              <div className={viewMode === "grid" ? "" : "mt-3 flex gap-2"}>
                                <Button
                                  className={viewMode === "grid" ? "mt-3 w-full bg-[#D4AF37] hover:bg-[#caa734] text-[#0B1F3A]" : "bg-[#D4AF37] hover:bg-[#caa734] text-[#0B1F3A] px-4"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onAddToCart({ ...product, productId });
                                  }}
                                >
                                  <ShoppingCart size={14} className="mr-2" />
                                  Add to Cart
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

              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  className="border-[#E9DDC9] bg-white"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  ‹
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : safePage <= 3
                        ? i + 1
                        : safePage >= totalPages - 2
                          ? totalPages - 4 + i
                          : safePage - 2 + i;

                  const isActive = pageNum === safePage;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-9 w-9 rounded-lg text-sm font-semibold border ${isActive
                          ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                          : "bg-white text-[#0B1F3A] border-[#E9DDC9] hover:bg-[#FFF3D6]"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <Button
                  variant="outline"
                  className="border-[#E9DDC9] bg-white"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  ›
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;