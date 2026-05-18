"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  Home,
  ChevronRight,
  ShieldCheck,
  Truck,
  Headphones,
  RotateCcw,
  Sofa,
  Baby,
  Dumbbell,
  Sparkles,
  Shirt,
  Gamepad2,
  BriefcaseBusiness,
  ShoppingCart,
  Package,
  Wrench,
} from "lucide-react";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/ & /g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getProductNumber = (count = "") => Number(count.replace(/\D/g, ""));

const page = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [showFilters, setShowFilters] = useState(false);
  const [productRange, setProductRange] = useState("All");
  const [categoryType, setCategoryType] = useState("All");

  const categories = useMemo(
    () => [
      {
        name: "Home Appliances",
        image:
          "https://images.pexels.com/photos/26793170/pexels-photo-26793170.jpeg",
        count: "1200+ Products",
        icon: Sofa,
        featured: true,
        type: "Featured",
      },
      {
        name: "Electronics",
        image:
          "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg",
        count: "850+ Products",
        icon: Headphones,
        featured: true,
        type: "Featured",
      },
      {
        name: "Fashion Wear",
        image:
          "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
        count: "950+ Products",
        icon: Shirt,
        featured: true,
        type: "Trending",
      },
      {
        name: "Beauty & Personal Care",
        image:
          "https://images.pexels.com/photos/33362027/pexels-photo-33362027.jpeg",
        count: "650+ Products",
        icon: Sparkles,
        featured: false,
        type: "New Arrivals",
      },
      {
        name: "Baby Products",
        image:
          "https://images.pexels.com/photos/7282784/pexels-photo-7282784.jpeg",
        count: "900+ Products",
        icon: Baby,
        featured: true,
        type: "Featured",
      },
      {
        name: "Kid Toys",
        image:
          "https://images.pexels.com/photos/3661243/pexels-photo-3661243.jpeg",
        count: "750+ Products",
        icon: Gamepad2,
        featured: false,
        type: "Trending",
      },
      {
        name: "Sports & Entertainment",
        image:
          "https://images.pexels.com/photos/3763874/pexels-photo-3763874.jpeg",
        count: "900+ Products",
        icon: Dumbbell,
        featured: false,
        type: "Trending",
      },
      {
        name: "Gifts & Crafts",
        image:
          "https://images.pexels.com/photos/5802139/pexels-photo-5802139.jpeg",
        count: "900+ Products",
        icon: Package,
        featured: false,
        type: "New Arrivals",
      },
      {
        name: "Repair & Operations Tools",
        image:
          "https://images.pexels.com/photos/19582317/pexels-photo-19582317.jpeg",
        count: "900+ Products",
        icon: Wrench,
        featured: true,
        type: "Featured",
      },
      {
        name: "Raw Materials",
        image:
          "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg",
        count: "900+ Products",
        icon: BriefcaseBusiness,
        featured: false,
        type: "Trending",
      },
      {
        name: "Packaging",
        image:
          "https://images.pexels.com/photos/10229587/pexels-photo-10229587.jpeg",
        count: "900+ Products",
        icon: Package,
        featured: true,
        type: "Featured",
      },
      {
        name: "Medical and Health",
        image:
          "https://images.pexels.com/photos/13105347/pexels-photo-13105347.jpeg",
        count: "900+ Products",
        icon: ShieldCheck,
        featured: false,
        type: "New Arrivals",
      },
      {
        name: "Other Products",
        image:
          "https://images.pexels.com/photos/33349417/pexels-photo-33349417.jpeg",
        count: "900+ Products",
        icon: ShoppingCart,
        featured: false,
        type: "All",
      },
    ],
    []
  );

  const filteredCategories = useMemo(() => {
    let data = [...categories];

    if (search.trim()) {
      data = data.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortBy === "Featured") {
      data.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    if (sortBy === "Alphabetically, A-Z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "Alphabetically, Z-A") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sortBy === "Products: High to Low") {
      data.sort(
        (a, b) => getProductNumber(b.count) - getProductNumber(a.count)
      );
    }

    if (sortBy === "Products: Low to High") {
      data.sort(
        (a, b) => getProductNumber(a.count) - getProductNumber(b.count)
      );
    }

    return data;
  }, [categories, search, productRange, categoryType, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setProductRange("All");
    setCategoryType("All");
    setSortBy("Featured");
  };

  return (
    <main className="min-h-screen bg-white text-[#0B1F3A]">
      <section className="mx-auto max-w-[1500px] px-6 py-5">
       

        <div className="relative overflow-hidden rounded-sm border border-[#E5E5E5] text-white bg-[#0B1F3A] px-10 py-10">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs  font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              Shop By Category
            </p>

            <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-white">
              All Categories
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-white/70">
              Explore our wide range of product categories and find the perfect
              items for your needs.
            </p>
          </div>

          <div className="absolute bottom-0 right-12 hidden h-56 w-[520px] rounded-t-full bg-white/70 lg:block" />
          <div className="absolute right-24 top-16 hidden text-[120px] font-black text-[#D4AF37]/20 lg:block">
            SHOP
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-base font-semibold text-[#0B1F3A]">
            Showing {filteredCategories.length} Categories
          </p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0B1F3A]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-3xl rounded-sm border border-[#E5E5E5] bg-white pl-12 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#0B1F3A]/70">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 min-w-[185px] rounded-sm border border-[#D4AF37] bg-white px-4 text-sm font-bold outline-none"
              >
                <option>Featured</option>
                <option>Alphabetically, A-Z</option>
                <option>Alphabetically, Z-A</option>
                <option>Products: High to Low</option>
                <option>Products: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link
                key={cat.name}
                href={`/products/${slugify(cat.name)}`}
                className="group overflow-hidden rounded-sm border border-[#E5E5E5] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:shadow-md"
              >
                <div className="relative h-28 overflow-hidden bg-[#FFF8EC]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3A] text-white shadow">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-base font-extrabold text-[#0B1F3A]">
                    {cat.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-[#0B1F3A]/60">
                    {cat.count}
                  </p>

                  <p className="mt-3 text-xs font-bold text-[#D4AF37]">
                    Explore Category →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-7 grid rounded-sm border border-[#E5E5E5] bg-white px-6 py-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Secure Shopping",
              text: "100% secure payment",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              text: "Quick delivery at your doorstep",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              text: "We're here to help you",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              text: "Hassle-free returns",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 border-[#E5E5E5] py-2 lg:border-r lg:pl-8 last:border-r-0"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#0B1F3A]/60">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default page;