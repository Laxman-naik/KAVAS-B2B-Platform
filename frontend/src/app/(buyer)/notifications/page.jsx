
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Mail,
  Trash2,
  MoreVertical,
  Filter,
  CheckCheck,
  Package,
  Tag,
  User,
  Shield,
  Settings,
} from "lucide-react";

const seedNotifications = [
  {
    id: "#KAVAS1234",
    category: "Orders",
    title: "Your order #KAVAS1234 has been delivered",
    description: "Your order has been delivered successfully on 17 May 2024.",
    date: "17 May 2024",
    time: "02:20 PM",
    status: "Read",
    icon: "order",
  },
  {
    id: "#KAVAS1235",
    category: "Orders",
    title: "Your order #KAVAS1235 is out for delivery",
    description: "Your order is out for delivery and will reach you soon.",
    date: "17 May 2024",
    time: "09:30 AM",
    status: "Unread",
    icon: "delivery",
  },
  {
    id: "#OFFER-30",
    category: "Offers",
    title: "Special wholesale offer just for you!",
    description: "Get up to 30% OFF on selected products. Shop now and save more.",
    date: "16 May 2024",
    time: "11:15 AM",
    status: "Unread",
    icon: "offer",
  },
  {
    id: "#PAY-1232",
    category: "Account",
    title: "Payment received for order #KAVAS1232",
    description: "We have received your payment for order #KAVAS1232.",
    date: "15 May 2024",
    time: "04:45 PM",
    status: "Read",
    icon: "account",
  },
  {
    id: "#WELCOME",
    category: "System",
    title: "Welcome to KAVAS Wholesale Hub",
    description: "Thank you for registering with us. Start exploring thousands of products.",
    date: "14 May 2024",
    time: "10:20 AM",
    status: "Read",
    icon: "system",
  },
  {
    id: "#PRICE-DROP",
    category: "Offers",
    title: "Price drop alert!",
    description: "The product in your wishlist is now available at a lower price.",
    date: "13 May 2024",
    time: "08:10 AM",
    status: "Read",
    icon: "offer",
  },
];

const tabItems = [
  { key: "All", label: "All" },
  { key: "Orders", label: "Orders" },
  { key: "Offers", label: "Offers" },
  { key: "Account", label: "Account" },
  { key: "System", label: "System" },
];

const statusOptions = ["All Status", "Unread", "Read", "Deleted"];

const getIconMeta = (kind) => {
  switch (kind) {
    case "order":
      return { Icon: Package, bg: "bg-green-50", color: "text-green-700" };
    case "delivery":
      return { Icon: Package, bg: "bg-orange-50", color: "text-orange-700" };
    case "offer":
      return { Icon: Tag, bg: "bg-purple-50", color: "text-purple-700" };
    case "account":
      return { Icon: User, bg: "bg-red-50", color: "text-red-700" };
    case "system":
    default:
      return { Icon: Shield, bg: "bg-blue-50", color: "text-blue-700" };
  }
};

