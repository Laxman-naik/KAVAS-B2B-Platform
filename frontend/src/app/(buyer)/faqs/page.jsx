"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, HelpCircle, PhoneCall, Mail, MessageCircle } from "lucide-react"
import { helpData } from "@/data/helpData"

const page = () => {

  const [activeSection, setActiveSection] = useState(0)
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) =>
    setOpenIndex(prev => (prev === index ? null : index))

  const handleSectionChange = (index) => {
    setActiveSection(index)
    setOpenIndex(null)
  }

  const currentSection = helpData[activeSection]
  const Icon = currentSection.icon

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-[#0B1F3A]">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="text-white">
              <p className="text-xs text-white/70 mb-2">
                <span className="hover:text-[#D4AF37] cursor-pointer">Home</span>
                <span className="mx-1">››</span>
                <span className="text-white font-semibold">FAQs</span>
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Frequently Asked <span className="text-[#D4AF37]">Questions</span>
              </h1>

              <p className="mt-2 text-sm sm:text-base text-[#D4AF37] font-bold">
                Quick Answers. Better Experience.
              </p>

              <p className="mt-3 max-w-xl text-sm text-white/80">
                Find clear answers to the most common questions about KAVAS Wholesale Hub.
                Can’t find what you’re looking for? Our support team is here to help.
              </p>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-md">
                <div className="flex items-center justify-end">
                  <svg
                    width="320"
                    height="150"
                    viewBox="0 0 320 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                  >
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#D4AF37" stopOpacity="0.9" />
                        <stop offset="1" stopColor="#D4AF37" stopOpacity="0.35" />
                      </linearGradient>
                      <filter id="shadow" x="-20" y="-20" width="360" height="210" filterUnits="userSpaceOnUse">
                        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
                      </filter>
                    </defs>

                    <g filter="url(#shadow)">
                      <path
                        d="M40 40C40 26.7452 50.7452 16 64 16H184C197.255 16 208 26.7452 208 40V96C208 109.255 197.255 120 184 120H110L82 138V120H64C50.7452 120 40 109.255 40 96V40Z"
                        fill="#0B1F3A"
                        stroke="url(#g1)"
                        strokeWidth="2"
                      />
                      <text x="78" y="70" fill="#D4AF37" fontSize="34" fontWeight="800" fontFamily="Arial, sans-serif">
                        FAQ
                      </text>
                    </g>

                    <g filter="url(#shadow)">
                      <rect x="210" y="22" width="86" height="110" rx="14" fill="#FFF" />
                      <rect x="220" y="40" width="66" height="10" rx="5" fill="#E5E5E5" />
                      <rect x="220" y="60" width="56" height="10" rx="5" fill="#E5E5E5" />
                      <rect x="220" y="80" width="62" height="10" rx="5" fill="#E5E5E5" />
                      <circle cx="225" cy="45" r="4" fill="#16A34A" />
                      <circle cx="225" cy="65" r="4" fill="#16A34A" />
                      <circle cx="225" cy="85" r="4" fill="#16A34A" />
                      <rect x="238" y="28" width="30" height="10" rx="5" fill="#D4AF37" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">

          <div className="space-y-4">
            {helpData.map((section, sectionIndex) => {
              const SectionIcon = section.icon
              const isActive = activeSection === sectionIndex

              return (
                <Card key={sectionIndex} className="overflow-hidden border border-[#E5E5E5] shadow-sm rounded-sm">
                  <div
                    className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-3 cursor-pointer transition ${isActive ? "bg-[#0B1F3A]" : "bg-[#0B1F3A]"
                      }`}
                    onClick={() => handleSectionChange(sectionIndex)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-sm bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center text-xs font-black">
                        {String(sectionIndex + 1).padStart(2, "0")}
                      </div>
                      <div className="flex items-center gap-2">
                        <SectionIcon className="h-4 w-4 text-[#D4AF37]" />
                        <p className="text-white font-semibold text-sm sm:text-base">
                          {section.title}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isActive ? "rotate-180 text-[#D4AF37]" : "text-white/70"
                        }`}
                    />
                  </div>

                  {isActive && (
                    <CardContent className="p-0 bg-white">
                      <div className="divide-y divide-[#E5E5E5]">
                        {section.faqs.map((faq, index) => {
                          const isOpen = openIndex === index
                          return (
                            <div key={index} className="px-4 sm:px-5 py-3">
                              <button
                                type="button"
                                className="w-full flex items-start justify-between gap-4 text-left"
                                onClick={() => toggleFAQ(index)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 h-7 w-7 rounded-sm bg-[#FFF8EC] border border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#0B1F3A]">
                                    Q
                                  </div>
                                  <p className="font-semibold text-sm text-[#1A1A1A]">
                                    {faq.question}
                                  </p>
                                </div>

                                <ChevronDown
                                  className={`mt-1 h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#D4AF37]" : "text-gray-400"
                                    }`}
                                />
                              </button>

                              {isOpen && (
                                <p className="mt-2 pl-10 text-xs sm:text-sm text-gray-600">
                                  {faq.answer}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>

          <div className="lg:sticky lg:top-24">
  <Card className="rounded-sm border border-[#E5E5E5] shadow-sm overflow-hidden">
    
    <div className="bg-[#FFF1D6] px-5 py-6">

      <div className="h-12 w-12 rounded-sm bg-white border border-[#E5E5E5] flex items-center justify-center">
        <HelpCircle className="h-6 w-6 text-[#0B1F3A]" />
      </div>

      <h3 className="mt-4 text-lg font-extrabold text-[#1A1A1A]">
        Still Have <span className="text-[#D4AF37]">Questions?</span>
      </h3>

      <p className="mt-1 text-sm text-gray-600 font-semibold">
        We’re here to help!
      </p>

      {/* CONTACT BOX */}
      <div className="mt-4 bg-[#0B1F3A] rounded-sm">

        <div className="flex items-center gap-3 px-4 py-3">
          <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <p className="text-xs text-gray-400">Call Us</p>
            <p className="text-sm font-semibold text-white">
              +91 0000000000
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Mail className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-semibold text-white">
              info@kavaswholesalehub.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <p className="text-xs text-gray-400">Live Chat</p>
            <p className="text-sm font-semibold text-white">
              During Business Hours
            </p>
          </div>
        </div>

        {/* BUTTON AT BOTTOM */}
        <div className="px-4 pb-4 ">
          <Button className="w-full bg-[#D4AF37] text-[#0B1F3A] hover:opacity-90 font-bold rounded-sm">
            Contact Support
          </Button>
        </div>

      </div>

    </div>
  </Card>
</div>
        </div>
      </div>

    </div>
  )
}

export default page