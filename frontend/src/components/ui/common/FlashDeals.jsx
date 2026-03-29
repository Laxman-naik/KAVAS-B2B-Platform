"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, Lock, Truck, Handshake, RefreshCcw, } from "lucide-react";

const FlashDeals = () => {
  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <div className="w-full rounded-2xl bg-orange-500  text-white p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="py-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-yellow-400" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                Flash Deals — Ends Tonight
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-200">
              Massive discounts on bulk orders across all categories
            </p>
          </div>
          <div className="flex flex-wrap gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-sky-300">50%</p>
              <p className="text-xs text-gray-200">ELECTRONICS</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-sky-300">40%</p>
              <p className="text-xs text-gray-200">APPAREL</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-sky-300">35%</p>
              <p className="text-xs text-gray-200">HARDWARE</p>
            </div>
          </div>
          <Button className="bg-white text-orange-600 font-bold px-7 py-5 rounded-lg hover:bg-orange-100">
            Shop all deals →
          </Button>
        </div>
        <div className="w-full rounded-2xl border bg-gray-50 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 place-items-center">
          <div className="flex flex-col items-center justify-center text-center gap-3  w-56 h-36 sm:w-64 sm:h-40 rounded-full bg-white shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 lg:col-span-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <p className="font-bold text-sm sm:text-base leading-none">Verified Suppliers</p>
            <p className="text-xs text-gray-500 px-4 mt-0 leading-tight">Every vendor vetted</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-3  w-56 h-36 sm:w-64 sm:h-40 rounded-full bg-white shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 lg:col-span-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Lock className="text-yellow-600 w-6 h-6" />
            </div>
            <p className="font-bold text-sm sm:text-base leading-none">Secure Payments</p>
            <p className="text-xs text-gray-500 px-4 mt-0 leading-tight">Escrow on all orders</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-3  w-56 h-36 sm:w-64 sm:h-40 rounded-full bg-white  shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300  lg:col-span-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Truck className="text-orange-600 w-6 h-6" />
            </div>
            <p className="font-bold text-sm sm:text-base leading-none">Pan-India Delivery</p>
            <p className="text-xs text-gray-500 px-4 mt-0 leading-tight">Across 28 states</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-3  w-56 h-36 sm:w-64 sm:h-40 rounded-full bg-white shadow-md hover:shadow-xl  transform hover:scale-105 transition-all duration-300 lg:col-start-2 lg:col-span-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Handshake className="text-yellow-700 w-6 h-6" />
            </div>
            <p className="font-bold text-sm sm:text-base leading-none">Dedicated Support</p>
            <p className="text-xs text-gray-500 px-4 mt-0 leading-tight">Account manager</p>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-3 w-56 h-36 sm:w-64 sm:h-40 rounded-full bg-white shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 lg:col-span-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <RefreshCcw className="text-green-600 w-6 h-6" />
            </div>
            <p className="font-bold text-sm sm:text-base leading-none">Easy Returns</p>
            <p className="text-xs text-gray-500 px-4 mt-0 leading-tight">Hassle-free</p>
          </div>
        </div>
      </div>

    </>
  )
}

export default FlashDeals