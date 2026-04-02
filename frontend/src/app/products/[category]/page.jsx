"use client";

import { use } from "react";
import { useState, useMemo } from "react";
import { productsData } from "@/app/(buyer)/product/productData";
import Link from "next/link";
import { slugify, deslugify } from "@/utils/slugify";

const PRODUCTS_PER_PAGE = 8;

export default function CategoryPage({ params }) {
  const { category, subcategory } = use(params);

  const allProducts = productsData[category] || [];

  const filteredBySubcategory = subcategory
    ? allProducts.filter(
        (p) => slugify(p.subcategory) === subcategory
      )
    : allProducts;

  const [filters, setFilters] = useState({ price: [], supplier: [] });
  const [tempFilters, setTempFilters] = useState({ price: [], supplier: [] });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");

  const toggleFilter = (type, value) => {
    setTempFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const filteredProducts = useMemo(() => {
    return filteredBySubcategory.filter((p) => {
      if (filters.price.length) {
        if (filters.price.includes("low") && p.price > 500) return false;
        if (filters.price.includes("mid") && (p.price < 500 || p.price > 2000)) return false;
        if (filters.price.includes("high") && p.price < 2000) return false;
      }
      if (filters.supplier.length && !filters.supplier.includes(p.supplier)) return false;
      return true;
    });
  }, [filters, filteredBySubcategory]);

  const sorted = useMemo(() => {
    let arr = [...filteredProducts];
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    if (sort === "high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [filteredProducts, sort]);

  const paginated = sorted.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);

  const subcategories = [
    ...new Set(allProducts.map((p) => slugify(p.subcategory))),
  ];

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="bg-orange-500 px-4 sm:px-6 py-5 sm:py-6 text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
          {subcategory ? deslugify(subcategory) : category}
        </h1>
        <p className="text-sm mt-1">{sorted.length}+ products available</p>
      </div>

      {/* SUBCATEGORY TABS */}
      <div className="bg-white px-4 sm:px-6 py-3 flex gap-3 border-b overflow-x-auto">
        <Link
          href={`/products/${category}`}
          className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-sm whitespace-nowrap"
        >
          All {category}
        </Link>

        {subcategories.map((sub, i) => (
          <Link
            key={i}
            href={`/products/${category}/${sub}`}
            className="px-4 py-1.5 bg-gray-100 rounded-full text-sm whitespace-nowrap hover:bg-orange-100 hover:text-orange-600 transition"
          >
            {deslugify(sub)}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 py-5">

        {/* FILTER */}
        <div className="w-full lg:w-64 bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Filters</h3>

          <p className="text-sm mb-2">Price</p>
          {["low", "mid", "high"].map((p) => (
            <label key={p} className="block text-sm">
              <input onChange={() => toggleFilter("price", p)} type="checkbox" /> {p}
            </label>
          ))}

          <p className="text-sm mt-4 mb-2">Supplier</p>
          {["Verified Supplier", "Gold Supplier", "Trusted Supplier"].map((s) => (
            <label key={s} className="block text-sm">
              <input onChange={() => toggleFilter("supplier", s)} type="checkbox" /> {s}
            </label>
          ))}

          <button
            onClick={() => setFilters(tempFilters)}
            className="mt-3 w-full bg-orange-500 text-white py-2 rounded"
          >
            Apply
          </button>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">

          <div className="flex justify-between mb-3">
            <p>{sorted.length} products</p>
            <select onChange={(e) => setSort(e.target.value)}>
              <option value="default">Sort</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
            </select>
          </div>

          {/* GRID FIXED */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginated.map((p) => (
              <Link
                key={p.id}
                href={`/products/${category}/${slugify(p.subcategory)}/${p.id}`}
              >
                <div className="bg-white p-3 border rounded">
                  <img
                    src={p.image}
                    className="h-32 sm:h-36 md:h-40 w-full object-cover rounded"
                  />
                  <h3 className="text-sm mt-2 line-clamp-2">{p.name}</h3>
                  <p className="text-blue-600">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-wrap justify-center mt-6 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 ${
                  page === i + 1 ? "bg-blue-600 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
