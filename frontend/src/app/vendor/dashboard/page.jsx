"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  ClipboardList,
  Package,
  Receipt,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useSelector } from "react-redux";

const DashboardBody = () => {
  const vendor = useSelector((state) => state.vendor?.vendor);
  const allOrders = useSelector((state) => state.orders?.orders || []);
  const products = useSelector((state) => state.products?.products || []);
  const payments = useSelector((state) => state.payments?.payments || []);

  const [ordersFilter, setOrdersFilter] = useState("All");

  const vendorId = vendor?._id || vendor?.id;

  const orders = useMemo(() => {
    if (!vendorId) return allOrders;
    return allOrders.filter(
      (order) =>
        order?.vendorId === vendorId ||
        order?.vendor?._id === vendorId ||
        order?.vendor?.id === vendorId
    );
  }, [allOrders, vendorId]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.amount || o.totalAmount || o.total || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;

  const pendingOrders = useMemo(() => {
    return orders.filter((o) => o.status === "Pending").length;
  }, [orders]);

  const cancelledOrders = useMemo(() => {
    return orders.filter((o) => o.status === "Cancelled").length;
  }, [orders]);

  const lowStock = useMemo(() => {
    return products.filter((p) => Number(p.stock || p.quantity || 0) <= 10).length;
  }, [products]);

  const todaysOrdersList = useMemo(() => {
    const today = new Date().toDateString();

    return orders.filter((order) => {
      const orderDate = order.createdAt || order.date || order.updatedAt;
      if (!orderDate) return false;
      return new Date(orderDate).toDateString() === today;
    });
  }, [orders]);

  const todaysOrders = todaysOrdersList.length;

  const todaysRevenue = useMemo(() => {
    return todaysOrdersList.reduce(
      (sum, o) => sum + Number(o.amount || o.totalAmount || o.total || 0),
      0
    );
  }, [todaysOrdersList]);

  const pendingPayments = useMemo(() => {
    return payments
      .filter((p) => p.status === "Pending" || p.status === "Processing")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);

  const statsData = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `Rs. ${totalRevenue.toLocaleString("en-IN")}`,
        change: `${totalOrders} orders`,
        icon: Wallet,
        accent: "bg-[#D4AF37]/15 text-[#D4AF37]",
      },
      {
        title: "Total Orders",
        value: totalOrders,
        change: `${pendingOrders} pending`,
        icon: ShoppingBag,
        accent: "bg-[#0B1F3A]/10 text-[#0B1F3A]",
      },
      {
        title: "Products Listed",
        value: products.length,
        change: `${lowStock} low stock`,
        icon: Package,
        accent: "bg-green-100 text-green-700",
      },
      {
        title: "Cancelled Orders",
        value: cancelledOrders,
        change: `${totalOrders ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%`,
        icon: BarChart3,
        accent: "bg-orange-100 text-orange-700",
      },
    ],
    [totalRevenue, totalOrders, pendingOrders, products.length, lowStock, cancelledOrders]
  );

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
        return "bg-gray-100 text-gray-700";
    }
  };

  const recentOrderTabs = useMemo(
    () => ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    []
  );

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
        title: `Rs. ${pendingPayments.toLocaleString("en-IN")} Pending`,
        desc: "Payment settlement in progress",
        cta: "View Details →",
        href: "/vendor/payments",
        icon: Wallet,
      },
    ],
    [pendingOrders, lowStock, pendingPayments]
  );

  const getOrderId = (order) => {
    return order.orderId || order.id || order._id || "N/A";
  };

  const getBuyerName = (order) => {
    return (
      order.buyer?.name ||
      order.user?.name ||
      order.customerName ||
      order.buyerName ||
      "Buyer"
    );
  };

  const getOrderAmount = (order) => {
    return Number(order.amount || order.totalAmount || order.total || 0);
  };

  const getOrderUnits = (order) => {
    if (order.units) return Number(order.units);
    if (order.quantity) return Number(order.quantity);
    if (Array.isArray(order.items)) {
      return order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    }
    return 0;
  };

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="rounded-sm bg-[#0B1F3A] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold">
            Welcome back, {vendor?.business?.business_name || vendor?.name || "Vendor"}
          </div>

          <div className="mt-1 text-sm text-white/75">
            Here&apos;s what&apos;s happening with your store today.
          </div>

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
            <div className="mt-1 text-lg font-extrabold text-[#D4AF37]">
              Rs. {todaysRevenue.toLocaleString("en-IN")}
            </div>
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
            <div
              key={card.title}
              className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${card.accent}`}>
                  <Icon size={18} />
                </div>

                <span className="rounded-sm bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {card.change}
                </span>
              </div>

              <div className="mt-4 text-xl font-extrabold text-[#0B1F3A]">
                {card.value}
              </div>

              <div className="mt-1 text-xs text-gray-500">{card.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-sm p-5 sm:p-6 shadow-sm">
          <div className="text-sm font-extrabold text-[#0B1F3A]">
            Quick Actions
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((a) => {
              const Icon = a.icon;

              return (
                <a
                  key={a.title}
                  href={a.href}
                  className="flex items-center gap-4 rounded-sm border border-[#E5E5E5] p-4 hover:bg-[#FFF8EC] transition"
                >
                  <div className="h-11 w-11 rounded-sm bg-[#0B1F3A]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#0B1F3A]" />
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {a.title}
                    </div>
                    <div className="text-xs text-gray-500">{a.desc}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-[#0B1F3A]">
              Alerts &amp; Notifications
            </div>
            <div className="text-xs text-gray-500">{alerts.length} active</div>
          </div>

          <div className="mt-4 grid gap-4">
            {alerts.map((x) => {
              const Icon = x.icon;

              return (
                <div
                  key={x.title}
                  className="rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-sm bg-white/70 flex items-center justify-center">
                      <Icon size={18} className="text-[#0B1F3A]" />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-extrabold text-[#0B1F3A]">
                        {x.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{x.desc}</div>
                      <a
                        href={x.href}
                        className="mt-2 inline-block text-xs font-bold text-[#D4AF37] hover:underline"
                      >
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F3A]">
                Recent Orders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Latest B2B orders from buyers
              </p>
            </div>

            <div className="flex flex-wrap items-center rounded-sm bg-[#FFF8EC] p-1">
              {recentOrderTabs.map((t) => {
                const active = ordersFilter === t;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrdersFilter(t)}
                    className={`h-9 rounded-sm px-4 text-sm font-semibold transition ${
                      active
                        ? "bg-white text-[#0B1F3A] shadow-sm"
                        : "text-gray-600 hover:text-[#0B1F3A]"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 divide-y divide-[#E5E5E5] rounded-sm border border-[#E5E5E5] overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-sm bg-[#FFF8EC] border border-[#E5E5E5] flex items-center justify-center">
                  <ClipboardList size={20} className="text-gray-500" />
                </div>
                <div className="mt-3 text-sm font-bold text-[#0B1F3A]">
                  No orders found
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Orders will appear here when buyers place orders.
                </div>
              </div>
            ) : (
              filteredOrders.slice(0, 6).map((o) => (
                <div
                  key={getOrderId(o)}
                  className="flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-[#FFF8EC] transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-sm bg-gray-100 flex items-center justify-center">
                      <ClipboardList size={18} className="text-gray-500" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-base font-extrabold text-[#0B1F3A]">
                          {getOrderId(o)}
                        </div>

                        <span
                          className={`px-3 py-1 rounded-sm text-xs font-semibold ${getStatusStyle(
                            o.status
                          )}`}
                        >
                          {o.status || "Pending"}
                        </span>
                      </div>

                      <div className="mt-1 truncate text-sm text-gray-500">
                        {getBuyerName(o)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold text-[#0B1F3A]">
                      Rs. {getOrderAmount(o).toLocaleString("en-IN")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getOrderUnits(o)} units
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/vendor/orders"
              className="text-sm font-semibold text-[#D4AF37] hover:underline"
            >
              View All Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;