"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, HelpCircle } from "lucide-react"
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
    <div className="min-h-screen bg-[#FFF8EC]">

      {/* HEADER */}
      <div className="bg-[#0B1F3A] py-4 sm:py-6 md:py-8 text-center text-white px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]" />
          How can we help you?
        </h1>

        <div className="flex justify-center max-w-xl mx-auto w-full">

          <Input
            placeholder="Search... e.g. how to place bulk order"
            className="bg-white text-black py-4 sm:py-5 rounded-r-none border border-[#E5E5E5] focus:border-[#D4AF37] focus:ring-0 hover:border-[#D4AF37] w-full"
          />

          <Button className="bg-[#D4AF37] text-black py-4 sm:py-5 px-5 rounded-l-none border border-[#D4AF37] hover:opacity-90 whitespace-nowrap">
            Search
          </Button>

        </div>
      </div>

      {/* TOP CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex gap-2 sm:gap-4">
        {helpData.map((cat, index) => {
          const Icon = cat.icon

          return (
            <Card
              key={index}
              onClick={() => handleSectionChange(index)}
              className={`flex-1 rounded-2xl hover:shadow-md transition cursor-pointer border ${
                activeSection === index
                  ? "border-[#D4AF37]"
                  : "border-[#E5E5E5] hover:border-[#D4AF37]"
              }`}
            >
              <CardContent className="p-3 sm:p-5 flex flex-col items-center text-center space-y-2">
                <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-[#D4AF37]" />
                <h3 className="font-semibold text-xs sm:text-sm text-[#1A1A1A]">
                  {cat.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {cat.faqs[0]?.question}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 pb-10">

        {/* SIDEBAR */}
        <div className="hidden lg:block bg-white rounded-2xl p-4 shadow-sm space-y-2 sm:space-y-3 border border-[#E5E5E5]">

          <h3 className="font-semibold text-sm sm:text-base text-[#0B1F3A]">
            Browse Topics
          </h3>

          {helpData.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleSectionChange(i)}
              className={`p-2 text-sm sm:text-base rounded-lg cursor-pointer ${
                activeSection === i
                  ? "bg-[#FFF8EC] text-[#D4AF37]"
                  : "hover:bg-[#FFF8EC]"
              }`}
            >
              {cat.title}
            </div>
          ))}

        </div>

        {/* FAQ CONTENT */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E5E5E5]">

          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base md:text-lg text-[#0B1F3A]">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
            {currentSection.title}
          </h2>

          <div className="space-y-3">

            {currentSection.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[#E5E5E5] rounded-xl p-3 sm:p-4 cursor-pointer hover:border-[#D4AF37] transition"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center gap-3">

                  <p className="font-medium text-sm sm:text-base text-[#1A1A1A]">
                    {faq.question}
                  </p>

                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openIndex === index
                        ? "rotate-180 text-[#D4AF37]"
                        : "text-gray-400"
                    }`}
                  />

                </div>

                {openIndex === index && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-3">
                    {faq.answer}
                  </p>
                )}

              </div>
            ))}

          </div>

          {/* HELP BOX */}
          <div className="mt-6 bg-[#FFF8EC] border border-[#D4AF37] p-4 rounded-xl">
            <p className="font-medium text-sm sm:text-base text-[#0B1F3A]">
              Still need help?
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Email info@kavaswholesalehub.com or call +91-98765-00000
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default page