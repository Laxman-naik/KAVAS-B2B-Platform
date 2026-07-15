"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationsThunk,
  fetchUnreadCountThunk,
  markAsReadThunk,
  markAllReadThunk,
} from "@/store/slices/notificationSlice";
import NotificationDropdown from "./NotificationDropdown";
import MobileNotificationSheet from "./MobileNotificationSheet";

/**
 * NotificationBell — wired to real API via Redux
 *
 * @param {object} props
 * @param {"buyer"|"vendor"|"admin"} [props.variant="buyer"]
 */
export default function NotificationBell({ variant = "buyer" }) {
  const role = variant === "vendor" ? "vendor" : variant === "admin" ? "admin" : "buyer";

  const dispatch = useDispatch();
  const { items: notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen,    setSheetOpen]    = useState(false);
  const [bellShake,    setBellShake]    = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);
  const [hasFetched,   setHasFetched]   = useState(false);

  const wrapperRef = useRef(null);

  /* ── Initial load: unread count only (light) ──────────────── */
  useEffect(() => {
    dispatch(fetchUnreadCountThunk());
  }, [dispatch]);

  /* ── Shake bell on first unread ──────────────────────────── */
  useEffect(() => {
    if (!loading && unreadCount > 0) {
      setBellShake(true);
      const t = setTimeout(() => setBellShake(false), 900);
      return () => clearTimeout(t);
    }
  }, [loading, unreadCount]);

  /* ── Detect mobile ───────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Click-outside ───────────────────────────────────────── */
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

  /* ── Lazy-load full list when panel opens ────────────────── */
  const loadFull = useCallback(() => {
    if (!hasFetched) {
      dispatch(fetchNotificationsThunk({ limit: 20 }));
      setHasFetched(true);
    }
  }, [dispatch, hasFetched]);

  /* ── Handlers ────────────────────────────────────────────── */
  const handleBellClick = useCallback(() => {
    if (isMobile) {
      setSheetOpen(true);
      setDropdownOpen(false);
    } else {
      setDropdownOpen((v) => !v);
      setSheetOpen(false);
    }
    loadFull();
  }, [isMobile, loadFull]);

  const handleMarkRead = useCallback(
    (id) => dispatch(markAsReadThunk(id)),
    [dispatch]
  );
  const handleMarkAllRead = useCallback(
    () => dispatch(markAllReadThunk()),
    [dispatch]
  );

  /* ── Variant button styles ───────────────────────────────── */
  const buttonStyles = {
    buyer:
      "relative flex items-center justify-center text-white/90 hover:text-white transition-colors duration-200 group",
    vendor:
      "relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] transition-colors duration-200",
    admin:
      "relative flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200",
  };

  const bellIconStyles = {
    buyer:  "h-5 w-5 text-[#D4AF37]",
    vendor: "h-4 w-4 text-gray-700",
    admin:  "w-5 h-5 text-white",
  };

  return (
    <>
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
          <span
            className={[
              "relative flex items-center justify-center",
              bellShake ? "animate-bell-shake" : "",
            ].join(" ")}
          >
            <Bell className={bellIconStyles[variant]} />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span
                key={unreadCount}
                className="animate-badge-pop absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-[#D4AF37] text-[#0B1F3A] text-[9px] font-bold px-1 leading-none border border-white/20 shadow-sm"
                style={{ minWidth: "18px", height: "18px" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

            {/* Ping ring */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 h-[18px] w-[18px] rounded-full bg-[#D4AF37]/40 animate-ping opacity-60 pointer-events-none" />
            )}
          </span>
        </button>

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
