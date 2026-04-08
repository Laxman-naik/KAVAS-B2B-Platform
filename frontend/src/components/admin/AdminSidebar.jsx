"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  BarChart2,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  Shield,
  Menu,
  User,
  Activity,
  LogOut,
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
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

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
          <div className="mt-3 space-y-2">
            {menuItems.map((item, index) => {
              if (item.section) {
                return (
                  <p key={index} className="text-[10px] text-gray-400 px-3 mt-3">
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
                    setOpen(false);
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

        <div className="p-2 border-t border-gray-700 relative" ref={profileRef}>
          
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1B2A45] transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
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

          <div
            className={`absolute bottom-14 left-2 right-2 bg-[#0F1E33] border border-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 ${
              profileOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-2 invisible"
            }`}
          >
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

              <div className="border-t border-gray-700"></div>

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
    </>
  );
}