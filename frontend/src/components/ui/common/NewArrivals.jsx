"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "@/store/slices/productSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NewArrivals() {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { newArrivals, loading } = useSelector((state) => state.products);

   useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);


  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="py-6 bg-[#FFF8EC]">
      <div className="max-w-350 mx-auto px-4 rounded-2xl">

        <div className="flex justify-between">
          <h2 className="text-xl font-semibold border-l-4 border-[#D4AF37] text-[#0B1F3A] pl-2 mb-5">
            New Arrivals
          </h2>

          <Link href="/newarrivalsviewall">
            <span className="text-[#D4AF37] text-sm cursor-pointer hover:underline font-medium">
              View all →
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={scrollLeft}
            className="p-2 bg-white border border-[#E5E5E5] rounded-full hover:scale-110"
          >
            <ChevronLeft className="text-[#0B1F3A]" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar flex-1"
          >
            {newArrivals.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`}>
                <div className="min-w-55 bg-white border border-[#E5E5E5] rounded-xl shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-2 h-80 flex flex-col">

                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.png"}
                      className="w-full h-full object-cover group-hover:scale-110 border-none transition duration-500"
                    />
                    <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#0B1F3A] text-xs px-2 py-1 rounded-full font-semibold">
                      New
                    </span>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-[#D4AF37] font-semibold mt-1">
                        ₹{item.price}/unit
                      </p>
                      <p className="text-xs text-gray-500"> Min. {item.moq} units</p>
                    </div>

                    <div className="flex items-center mt-2 text-xs text-gray-600">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-1"></span>
                      {item.stock}
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="p-2 bg-white border border-[#E5E5E5] rounded-full hover:scale-110"
          >
            <ChevronRight className="text-[#0B1F3A]" />
          </button>

        </div>
      </div>
    </div>
  );
}