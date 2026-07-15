"use client";

import React, { useCallback, useRef } from "react";
import Link from "next/link";
import { MoreVertical, CheckCheck, Trash2, ExternalLink } from "lucide-react";
import { getTypeConfig, formatRelativeTime } from "@/lib/notificationData";

/**
 * NotificationCard
 * Matches DB schema: { id, user_id, role, type, title, message, is_read, created_at }
 *
 * @param {{ notification, role?, compact?, onMarkRead?, onDelete?, onClick? }} props
 *   role:    "buyer" | "vendor" | "admin" — determines icon/color from TYPE_CONFIG
 *   compact: true  → compact dropdown card
 *            false → full-page card with action menu (default)
 */
export default function NotificationCard({
  notification,
  role,
  compact = false,
  onMarkRead,
  onDelete,
  onClick,
}) {
  // infer role from notification.role if not passed explicitly
  const resolvedRole = role || notification.role || "buyer";
  const { id, type, title, message, is_read, created_at } = notification;
  const { Icon, bg, color } = getTypeConfig(type, resolvedRole);
  const isUnread = !is_read;

  // ── Ripple effect ──────────────────────────────────────────
  const cardRef = useRef(null);
  const handleRipple = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const rect = card.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    card.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }, []);

  // ── Action menu state ──────────────────────────────────────
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = useRef(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // ── Compact dropdown card ─────────────────────────────────
  if (compact) {
    return (
      <div
        ref={cardRef}
        onClick={(e) => {
          handleRipple(e);
          onClick?.(notification);
        }}
        className={[
          "ripple-container group relative flex items-start gap-3 px-4 py-3.5",
          "border-b border-slate-100 last:border-0 cursor-pointer",
          "transition-all duration-200",
          isUnread
            ? "bg-[#0B1F3A]/[0.025] hover:bg-[#0B1F3A]/[0.05]"
            : "bg-white hover:bg-slate-50",
        ].join(" ")}
      >
        {/* Unread dot */}
        {isUnread && (
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-badge-pop" />
        )}

        {/* Type icon */}
        <div
          className={`shrink-0 h-9 w-9 rounded-xl ${bg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className={`h-4 w-4 ${color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-[13px] font-semibold leading-snug truncate ${
              isUnread ? "text-[#0B1F3A]" : "text-slate-500"
            }`}
          >
            {title}
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
            {message}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {formatRelativeTime(created_at)}
          </p>
        </div>
      </div>
    );
  }

  // ── Full-page card ─────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        if (!menuRef.current?.contains(e.target)) {
          handleRipple(e);
          onClick?.(notification);
        }
      }}
      className={[
        "ripple-container group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:-translate-y-0.5",
        isUnread
          ? "border-l-4 border-l-[#D4AF37] border-t-slate-100 border-r-slate-100 border-b-slate-100 shadow-sm bg-gradient-to-r from-[#D4AF37]/[0.04] to-white"
          : "border-slate-100 shadow-sm opacity-85 hover:opacity-100",
      ].join(" ")}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Large type icon */}
          <div
            className={`shrink-0 h-12 w-12 rounded-2xl ${bg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm`}
          >
            <Icon className={`h-5 w-5 ${color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row: type badge + action menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    getTypeConfig(type, resolvedRole).badgeBg
                  } ${getTypeConfig(type, resolvedRole).badgeText}`}
                >
                  {type}
                </span>
                {isUnread && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/20 text-[#8B6914]">
                    New
                  </span>
                )}
              </div>

              {/* Action menu */}
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((v) => !v);
                  }}
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-8 w-44 bg-white rounded-xl border border-slate-100 shadow-xl z-20 py-1 overflow-hidden animate-slide-down">
                    {isUnread && onMarkRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkRead(id);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <CheckCheck className="h-4 w-4 text-emerald-500" />
                        Mark as read
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(id);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <p
              className={`mt-2 text-[14px] font-semibold leading-snug ${
                isUnread ? "text-[#0B1F3A]" : "text-slate-500"
              }`}
            >
              {title}
            </p>

            {/* Message */}
            <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {message}
            </p>

            {/* Footer: timestamp */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-[12px] text-slate-400 font-medium">
                {formatRelativeTime(created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
