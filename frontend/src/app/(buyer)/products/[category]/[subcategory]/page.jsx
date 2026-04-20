"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const slugLabel = (value = "") => value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function SubCategoryPage({ params }) {
  const [route, setRoute] = useState({ category: "", subcategory: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [supplierType, setSupplierType] = useState([]);
  const [minQty, setMinQty] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const resolved = await params;
        const { category, subcategory } = resolved;

        setRoute({ category, subcategory });

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${category}/${subcategory}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        const rawProducts = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const mapped = rawProducts.map((p) => ({
          ...p,
          imageUrl: p.image_url || "/placeholder.png",
          minOrderQty: p.moq,
          createdAt: p.created_at,
          supplierType: p.supplierType || p.supplier_type || "",
        }));

        setProducts(mapped);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params]);

  const toggleSupplier = (value) => {
    setSupplierType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (minPrice !== "") {
      list = list.filter((p) => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice !== "") {
      list = list.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    if (minQty !== "") {
      list = list.filter((p) => Number(p.minOrderQty) >= Number(minQty));
    }

    if (supplierType.length) {
      list = list.filter((p) => supplierType.includes(p.supplierType));
    }

    if (sort === "price_asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price_desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return list;
  }, [products, minPrice, maxPrice, minQty, supplierType, sort]);

  const resetFilters = () => {
    setSort("default");
    setMinPrice("");
    setMaxPrice("");
    setSupplierType([]);
    setMinQty("");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-orange-500 px-4 sm:px-6 py-5 sm:py-6 text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
          {slugLabel(route.subcategory)}
        </h1>
        <p className="text-sm mt-1">
          {filteredProducts.length}+ top products available
        </p>
      </div>

      <div className="bg-white px-4 sm:px-6 py-3 flex gap-3 border-b overflow-x-auto">
        <Link
          href={`/products/${route.category}`}
          className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-sm whitespace-nowrap"
        >
          All {slugLabel(route.category)}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 py-5">
        <div className="w-full lg:w-64 bg-white border rounded-lg p-4 h-fit">
          <h3 className="font-semibold mb-3">Filters</h3>

          <p className="text-sm mb-2">Price</p>
          <div className="space-y-2 mb-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <p className="text-sm mb-2">Minimum Order Qty</p>
          <input
            type="number"
            placeholder="e.g. 50"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-4"
          />

          <p className="text-sm mb-2">Supplier Type</p>
          {["Verified Supplier", "Gold Supplier", "Trusted Supplier"].map(
            (type) => (
              <label key={type} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  checked={supplierType.includes(type)}
                  onChange={() => toggleSupplier(type)}
                  className="mr-2"
                />
                {type}
              </label>
            )
          )}

          <button
            onClick={resetFilters}
            className="mt-4 w-full border py-2 rounded hover:border-orange-500 hover:text-orange-500 transition"
          >
            Reset Filters
          </button>
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-3 gap-3 flex-wrap items-center">
            <p>{filteredProducts.length} products</p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="default">Sort</option>
              <option value="price_asc">Low → High</option>
              <option value="price_desc">High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              Loading...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              No top products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${route.category}/${route.subcategory}/${item.slug}`}
                >
                  <div className="bg-white p-3 border rounded">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-32 sm:h-36 md:h-40 w-full object-cover rounded"
                    />
                    <h3 className="text-sm mt-2 line-clamp-2">{item.name}</h3>
                    <p className="text-blue-600">₹{item.price}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Min. {item.minOrderQty} units
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.supplierType}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}