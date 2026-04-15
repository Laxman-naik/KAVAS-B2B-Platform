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
      image: "https://images.pexels.com/photos/26793170/pexels-photo-26793170.jpeg",
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
      image: "https://images.pexels.com/photos/18304033/pexels-photo-18304033.jpeg",
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
      image: "https://images.pexels.com/photos/14642654/pexels-photo-14642654.jpeg",
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
      image: "https://images.pexels.com/photos/33362027/pexels-photo-33362027.jpeg",
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
      image: "https://images.pexels.com/photos/3661243/pexels-photo-3661243.jpeg",
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
      image: "https://media.istockphoto.com/id/864501328/photo/baby-products-symbols-for-newborns.jpg?b=1&s=612x612&w=0&k=20&c=0nl2Ts-j1A6yrflXG9Xry9w-Ob2Tw3RDQodIPUSZB-c=",
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
      image: "data:image/jpeg;base64,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",
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
      image: "https://images.pexels.com/photos/5802139/pexels-photo-5802139.jpeg",
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
      image: "https://images.pexels.com/photos/19582317/pexels-photo-19582317.jpeg",
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
      image: "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg",
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
      image: "https://images.pexels.com/photos/10229587/pexels-photo-10229587.jpeg",
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
      image: "https://images.pexels.com/photos/13105347/pexels-photo-13105347.jpeg",
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
      image: "https://images.pexels.com/photos/33349417/pexels-photo-33349417.jpeg",
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
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const dropdownRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

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

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div
        style={{ top: navHeight }}
        className={`fixed left-0 w-full z-40 h-9 py-2 bg-white dark:bg-gray-800 cursor-pointer border-b shadow-sm transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="relative flex items-center">
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10  px-2 h-full shadow"
          >
            ◀
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-6 px-8 py-0 overflow-hidden scroll-smooth"
          >
            {categories.map((cat, index) => {
              const isActive = activeCategory?.name === cat.name;

              return (
                <button
                  key={index}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const dropdownWidth = 700;
                    const screenWidth = window.innerWidth;

                    let left = rect.left;

                    if (left + dropdownWidth > screenWidth) {
                      left = screenWidth - dropdownWidth - 10;
                    }

                    if (left < 10) {
                      left = 10;
                    }

                    setDropdownLeft(left);
                    setActiveCategory(cat);
                  }}
                  className={`text-xs sm:text-sm whitespace-nowrap border-b-2 ${
                    isActive
                      ? "text-orange-500 font-semibold border-orange-500"
                      : "border-transparent hover:text-orange-500 hover:border-orange-300"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10  px-2 h-full shadow"
          >
            ▶
          </button>
        </div>
      </div>

      {isScrolled && <div style={{ height: navHeight }}></div>}

      <div className="space-y-3">
        <div className="dark:bg-gray-800 shadow-sm px-2 sm:px-3 py-2 sm:py-3 overflow-x-auto flex justify-start sm:justify-center border-b">
          <div className="flex items-center gap-4 sm:gap-6 min-w-max">
            {categories.map((cat, index) => {
              const isActive = activeCategory?.name === cat.name;

              return (
                <button
                  key={index}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const dropdownWidth = 700;
                    const screenWidth = window.innerWidth;

                    let left = rect.left;

                    if (left + dropdownWidth > screenWidth) {
                      left = screenWidth - dropdownWidth - 10;
                    }

                    if (left < 10) {
                      left = 10;
                    }

                    setDropdownLeft(left);
                    setActiveCategory(cat);
                  }}
                  className={`flex flex-col items-center min-w-15 sm:min-w-17.5 cursor-pointer ${
                    isActive ? "text-orange-500" : "hover:text-orange-500"
                  }`}
                >
                  <div
                    className={`w-15 h-15 sm:w-18 sm:h-18 flex items-center justify-center  rounded-full border overflow-hidden ${
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

                  <span className="text-[10px] sm:text-xs mt-1 font-semibold text-center">
                    {cat.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div
          onMouseEnter={() => setActiveCategory(activeCategory)}
          style={{
            left: dropdownLeft,
            top: isScrolled ? navHeight : undefined,
          }}
          className={`${
            isScrolled ? "fixed" : "absolute top-full"
          } z-30 transition-all duration-300 ${
            activeCategory
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {activeCategory && (
            <div className="bg-white dark:bg-gray-800 shadow-xl border-t p-2 sm:p-5 pt-10 mt-9 sm:pt-8 w-175">
              <h2 className="text-sm sm:text-lg font-semibold mb-4 text-left">
                {activeCategory.name}
              </h2>
              <div className="flex gap-8 max-h-80 overflow-y-auto">
                {Array.from({
                  length: Math.ceil(activeCategory.subcategories.length / 6),
                }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex flex-col gap-2 min-w-37.5"
                  >
                    {activeCategory.subcategories
                      .slice(colIndex * 6, colIndex * 6 + 6)
                      .map((sub) => (
                        <Link
                          key={sub}
                          href={`/products/${slugify(
                            activeCategory.name,
                          )}/${slugify(sub)}`}
                          onClick={() => setActiveCategory(null)}
                          className="text-sm text-gray-700 hover:text-orange-500"
                        >
                          {sub}
                        </Link>
                      ))}
                  </div>
                ))}
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
