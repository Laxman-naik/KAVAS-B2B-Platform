"use client";
import React, { useState } from "react";
import { Home, BarChart2, Users, ShoppingCart, FileText, Settings, Shield, Menu } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: Home },
  { title: "Analytics", icon: BarChart2 },

  { section: "USERS" },
  { title: "Buyers", icon: Users, badge: "248" },
  { title: "Vendors", icon: Users, badge: "12" },

  { section: "COMMERCE" },
  { title: "Orders", icon: ShoppingCart, badge: "5" },
  { title: "Catalog", icon: FileText },
  { title: "RFQ / Quotes", icon: FileText },

  { section: "FINANCE" },
  { title: "Invoices", icon: FileText },
  { title: "Payouts", icon: FileText },

  { section: "SYSTEM" },
  { title: "Settings", icon: Settings },
  { title: "Compliance", icon: Shield },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-[#0F1E33] text-white rounded-lg"
        >
          <Menu />
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 h-screen w-60 bg-[#0F1E33] text-white flex flex-col border-r border-gray-700 z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
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
          <div className="mt-3 space-y-3">
            {menuItems.map((item, index) => {
              if (item.section) {
                return (
                  <p key={index} className="text-[10px] text-gray-400 px-3 mt-3">
                    {item.section}
                  </p>
                );
              }

              const Icon = item.icon;
              const isActive = active === item.title;

              return (
                <div
                  key={index}
                  onClick={() => setActive(item.title)}
                  className={`flex items-center justify-between px-3 py-1.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 transform
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
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-2 border-t border-gray-700">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-[#1B2A45] p-2 rounded-lg transition transform hover:scale-105 active:scale-95">
            <div className="w-9 h-9 min-w-[36px] bg-orange-500 rounded-full flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">Admin User</p>
              <p className="text-[10px] text-gray-400 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
