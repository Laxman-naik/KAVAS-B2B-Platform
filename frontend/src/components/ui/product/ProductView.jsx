"use client";

import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { useState } from "react";

export default function ProductView() {
  const params = useParams();
  const id = params?.id;

  const product = products.find((p) => p.id == id);

  const [qty, setQty] = useState(50);
  const [wishlist, setWishlist] = useState(false);

  // ✅ BULK TIERS LOGIC
  const tiers = [
    { min: 50, max: 99, price: 580 },
    { min: 100, max: 249, price: 539 },
    { min: 250, max: 499, price: 505 },
    { min: 500, max: Infinity, price: 464 },
  ];

  const activeTier = tiers.find((t) => qty >= t.min && qty <= t.max);

  if (!product) {
    return <div className="p-10 text-center">Product Not Found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:px-24">
      <div className="grid lg:grid-cols-2 gap-7 items-start">

        {/* LEFT IMAGE */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300 relative">

          {/* ❤️ WISHLIST */}
          <button
            onClick={() => setWishlist(!wishlist)}
            className="absolute top-3 right-3 text-xl bg-white rounded-full p-2 shadow hover:scale-110 transition"
          >
            {wishlist ? "❤️" : "🤍"}
          </button>

          <div className="overflow-hidden rounded-lg">
            <img
              src={product.image}
              className="w-full h-[250px] sm:h-[320px] lg:h-[420px] object-contain transition duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="pt-2 sm:pt-5">

          {/* TITLE */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {product.title}
          </h1>

          {/* RATING */}
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ⭐⭐⭐⭐⭐ <span>4.8</span>{" "}
            <span className="text-blue-500">(124 reviews)</span> •{" "}
            {product.company}
          </p>

          {/* BULK PRICING */}
          <div className="mt-2 bg-yellow-50 border border-yellow-300 rounded-xl p-5 h-auto">
            <p className="text-xs sm:text-sm font-medium mb-2">
              💰 Bulk pricing tiers — save more when you order more:
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-5 cursor-pointer">

              {tiers.map((tier, i) => {
                const isActive =
                  qty >= tier.min && qty <= tier.max;

                return (
                  <div
                    key={i}
                    onClick={() => setQty(tier.min)}
                    className={`rounded-lg px-3 py-2 w-[95px] sm:w-[110px] text-center transition hover:scale-105
                      ${
                        isActive
                          ? "border-2 border-orange-500 bg-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {tier.max === Infinity
                        ? `${tier.min}+`
                        : `${tier.min}–${tier.max}`}{" "}
                      units
                    </p>

                    <p className="text-orange-600 font-bold text-sm sm:text-lg">
                      ₹{tier.price}
                    </p>

                    {!isActive && (
                      <p className="text-green-600 text-[10px] sm:text-xs">
                        Save{" "}
                        {Math.round(
                          ((580 - tier.price) / 580) * 100
                        )}
                        %
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-sm text-black-700">Quantity:</span>

            <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="px-3 sm:px-4 py-1 bg-gray-100 hover:bg-gray-200 transition"
              >
                -
              </button>

              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-14 sm:w-16 text-center outline-none"
              />

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 sm:px-4 py-1 bg-gray-100 hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>

            <span className="text-xs sm:text-sm text-gray-500">
              Min. {product.min}
            </span>
          </div>

          {/* ✅ DYNAMIC PRICE DISPLAY */}
          {/* <p className="text-lg font-bold text-orange-600 mt-2">
            ₹{activeTier?.price}/unit
          </p> */}

          {/* BUTTONS */}
          <div className="mt-4 space-y-2">

            <button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] text-white py-1.5 rounded-lg font-semibold text-sm sm:text-lg transition duration-200 shadow">
              🛒 Add to Cart
            </button>

            <button className="w-full border cursor-pointer border-gray-400 py-1.5 rounded-lg font-medium hover:bg-gray-300 transition">
              📄 Send Enquiry
            </button>

            <button className="w-full cursor-pointer bg-gray-200 py-1.5  rounded-lg font-medium text-gray-700 hover:bg-gray-300 transition">
              Buy
            </button>

          </div>

          {/* SPECIFICATIONS */}
          <div className="mt-4 rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-sm sm:text-md mb-1">
              Product Specifications
            </h3>

            <div className="text-xs sm:text-sm ">
              {[
                ["Brand", product.brand],
                ["Type", "TWS Earbuds"],
                ["Battery", "6+24hr"],
                ["Bluetooth", "5.3"],
                ["Water", "IPX5"],
                ["MOQ", product.min],
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-1 px-1">
                  <span className="text-gray-500">{item[0]}</span>
                  <span>{item[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SELLER CARD */}
          <div className="mt-4 bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">
                TL
              </div>
              <div>
                <p className="font-medium">{product.company}</p>
                <p className="text-xs text-gray-500">
                  📍 Bengaluru • Electronics
                </p>
              </div>
            </div>

            <button className="border px-4 py-2 rounded-lg text-orange-500 border-orange-400 hover:bg-orange-50 hover:scale-105 transition cursor-pointer">
              View Profile →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}