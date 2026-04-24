"use client";

import React from "react";
import { Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-40 bg-white border-b border-[#E5E5E5] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      
      {/* LEFT SECTION */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
          Dashboard
        </h1>
        <p className="text-xs text-gray-500 hidden sm:block">
          Welcome back, Rajesh! Here's your business overview.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-[#FFF8EC] border border-[#E5E5E5] rounded-full px-3 py-2 w-64 lg:w-80 transition focus-within:ring-2 focus-within:ring-[#D4AF37]">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search Products, Orders..."
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </div>

        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 rounded-full hover:bg-[#FFF8EC] transition">
          <Search size={18} />
        </button>

        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-[#FFF8EC] transition">
          <Bell size={18} className="text-[#1A1A1A]" />
          
          {/* Notification Dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 flex items-center justify-center bg-[#D4AF37] text-white rounded-full text-sm font-semibold group-hover:scale-105 transition">
            RS
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;