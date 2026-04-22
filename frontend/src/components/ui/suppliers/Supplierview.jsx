"use client"
import React, { useState } from 'react'
import {
  Star,
  Package,
  TrendingUp,
  Globe,
  Clock,
  IndianRupee,
  MessageCircle,
  FileText,
  Box
} from "lucide-react";

import { suppliers } from "@/data/suppliers";
import { useParams } from "next/navigation";
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Supplierview = () => {

  const [activeTab, setActiveTab] = useState("enquiry");

  const params = useParams();

  const supplier = suppliers.find(
    (s) => s.id.toString() === params.id
  );

  if (!supplier) {
    return <div className="p-10 text-center text-lg">Supplier not found</div>;
  }

  return (
    <>
    <Navbar />

    <div className="bg-[#FFF8EC] min-h-screen text-[#1A1A1A]">
      <div className="bg-[#0B1F3A] text-white w-full shadow-md">
        <div className="px-4 sm:px-6 lg:px-10 p-6 lg:p-8 flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">

          <div className="flex items-start sm:items-center gap-4">
            <div className="bg-[#D4AF37] text-[#0B1F3A] w-14 h-14 flex items-center justify-center rounded-sm text-lg font-bold shadow">
              {supplier.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">
                {supplier.name}
              </h1>
              <p className="text-sm opacity-90">
                📍 {supplier.location} • {supplier.category}
              </p>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {supplier.tags.map((tag, i) => (
                  <Badge key={i} text={tag} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center w-full lg:w-auto">
            <Stat value={supplier.stats.products} label="Products" />
            <Stat value={`${supplier.stats.rating}★`} label="Rating" />
            <Stat value={supplier.stats.response} label="Response" />
            <Stat value="5+" label="Experience" />
          </div>

        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-x-6 gap-y-4 mt-4 px-4 sm:px-6 lg:px-10">
        <div className="lg:col-span-2 space-y-4">

          <Card title="About Supplier">
            <hr className="border-[#E5E5E5]" />
            <p className="text-gray-600 font-medium leading-relaxed mt-2">
              {supplier.name} is a leading supplier based in {supplier.location},
              specializing in {supplier.category} products with high-quality standards
              and strong B2B relationships.
            </p>
          </Card>

          <Card title="Business Capabilities">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-4 sm:gap-y-6">

              <div className="border border-[#E5E5E5] rounded-sm p-2 text-center bg-[#0B1F3A]">
                <h2 className="text-xl font-bold text-[#D4AF37]">{supplier.stats.products}</h2>
                <p className="text-gray-600 text-sm mt-1">Products Listed</p>
              </div>

              <div className="border border-[#E5E5E5] rounded-sm p-2 text-center bg-[#0B1F3A]">
                <h2 className="text-xl font-bold text-[#D4AF37]">{supplier.stats.rating}★</h2>
                <p className="text-gray-600 text-sm mt-1">Avg Rating</p>
              </div>

              <div className="border border-[#E5E5E5] rounded-sm p-2 text-center bg-[#0B1F3A]">
                <h2 className="text-xl font-bold text-[#D4AF37]">{supplier.stats.response}</h2>
                <p className="text-gray-600 text-sm mt-1">Response Rate</p>
              </div>

              <div className="border border-[#E5E5E5] rounded-sm p-2 text-center bg-[#0B1F3A]">
                <h2 className="text-xl font-bold text-[#D4AF37]">48hr</h2>
                <p className="text-gray-600 text-sm mt-1">Avg Response</p>
              </div>

              <div className="border border-[#E5E5E5] rounded-sm p-2 text-center bg-[#0B1F3A]">
                <h2 className="text-xl font-bold text-[#D4AF37]">₹25,000</h2>
                <p className="text-gray-600 text-sm mt-1">Min. Order</p>
              </div>

              <div className="border border-[#E5E5E5] rounded-sm p-2 text-center bg-[#0B1F3A]">
                <h2 className="text-xl font-bold text-[#D4AF37]">10+ countries</h2>
                <p className="text-gray-600 text-sm mt-1">Export Markets</p>
              </div>

            </div>
          </Card>

          <Card title="Product Catalogue">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">

              {supplier.products.map((product) => (
                <div key={product.id} className="border border-[#E5E5E5] rounded-sm overflow-hidden bg-white">

                  {/* FIXED ERROR HERE */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-40 sm:h-44 md:h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 sm:h-44 md:h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <div className="p-3">
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-[#D4AF37] font-semibold mt-1">
                      ₹{product.price}/{product.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Min. {product.minOrder} units
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </Card>

        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-md p-5 space-y-5 h-fit lg:sticky lg:top-6 w-full max-w-md lg:max-w-sm mx-auto lg:ml-auto">

          <h3 className="text-lg font-semibold">Contact Supplier</h3>

          <div className="flex justify-between border-b border-[#E5E5E5] pb-2 text-sm">
            <Tab icon={<MessageCircle size={16} />} text="Enquiry" active={activeTab === "enquiry"} onClick={() => setActiveTab("enquiry")} />
            <Tab icon={<FileText size={16} />} text="Get Quote" active={activeTab === "quote"} onClick={() => setActiveTab("quote")} />
            <Tab icon={<Box size={16} />} text="Sample" active={activeTab === "sample"} onClick={() => setActiveTab("sample")} />
          </div>

          <div key={activeTab} className="space-y-4">

            {activeTab === "enquiry" && (
              <>
                <Input label="Your Name *" placeholder="Rahul Sharma" />
                <Input label="Email *" placeholder="rahul@company.com" />
                <Input label="Phone" placeholder="+91 98765 43210" />
                <Input label="Subject" placeholder="Bulk order inquiry" />
                <Textarea label="Message *" placeholder="Hi, I'm interested..." />
                <button className="w-full bg-[#D4AF37] text-[#0B1F3A] py-2.5 rounded-xl font-medium">
                  Send Enquiry
                </button>
              </>
            )}

            {activeTab === "quote" && (
              <>
                <Input label="Your Name *" placeholder="Rahul Sharma" />
                <Input label="Company *" placeholder="My Company Pvt. Ltd." />
                <Input label="Email *" placeholder="rahul@company.com" />
                <Input label="Product *" placeholder="e.g. Cotton T-Shirts" />
                <div className="flex gap-2">
                  <Input label="Quantity *" placeholder="500" />
                  <select className="mt-6 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm w-full">
                    <option>Pieces</option>
                    <option>Kgs</option>
                  </select>
                </div>
                <Input label="Target Price" placeholder="150" />
                <Textarea label="Specifications" placeholder="Details..." />
                <button className="w-full bg-[#D4AF37] text-[#0B1F3A] py-2.5 rounded-xl font-medium">
                  Send RFQ
                </button>
              </>
            )}

            {activeTab === "sample" && (
              <>
                <Input label="Your Name *" placeholder="Rahul Sharma" />
                <Input label="Email *" placeholder="rahul@company.com" />
                <Input label="Product *" placeholder="Product" />
                <Input label="Sample Qty" placeholder="5" />
                <Textarea label="Delivery Address" placeholder="Full address" />
                <button className="w-full bg-[#D4AF37] text-[#0B1F3A] py-2.5 rounded-xl font-medium">
                  Request Sample
                </button>
              </>
            )}

          </div>
        </div>

      </div>
    </div>

    <Footer />
    </>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-5">
    <h3 className="font-semibold text-[#1A1A1A] mb-3">{title}</h3>
    {children}
  </div>
);

const Stat = ({ value, label }) => (
  <div>
    <p className="text-lg font-semibold">{value}</p>
    <p className="text-xs opacity-80">{label}</p>
  </div>
);

const Input = ({ label, placeholder }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full mt-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]"
    />
  </div>
);

const Textarea = ({ label, placeholder }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      rows="3"
      placeholder={placeholder}
      className="w-full mt-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]"
    />
  </div>
);

const Tab = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 pb-1 border-b-2 ${
      active ? "border-[#D4AF37] text-[#D4AF37]" : "text-gray-500 border-transparent"
    }`}
  >
    {icon}
    {text}
  </button>
);

const Badge = ({ text }) => (
  <span className="bg-white/20 px-2 py-1 rounded-md text-xs">
    {text}
  </span>
);

export default Supplierview;