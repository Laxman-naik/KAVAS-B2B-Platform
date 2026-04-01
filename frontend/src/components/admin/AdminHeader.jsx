"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();

  // Get last part of URL
  const title = pathname.split("/").pop() || "dashboard";

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-[#0F1E33] border-b border-gray-700 flex items-center justify-between px-6 z-30 text-white">

      {/* Dynamic Title */}
      <h1 className="text-lg font-semibold capitalize">
        {title}
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-[#13263C] px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="bg-transparent outline-none text-sm px-2 text-white"
            placeholder="Search..."
          />
        </div>

        <Bell className="w-5 h-5 cursor-pointer" />
        <HelpCircle className="w-5 h-5 cursor-pointer" />

        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
          AD
        </div>
      </div>
    </div>
  );
}