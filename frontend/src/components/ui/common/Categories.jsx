"use client";

import React, { useMemo } from "react";
import Link from "next/link";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/ & /g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Categories = () => {
  const categories = useMemo(
    () => [
      {
        name: "Home Appliances",
        image:
          "https://images.pexels.com/photos/26793170/pexels-photo-26793170.jpeg",
        count: "1200+ Products",
      },
      {
        name: "Electronics",
        image:
          "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg",
        count: "850+ Products",
      },
      {
        name: "Fashion Wear",
        image:
          "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
        count: "950+ Products",
      },
      {
        name: "Beauty & Personal Care",
        image:
          "https://images.pexels.com/photos/33362027/pexels-photo-33362027.jpeg",
        count: "650+ Products",
      },
      {
        name: "Kid Toys",
        image:
          "https://images.pexels.com/photos/3661243/pexels-photo-3661243.jpeg",
        count: "750+ Products",
      },
      {
        name: "Baby Products",
        image:
          "https://images.pexels.com/photos/7282784/pexels-photo-7282784.jpeg",
        count: "900+ Products",
      },
      {
        name: "Sports & Entertainment",
        image:
          "https://images.pexels.com/photos/3763874/pexels-photo-3763874.jpeg",
        count: "900+ Products",
      },
      {
        name: "Gifts & Crafts",
        image:
          "https://images.pexels.com/photos/5802139/pexels-photo-5802139.jpeg",
        count: "900+ Products",
      },
      {
        name: "Repair & Operations Tools",
        image:
          "https://images.pexels.com/photos/19582317/pexels-photo-19582317.jpeg",
        count: "900+ Products",
      },
      {
        name: "Raw Materials",
        image:
          "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg",
        count: "900+ Products",
      },
      {
        name: "Packaging",
        image:
          "https://images.pexels.com/photos/10229587/pexels-photo-10229587.jpeg",
        count: "900+ Products",
      },
      {
        name: "Medical and Health",
        image:
          "https://images.pexels.com/photos/13105347/pexels-photo-13105347.jpeg",
        count: "900+ Products",
      },
      {
        name: "Other Products",
        image:
          "https://images.pexels.com/photos/33349417/pexels-photo-33349417.jpeg",
        count: "900+ Products",
      },
    ],
    []
  );

  return (
    <section className="bg-white">
      <div className="w-full px-3 sm:px-4 md:px-6 py-8 sm:py-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-5 bg-[#D4AF37]/60"></span>

            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-[#0B1F3A]/60">
              SHOP BY CATEGORY
            </span>

            <span className="h-px w-5 bg-[#D4AF37]/60"></span>
          </div>

          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            Top Categories
          </div>

        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href="/categories"
            className="text-sm font-semibold text-[#0B1F3A] hover:text-[#D4AF37]"
          >
            View All Categories →
          </Link>
        </div>

        <div className="mt-5">
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch gap-3 sm:gap-4 pr-1">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/products/${slugify(cat.name)}`}
                  className="group w-35 sm:w-40 lg:w-45 shrink-0 rounded-sm border border-black/10 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="aspect-5/4 bg-[#FFF8EC] overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-[13px] font-extrabold text-[#0B1F3A] leading-tight">
                      {cat.name}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[#0B1F3A]/60">
                      {cat.count}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;