"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ChevronRight, X } from "lucide-react";
import NotificationCard from "./NotificationCard";
import SkeletonCard from "./SkeletonCard";

/**
 * MobileNotificationSheet
 * Slides up from the bottom of the screen on mobile viewports.
 *
 * @param {{
 *   open: boolean,
 *   notifications: Array,
 *   loading: boolean,
 *   onMarkRead: (id: string) => void,
 *   onMarkAllRead: () => void,
 *   onClose: () => void,
 * }} props
 */
export default function MobileNotificationSheet({
  open,
  notifications = [],
  loading = false,
  role = "buyer",
  onMarkRead,
  onMarkAllRead,
  onClose,
}) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const preview = notifications.slice(0, 8);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden animate-slide-up-sheet">
        <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-slate-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#0B1F3A]/[0.08] flex items-center justify-center">
                <Bell className="h-4.5 w-4.5 text-[#0B1F3A]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#0B1F3A]">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-[11px] text-slate-400">{unreadCount} unread</p>
                )}
              </div>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0B1F3A] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 rounded-xl px-3 py-1.5 transition-all"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto flex-1 scrollbar-hide">
            {loading ? (
              <div className="p-4 space-y-3">
                <SkeletonCard compact />
                <SkeletonCard compact />
                <SkeletonCard compact />
              </div>
            ) : preview.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Bell className="h-9 w-9 text-slate-300" />
                </div>
                <p className="text-[15px] font-semibold text-[#0B1F3A]">
                  No notifications yet
                </p>
                <p className="text-[13px] text-slate-400 mt-1.5 max-w-xs">
                  You&apos;re all caught up! We&apos;ll notify you when something happens.
                </p>
                <Link
                  href="/allproducts"
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B1F3A] bg-[#D4AF37] hover:bg-[#c9a832] rounded-xl px-5 py-2.5 transition-all"
                >
                  Explore Products
                  <ChevronRight className="h-4 w-4" />
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

          {/* Footer */}
          {!loading && preview.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/80">
              <Link
                href={
                  role === "vendor" ? "/vendor/notifications"
                  : role === "admin" ? "/admin/notifications"
                  : "/notifications"
                }
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#0B1F3A] text-white text-[13px] font-semibold hover:bg-[#0d2647] transition-colors group"
              >
                View all notifications
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
