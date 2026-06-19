"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

const posters = [
  {
    image: "/home.png",
    href: "/products/home-appliances",
    alt: "Home Appliances",
  },
  {
    image: "/electronics.png",
    href: "/products/electronics",
    alt: "Electronics",
  },
  {
    image: "/beauty.png",
    href: "/products/beauty-and-personal-care",
    alt: "Beauty & Personal Care",
  },
  {
    image: "/fashion.png",
    href: "/products/fashion-wear",
    alt: "Fashion Wear",
  },
  {
    image: "/toys.png",
    href: "/products/kid-toys",
    alt: "Kid Toys",
  },
];

const Ads = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section className="w-full bg-white py-3">
      <div className="max-w-400 mx-auto px-4">
        <div
          className="overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="flex">
            {posters.map((poster, index) => (
              <div key={index} className="min-w-full md:min-w-[50%] pl-3">
                <Link href={poster.href} className="block">
                  <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <Image
                      src={poster.image}
                      alt={poster.alt}
                      width={1200}
                      height={500}
                      draggable={false}
                      priority={index === 0}
                      className="w-full h-30 sm:h-37.5 md:h-45 lg:h-50 object-cover select-none"
                    />

                    <div className="absolute bottom-2 right-2 bg-white/95 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                      AD
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ads;