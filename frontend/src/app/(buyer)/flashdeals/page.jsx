"use client";
import React, { useEffect, useState } from "react";

const deals = [
  {
    title: "Wireless Earbuds TWS Pro",
    price: 450,
    oldPrice: 750,
    discount: "40%",
    img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
  },
  {
    title: "Cotton T-Shirts Wholesale",
    price: 88,
    oldPrice: 160,
    discount: "45%",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    title: "SS Bolt Set Hardware Kit",
    price: 780,
    oldPrice: 1250,
    discount: "38%",
    img: "https://images.unsplash.com/photo-1581091215367-59ab6b1b0c57",
  },
  {
    title: "Hand Sanitizer 500ml Bulk",
    price: 58,
    oldPrice: 100,
    discount: "42%",
    img: "https://images.unsplash.com/photo-1585435557343-3b092031a831",
  },
];

export default function FlashDealsPage() {
  const [time, setTime] = useState(36000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, "0")} : ${m
      .toString()
      .padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#FFF8EC] min-h-screen text-[#1A1A1A]">
      <div className="bg-[#0B1F3A] text-white w-full p-5 text-center relative overflow-hidden">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          🔥 Flash Deals & Bulk Discounts
        </h1>

        <p className="text-xs sm:text-sm opacity-80">
          Exclusive wholesale discounts — limited time only
        </p>

        <div className="mt-4 bg-[#D4AF37] text-black inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-lg sm:text-xl font-bold">
          {formatTime()}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
          {["All Deals", "Electronics", "Apparel", "Hardware", "FMCG", "Healthcare"].map(
            (item, i) => (
              <button
                key={i}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm whitespace-nowrap rounded-full border border-[#E5E5E5] bg-white shadow hover:bg-[#D4AF37] hover:text-black transition"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#E5E5E5]">
          <h2 className="font-bold mb-4 text-sm sm:text-base">
            Exclusive Coupon Codes
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {["BULK500", "FIRST15", "PRO20", "KAVAS30"].map((code, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-lg bg-[#D4AF37] text-black hover:scale-105 transition-transform duration-200"
              >
                <h3 className="font-bold text-base sm:text-lg">{code}</h3>
                <p className="text-xs sm:text-sm opacity-80">Copy code</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <h2 className="font-bold mb-4 text-base sm:text-lg">
          Today's Best Deals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-5 gap-4 sm:gap-5">
          {deals.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow border border-[#E5E5E5] overflow-hidden group hover:-translate-y-2 hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={item.img}
                  alt=""
                  className="h-52 sm:h-52 md:h-60 w-full object-cover group-hover:scale-110 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#0B1F3A] text-white text-xs px-2 py-1 rounded">
                  {item.discount} OFF
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-sm font-semibold">{item.title}</h3>

                <div className="mt-2">
                  <span className="text-[#D4AF37] font-bold">
                    ₹{item.price}
                  </span>
                  <span className="line-through text-gray-400 ml-2 text-xs sm:text-sm">
                    ₹{item.oldPrice}
                  </span>
                </div>

                <button className="mt-3 w-full bg-[#0B1F3A] text-white py-2 rounded hover:bg-[#061428] transition text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}