"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/ & /g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SubNavbar = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRef = useRef(null);
  const router = useRouter();

  const categories = useMemo(
    () => [
      {
        name: "Electronics",
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
        name: "Home Appliances",
        subcategories: [
          "Kitchen Appliances",
          "Cleaning Appliances",
          "Heating & Cooling",
          "Laundry Appliances",
          "Smart Home Devices",
        ],
      },
      {
        name: "Fashion Wear",
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
        subcategories: [
          "Miscellaneous Items",
          "Custom Products",
          "Clearance Items",
        ],
      },
    ],
    []
  );

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!categoryOpen) return;
    setActiveCategory(null);
  }, [categoryOpen, categories]);

  return (
    <div className="hidden lg:block border-t border-t-white/10 border-b border-b-[#D4AF37] bg-[#0B1F3A]/95 backdrop-blur">
      <div className="w-full  px-6 lg:px-10">
        <div className="flex items-center gap-6 h-14">
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setCategoryOpen((v) => !v)}
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition"
            >
              <Menu className="h-5 w-5 text-[#D4AF37]" />
              All Categories
              <ChevronDown
                className={`h-4 w-4 text-white/70 transition-transform duration-300 ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoryOpen && (
              <div
                className={`absolute left-0 top-full mt-3 bg-white rounded-lg shadow-2xl border border-[#E5E5E5] z-50 overflow-hidden transition-[width] duration-200 ease-out ${
                  activeCategory ? "w-195" : "w-65"
                }`}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div
                  className={`grid ${
                    activeCategory ? "grid-cols-[260px_1fr]" : "grid-cols-1"
                  }`}
                >
                  <div
                    className={`bg-[#FFF8EC]/40 py-2 max-h-105 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                      activeCategory ? "border-r border-[#E5E5E5]" : ""
                    }`}
                  >
                    {categories.map((cat) => {
                      const isActive = activeCategory?.name === cat.name;

                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => {
                            setCategoryOpen(false);
                            router.push(`/products/${slugify(cat.name)}`);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition ${
                            isActive
                              ? "bg-[#D4AF37] text-[#0B1F3A] font-semibold"
                              : "text-[#1A1A1A] hover:bg-[#D4AF37] hover:text-[#0B1F3A]"
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {activeCategory && (
                    <div className="relative p-5 pb-16 max-h-105 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="text-base font-semibold text-[#0B1F3A]">
                        {activeCategory.name}
                      </div>

                      <div className="mt-4 flex gap-8">
                        {Array.from({
                          length: Math.ceil(
                            (activeCategory.subcategories || []).length / 6
                          ),
                        }).map((_, colIndex) => (
                          <div
                            key={colIndex}
                            className="flex flex-col gap-2 min-w-44"
                          >
                            {(activeCategory.subcategories || [])
                              .slice(colIndex * 6, colIndex * 6 + 6)
                              .map((sub) => (
                                <Link
                                  key={sub}
                                  href={`/products/${slugify(activeCategory.name)}/${slugify(sub)}`}
                                  onClick={() => setCategoryOpen(false)}
                                  className="text-sm text-[#1A1A1A] hover:text-[#D4AF37]"
                                >
                                  {sub}
                                </Link>
                              ))}
                          </div>
                        ))}
                      </div>

                      <div className="absolute right-5 bottom-5">
                        <Link
                          href={`/products/${slugify(activeCategory.name)}`}
                          onClick={() => setCategoryOpen(false)}
                          className="px-4 py-2 text-sm rounded-sm font-semibold shadow-sm"
                          style={{
                            backgroundColor: "#D4AF37",
                            color: "#0B1F3A",
                          }}
                        >
                          View All →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 flex items-center justify-center gap-10 text-sm font-medium">
            <Link
              href="/"
              className="relative hover:text-[#D4AF37] text-white/80 group"
            >
              Home
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </Link>

            {[
              { name: "Flash Deals", href: "/flashdeals" },
              // { name: "Bulk Orders", href: "/help" },
              { name: "Track Order", href: "/ordertracking" },
              { name: "About Us", href: "/aboutus" },
              { name: "Contact Us", href: "/contactus" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-white/80 hover:text-[#D4AF37] transition group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="w-72" />
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;