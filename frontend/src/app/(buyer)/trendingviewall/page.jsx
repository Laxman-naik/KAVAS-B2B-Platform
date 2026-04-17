"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { products } from "@/data/products";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";

const categories = [
  "All",
  "Accessories",
  "Electronics",
  "Agriculture",
  "Healthcare",
  "Furniture",
  "Apprael",
  "Chemicals",
  "Hardware",
  "FMCG",
];

const Page = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState({
    minQty: [],
    rating: [],
    supplier: [],
  });

  const [sortOption, setSortOption] = useState("Most relevant");

  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);

  // FIX: safe id handling
  const liked = favouriteItems.map((item) => item._id || item.id);

  const onToggleFavourite = (product) => {
    dispatch(toggleFavourite(product));
  };

  // FIX: correct payload for backend thunk
  const onAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product?.id || product?.productId,
        quantity: 1,
        variantId: product?.variantId || product?.variant_id,
      })
    );
  };

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const filteredProducts = products
    .filter((product) => {
      if (activeCategory !== "All" && product.category !== activeCategory) {
        return false;
      }

      if (filters.minQty.length > 0) {
        const qty = parseInt(product.min?.match(/\d+/)?.[0] || 0);

        const matchQty = filters.minQty.some((range) => {
          if (range === "Under 50 units") return qty < 50;
          if (range === "50–200 units") return qty >= 50 && qty <= 200;
          if (range === "200–500 units") return qty > 200 && qty <= 500;
          if (range === "500+ units") return qty > 500;
        });

        if (!matchQty) return false;
      }

      if (filters.rating.length > 0) {
        const matchRating = filters.rating.some(
          (r) => product.rating >= parseFloat(r)
        );
        if (!matchRating) return false;
      }

      if (filters.supplier.length > 0) {
        const matchSupplier = filters.supplier.includes(product.supplierType);
        if (!matchSupplier) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Price low to high") {
        return a.priceValue - b.priceValue;
      }
      if (sortOption === "Price high to low") {
        return b.priceValue - a.priceValue;
      }
      return 0;
    });

  return (
    <div className="bg-white min-h-screen max-w-350">
      <div className="bg-white px-2 sm:px-6 py-2">
        <div className="mx-auto text-black">
          <p className="text-xs text-gray-500 mb-1">
            <Link href="/">
              <span className="hover:text-orange-600">Home </span>
            </Link>
            <span className="mx-1">{">>"}</span>
            <span className="text-black font-semibold">
              Trending Products
            </span>
          </p>

          <div className="flex items-center gap-2 mt-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Trending Products
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-black mt-1">
            Best-selling wholesale products across all categories
          </p>
        </div>
      </div>

      <div className="bg-white px-3 sm:px-4 py-3 sticky top-20 z-10">
        <div className="mx-auto flex flex-wrap gap-2 sm:gap-3 items-center overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition flex items-center gap-1
              ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto px-3 sm:px-4 py-6">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white border rounded-lg py-2 text-sm font-medium shadow"
          >
            Filters {showFilters ? "▲" : "▼"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="bg-white rounded-2xl shadow p-4 sticky top-28 border">
              <div className="flex items-center gap-2 pb-3 border-b">
                <span className="text-sm font-semibold">Filters</span>
              </div>

              <div className="mt-4 mb-4">
                <h3 className="font-medium mb-2 text-sm">Min. Order Qty</h3>
                <div className="space-y-1 text-sm">
                  {[
                    "Under 50 units",
                    "50–200 units",
                    "200–500 units",
                    "500+ units",
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.minQty.includes(item)}
                        onChange={() => handleFilterChange("minQty", item)}
                        className="accent-orange-500"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Rating</h3>
                <div className="space-y-1 text-sm">
                  {["4.5", "4.0"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.rating.includes(item)}
                        onChange={() => handleFilterChange("rating", item)}
                        className="accent-orange-500"
                      />
                      {item}★ & above
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Supplier Type</h3>
                <div className="space-y-1 text-sm">
                  {["Verified only", "Manufacturer", "Distributor"].map(
                    (item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.supplier.includes(item)}
                          onChange={() =>
                            handleFilterChange("supplier", item)
                          }
                          className="accent-orange-500"
                        />
                        {item}
                      </label>
                    )
                  )}
                </div>
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-medium">
                Apply Filters
              </button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="block"
                >
                  <Card className="rounded-2xl bg-white shadow-sm hover:shadow-md transition flex flex-col overflow-hidden cursor-pointer">
                    <CardContent className="p-0! py-0! flex flex-col h-full">
                      <div className="relative h-45 sm:h-50 bg-gray-100 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm font-semibold">
                          {product.title}
                        </h3>

                        <p className="text-orange-500 font-bold">
                          {product.price}
                        </p>

                        <div className="flex items-center gap-2 mt-auto pt-3 border-t">
                          <Button
                            className="flex-1 bg-orange-500 text-white text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              onAddToCart(product);
                            }}
                          >
                            <ShoppingCart size={14} /> Add to cart
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleFavourite(product);
                            }}
                            className={`h-8 w-8 border-orange-200 ${
                              liked.includes(product.id) ? "bg-red-100" : ""
                            }`}
                          >
                            <Heart
                              size={14}
                              className={
                                liked.includes(product.id)
                                  ? "text-red-500"
                                  : "text-gray-600"
                              }
                              fill={
                                liked.includes(product.id) ? "red" : "none"
                              }
                            />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;