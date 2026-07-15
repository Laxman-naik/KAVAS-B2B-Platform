"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import {
  fetchNotificationsThunk,
  markAsReadThunk,
  markAllReadThunk,
  deleteNotificationThunk,
  deleteAllNotificationsThunk,
} from "@/store/slices/notificationSlice";
import NotificationCard from "@/components/ui/notifications/NotificationCard";
import SkeletonCard from "@/components/ui/notifications/SkeletonCard";
import { BUYER_FILTER_TABS, SORT_OPTIONS } from "@/lib/notificationData";
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  ChevronRight,
  ChevronLeft,
  SortAsc,
  Package,
  RefreshCw,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────────
const PAGE_SIZE = 6;

// ── Empty State ────────────────────────────────────────────────
function EmptyState({ onExplore }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#0B1F3A]/[0.06] to-[#D4AF37]/[0.08] flex items-center justify-center shadow-inner border border-[#D4AF37]/20">
          <Bell className="h-10 w-10 text-[#D4AF37]/60" />
        </div>
        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#D4AF37]/15 border-2 border-white flex items-center justify-center shadow-sm">
          <span className="text-[11px] font-bold text-[#D4AF37]">0</span>
        </div>
        <div className="absolute inset-0 rounded-3xl border-2 border-[#D4AF37]/10 scale-110 animate-pulse" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0B1F3A]">No notifications yet</h3>
      <p className="text-[14px] text-slate-500 mt-2 max-w-xs leading-relaxed">
        You&apos;re all caught up! We&apos;ll notify you when orders update, payments arrive, or
        new offers are available.
      </p>
      <button
        onClick={onExplore}
        className="mt-6 inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a832] text-[#0B1F3A] font-semibold text-[14px] rounded-2xl px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <Package className="h-4 w-4" />
        Explore Products
      </button>
    </div>
  );
}

