"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { suppliers } from "@/data/suppliers";

const FeaturedSuppliers = () => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const loopSuppliers = [
    ...suppliers,
    ...suppliers,
    ...suppliers,
    ...suppliers,
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const singleWidth = container.scrollWidth / 4;
    container.scrollLeft = singleWidth;

    let animationFrame;

    const animate = () => {
      if (container) {
        if (!isPaused) {
          container.scrollLeft += 0.5; // speed control
        }
        if (container.scrollLeft >= singleWidth * 3) {
          container.scrollLeft = singleWidth;
        }

        if (container.scrollLeft <= 0) {
          container.scrollLeft = singleWidth * 2;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  if (!suppliers.length) return null;

  return (
    <div className="w-full dark:bg-gray-900">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl border-l-4 pl-2 font-semibold border-orange-500">
            Featured Suppliers
          </h2>

          <Link
            href="/suppliers/verified"
            className="text-sm text-orange-500 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="relative flex items-center w-full">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-6 sm:gap-10 md:gap-16 overflow-x-scroll no-scrollbar w-full"
          >
            {loopSuppliers.map((supplier, index) => (
              <Link
                key={`${supplier.id}-${index}`}
                href={`/suppliers/${supplier.id}`}
                className="flex flex-col items-center min-w-25 sm:min-w-35"
              >
                <div
                  className="flex items-center justify-center rounded-full font-bold
                  w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44
                  bg-orange-100 dark:text-gray-700 shadow-md"
                >
                  {supplier.name.slice(0, 2).toUpperCase()}
                </div>

                <p className="mt-2 text-xs sm:text-sm text-center dark:text-white">
                  {supplier.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSuppliers;