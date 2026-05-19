"use client";

import React from "react";
import {
  ArrowRight,
  Users,
  Package,
  Award,
  Headphones,
  BadgeCheck,
  ShieldCheck,
  Box,
  HeartHandshake,
  Target,
  Eye,
  Handshake,
} from "lucide-react";

const AboutUsPage = () => {
  return (
    <main className="w-full overflow-hidden bg-[#f8f5ef] text-[#071831]">
      {/* HERO */}
      <section className="w-full bg-[#f6f1e8] py-8">
        <div className="grid w-full grid-cols-1 items-center gap-6 px-5 lg:grid-cols-2 lg:px-12">
          {/* LEFT */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#c79b2c]">
              About Us
            </p>

            <h1 className="max-w-xl font-serif text-3xl font-bold leading-tight md:text-5xl">
              Built to Empower Your Business
            </h1>

            <div className="my-4 h-[2px] w-12 bg-[#c79b2c]" />

            <p className="max-w-xl text-sm leading-7 text-[#5d6675]">
              At KAVS, we provide trusted wholesale solutions with premium
              quality products, competitive pricing, and reliable service for
              growing businesses.
            </p>

            <button className="mt-5 flex items-center gap-2 rounded-sm bg-[#071831] px-5 py-2.5 text-sm font-medium text-white">
              Our Story
              <ArrowRight size={16} className="text-[#c79b2c]" />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <img
              src="/aboutimage.png"
              alt="About"
              className="max-h-[320px] w-full max-w-xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full  py-6 text-white">
        <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 lg:px-12">
          {[
            {
              icon: Users,
              value: "10K+",
              title: "Partners",
            },
            {
              icon: Package,
              value: "5K+",
              title: "Products",
            },
            {
              icon: Award,
              value: "98%",
              title: "Delivery",
            },
            {
              icon: Headphones,
              value: "24/7",
              title: "Support",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-sm border border-white/10 bg-[#0a2342] p-4 text-center"
              >
                <Icon
                  size={26}
                  className="mx-auto mb-2 text-[#c79b2c]"
                />

                <h2 className="font-serif text-2xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-white/80">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* STORY */}
      <section className="w-full px-5 py-10 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_0.7fr]">
          {/* IMAGE */}
          <div>
            <img
              src="/ourstoryimage.png"
              alt="Story"
              className="h-[280px] w-full rounded-sm object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#c79b2c]">
              Our Story
            </p>

            <h2 className="font-serif text-3xl font-bold leading-snug">
              From Vision to Trusted Wholesale Partner
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#5d6675]">
              KAVS was founded to simplify wholesale sourcing with reliable
              products, smooth delivery, and customer-focused service.
            </p>

            <p className="mt-3 text-sm leading-7 text-[#5d6675]">
              Today, businesses trust us for dependable partnerships and
              high-quality wholesale solutions.
            </p>

            <div className="mt-5">
              <p className="font-serif text-2xl italic">
                KAVS Team
              </p>

              <p className="mt-1 text-xs font-semibold tracking-wide">
                KAVS WHOLESALE
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="rounded-sm border border-[#e5d8bf] bg-white p-5">
            {[
              {
                icon: BadgeCheck,
                title: "Quality Assurance",
              },
              {
                icon: ShieldCheck,
                title: "Competitive Pricing",
              },
              {
                icon: Box,
                title: "Reliable Supply",
              },
              {
                icon: HeartHandshake,
                title: "Customer First",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="mb-5 flex items-center gap-3 last:mb-0"
                >
                  <Icon
                    size={22}
                    className="text-[#c79b2c]"
                  />

                  <h3 className="text-sm font-medium text-[#071831]">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="w-full bg-[#f2ece1] py-10">
        <div className="px-5 lg:px-12">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#d7c7a8]" />

            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#c79b2c]">
              Mission • Vision • Values
            </p>

            <div className="h-px w-16 bg-[#d7c7a8]" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Mission",
                text: "Empowering businesses with quality wholesale solutions.",
              },
              {
                icon: Eye,
                title: "Vision",
                text: "To become the most trusted wholesale platform worldwide.",
              },
              {
                icon: Handshake,
                title: "Values",
                text: "Integrity, reliability, and customer satisfaction.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-sm border border-[#e4d7be] bg-white p-5"
                >
                  <Icon
                    size={30}
                    className="text-[#c79b2c]"
                  />

                  <h3 className="mt-3 font-serif text-2xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#5d6675]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#041a34] py-8 text-white">
        <div className="grid grid-cols-1 gap-6 px-5 lg:grid-cols-[1fr_2fr] lg:px-12">
          {/* LEFT */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#c79b2c]">
              Let’s Grow Together
            </p>

            <h2 className="font-serif text-3xl font-bold leading-snug">
              Partner with KAVS and Grow Your Business
            </h2>

            <button className="mt-5 flex items-center gap-2 rounded-sm bg-[#c79b2c] px-5 py-2.5 text-sm font-semibold text-[#071831]">
              Explore Products
              <ArrowRight size={16} />
            </button>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: Box,
                title: "Wide Product Range",
              },
              {
                icon: BadgeCheck,
                title: "Trusted by Businesses",
              },
              {
                icon: ShieldCheck,
                title: "Secure & Reliable",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-sm border border-white/10 bg-[#0a2342] p-4"
                >
                  <Icon
                    size={24}
                    className="text-[#c79b2c]"
                  />

                  <h4 className="mt-3 text-sm font-medium">
                    {item.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;