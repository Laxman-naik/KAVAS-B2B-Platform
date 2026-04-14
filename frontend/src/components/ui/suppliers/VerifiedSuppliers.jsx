"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { suppliers } from "@/data/suppliers";

const categories = [
  "All",
  "Electronics",
  "Apparel",
  "Hardware",
  "FMCG",
  "Health",
  "Machinery",
  "Agriculture",
  "Furniture",
  "Chemicals",
];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const SupplierImages = ({ images }) => {
  const [startIndex, setStartIndex] = useState(0);

  const getVisibleImages = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(images[(startIndex + i) % images.length]);
    }
    return result;
  };

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const visibleImages = getVisibleImages();

  return (
    <div className="relative group">
      <div className="grid grid-cols-3 gap-2 h-32">
        <div className="col-span-2 row-span-2 overflow-hidden rounded-xl border">
          <img
            src={visibleImages[0]}
            alt="product"
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {visibleImages.slice(1).map((img, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <img
              src={img}
              alt="product"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 
                   bg-white/80 hover:bg-white 
                   p-1 rounded-full shadow-md
                   opacity-0 group-hover:opacity-100
                   transition duration-300"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 
                   bg-white/80 hover:bg-white 
                   p-1 rounded-full shadow-md
                   opacity-0 group-hover:opacity-100
                   transition duration-300"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const VerifiedSuppliers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSuppliers =
    selectedCategory === "All"
      ? suppliers
      : suppliers.filter((s) => s.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER */}
      <div
        className="bg-orange-500 text-white w-full shadow-md 
                flex flex-col items-center justify-center 
                text-center 
                py-6 sm:py-8 lg:py-10 
                min-h-30 sm:min-h-35"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          🏭 Verified Supplier Directory
        </h1>
        <p className="text-xs sm:text-sm mt-2 max-w-xl">
          500+ verified wholesale suppliers across all industries
        </p>
      </div>

      {/* BODY */}
      <div className="bg-gray-50 min-h-screen py-4 sm:py-6">
        <div className="px-4 sm:px-6 lg:px-10 xl:px-16 space-y-6">

          {/* FILTER */}
          <div className="bg-white p-3 sm:p-4 rounded-xl flex flex-wrap gap-2 sm:gap-3 items-center shadow-sm">
            <span className="font-medium text-sm sm:text-base">Filter:</span>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="rounded-full px-3 sm:px-4 text-xs sm:text-sm"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* TITLE */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold border-l-4 border-orange-500 pl-2">
              All Suppliers
            </h2>
            <span className="text-orange-500 cursor-pointer font-medium text-sm hover:underline">
              Become a supplier →
            </span>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className="group relative rounded-2xl border border-gray-200 hover:border-orange-400 hover:shadow-lg transition duration-300 bg-white"
              >
                <CardContent className="p-4 space-y-4">

                  {/* HEADER UPDATED */}
                  <div className="space-y-3">

                    {/* FULL WIDTH INITIALS */}
                    <div className="w-full h-16 flex items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold text-lg tracking-wide">
                      {getInitials(supplier.name)}
                    </div>

                    {/* NAME + VERIFIED */}
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/suppliers/${supplier.id}`}>
                          <h3 className="font-semibold text-sm sm:text-base leading-tight hover:text-orange-600 transition">
                            {supplier.name}
                          </h3>
                        </Link>

                        <div className="flex items-center text-xs text-gray-500 gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {supplier.location}
                        </div>
                      </div>

                      {supplier.tags.includes("Verified") && (
                        <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-[10px] font-medium text-green-700">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1">
                    {supplier.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* IMAGES */}
                  <SupplierImages images={supplier.images} />

                  {/* STATS */}
                  <div className="grid grid-cols-3 text-center border-t pt-3">
                    <div>
                      <p className="font-semibold text-sm text-black">
                        {supplier.stats.products}
                      </p>
                      <p className="text-[11px] text-gray-500">Products</p>
                    </div>

                    <div>
                      <div className="flex justify-center items-center gap-1">
                        <p className="font-semibold text-sm text-black">
                          {supplier.stats.rating}
                        </p>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <p className="text-[11px] text-gray-500">Rating</p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-black">
                        {supplier.stats.response}
                      </p>
                      <p className="text-[11px] text-gray-500">Response</p>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <Button
                    onClick={(e) => e.preventDefault()}
                    className="w-full h-10 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white text-sm shadow-sm"
                  >
                    Contact Supplier
                  </Button>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedSuppliers;