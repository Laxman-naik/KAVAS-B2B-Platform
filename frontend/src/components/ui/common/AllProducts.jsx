import React from 'react';
import Link from 'next/link';
import { productsData } from '@/app/(buyer)/product/productData';

const AllProducts = () => {
  const allProducts = Object.values(productsData).flat();

  // Only show 3 rows × 5 items = 15 products
  const visibleProducts = allProducts.slice(0, 15);

  return (
    <div className="dark:bg-gray-900">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-orange-500 pl-2">
            All Products
          </h2>
          <Link
            href="/trendingviewall"
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Image */}
              <div className="h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 min-h-10">
                  {item.name}
                </h3>

                <p className="text-orange-600 font-semibold text-sm sm:text-base mt-1">
                  ₹{item.price}/unit
                </p>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Min. {item.minQty} units
                </p>

                <div className="flex items-center text-xs sm:text-sm gap-1 mt-2 text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
                  <span className="truncate">{item.supplier}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More */}
        <div className="flex justify-center">
          <Link
            href="/trendingviewall"
            className="text-orange-500 text-sm sm:text-base font-medium hover:underline"
          >
            View More →
          </Link>
        </div>

        {/* Stats Box */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 border border-amber-400 bg-yellow-50 p-4 sm:p-5 rounded-xl shadow text-center">
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">500+</h3>
            <p className="text-sm sm:text-base">Verified Vendors</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">12,000+</h3>
            <p className="text-sm sm:text-base">Products Listed</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">50,000+</h3>
            <p className="text-sm sm:text-base">Active Buyers</p>
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">98%</h3>
            <p className="text-sm sm:text-base">Order Accuracy</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg sm:text-xl text-orange-500">₹200Cr+</h3>
            <p className="text-sm sm:text-base">GMV Processed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;