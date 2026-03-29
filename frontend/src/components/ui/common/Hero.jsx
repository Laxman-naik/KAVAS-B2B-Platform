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
            products: [
                "Wireless Earbuds TWS Pro Bulk",
                "Laptop Cooling Pad USB Wholesale",
                "Lithium Power Bank 20000mAh OEM",
                "Over-Ear Headphones Noise Cancel",
                "Security Camera 1080p CCTV Bulk",
                "LED Monitor 24\" FHD Business",
                "Mechanical Keyboard RGB Bulk",
                "USB-C Hub 7-in-1 Wholesale",
            ],
        },
        {
            name: "Apparel",
            icon: Shirt,
            subcategories: ["Men Wear", "Women Wear", "Kids Wear"],
            products: ["T-Shirts Bulk", "Jeans Wholesale"],
        },
        {
            name: "Hardware",
            icon: Wrench,
            subcategories: ["Tools", "Equipment"],
            products: ["Drill Machine", "Tool Kit"],
        },
        {
            name: "FMCG",
            icon: ShoppingCart,
            subcategories: ["Groceries", "Personal Care"],
            products: ["Soap Bulk", "Shampoo Wholesale"],
        },
        {
            name: "Machinery",
            icon: Settings,
            subcategories: ["Industrial Machines"],
            products: [],
        },
        {
            name: "Agriculture",
            icon: Wheat,
            subcategories: ["Seeds", "Fertilizers"],
            products: [],
        },
        {
            name: "Chemicals",
            icon: FlaskConical,
            subcategories: ["Industrial Chemicals"],
            products: [],
        },
        {
            name: "Furniture",
            icon: Sofa,
            subcategories: ["Office", "Home"],
            products: [],
        },
        {
            name: "Automotive",
            icon: Car,
            subcategories: ["Spare Parts"],
            products: [],
        },
        {
            name: "Health",
            icon: Pill,
            subcategories: ["Medicines"],
            products: [],
        },
        {
            name: "Packaging",
            icon: Package,
            subcategories: ["Boxes", "Bags"],
            products: [],
        },
        {
            name: "Construction",
            icon: Construction,
            subcategories: ["Materials"],
            products: [],
        },
    ];
    const [showMenu, setShowMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    return (
        <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div
                        className="relative w-full lg:w-60"
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
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
                                            onMouseEnter={() => setActiveCategory(cat)}
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

                                {activeCategory.subcategories.map((sub, i) => (
                                    <p key={i} className="text-sm py-1 hover:text-orange-600 cursor-pointer">{sub}</p>
                                ))}
                            </div>
                            <div className="w-72 p-4">
                                <h3 className="font-semibold mb-3">{activeCategory.name} ({activeCategory.products.length})</h3>
                                {activeCategory.products.map((prod, i) => (
                                    <div key={i} className="flex justify-between text-sm py-1 hover:text-orange-600 cursor-pointer">
                                        {prod} <ChevronRight className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                                <Button className="mt-4 sm:mt-5 bg-white py-3 sm:py-4 md:py-5 px-4 sm:px-5 font-bold text-orange-500 w-fit text-xs sm:text-sm md:text-base">🚀 Start sourcing free</Button>
                                <div className="flex flex-col mt-3 sm:flex-row items-start sm:items-center justify-start sm:justify-center gap-2 sm:gap-4 md:gap-6 text-left sm:text-left">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="bg-yellow-100 rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
                        <div className="absolute top-2 right-2 bg-yellow-200 text-orange-600 text-xs px-3 py-0.5 rounded-full shadow">
                            FREE
                        </div>
                        <CardContent className="px-6 py-4">
                            <h2 className="font-semibold text-base sm:text-lg leading-tight dark:text-black">
                                Looking <br /> for a Product?
                            </h2>
                            <Button className="mt-2 bg-white text-black text-sm px-4 py-1.5">
                                📦 Post Buy Requirement
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-400 text-white rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
                        <div className="absolute top-2 right-2 bg-white/30 text-white text-xs px-3 py-0.5 rounded-full shadow">
                            JOIN NOW
                        </div>
                        <CardContent className="px-6 py-4">
                            <h2 className="font-semibold text-base sm:text-lg leading-tight">
                                Want to grow your <br /> business 10X faster?
                            </h2>
                            <Link href="\vendor">
                            <Button className="mt-2 bg-white text-red-500 text-sm px-4 py-1.5">
                                🏪 Sell on Kavas
                            </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border border-amber-400 bg-yellow-50 p-4 py-5 rounded-xl shadow text-center">
                    <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-orange-500/90">500+</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Verified Vendors</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-orange-500/90">12,000+</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Products Listed</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-orange-500/90">50,000+</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Active Buyers</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-orange-500/90">98%</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Order Accuracy</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-orange-500/90">₹200Cr+</h3>
                        <p className="text-xs sm:text-sm text-gray-500">GMV Processed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;