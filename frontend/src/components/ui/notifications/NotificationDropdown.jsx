"use client";

import React from "react";
import Link from "next/link";
import { Bell, CheckCheck, ChevronRight, X } from "lucide-react";
import NotificationCard from "./NotificationCard";
import SkeletonCard from "./SkeletonCard";

/**
 * NotificationDropdown
 *
 * @param {{
 *   notifications: Array,
 *   loading: boolean,
 *   onMarkRead: (id: string) => void,
 *   onMarkAllRead: () => void,
 *   onClose: () => void,
 * }} props
 */
export default function NotificationDropdown({
  notifications = [],
  loading = false,
  role = "buyer",
  onMarkRead,
  onMarkAllRead,
  onClose,
}) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const preview = notifications.slice(0, 6);

  return (
    <div className="animate-slide-down absolute right-0 top-full mt-3 w-[min(420px,calc(100vw-1.5rem))] bg-white rounded-2xl border border-slate-200/80 shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#0B1F3A] to-[#0d2647]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white leading-none">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-[11px] text-white/60 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[10px] font-bold animate-badge-pop">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70 hover:text-[#D4AF37] bg-white/10 hover:bg-white/15 rounded-lg px-2.5 py-1.5 transition-all duration-200"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Notification List ── */}
      <div className="overflow-y-auto max-h-[420px] scrollbar-hide">
        {loading ? (
          <>
            <SkeletonCard compact />
            <SkeletonCard compact />
            <SkeletonCard compact />
            <SkeletonCard compact />
          </>
        ) : preview.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            {/* Animated empty bell illustration */}
            <div className="relative mb-4">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Bell className="h-7 w-7 text-slate-300" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#D4AF37]/20 border-2 border-white flex items-center justify-center">
                <span className="text-[9px] font-bold text-[#D4AF37]">0</span>
              </div>
            </div>
            <p className="text-[14px] font-semibold text-[#0B1F3A]">No notifications yet</p>
            <p className="text-[12px] text-slate-400 mt-1">
              You&apos;re all caught up. We&apos;ll notify you when something happens.
            </p>
            <Link
              href="/allproducts"
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B1F3A] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 rounded-xl px-4 py-2 transition-all duration-200"
            >
              Explore Products
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {preview.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                role={role}
                compact
                onMarkRead={onMarkRead}
                onClick={onClose}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      {!loading && preview.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/80">
          <Link
            href={
              role === "vendor" ? "/vendor/notifications"
              : role === "admin" ? "/admin/notifications"
              : "/notifications"
            }
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3.5 text-[13px] font-semibold text-[#0B1F3A] hover:text-[#D4AF37] transition-colors group"
          >
            View all notifications
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