export default function Page() {
  const [tab, setTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [items, setItems] = useState(seedNotifications);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const fullName = authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName).trim().split(/\s+/).filter(Boolean);
  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || rest.join(" "),
    email: authUser?.email || "",
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const counts = useMemo(() => {
    const total = items.length;
    const unread = items.filter((n) => n.status === "Unread").length;
    const read = items.filter((n) => n.status === "Read").length;
    const deleted = items.filter((n) => n.status === "Deleted").length;
    return { total, unread, read, deleted };
  }, [items]);

  const tabCounts = useMemo(() => {
    const byCategory = tabItems.reduce((acc, t) => {
      acc[t.key] = 0;
      return acc;
    }, {});

    items.forEach((n) => {
      byCategory.All += 1;
      if (byCategory[n.category] !== undefined) byCategory[n.category] += 1;
    });

    return byCategory;
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const tabOk = tab === "All" || n.category === tab;
      const statusOk = statusFilter === "All Status" || n.status === statusFilter;
      return tabOk && statusOk;
    });
  }, [items, statusFilter, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => (n.status === "Unread" ? { ...n, status: "Read" } : n)));
  };

  const clearAll = () => {
    setItems([]);
    setPage(1);
  };

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">Notifications</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Link href="/" className="hover:underline">Home</Link>
                  <ChevronRight size={14} />
                  <span className="text-[#0B1F3A]">Notifications</span>
                </div>
              </div>

              <Button
                type="button"
                className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95 w-full sm:w-auto"
                onClick={markAllAsRead}
              >
                <CheckCheck size={16} className="mr-2" /> Mark All as Read
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-orange-50 flex items-center justify-center">
                    <Bell className="text-orange-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Notifications</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{counts.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-blue-50 flex items-center justify-center">
                    <Mail className="text-blue-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unread</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{counts.unread}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="text-green-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Read</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{counts.read}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-red-50 flex items-center justify-center">
                    <Trash2 className="text-red-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deleted</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{counts.deleted}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-0">
                <div className="border-b border-[#E5E5E5] px-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 py-3">
                    <div className="flex flex-wrap gap-3">
                      {tabItems.map((t) => {
                        const active = tab === t.key;
                        const count = tabCounts[t.key] ?? 0;
                        return (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => {
                              setTab(t.key);
                              setPage(1);
                            }}
                            className={
                              active
                                ? "text-[#0B1F3A] font-semibold border-b-2 border-[#D4AF37] pb-2 text-sm"
                                : "text-gray-500 hover:text-[#0B1F3A] pb-2 text-sm"
                            }
                          >
                            {t.label} ({count})
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                          }}
                          className="h-9 rounded-sm border border-[#E5E5E5] bg-white pl-8 pr-8 text-sm w-full sm:w-[160px]"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-sm border-[#E5E5E5] h-9"
                        onClick={clearAll}
                      >
                        <Trash2 size={14} className="mr-2" /> Clear All
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="divide-y">
                  {pagedItems.map((n) => {
                    const { Icon, bg, color } = getIconMeta(n.icon);
                    const dotColor = n.status === "Unread" ? "bg-blue-600" : "bg-gray-300";
                    const badgeClass =
                      n.status === "Unread"
                        ? "bg-blue-100 text-blue-700"
                        : n.status === "Read"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700";

                    return (
                      <div key={n.id} className="px-4 py-4">
                        <div className="grid grid-cols-[12px_44px_1fr] sm:grid-cols-[12px_44px_1fr_120px_90px_90px_44px] gap-3 items-start">
                          <div className="pt-2">
                            <span className={`block h-2 w-2 rounded-full ${dotColor}`} />
                          </div>

                          <div className={`h-10 w-10 rounded-sm ${bg} flex items-center justify-center`}>
                            <Icon className={color} size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0B1F3A] truncate">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.description}</p>
                          </div>

                          <div className="hidden sm:block text-xs text-gray-600">{n.date}</div>
                          <div className="hidden sm:block text-xs text-gray-500">{n.time}</div>

                          <div className="hidden sm:flex justify-end">
                            <Badge className={badgeClass}>{n.status}</Badge>
                          </div>

                          <div className="hidden sm:flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-sm"
                              title="More"
                            >
                              <MoreVertical size={16} className="text-gray-500" />
                            </Button>
                          </div>
                        </div>

                        <div className="sm:hidden mt-3 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {n.date} • {n.time}
                          </div>
                          <Badge
                            className={
                              n.status === "Unread"
                                ? "bg-blue-100 text-blue-700"
                                : n.status === "Read"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {n.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}

                  {pagedItems.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-gray-500">
                      No notifications found.
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-[#E5E5E5] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} notifications
                  </p>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-sm border-[#E5E5E5] h-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>

                    {[1, 2, 3, 4, 5].map((p) => (
                      <Button
                        key={p}
                        type="button"
                        variant={p === page ? "default" : "outline"}
                        className={
                          p === page
                            ? "rounded-sm h-8 bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/95"
                            : "rounded-sm border-[#E5E5E5] h-8"
                        }
                        onClick={() => setPage(Math.min(totalPages, p))}
                      >
                        {p}
                      </Button>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-sm border-[#E5E5E5] h-8"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

