"use client";
import React, { useState, useEffect, useRef } from "react";
import {ShoppingCart, Grid,Shirt,Wrench,Settings,Wheat,FlaskConical,Sofa,Car,Pill,Package,Construction,} from "lucide-react";
import Link from "next/link";

const slugify = (text) =>
  text.toLowerCase().replace(/ & /g, "and").replace(/\s+/g, "-");

const Categories = () => {
  const categories = [
    {
      name: "Home Appliances",
      icon: Sofa,
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
      icon: Grid,
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
      icon: Shirt,
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
      icon: FlaskConical,
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
      icon: ShoppingCart,
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
      icon: Car,
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
      icon: Settings,
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
      icon: Package,
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
      icon: Wrench,
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
      icon: Wheat,
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
      icon: Construction,
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
      icon: Pill,
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
      icon: ShoppingCart,
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
  const dropdownRef = useRef(null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="space-y-3 relative">
      <div className="dark:bg-gray-800 shadow-sm px-2 sm:px-3 mt-5 sm:mt-7 py-2 sm:py-3 overflow-x-auto flex justify-start sm:justify-center border-b">
        <div className="flex items-center gap-4 sm:gap-6 min-w-max">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = activeCategory?.name === cat.name;

            return (
              <button
                key={index}
                onClick={() =>
                  setActiveCategory(isActive ? null : cat)
                }
                className={`flex flex-col items-center cursor-pointer min-w-15 sm:min-w-17.5 ${isActive ? "text-orange-500" : "hover:text-orange-500"
                  }`}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full  border ${isActive
                      ? "bg-orange-50 border-orange-200"
                      : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] sm:text-xs mt-1 text-center">
                  {cat.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`absolute left-0 top-full w-full z-50 transition-all duration-300 ease-in-out ${activeCategory
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        {activeCategory && (
          <div className="bg-white dark:bg-gray-800 w-full shadow-xl border-t p-3 sm:p-5">

            <h2 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-5 text-center">
              {activeCategory.name}
            </h2>


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-3 sm:gap-4 max-h-65 sm:max-h-75 md:max-h-85 overflow-y-auto">
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
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-xl overflow-hidden border group-hover:scale-105 transition">
                      <img
                        src={thumb}
                        alt={sub}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs mt-2 text-center group-hover:text-orange-500">
                      {sub}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <Link
                href={`/products/${slugify(activeCategory.name)}`}
                onClick={() => setActiveCategory(null)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                View All →
              </Link>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default Categories;