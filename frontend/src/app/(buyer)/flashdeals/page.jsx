"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Heart,
  ShoppingCart,
  Zap,
  List,
} from "lucide-react";

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
    <div className="bg-[#FFF8EC] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* HERO BANNER */}
        <div className="rounded-sm overflow-hidden bg-[#0B1F3A] text-white shadow-md mb-6">
          <div className="grid lg:grid-cols-3 items-center px-5 py-6 md:px-8 md:py-8 gap-6">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-[#D4AF37] h-4 w-4" />
                <span className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
                  Limited Time
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-none">
                FLASH DEALS
              </h1>

              <p className="text-sm sm:text-base text-[#FFF8EC]/80 mt-3 max-w-md">
                Up to <span className="text-[#D4AF37] font-bold">70% OFF</span>{" "}
                on best selling products across categories.
              </p>
            </div>

            {/* MIDDLE COUNTDOWN */}
            <div className="flex flex-col items-start lg:items-center justify-center">
              <div className="bg-[#D4AF37] text-[#0B1F3A] border border-[#E5E5E5] rounded-xl p-4 sm:p-5 w-full max-w-[320px] shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-[#0B1F3A]/80 mb-4 text-left lg:text-center">
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
                      className="flex-1 min-w-0 h-16 rounded-xl bg-white/30 border border-white/40 flex flex-col items-center justify-center"
                    >
                      <span className="font-bold text-lg sm:text-xl">
                        {item.value}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#0B1F3A]/80">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT IMAGES */}
            <div className="hidden lg:flex justify-center relative h-[230px] xl:h-[250px] mt-2">
              <div className="absolute bottom-2 w-72 h-14 bg-[#D4AF37] blur-2xl opacity-30 rounded-full" />

              <img
                src="https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=500&auto=format&fit=crop"
                alt="Earbuds"
                className="absolute left-0 top-16 w-24 h-24 object-cover rounded-2xl shadow-xl border border-white/10"
              />

              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500&auto=format&fit=crop"
                alt="Watch"
                className="absolute left-20 top-0 w-28 h-36 object-cover rounded-2xl shadow-2xl border border-white/10"
              />

              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
                alt="Shoes"
                className="absolute right-0 top-10 w-32 h-24 object-cover rounded-2xl shadow-xl border border-white/10"
              />

              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop"
                alt="Headphones"
                className="absolute left-12 bottom-6 w-24 h-24 object-cover rounded-2xl shadow-xl border border-white/10"
              />

              <img
                src="https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=500&auto=format&fit=crop"
                alt="Speaker"
                className="absolute right-10 bottom-0 w-24 h-24 object-cover rounded-2xl shadow-xl border border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                selectedCategory === item
                  ? "bg-[#D4AF37] text-[#0B1F3A] border-[#D4AF37] font-semibold"
                  : "bg-white text-gray-700 border-[#E5E5E5] hover:border-[#D4AF37]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-xl border border-[#E5E5E5] p-4 h-fit">
            <h2 className="text-sm font-bold text-[#0B1F3A] uppercase mb-4">
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

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="border rounded-lg px-3 py-2 text-sm bg-[#FFF8EC] border-[#E5E5E5]">
                ₹0
              </div>
              <div className="border rounded-lg px-3 py-2 text-sm bg-[#FFF8EC] border-[#E5E5E5]">
                ₹{priceRange.toLocaleString()}
              </div>
            </div>

            <button className="w-full mt-4 bg-[#0B1F3A] text-white py-3 rounded-lg font-semibold">
              APPLY FILTERS
            </button>

            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-gray-500 underline"
            >
              Clear All
            </button>
          </aside>

          {/* Right content */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <p className="text-sm text-gray-600">
                Showing {startItem}–{endItem} of {filteredAndSortedDeals.length} Flash Deals
              </p>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-[#E5E5E5] rounded-lg pl-4 pr-10 py-2 text-sm text-gray-700 outline-none min-w-[180px]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition ${
                    viewMode === "list"
                      ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                      : "bg-white text-gray-700 border-[#E5E5E5]"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {currentDeals.length > 0 ? (
              viewMode === "list" ? (
                <div className="flex flex-col gap-4">
                  {currentDeals.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex gap-4 hover:shadow-md transition"
                    >
                      <div className="w-40 h-32 bg-[#FFF8EC] rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{item.category}</p>

                        <h3 className="text-lg font-semibold text-[#0B1F3A] mt-1">
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

                        <p className="text-sm text-gray-500 mt-1">
                          Min. Order: {item.minOrder} Units
                        </p>

                        <button className="mt-3 bg-[#D4AF37] text-[#0B1F3A] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                  {currentDeals.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-[#E5E5E5] p-3 hover:shadow-md transition"
                    >
                      <div className="relative bg-[#FFF8EC] rounded-xl overflow-hidden h-48 sm:h-52 md:h-56">
                        <span className="absolute top-2 left-2 bg-[#f04e23] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md z-10">
                          {item.discount}
                        </span>

                        <span className="absolute top-2 right-2 bg-[#f04e23] text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md z-10">
                          {days}:{hours}:{minutes}
                        </span>

                        <button className="absolute right-2 top-9 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full p-1">
                          <Heart size={16} />
                        </button>

                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="pt-3 sm:pt-4">
                        <p className="text-[11px] text-gray-500 mb-1">{item.category}</p>

                        <h3 className="text-sm font-medium text-[#0B1F3A] leading-5 min-h-[40px]">
                          {item.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-lg sm:text-xl font-bold text-[#D4AF37]">
                            ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{item.oldPrice.toLocaleString()}
                          </span>
                        </div>

                        <p className="mt-1 text-xs sm:text-sm text-gray-500">
                          Min. Order: {item.minOrder} Units
                        </p>

                        <button className="mt-4 w-full bg-[#D4AF37] text-[#0B1F3A] font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-95 transition text-sm">
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-10 text-center text-gray-500">
                No products found for the selected filters.
              </div>
            )}

            {/* Pagination */}
            {filteredAndSortedDeals.length > 0 && (
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg border text-sm ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 border-[#E5E5E5] cursor-not-allowed"
                      : "bg-white text-gray-700 border-[#E5E5E5] hover:border-[#0B1F3A]"
                  }`}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg border text-sm ${
                        currentPage === page
                          ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                          : "bg-white text-gray-700 border-[#E5E5E5] hover:border-[#0B1F3A]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-lg border text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 border-[#E5E5E5] cursor-not-allowed"
                      : "bg-white text-gray-700 border-[#E5E5E5] hover:border-[#0B1F3A]"
                  }`}
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}