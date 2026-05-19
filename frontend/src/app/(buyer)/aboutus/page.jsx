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
  const colors = {
    primary: "#0B1F3A",
    gold: "#D4AF37",
    cream: "#FFF8EC",
    white: "#FFFFFF",
    text: "#1A1A1A",
    border: "#E5E5E5",
  };

  return (
    <main className="w-full overflow-hidden bg-[#FFFFFF] text-[#1A1A1A]">
      <section className="w-full bg-[#FFF8EC] py-8">
        <div className="grid w-full grid-cols-1 items-center gap-6 px-5 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              About Us
            </p>

            <h1 className="max-w-xl font-serif text-3xl font-bold leading-tight text-[#0B1F3A] md:text-5xl">
              Built to Empower Your Business
            </h1>

            <div className="my-4 h-[2px] w-12 bg-[#D4AF37]" />

            <p className="max-w-xl text-sm leading-7 text-[#1A1A1A]/75">
              At KAVS, we provide trusted wholesale solutions with premium
              quality products, competitive pricing, and reliable service for
              growing businesses.
            </p>

            <button className="mt-5 flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-5 py-2.5 text-sm font-medium text-[#FFFFFF] transition hover:bg-[#08172b]">
              Our Story
              <ArrowRight size={16} className="text-[#D4AF37]" />
            </button>
          </div>

          <div className="flex justify-center">
            <img
              src="/aboutimage.png"
              alt="About"
              className="max-h-[320px] w-full max-w-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FFFFFF] py-6">
        <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 lg:px-12">
          {[
            { icon: Users, value: "10K+", title: "Partners" },
            { icon: Package, value: "5K+", title: "Products" },
            { icon: Award, value: "98%", title: "Delivery" },
            { icon: Headphones, value: "24/7", title: "Support" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-sm border border-[#E5E5E5] bg-[#0B1F3A] p-4 text-center text-[#FFFFFF] shadow-sm"
              >
                <Icon size={26} className="mx-auto mb-2 text-[#D4AF37]" />

                <h2 className="font-serif text-2xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-[#FFFFFF]/80">{item.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full px-5 py-10 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_0.7fr]">
          <div>
            <img
              src="/ourstoryimage.png"
              alt="Story"
              className="h-[280px] w-full rounded-sm border border-[#E5E5E5] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Our Story
            </p>

            <h2 className="font-serif text-3xl font-bold leading-snug text-[#0B1F3A]">
              From Vision to Trusted Wholesale Partner
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/75">
              KAVS was founded to simplify wholesale sourcing with reliable
              products, smooth delivery, and customer-focused service.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/75">
              Today, businesses trust us for dependable partnerships and
              high-quality wholesale solutions.
            </p>
            <div className="mt-5">
              <p className="font-serif text-2xl italic text-[#0B1F3A]">
                KAVS Team
              </p>
              <p className="mt-1 text-xs font-semibold tracking-wide text-[#D4AF37]">
                KAVS WHOLESALE
              </p>
            </div>
          </div>
          <div className="rounded-sm border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-sm">
            {[
              { icon: BadgeCheck, title: "Quality Assurance" },
              { icon: ShieldCheck, title: "Competitive Pricing" },
              { icon: Box, title: "Reliable Supply" },
              { icon: HeartHandshake, title: "Customer First" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="mb-5 flex items-center gap-3 last:mb-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#FFF8EC]">
                    <Icon size={22} className="text-[#D4AF37]" />
                  </div>

                  <h3 className="text-sm font-medium text-[#0B1F3A]">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full bg-[#FFF8EC] py-10">
        <div className="px-5 lg:px-12">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#E5E5E5]" />

            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Mission • Vision • Values
            </p>

            <div className="h-px w-16 bg-[#E5E5E5]" />
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
                  className="rounded-sm border border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#0B1F3A]">
                    <Icon size={28} className="text-[#D4AF37]" />
                  </div>

                  <h3 className="mt-3 font-serif text-2xl font-bold text-[#0B1F3A]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#1A1A1A]/75">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full bg-[#0B1F3A] py-8 text-[#FFFFFF]">
        <div className="grid grid-cols-1 gap-6 px-5 lg:grid-cols-[1fr_2fr] lg:px-12">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Let’s Grow Together
            </p>

            <h2 className="font-serif text-3xl font-bold leading-snug">
              Partner with KAVS and Grow Your Business
            </h2>

            <button className="mt-5 flex items-center gap-2 rounded-sm bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#c7a22d]">
              Explore Products
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Box, title: "Wide Product Range" },
              { icon: BadgeCheck, title: "Trusted by Businesses" },
              { icon: ShieldCheck, title: "Secure & Reliable" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-sm border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 p-4"
                >
                  <Icon size={24} className="text-[#D4AF37]" />

                  <h4 className="mt-3 text-sm font-medium text-[#FFFFFF]">
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