"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  User,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const title = pathname.split("/").pop() || "dashboard";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search
  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-[#0F1E33] border-b border-gray-700 flex items-center justify-between px-4 md:px-6 z-30 text-white">

      <h1 className="text-sm md:text-lg font-semibold capitalize truncate">
        {title}
      </h1>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center bg-[#13263C] px-3 py-1.5 rounded-lg border border-transparent focus-within:border-blue-500 transition">
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

        <div className="relative group cursor-pointer">
          <Bell className="w-5 h-5 hover:text-blue-400 transition" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>

          <div className="absolute top-8 right-1/2 translate-x-1/2 bg-black text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
            Notifications
          </div>
        </div>

        <div className="relative group cursor-pointer">
          <HelpCircle className="w-5 h-5 hover:text-blue-400 transition" />

          <div className="absolute top-8 right-1/2 translate-x-1/2 bg-black text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
            Help
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          
          {/* Avatar */}
          <div
            onClick={() => setOpen(!open)}
            className="relative group w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-105 transition"
          >
            AD

            {/* Tooltip */}
            <div className="absolute top-10 right-1/2 translate-x-1/2 bg-black text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 whitespace-nowrap pointer-events-none z-50">
              Profile
            </div>
          </div>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-3 w-64 bg-[#0F1E33] border border-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 ${
              open
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible"
            }`}
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-gray-400 truncate">
                  superadmin@tradehub.com
                </p>
              </div>
            </div>

            <div className="text-sm">

              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#13263C] transition">
                <User className="w-4 h-4" />
                My Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#13263C] transition">
                <Settings className="w-4 h-4" />
                Settings
              </button>

              {/* <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#13263C] transition">
                <Activity className="w-4 h-4" />
                Activity Log
              </button> */}

              <div className="border-t border-gray-700 mt-1"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}