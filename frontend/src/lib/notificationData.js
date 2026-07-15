import {
  Package,
  Truck,
  Wallet,
  MessageCircle,
  Tag,
  Shield,
  ShoppingBag,
  Star,
  AlertTriangle,
  UserPlus,
  CheckCircle,
  FileText,
  CreditCard,
  Users,
} from "lucide-react";

// ══════════════════════════════════════════════════════════
//  TYPE_CONFIG — per role, keyed by notification `type`
//  Each role has its own set of notification categories.
// ══════════════════════════════════════════════════════════

export const BUYER_TYPE_CONFIG = {
  Orders: {
    Icon: Package, bg: "bg-emerald-50", color: "text-emerald-600",
    badgeBg: "bg-emerald-100", badgeText: "text-emerald-700",
  },
  Payments: {
    Icon: Wallet, bg: "bg-blue-50", color: "text-blue-600",
    badgeBg: "bg-blue-100", badgeText: "text-blue-700",
  },
  Shipping: {
    Icon: Truck, bg: "bg-amber-50", color: "text-amber-600",
    badgeBg: "bg-amber-100", badgeText: "text-amber-700",
  },
  Messages: {
    Icon: MessageCircle, bg: "bg-purple-50", color: "text-purple-600",
    badgeBg: "bg-purple-100", badgeText: "text-purple-700",
  },
  Offers: {
    Icon: Tag, bg: "bg-rose-50", color: "text-rose-600",
    badgeBg: "bg-rose-100", badgeText: "text-rose-700",
  },
  System: {
    Icon: Shield, bg: "bg-slate-50", color: "text-slate-600",
    badgeBg: "bg-slate-100", badgeText: "text-slate-700",
  },
};

export const VENDOR_TYPE_CONFIG = {
  "New Order": {
    Icon: ShoppingBag, bg: "bg-emerald-50", color: "text-emerald-600",
    badgeBg: "bg-emerald-100", badgeText: "text-emerald-700",
  },
  "Payment Received": {
    Icon: CreditCard, bg: "bg-blue-50", color: "text-blue-600",
    badgeBg: "bg-blue-100", badgeText: "text-blue-700",
  },
  "RFQ Request": {
    Icon: FileText, bg: "bg-violet-50", color: "text-violet-600",
    badgeBg: "bg-violet-100", badgeText: "text-violet-700",
  },
  "Buyer Review": {
    Icon: Star, bg: "bg-yellow-50", color: "text-yellow-600",
    badgeBg: "bg-yellow-100", badgeText: "text-yellow-700",
  },
  "Inventory Alert": {
    Icon: AlertTriangle, bg: "bg-orange-50", color: "text-orange-600",
    badgeBg: "bg-orange-100", badgeText: "text-orange-700",
  },
  System: {
    Icon: Shield, bg: "bg-slate-50", color: "text-slate-600",
    badgeBg: "bg-slate-100", badgeText: "text-slate-700",
  },
};

export const ADMIN_TYPE_CONFIG = {
  "New User": {
    Icon: UserPlus, bg: "bg-emerald-50", color: "text-emerald-600",
    badgeBg: "bg-emerald-100", badgeText: "text-emerald-700",
  },
  "Vendor Approval": {
    Icon: CheckCircle, bg: "bg-blue-50", color: "text-blue-600",
    badgeBg: "bg-blue-100", badgeText: "text-blue-700",
  },
  "Order Issue": {
    Icon: Package, bg: "bg-rose-50", color: "text-rose-600",
    badgeBg: "bg-rose-100", badgeText: "text-rose-700",
  },
  Payment: {
    Icon: Wallet, bg: "bg-amber-50", color: "text-amber-600",
    badgeBg: "bg-amber-100", badgeText: "text-amber-700",
  },
  Compliance: {
    Icon: Shield, bg: "bg-purple-50", color: "text-purple-600",
    badgeBg: "bg-purple-100", badgeText: "text-purple-700",
  },
  System: {
    Icon: Shield, bg: "bg-slate-50", color: "text-slate-600",
    badgeBg: "bg-slate-100", badgeText: "text-slate-700",
  },
};

// ── Role → TYPE_CONFIG lookup ──────────────────────────────────
const ROLE_TYPE_CONFIG = {
  buyer:  BUYER_TYPE_CONFIG,
  vendor: VENDOR_TYPE_CONFIG,
  admin:  ADMIN_TYPE_CONFIG,
};

/**
 * Get the icon/color config for a notification's `type` based on role.
 * @param {string} type
 * @param {"buyer"|"vendor"|"admin"} role
 */
export function getTypeConfig(type, role = "buyer") {
  const config = ROLE_TYPE_CONFIG[role] || BUYER_TYPE_CONFIG;
  return config[type] || config["System"] || {
    Icon: Shield, bg: "bg-slate-50", color: "text-slate-600",
    badgeBg: "bg-slate-100", badgeText: "text-slate-700",
  };
}

// ── Filter tabs — every tab name MUST exactly match a `type` value in seed data
export const BUYER_FILTER_TABS  = ["All", "Orders", "Payments", "Shipping", "Messages", "Offers", "System"];
export const VENDOR_FILTER_TABS = ["All", "New Order", "Payment Received", "RFQ Request", "Buyer Review", "Inventory Alert", "System"];
export const ADMIN_FILTER_TABS  = ["All", "New User", "Vendor Approval", "Order Issue", "Payment", "Compliance", "System"];

// Legacy alias (buyer)
export const FILTER_TABS = BUYER_FILTER_TABS;

export const SORT_OPTIONS = ["Latest", "Oldest"];

// ══════════════════════════════════════════════════════════
//  SEED DATA — per role
//  Matches exact DB schema: { id, user_id, title, message, type, is_read, created_at, role }
// ══════════════════════════════════════════════════════════

const NOW = Date.now();
const mins  = (n) => new Date(NOW - n * 60 * 1000).toISOString();
const hours = (n) => new Date(NOW - n * 60 * 60 * 1000).toISOString();
const days  = (n) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();

// ── BUYER notifications ────────────────────────────────────────
export const BUYER_NOTIFICATIONS = [
  {
    id: "b-001", user_id: "seed-buyer-001", role: "buyer",
    type: "Orders",
    title: "Order #KAVAS-7821 confirmed",
    message: "Your bulk order of 500 units of Industrial Steel Pipes has been confirmed and is being processed.",
    is_read: false, created_at: mins(2),
  },
  {
    id: "b-002", user_id: "seed-buyer-001", role: "buyer",
    type: "Shipping",
    title: "Shipment out for delivery",
    message: "Order #KAVAS-7819 is out for delivery. Expected arrival today between 2 PM and 5 PM.",
    is_read: false, created_at: mins(47),
  },
  {
    id: "b-003", user_id: "seed-buyer-001", role: "buyer",
    type: "Payments",
    title: "Payment successful — ₹2,45,000",
    message: "Payment of ₹2,45,000 received for Invoice #INV-20240517. Your account has been credited.",
    is_read: false, created_at: hours(3),
  },
  {
    id: "b-004", user_id: "seed-buyer-001", role: "buyer",
    type: "Messages",
    title: "New message from Rajesh Metals Ltd.",
    message: `Rajesh Metals replied to your RFQ: "We can offer 5% discount on orders above 1000 units."`,
    is_read: false, created_at: hours(5),
  },
  {
    id: "b-005", user_id: "seed-buyer-001", role: "buyer",
    type: "Offers",
    title: "Flash sale: 30% off wholesale textiles",
    message: "Limited-time offer on premium cotton fabrics, linen, and polyester blends. Valid 24 hours.",
    is_read: true, created_at: hours(8),
  },
  {
    id: "b-006", user_id: "seed-buyer-001", role: "buyer",
    type: "Orders",
    title: "Order #KAVAS-7815 delivered",
    message: "Your order has been delivered successfully. Please confirm delivery and rate your experience.",
    is_read: true, created_at: days(1),
  },
  {
    id: "b-007", user_id: "seed-buyer-001", role: "buyer",
    type: "System",
    title: "Account verified successfully",
    message: "Your business account has been verified. You now have access to exclusive B2B pricing.",
    is_read: true, created_at: days(2),
  },
  {
    id: "b-008", user_id: "seed-buyer-001", role: "buyer",
    type: "Payments",
    title: "Payment reminder — Invoice #INV-20240515",
    message: "Invoice #INV-20240515 for ₹88,500 is due in 3 days. Please ensure timely payment.",
    is_read: true, created_at: days(2),
  },
];

// ── VENDOR notifications ───────────────────────────────────────
export const VENDOR_NOTIFICATIONS = [
  {
    id: "v-001", user_id: "seed-vendor-001", role: "vendor",
    type: "New Order",
    title: "New order received — #KAVAS-7821",
    message: "Priya Enterprises placed a new order for 500 units of Industrial Steel Pipes worth ₹2,45,000.",
    is_read: false, created_at: mins(5),
  },
  {
    id: "v-002", user_id: "seed-vendor-001", role: "vendor",
    type: "RFQ Request",
    title: "New RFQ from Sharma Traders",
    message: "Sharma Traders has submitted an RFQ for 2000 units of Stainless Steel Bolts. Please respond within 48 hours.",
    is_read: false, created_at: mins(30),
  },
  {
    id: "v-003", user_id: "seed-vendor-001", role: "vendor",
    type: "Payment Received",
    title: "Payment received — ₹1,80,000",
    message: "Payment of ₹1,80,000 has been credited to your payout account for Order #KAVAS-7815.",
    is_read: false, created_at: hours(2),
  },
  {
    id: "v-004", user_id: "seed-vendor-001", role: "vendor",
    type: "Buyer Review",
    title: "New 5★ review from Arjun Industries",
    message: "Arjun Industries left a 5-star review: \"Excellent quality, timely delivery. Highly recommended!\"",
    is_read: false, created_at: hours(6),
  },
  {
    id: "v-005", user_id: "seed-vendor-001", role: "vendor",
    type: "Inventory Alert",
    title: "Low stock alert — Industrial Steel Pipes",
    message: "Stock for Industrial Steel Pipes (SKU: ISP-1020) is below threshold. Only 45 units remaining.",
    is_read: true, created_at: hours(10),
  },
  {
    id: "v-006", user_id: "seed-vendor-001", role: "vendor",
    type: "New Order",
    title: "Order #KAVAS-7809 delivered successfully",
    message: "Order #KAVAS-7809 has been marked as delivered by the buyer. Payment will be released in 3 business days.",
    is_read: true, created_at: days(1),
  },
  {
    id: "v-007", user_id: "seed-vendor-001", role: "vendor",
    type: "System",
    title: "Store profile approved",
    message: "Your store profile has been reviewed and approved by the Kavas team. Your products are now visible to buyers.",
    is_read: true, created_at: days(3),
  },
  {
    id: "v-008", user_id: "seed-vendor-001", role: "vendor",
    type: "Inventory Alert",
    title: "Inventory sync completed",
    message: "Your product inventory has been synced successfully. 142 products updated across all categories.",
    is_read: true, created_at: days(4),
  },
];

