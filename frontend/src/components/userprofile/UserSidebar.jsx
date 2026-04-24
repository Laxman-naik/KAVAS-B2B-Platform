"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  User,
  Package,
  Truck,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Lock,
  LogOut,
  Menu,
  Headphones,
  X,
} from "lucide-react";

const menuItems = [
  {
    id: "profile",
    label: "My Profile",
    icon: User,
    path: "/userprofile/profile",
  },
  {
    id: "orders",
    label: "My Orders",
    icon: Package,
    path: "/userprofile/orders",
  },
  {
    id: "track",
    label: "Track Order",
    icon: Truck,
    path: "/userprofile/track",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: Heart,
    path: "/userprofile/wishlist",
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: MapPin,
    path: "/userprofile/addresses",
  },
  {
    id: "payments",
    label: "Payment Methods",
    icon: CreditCard,
    path: "/userprofile/payments",
  },
  {
    id: "bulk",
    label: "Bulk Enquiry",
    icon: Package,
    path: "/userprofile/bulk",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    badge: 3,
    path: "/userprofile/notifications",
  },
  {
    id: "password",
    label: "Change Password",
    icon: Lock,
    path: "/userprofile/password",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0B1F3A] text-white p-2 rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
          <div
  className={`fixed top-29 left-0 z-40 w-[260px] 
  h-[calc(100vh-64px)]
  bg-[#0B1F3A] text-white
  overflow-y-auto scrollbar-hide
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>
        {/* CLOSE BUTTON MOBILE */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="bg-[#0B1F3A]/90 border border-[#E5E5E5]/10 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#0B1F3A] flex items-center justify-center border border-[#E5E5E5]/20">
                <User size={22} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">Rahul Kumar</h3>
                <p className="text-xs text-gray-400">rahulkumar@gmail.com</p>
                <span className="text-[10px] text-[#D4AF37]">
                  ✔ Verified Buyer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="p-4 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <div
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`flex items-center justify-between px-4 py-3 rounded-sm hover:bg-[#f4d96d] cursor-pointer transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-[#D4AF37] text-[#1A1A1A] shadow-md"
                      : "hover:bg-[#0B1F3A]/90"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`transition ${
                      isActive
                        ? "text-[#1A1A1A]"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                {/* BADGE */}
                {item.badge && (
                  <span className="bg-[#D4AF37] text-xs px-2 py-0.5 rounded-full text-[#1A1A1A]">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-auto p-4">
          <div className="bg-[#0B1F3A]/90 border border-[#E5E5E5]/10 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <Headphones className="text-[#D4AF37]" />
              <h4 className="text-sm font-semibold">Need Help?</h4>
            </div>

            <p className="text-xs text-gray-400 mb-2">
              Our support team is here 24/7 to assist you.
            </p>

            <button className="w-full bg-[#D4AF37] text-[#1A1A1A] py-2 rounded-sm text-sm font-medium hover:scale-[1.05] transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* HIDE SCROLLBAR */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
