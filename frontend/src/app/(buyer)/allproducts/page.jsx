"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { productsData } from "@/app/(buyer)/product/productData";
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
  "Apparel",
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
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);

  const onToggleFavourite = (product) => {
    dispatch(toggleFavourite(product));
  };

  const onAddToCart = (product) => {
    dispatch(addToCart(product));
  };

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

  const allProducts = Object.values(productsData).flat();

  const filteredProducts = allProducts
    .filter((product) => {
      if (
        activeCategory !== "All" &&
        product.category.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false;
      }
      if (filters.minQty.length > 0) {
        const qty = product.minQty;

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
          (r) => (product.rating || 0) >= parseFloat(r)
        );
        if (!matchRating) return false;
      }
      if (filters.supplier.length > 0) {
        const matchSupplier = filters.supplier.includes(product.supplier);
        if (!matchSupplier) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Price low to high") {
        return a.price - b.price;
      }
      if (sortOption === "Price high to low") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="bg-white min-h-screen max-w-350">
      <div className="bg-white px-4 py-3">
        <p className="text-xs text-gray-500">
          <Link href="/">Home</Link> {" >> "} <b>All Products</b>
        </p>

        <h1 className="text-2xl font-bold mt-2">All Products</h1>
        <p className="text-sm text-gray-600">
          Best-selling wholesale products across all categories
        </p>
      </div>

      {/* CATEGORY BAR */}
      <div className="px-4 py-3 sticky top-20 bg-white z-10 overflow-x-auto flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              activeCategory === cat
                ? "bg-orange-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <div className={`${showFilters ? "block" : "hidden"} md:block`}>
          <div className="border rounded-xl p-4 sticky top-28">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="mb-4">
              <p className="text-sm font-medium">Min Qty</p>
              {["Under 50 units", "50–200 units", "200–500 units", "500+ units"].map(
                (item) => (
                  <label key={item} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      onChange={() => handleFilterChange("minQty", item)}
                    />
                    {item}
                  </label>
                )
              )}
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium">Rating</p>
              {["4.5", "4.0"].map((item) => (
                <label key={item} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    onChange={() => handleFilterChange("rating", item)}
                  />
                  {item}★+
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-4">
            <p>
              Showing <b>{filteredProducts.length}</b> products
            </p>

            <select
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-2 py-1"
            >
              <option>Most relevant</option>
              <option>Price low to high</option>
              <option>Price high to low</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product, index) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="rounded-xl overflow-hidden hover:shadow-md">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-40 bg-gray-100">
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        {index % 2 === 0 ? "Trending" : "Hot"}
                      </span>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-xs text-orange-600">
                        {product.category}
                      </p>

                      <p className="font-bold text-orange-500">
                        ₹{product.price}
                      </p>

                      <p className="text-xs text-gray-500">
                        Min Qty: {product.minQty}
                      </p>

                      <div className="flex gap-2 mt-auto pt-2">
                        <Button
                          className="flex-1 bg-orange-500 text-white text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            onAddToCart(product);
                          }}
                        >
                          <ShoppingCart size={14} /> Add
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            onToggleFavourite(product);
                          }}
                        >
                          <Heart size={14} />
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
  );
};

export default Page;