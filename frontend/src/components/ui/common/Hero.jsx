"use client";
import React, { useState } from "react";
import {
    ShoppingCart, Grid, Shirt, Wrench, Settings, Wheat,
    FlaskConical, Sofa, Car, Pill, Package, Construction,
    ChevronRight, Menu, CheckCircle, Lock, Truck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { productsData } from "@/components/ui/product/productData";
import { slugify } from "@/utils/slugify";
import { useEffect, useRef } from "react"; // ✅ already added

const Hero = () => {

    const categories = [
        {
            name: "Electronics",
            icon: Grid,
            subcategories: [
                "Mobile Accessories",
                "Laptops & Computers",
                "Audio & Headphones",
                "Cameras & Security",
                "Power & Batteries",
                "Printers & Scanners",
                "Networking",
                "Monitors",
                "Keyboards & Mice",
                "Cables & Connectors",
                "LED Lighting",
                "Barcode & POS",
            ],
        },
        {
            name: "Apparel",
            icon: Shirt,
            subcategories: ["Men Wear", "Women Wear", "Kids Wear"],
        },
        {
            name: "Hardware",
            icon: Wrench,
            subcategories: ["Tools", "Equipment"],
        },
        {
            name: "FMCG",
            icon: ShoppingCart,
            subcategories: ["Groceries", "Personal Care"],
        },
        {
            name: "Machinery",
            icon: Settings,
            subcategories: ["Industrial Machines"],
        },
        {
            name: "Agriculture",
            icon: Wheat,
            subcategories: ["Seeds", "Fertilizers"],
        },
        {
            name: "Chemicals",
            icon: FlaskConical,
            subcategories: ["Industrial Chemicals"],
        },
        {
            name: "Furniture",
            icon: Sofa,
            subcategories: ["Office", "Home"],
        },
        {
            name: "Automotive",
            icon: Car,
            subcategories: ["Spare Parts"],
        },
        {
            name: "Health",
            icon: Pill,
            subcategories: ["Medicines"],
        },
        {
            name: "Packaging",
            icon: Package,
            subcategories: ["Boxes", "Bags"],
        },
        {
            name: "Construction",
            icon: Construction,
            subcategories: ["Materials"],
        },
    ];

    const [showMenu, setShowMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    // ✅ ADDED
    const menuRef = useRef(null);

    // ✅ ADDED
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const activeProducts =
        productsData[slugify(activeCategory.name)] || [];

    const subcategories = [
        ...new Set(activeProducts.map((p) => p.subcategory)),
    ];

    return (
        <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div
                        ref={menuRef} // ✅ ADDED
                        className="relative w-full lg:w-60"
                    >
                        <aside className="w-full lg:w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-3 bg-orange-500 text-white font-semibold">
                                <Menu className="w-5 h-5" />
                                All Categories
                            </div>
                            <ul>
                                {categories.map((cat, i) => {
                                    const Icon = cat.icon;
                                    return (
                                        <li
                                            key={i}
                                            onClick={() => { // ✅ CHANGED
                                                if (activeCategory.name === cat.name) {
                                                    setShowMenu(!showMenu);
                                                } else {
                                                    setActiveCategory(cat);
                                                    setShowMenu(true);
                                                }
                                            }}
                                            className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm">{cat.name}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4" />
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>

                        <div className={`hidden lg:flex absolute left-60 top-0 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg rounded-2xl rounded-l-none border transition-all duration-300 z-50
                            ${showMenu ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5 pointer-events-none"}`}
                        >
                            <div className="w-64 border-r p-4">
                                <h3 className="font-semibold mb-3">{activeCategory.name}</h3>

                                {subcategories.map((sub, i) => (
                                    <Link
                                        key={i}
                                        href={`/products/${slugify(activeCategory.name)}/${slugify(sub)}`}
                                        className="block text-sm py-1 hover:text-orange-600"
                                    >
                                        {sub}
                                    </Link>
                                ))}
                            </div>

                            <div className="w-72 p-4 flex flex-col">
                                <h3 className="font-semibold mb-3">
                                    {activeCategory.name} ({activeProducts.length})
                                </h3>

                                <div className="space-y-1">
                                    {activeProducts.slice(0, 8).map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/products/${slugify(activeCategory.name)}/${slugify(p.subcategory)}/${p.id}`}
                                            className="flex justify-between items-center text-sm py-1 hover:text-orange-600"
                                        >
                                            <span className="truncate">{p.name}</span>
                                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                        </Link>
                                    ))}
                                </div>

                                <Link href={`/products/${slugify(activeCategory.name)}`}>
                                    <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition cursor-pointer">
                                        View All Products →
                                    </button>
                                </Link>

                            </div>
                        </div>
                    </div>

                    {/* EVERYTHING BELOW UNCHANGED */}

                    {/* RIGHT SIDE (UNCHANGED) */}
                    <div className="flex-1">
                        <div className="bg-orange-500 text-white rounded-2xl h-full flex">
                            <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                                <div className="mb-3 sm:mb-4 bg-white/10 px-3 sm:px-4 py-1 rounded-full w-fit text-[10px] sm:text-xs font-bold">
                                    🏆 INDIA'S #1 B2B WHOLESALE
                                </div>

                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                                    Source <span className="text-blue-300">Smarter.</span><br />
                                    Buy Wholesale.
                                </h1>

                                <p className="mt-2 sm:mt-3 text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed">
                                    500+ verified vendors across 50+ categories. <br />
                                    Best bulk prices — all in one place.
                                </p>

                                <Button className="mt-4 sm:mt-5 bg-white py-3 sm:py-4 md:py-5 px-4 sm:px-5 font-bold text-orange-500 w-fit text-xs sm:text-sm md:text-base">
                                    🚀 Start sourcing free
                                </Button>

                                <div className="flex flex-col mt-3 sm:flex-row items-start sm:items-center gap-2 sm:gap-4 md:gap-6">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-gray-200 text-xs sm:text-sm">Verified suppliers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-yellow-300" />
                                        <span className="text-gray-200 text-xs sm:text-sm">Secure payments</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-yellow-300" />
                                        <span className="text-gray-200 text-xs sm:text-sm">Pan-India delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM CARDS (UNCHANGED EXCEPT FIX) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="bg-yellow-100 rounded-xl relative overflow-hidden hover:scale-[1.01] hover:shadow-xl">
                        <div className="absolute top-2 right-2 bg-yellow-200 text-orange-600 text-xs px-3 py-0.5 rounded-full">
                            FREE
                        </div>
                        <CardContent className="px-6 py-4">
                            <h2 className="font-semibold text-base sm:text-lg dark:text-black">
                                Looking <br /> for a Product?
                            </h2>
                            <Button className="mt-2 bg-white text-black text-sm px-4 py-1.5">
                                📦 Post Buy Requirement
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-400 text-white rounded-xl relative overflow-hidden hover:scale-[1.01] hover:shadow-xl">
                        <div className="absolute top-2 right-2 bg-white/30 text-xs px-3 py-0.5 rounded-full">
                            JOIN NOW
                        </div>
                        <CardContent className="px-6 py-4">
                            <h2 className="font-semibold text-base sm:text-lg">
                                Want to grow your <br /> business 10X faster?
                            </h2>
                            <Link href="/vendor">
                                <Button className="mt-2 bg-white text-red-500 text-sm px-4 py-1.5">
                                    🏪 Sell on Kavas
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
                

            </div>
        </div>
    );
};

export default Hero;
