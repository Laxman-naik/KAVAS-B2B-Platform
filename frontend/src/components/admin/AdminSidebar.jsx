// import React from 'react'

// const AdminSidebar = () => {
//   return (
//     <div className="fixed left-0 top-0 w-64 h-screen bg-[#111] text-white z-40 p-4">AdminSidebar</div>
//   )
// }

// export default AdminSidebar

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, Users, ShoppingCart, ShieldCheck, Store,
  Package, CreditCard, FileText,  AlertTriangle, Layers, Crown, Settings } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname(); 

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-[#111] text-white flex flex-col p-4 z-40">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500 w-10 h-10 flex items-center justify-center rounded-md font-bold">K</div>
        <div>
          <h2 className="font-semibold text-lg">Kavas</h2>
          <p className="text-xs text-gray-400">Admin Console</p>
        </div>
      </div>
      <Section title="OVERVIEW">
        <Item
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          href="/admin/dashboard"
          active={pathname === "/admin/dashboard"}
        />
        <Item
          icon={<BarChart2 size={18} />}
          label="Analytics"
          href="/admin/analytics"
          active={pathname.startsWith("/admin/analytics")}
        />
      </Section>
      <Section title="BUYERS">
        <Item
          icon={<Users size={18} />}
          label="All Buyers"
          href="/admin/buyers"
          badge="2"
          active={pathname.startsWith("/admin/buyers")}
        />
        <Item
          icon={<ShoppingCart size={18} />}
          label="Buyer Orders"
          href="/admin/buyer-orders"
          badge="2"
          active={pathname.startsWith("/admin/buyer-orders")}
        />
        <Item
          icon={<ShieldCheck size={18} />}
          label="KYC Approvals"
          href="/admin/kyc"
          badge="3"
          active={pathname.startsWith("/admin/kyc")}
        />
      </Section>
      <Section title="VENDORS">
        <Item
          icon={<Store size={18} />}
          label="All Vendors"
          href="/admin/vendors"
          badge="1"
          active={pathname.startsWith("/admin/vendors")}
        />
        <Item
          icon={<Package size={18} />}
          label="Products"
          href="/admin/products"
          active={pathname.startsWith("/admin/products")}
        />
        <Item
          icon={<CreditCard size={18} />}
          label="Payouts"
          href="/admin/payouts"
          badge="2"
          active={pathname.startsWith("/admin/payouts")}
        />
        <Item
          icon={<ShieldCheck size={18} />}
          label="Vendor KYC"
          href="/admin/vendor-kyc"
          badge="3"
          active={pathname.startsWith("/admin/vendor-kyc")}
        />
      </Section>
      <Section title="OPERATIONS">
        <Item
          icon={<FileText size={18} />}
          label="All Orders"
          href="/admin/orders"
          active={pathname.startsWith("/admin/orders")}
        />
        <Item
          icon={<AlertTriangle size={18} />}
          label="Disputes"
          href="/admin/disputes"
          badge="2"
          active={pathname.startsWith("/admin/disputes")}
        />
        <Item
          icon={<Layers size={18} />}
          label="Categories"
          href="/admin/categories"
          active={pathname.startsWith("/admin/categories")}
        />
        <Item
          icon={<Crown size={18} />}
          label="Memberships"
          href="/admin/memberships"
          active={pathname.startsWith("/admin/memberships")}
        />
      </Section>
      <Section title="SETTINGS">
        <Item
          icon={<Settings size={18} />}
          label="Settings"
          href="/admin/settings"
          active={pathname.startsWith("/admin/settings")}
        />
      </Section>
    </div>
  );
};

export default Sidebar;

const Section = ({ title, children }) => (
  <div className="mb-6">
    <p className="text-xs text-gray-400 mb-2">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const Item = ({ icon, label, href = "#", badge, active }) => (
  <Link href={href}>
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition
      ${active ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-gray-800"}`}
    >
      <div className="flex items-center gap-3">{icon}<span className="text-sm">{label}</span></div>
      {badge && (<span className="bg-orange-500 text-xs px-2 py-0.5 rounded-full">{badge}</span>)}
    </div>
  </Link>
);
