"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

const FlashDeals = () => {
  return (
    <div className="py-4 ">
      <div className="max-w-350 mx-auto px-4">
        <div className="rounded-xl bg-orange-500 shadow p-3">
          <div className="w-full rounded-xl text-white p-4 sm:p-4 lg:p-5 
                          flex flex-col lg:flex-row items-start lg:items-center 
                          justify-between gap-4">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="text-yellow-300 h-4 w-4" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold">
                  Flash Deals — Ends Tonight
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-100">
                Massive discounts on bulk orders across all categories
              </p>
            </div>

            {/* MIDDLE STATS */}
            <div className="flex gap-6 sm:gap-8 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-sky-200">50%</p>
                <p className="text-[10px] text-gray-100">ELECTRONICS</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-sky-200">40%</p>
                <p className="text-[10px] text-gray-100">APPAREL</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-sky-200">35%</p>
                <p className="text-[10px] text-gray-100">HARDWARE</p>
              </div>
            </div>

            {/* BUTTON */}
            <Link
              href="/flashdeals"
              className="bg-white text-orange-600 font-semibold px-5 py-2 rounded-md hover:bg-orange-100 transition text-sm"
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