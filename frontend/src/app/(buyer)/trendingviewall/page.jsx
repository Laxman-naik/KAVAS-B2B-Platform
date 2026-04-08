"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { products } from "@/data/products";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "@/store/slices/favouritesSlice";

const categories = [
    "All ",
    " Accessories",
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
    const [activeCategory, setActiveCategory] = useState("All Automotive");
    const [showFilters, setShowFilters] = useState(false); // ✅ NEW

    const dispatch = useDispatch();
    const favouriteItems = useSelector((state) => state.favourites.items);
    const liked = favouriteItems.map((item) => item._id);

    const filteredProducts =
        activeCategory === "All Automotive"
            ? products
            : products.filter((p) => p.category === activeCategory);

    const onToggleFavourite = (product) => {
        dispatch(toggleFavourite(product));
    };

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="bg-orange-500 px-4 sm:px-6 py-6 sm:py-2">
                <div className="max-w-7xl mx-auto text-white">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
                        Trending Products
                    </h1>

                    <p className="text-xs sm:text-sm opacity-90 mt-1">
                        Best-selling wholesale products across all categories
                    </p>

                    <p className="text-xs opacity-90 mt-2">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>
            </div>

            {/* CATEGORY BAR */}
            <div className="bg-white border-b px-3 sm:px-4 py-3 sticky top-20 z-10 overflow-x-auto">
                <div className="max-w-7xl mx-auto flex gap-2 sm:gap-3 items-center whitespace-nowrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition
                ${activeCategory === cat
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-gray-100 text-gray-700 hover:bg-orange-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <div className="md:hidden px-4 py-3">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full bg-white border rounded-lg py-2 text-sm font-medium shadow"
                >
                    Filters {showFilters ? "▲" : "▼"}
                </button>
            </div>

            {/* MAIN SECTION */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">

                {/* RESPONSIVE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">

                    {/* FILTER SIDEBAR */}
                    <div className={`${showFilters ? "block" : "hidden"} md:block`}>
                        <div className="bg-white rounded-2xl shadow p-4 sticky top-28 border">

                            <div className="flex items-center gap-2 pb-3 border-b">
                                <span className="text-sm font-semibold">Filters</span>
                            </div>

                            {/* Min Order */}
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

                            {/* Rating */}
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

                            {/* Supplier */}
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

                    {/* PRODUCTS */}
                    <div>

                        {/* TOP ROW */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">
                            <p className="text-gray-600 text-sm">
                                Showing{" "}
                                <span className="font-semibold">
                                    {filteredProducts.length}
                                </span>{" "}
                                products
                            </p>

                            <select className="border rounded-md px-3 py-1 text-sm w-full sm:w-auto">
                                <option>Most relevant</option>
                                <option>Price low to high</option>
                                <option>Price high to low</option>
                            </select>
                        </div>

                        {/* GRID */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                            {filteredProducts.map((product, index) => (
                                <Link key={product.id} href={`/product/${product.id}`} className="block">
                                    <Card className="rounded-2xl bg-white shadow-sm hover:shadow-md transition flex flex-col overflow-hidden cursor-pointer">
                                        <CardContent className="!p-0 flex flex-col h-full">

                                        <div className="relative h-[160px] sm:h-[200px] bg-gray-100 flex items-center justify-center">
                                            <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full z-10">
                                                {index % 2 === 0 ? "Trending" : "Hot Deal"}
                                            </span>

                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="p-2 sm:p-3 flex flex-col flex-1">
                                            <h3 className="text-xs sm:text-sm font-semibold line-clamp-2">
                                                {product.title}
                                            </h3>

                                            <p className="text-[10px] text-orange-600 mt-1">
                                                {product.category}
                                            </p>

                                            <p className="text-orange-600 font-bold text-sm sm:text-base mt-1">
                                                {product.price}
                                            </p>

                                            <p className="text-[10px] text-gray-500">
                                                {product.min}
                                            </p>

                                            <div className="flex items-center gap-2 mt-auto pt-2">
                                                <Button
                                                    className="flex-1 bg-orange-500 text-white text-xs h-8"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
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
                                                        className={liked.includes(product.id) ? "text-red-500" : "text-gray-700"}
                                                        fill={liked.includes(product.id) ? "currentColor" : "none"}
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
