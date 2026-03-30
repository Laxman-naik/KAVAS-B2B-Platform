"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <div className="bg-gray-100 min-h-screen p-4 px-35">
      <div className="bg-orange-500 text-white rounded-xl p-8 text-center relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-2">
          🔥 Flash Deals & Bulk Discounts
        </h1>
        <p className="text-sm opacity-80">
          Exclusive wholesale discounts — limited time only
        </p>

        <div className="mt-4 bg-white/20 inline-block px-6 py-3 rounded-lg text-xl font-bold">
          {formatTime()}
        </div>
      </div>
      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        {["All Deals", "Electronics", "Apparel", "Hardware", "FMCG"].map(
          (item, i) => (
            <button
              key={i}
              className="px-4 py-2 rounded-full bg-white shadow hover:bg-orange-500 hover:text-white transition"
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="bg-orange-500 text-white mt-6 p-6 rounded-xl">
        <h2 className="font-bold mb-4">🏷 Exclusive Coupon Codes</h2>

        <div className="grid md:grid-cols-4 gap-4">
          {["BULK500", "FIRST15", "PRO20", "KAVAS30"].map((code, i) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={i}
              className="bg-white/10 p-4 rounded-lg backdrop-blur"
            >
              <h3 className="font-bold text-lg">{code}</h3>
              <p className="text-sm opacity-80">Copy code</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-bold mb-4 text-lg">Today's Best Deals</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {deals.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={item.img}
                  alt=""
                  className="h-60 w-full object-cover group-hover:scale-110 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {item.discount} OFF
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold">{item.title}</h3>

                <div className="mt-2">
                  <span className="text-orange-600 font-bold">
                    ₹{item.price}
                  </span>
                  <span className="line-through text-gray-400 ml-2 text-sm">
                    ₹{item.oldPrice}
                  </span>
                </div>

                <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
