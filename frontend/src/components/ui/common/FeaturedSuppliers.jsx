"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { suppliers } from "@/data/suppliers";


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
      <div className="grid grid-cols-3  gap-2 h-48">
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
                   p-2 rounded-full shadow-md
                   opacity-0 group-hover:opacity-100
                   transition duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 
                   bg-white/70 backdrop-blur-md 
                   hover:bg-white 
                   p-2 rounded-full shadow-md
                   opacity-0 group-hover:opacity-100
                   transition duration-300"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
const FeaturedSuppliers = () => {
  return (
    <div className="p-6 md:p-8 lg:p-10 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">
          Featured Suppliers
        </h2>
        <Link href="/suppliers/verified" className="text-sm text-orange-500 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 hover:border-orange-500 duration-300"
          >
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 font-bold">
                  {supplier.name.slice(0, 2)}
                </div>
                <div>
                  <Link
                          href={`/suppliers/${supplier.id}`}
                          className="block"
                        >
                  <h3 className="font-semibold text-sm md:text-base">
                    {supplier.name}
                  </h3>
                  </Link>
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {supplier.location} • {supplier.category}
                  </div>
                </div>
              </div>
              <SupplierImages images={supplier.images} />
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
              <hr />
              <div className="flex items-center text-sm text-gray-600 gap-6">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSuppliers;