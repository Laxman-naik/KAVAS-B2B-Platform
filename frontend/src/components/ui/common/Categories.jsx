"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Grid,
  Shirt,
  Wrench,
  Settings,
  Wheat,
  FlaskConical,
  Sofa,
  Car,
  Pill,
  Package,
  Construction,
} from "lucide-react";
import Link from "next/link";

const slugify = (text) =>
  text.toLowerCase().replace(/ & /g, "and").replace(/\s+/g, "-");

const Categories = () => {
  const categories = [
    {
      name: "Home Appliances",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Kitchen Appliances",
        "Cleaning Appliances",
        "Heating & Cooling",
        "Laundry Appliances",
        "Smart Home Devices",
        "Kitchen Appliancess",
        "Cleaning Appliancess",
        "Heating & Coolingg",
        "Laundry Appliancess",
        "Smart Home Devicess1",
        "Kitchen Appliances1",
        "Cleaning Appliances1",
        "Heating & Cooling1",
        "Laundry Appliances1",
        "Smart Home Devices1",
      ],
    },
    {
      name: "Electronics",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Mobile Phones & Accessories",
        "Computers & Laptops",
        "TV & Home Entertainment",
        "Cameras & Photography",
        "Audio Devices",
        "Wearable Technology",
        "Gaming Consoles & Accessories",
      ],
    },
    {
      name: "Fashion Wear",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Men’s Clothing",
        "Women’s Clothing",
        "Kids’ Clothing",
        "Footwear",
        "Bags & Accessories",
        "Jewelry & Watches",
      ],
    },
    {
      name: "Beauty & Personal Care",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Skincare",
        "Haircare",
        "Makeup & Cosmetics",
        "Fragrances",
        "Grooming Products",
        "Personal Hygiene",
      ],
    },
    {
      name: "Kid Toys",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Educational Toys",
        "Action Figures & Dolls",
        "Outdoor Play Equipment",
        "Board Games & Puzzles",
        "Electronic Toys",
      ],
    },
    {
      name: "Baby Products",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Baby Clothing",
        "Feeding Supplies",
        "Diapers & Wipes",
        "Baby Gear",
        "Nursery & Furniture",
      ],
    },
    {
      name: "Sports & Entertainment",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Fitness Equipment",
        "Outdoor Sports Gear",
        "Indoor Games",
        "Musical Instruments",
        "Camping & Hiking Gear",
      ],
    },
    {
      name: "Gifts & Crafts",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Handmade Gifts",
        "Art Supplies",
        "DIY Craft Kits",
        "Decorative Items",
        "Seasonal Gifts",
      ],
    },
    {
      name: "Repair & Operations Tools",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Hand Tools",
        "Power Tools",
        "Industrial Equipment",
        "Safety Equipment",
        "Measuring Tools",
      ],
    },
    {
      name: "Raw Materials",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Metals & Alloys",
        "Plastics & Polymers",
        "Textiles & Fabrics",
        "Chemicals",
        "Wood & Timber",
      ],
    },
    {
      name: "Packaging",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Boxes & Cartons",
        "Plastic Packaging",
        "Labels & Stickers",
        "Protective Packaging",
        "Packaging Machinery",
      ],
    },
    {
      name: "Medical and Health",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Medical Equipment",
        "Health Monitoring Devices",
        "Supplements & Vitamins",
        "First Aid Supplies",
        "Personal Protective Equipment",
      ],
    },
    {
      name: "Other Products",
      image: "/beauty-personal-care.jpeg",
      subcategories: [
        "Miscellaneous Items",
        "Custom Products",
        "Clearance Items",
      ],
    },
  ];

  const subcategoryThumbs = [
    "/electronics.jpg",
    "/agriculture.jpg",
    "/healthcare.jpg",
    "/furniture.jpg",
    "/shop.jpg",
  ];

  const [activeCategory, setActiveCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateNavHeight = () => {
      const navbar = document.querySelector(".sticky.top-0");
      if (navbar) {
        setNavHeight(navbar.offsetHeight);
      } else {
        setNavHeight(70);
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    window.addEventListener("scroll", updateNavHeight);

    return () => {
      window.removeEventListener("resize", updateNavHeight);
      window.removeEventListener("scroll", updateNavHeight);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">

      {/* Sticky text bar */}
      <div
        style={{ top: navHeight }}
        className={`fixed left-0 w-full z-40 bg-white dark:bg-gray-800 border-b shadow-sm transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center gap-6 px-4 py-2 overflow-x-auto">
          {categories.map((cat, index) => {
            const isActive = activeCategory?.name === cat.name;

            return (
              <button
                key={index}
                onClick={() =>
                  setActiveCategory(isActive ? null : cat)
                }
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "hover:text-orange-500"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {isScrolled && <div style={{ height: navHeight }}></div>}

      {/* ICON BAR (now image bar) */}
      <div className="space-y-3">
        <div className="dark:bg-gray-800 shadow-sm px-2 sm:px-3 py-2 sm:py-3 overflow-x-auto flex justify-start sm:justify-center border-b">
          <div className="flex items-center gap-4 sm:gap-6 min-w-max">
            {categories.map((cat, index) => {
              const isActive = activeCategory?.name === cat.name;

              return (
                <button
                  key={index}
                  onClick={() =>
                    setActiveCategory(isActive ? null : cat)
                  }
                  className={`flex flex-col items-center min-w-15 sm:min-w-17.5 ${
                    isActive
                      ? "text-orange-500"
                      : "hover:text-orange-500"
                  }`}
                >
                  <div
                    className={`w-15 h-15 sm:w-18 sm:h-18 flex items-center justify-center rounded-full border overflow-hidden ${
                      isActive
                        ? "bg-orange-50 border-orange-200"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <span className="text-[10px] sm:text-xs mt-1 text-center">
                    {cat.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DROPDOWN */}
        <div
          className={`absolute left-0 top-full w-full z-30 transition-all duration-300 ${
            activeCategory
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {activeCategory && (
            <div className="bg-white dark:bg-gray-800 w-full shadow-xl border-t p-3 sm:p-5">
              <h2 className="text-sm sm:text-lg font-semibold mb-4 text-center">
                {activeCategory.name}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4 max-h-80 overflow-y-auto">
                {activeCategory.subcategories.map((sub, idx) => {
                  const thumb =
                    subcategoryThumbs[idx % subcategoryThumbs.length];

                  return (
                    <Link
                      key={sub}
                      href={`/products/${slugify(
                        activeCategory.name
                      )}/${slugify(sub)}`}
                      onClick={() => setActiveCategory(null)}
                      className="flex flex-col items-center group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden border group-hover:scale-105 transition">
                        <img
                          src={thumb}
                          alt={sub}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs mt-2 text-center group-hover:text-orange-500">
                        {sub}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex justify-end mt-5">
                <Link
                  href={`/products/${slugify(activeCategory.name)}`}
                  onClick={() => setActiveCategory(null)}
                  className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  View All →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;