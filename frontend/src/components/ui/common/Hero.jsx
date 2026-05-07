"use client";
import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  const slides = useMemo(
    () => [
      {
        id: "slide-1",
        image: "/herobanner.png",
        top: "Your Trusted Partner for",
        titleHighlight: "Quality Products",
        titleRest: "at Wholesale Prices",
        subtitle: "Bulk. Quality. Trust. Delivered.",
      },
      {
        id: "slide-2",
        image: "/herobanner.png",
        top: "Buy Direct from",
        titleHighlight: "Verified Sellers",
        titleRest: "Across India",
        subtitle: "Discover categories, compare suppliers, order with confidence.",
      },
      {
        id: "slide-3",
        image: "/herobanner.png",
        top: "Grow Your Business with",
        titleHighlight: "Best Wholesale",
        titleRest: "Deals Everyday",
        subtitle: "Fast delivery, secure payments, and unbeatable pricing.",
      },
    ],
    []
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="bg-white overflow-x-hidden">
      <div className="w-full">
        <div className="relative overflow-hidden bg-[#0B1F3A]">
          <div
            className="flex w-full transition-transform duration-700"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="relative w-full shrink-0">
                <img
                  src={slide.image}
                  alt="KAVAS Wholesale Hub"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/25" />

                <div className="relative z-10 max-w-350 mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-14">
                  <div className="max-w-2xl">
                    <div className="text-white/90 text-2xl font-bold">
                      {slide.top}
                    </div>
                    <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.12] text-white">
                      <span className="text-[#D4AF37]">
                        {slide.titleHighlight}
                        <br />
                        {slide.titleRest}
                      </span>
                    </h1>
                    <p className="mt-4 text-white/85 text-sm sm:text-base max-w-xl">
                      {slide.subtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link href="/allproducts">
                        <Button className="bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#caa734] p-5 font-semibold rounded-sm">
                          Shop Now
                        </Button>
                      </Link>
                     <Link href="/vendor" target="_blank" rel="noopener noreferrer">
  <Button
    variant="outline"
    className="border-[#D4AF37]/55 bg-[#0B1F3A]/50 p-5 text-white hover:bg-[#0B1F3A]/70 hover:border-[#D4AF37]/70 font-semibold rounded-sm hover:text-[#D4AF37]"
  >
    Become a Seller
  </Button>
</Link>
                    </div>

                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-white/85">
                      <div className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                        100% Secure Payments
                      </div>
                      <span className="hidden sm:inline-block h-4 w-px bg-white/20" />
                      <div className="inline-flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#D4AF37]" />
                        Pan India Delivery
                      </div>
                      <span className="hidden sm:inline-block h-4 w-px bg-white/20" />
                      <div className="inline-flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-[#D4AF37]" />
                        Best Prices Guaranteed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm border border-white/15 bg-black/25 p-2 text-white hover:bg-black/35"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm border border-white/15 bg-black/25 p-2 text-white hover:bg-black/35"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
