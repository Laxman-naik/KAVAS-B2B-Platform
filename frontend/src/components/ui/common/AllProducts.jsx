"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/slices/productSlice";

/* SESSION ID HELPER */
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // 🔥 ensure session exists (for tracking)
    getSessionId();

    dispatch(fetchProducts());
  }, [dispatch]);

  const visibleProducts = Array.isArray(products) ? products : [];

  return (
    <div className="dark:bg-gray-900">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-orange-500 pl-2">
            All Products
          </h2>

          <Link
            href="/allproducts"
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center py-10">Loading products...</p>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visibleProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-100">
                    <img
                      src={item.image_url || "https://placehold.co/400x400"}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x400";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 min-h-10">
                      {item.name}
                    </h3>

                    <p className="text-orange-600 font-semibold text-sm sm:text-base mt-1">
                      ₹{item.price}/unit
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Min. {item.moq} units
                    </p>

                    {/* 🔥 RATING UI (NEW) */}
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <span className="text-yellow-500">
                        ⭐ {Number(item.avg_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-gray-500">
                        ({item.total_reviews || 0})
                      </span>
                    </div>

                    {/* Supplier */}
                    <div className="flex items-center text-xs sm:text-sm gap-1 mt-2 text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="truncate">Supplier</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {visibleProducts.length === 0 && (
              <p className="text-center py-10 text-gray-500">
                No products available
              </p>
            )}
          </>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 border border-amber-400 bg-yellow-50 p-4 sm:p-5 rounded-xl shadow text-center">
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">500+</h3>
            <p className="text-sm sm:text-base">Verified Vendors</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">12,000+</h3>
            <p className="text-sm sm:text-base">Products Listed</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">50,000+</h3>
            <p className="text-sm sm:text-base">Active Buyers</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">98%</h3>
            <p className="text-sm sm:text-base">Order Accuracy</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">₹200Cr+</h3>
            <p className="text-sm sm:text-base">GMV Processed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;