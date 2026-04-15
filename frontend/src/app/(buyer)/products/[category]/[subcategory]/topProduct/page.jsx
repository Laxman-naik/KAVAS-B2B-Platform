"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const slugLabel = (value = "") =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function ProductPage({ params }) {
  const [route, setRoute] = useState({ category: "", subcategory: "", product: "" });
  const [mainProduct, setMainProduct] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [supplierType, setSupplierType] = useState([]);
  const [minQty, setMinQty] = useState("");

  useEffect(() => {
    const load = async () => {
      const resolved = await params;
      const { category, subcategory, product } = resolved;
      setRoute({ category, subcategory, product });

      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${product}`,
          { cache: "no-store" }
        );
        const prod = await res1.json();
        setMainProduct(prod);

        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${prod.id}/listings`,
          { cache: "no-store" }
        );
        const listingData = await res2.json();
        setListings(Array.isArray(listingData) ? listingData : []);
      } catch (error) {
        setMainProduct(null);
        setListings([]);
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

  const filteredListings = useMemo(() => {
    let list = [...listings];

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
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return list;
  }, [listings, minPrice, maxPrice, minQty, supplierType, sort]);

  const resetFilters = () => {
    setSort("default");
    setMinPrice("");
    setMaxPrice("");
    setSupplierType([]);
    setMinQty("");
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!mainProduct) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-orange-500 px-4 sm:px-6 py-5 sm:py-6 text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {mainProduct.name}
        </h1>
        <p className="text-sm mt-1">
          {filteredListings.length} product listings available
        </p>
      </div>

      <div className="px-4 sm:px-6 py-3 bg-white border-b text-sm text-gray-600 flex flex-wrap gap-2">
        <Link href={`/products/${route.category}`} className="hover:text-orange-500 capitalize">
          {slugLabel(route.category)}
        </Link>
        <span>/</span>
        <Link
          href={`/products/${route.category}/${route.subcategory}`}
          className="hover:text-orange-500"
        >
          {slugLabel(route.subcategory)}
        </Link>
        <span>/</span>
        <span>{mainProduct.name}</span>
      </div>

      <div className="px-4 sm:px-6 py-5">
        <div className="bg-white border rounded-lg p-4 sm:p-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <img
                src={mainProduct.imageUrl}
                alt={mainProduct.name}
                className="w-full h-56 sm:h-72 object-cover rounded"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs">
                  Top Product
                </span>
              </div>

              <h2 className="text-2xl font-bold">{mainProduct.name}</h2>
              <p className="text-blue-600 text-xl mt-3">₹{mainProduct.price}/unit</p>
              <p className="text-sm text-gray-500 mt-1">
                Min Qty: {mainProduct.minOrderQty}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Compare supplier listings below
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
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
            {["Verified Supplier", "Gold Supplier", "Trusted Supplier"].map((type) => (
              <label key={type} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  checked={supplierType.includes(type)}
                  onChange={() => toggleSupplier(type)}
                  className="mr-2"
                />
                {type}
              </label>
            ))}

            <button
              onClick={resetFilters}
              className="mt-4 w-full border py-2 rounded hover:border-orange-500 hover:text-orange-500 transition"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
              <p>{filteredListings.length} listings</p>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          {item.supplierType}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold line-clamp-2">{item.name}</h3>
                      <p className="text-blue-600 mt-2">₹{item.price}/unit</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Min. {item.minOrderQty} units
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                          Get Quote
                        </button>
                        <Link
                          href={`/products/${route.category}/${route.subcategory}/${route.product}/${item.id}`}
                          className="border px-4 py-2 rounded hover:border-orange-500 hover:text-orange-500 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredListings.length === 0 && (
                <div className="bg-white border rounded-lg p-6 text-center text-gray-500 md:col-span-2">
                  No listings found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}