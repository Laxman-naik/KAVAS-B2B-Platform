"use client";
import React from "react";
import { CheckCircle, Lock, Truck, Handshake, RefreshCcw } from "lucide-react";
import Link from "next/link";

const TrustedSlide = () => {
  const items = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verified Suppliers",
      desc: "Every vendor vetted",
      desc1: "Learn More",
      bg: "bg-[#D4AF37]/15",
      color: "bg-white",
      link: "/services/suppliers",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Payments",
      desc: "Escrow on all orders",
      desc1: "Learn More",
      bg: "bg-[#D4AF37]/15",
      color: "bg-white",
      link: "/services/securepayments",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Pan-India Delivery",
      desc: "Across 28 states",
      desc1: "Learn More",
      bg: "bg-[#D4AF37]/15",
      color: "bg-white",
      link: "/services/delivery",
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Dedicated Support",
      desc: "Account manager",
      desc1: "Learn More",
      bg: "bg-[#D4AF37]/15",
      color: "bg-white",
      link: "/services/support",
    },
    {
      icon: <RefreshCcw className="w-6 h-6" />,
      title: "Easy Returns",
      desc: "Hassle-free",
      desc1: "Learn More",
      bg: "bg-[#D4AF37]/15",
      color: "bg-white",
      link: "/services/returns",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[#D4AF37]/60"></span>

              <div className="text-[11px] font-extrabold tracking-widest text-[#0B1F3A]/60 uppercase">
               Your business, our priority
              </div>
              <span className="h-px w-5 bg-[#D4AF37]/60"></span>
            </div>

            <h2 className="mt-1 text-lg sm:text-3xl font-extrabold text-[#0B1F3A]">
              Our Services
            </h2>
          </div>
        {/* <div className="flex items-start gap-3">
          <div className="mt-1 h-8 w-1 rounded-full bg-[#D4AF37]" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F3A]">
              Our Services
            </h2>
            <p className="mt-1 text-sm text-[#0B1F3A]/70">
              Your business, our priority. Enjoy a seamless B2B buying experience.
            </p>
          </div>
        </div> */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border border-black/10 shadow-sm hover:shadow-md transition ${item.color}`}
            >
              <div className="p-4">
                <div className={`h-12 w-12 rounded-2xl grid place-items-center ${item.bg} text-[#0B1F3A]`}>
                  {item.icon}
                </div>

                <div className="mt-3 text-sm font-extrabold text-[#0B1F3A]">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-[#0B1F3A]/70">
                  {item.desc}
                </div>

                {/* <Link
                  href={item.link}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-[#0B1F3A] hover:text-[#D4AF37]"
                >
                  {item.desc1} →
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default TrustedSlide;
