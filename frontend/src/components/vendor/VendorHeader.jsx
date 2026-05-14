"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, HelpCircle, Search } from "lucide-react";
import { vendorNavItems } from "./vendorNavConfig";
import { useDispatch, useSelector } from "react-redux";
import { logoutVendor } from "../../store/slices/vendorSlice";

const VendorHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const vendor = useSelector((state) => state.vendor.vendor);

  const pageTitle = useMemo(() => {
    if (!pathname) return "";
    const match = vendorNavItems.find(
      (x) => pathname === x.href || pathname.startsWith(`${x.href}/`)
    );
    return match?.label || "Dashboard";
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutVendor()).unwrap();

      router.push("/vendor/vendorlogin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="fixed top-0 right-0 z-30 h-16 w-[calc(100%-16rem)] bg-white border-b border-[#E5E5E5]">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="text-base sm:text-lg font-extrabold text-[#0B1F3A]">
          {pageTitle}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-[#E5E5E5] px-3 h-10 w-70 bg-white">
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

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 pl-1 cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F3A] text-white text-xs font-bold">
                {vendor?.business?.business_name ?.split(" ") ?.map((word) => word[0]) ?.slice(0, 2) ?.join("") ?.toUpperCase()}
              </div>

              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-bold text-[#0B1F3A]">
                  {vendor?.business?.business_name}
                </div>
                <div className="text-[11px] text-gray-500">
                  Seller Account
                </div>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition ${open ? "rotate-180" : ""
                  }`}
              />
            </div>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li
                    onClick={() => {
                      router.push("/profile");
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </li>

                  <li
                    onClick={() => {
                      router.push("/settings");
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Settings
                  </li>

                  <li
                    onClick={() => {
                      router.push("/support");
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Support
                  </li>

                  <li
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;