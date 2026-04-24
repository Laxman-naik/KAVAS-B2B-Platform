"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ ADDED
import {
  LayoutDashboard,
  Building2,
  Box,
  ShoppingCart,
  Package,
  CreditCard,
  Users,
  BarChart3,
  Star,
  Settings,
  Headphones,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(true);

  const pathname = usePathname(); // ✅ ADDED

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/vendor/dashboard" },
    { name: "Company Profile", icon: Building2, href: "/vendor/company" },
  ];

  const others = [
    { name: "Orders", icon: ShoppingCart, href: "/vendor/orders" },
    { name: "Inventory", icon: Package, href: "/vendor/inventory" },
    { name: "Payments", icon: CreditCard, href: "/vendor/payments" },
    { name: "Buyers", icon: Users, href: "/vendor/buyers" },
    { name: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    { name: "Reviews", icon: Star, href: "/vendor/reviews" },
  ];

  const bottom = [
    { name: "Support", icon: Headphones, href: "/vendor/support" },
    { name: "Settings", icon: Settings, href: "/vendor/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4">
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0B1F3A] text-gray-300
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-all duration-300 flex flex-col justify-between`}
      >
        {/* TOP */}
        <div>
          {/* Logo */}
          <div className="px-5 py-4 border-b border-[#E5E5E5]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="logo"
                className="w-10 h-10 rounded-lg bg-white p-1"
              />
              <div>
                <h1 className="text-white font-semibold text-lg">
                  VendorHub
                </h1>
                <span className="text-[10px] bg-[#D4AF37] text-white px-2 py-[2px] rounded-full">
                  Verified Supplier
                </span>
              </div>
            </div>

            <button className="md:hidden" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Menu */}
          <div className="px-3 py-4 space-y-1">

            {/* Main */}
            {menu.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer
                ${
                  pathname === item.href
                    ? "bg-[#D4AF37] text-white"
                    : "hover:bg-[#D4AF37] hover:text-white"
                }
                transition-all duration-300`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}

            {/* Products */}
            <div>
              <div
                onClick={() => setProductOpen(!productOpen)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer
                ${
                  pathname.startsWith("/vendor/products")
                    ? "bg-[#D4AF37] text-white"
                    : "hover:bg-[#D4AF37] hover:text-white"
                }
                transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <Box size={18} />
                  <span className="text-sm">Products</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    productOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {productOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  <Link
                    href="/vendor/products"
                    className={`block text-xs px-3 py-2 rounded-md cursor-pointer
                    ${
                      pathname === "/vendor/products"
                        ? "bg-[#D4AF37] text-white"
                        : "hover:text-white hover:bg-[#1A1A1A]/40"
                    }`}
                  >
                    All Products
                  </Link>

                  <Link
                    href="/vendor/products/add"
                    className={`block text-xs px-3 py-2 rounded-md cursor-pointer
                    ${
                      pathname === "/vendor/products/add"
                        ? "bg-[#D4AF37] text-white"
                        : "hover:text-white hover:bg-[#1A1A1A]/40"
                    }`}
                  >
                    Add Product
                  </Link>
                </div>
              )}
            </div>

            {/* Other */}
            {others.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer
                ${
                  pathname === item.href
                    ? "bg-[#D4AF37] text-white"
                    : "hover:bg-[#D4AF37] hover:text-white"
                }
                transition-all duration-300`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="px-3 pb-4 space-y-2 border-t border-[#E5E5E5]/20">

          {bottom.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer
              ${
                pathname === item.href
                  ? "bg-[#D4AF37] text-white"
                  : "hover:bg-[#D4AF37] hover:text-white"
              }
              transition-all duration-300`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}

          {/* Profile */}
          <div className="flex items-center gap-3 mt-3 px-3 py-2 bg-[#1A1A1A]/40 rounded-lg">
            <div className="w-9 h-9 flex items-center justify-center bg-[#D4AF37] text-white rounded-full text-sm font-semibold">
              RS
            </div>
            <div>
              <p className="text-sm text-white">Rajesh Sharma</p>
              <p className="text-xs text-gray-400">rajesh@email.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;