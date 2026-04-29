"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, HelpCircle, Search } from "lucide-react";
import { vendorNavItems } from "./vendorNavConfig";

const VendorHeader = () => {
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    if (!pathname) return "";
    const match = vendorNavItems.find((x) => pathname === x.href || pathname.startsWith(`${x.href}/`));
    return match?.label || "Dashboard";
  }, [pathname]);

  return (
    <header className="fixed top-0 right-0 z-30 h-16 w-[calc(100%-16rem)] bg-white border-b border-[#E5E5E5]">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="text-base sm:text-lg font-extrabold text-[#0B1F3A]">{pageTitle}</div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-[#E5E5E5] px-3 h-10 w-[280px] bg-white">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search..."
              className="w-full text-sm outline-none text-[#1A1A1A]"
            />
          </div>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC]"
            aria-label="Notifications"
          >
            <Bell size={16} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC]"
            aria-label="Help"
          >
            <HelpCircle size={16} className="text-gray-700" />
          </button>

          <div className="flex items-center gap-3 pl-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F3A] text-white text-xs font-bold">
              RS
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-bold text-[#0B1F3A]">Rahul Sharma</div>
              <div className="text-[11px] text-gray-500">Seller Account</div>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
