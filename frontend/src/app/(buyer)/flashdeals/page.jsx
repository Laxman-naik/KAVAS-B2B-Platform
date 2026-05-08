"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Heart,
  ShoppingCart,
  Zap,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const deals = [
  {
    id: 1,
    title: "Wireless Earbuds Pro Max",
    category: "Electronics",
    price: 2499,
    oldPrice: 3999,
    discount: "-37%",
    minOrder: 10,
    img: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Smart Watch Series 9",
    category: "Electronics",
    price: 3499,
    oldPrice: 5999,
    discount: "-42%",
    minOrder: 5,
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Running Shoes Air Pro",
    category: "Sports & Fitness",
    price: 2199,
    oldPrice: 3299,
    discount: "-33%",
    minOrder: 12,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Premium Laptop Backpack",
    category: "Fashion & Apparel",
    price: 1999,
    oldPrice: 2999,
    discount: "-33%",
    minOrder: 10,
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Insulated Water Bottle",
    category: "Home & Kitchen",
    price: 799,
    oldPrice: 1299,
    discount: "-33%",
    minOrder: 20,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Noise Cancelling Headphones",
    category: "Electronics",
    price: 2999,
    oldPrice: 4499,
    discount: "-33%",
    minOrder: 15,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Polarized Sunglasses Pro 2",
    category: "Fashion & Apparel",
    price: 1299,
    oldPrice: 1999,
    discount: "-39%",
    minOrder: 10,
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Travel Duffel Bag",
    category: "Fashion & Apparel",
    price: 1599,
    oldPrice: 2499,
    discount: "-36%",
    minOrder: 6,
    img: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Bluetooth Speaker",
    category: "Electronics",
    price: 1499,
    oldPrice: 2299,
    discount: "-35%",
    minOrder: 7,
    img: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Casual Sneakers",
    category: "Fashion & Apparel",
    price: 1899,
    oldPrice: 2799,
    discount: "-32%",
    minOrder: 8,
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
  },
];

const categories = [
  "All Categories",
  "Electronics",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Toys & Games",
];

const sortOptions = [
  { label: "Ending Soon", value: "ending" },
  { label: "Price: Low to High", value: "priceLow" },
  { label: "Price: High to Low", value: "priceHigh" },
  { label: "Biggest Discount", value: "discountHigh" },
  { label: "Newest", value: "newest" },
];

export default function FlashDealsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("ending");
  const [priceRange, setPriceRange] = useState(50000);
  const [viewMode, setViewMode] = useState("grid");

  const [timeLeft, setTimeLeft] = useState(
    2 * 24 * 60 * 60 + 14 * 60 * 60 + 36 * 60 + 48
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const days = String(Math.floor(timeLeft / (24 * 60 * 60))).padStart(2, "0");
  const hours = String(
    Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60))
  ).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % (60 * 60)) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];

    if (selectedCategory !== "All Categories") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    result = result.filter((item) => item.price <= priceRange);

    switch (sortBy) {
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "discountHigh":
        result.sort(
          (a, b) =>
            parseInt(b.discount.replace("-", "").replace("%", "")) -
            parseInt(a.discount.replace("-", "").replace("%", ""))
        );
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [selectedCategory, sortBy, priceRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedDeals.length / itemsPerPage)
  );

  const currentDeals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedDeals.slice(start, end);
  }, [currentPage, filteredAndSortedDeals]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, priceRange]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSortBy("ending");
    setPriceRange(50000);
    setCurrentPage(1);
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
      <div className="mx-auto max-w-[1500px] px-4 py-6">
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
                Up to <span className="font-bold text-[#D4AF37]">70% OFF</span>{" "}
                on best selling products across categories.
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

            <div className="relative mt-2 hidden h-[230px] justify-center lg:flex xl:h-[250px]">
              <div className="absolute bottom-2 h-14 w-72 rounded-full bg-[#D4AF37] opacity-30 blur-2xl" />

              <img
                src="https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=500&auto=format&fit=crop"
                alt="Earbuds"
                className="absolute left-0 top-16 h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-xl"
              />

              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500&auto=format&fit=crop"
                alt="Watch"
                className="absolute left-20 top-0 h-36 w-28 rounded-2xl border border-white/10 object-cover shadow-2xl"
              />

              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
                alt="Shoes"
                className="absolute right-0 top-10 h-24 w-32 rounded-2xl border border-white/10 object-cover shadow-xl"
              />

              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop"
                alt="Headphones"
                className="absolute bottom-6 left-12 h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-xl"
              />

              <img
                src="https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=500&auto=format&fit=crop"
                alt="Speaker"
                className="absolute bottom-0 right-10 h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-xl"
              />
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

              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
              </div>

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
                Showing {startItem}–{endItem} of {filteredAndSortedDeals.length} Flash Deals
              </p>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="min-w-[180px] border-[#E5E5E5] bg-white text-sm text-gray-700">
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
                  <List className="h-[18px] w-[18px]" />
                </Button>
              </div>
            </div>

            {currentDeals.length > 0 ? (
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
                            src={item.img}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{item.category}</p>

                          <h3 className="mt-1 text-lg font-semibold text-[#0B1F3A]">
                            {item.title}
                          </h3>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xl font-bold text-[#D4AF37]">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{item.oldPrice.toLocaleString()}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-500">
                            Min. Order: {item.minOrder} Units
                          </p>

                          <Button className="mt-3 bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#D4AF37]">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
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
                            {item.discount}
                          </span>

                          <span className="absolute right-2 top-2 z-10 rounded-md bg-[#f04e23] px-2 py-1 text-[9px] font-bold text-white sm:text-[10px]">
                            {days}:{hours}:{minutes}
                          </span>

                          <button className="absolute right-2 top-9 z-10 rounded-full bg-white/80 p-1 text-gray-400 hover:text-gray-600">
                            <Heart className="h-4 w-4" />
                          </button>

                          <img
                            src={item.img}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="pt-3 sm:pt-4">
                          <p className="mb-1 text-[11px] text-gray-500">{item.category}</p>

                          <h3 className="min-h-[40px] text-sm font-medium leading-5 text-[#0B1F3A]">
                            {item.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-lg font-bold text-[#D4AF37] sm:text-xl">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through sm:text-sm">
                              ₹{item.oldPrice.toLocaleString()}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Min. Order: {item.minOrder} Units
                          </p>

                          <Button className="mt-4 w-full bg-[#D4AF37] py-2.5 text-sm font-semibold text-[#0B1F3A] hover:bg-[#D4AF37]">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
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
                  No products found for the selected filters.
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
                  className={`h-10 w-10 rounded-lg border p-0 text-sm ${currentPage === 1
                    ? "cursor-not-allowed border-[#E5E5E5] bg-gray-100 text-gray-400"
                    : "border-[#E5E5E5] bg-white text-gray-700 hover:border-[#0B1F3A]"
                    }`}
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
                  className={`h-10 w-10 rounded-lg border p-0 text-sm ${currentPage === totalPages
                    ? "cursor-not-allowed border-[#E5E5E5] bg-gray-100 text-gray-400"
                    : "border-[#E5E5E5] bg-white text-gray-700 hover:border-[#0B1F3A]"
                    }`}
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