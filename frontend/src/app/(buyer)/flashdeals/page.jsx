"use client";
import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const products = [
  {
    name: "Wireless Earbuds Pro Max",
    price: 2499,
    old: 3999,
    discount: "-37%",
    img: "https://images.pexels.com/photos/22940565/pexels-photo-22940565.jpeg",
  },
  {
    name: "Smart Watch Series 9",
    price: 3499,
    old: 5999,
    discount: "-42%",
    img: "https://cdn-icons-png.flaticon.com/512/992/992700.png",
  },
  {
    name: "Running Shoes Air Pro",
    price: 2199,
    old: 3299,
    discount: "-33%",
    img: "https://cdn-icons-png.flaticon.com/512/2589/2589896.png",
  },
  {
    name: "Premium Laptop Backpack",
    price: 1999,
    old: 2999,
    discount: "-33%",
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
  },
  {
    name: "Insulated Water Bottle",
    price: 799,
    old: 1299,
    discount: "-33%",
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046874.png",
  },
  {
    name: "Noise Cancelling Headphones",
    price: 2999,
    old: 4499,
    discount: "-33%",
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046876.png",
  },
];

export default function FlashDealsPage() {
  const [time, setTime] = useState(172800);

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const format = (t) => {
    const d = Math.floor(t / 86400);
    const h = Math.floor((t % 86400) / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return { d, h, m, s };
  };

  const { d, h, m, s } = format(time);

  return (
    <div className="bg-[#FFF8EC] min-h-screen text-[#1A1A1A]">

      {/* 🔗 BREADCRUMB */}
      <div className="px-6 pt-4 text-sm text-gray-500">
        Home &gt; Flash Deals
      </div>

      {/* 🔥 HERO SECTION */}
      <div className="bg-[#0B1F3A] text-white rounded-xl mx-6 mt-3 px-8 py-10 flex flex-col lg:flex-row justify-between items-center relative overflow-hidden">

        {/* LEFT */}
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold">
            ⚡ FLASH <span className="text-[#D4AF37]">DEALS</span>
          </h1>

          <div className="bg-[#D4AF37] text-black inline-block px-4 py-1 mt-3 rounded text-sm font-semibold">
            LIMITED TIME ONLY!
          </div>

          <div className="mt-6">
            <p className="text-sm opacity-80">UP TO</p>
            <h2 className="text-5xl font-bold text-[#D4AF37]">
              70% OFF
            </h2>
            <p className="text-sm opacity-70">
              On Best Selling Products
            </p>
          </div>

          {/* TIMER */}
          <div className="flex gap-3 mt-4">
            {[d, h, m, s].map((t, i) => (
              <div
                key={i}
                className="bg-white/10 px-4 py-2 rounded text-center w-16"
              >
                <p className="text-lg font-bold">
                  {String(t).padStart(2, "0")}
                </p>
                <p className="text-[10px] opacity-70">
                  {["DAYS", "HRS", "MINS", "SECS"][i]}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-6 bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold hover:scale-105 transition">
            SHOP NOW
          </button>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative mt-10 lg:mt-0 flex items-end gap-4">

          {/* PLATFORM */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 bg-[#D4AF37] rounded-full blur-md opacity-40"></div>

          <img src="https://images.pexels.com/photos/30981655/pexels-photo-30981655.jpeg" className="w-20 z-10 hover:scale-110 transition" />
          <img src="/images/watch.png" className="w-24 z-20 hover:scale-110 transition" />
          <img src="/images/shoes.png" className="w-28 z-30 hover:scale-110 transition" />

          <div className="absolute bottom-2 right-0 bg-[#D4AF37] text-black text-xs px-3 py-1 rounded rotate-[-10deg] shadow">
            BEST PRICES
          </div>
        </div>
      </div>

      {/* 🧭 CATEGORY */}
      <div className="mx-6 mt-6 flex flex-wrap gap-3">
        {[
          "All Categories",
          "Electronics",
          "Fashion & Apparel",
          "Home & Kitchen",
          "Beauty & Personal Care",
          "Sports & Fitness",
          "Toys & Games",
        ].map((c, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-full border text-sm ${
              i === 0
                ? "bg-[#D4AF37]"
                : "bg-white hover:bg-[#D4AF37]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 🧱 MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-6 mt-6">

        {/* SIDEBAR */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] h-fit">
          <h3 className="font-semibold mb-3">PRICE RANGE</h3>

          <input type="range" className="w-full accent-[#D4AF37]" />

          <div className="flex justify-between text-sm mt-2">
            <span>₹0</span>
            <span>₹50,000</span>
          </div>

          <button className="mt-4 w-full bg-[#0B1F3A] text-white py-2 rounded">
            APPLY FILTERS
          </button>
        </div>

        {/* PRODUCTS */}
        <div className="md:col-span-3">

          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing 1–8 of 256 Flash Deals
            </p>

            <div className="flex items-center gap-3">
              <select className="border border-[#E5E5E5] px-3 py-1.5 rounded text-sm">
                <option>Ending Soon</option>
              </select>

              <div className="flex gap-2">
                <div className="p-2 border rounded cursor-pointer hover:bg-[#D4AF37]">▦</div>
                <div className="p-2 border rounded cursor-pointer hover:bg-[#D4AF37]">☰</div>
              </div>
            </div>
          </div>

          {/* GRID → 6 ITEMS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E5E5E5] p-3 relative group hover:shadow-lg transition"
              >
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {p.discount}
                </span>

                <span className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer">
                  <FaHeart />
                </span>

                <img
                  src={p.img}
                  className="h-24 mx-auto object-contain group-hover:scale-110 transition"
                />

                <h3 className="text-xs mt-3 font-medium">
                  {p.name}
                </h3>

                <div className="mt-2 text-sm">
                  <span className="text-[#D4AF37] font-bold">
                    ₹{p.price}
                  </span>
                  <span className="line-through text-gray-400 ml-2 text-xs">
                    ₹{p.old}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 mt-1">
                  Min. Order: 10 Units
                </p>

                <button className="mt-2 w-full bg-[#D4AF37] text-black py-1.5 rounded flex items-center justify-center gap-2 text-xs hover:bg-black hover:text-white transition">
                  <FaShoppingCart /> Add
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`px-3 py-1 rounded border ${
                  n === 1
                    ? "bg-[#0B1F3A] text-white"
                    : "bg-white hover:bg-[#D4AF37]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}