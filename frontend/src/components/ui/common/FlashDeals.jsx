"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

const FlashDeals = () => {
  return (
    <div className="bg-gray-50 py-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">

        {/* WHITE CONTAINER */}
        <div className="rounded-2xl bg-orange-500 shadow p-5">

          {/* MAIN FLASH DEAL BOX */}
          <div className="w-full rounded-2xl  text-white p-5 sm:p-6 lg:p-8 
                          flex flex-col lg:flex-row items-start lg:items-center 
                          justify-between gap-6">

            {/* LEFT CONTENT */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-yellow-300" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  Flash Deals — Ends Tonight
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-100">
                Massive discounts on bulk orders across all categories
              </p>
            </div>

            {/* MIDDLE STATS */}
            <div className="flex gap-8 sm:gap-10 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-sky-200">50%</p>
                <p className="text-xs text-gray-100">ELECTRONICS</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-sky-200">40%</p>
                <p className="text-xs text-gray-100">APPAREL</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-sky-200">35%</p>
                <p className="text-xs text-gray-100">HARDWARE</p>
              </div>
            </div>

            {/* BUTTON */}
            <Link
              href="/flashdeals"
              className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-100 transition"
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