// ── Stats Card ─────────────────────────────────────────────────
function StatsCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className={`h-11 w-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-[12px] text-slate-500 font-medium">{label}</p>
          <p className="text-[22px] font-bold text-[#0B1F3A] leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ── Filter Tab ─────────────────────────────────────────────────
function FilterTab({ label, count, active, onClick }) {
  const isEmpty = count === 0;
  return (
    <button
      type="button"
      onClick={isEmpty ? undefined : onClick}
      aria-pressed={active}
      className={[
        "relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200",
        active
          ? "bg-[#0B1F3A] text-white shadow-md"
          : isEmpty
          ? "bg-slate-50 text-slate-300 cursor-not-allowed"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#0B1F3A] cursor-pointer",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-[10px] font-bold",
          active
            ? "bg-[#D4AF37] text-[#0B1F3A]"
            : isEmpty
            ? "bg-slate-100 text-slate-300"
            : "bg-slate-300 text-slate-600",
        ].join(" ")}
      >
        {count > 9 ? "9+" : count}
      </span>
    </button>
  );
}

// ── Pagination ─────────────────────────────────────────────────
function Pagination({ page, totalPages, onPage }) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          className={[
            "h-9 w-9 flex items-center justify-center rounded-xl text-[13px] font-semibold transition-all duration-200",
            p === page
              ? "bg-[#0B1F3A] text-white shadow-md"
              : "border border-slate-200 text-slate-600 hover:bg-slate-100",
          ].join(" ")}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function NotificationsPage() {
  const dispatch  = useDispatch();
  const router    = useRouter();
  const authUser  = useSelector((state) => state.auth.user);
  const { items: notifications, pagination, loading, error } = useSelector(
    (state) => state.notifications
  );

  /* ── User info ────────────────────────────────────────────── */
  const fullName = authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName).trim().split(/\s+/).filter(Boolean);
  const user = {
    firstName: authUser?.firstName || firstName,
    lastName:  authUser?.lastName  || rest.join(" "),
    email:     authUser?.email || "",
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  /* ── Filters ─────────────────────────────────────────────── */
  const [activeTab,      setActiveTab]      = useState("All");
  const [sortOrder,      setSortOrder]      = useState("Latest");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page,           setPage]           = useState(1);

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* Reset page on filter change */
  useEffect(() => { setPage(1); }, [activeTab, sortOrder, debouncedQuery]);

  /* ── Fetch from API whenever filters change ──────────────── */
  useEffect(() => {
    const params = { limit: 50 }; // fetch a large batch; client-side pagination below
    if (activeTab !== "All") params.type = activeTab;
    dispatch(fetchNotificationsThunk(params));
  }, [dispatch, activeTab]);

  /* ── Computed counts ─────────────────────────────────────── */
  const counts = useMemo(() => ({
    total:  notifications.length,
    unread: notifications.filter((n) => !n.is_read).length,
    read:   notifications.filter((n) =>  n.is_read).length,
  }), [notifications]);

  const tabCounts = useMemo(() => {
    const all = { All: notifications.length };
    BUYER_FILTER_TABS.forEach((tab) => {
      if (tab !== "All") all[tab] = notifications.filter((n) => n.type === tab).length;
    });
    return all;
  }, [notifications]);

  /* ── Client-side filter + sort ───────────────────────────── */
  const filtered = useMemo(() => {
    let list = notifications;
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      sortOrder === "Latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );
  }, [notifications, debouncedQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Actions ─────────────────────────────────────────────── */
  const handleMarkRead    = useCallback((id) => dispatch(markAsReadThunk(id)),     [dispatch]);
  const handleDelete      = useCallback((id) => dispatch(deleteNotificationThunk(id)), [dispatch]);
  const handleMarkAllRead = useCallback(()   => dispatch(markAllReadThunk()),       [dispatch]);
  const handleDeleteAll   = useCallback(()   => dispatch(deleteAllNotificationsThunk()), [dispatch]);
  const handleRefresh     = useCallback(()   => dispatch(fetchNotificationsThunk({ limit: 50 })), [dispatch]);

  const searchRef = useRef(null);

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="mx-auto bg-white border-b border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 self-start bg-white border-r border-slate-100">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          {/* Main content */}
          <div className="bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 min-h-screen">

            {/* ── Page Header ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <nav className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-2">
                  <Link href="/" className="hover:text-[#0B1F3A] transition-colors">Home</Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-[#0B1F3A] font-medium">Notifications</span>
                </nav>

                <div className="flex items-center gap-3">
                  <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0B1F3A] leading-tight">
                    Notifications
                  </h1>
                  {!loading && counts.unread > 0 && (
                    <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[11px] font-bold animate-badge-pop">
                      {counts.unread}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-slate-500 mt-1">
                  Stay updated on orders, payments, shipping, and offers.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {/* Refresh */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                {/* Mark all read */}
                {!loading && counts.unread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-2 bg-[#0B1F3A] hover:bg-[#0d2647] text-white text-[13px] font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                  </button>
                )}

                {/* Delete all */}
                {!loading && notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-semibold rounded-xl px-4 py-2.5 transition-all duration-200 border border-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* ── Error banner ─── */}
            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 text-[13px] text-red-700">
                <span>⚠️ {error}</span>
                <button
                  onClick={handleRefresh}
                  className="ml-auto text-[12px] font-semibold underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ── Stats Grid ─── */}
            {!loading && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard icon={Bell}       label="Total"    value={counts.total}   iconBg="bg-amber-50"   iconColor="text-amber-600" />
                <StatsCard icon={Bell}       label="Unread"   value={counts.unread}  iconBg="bg-blue-50"    iconColor="text-blue-600" />
                <StatsCard icon={CheckCheck} label="Read"     value={counts.read}    iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                <StatsCard icon={Trash2}     label="Filtered" value={filtered.length} iconBg="bg-slate-50"  iconColor="text-slate-500" />
              </div>
            )}

            {/* ── Filter + Search Bar ─── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div ref={searchRef} className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-[#0B1F3A] placeholder:text-slate-400 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
                  />
                </div>

                <div className="relative shrink-0">
                  <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="h-10 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-[#0B1F3A] outline-none focus:border-[#D4AF37] transition-all duration-200 cursor-pointer appearance-none w-full sm:w-auto"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {BUYER_FILTER_TABS.map((tab) => (
                  <FilterTab
                    key={tab}
                    label={tab}
                    count={tabCounts[tab] || 0}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
            </div>

            {/* ── Notification List ─── */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : pagedItems.length === 0 ? (
              activeTab !== "All" ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    <Bell className="h-7 w-7 text-slate-300" />
                  </div>
                  <p className="text-[15px] font-bold text-[#0B1F3A]">
                    No <span className="text-[#D4AF37]">{activeTab}</span> notifications
                  </p>
                  <p className="text-[13px] text-slate-400 mt-1.5 max-w-xs">
                    You have no notifications in this category yet. They&apos;ll appear here when something happens.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("All")}
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B1F3A] bg-[#0B1F3A]/[0.06] hover:bg-[#0B1F3A]/[0.1] rounded-xl px-4 py-2 transition-all"
                  >
                    ← View all notifications
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <EmptyState onExplore={() => router.push("/allproducts")} />
                </div>
              )
            ) : (
              <div className="space-y-3">
                {pagedItems.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    role="buyer"
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}

                {totalPages > 1 && (
                  <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                )}

                <p className="text-center text-[12px] text-slate-400 pt-2">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} notifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
