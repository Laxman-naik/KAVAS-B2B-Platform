"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const deals = [
  {
    name: "Smart Fitness Band",
    price: "₹1200",
    oldPrice: "₹2500",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=600",
  },
  {
    name: "Running Shoes",
    price: "₹1500",
    oldPrice: "₹3500",
    category: "Sports & Entertainment",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
  },
  {
    name: "Bluetooth Speaker",
    price: "₹800",
    oldPrice: "₹2000",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600",
  },
  {
    name: "LED Desk Lamp",
    price: "₹600",
    oldPrice: "₹1500",
    category: "Office Supplies",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600",
  },
  {
    name: "Backpack",
    price: "₹900",
    oldPrice: "₹2200",
    category: "Fashion Wear",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600",
  },
  {
    name: "Yoga Mat",
    price: "₹400",
    oldPrice: "₹1000",
    category: "Sports & Entertainment",
    image:
      "https://images.unsplash.com/photo-1593810450967-f9c42742e326?q=80&w=600",
  },
];

const FlashDeals = () => {
  const initialSeconds = 2 * 24 * 60 * 60 + 14 * 60 * 60 + 36 * 60 + 48;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const sliderRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? initialSeconds : s - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [initialSeconds]);

  const days = Math.floor(secondsLeft / (24 * 60 * 60));
  const hours = Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
  const seconds = secondsLeft % 60;

  const pad2 = (n) => String(n).padStart(2, "0");

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-2">
      <div className="w-full px-4">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#07162B] via-[#0B1F3A] to-[#102C54] px-4 py-4 shadow-xl md:px-7 md:py-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Zap className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                  Limited Time
                </span>
              </div>

              <h2 className="text-xl font-extrabold leading-tight text-white md:text-2xl">
                Flash Deals
              </h2>

              <p className="mt-1 text-sm text-white/90">
                Up to{" "}
                <span className="text-lg font-extrabold text-[#D4AF37]">
                  70% OFF
                </span>{" "}
                on bulk orders across categories
              </p>
            </div>

            <div className="flex gap-2">
              {[pad2(days), pad2(hours), pad2(minutes), pad2(seconds)].map(
                (time, index) => (
                  <div
                    key={index}
                    className="flex h-11 w-11 flex-col items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white backdrop-blur md:h-12 md:w-12"
                  >
                    <span className="text-sm font-extrabold">{time}</span>
                    <span className="text-[8px] font-medium uppercase text-white/70">
                      {["Days", "Hrs", "Min", "Sec"][index]}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-3 top-[58%] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0B1F3A] shadow-lg transition hover:bg-[#D4AF37] hover:text-white"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-3 top-[58%] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0B1F3A] shadow-lg transition hover:bg-[#D4AF37] hover:text-white"
          >
            <ChevronRight size={22} />
          </button>

          <div
            ref={sliderRef}
            className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1"
          >
            {deals.map((item, index) => (
              <Link
                href="/flashdeals"
                key={index}
                className="flex h-71.25 min-w-55 max-w-55 flex-col overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FFF8EC] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-58.75 sm:max-w-58.75"
              >
                <div className="relative h-33.75 overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-md bg-[#D4AF37] px-2.5 py-1 text-[11px] font-extrabold text-[#0B1F3A]">
                    70% OFF
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="line-clamp-2 min-h-9.5 text-sm font-extrabold text-[#1A1A1A]">
                    {item.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#0B1F3A]">
                      {item.price}
                    </span>

                    <span className="text-xs text-gray-400 line-through">
                      {item.oldPrice}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-500">
                    {item.category}
                  </p>

                  <div className="mt-auto pt-2">
                    <button className="w-full rounded-lg bg-[#D4AF37] py-2 text-xs font-bold text-[#0B1F3A] transition hover:bg-[#c79d24]">
                      View Deal
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 flex justify-center">
            <Link
              href="/flashdeals"
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-extrabold text-[#0B1F3A] shadow-md transition hover:bg-[#c79d24]"
            >
              Shop All Deals →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;