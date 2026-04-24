"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { suppliers } from "@/data/suppliers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headset,
  Monitor,
  Shirt,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Wrench,
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

  const palette = useMemo(
    () => [
      { chip: "bg-amber-100 text-amber-700", ring: "bg-amber-50" },
      { chip: "bg-emerald-100 text-emerald-700", ring: "bg-emerald-50" },
      { chip: "bg-blue-100 text-blue-700", ring: "bg-blue-50" },
      { chip: "bg-rose-100 text-rose-700", ring: "bg-rose-50" },
    ],
    []
  );

  const getCategoryMeta = (category) => {
    const c = (category || "").toLowerCase();
    if (c.includes("elect")) return { label: "Electronics", Icon: Monitor };
    if (c.includes("health") || c.includes("beaut"))
      return { label: "Health & Beauty", Icon: Sparkles };
    if (c.includes("apparel") || c.includes("text"))
      return { label: "Textiles", Icon: Shirt };
    if (c.includes("hard")) return { label: "Hardware & Tools", Icon: Wrench };
    return { label: category || "Supplies", Icon: Tag };
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const segmentWidth = container.scrollWidth / 4;
    segmentWidthRef.current = segmentWidth;
    container.scrollLeft = segmentWidth;

    let animationFrame;
    const animate = () => {
      if (container && !isPaused) {
        container.scrollLeft += 0.35;

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
    <section className="w-full  py-8">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
                Our Partners
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                Featured Suppliers
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                Partnering with trusted brands to deliver quality you can rely on.
              </p>
            </div>

            <Link href="/suppliers/verified">
              <Button
                variant="outline"
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#FFF8EC]"
              >
                View all suppliers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative mt-6">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByPage(-1)}
              className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#0B1F3A] text-white items-center justify-center shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByPage(1)}
              className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-[#0B1F3A] text-white items-center justify-center shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={containerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
            >
              {loopSuppliers.map((supplier, index) => {
                const colors = palette[index % palette.length];
                const { label, Icon } = getCategoryMeta(supplier.category);
                const initials = (supplier.name || "S").slice(0, 2).toUpperCase();
                const isVerified = (supplier.tags || []).some((t) =>
                  String(t).toLowerCase().includes("verified")
                );

                return (
                  <Link
                    key={`${supplier.id}-${index}`}
                    href={`/suppliers/${supplier.id}`}
                    className="shrink-0 w-[78%] sm:w-[46%] md:w-[31%] lg:w-[23%]"
                  >
                    <Card className="h-full min-h-[360px] border-[#E5E5E5] hover:shadow-md transition-shadow rounded-2xl">
                      <CardContent className="p-6 h-full">
                        <div className="h-full flex flex-col items-center text-center">
                          <div className="flex items-center justify-center">
                            <div
                              className={`h-24 w-24 rounded-full ${colors.ring} flex items-center justify-center border border-[#E5E5E5]`}
                            >
                              <div className="h-16 w-16 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center font-extrabold text-[#0B1F3A] text-xl">
                                {initials}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 text-[16px] font-bold text-[#0B1F3A] leading-6 line-clamp-2">
                            {supplier.name}
                          </div>

                          <div className="mt-3 h-[2px] w-10 rounded-full bg-[#D4AF37]" />

                          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{label}</span>
                          </div>

                          <div className="mt-auto pt-6 w-full flex justify-center">
                            {isVerified ? (
                              <Badge className={`${colors.chip} border-0 px-4 py-2 rounded-xl font-semibold flex items-center gap-2`}>
                                <ShieldCheck className="h-5 w-5" />
                                Verified Supplier
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="px-4 py-2 rounded-xl font-semibold">
                                Supplier
                              </Badge>
                            )}
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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-lg border border-[#E5E5E5] bg-[#FFF8EC]/40 p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0B1F3A]">Trusted Partners</div>
                <div className="text-xs text-gray-600">Working with verified suppliers.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0B1F3A]">Best Quality</div>
                <div className="text-xs text-gray-600">Premium standards & checks.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0B1F3A]">Timely Delivery</div>
                <div className="text-xs text-gray-600">On-time shipping & tracking.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Headset className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0B1F3A]">Dedicated Support</div>
                <div className="text-xs text-gray-600">24/7 support for your needs.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;