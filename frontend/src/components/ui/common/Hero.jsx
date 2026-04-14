"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {

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

  const [current, setCurrent] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  }, 5000);

  return () => clearInterval(interval); // cleanup
}, [slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-4 pb-2 sm:py-6 space-y-4 sm:space-y-6">
        <div className="relative z-10 w-full overflow-hidden h-70 sm:h-100 md:h-125 lg:h-137.5 rounded-xl">
          
          <div
            className="flex transition-transform duration-500 h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full h-full">
                <div className="relative h-full flex overflow-hidden">

                  <img
                    src={slideImages[index]}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="slide"
                  />

                  <div className="absolute inset-0 bg-black/50"></div>

                  <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-16 text-white max-w-3xl">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                      {slide.title} <br />
                      <span className="text-blue-300">{slide.highlight}</span>
                    </h1>

                    <p className="mt-2 sm:mt-3 text-gray-200 text-sm sm:text-base">
                      {slide.desc}
                    </p>

                    <Button className="mt-4 sm:mt-5 bg-white text-orange-500 w-fit text-sm sm:text-base">
                      🚀 Start sourcing free
                    </Button>
                  </div>

                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl relative overflow-hidden hover:scale-[1.01] h-45 sm:h-55 md:h-45">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/sale.mp4" />
            </video>

            <div className="relative z-10 p-4 sm:p-6 text-white">
              <Link href="/vendor">
                <Button className="mt-16 sm:mt-20 bg-white text-red-500 text-sm sm:text-base cursor-pointer">
                  Flashdeals
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-xl relative overflow-hidden hover:scale-[1.01] h-45 sm:h-55 md:h-45">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/apple.mp4" />
            </video>

            <div className="relative z-10 p-4 sm:p-6 text-white">
              <Link href="/vendor">
                <Button className="mt-16 sm:mt-20 bg-white text-red-500 text-sm sm:text-base cursor-pointer">
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