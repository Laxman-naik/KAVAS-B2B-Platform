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
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

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
        <div className="col-span-2 row-span-2 overflow-hidden rounded-xl border border-[#E5E5E5]">
          <img
            src={visibleImages[0]}
            alt="product"
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {visibleImages.slice(1).map((img, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-[#E5E5E5]">
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
    <>
      <Navbar />
      <div className="bg-[#FFF8EC] min-h-screen">
        <div
          className="bg-[#0B1F3A] text-white w-full shadow-md 
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

        <div className="bg-white min-h-screen py-4 sm:py-6">
          <div className="px-4 sm:px-6 lg:px-10 xl:px-16 space-y-6">

            <div className="bg-white p-3 sm:p-4 rounded-xl flex flex-wrap gap-2 sm:gap-3 items-center shadow-sm border border-[#E5E5E5]">
              <span className="font-medium text-sm sm:text-base text-[#1A1A1A]">Filter:</span>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={`rounded-full px-3 sm:px-4 text-xs sm:text-sm ${
                    selectedCategory === cat
                      ? "bg-[#D4AF37] text-white"
                      : "border-[#E5E5E5] text-[#1A1A1A]"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold border-l-4 border-[#D4AF37] pl-2 text-[#1A1A1A]">
                All Suppliers
              </h2>
              <span className="text-[#D4AF37] cursor-pointer font-medium text-sm hover:underline">
                Become a supplier →
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className="group relative rounded-2xl border border-[#E5E5E5] hover:border-[#D4AF37] hover:shadow-lg transition duration-300 bg-white"
                >
                  <CardContent className="p-4 space-y-4">

                    <div className="space-y-3">
                      <div className="w-full h-16 flex items-center justify-center rounded-xl bg-[#FFF8EC] text-[#D4AF37] font-bold text-lg tracking-wide">
                        {getInitials(supplier.name)}
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/suppliers/${supplier.id}`}>
                            <h3 className="font-semibold text-sm sm:text-base leading-tight hover:text-[#D4AF37] transition">
                              {supplier.name}
                            </h3>
                          </Link>

                          <div className="flex items-center text-xs text-gray-500 gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-[#D4AF37]" />
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

                    <div className="flex flex-wrap gap-1">
                      {supplier.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="text-xs bg-[#FFF8EC] text-[#1A1A1A]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <SupplierImages images={supplier.images} />

                    <div className="grid grid-cols-3 text-center border-t pt-3">
                      <div>
                        <p className="font-semibold text-sm text-[#1A1A1A]">
                          {supplier.stats.products}
                        </p>
                        <p className="text-[11px] text-gray-500">Products</p>
                      </div>

                      <div>
                        <div className="flex justify-center items-center gap-1">
                          <p className="font-semibold text-sm text-[#1A1A1A]">
                            {supplier.stats.rating}
                          </p>
                          <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        </div>
                        <p className="text-[11px] text-gray-500">Rating</p>
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-[#1A1A1A]">
                          {supplier.stats.response}
                        </p>
                        <p className="text-[11px] text-gray-500">Response</p>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => e.preventDefault()}
                      className="w-full h-10 rounded-lg font-medium bg-[#D4AF37] hover:bg-[#b8962e] text-white text-sm shadow-sm"
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
      <Footer />
    </>
  );
};

export default VerifiedSuppliers;