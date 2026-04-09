"use client";

import Link from "next/link";
import { productsData } from "@/app/(buyer)/product/productData";
import { slugify, deslugify } from "@/utils/slugify";

export default function ProductPage({ params }) {
  const { category, subcategory, productId } = params;

  const categoryProducts = productsData[category] || [];

  const product = categoryProducts.find(
    (p) =>
      p.id === Number(productId) &&
      slugify(p.subcategory) === subcategory
  );

  const relatedProducts = categoryProducts
    .filter(
      (p) =>
        slugify(p.subcategory) === subcategory &&
        p.id !== Number(productId)
    )
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border rounded-2xl shadow-sm p-6 text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800">
            Product not found
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            The product you are looking for may have been removed or the link is incorrect.
          </p>
          <Link
            href={`/products/${category}`}
            className="inline-block mt-4 bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/products/${category}`}
            className="hover:text-orange-500 capitalize"
          >
            {category}
          </Link>
          <span>/</span>
          <Link
            href={`/products/${category}/${subcategory}`}
            className="hover:text-orange-500"
          >
            {deslugify(subcategory)}
          </Link>
          <span>/</span>
          <span className="text-gray-700 line-clamp-1">{product.name}</span>
        </div>

        {/* Top section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left: product image */}
          <div className="xl:col-span-5">
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <div className="w-full h-[280px] sm:h-[380px] md:h-[460px] bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* thumbnail placeholder row */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg border bg-gray-100 overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: details */}
          <div className="xl:col-span-4">
            <div className="bg-white border rounded-2xl p-5 sm:p-6 shadow-sm h-full">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
                  B2B Wholesale
                </span>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {product.supplier}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Category:{" "}
                <span className="text-gray-700 font-medium capitalize">
                  {category}
                </span>{" "}
                /{" "}
                <span className="text-gray-700 font-medium">
                  {deslugify(subcategory)}
                </span>
              </p>

              <div className="mt-5">
                <p className="text-3xl sm:text-4xl font-bold text-orange-600">
                  ₹{product.price}
                  <span className="text-sm font-medium text-gray-500 ml-1">
                    / unit
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Price may vary depending on quantity and customization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Minimum Order Quantity</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {product.minQty} units
                  </p>
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className="text-base font-semibold text-green-600 mt-1">
                    In Stock
                  </p>
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Business Type</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    Manufacturer / Supplier
                  </p>
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Dispatch Time</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    3 - 7 Days
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Description
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-7">
                  {product.name} is designed for wholesale buyers, distributors,
                  retailers, and bulk procurement businesses. This product offers
                  dependable quality, competitive pricing, and reliable supply for
                  ongoing business requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Right: inquiry card */}
          <div className="xl:col-span-3">
            <div className="bg-white border rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900">
                Send Inquiry
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Get best quotation from verified supplier.
              </p>

              <div className="mt-4 space-y-3">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition">
                  Request Quote
                </button>

                <button className="w-full border border-gray-300 hover:border-orange-500 hover:text-orange-500 py-3 rounded-xl font-medium transition">
                  Contact Supplier
                </button>

                <button className="w-full border border-gray-300 hover:border-orange-500 hover:text-orange-500 py-3 rounded-xl font-medium transition">
                  WhatsApp Supplier
                </button>
              </div>

              <div className="mt-6 border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Supplier</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {product.supplier}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Response Rate</p>
                  <p className="text-sm font-semibold text-gray-900">92%</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">GST</p>
                  <p className="text-sm font-semibold text-gray-900">
                    GST Invoice Available
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">
                    India
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-sm font-medium text-yellow-800">
                  Buyer Protection
                </p>
                <p className="text-xs text-yellow-700 mt-1 leading-6">
                  Deal with trusted suppliers, check product details carefully,
                  and request samples before large bulk orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications + Supplier Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 border rounded-xl overflow-hidden">
              <div className="p-4 border-b sm:border-r bg-gray-50 text-sm font-medium text-gray-600">
                Product Name
              </div>
              <div className="p-4 border-b text-sm text-gray-900">
                {product.name}
              </div>

              <div className="p-4 border-b sm:border-r bg-gray-50 text-sm font-medium text-gray-600">
                Category
              </div>
              <div className="p-4 border-b text-sm text-gray-900 capitalize">
                {category}
              </div>

              <div className="p-4 border-b sm:border-r bg-gray-50 text-sm font-medium text-gray-600">
                Subcategory
              </div>
              <div className="p-4 border-b text-sm text-gray-900">
                {deslugify(subcategory)}
              </div>

              <div className="p-4 border-b sm:border-r bg-gray-50 text-sm font-medium text-gray-600">
                MOQ
              </div>
              <div className="p-4 border-b text-sm text-gray-900">
                {product.minQty} units
              </div>

              <div className="p-4 border-b sm:border-r bg-gray-50 text-sm font-medium text-gray-600">
                Price
              </div>
              <div className="p-4 border-b text-sm text-gray-900">
                ₹{product.price} / unit
              </div>

              <div className="p-4 sm:border-r bg-gray-50 text-sm font-medium text-gray-600">
                Supplier Type
              </div>
              <div className="p-4 text-sm text-gray-900">
                {product.supplier}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Supplier Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{product.supplier}</p>
                  <p className="text-sm text-gray-500">
                    Verified wholesale supplier
                  </p>
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Years in Business</p>
                <p className="font-semibold text-gray-900 mt-1">5+ Years</p>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Annual Turnover</p>
                <p className="font-semibold text-gray-900 mt-1">₹5Cr - ₹25Cr</p>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Deals In</p>
                <p className="font-semibold text-gray-900 mt-1">
                  Bulk supply, custom orders, wholesale distribution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Related Products
              </h2>
              <Link
                href={`/products/${category}/${subcategory}`}
                className="text-orange-500 text-sm font-medium hover:underline"
              >
                View more →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${category}/${slugify(item.subcategory)}/${item.id}`}
                  className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group"
                >
                  <div className="h-36 sm:h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h3>

                    <p className="text-orange-600 font-bold text-base mt-2">
                      ₹{item.price}
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        / unit
                      </span>
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Min. {item.minQty} units
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="truncate">{item.supplier}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}