"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/slices/productSlice";

/* SESSION ID HELPER */
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    getSessionId();
    dispatch(fetchProducts());
  }, [dispatch]);

  const visibleProducts = Array.isArray(products) ? products : [];

  return (
    <div className="bg-white">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-[#D4AF37] pl-2 text-[#0B1F3A]">
            All Products
          </h2>

          <Link
            href="/allproducts"
            className="text-[#0B1F3A] text-sm font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleProducts.map((item) => {
            const itemId = item?._id ?? item?.id ?? item?.productId;

            return (
              <Link
                key={itemId}
                href={`/product/${itemId}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-[#E5E5E5]"
              >
                <div className="flex flex-col h-full">

                  {/* Image */}
                  <div className="h-36 sm:h-40 md:h-44 overflow-hidden bg-[#FFF8EC]">
                    <img
                      src={item.image_url || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">

                    <h3 className="text-xs sm:text-sm font-semibold line-clamp-2">
                      {item.name}
                    </h3>

                    <p className="text-[#D4AF37] font-semibold text-sm sm:text-base">
                      ₹{item.price}/unit
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500">
                      Min. {item.moq} units
                    </p>

                    {/* Supplier */}
                    <div className="flex items-center text-xs sm:text-sm gap-1 mt-auto text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="truncate">Supplier</span>
                    </div>

                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {visibleProducts.length === 0 && (
          <p className="text-center py-10 text-gray-500">
            No products available
          </p>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 border border-[#D4AF37] bg-[#0B1F3A] p-4 sm:p-5 rounded-xl shadow text-center">
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-[#D4AF37]">500+</h3>
            <p className="text-sm sm:text-base text-white/85">Verified Vendors</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-[#D4AF37]">12,000+</h3>
            <p className="text-sm sm:text-base text-white/85">Products Listed</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-[#D4AF37]">50,000+</h3>
            <p className="text-sm sm:text-base text-white/85">Active Buyers</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-[#D4AF37]">98%</h3>
            <p className="text-sm sm:text-base text-white/85">Order Accuracy</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg sm:text-xl text-[#D4AF37]">₹200Cr+</h3>
            <p className="text-sm sm:text-base text-white/85">GMV Processed</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllProducts;