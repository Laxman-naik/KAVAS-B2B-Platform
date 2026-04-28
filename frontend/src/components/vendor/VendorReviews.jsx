"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

const VendorReviews = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = useMemo(
    () => [
      {
        name: "Priya Sharma",
        role: "Textile Seller, Surat",
        quote:
          "Kavas transformed my wholesale business. I went from managing orders on WhatsApp to a fully automated system. My revenue doubled in 6 months!",
        rating: 5,
      },
      {
        name: "Rajesh Kumar",
        role: "Handicraft Exporter, Jaipur",
        quote:
          "The GST invoicing feature alone saved me 10 hours a week. The analytics dashboard helps me understand which products are trending. Highly recommended!",
        rating: 5,
      },
      {
        name: "Meena Patel",
        role: "Organic Foods Distributor, Ahmedabad",
        quote:
          "Fast payouts and excellent support. My account manager helped me set up everything in a day. The platform is very easy to use even for non-tech people.",
        rating: 5,
      },
      {
        name: "Ankit Verma",
        role: "Electronics Wholesaler, Delhi",
        quote:
          "Better buyer quality and fewer cancellations. The order flow is clean and professional.",
        rating: 4,
      },
    ],
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % reviews.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused, reviews.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cards = el.querySelectorAll("[data-review-card='true']");
    const card = cards?.[activeIndex];
    if (!(card instanceof HTMLElement)) return;

    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, [activeIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = el.querySelectorAll("[data-review-card='true']");
      const left = el.scrollLeft;
      let nearest = 0;
      let best = Infinity;
      cards.forEach((node, idx) => {
        if (!(node instanceof HTMLElement)) return;
        const d = Math.abs(node.offsetLeft - left);
        if (d < best) {
          best = d;
          nearest = idx;
        }
      });
      setActiveIndex(nearest);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="reviews" className="bg-[#FFF8EC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-wide text-[#D4AF37] uppercase">
            Vendor Reviews
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            What Sellers Say
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Real stories from real sellers across India
          </p>
          <div className="mt-4 mx-auto h-[3px] w-10 rounded-full bg-[#D4AF37]" />
        </div>

        <div className="mt-10">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {reviews.map((r) => {
              const initials = r.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((x) => x[0]?.toUpperCase())
                .join("");

              return (
                <div
                  key={r.name}
                  data-review-card="true"
                  className="shrink-0 w-[90%] sm:w-[70%] lg:w-[32%] rounded-sm border border-[#E5E5E5] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                >
                  <div className="inline-flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < r.rating
                            ? "text-[#D4AF37] fill-[#D4AF37]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-700 leading-relaxed">“{r.quote}”</div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <div className="min-h-[36px]">
                      <div className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap overflow-hidden text-ellipsis">
                        {r.name}
                      </div>
                      <div className="text-xs font-medium text-gray-500 leading-4">
                        {r.role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === activeIndex ? "bg-[#D4AF37]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-sm border border-[#E5E5E5] bg-white p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-sm bg-[#0B1F3A] flex items-center justify-center">
                <BadgeCheck size={18} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0B1F3A]">
                  Join thousands of successful sellers on Kavas
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Start your journey today and take your business to the next level.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/vendor/vendorlogin"
                className="inline-flex items-center justify-center rounded-sm bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Login Now
              </Link>
              <Link
                href="/vendor/vendorregister"
                className="inline-flex items-center justify-center rounded-sm border border-[#0B1F3A]/25 bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorReviews;
