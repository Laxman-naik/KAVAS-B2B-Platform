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
  CreditCard,
  MessageSquareText,
  Bell,
  KeyRound,
  Headset,
  Shield,
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/buyerorders", label: "My Orders", icon: Package },
  { href: "/ordertracking", label: "Track Order", icon: Truck },
  { href: "/favourites", label: "Wishlist", icon: Heart },
  { href: "/myaddresses", label: "Addresses", icon: MapPin },
  { href: "/paymentmethods", label: "Payment Methods", icon: CreditCard },
  // { href: "/bulk-enquiry", label: "Bulk Enquiry", icon: MessageSquareText },
  { href: "/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { href: "/changepassword", label: "Change Password", icon: KeyRound },
  { href: "/help", label: "Help Centre", icon: Shield },
];

export default function ProfileSidebar({ user, onLogout }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === href;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="h-full bg-[#0B1F3A] w-full lg:w-[260px] lg:h-[calc(100vh-96px)]">
      <Card className="rounded-sm bg-[#0B1F3A] text-[#FFF8EC] border border-white/10 overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-sm bg-white/10 flex items-center justify-center text-lg font-bold">
                {user?.firstName?.[0] || user?.name?.[0] || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {user?.firstName || user?.name || "User"}{" "}
                  {user?.lastName || ""}
                </p>
                <p className="text-xs opacity-80 truncate">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          <div className="p-3 flex-1 overflow-y-auto">
            <nav className="space-y-1">
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
                    <Icon size={16} className={active ? "text-[#0B1F3A]" : "text-[#FFF8EC]/80"} />
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="min-w-5 h-5 px-1 rounded-full bg-[#D4AF37] text-[#0B1F3A] text-xs font-semibold flex items-center justify-center">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-3 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3 rounded-sm text-[#FFF8EC]/90 hover:bg-white/10 hover:text-[#FFF8EC]"
              onClick={onLogout}
            >
              <LogOut size={16} className="text-[#FFF8EC]/80" />
              <span className="font-medium">Logout</span>
            </Button>

            <div className="mt-4 rounded-sm border border-white/10 bg-white/5 p-4">
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

              <Button
                asChild
                className="mt-3 w-full bg-[#D4AF37] text-[#0B1F3A] rounded-sm font-semibold"
              >
                <Link href="/contactus">Contact Support</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
