"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { vendorNavItems } from "./vendorNavConfig";

const VendorSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = useMemo(() => vendorNavItems, []);

  const isActive = (href) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen ${collapsed ? "w-20" : "w-64"} bg-[#0B1F3A] text-white transition-[width] duration-200`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37] text-[#0B1F3A] text-lg font-extrabold">
              K
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-lg font-extrabold">KAVAS</div>
                <div className="text-xs text-white/70">Seller Hub</div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((s) => !s)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/15"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`${collapsed ? "rotate-180" : ""} transition-transform`} size={18} />
          </button>
        </div>

        <div className="px-3 py-3">
          <div className="h-px w-full bg-white/10" />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    active ? "bg-white/10 text-[#D4AF37]" : "text-white/85 hover:bg-white/10"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-[#D4AF37]/15" : "bg-white/5 group-hover:bg-white/10"}`}>
                    <Icon size={18} className={active ? "text-[#D4AF37]" : "text-white/75"} />
                  </span>

                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{item.label}</span>
                      {active && <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-3">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/20" />
              {!collapsed && (
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">Sharma Traders</div>
                  <div className="truncate text-xs text-white/70">Gold Supplier</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default VendorSidebar;
