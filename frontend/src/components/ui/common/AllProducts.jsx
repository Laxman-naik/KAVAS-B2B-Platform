"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/slices/productSlice";

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

  const visibleProducts = Array.isArray(products) ? products.slice(0, 12) : [];

  return (
    <div className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
         
  <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[#D4AF37]/60"></span>

              <div className="text-[11px] font-extrabold tracking-widest text-[#0B1F3A]/60 uppercase">
                Selling All Products
              </div>
              <span className="h-px w-5 bg-[#D4AF37]/60"></span>
            </div>

            <h2 className="mt-1 text-lg sm:text-3xl font-extrabold text-[#0B1F3A]">
              All Products
            </h2>
          </div>
          <Link
            href="/allproducts"
            className="text-[#0B1F3A] text-sm font-medium hover:text-[#D4AF37]"
          >
            View all Products →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
         {visibleProducts.slice(0, 12).map((item) => {
            const itemId = item?._id ?? item?.id ?? item?.productId;

            return (
              <Link
                key={itemId}
                href={`/product/${itemId}`}
                className="group h-full rounded-xl border border-[#E5E5E5] bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="h-44 sm:h-48 bg-[#FFF8EC] overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] line-clamp-2 min-h-10">
                    {item.name}
                  </h3>

                  <div className="mt-2 text-[#0B1F3A] font-bold text-sm">
                    ₹{item.price}/unit
                  </div>

                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Min. {item.moq} units
                  </div>

                  <div className="flex items-center text-[11px] gap-1  text-gray-600 mt-auto">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                    <span className="truncate">Supplier</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {visibleProducts.length === 0 && (
          <p className="text-center py-10 text-gray-500">
            No products available
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;