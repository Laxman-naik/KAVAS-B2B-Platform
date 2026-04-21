"use client";
import React, { useState } from "react";
import {
  Factory,
  Users,
  BadgeCheck,
  ShieldCheck,
  Truck,
  Star,
  BarChart3,
} from "lucide-react";
import Footer from "../ui/common/Footer";
import Navbar from "../ui/common/Navbar";

const VendorRegister = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#FFF8EC]">
      
      {/* HERO */}
      <section className="bg-[#0B1F3A] text-white py-9 sm:py-10 text-center">
        <div className="flex justify-center mb-4">
          <Factory size={40} className="text-[#D4AF37]" />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
          Sell on Kavas
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 max-w-xl mx-auto">
          Join 500+ verified vendors reaching 50,000+ B2B buyers across India.
          No listing fee for first 6 months.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
        >
          Start selling for free →
        </button>
      </section>

      <section className="px-4 sm:px-6 lg:px-16 xl:px-24 py-12">
        <h2 className="text-lg font-semibold mb-6 border-l-4 border-[#D4AF37] pl-3 text-[#1A1A1A]">
          How to Get Started
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "Register Business",
              desc: "Create your vendor account with GST & business registration. Takes under 10 minutes.",
            },
            {
              step: 2,
              title: "Get Verified",
              desc: "Our team verifies your business credentials within 48 hours.",
            },
            {
              step: 3,
              title: "List Products",
              desc: "Upload your catalogue with bulk pricing tiers, MOQ, and specifications.",
            },
            {
              step: 4,
              title: "Receive Orders",
              desc: "Get connected with thousands of verified buyers across India.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white border border-[#E5E5E5] rounded-xl p-6 text-center hover:shadow-md transition cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#D4AF37] text-white rounded-full text-lg font-bold">
                {item.step}
              </div>

              <h3 className="font-semibold mb-2 text-[#1A1A1A]">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-4 sm:px-6 lg:px-16 xl:px-24 pb-12">
        <h2 className="text-lg font-semibold mb-6 border-l-4 border-[#D4AF37] pl-3 text-[#1A1A1A]">
          Why Sell on Kavas?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Users />,
              title: "50,000+ Active Buyers",
              desc: "Reach verified business buyers including retailers, distributors, and procurement teams.",
            },
            {
              icon: <BadgeCheck />,
              title: "Zero Commission 6 Months",
              desc: "No listing fees and zero platform commission for first 6 months.",
            },
            {
              icon: <ShieldCheck />,
              title: "Secure Payments",
              desc: "Escrow system — payments released within 48 hours of successful delivery.",
            },
            {
              icon: <BarChart3 />,
              title: "Seller Dashboard",
              desc: "Real-time analytics on views, inquiries, orders, and revenue.",
            },
            {
              icon: <Truck />,
              title: "Integrated Logistics",
              desc: "Discounted shipping rates with pan-India delivery and live tracking.",
            },
            {
              icon: <Star />,
              title: "Verified Seller Badge",
              desc: "Earn Kavas Verified badge after quality audit — boosting buyer trust.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="mb-3 text-[#D4AF37]">{item.icon}</div>
              <h3 className="font-semibold mb-1 text-[#1A1A1A]">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white w-[95%] sm:w-full max-w-md rounded-xl p-5 relative shadow-xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-center mb-6 text-[#1A1A1A]">
              Register as a Vendor Today
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="First Name" className="border rounded-md px-3 py-2" />
              <input placeholder="Last Name" className="border rounded-md px-3 py-2" />
            </div>

            <input placeholder="Business Name" className="border rounded-md px-3 py-2 w-full mt-4" />
            <input placeholder="Business Email" className="border rounded-md px-3 py-2 w-full mt-4" />
            <input placeholder="Phone" className="border rounded-md px-3 py-2 w-full mt-4" />

            <select className="border rounded-md px-3 py-2 w-full mt-4">
              <option>Select category</option>
            </select>

            <input placeholder="GST Number" className="border rounded-md px-3 py-2 w-full mt-4" />

            <button className="w-full mt-6 bg-[#D4AF37] text-white py-3 rounded-md hover:opacity-90 transition">
              Send Application →
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default VendorRegister;