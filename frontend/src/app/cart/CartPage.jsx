"use client";
import React from "react";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-24 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              My Cart <span className="text-gray-500 text-sm">(0 items)</span>
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
            <ShoppingCart className="h-12 w-12 text-gray-600 mb-4" />

            <h3 className="text-base font-semibold mb-2">
              Your cart is empty
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Browse products and add items to get started.
            </p>

            <Link href="/products" className="inline-block">
              <button
                type="button"
                className="bg-orange-500 text-white px-6 py-2 rounded-md text-sm hover:bg-orange-600 cursor-pointer"
              >
                Browse Products
              </button>
            </Link>
          </div>

          <div className="flex gap-4 mt-4">
            <Link href="/products" className="inline-block">
              <button
                type="button"
                className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded-md text-sm hover:bg-gray-200 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </Link>

            <button
              type="button"
              className="flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 h-fit">
          <h3 className="text-base font-semibold mb-2">
            Order Summary
          </h3>

          <div className="border-b mb-2"></div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹0</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹0</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">₹0</span>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹0</span>
          </div>

          <button
            type="button"
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md text-sm font-medium cursor-pointer"
          >
            Proceed to Checkout →
          </button>

          <Link href="/products" className="inline-block w-full">
            <button
              type="button"
              className="w-full border py-2.5 rounded-md text-sm mt-3 hover:bg-gray-100 cursor-pointer"
            >
              Continue Shopping
            </button>
          </Link>

          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-2 cursor-pointer hover:underline">
              Have a coupon?
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <button
                type="button"
                className="bg-black text-white px-4 rounded-md text-sm cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;