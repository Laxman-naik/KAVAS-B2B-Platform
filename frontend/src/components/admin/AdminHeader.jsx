import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function Header({ title }) {
  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-[#0F1E33] border-b border-gray-700 flex items-center justify-between px-4 md:px-6 z-30">

      {/* Title */}
      <h1 className="text-white text-lg font-semibold">
        {title}
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-[#13263C] px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input className="bg-transparent outline-none text-sm px-2 text-white" placeholder="Search..." />
        </div>

        <Bell className="w-5 h-5 text-gray-300 cursor-pointer" />
        <HelpCircle className="w-5 h-5 text-gray-300 cursor-pointer" />

        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
          AD
        </div>
      </div>
    </div>
  );
}