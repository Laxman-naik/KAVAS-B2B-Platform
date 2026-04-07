"use client";
import React, { useState } from "react";
import {
    ShoppingCart, Grid, Shirt, Wrench, Settings, Wheat,
    FlaskConical, Sofa, Car, Pill, Package, Construction,
    ChevronRight, Menu, CheckCircle, Lock, Truck, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slugify = (text) =>
    text.toLowerCase().replace(/ & /g, "and").replace(/\s+/g, "-");

const Hero = () => {

    const categories = [
        {
            name: "Electronics",
            icon: Grid,
            subcategories: [
                "Mobile Accessories", "Laptops & Computers", "Audio & Headphones",
                "Cameras & Security", "Power & Batteries", "Printers & Scanners",
                "Networking", "Monitors", "Keyboards & Mice", "Cables & Connectors",
                "LED Lighting", "Barcode & POS",
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
        { name: "Machinery", icon: Settings, subcategories: [], products: [] },
        { name: "Agriculture", icon: Wheat, subcategories: [], products: [] },
        { name: "Chemicals", icon: FlaskConical, subcategories: [], products: [] },
        { name: "Furniture", icon: Sofa, subcategories: [], products: [] },
        { name: "Automotive", icon: Car, subcategories: [], products: [] },
        { name: "Health", icon: Pill, subcategories: [], products: [] },
        { name: "Packaging", icon: Package, subcategories: [], products: [] },
        { name: "Construction", icon: Construction, subcategories: [], products: [] },
    ];

    const slides = [
        {
            title: "Source Smarter.",
            highlight: "Buy Wholesale.",
            desc: "500+ verified vendors across 50+ categories. Best bulk prices — all in one place.",
        },
        {
            title: "Grow Faster.",
            highlight: "Sell Smarter.",
            desc: "Reach thousands of buyers across India with ease.",
        },
        {
            title: "Best Prices.",
            highlight: "Guaranteed.",
            desc: "Compare suppliers and get unbeatable deals instantly.",
        },
        {
            title: "Trusted Vendors.",
            highlight: "Only Verified.",
            desc: "Every supplier is verified for quality and reliability.",
        },
        {
            title: "Fast Delivery.",
            highlight: "Pan India.",
            desc: "Quick and reliable shipping across the country.",
        },
    ];

    const slideImages = [
        "/electronics.jpg",
        "/agriculture.jpg",
        "/healthcare.jpg",
        "/furniture.jpg",
        "/shop.jpg",
    ];

    const [showMenu, setShowMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                <div className="flex flex-col lg:flex-row gap-6 ">

                    <div className="relative w-full lg:w-60">
                        <aside className=" w-full lg:w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 overflow-hidden">

                            <div
                                className="flex items-center gap-2 px-3 py-3 bg-orange-500 text-white font-semibold cursor-pointer"
                                onClick={() => setShowMenu((prev) => !prev)}
                            >
                                <Menu className="w-5 h-5" />
                                All Categories
                            </div>

                            <ul>
                                {categories.map((cat, i) => {
                                    const Icon = cat.icon;
                                    return (
                                        <li
                                            key={i}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                setShowMenu(true);
                                            }}
                                            className="flex items-center justify-between px-3 py-2 border-b hover:bg-orange-50 cursor-pointer"
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

                            <div
                                className={`absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border z-50 transition-all duration-300
                                ${showMenu ? "opacity-100 translate-x-0 flex" : "opacity-0 translate-x-5 pointer-events-none hidden lg:flex"}`}
                            >

                                <div className="w-60 border-r p-4">
                                    <h3 className="font-semibold mb-3">{activeCategory.name}</h3>

                                    {activeCategory.subcategories.length > 0 ? (
                                        activeCategory.subcategories.map((sub, i) => (
                                            <Link
                                                key={i}
                                                href={`/products/${slugify(activeCategory.name)}/${slugify(sub)}`}
                                                onClick={() => setShowMenu(false)}
                                            >
                                                <p className="text-sm py-1 hover:text-orange-500 cursor-pointer">
                                                    {sub}
                                                </p>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">No subcategories</p>
                                    )}
                                </div>

                                <div className="w-72 p-4 flex flex-col">

                                    <h3 className="font-semibold mb-3">Top Products</h3>

                                    <Link href={`/products/${slugify(activeCategory.name)}`}>
                                        <div className="flex-1">
                                            {activeCategory.products && activeCategory.products.length > 0 ? (
                                                activeCategory.products.slice(0, 8).map((prod, i) => (
                                                    <p key={i} className="text-sm py-1 hover:text-orange-500 cursor-pointer">
                                                        {prod}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400">No products available</p>
                                            )}
                                        </div>
                                    </Link>

                                    <Link
                                        href={`/products/${slugify(activeCategory.name)}`}
                                        onClick={() => setShowMenu(false)}
                                    >
                                        <button className="mt-4 bg-orange-500 hover:bg-orange-600 ml-10 text-white py-3 px-4 rounded-md text-sm font-medium transition">
                                            View All Products →
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="relative w-full overflow-hidden">
                        <div
                            className="flex transition-transform duration-500"
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {slides.map((slide, index) => (
                                <div key={index} className="min-w-full">
                                    <div className="relative text-white rounded-2xl h-full py-14 flex overflow-hidden">

                                        <img
                                            src={slideImages[index]}
                                            alt="slide"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        <div className="absolute inset-0 bg-black/50"></div>

                                        <div className="p-6 md:p-10 flex flex-col justify-center relative z-10">

                                            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                                                {slide.title} <br />
                                                <span className="text-blue-300">{slide.highlight}</span>
                                            </h1>

                                            <p className="mt-3 text-gray-200">
                                                {slide.desc}
                                            </p>

                                            <div className="mt-3 space-y-1">
                                                {[
                                                    ["🔥 Electronics Deals", "Bulk Laptop Offers", "Headphones Sale"],
                                                    ["🌾 Seeds Discount", "Fertilizer Deals", "Farm Tools"],
                                                    ["💊 Medical Supplies", "Pharma Deals", "Equipment Offers"],
                                                    ["🛋️ Furniture Deals", "Office Setup", "Bulk Sofa Discounts"],
                                                    ["📦 B2B Deals", "Bulk Discounts", "Top Suppliers"]
                                                ][index].map((deal, i) => (
                                                    <p key={i} className="text-yellow-300 text-sm">{deal}</p>
                                                ))}
                                            </div>

                                            <Button className="mt-5 bg-white text-orange-500">
                                                🚀 Start sourcing free
                                            </Button>

                                            <div className="flex gap-4 mt-4">
                                                <span>✔ Verified</span>
                                                <span>🔒 Secure</span>
                                                <span>🚚 Delivery</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={prevSlide} className="absolute left-3 top-1/2 text-white">
                            <ChevronLeft />
                        </button>

                        <button onClick={nextSlide} className="absolute right-3 top-1/2 text-white">
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div className="rounded-xl relative overflow-hidden hover:scale-[1.01] hover:shadow-xl">
                        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop>
                            <source src="/videos/sale.mp4" />
                        </video>

                        <div className="relative z-10 p-6 text-white">
                            <Link href="/vendor">
                                <Button className="mt-20 bg-white text-red-500">
                                    Flashdeals
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl relative overflow-hidden hover:scale-[1.01] hover:shadow-xl">
                        <video className="absolute inset-0 w-full h-full object-cover " autoPlay muted loop>
                            <source src="/videos/apple.mp4" />
                        </video>

                        <div className="relative z-10 p-6 text-white">
                            <Link href="/vendor">
                                <Button className="mt-20 bg-white text-red-500">
                                    Apple 17 pro
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border border-amber-400 bg-yellow-50 p-4 py-5 rounded-xl shadow text-center">
                    <div><h3 className="font-bold text-xl text-orange-500">500+</h3><p>Verified Vendors</p></div>
                    <div><h3 className="font-bold text-xl text-orange-500">12,000+</h3><p>Products Listed</p></div>
                    <div><h3 className="font-bold text-xl text-orange-500">50,000+</h3><p>Active Buyers</p></div>
                    <div><h3 className="font-bold text-xl text-orange-500">98%</h3><p>Order Accuracy</p></div>
                    <div><h3 className="font-bold text-xl text-orange-500">₹200Cr+</h3><p>GMV Processed</p></div>
                </div>

            </div>
        </div>
    );
};

export default Hero;
