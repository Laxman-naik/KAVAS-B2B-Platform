"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

const FlashDeals = () => {
  return (
    <div className="py-4 bg-white">
      <div className="max-w-350 mx-auto px-4">
        <div className="rounded-xl bg-[#0B1F3A] shadow p-3">
          <div className="w-full rounded-xl text-white p-4 sm:p-4 lg:p-5 
                          flex flex-col lg:flex-row items-start lg:items-center 
                          justify-between gap-4">

            {/* LEFT */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="text-[#D4AF37] h-4 w-4" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold">
                  Flash Deals — Ends Tonight
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                Massive discounts on bulk orders across all categories
              </p>
            </div>

            {/* MIDDLE STATS */}
            <div className="flex gap-6 sm:gap-8 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#D4AF37]">50%</p>
                <p className="text-[10px] text-gray-300">ELECTRONICS</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#D4AF37]">40%</p>
                <p className="text-[10px] text-gray-300">APPAREL</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#D4AF37]">35%</p>
                <p className="text-[10px] text-gray-300">HARDWARE</p>
              </div>
            </div>

            {/* BUTTON */}
            <Link
              href="/flashdeals"
              className="bg-[#D4AF37] text-[#0B1F3A] font-semibold px-5 py-2 rounded-md hover:opacity-95 transition text-sm"
            >
              Shop all deals →
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashDeals;