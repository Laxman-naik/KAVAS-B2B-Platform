"use client";
import React, { useState, useRef, useEffect } from "react";
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
  ChevronRight,
  Menu,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slugify = (text) =>
  text.toLowerCase().replace(/ & /g, "and").replace(/\s+/g, "-");

const Hero = () => {
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
      ],
      products: [
        "Microwave",
        "Blender",
        "Air Fryer",
        "Refrigerator",
        "Vacuum Cleaner",
        "Steam Cleaner",
        "Air Conditioner",
        "Washing Machine",
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
      products: [
        "Smartphones",
        "Phone Cases",
        "Chargers",
        "Power Banks",
        "Laptops",
        "Desktops",
        "Smart TVs",
        "Headphones",
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
      products: [
        "Shirts",
        "T-Shirts",
        "Jeans",
        "Jackets",
        "Dresses",
        "Sneakers",
        "Handbags",
        "Watches",
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
      products: [
        "Face Cream",
        "Cleanser",
        "Sunscreen",
        "Shampoo",
        "Conditioner",
        "Lipstick",
        "Perfumes",
        "Deodorant",
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
      products: [
        "STEM Kits",
        "Learning Tablets",
        "Superhero Figures",
        "Barbie Dolls",
        "Slides",
        "Swings",
        "Chess",
        "RC Cars",
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
      products: [
        "Onesies",
        "Sleepwear",
        "Bottles",
        "High Chairs",
        "Disposable Diapers",
        "Wet Wipes",
        "Strollers",
        "Cribs",
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
      products: [
        "Treadmills",
        "Dumbbells",
        "Yoga Mats",
        "Footballs",
        "Cricket Bats",
        "Chess Boards",
        "Guitars",
        "Camping Tents",
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
      products: [
        "Gift Boxes",
        "Greeting Cards",
        "Paint Sets",
        "Brush Kits",
        "Craft Paper",
        "Home Decor",
        "Festival Gifts",
        "DIY Kits",
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
      products: [
        "Hammer",
        "Screwdriver Set",
        "Drilling Machine",
        "Angle Grinder",
        "Safety Gloves",
        "Helmet",
        "Measuring Tape",
        "Wrench Set",
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
      products: [
        "Steel Sheets",
        "Aluminum Rods",
        "Plastic Granules",
        "PVC Material",
        "Cotton Fabric",
        "Industrial Chemicals",
        "Plywood",
        "Timber Logs",
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
      products: [
        "Corrugated Boxes",
        "Mailer Boxes",
        "Plastic Wrap",
        "Pouches",
        "Custom Labels",
        "Barcode Stickers",
        "Bubble Wrap",
        "Sealing Machines",
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
      products: [
        "Thermometers",
        "BP Monitors",
        "Oximeters",
        "Vitamin Tablets",
        "Protein Supplements",
        "First Aid Kits",
        "Face Masks",
        "Gloves",
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
      products: [
        "Special Orders",
        "Custom Bundles",
        "Discounted Stock",
        "Bulk Clearance",
        "Mixed Products",
      ],
    },
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
  const [showCategoryListMobile, setShowCategoryListMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [current, setCurrent] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowCategoryListMobile(true);
      } else {
        setShowCategoryListMobile(false);
        setShowMenu(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (window.innerWidth < 1024) {
          setShowCategoryListMobile(false);
        }
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const toggleCategories = () => {
    if (window.innerWidth < 1024) {
      setShowCategoryListMobile((prev) => !prev);
      setShowMenu(false);
    }
  };

  return (
    <div className=" min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
          <div ref={menuRef} className="relative w-full lg:w-64 shrink-0">
            <aside className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 lg:h-[420px] flex flex-col overflow-visible">
              <div
                className="flex items-center justify-between gap-2 px-4 py-3 bg-orange-500 text-white font-semibold rounded-t-2xl shrink-0 cursor-pointer lg:cursor-default"
                onClick={toggleCategories}
              >
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5" />
                  <span>All Categories</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform lg:hidden ${
                    showCategoryListMobile ? "rotate-180" : ""
                  }`}
                />
              </div>

              <ul
                className={`overflow-y-auto lg:flex-1 ${
                  showCategoryListMobile ? "block" : "hidden"
                } lg:block`}
              >
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setActiveCategory(cat);
                        setShowMenu(true);
                      }}
                      className={`flex items-center justify-between px-3 sm:px-4 py-2.5 border-b hover:bg-orange-50 cursor-pointer min-h-[42px] ${
                        activeCategory.name === cat.name
                          ? ""
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm truncate">{cat.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </li>
                  );
                })}
              </ul>

              <div
                className={`absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border transition-all duration-300
                top-full left-0 mt-2 w-full flex-col
                lg:top-0 lg:left-full lg:mt-0 lg:ml-2 lg:w-[520px]
                ${
                  showMenu
                    ? "opacity-100 translate-x-0 flex"
                    : "opacity-0 translate-y-2 lg:translate-y-0 lg:translate-x-5 pointer-events-none hidden"
                }`}
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-60 border-b lg:border-b-0 lg:border-r p-4">
                    <h3 className="font-semibold mb-3 text-sm sm:text-base">
                      {activeCategory.name}
                    </h3>

                    {activeCategory.subcategories.length > 0 ? (
                      activeCategory.subcategories.map((sub, i) => (
                        <Link
                          key={i}
                          href={`/products/${slugify(activeCategory.name)}/${slugify(sub)}`}
                          onClick={() => {
                            setShowMenu(false);
                            if (window.innerWidth < 1024) {
                              setShowCategoryListMobile(false);
                            }
                          }}
                        >
                          <p className="text-sm py-1.5 hover:text-orange-500 cursor-pointer break-words">
                            {sub}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No subcategories</p>
                    )}
                  </div>

                  <div className="w-full lg:w-72 p-4 flex flex-col">
                    <h3 className="font-semibold mb-3 text-sm sm:text-base">
                      Top Products
                    </h3>

                    <Link href={`/products/${slugify(activeCategory.name)}`}>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4">
                        {activeCategory.products &&
                        activeCategory.products.length > 0 ? (
                          activeCategory.products.slice(0, 8).map((prod, i) => (
                            <p
                              key={i}
                              className="text-sm py-1 hover:text-orange-500 cursor-pointer break-words"
                            >
                              {prod}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">
                            No products available
                          </p>
                        )}
                      </div>
                    </Link>

                    <Link
                      href={`/products/${slugify(activeCategory.name)}`}
                      onClick={() => {
                        setShowMenu(false);
                        if (window.innerWidth < 1024) {
                          setShowCategoryListMobile(false);
                        }
                      }}
                    >
                      <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md text-sm font-medium transition w-full lg:w-auto">
                        View All Products →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="relative w-full lg:flex-1 overflow-hidden lg:h-[420px]">
            <div
              className="flex transition-transform duration-500 h-full"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="min-w-full h-full">
                  <div className="relative text-white rounded-2xl h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] flex overflow-hidden">
                    <img
                      src={slideImages[index]}
                      alt="slide"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="p-5 sm:p-6 md:p-10 flex flex-col justify-center relative z-10 w-full max-w-2xl">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        {slide.title} <br />
                        <span className="text-blue-300">{slide.highlight}</span>
                      </h1>

                      <p className="mt-3 text-sm sm:text-base text-gray-200 max-w-xl">
                        {slide.desc}
                      </p>

                      <div className="mt-3 space-y-1">
                        {[
                          [
                            "🔥 Electronics Deals",
                            "Bulk Laptop Offers",
                            "Headphones Sale",
                          ],
                          [
                            "🌾 Seeds Discount",
                            "Fertilizer Deals",
                            "Farm Tools",
                          ],
                          [
                            "💊 Medical Supplies",
                            "Pharma Deals",
                            "Equipment Offers",
                          ],
                          [
                            "🛋️ Furniture Deals",
                            "Office Setup",
                            "Bulk Sofa Discounts",
                          ],
                          [
                            "📦 B2B Deals",
                            "Bulk Discounts",
                            "Top Suppliers",
                          ],
                        ][index].map((deal, i) => (
                          <p
                            key={i}
                            className="text-yellow-300 text-xs sm:text-sm"
                          >
                            {deal}
                          </p>
                        ))}
                      </div>

                      <Button className="mt-5 bg-white text-orange-500 w-full sm:w-fit">
                        🚀 Start sourcing free
                      </Button>

                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 text-xs sm:text-sm">
                        <span>✔ Verified</span>
                        <span>🔒 Secure</span>
                        <span>🚚 Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl relative overflow-hidden hover:scale-[1.01] hover:shadow-xl h-[180px] sm:h-[200px] md:h-[220px]">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
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

          <div className="rounded-xl relative overflow-hidden hover:scale-[1.01] hover:shadow-xl h-[180px] sm:h-[200px] md:h-[220px]">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
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
      </div>
    </div>
  );
};

export default Hero;