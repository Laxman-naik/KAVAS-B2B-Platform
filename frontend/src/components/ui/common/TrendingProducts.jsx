"use client"
import { products } from "@/data/products";
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

    <div className="bg-white">
      {/* <div className="bg-red-100 rounded-xl "> */}
      <div className="max-w-350 mx-auto sm:px-6 py-6 space-y-6">

        <div className="flex justify-between">
          <h2 className="text-xl font-semibold border-l-4 border-[#D4AF37] text-[#0B1F3A] pl-2">
            Trending Products
          </h2>
          <Link href="/trendingviewall" className="text-[#D4AF37] text-sm cursor-pointer hover:underline font-medium">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((item) => (
            <Link
              key={ item.id}
              href={`/product/${item.id}`}
              className="bg-white border border-[#E5E5E5] rounded-xl shadow-sm hover:shadow-xl transition group overflow-hidden"
            >
              <div className="h-56 overflow-hidden">
                <img src={item.image_url || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-[#1A1A1A]">{item.name}</h3>
                <p className="text-[#D4AF37] font-semibold">₹{item.price}/unit</p>
                <p className="text-xs text-gray-500">Min. {item.moq} units</p>
                <div className="flex items-center text-xs gap-1 mt-1 text-gray-600">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                  <span>{item.stock}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/trendingviewall" className="text-[#D4AF37] text-sm cursor-pointer flex justify-center hover:underline font-medium">
          {/* <div className="w-35 h-5 flex justify-center bg-[#063149]"> */}
          View More →
          {/* </div> */}
        </Link>

      </div>
      {/* </div> */}
    </div>
  );
}