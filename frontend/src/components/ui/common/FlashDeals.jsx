"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

const FlashDeals = () => {
  return (
    <div className="py-4 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#071a33] via-[#0b2a55] to-[#04101f] text-white shadow">

          <div className="grid lg:grid-cols-2 items-center px-5 py-6 md:px-8 md:py-7">

            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-[#D4AF37] h-4 w-4" />
                <span className="text-xs font-semibold text-[#D4AF37]">
                  LIMITED TIME
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Flash Deals
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 mt-1 mb-4 max-w-md">
                Up to <span className="text-[#D4AF37] font-bold">70% OFF</span>{" "}
                on bulk orders across categories
              </p>

              {/* TIMER */}
              <div className="flex gap-2 mb-4">
                {["02", "14", "36", "48"].map((t, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg bg-white/10 flex flex-col items-center justify-center text-xs"
                  >
                    <span className="font-bold text-sm">{t}</span>
                    <span className="text-[9px] text-gray-300">
                      {["D", "H", "M", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/flashdeals"
                className="inline-block bg-[#D4AF37] text-[#0B1F3A] font-semibold px-4 py-2 rounded-md text-sm hover:opacity-95 transition"
              >
                Shop Deals →
              </Link>
            </div>

            {/* RIGHT IMAGES */}
            {/* RIGHT IMAGES */}
            <div className="hidden lg:flex justify-center relative h-[200px]">

              {/* glow */}
              <div className="absolute bottom-0 w-56 h-12 bg-[#D4AF37] blur-xl opacity-30 rounded-full"></div>

              <img
                src="https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=400"
                className="absolute left-6 top-6 w-24 h-24 object-cover rounded-xl shadow-lg"
              />

              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500"
                className="absolute left-1/2 -translate-x-1/2 top-0 w-28 h-36 object-cover rounded-2xl shadow-xl"
              />

              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500"
                className="absolute right-6 top-10 w-32 h-20 object-cover rounded-2xl shadow-lg"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashDeals;