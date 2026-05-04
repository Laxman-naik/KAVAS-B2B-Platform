"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Building2,
  Warehouse,
  Bell,
  Shield,
  Wallet,
} from "lucide-react";

const menu = [
  { name: "Profile", desc: "Personal details", path: "/vendor/settings/profile", icon: User },
  { name: "Business", desc: "Company info & KYC", path: "/vendor/settings/business", icon: Building2 },
  { name: "Warehouses", desc: "Storage locations", path: "/vendor/settings/warehouses", icon: Warehouse },
  { name: "Notifications", desc: "Alert preferences", path: "/vendor/settings/notifications", icon: Bell },
  { name: "Security", desc: "Password & 2FA", path: "/vendor/settings/security", icon: Shield },
  { name: "Payouts", desc: "Payment config", path: "/vendor/settings/payouts", icon: Wallet },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F5EFE6] p-4">
      <div className="mb-4 ml-2">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account, business, and platform preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">

        <div className="w-full md:w-60 bg-white rounded-2xl shadow-md p-4 space-y-2 flex flex-col">

          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-[#1E2A38] text-white shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition 
                    ${
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span
                      className={`text-xs ${
                        isActive ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>

                  <div className="ml-auto text-sm opacity-60 group-hover:translate-x-1 transition">
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-md p-4 md:p-6">
          {children}
        </div>

      </div>
    </div>
  );
}