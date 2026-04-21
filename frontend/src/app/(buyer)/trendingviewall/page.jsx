"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { fetchProducts } from "@/store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
// import { toggleFavourite } from "@/store/slices/favouritesSlice";
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

const TrendingViewAllV1 = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const favouriteItems = useSelector((state) => state.favourites.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products || [];
  const likedIds = (favouriteItems || []).map((item) => item._id || item.id);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product?.id,
        quantity: product?.moq || 1,
      })
    );
  };

  const onToggleFavourite = (product) => {
    dispatch(toggleFavourite(product));
  };

  return (
    <div>
      <div className="bg-orange-500 px-4 sm:px-6 py-6 sm:py-2">
        <div className="max-w-7xl mx-auto text-white">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
            Trending Products
          </h1>

          <p className="text-xs sm:text-sm opacity-90 mt-1">
            Best-selling wholesale products across all categories
          </p>

          <p className="text-xs opacity-90 mt-2">
            Showing {filteredProducts.length} of {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="bg-white border-b px-3 sm:px-4 py-3 sticky top-20 z-10 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-2 sm:gap-3 items-center whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition
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

      <div className="md:hidden px-4 py-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-white border rounded-lg py-2 text-sm font-medium shadow"
        >
          Filters {showFilters ? "▲" : "▼"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="bg-white rounded-2xl shadow p-4 sticky top-28 border">
              <div className="flex items-center gap-2 pb-3 border-b">
                <span className="text-sm font-semibold">Filters</span>
              </div>

              <div className="mt-4 mb-4">
                <h3 className="font-medium mb-2 text-sm">Min. Order Qty</h3>
                <div className="space-y-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" defaultChecked />
                    Under 50 units
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" defaultChecked />
                    50–200 units
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    200–500 units
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    500+ units
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Rating</h3>
                <div className="space-y-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" defaultChecked />
                    4.5★ & above
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    4.0★ & above
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Supplier Type</h3>
                <div className="space-y-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-orange-500" defaultChecked />
                    Verified only
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Manufacturer
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Distributor
                  </label>
                </div>
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-medium">
                Apply Filters
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </p>

              <select className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto">
                <option>Most relevant</option>
                <option>Price low to high</option>
                <option>Price high to low</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filteredProducts
                .filter((p) => activeCategory === "All" || p.category === activeCategory)
                .map((product, index) => (
                  <Link key={product._id ?? product.id} href={`/product/${product._id ?? product.id}`} className="block">
                    <Card className="rounded-2xl bg-white shadow-sm hover:shadow-md transition flex flex-col overflow-hidden cursor-pointer">
                      <CardContent className="p-0! flex flex-col h-full">
                        <div className="relative h-40 sm:h-50 bg-gray-100 flex items-center justify-center">
                          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full z-10">
                            {index % 2 === 0 ? "Trending" : "Hot Deal"}
                          </span>

                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-2 sm:p-3 flex flex-col flex-1">
                          <h3 className="text-xs sm:text-sm font-semibold line-clamp-2">
                            {product.name}
                          </h3>

                          <p className="text-[10px] text-orange-600 mt-1">{product.category}</p>

                          <p className="text-orange-600 font-bold text-sm sm:text-base mt-1">
                            {product.price}
                          </p>

                          <p className="text-[10px] text-gray-500">{product.min}</p>

                          <div className="flex items-center gap-2 mt-auto pt-2">
                            <Button
                              className="flex-1 bg-orange-500 text-white text-xs h-8"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                            >
                              <ShoppingCart size={12} />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavourite(product);
                              }}
                              className="h-8 w-8"
                            >
                              <Heart
                                size={12}
                                className={
                                  likedIds.includes(product.id)
                                    ? "text-red-500"
                                    : "text-gray-700"
                                }
                                fill={likedIds.includes(product.id) ? "currentColor" : "none"}
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

const TrendingViewAllV2 = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState({
    minQty: [],
    rating: [],
    supplier: [],
  });
  const [sortOption, setSortOption] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const favouriteItems = useSelector((state) => state.favourites.items);
  const liked = (favouriteItems || []).map((item) => item._id || item.id);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product?.id,
        quantity: 1,
      })
    );
  };

  const onToggleFavourite = (product) => {
    dispatch(toggleFavourite(product));
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

  const filteredProducts = (products || [])
    .filter((product) => {
      if (activeCategory !== "All" && product.category !== activeCategory) {
        return false;
      }

      if (filters.minQty.length > 0) {
        const qty = Number(product.moq || 0);
        const matchQty = filters.minQty.some((range) => {
          if (range === "Under 50 units") return qty < 50;
          if (range === "50–200 units") return qty >= 50 && qty <= 200;
          if (range === "200–500 units") return qty > 200 && qty <= 500;
          if (range === "500+ units") return qty > 500;
          return false;
        });
        if (!matchQty) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "Price low to high") return Number(a.price) - Number(b.price);
      if (sortOption === "Price high to low") return Number(b.price) - Number(a.price);
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

const Page = () => {
  return <TrendingViewAllV1 />;
};

export default Page;