// ── ADMIN notifications ────────────────────────────────────────
export const ADMIN_NOTIFICATIONS = [
  {
    id: "a-001", user_id: "seed-admin-001", role: "admin",
    type: "New User",
    title: "New buyer registered — Priya Enterprises",
    message: "Priya Enterprises (priya@priyaent.com) has registered as a new buyer. Business verification pending.",
    is_read: false, created_at: mins(3),
  },
  {
    id: "a-002", user_id: "seed-admin-001", role: "admin",
    type: "Vendor Approval",
    title: "Vendor approval request — Rajesh Metals Ltd.",
    message: "Rajesh Metals Ltd. has submitted documents for vendor approval. GST certificate and trade license uploaded.",
    is_read: false, created_at: mins(20),
  },
  {
    id: "a-003", user_id: "seed-admin-001", role: "admin",
    type: "Order Issue",
    title: "Order dispute raised — #KAVAS-7790",
    message: "Buyer Sharma Traders raised a dispute for Order #KAVAS-7790 citing wrong product delivered. Admin action required.",
    is_read: false, created_at: hours(1),
  },
  {
    id: "a-004", user_id: "seed-admin-001", role: "admin",
    type: "Payment",
    title: "Payout processed — ₹3,40,000",
    message: "Monthly payout of ₹3,40,000 has been processed for 12 vendors. Transaction ID: TXN-20240717-001.",
    is_read: false, created_at: hours(4),
  },
  {
    id: "a-005", user_id: "seed-admin-001", role: "admin",
    type: "Compliance",
    title: "GST compliance flag — Arjun Industries",
    message: "Arjun Industries has not filed GST returns for the last 2 quarters. Account may require suspension review.",
    is_read: true, created_at: hours(9),
  },
  {
    id: "a-006", user_id: "seed-admin-001", role: "admin",
    type: "New User",
    title: "5 new vendor registrations today",
    message: "5 vendors registered today and are pending document verification. Review in the Vendors panel.",
    is_read: true, created_at: days(1),
  },
  {
    id: "a-007", user_id: "seed-admin-001", role: "admin",
    type: "System",
    title: "Platform health check — All systems operational",
    message: "Scheduled health check completed. All microservices running normally. DB latency: 12ms, API uptime: 99.98%.",
    is_read: true, created_at: days(1),
  },
  {
    id: "a-008", user_id: "seed-admin-001", role: "admin",
    type: "Compliance",
    title: "Monthly compliance report generated",
    message: "Compliance report for June 2024 is ready. 3 flagged accounts, 2 pending resolutions.",
    is_read: true, created_at: days(2),
  },
];

// ── Role → seed data lookup ────────────────────────────────────
export function getSeedNotifications(role = "buyer") {
  if (role === "vendor") return VENDOR_NOTIFICATIONS;
  if (role === "admin")  return ADMIN_NOTIFICATIONS;
  return BUYER_NOTIFICATIONS;
}

// ── Role → filter tabs lookup ──────────────────────────────────
export function getFilterTabs(role = "buyer") {
  if (role === "vendor") return VENDOR_FILTER_TABS;
  if (role === "admin")  return ADMIN_FILTER_TABS;
  return BUYER_FILTER_TABS;
}

// Legacy alias — buyer seed data
export const SEED_NOTIFICATIONS = BUYER_NOTIFICATIONS;

// ══════════════════════════════════════════════════════════
//  UTILITY — relative time formatter
// ══════════════════════════════════════════════════════════
export function formatRelativeTime(isoString) {
  const diffMs  = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60)  return "Just now";
  if (diffMin < 60)  return `${diffMin} min ago`;
  if (diffHr  < 24)  return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7)   return `${diffDay} days ago`;
  return new Date(isoString).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
