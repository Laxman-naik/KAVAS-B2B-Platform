import {
  BarChart3,
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
  { label: "Orders", href: "/vendor/orders", icon: ShoppingBag },
  { label: "Inventory", href: "/vendor/inventory", icon: Package },
  { label: "Payments", href: "/vendor/payments", icon: Wallet },
  { label: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
  { label: "Settings", href: "/vendor/settings", icon: Settings },
  { label: "Support", href: "/vendor/support", icon: HelpCircle },
];
