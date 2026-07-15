"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import NotificationCard from "@/components/ui/notifications/NotificationCard";
import SkeletonCard from "@/components/ui/notifications/SkeletonCard";
import {
  ADMIN_NOTIFICATIONS,
  ADMIN_FILTER_TABS,
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
} from "lucide-react";

const PAGE_SIZE = 8;

// ── Stats Card ─────────────────────────────────────────────────
function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#13263C] rounded-2xl border border-white/10 p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl ${color} bg-opacity-20 flex items-center justify-center shrink-0`}>
        <Icon className={`h-5 w-5 ${color.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
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
          ? "bg-[#D4AF37] text-[#0B1F3A] shadow-md"
          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {label}
      {count > 0 && (
        <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full text-[10px] font-bold ${active ? "bg-[#0B1F3A]/20 text-[#0B1F3A]" : "bg-white/10 text-gray-300"}`}>
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
        className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              ? "bg-[#D4AF37] text-[#0B1F3A] shadow-md"
              : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10",
          ].join(" ")}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Bell className="h-9 w-9 text-[#D4AF37]/50" />
      </div>
      <h3 className="text-lg font-bold text-white">No notifications</h3>
      <p className="text-sm text-gray-400 mt-2 max-w-xs">
        All caught up. Notifications will appear here when there is activity.
      </p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function AdminNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setNotifications(ADMIN_NOTIFICATIONS);
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
    ADMIN_FILTER_TABS.forEach((tab) => {
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
    <div className="min-h-screen bg-[#0B1626] text-white p-4 sm:p-6 lg:p-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
            {!loading && counts.unread > 0 && (
              <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[11px] font-bold animate-badge-pop">
                {counts.unread}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">Platform-wide alerts and system events</p>
        </div>

        {!loading && counts.unread > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a832] text-[#0B1F3A] text-sm font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 shadow-md shrink-0"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Stats ── */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Bell}       label="Total"    value={counts.total}          color="bg-amber-500" />
          <StatsCard icon={Bell}       label="Unread"   value={counts.unread}         color="bg-blue-500" />
          <StatsCard icon={CheckCheck} label="Read"     value={counts.read}           color="bg-emerald-500" />
          <StatsCard icon={Trash2}     label="Filtered" value={filtered.length}       color="bg-slate-500" />
        </div>
      )}

      {/* ── Filter + Search Bar ── */}
      <div className="bg-[#13263C] rounded-2xl border border-white/10 p-4 mb-6">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full h-10 pl-10 pr-4 bg-[#0B1626] border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200"
            />
          </div>
          <div className="relative shrink-0">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-10 pl-9 pr-8 bg-[#0B1626] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37] transition-all duration-200 cursor-pointer appearance-none w-full sm:w-auto"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o} className="bg-[#0B1626]">{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {ADMIN_FILTER_TABS.map((tab) => (
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

      {/* ── Notification List ── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : pagedItems.length === 0 ? (
        <div className="bg-[#13263C] rounded-2xl border border-white/10">
          <EmptyState />
        </div>
      ) : (
        <div className="space-y-3">
          {pagedItems.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              role="admin"
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}

          <p className="text-center text-xs text-gray-500 pt-2">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}
