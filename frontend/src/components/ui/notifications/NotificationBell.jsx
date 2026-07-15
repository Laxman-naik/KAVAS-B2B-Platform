"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import MobileNotificationSheet from "./MobileNotificationSheet";
import { getSeedNotifications } from "@/lib/notificationData";

/**
 * NotificationBell
 *
 * @param {object} props
 * @param {"buyer"|"vendor"|"admin"} [props.variant="buyer"]
 *   - "buyer"  → gold bell, white text label "Alerts", dark navbar bg assumed
 *   - "vendor" → square bordered button (light header)
 *   - "admin"  → plain icon, dark header
 */
export default function NotificationBell({ variant = "buyer" }) {
  // variant → role mapping
  const role = variant === "vendor" ? "vendor" : variant === "admin" ? "admin" : "buyer";

  // ── State ──────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(() => getSeedNotifications(role));
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bellShake, setBellShake] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const wrapperRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // ── Simulate async load ────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Shake bell once on mount when there are unread ────────
  useEffect(() => {
    if (!loading && unreadCount > 0) {
      setBellShake(true);
      const t = setTimeout(() => setBellShake(false), 900);
      return () => clearTimeout(t);
    }
  }, [loading, unreadCount]);

  // ── Detect mobile viewport ─────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ── Click-outside to close dropdown ───────────────────────
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  // ── Handlers ──────────────────────────────────────────────
  const handleBellClick = useCallback(() => {
    if (isMobile) {
      setSheetOpen(true);
      setDropdownOpen(false);
    } else {
      setDropdownOpen((v) => !v);
      setSheetOpen(false);
    }
  }, [isMobile]);

  const handleMarkRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  }, []);

  // ── Variant-specific button styles ────────────────────────
  const buttonStyles = {
    // Buyer navbar: minimal, shows "Alerts" label below
    buyer:
      "relative flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 group",
    // Vendor header: square bordered box, light bg
    vendor:
      "relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] transition-colors duration-200",
    // Admin header: plain icon on dark bg
    admin:
      "relative flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200",
  };

  const bellIconStyles = {
    buyer: "h-5 w-5 text-[#D4AF37]",
    vendor: "h-4 w-4 text-gray-700",
    admin:  "w-5 h-5 text-white",
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* Bell button + dropdown wrapper */}
      <div
        ref={wrapperRef}
        className={
          variant === "buyer"
            ? "relative flex flex-col items-center gap-1"
            : "relative"
        }
      >
        <button
          type="button"
          onClick={handleBellClick}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          aria-expanded={dropdownOpen}
          className={buttonStyles[variant]}
        >
          {/* Bell icon with shake animation */}
          <span
            className={[
              "relative flex items-center justify-center",
              bellShake ? "animate-bell-shake" : "",
            ].join(" ")}
          >
            <Bell className={bellIconStyles[variant]} />

            {/* Unread badge */}
            {!loading && unreadCount > 0 && (
              <span
                key={unreadCount}
                className="animate-badge-pop absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[9px] font-bold px-1 leading-none border border-white/20 shadow-sm"
                style={{ minWidth: "18px", height: "18px" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

            {/* Ping ring when unread */}
            {!loading && unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 h-[18px] w-[18px] rounded-full bg-[#D4AF37]/40 animate-ping opacity-60 pointer-events-none" />
            )}
          </span>
        </button>

        {/* "Alerts" label — only for buyer variant */}
        {variant === "buyer" && (
          <span className="text-[11px] text-white/90">Alerts</span>
        )}

        {dropdownOpen && !isMobile && (
          <NotificationDropdown
            notifications={notifications}
            loading={loading}
            role={role}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>

      {/* Mobile bottom sheet */}
      <MobileNotificationSheet
        open={sheetOpen}
        notifications={notifications}
        loading={loading}
        role={role}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
