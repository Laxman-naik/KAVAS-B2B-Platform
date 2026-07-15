import {
  BarChart3,
  Bell,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Wallet,
} from "lucide-react";

export const vendorNavItems = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "RFQ Requests", href: "/vendor/vendorrfq", icon: ShoppingBag },
  { label: "My Quotes", href: "/vendor/vendorquots", icon: ShoppingBag },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingBag },
  { label: "Inventory", href: "/vendor/inventory", icon: Package },
  { label: "Payments", href: "/vendor/payments", icon: Wallet },
  { label: "Notifications", href: "/vendor/notifications", icon: Bell },
  // { label: "Analytics", href: "/vendor/analytics", icon: BarChart3 }
  { label: "Settings", href: "/vendor/settings", icon: Settings },
  { label: "Support", href: "/vendor/support", icon: HelpCircle },
];
