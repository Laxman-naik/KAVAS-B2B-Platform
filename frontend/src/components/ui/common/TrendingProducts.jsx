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

  const products = Array.isArray(trending) ? trending.slice(0, 8) : [];
  return (
    <section className="bg-white py-8">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm border border-[#E5E5E5] shadow-sm px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
                Trending
              </div>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Products
              </h2>
            </div>

            <Link
              href="/trendingviewall"
              className="text-sm font-medium text-[#0B1F3A] hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group bg-white border border-[#E5E5E5] rounded-sm shadow-sm hover:shadow-lg hover:border-[#D4AF37]/40 transition overflow-hidden flex flex-col min-h-[410px]"
              >
                <div className="relative h-64 bg-[#FFF8EC] overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-[#1A1A1A] leading-5 h-10 overflow-hidden">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#0B1F3A]">₹{item.price}</p>
                      <p className="text-xs text-gray-600">per unit</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Min. {item.moq} units</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 text-gray-600">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                      {item.stock}
                    </span>
                    <span className="text-[#D4AF37] font-semibold">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/trendingviewall"
              className="text-[#0B1F3A] text-sm font-medium hover:underline"
            >
              View More →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}