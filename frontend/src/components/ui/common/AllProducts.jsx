import React from 'react'
import Link from "next/link";
import { productsData } from '@/app/(buyer)/product/productData';

const AllProducts = () => {


  const allProducts = Object.values(productsData).flat();

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold border-l-4 border-orange-500 pl-2">
            All Products
          </h2>
          <Link
            href="/trendingviewall"
            className="text-orange-500 text-sm hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {allProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl transition group overflow-hidden"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-2">
                <h3 className="text-xs font-semibold line-clamp-2">
                  {item.name}
                </h3>

                <p className="text-orange-600 font-semibold text-sm">
                  ₹{item.price}/unit
                </p>

                <p className="text-xs text-gray-500">
                  Min. {item.minQty} units
                </p>

                <div className="flex items-center text-xs gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{item.supplier}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
      <Link href="/trendingviewall" className="text-orange-500 text-lg cursor-pointer flex justify-center hover:underline">
        {/* <div className="w-35 h-5 flex justify-center bg-[#063149]"> */}
        View More →
        {/* </div> */}
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 border border-amber-400 bg-yellow-50 p-4 sm:p-5 rounded-xl shadow text-center">
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-orange-500">
            500+
          </h3>
          <p className="text-sm sm:text-base">Verified Vendors</p>
        </div>
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-orange-500">
            12,000+
          </h3>
          <p className="text-sm sm:text-base">Products Listed</p>
        </div>
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-orange-500">
            50,000+
          </h3>
          <p className="text-sm sm:text-base">Active Buyers</p>
        </div>
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-orange-500">
            98%
          </h3>
          <p className="text-sm sm:text-base">Order Accuracy</p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-bold text-lg sm:text-xl text-orange-500">
            ₹200Cr+
          </h3>
          <p className="text-sm sm:text-base">GMV Processed</p>
        </div>
      </div>
    </div>

  );
};

export default AllProducts;