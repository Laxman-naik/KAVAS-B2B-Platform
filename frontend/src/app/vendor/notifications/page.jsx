"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import NotificationCard from "@/components/ui/notifications/NotificationCard";
import SkeletonCard from "@/components/ui/notifications/SkeletonCard";
import {
  VENDOR_NOTIFICATIONS,
  VENDOR_FILTER_TABS,
  SORT_OPTIONS,
} from "@/lib/notificationData";
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  ChevronRight,
  ChevronLeft,
  SortAsc,
  Package,
} from "lucide-react";

const PAGE_SIZE = 8;

// ── Stats Card ─────────────────────────────────────────────────
function StatsCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className={`h-11 w-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-[22px] font-bold text-[#0B1F3A] leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ── Filter Tab ─────────────────────────────────────────────────
function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200",
        active
          ? "bg-[#0B1F3A] text-white shadow-md"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#0B1F3A]",
      ].join(" ")}
    >
      {label}
      {count > 0 && (
        <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-[10px] font-bold ${active ? "bg-[#D4AF37] text-[#0B1F3A]" : "bg-slate-300 text-slate-600"}`}>
          {count > 9 ? "9+" : count}
        </span>
      )}
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

// ── Empty State ────────────────────────────────────────────────
function EmptyState({ onExplore }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#0B1F3A]/[0.06] to-[#D4AF37]/[0.08] flex items-center justify-center border border-[#D4AF37]/20">
          <Bell className="h-9 w-9 text-[#D4AF37]/60" />
        </div>
        <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#D4AF37]/15 border-2 border-white flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#D4AF37]">0</span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-[#0B1F3A]">No notifications yet</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-xs">
        You&apos;re all caught up. We&apos;ll notify you when orders come in or buyers send messages.
      </p>
      <button
        onClick={onExplore}
        className="mt-5 inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a832] text-[#0B1F3A] font-semibold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md hover:-translate-y-0.5"
      >
        <Package className="h-4 w-4" />
        View Orders
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function VendorNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setNotifications(VENDOR_NOTIFICATIONS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [activeTab, sortOrder, debouncedQuery]);

  const counts = useMemo(() => ({
    total:  notifications.length,
    unread: notifications.filter((n) => !n.is_read).length,
    read:   notifications.filter((n) => n.is_read).length,
  }), [notifications]);

  const tabCounts = useMemo(() => {
    const all = { All: notifications.length };
    VENDOR_FILTER_TABS.forEach((tab) => {
      if (tab !== "All") all[tab] = notifications.filter((n) => n.type === tab).length;
    });
    return all;
  }, [notifications]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab !== "All") list = list.filter((n) => n.type === activeTab);
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      sortOrder === "Latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );
  }, [notifications, activeTab, debouncedQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleMarkRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  }, []);

  const handleDelete = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 sm:p-6 lg:p-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#0B1F3A]">Notifications</h1>
            {!loading && counts.unread > 0 && (
              <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[11px] font-bold animate-badge-pop">
                {counts.unread}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">Order updates, buyer messages, and platform alerts</p>
        </div>

        {!loading && counts.unread > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 bg-[#0B1F3A] hover:bg-[#0d2647] text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md shrink-0"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Stats ── */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Bell}       label="Total"    value={counts.total}    iconBg="bg-amber-50"   iconColor="text-amber-600" />
          <StatsCard icon={Bell}       label="Unread"   value={counts.unread}   iconBg="bg-blue-50"    iconColor="text-blue-600" />
          <StatsCard icon={CheckCheck} label="Read"     value={counts.read}     iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatsCard icon={Trash2}     label="Filtered" value={filtered.length} iconBg="bg-slate-50"   iconColor="text-slate-500" />
        </div>
      )}

      {/* ── Filter + Search Bar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
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
              {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {VENDOR_FILTER_TABS.map((tab) => (
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

      {/* ── List ── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : pagedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <EmptyState onExplore={() => router.push("/vendor/orders")} />
        </div>
      ) : (
        <div className="space-y-3">
          {pagedItems.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              role="vendor"
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
          <p className="text-center text-xs text-slate-400 pt-2">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}
