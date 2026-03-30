"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ChevronLeft, ChevronRight, CheckCircle, } from "lucide-react";
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
    <div className="relative group ">
      <div className="grid grid-cols-3 gap-2 h-28">
        <div className="col-span-2 row-span-2 overflow-hidden rounded-xl">
          <img
            src={visibleImages[0]}
            alt="product"
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
        {visibleImages.slice(1).map((img, i) => (
          <div key={i} className="overflow-hidden rounded-xl">
            <img
              src={img}
              alt="product"
              className="w-full h-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 
                   bg-white/70 backdrop-blur-md 
                   hover:bg-white 
                   p-1 rounded-full shadow-md
                   opacity-0 group-hover:opacity-100
                   transition duration-300"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 
                   bg-white/70 backdrop-blur-md 
                   hover:bg-white 
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
      <div className="bg-orange-500 text-white w-full shadow-md 
                flex flex-col items-center justify-center 
                text-center 
                py-6 sm:py-8 lg:py-10 
                min-h-30 sm:min-h-35">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          🏭 Verified Supplier Directory
        </h1>
        <p className="text-xs sm:text-sm mt-2 max-w-xl">
          500+ verified wholesale suppliers across all industries
        </p>
      </div>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold border-l-4 border-orange-500 pl-2">
              All Suppliers
            </h2>
            <span className="text-orange-500 cursor-pointer font-medium text-sm hover:underline">
              Become a supplier →
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className="relative rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 hover:border-orange-500 duration-300 cursor-pointer w-full"
              >
                {supplier.tags.includes("Verified") && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500 px-2 py-1 rounded-2xl shadow-sm">
                    <CheckCircle className="w-4 h-4 text-black" />
                    <p className="text-xs text-black font-medium">Verified</p>
                  </div>
                )}
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 font-bold">
                      {getInitials(supplier.name)}
                    </div>
                    <div className="flex items-center gap-1">
                      <div>
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          className="block"
                        >
                          <h3 className="font-semibold text-sm sm:text-base">
                            {supplier.name}
                          </h3>
                        </Link>
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {supplier.location} • {supplier.category}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supplier.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className={`text-xs ${index === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                          }`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <SupplierImages images={supplier.images} />
                  <hr />
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      <p className="font-bold text-black">
                        {supplier.stats.products}
                      </p>
                      <p className="text-xs">Products</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-black">
                          {supplier.stats.rating}
                        </p>
                        <Star className="w-4 h-4 fill-black" />
                      </div>
                      <p className="text-xs">Rating</p>
                    </div>
                    <div>
                      <p className="font-bold text-black">
                        {supplier.stats.response}
                      </p>
                      <p className="text-xs">Response</p>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => e.preventDefault()}
                    className="w-full font-semibold py-5 bg-orange-500 hover:bg-orange-600 text-white text-sm"
                  >
                    Contact Supplier →
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