"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

const VendorReviews = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Who can become a seller on Kavas?",
      answer:
        "Any registered business with a valid GSTIN can join Kavas. We welcome manufacturers, wholesalers, distributors, and importers across all product categories.",
    },
    {
      question: "How much does it cost to sell?",
      answer:
        "Listing products on Kavas is completely free. We charge a small commission only when you successfully make a sale. No hidden charges whatsoever.",
    },
    {
      question: "How do I receive payments?",
      answer:
        "Payments are settled directly to your registered bank account every 7 days. All transactions are secured through our escrow system — buyers pay when they order, you get paid after delivery.",
    },
    {
      question: "Can I set my own MOQ and prices?",
      answer:
        "Absolutely! You have full control over your Minimum Order Quantity (MOQ), wholesale pricing, and product specifications. We simply provide the platform for you to connect with buyers.",
    },
    {
      question: "How long does verification take?",
      answer:
        "Standard verification takes 24-48 hours. We verify your GSTIN, bank details, and business registration documents. Premium verification with faster onboarding is available on request.",
    },
  ];

  

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="bg-[#FFF8EC] pt-14">
      <div className="mx-auto max-w-245 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B1F3A]">
            Frequently Asked{" "}
            <span className="text-[#D4AF37]">Questions</span>
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`rounded-sm border bg-white shadow-sm transition-all duration-300 ${
                  isOpen
                    ? "border-[#D4AF37]/40 shadow-md"
                    : "border-[#E5E5E5] hover:border-[#D4AF37]/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A]">
                    {item.question}
                  </h3>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF8EC]">
                    {isOpen ? (
                      <Minus size={16} className="text-[#D4AF37]" />
                    ) : (
                      <Plus size={16} className="text-[#D4AF37]" />
                    )}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-14 w-full bg-[#0B1F3A]">
        <div className="mx-auto max-w-400 px-6 py-16 sm:px-10 lg:px-16">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Join Kavas Today
              </span>
            </div>

            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Ready to Grow Your
              <span className="block text-[#D4AF37]">
                Wholesale Business?
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-white/80">
              Join thousands of verified sellers already growing on Kavas. Zero
              listing fees, unlimited product listings, secure payments, and
              access to buyers across India.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/vendor/vendorregister"
                className="inline-flex items-center justify-center rounded-sm bg-[#D4AF37] px-7 py-3 text-base font-bold text-[#0B1F3A] transition hover:opacity-90"
              >
                Start Selling Now
              </Link>

              <Link
                href="/vendor/vendorlogin"
                className="inline-flex items-center justify-center rounded-sm border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Login to Seller Hub
              </Link>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorReviews;