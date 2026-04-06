"use client";
import React from "react";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-16 xl:px-24 py-8 sm:py-10 dark:bg-gray-900">      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">          
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-semibold">
              My Cart <span className="text-gray-500 text-sm">(0 items)</span>
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] sm:min-h-[300px]">
            <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Your cart is empty
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Browse products and add items to get started.
            </p>

            <Link href="/products">
              <button className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm hover:bg-orange-600">
                Browse Products
              </button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/products">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-400 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </Link>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50">
              <Trash2 size={16} />
              Clear Cart
            </button>

          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 h-fit sticky top-20">
          <h3 className="text-base font-semibold mb-2">
            Order Summary
          </h3>

          <div className="border-b mb-2"></div>

          <div className="space-y-2 text-sm text-gray-600">
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

          <Link href="/checkout">
            <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md text-sm font-medium">
              Proceed to Checkout →
            </button>
          </Link>

          <Link href="/products">
            <button className="w-full border py-2.5 rounded-md text-sm mt-3 hover:bg-gray-100">
              Continue Shopping
            </button>
          </Link>

          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-2 hover:underline cursor-pointer">
              Have a coupon?
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm">
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
