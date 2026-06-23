"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingCart, Zap, List } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlashDeals } from "@/store/slices/productSlice";

import { Button } from "@/components/ui/button";
import { fetchCart } from "@/store/slices/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { productapi } from "@/lib/axios";

const sortOptions = [
  { label: "Ending Soon", value: "ending" },
  { label: "Price: Low to High", value: "priceLow" },
  { label: "Price: High to Low", value: "priceHigh" },
  { label: "Biggest Discount", value: "discountHigh" },
  { label: "Newest", value: "newest" },
];

export default function FlashDealsPage() {
  const dispatch = useDispatch();

  const { flashDeals, flashDealsLoading, error } = useSelector(
    (state) => state.products
  );

  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("ending");
  const [priceRange, setPriceRange] = useState(50000);
  const [viewMode, setViewMode] = useState("grid");

  const itemsPerPage = 5;

  const [timeLeft, setTimeLeft] = useState(
    2 * 24 * 60 * 60 + 14 * 60 * 60 + 36 * 60 + 48
  );

  useEffect(() => {
    dispatch(fetchFlashDeals());
  }, [dispatch]);

  useEffect(() => {
    if (!flashDeals || flashDeals.length === 0) return;

    const nearestDeal = flashDeals.reduce((nearest, item) => {
      const currentEnd = new Date(item.flash_deal_end).getTime();
      const nearestEnd = new Date(nearest.flash_deal_end).getTime();

      return currentEnd < nearestEnd ? item : nearest;
    }, flashDeals[0]);

    const updateTimer = () => {
      const endTime = new Date(nearestDeal.flash_deal_end).getTime();
      const remaining = Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      );

      setTimeLeft(remaining);
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [flashDeals]);

  const deals = Array.isArray(flashDeals) ? flashDeals : [];

  const days = String(Math.floor(timeLeft / (24 * 60 * 60))).padStart(2, "0");

  const hours = String(
    Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60))
  ).padStart(2, "0");

  const minutes = String(Math.floor((timeLeft % (60 * 60)) / 60)).padStart(
    2,
    "0"
  );

  const seconds = String(timeLeft % 60).padStart(2, "0");

  const getTitle = (item) => item.name || item.title || "Product";

  const getCategory = (item) =>
    item.category_name ||
    item.category ||
    item.categories?.[0]?.name ||
    "Uncategorized";

  const getPrice = (item) => Number(item.price || item.sale_price || 0);

  const getOldPrice = (item) =>
    Number(
      item.mrp ||
      item.oldPrice ||
      item.old_price ||
      item.original_price ||
      0
    );

  const getMinOrder = (item) =>
    item.moq || item.minOrder || item.min_order || 1;

  const getImage = (item) =>
    item.image_url ||
    item.img ||
    item.image ||
    item.thumbnail ||
    item.product_image ||
    item.images?.find((img) => img.is_primary)?.image_url ||
    item.images?.[0]?.image_url ||
    "/placeholder-product.png";

  const getDiscountValue = (item) => {
    if (item.discount_percentage) {
      return Number(item.discount_percentage);
    }

    const price = getPrice(item);
    const oldPrice = getOldPrice(item);

    if (!oldPrice || oldPrice <= price) return 0;

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const getDiscount = (item) => {
    return `${getDiscountValue(item)}% OFF`;
  };

  const getSavings = (item) => {
    if (item.savings) return Number(item.savings);

    const price = getPrice(item);
    const oldPrice = getOldPrice(item);

    if (!oldPrice || oldPrice <= price) return 0;

    return oldPrice - price;
  };

  const categories = useMemo(() => {
    const dynamicCategories = deals.map(getCategory).filter(Boolean);

    return ["All Categories", ...new Set(dynamicCategories)];
  }, [deals]);

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];

    if (selectedCategory !== "All Categories") {
      result = result.filter((item) => getCategory(item) === selectedCategory);
    }

    result = result.filter((item) => getPrice(item) <= priceRange);

    switch (sortBy) {
      case "priceLow":
        result.sort((a, b) => getPrice(a) - getPrice(b));
        break;

      case "priceHigh":
        result.sort((a, b) => getPrice(b) - getPrice(a));
        break;

      case "discountHigh":
        result.sort((a, b) => getDiscountValue(b) - getDiscountValue(a));
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at || b.createdAt || 0) -
            new Date(a.created_at || a.createdAt || 0)
        );
        break;

      default:
        result.sort(
          (a, b) =>
            new Date(a.flash_deal_end || 0) -
            new Date(b.flash_deal_end || 0)
        );
        break;
    }

    return result;
  }, [deals, selectedCategory, sortBy, priceRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedDeals.length / itemsPerPage)
  );

  const currentDeals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredAndSortedDeals.slice(start, start + itemsPerPage);
  }, [currentPage, filteredAndSortedDeals]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, priceRange]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSortBy("ending");
    setPriceRange(50000);
    setCurrentPage(1);
  };

  const getProductId = (item) => {
    return item.product_id || item.productId || item.product?.id || item.id;
  };

  const handleAddToCart = async (item) => {
    const productId = getProductId(item);

    if (!productId) {
      alert("Product id not found");
      return;
    }

    try {
      setCartLoadingId(productId);

      await productapi.post("/api/cart", {
        productId: productId,
        quantity: 1,
      });
      dispatch(fetchCart());

    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err.response?.data?.message || "Failed to add product to cart");
    } finally {
      setCartLoadingId(null);
    }
  };

  const startItem =
    filteredAndSortedDeals.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredAndSortedDeals.length
  );

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="mx-auto max-w-375 px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-sm bg-[#0B1F3A] text-white shadow-md">
          <div className="grid items-center gap-6 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#D4AF37]" />

                <span className="text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">
                  Limited Time
                </span>
              </div>

              <h1 className="text-3xl font-extrabold leading-none sm:text-4xl md:text-5xl">
                FLASH DEALS
              </h1>

              <p className="mt-3 max-w-md text-sm text-[#FFF8EC]/80 sm:text-base">
                Dynamic products from backend with live offers.
              </p>
            </div>

            <div className="flex flex-col items-start justify-center lg:items-center">
              <div className="w-full max-w-[320px] rounded-xl border border-[#E5E5E5] bg-[#D4AF37] p-4 text-[#0B1F3A] shadow-md sm:p-5">
                <p className="mb-4 text-left text-xs uppercase tracking-[0.2em] text-[#0B1F3A]/80 lg:text-center">
                  Ends In
                </p>

                <div className="flex justify-between gap-2 sm:gap-3">
                  {[
                    { value: days, label: "DAYS" },
                    { value: hours, label: "HRS" },
                    { value: minutes, label: "MIN" },
                    { value: seconds, label: "SEC" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex h-16 min-w-0 flex-1 flex-col items-center justify-center rounded-xl border border-white/40 bg-white/30"
                    >
                      <span className="text-lg font-bold sm:text-xl">
                        {item.value}
                      </span>

                      <span className="text-[9px] text-[#0B1F3A]/80 sm:text-[10px]">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              onClick={() => setSelectedCategory(item)}
              variant="outline"
              className={`rounded-lg px-4 py-2 text-sm transition ${selectedCategory === item
                ? "border-[#D4AF37] bg-[#D4AF37] font-semibold text-[#0B1F3A] hover:bg-[#D4AF37] hover:text-[#0B1F3A]"
                : "border-[#E5E5E5] bg-white text-gray-700 hover:border-[#D4AF37] hover:bg-white"
                }`}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <Card className="h-fit rounded-xl border border-[#E5E5E5] bg-white shadow-none">
            <CardContent className="p-4">
              <h2 className="mb-4 text-sm font-bold uppercase text-[#0B1F3A]">
                Price Range
              </h2>

              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#E5E5E5] bg-[#FFF8EC] px-3 py-2 text-sm">
                  ₹0
                </div>

                <div className="rounded-lg border border-[#E5E5E5] bg-[#FFF8EC] px-3 py-2 text-sm">
                  ₹{priceRange.toLocaleString()}
                </div>
              </div>

              <Button className="mt-4 w-full bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]">
                APPLY FILTERS
              </Button>

              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-gray-500 underline"
              >
                Clear All
              </button>
            </CardContent>
          </Card>

          <section>
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-600">
                Showing {startItem}–{endItem} of{" "}
                {filteredAndSortedDeals.length} Flash Deals
              </p>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="min-w-45 border-[#E5E5E5] bg-white text-sm text-gray-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
                  }
                  className={`h-10 w-10 rounded-lg border p-0 ${viewMode === "list"
                    ? "border-[#0B1F3A] bg-[#0B1F3A] text-white hover:bg-[#0B1F3A] hover:text-white"
                    : "border-[#E5E5E5] bg-white text-gray-700 hover:bg-white"
                    }`}
                >
                  <List className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>

            {flashDealsLoading ? (
              <Card className="rounded-xl border border-[#E5E5E5] bg-white shadow-none">
                <CardContent className="p-10 text-center text-gray-500">
                  Loading flash deals...
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="rounded-xl border border-red-200 bg-white shadow-none">
                <CardContent className="p-10 text-center text-red-500">
                  {typeof error === "string"
                    ? error
                    : error?.message || "Failed to load flash deals"}
                </CardContent>
              </Card>
            ) : currentDeals.length > 0 ? (
              viewMode === "list" ? (
                <div className="flex flex-col gap-4">
                  {currentDeals.map((item) => (
                    <Card
                      key={item.id}
                      className="rounded-xl border border-[#E5E5E5] bg-white shadow-none transition hover:shadow-md"
                    >
                      <CardContent className="flex gap-4 p-4">
                        <div className="h-32 w-40 shrink-0 overflow-hidden rounded-lg bg-[#FFF8EC]">
                          <img
                            src={getImage(item)}
                            alt={getTitle(item)}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            {getCategory(item)}
                          </p>

                          <h3 className="mt-1 text-lg font-semibold text-[#0B1F3A]">
                            {getTitle(item)}
                          </h3>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xl font-bold text-[#D4AF37]">
                              ₹{getPrice(item).toLocaleString()}
                            </span>

                            {getOldPrice(item) > getPrice(item) && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{getOldPrice(item).toLocaleString()}
                              </span>
                            )}

                            <span className="rounded-md bg-[#f04e23] px-2 py-1 text-xs font-bold text-white">
                              {getDiscount(item)}
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-green-600">
                            Save ₹{getSavings(item).toLocaleString()}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Min. Order: {getMinOrder(item)} Units
                          </p>

                          <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={cartLoadingId === getProductId(item)}
                            className="mt-3 bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#D4AF37]"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {cartLoadingId === getProductId(item) ? "Adding..." : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 sm:gap-5">
                  {currentDeals.map((item) => (
                    <Card
                      key={item.id}
                      className="rounded-xl border border-[#E5E5E5] bg-white shadow-none transition hover:shadow-md"
                    >
                      <CardContent className="p-3">
                        <div className="relative h-48 overflow-hidden rounded-xl bg-[#FFF8EC] sm:h-52 md:h-56">
                          <span className="absolute left-2 top-2 z-10 rounded-md bg-[#f04e23] px-2 py-1 text-[10px] font-bold text-white sm:text-xs">
                            {getDiscount(item)}
                          </span>

                          <span className="absolute right-2 top-2 z-10 rounded-md bg-[#f04e23] px-2 py-1 text-[9px] font-bold text-white sm:text-[10px]">
                            {days}:{hours}:{minutes}
                          </span>

                          <button className="absolute right-2 top-9 z-10 rounded-full bg-white/80 p-1 text-gray-400 hover:text-gray-600">
                            <Heart className="h-4 w-4" />
                          </button>

                          <img
                            src={getImage(item)}
                            alt={getTitle(item)}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="pt-3 sm:pt-4">
                          <p className="mb-1 text-[11px] text-gray-500">
                            {getCategory(item)}
                          </p>

                          <h3 className="min-h-10 text-sm font-medium leading-5 text-[#0B1F3A]">
                            {getTitle(item)}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-lg font-bold text-[#D4AF37] sm:text-xl">
                              ₹{getPrice(item).toLocaleString()}
                            </span>

                            {getOldPrice(item) > getPrice(item) && (
                              <span className="text-xs text-gray-400 line-through sm:text-sm">
                                ₹{getOldPrice(item).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs font-semibold text-green-600">
                            Save ₹{getSavings(item).toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Min. Order: {getMinOrder(item)} Units
                          </p>

                          <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={cartLoadingId === getProductId(item)}
                            className="mt-4 w-full bg-[#D4AF37] py-2.5 text-sm font-semibold text-[#0B1F3A] hover:bg-[#D4AF37]"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {cartLoadingId === getProductId(item) ? "Adding..." : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card className="rounded-xl border border-[#E5E5E5] bg-white shadow-none">
                <CardContent className="p-10 text-center text-gray-500">
                  No flash deals found.
                </CardContent>
              </Card>
            )}

            {filteredAndSortedDeals.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-10 w-10 rounded-lg border p-0 text-sm"
                >
                  ‹
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      type="button"
                      variant="outline"
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 rounded-lg border p-0 text-sm ${currentPage === page
                        ? "border-[#0B1F3A] bg-[#0B1F3A] text-white hover:bg-[#0B1F3A] hover:text-white"
                        : "border-[#E5E5E5] bg-white text-gray-700 hover:border-[#0B1F3A]"
                        }`}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10 rounded-lg border p-0 text-sm"
                >
                  ›
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}