"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { suppliers } from "@/data/suppliers";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
} from "lucide-react";

const FeaturedSuppliers = () => {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const segmentWidthRef = useRef(0);

  const loopSuppliers = useMemo(
    () => [...suppliers, ...suppliers, ...suppliers, ...suppliers],
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    const segmentWidth = container.scrollWidth / 4;
    segmentWidthRef.current = segmentWidth;
    container.scrollLeft = segmentWidth;

    let animationFrame;
    const animate = () => {
      if (container && !isPaused) {
        container.scrollLeft += 0.55;

        const seg = segmentWidthRef.current || container.scrollWidth / 4;
        if (container.scrollLeft >= seg * 3) {
          container.scrollLeft = seg;
        }

        if (container.scrollLeft <= 0) {
          container.scrollLeft = seg * 2;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const seg = segmentWidthRef.current || container.scrollWidth / 4;
      const relative = ((container.scrollLeft - seg) % seg + seg) % seg;
      const page = Math.round(relative / Math.max(1, container.clientWidth));
      setActivePage(page);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const width = Math.max(1, container.clientWidth);
      const seg = segmentWidthRef.current || container.scrollWidth / 4;
      const count = Math.max(1, Math.ceil(seg / width));
      setPageCount(count);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!suppliers.length) return null;

  const scrollByPage = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="w-full py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm border border-[#E5E5E5] shadow-sm px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
                Featured
              </div>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Suppliers
              </h2>
            </div>
            <Link
              href="/suppliers/verified"
              className="text-sm font-medium text-[#0B1F3A] hover:underline inline-flex items-center gap-2"
            >
              View All
              <ExternalLink size={16} />
            </Link>
          </div>

          <div className="relative mt-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByPage(-1)}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#FFF8EC] border border-[#E5E5E5] text-[#0B1F3A] items-center justify-center shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByPage(1)}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#FFF8EC] border border-[#E5E5E5] text-[#0B1F3A] items-center justify-center shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={containerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
            >
              {loopSuppliers.map((supplier, index) => {
                const cover = supplier?.images?.[0] || "/placeholder.png";
                const logo = supplier?.images?.[1] || cover;
                const rating = supplier?.stats?.rating ?? 5.0;
                const items = supplier?.stats?.products || "0";
                const status = supplier?.status || "Offline";

                return (
                  <Link
                    key={`${supplier.id}-${index}`}
                    href={`/suppliers/${supplier.id}`}
                    className="shrink-0 w-[78%] sm:w-[56%] md:w-[38%] lg:w-[24%]"
                  >
                    <Card className="border-[#E5E5E5] hover:shadow-md transition-shadow rounded-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-28 bg-gray-100">
                          <img
                            src={cover}
                            alt={supplier.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0" />
                          <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-gray-700 border border-[#E5E5E5]">
                            {status}
                          </span>

                          <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-full bg-white border border-[#E5E5E5] overflow-hidden shadow-sm">
                            <img
                              src={logo}
                              alt={supplier.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div className="bg-[#0B1F3A] text-white pt-8 pb-4 px-4 min-h-29.5 flex flex-col">
                          <div className="text-sm font-semibold truncate">
                            {supplier.name}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs text-white/85">
                            <span className="text-[#FFF8EC]/90">{items} + Items</span>
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                              {Number(rating).toFixed(1)}
                            </span>
                          </div>

                          <div className="mt-auto pt-3 text-xs font-semibold text-[#D4AF37]">
                            Visit Store →
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to page ${i + 1}`}
                  onClick={() => {
                    const el = containerRef.current;
                    if (!el) return;
                    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
                  }}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === activePage ? "bg-[#D4AF37]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;