"use client";

import React, { useState } from "react";
import {
  Home,
  BarChart2,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  Shield,
  Menu,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { title: "Analytics", icon: BarChart2, path: "/admin/analytics" },

  { section: "USERS" },
  { title: "Buyers", icon: Users, badge: "248", path: "/admin/buyers" },
  { title: "Vendors", icon: Users, badge: "12", path: "/admin/vendors" },

  { section: "COMMERCE" },
  { title: "Orders", icon: ShoppingCart, badge: "5", path: "/admin/orders" },
  { title: "Catalog", icon: FileText, path: "/admin/catalog" },
  { title: "RFQ / Quotes", icon: FileText, path: "/admin/rfq" },

  { section: "FINANCE" },
  { title: "Invoices", icon: FileText, path: "/admin/invoices" },
  { title: "Payouts", icon: FileText, path: "/admin/payouts" },

  { section: "SYSTEM" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
  { title: "Compliance", icon: Shield, path: "/admin/compliance" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-[#0F1E33] text-white rounded-lg"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-60 bg-[#0F1E33] text-white flex flex-col border-r border-gray-700 z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 p-3">
            <div className="bg-orange-500 w-9 h-9 rounded-lg flex items-center justify-center font-bold">
              TH
            </div>
            <div>
              <h1 className="font-semibold text-sm">TradeHub</h1>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="mt-3 space-y-2">
            {menuItems.map((item, index) => {
              if (item.section) {
                return (
                  <p
                    key={index}
                    className="text-[10px] text-gray-400 px-3 mt-3"
                  >
                    {item.section}
                  </p>
                );
              }

              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (item.path) router.push(item.path);
                    setOpen(false); // close on mobile
                  }}
                  className={`flex items-center justify-between px-3 py-2 mx-2 rounded-lg cursor-pointer transition transform
                  hover:scale-105 active:scale-95
                  ${
                    isActive
                      ? "bg-[#1E2F4D] border border-orange-400"
                      : "hover:bg-[#1B2A45]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-300" />
                    <span className="text-xs">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile */}
        <div className="p-2 border-t border-gray-700">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1B2A45] transition transform hover:scale-105 active:scale-95 cursor-pointer">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">Admin User</p>
              <p className="text-[10px] text-gray-400 truncate">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}