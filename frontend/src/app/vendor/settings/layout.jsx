"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  User,
  Building2,
  Bell,
  Shield,
} from "lucide-react";

const menu = [
  {
    name: "Profile",
    desc: "Personal details",
    path: "/vendor/settings/profile",
    icon: User,
  },

  {
    name: "Business",
    desc: "Company info & KYC",
    path: "/vendor/settings/business",
    icon: Building2,
  },

  {
    name: "Notifications",
    desc: "Alert preferences",
    path: "/vendor/settings/notifications",
    icon: Bell,
  },

  {
    name: "Security",
    desc: "Password & 2FA",
    path: "/vendor/settings/security",
    icon: Shield,
  },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FFF8EC] p-3 md:p-5">

      <div className="mb-4 px-1">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account, business, and platform preferences
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">

        {/* SIDEBAR */}
        <div className="w-full shrink-0 rounded-sm border border-[#E5E5E5] bg-white p-3 shadow-sm md:w-72">

          <div className="space-y-2">

            {menu.map((item) => {
              const Icon = item.icon;

              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                >
                  <div
                    className={`group flex items-center gap-3 rounded-sm border p-3 transition-all duration-200
                    ${
                      isActive
                        ? "border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-sm"
                        : "border-transparent hover:border-[#E5E5E5] hover:bg-gray-50"
                    }`}
                  >

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-sm transition
                      ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-[#F8FAFC] text-[#0B1F3A]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold">
                        {item.name}
                      </span>

                      <span
                        className={`text-xs ${
                          isActive
                            ? "text-gray-200"
                            : "text-gray-500"
                        }`}
                      >
                        {item.desc}
                      </span>
                    </div>

                    <div
                      className={`text-sm transition-all duration-200 group-hover:translate-x-1
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 rounded-sm border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}