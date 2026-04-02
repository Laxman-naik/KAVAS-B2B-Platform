"use client";

import Link from "next/link";
import { useState } from "react";

const products = [
  {
    id: "1",
    title: "Wireless Earbuds TWS Pro Bulk",
    category: "Audio & Headphones",
    price: "₹580/unit",
    min: "Min. 50 units",
    company: "TechLink India",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
  },
  {
    id: "2",
    title: "Lithium Power Bank 20000mAh OEM",
    category: "Power & Batteries",
    price: "₹750/unit",
    min: "Min. 25 units",
    company: "EnergyTech Co.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
  },
  {
    id: "3",
    title: "Cotton T-Shirts Round-Neck Wholesale",
    category: "T-Shirts & Tops",
    price: "₹110/unit",
    min: "Min. 100 units",
    company: "FabricWorld Co.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    id: "4",
    title: "Polo T-Shirts Corporate Bulk",
    category: "T-Shirts & Tops",
    price: "₹210/unit",
    min: "Min. 50 units",
    company: "PoloPlus India",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  },
  {
    id: "5",
    title: "SS Bolt Set Stainless Steel Kit",
    category: "Fasteners & Bolts",
    price: "₹980/unit",
    min: "Min. 20 units",
    company: "BoltCraft Co.",
    image: "https://images.unsplash.com/photo-1581091215367-59ab6b5b6f6d",
  },
  {
    id: "6",
    title: "Hand Sanitizer 500ml Bulk Pack",
    category: "Personal Care",
    price: "₹78/unit",
    min: "Min. 500 units",
    company: "NovaDerm Supplies",
    image: "https://images.unsplash.com/photo-1585238342028-4b2cfcab8d6d",
  },
  {
    id: "7",
    title: "Office Chair Ergonomic Mesh Bulk",
    category: "Chairs & Seating",
    price: "₹3,600/unit",
    min: "Min. 10 units",
    company: "FurniCraft India",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
  },
  {
    id: "8",
    title: "Body Lotion 300ml Wholesale",
    category: "Skincare & Lotions",
    price: "₹95/unit",
    min: "Min. 100 units",
    company: "NovaDerm",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
  },
];

export default function TrendingProducts() {
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-[#2c1a0c] to-[#d46a00] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm opacity-80">Home › Trending Products</p>

          <div className="flex justify-between items-center mt-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🔥 Trending Products
            </h1>

            <Link href="/">
              <span className="text-sm cursor-pointer hover:underline">
                ← Back to Home
              </span>
            </Link>
          </div>

          <p className="text-sm mt-1 opacity-90">
            Best-selling wholesale products across all categories
          </p>
        </div>
      </div>

      {/* 🔥 GRID */}
      <div className="max-w-7xl mx-auto p-5">
        <p className="text-gray-600 mb-4">
          Showing trending products across all categories
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 group overflow-hidden flex flex-col"
            >

              {/* IMAGE */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(item.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:scale-110 transition"
                >
                  {wishlist[item.id] ? "❤️" : "🤍"}
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col justify-between flex-1">

                <div>
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-orange-500 mt-1">
                    {item.category}
                  </p>

                  <p className="text-orange-600 font-bold mt-1">
                    {item.price}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.min}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    • {item.company}
                  </p>
                </div>

                {/* BUTTON */}
                <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition transform hover:scale-105 active:scale-95">
                  🛒 Add
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}