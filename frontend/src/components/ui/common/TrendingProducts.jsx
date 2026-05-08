"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingProducts } from "@/store/slices/productSlice";

export default function TrendingProducts() {
  const dispatch = useDispatch();

  const { trending } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchTrendingProducts());
  }, [dispatch]);

  const products = Array.isArray(trending) ? trending.slice(0, 6) : [];
  return (

    <div className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[#D4AF37]/60"></span>

              <div className="text-[11px] font-extrabold tracking-widest text-[#0B1F3A]/60 uppercase">
                Best Selling Products
              </div>
              <span className="h-px w-5 bg-[#D4AF37]/60"></span>
            </div>

            <h2 className="mt-1 text-lg sm:text-3xl font-extrabold text-[#0B1F3A]">
              Trending Products
            </h2>
          </div>

          <Link
            href="/trendingviewall"
            className="text-sm font-semibold text-[#0B1F3A] hover:text-[#D4AF37]"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
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
                <div className=" text-[#0B1F3A] font-bold text-sm">
                  ₹{item.price}/unit
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Min. {item.moq} units
                </div>
                <div className="flex items-center text-[11px] gap-1  text-gray-600 mt-auto">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                  <span className="truncate">{item.stock}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="flex justify-center">
          <Link
            href="/trendingviewall"
            className="text-sm font-semibold text-[#0B1F3A] hover:text-[#D4AF37] hover:underline"
          >
            View More →
          </Link>
        </div> */}
      </div>
    </div>
  );
}
