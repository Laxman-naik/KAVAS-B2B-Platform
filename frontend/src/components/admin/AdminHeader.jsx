"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const title = pathname.split("/").pop() || "dashboard";

  // Handle search submit
  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
  };

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-[#0F1E33] border-b border-gray-700 flex items-center justify-between px-4 md:px-6 z-30 text-white">

      {/* Title */}
      <h1 className="text-sm md:text-lg font-semibold capitalize truncate">
        {title}
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Search */}
        <div className="hidden sm:flex items-center hover:border-blue-600 bg-[#13263C] px-3 py-1.5 rounded-lg border border-transparent focus-within:border-blue-500 transition">
          <Search
            className="w-4 h-4 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-transparent outline-none text-sm px-2 text-white placeholder-gray-400 w-24 md:w-40"
            placeholder="Search..."
          />
        </div>

        {/* Notification */}
        <div className="relative group cursor-pointer">
          <Bell className="w-5 h-5 hover:text-blue-400 transition" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>

          <div className="absolute top-8 right-0 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Notifications
          </div>
        </div>

        {/* Help */}
        <div className="relative group cursor-pointer">
          <HelpCircle className="w-5 h-5 hover:text-blue-400 transition" />

          <div className="absolute top-8 right-0 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Help
          </div>
        </div>

        {/* Profile */}
        <div className="relative group cursor-pointer">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold hover:scale-105 transition">
            AD
          </div>

          <div className="absolute top-9 right-0 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            Profile
          </div>
        </div>

      </div>
    </div>
  );
}