"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  MapPin,
  Package,
  Truck,
  Heart,
  KeyRound,
  Headset,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/buyerorders", label: "My Orders", icon: Package },
  { href: "/ordertracking", label: "Track Order", icon: Truck },
  { href: "/buyerquotes", label: "My RFQ'S", icon: Truck},
  { href: "/favourites", label: "Wishlist", icon: Heart },
  { href: "/myaddresses", label: "Addresses", icon: MapPin },
  { href: "/changepassword", label: "Change Password", icon: KeyRound },
];

export default function ProfileSidebar({ user }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === href;

    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="bg-[#0B1F3A] w-full lg:w-65 lg:sticky lg:top-20 min-h-screen pb-12">
      <Card className="rounded-sm bg-[#0B1F3A] text-[#FFF8EC] overflow-hidden border-0 shadow-none">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-sm bg-white/10 flex items-center justify-center text-lg font-bold">
                {user?.firstName?.[0] ||
                  user?.full_name?.[0] ||
                  user?.name?.[0] ||
                  "U"}
              </div>

              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {user?.full_name ||
                    `${user?.firstName || user?.name || "User"} ${
                      user?.lastName || ""
                    }`}
                </p>

                <p className="text-xs opacity-80 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 flex-1 overflow-y-auto">
            <nav className="space-y-3">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-[#D4AF37] text-[#0B1F3A]"
                        : "text-[#FFF8EC]/90 hover:bg-white/10"
                    )}
                  >
                    <Icon
                      size={16}
                      className={
                        active ? "text-[#0B1F3A]" : "text-[#FFF8EC]/80"
                      }
                    />

                    <span className="font-medium flex-1">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3  border-white/10">
            <div className="mt-2 rounded-sm bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-sm bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shrink-0">
                  <Headset size={20} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">Need Help?</p>

                  <p className="text-xs opacity-80 mt-1">
                    Our support team is here 24/7 to assist you.
                  </p>
                </div>
              </div>

              <Button className="mt-3 w-full bg-[#D4AF37] hover:bg-[#D4AF37] text-[#0B1F3A] hover:text-white rounded-sm font-semibold">
                <Link href="/contactus">Contact Support</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}