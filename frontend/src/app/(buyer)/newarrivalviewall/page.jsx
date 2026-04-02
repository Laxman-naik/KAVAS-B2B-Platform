"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { ShoppingCart, Heart } from "lucide-react";

const productsData = [
  {
    id: 1,
    name: "Laptop Cooling Pad USB Wholesale",
    category: "Laptops & Computers",
    price: 420,
    oldPrice: 550,
    minQty: 30,
    supplier: "GadgetHub Pvt.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  },
  {
    id: 2,
    name: "Over-Ear Headphones Noise Cancel",
    category: "Audio & Headphones",
    price: 1100,
    oldPrice: 1400,
    minQty: 20,
    supplier: "SoundWave India",
    image: "https://images.unsplash.com/photo-1518441902117-ade2c1f7f3c9",
  },
  {
    id: 3,
    name: 'LED Monitor 24" FHD Business',
    category: "Monitors",
    price: 6200,
    oldPrice: 7800,
    minQty: 5,
    supplier: "ScreenPro Ltd.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
  },
  {
    id: 4,
    name: "Mechanical Keyboard RGB Bulk",
    category: "Keyboards & Mice",
    price: 890,
    oldPrice: 1100,
    minQty: 20,
    supplier: "KeyCraft India",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
];

const page = () => {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* 🔷 Header */}
      <div className="bg-orange-500 text-white px-6 py-8">
        <p className="text-sm opacity-80">Home &gt; New Arrivals</p>
        <h1 className="text-3xl font-bold mt-2">New Arrivals</h1>
        <p className="text-sm mt-1 opacity-90">
          Freshly added wholesale products — be the first to source them
        </p>
        <p className="text-xs mt-2 opacity-80">
          Showing {productsData.length} of {productsData.length} products
        </p>
      </div>

      {/* 🔷 Main Layout */}
      <div className="flex gap-6 px-6 py-6">

        {/* 🟡 Sidebar Filters */}
        <div className="w-72">
          <Card className="p-4 space-y-4">
            <h2 className="font-semibold">Filters</h2>

            {/* Category */}
            <div>
              <p className="text-sm mb-1">Category</p>
              <Select onValueChange={(val) => setCategory(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <p className="text-sm mb-1">Sort By</p>
              <Select onValueChange={(val) => setSort(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="priceLow">Price: Low to High</SelectItem>
                  <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <p className="text-sm mb-1">Price Range (₹/unit)</p>
              <div className="flex gap-2">
                <Input placeholder="Min" />
                <Input placeholder="Max" />
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Under ₹500</Button>
                <Button variant="outline" size="sm">₹500–2K</Button>
                <Button variant="outline" size="sm">₹2K+</Button>
              </div>
            </div>

            {/* MOQ */}
            <div>
              <p className="text-sm mb-1">Min. Order Qty</p>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="10">10+</SelectItem>
                  <SelectItem value="50">50+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" className="w-full">
              Clear All Filters
            </Button>
          </Card>
        </div>

        {/* 🟢 Products Grid */}
        <div className="flex-1">

          <p className="text-sm mb-4">
            Showing {productsData.length} of {productsData.length} products
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {productsData.map((product) => (
              <Card key={product.id} className="rounded-xl overflow-hidden">

                {/* Image */}
                <div className="relative h-40 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-4 space-y-2">

                  <h3 className="font-semibold text-sm line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {product.category}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 font-bold">
                      ₹{product.price}/unit
                    </span>
                    <span className="line-through text-gray-400 text-sm">
                      ₹{product.oldPrice}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Min. {product.minQty} units
                  </p>

                  <p className="text-xs text-green-600">
                    ● {product.supplier}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                      <ShoppingCart size={16} className="mr-1" />
                      Add
                    </Button>

                    <Button variant="outline" size="icon">
                      <Heart size={16} />
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default page;