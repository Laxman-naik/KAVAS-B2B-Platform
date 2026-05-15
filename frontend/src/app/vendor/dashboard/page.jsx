"use client";

import React, { useState, useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, BarChart3, Bell, ClipboardList, Package, Receipt, ShoppingBag, Wallet,} from "lucide-react";
import { useSelector } from "react-redux";

const DashboardBody = () => {
  const vendor = useSelector((state) => state.vendor.vendor);
  const [ordersFilter, setOrdersFilter] = useState("All");

  const orders = [
    {
      id: "ORD-2024-881",
      buyer: "Sharma Industries",
      amount: 124000,
      units: 50,
      date: "21 Apr 2026",
      status: "Pending",
    },
    {
      id: "ORD-2024-882",
      buyer: "Mehta Traders",
      amount: 56500,
      units: 30,
      date: "20 Apr 2026",
      status: "Shipped",
    },
    {
      id: "ORD-2024-883",
      buyer: "Gupta Manufacturing",
      amount: 210000,
      units: 20,
      date: "19 Apr 2026",
      status: "Delivered",
    },
    {
      id: "ORD-2024-884",
      buyer: "Patel Enterprises",
      amount: 88750,
      units: 15,
      date: "18 Apr 2026",
      status: "Processing",
    },
    {
      id: "ORD-2024-885",
      buyer: "Metro Grocers Pvt Ltd",
      amount: 14950,
      units: 50,
      date: "18 Apr 2026",
      status: "Pending",
    },
    {
      id: "ORD-2024-886",
      buyer: "Green Earth Traders",
      amount: 22500,
      units: 15,
      date: "17 Apr 2026",
      status: "Processing",
    },
    {
      id: "ORD-2024-887",
      buyer: "Wellness Hub",
      amount: 8750,
      units: 25,
      date: "16 Apr 2026",
      status: "Shipped",
    },
  ];

 

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  const lowStock = 12;

  const todaysRevenue = 24500;
  const todaysOrders = 7;

  const statsData = [
    {
      title: "Total Revenue",
      value: "Rs. 28.48L",
      change: "+12.5%",
      icon: Wallet,
      accent: "bg-[#D4AF37]/15 text-[#D4AF37]",
    },
    {
      title: "Total Orders",
      value: "847",
      change: "+8.3%",
      icon: ShoppingBag,
      accent: "bg-[#0B1F3A]/10 text-[#0B1F3A]",
    },
    {
      title: "Products Listed",
      value: "156",
      change: "+4",
      icon: Package,
      accent: "bg-green-100 text-green-700",
    },
    {
      title: "Cancelled Orders",
      value: "20",
      change: "+3.8%",
      icon: BarChart3,
      accent: "bg-orange-100 text-orange-700",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-orange-100 text-orange-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  const recentOrderTabs = useMemo(() => ["All", "Pending", "Processing", "Shipped"], []);

  const filteredOrders = useMemo(() => {
    if (ordersFilter === "All") return orders;
    return orders.filter((o) => o.status === ordersFilter);
  }, [orders, ordersFilter]);

  const quickActions = useMemo(
    () => [
      {
        title: "Add Product",
        desc: "List a new product",
        icon: Package,
        href: "/vendor/products",
      },
      {
        title: "View Orders",
        desc: "Manage pending orders",
        icon: Receipt,
        href: "/vendor/orders",
      },
      {
        title: "Update Inventory",
        desc: "Check stock levels",
        icon: ClipboardList,
        href: "/vendor/inventory",
      },
      {
        title: "View Payments",
        desc: "Payment settlements",
        icon: Wallet,
        href: "/vendor/payments",
      },
    ],
    []
  );

  const alerts = useMemo(
    () => [
      {
        title: `${pendingOrders} Pending Orders`,
        desc: "Orders awaiting processing",
        cta: "Process Now →",
        href: "/vendor/orders",
        icon: Receipt,
      },
      {
        title: `${lowStock} Low Stock Items`,
        desc: "Products running below threshold",
        cta: "Restock →",
        href: "/vendor/inventory",
        icon: ClipboardList,
      },
      {
        title: `Rs. ${totalRevenue.toLocaleString("en-IN")} Pending`,
        desc: "Payment settlement in progress",
        cta: "View Details →",
        href: "/vendor/payments",
        icon: Wallet,
      },
    ],
    [lowStock, pendingOrders, totalRevenue]
  );

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">

      <div className="rounded-2xl bg-[#0B1F3A] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold">Welcome back, {vendor?.business?.business_name}</div>
          <div className="mt-1 text-sm text-white/75">Here&apos;s what&apos;s happening with your store today.</div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Store Active
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              Gold Supplier
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              KYC Verified
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <div className="text-xs text-white/70">Today&apos;s Revenue</div>
            <div className="mt-1 text-lg font-extrabold text-[#D4AF37]">Rs. {todaysRevenue.toLocaleString("en-IN")}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/70">Today&apos;s Orders</div>
            <div className="mt-1 text-lg font-extrabold">{todaysOrders}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${card.accent}`}>
                  <Icon size={18} />
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {card.change}
                </span>
              </div>
              <div className="mt-4 text-xl font-extrabold text-[#0B1F3A]">{card.value}</div>
              <div className="mt-1 text-xs text-gray-500">{card.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-extrabold text-[#0B1F3A]">Quick Actions</div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <a
                  key={a.title}
                  href={a.href}
                  className="flex items-center gap-4 rounded-xl border border-[#E5E5E5] p-4 hover:bg-[#FFF8EC] transition"
                >
                  <div className="h-11 w-11 rounded-xl bg-[#0B1F3A]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#0B1F3A]" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.desc}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-[#0B1F3A]">Alerts &amp; Notifications</div>
            <div className="text-xs text-gray-500">{alerts.length} active</div>
          </div>

          <div className="mt-4 grid gap-4">
            {alerts.map((x) => {
              const Icon = x.icon;
              return (
                <div key={x.title} className="rounded-xl border border-[#E5E5E5] bg-[#FFF8EC] p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                      <Icon size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-extrabold text-[#0B1F3A]">{x.title}</div>
                      <div className="mt-1 text-xs text-gray-500">{x.desc}</div>
                      <a href={x.href} className="mt-2 inline-block text-xs font-bold text-[#D4AF37] hover:underline">
                        {x.cta}
                      </a>
                    </div>
                    <Bell size={14} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    
        <div className="lg:col-span-2 max-w-full bg-white border border-[#E5E5E5] rounded-sm shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0B1F3A]">Recent Orders</h3>
                <p className="mt-1 text-sm text-gray-500">Latest B2B orders from buyers</p>
              </div>

              <div className="flex items-center rounded-xl bg-[#FFF8EC] p-1">
                {recentOrderTabs.map((t) => {
                  const active = ordersFilter === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOrdersFilter(t)}
                      className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${
                        active ? "bg-white text-[#0B1F3A] shadow-sm" : "text-gray-600 hover:text-[#0B1F3A]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 divide-y divide-[#E5E5E5] rounded-2xl border border-[#E5E5E5] overflow-hidden">
              {filteredOrders.slice(0, 6).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-[#FFF8EC] transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <ClipboardList size={18} className="text-gray-500" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-base font-extrabold text-[#0B1F3A]">{o.id}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(o.status)}`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-sm text-gray-500">{o.buyer}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold text-[#0B1F3A]">
                      Rs. {Number(o.amount || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="text-sm text-gray-500">{Number(o.units || 0)} units</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <a href="/vendor/orders" className="text-sm font-semibold text-[#D4AF37] hover:underline">
                View All Orders
              </a>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DashboardBody;