"use client";

import { useMemo, useState } from "react";
import {Search, Eye, Download, Printer, ChevronLeft, ChevronRight, Clock, RefreshCcw,Truck,CheckCircle2, XCircle,} from "lucide-react";

export default function OrdersManagementBody() {
  const ordersData = [
    {
      id: "ORD-2024-8821",
      buyer: "Sharma Industries Pvt Ltd",
      email: "procurement@sharmaind.com",
      buyerLocation: "Mumbai, Maharashtra",
      itemsCount: 2,
      units: 70,
      product: "Industrial Grade Bearings x 500",
      productThumbs: ["📦", "🧰"],
      amount: 124000,
      status: "Pending",
      payment: "Pending",
      paymentMethod: "NEFT",
      date: "2026-04-21",
    },
    {
      id: "ORD-2024-8820",
      buyer: "Mehta Traders",
      email: "orders@mehtatraders.in",
      buyerLocation: "Pune, Maharashtra",
      itemsCount: 1,
      units: 30,
      product: "Stainless Steel Fasteners x 2000",
      productThumbs: ["🧴"],
      amount: 56500,
      status: "Processing",
      payment: "Paid",
      paymentMethod: "UPI",
      date: "2026-04-20",
    },
    {
      id: "ORD-2024-8819",
      buyer: "Gupta Manufacturing Co.",
      email: "purchase@guptamfg.com",
      buyerLocation: "Bengaluru, Karnataka",
      itemsCount: 1,
      units: 20,
      product: "HDPE Pipes 50mm x 1000m",
      productThumbs: ["🛍️"],
      amount: 210000,
      status: "Delivered",
      payment: "Paid",
      paymentMethod: "RTGS",
      date: "2026-04-19",
    },
    {
      id: "ORD-2024-8818",
      buyer: "Patel Enterprises",
      email: "buy@patelent.com",
      buyerLocation: "Ahmedabad, Gujarat",
      itemsCount: 1,
      units: 15,
      product: "Copper Wire 2.5mm x 500kg",
      productThumbs: ["🧴"],
      amount: 88750,
      status: "Cancelled",
      payment: "Refunded",
      paymentMethod: "Cheque",
      date: "2026-04-18",
    },
    {
      id: "ORD-2024-8817",
      buyer: "Rajesh Steel Works",
      email: "admin@rajeshsteel.in",
      buyerLocation: "Surat, Gujarat",
      itemsCount: 2,
      units: 50,
      product: "Hydraulic Seals Kit x 100",
      productThumbs: ["📦", "🧰"],
      amount: 345200,
      status: "Shipped",
      payment: "Paid",
      paymentMethod: "Cheque",
      date: "2026-04-17",
    },
  ];

  const [orders, setOrders] = useState(ordersData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const shipped = orders.filter((o) => o.status === "Shipped").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const deliveredRevenue = orders
      .filter((o) => o.status === "Delivered")
      .reduce((acc, o) => acc + Number(o.amount || 0), 0);
    const needAttention = pending + processing;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      deliveredRevenue,
      needAttention,
    };
  }, [orders]);


  const filteredOrders = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();

    return orders.filter((o) => {
      const matchSearch =
        !q ||
        String(o.id).toLowerCase().includes(q) ||
        String(o.buyer).toLowerCase().includes(q) ||
        String(o.email).toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || o.status === statusFilter;

      const matchPayment = paymentFilter === "All Payments" || o.payment === paymentFilter;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const totalFiltered = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const pagedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage]);

  const rangeText = useMemo(() => {
    if (totalFiltered === 0) return "Showing 0 of 0";
    const start = (safePage - 1) * pageSize + 1;
    const end = Math.min(totalFiltered, safePage * pageSize);
    return `Showing ${start}-${end} of ${totalFiltered}`;
  }, [safePage, totalFiltered]);


  const updateStatus = (id, next) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100";
    }
  };

  const paymentStyle = (payment) => {
    return payment === "Paid"
      ? "bg-green-100 text-green-700"
      : payment === "Refunded"
      ? "bg-gray-200 text-gray-600"
      : "bg-yellow-100 text-yellow-700";
  };

  const tabs = useMemo(
    () => [
      { key: "All", label: "All Orders", icon: null, count: stats.total },
      { key: "Pending", label: "Pending", icon: Clock, count: stats.pending },
      { key: "Processing", label: "Processing", icon: RefreshCcw, count: stats.processing },
      { key: "Shipped", label: "Shipped", icon: Truck, count: stats.shipped },
      { key: "Delivered", label: "Delivered", icon: CheckCircle2, count: stats.delivered },
      { key: "Cancelled", label: "Cancelled", icon: XCircle, count: stats.cancelled },
    ],
    [stats]
  );

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">Orders</div>
          <div className="mt-1 text-sm text-gray-500">
            {stats.total} total orders · {stats.needAttention} need attention
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC] inline-flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            type="button"
            className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC] inline-flex items-center gap-2"
          >
            <Printer size={16} />
            Print All
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#0B1F3A] text-white p-5">
          <div className="text-xs text-white/70">Total Revenue</div>
          <div className="mt-2 text-2xl font-extrabold">₹{Math.round(stats.deliveredRevenue / 100000) / 10}L</div>
          <div className="mt-1 text-xs text-[#D4AF37] font-bold">from {stats.delivered} delivered orders</div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFF7E6] p-5">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
              <Clock size={18} className="text-yellow-700" />
            </div>
            <div className="text-lg font-extrabold text-yellow-700">{stats.pending}</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#0B1F3A]">Pending</div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#EAF3FF] p-5">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
              <RefreshCcw size={18} className="text-blue-700" />
            </div>
            <div className="text-lg font-extrabold text-blue-700">{stats.processing}</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#0B1F3A]">Processing</div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#EEF3FF] p-5">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
              <Truck size={18} className="text-purple-700" />
            </div>
            <div className="text-lg font-extrabold text-purple-700">{stats.shipped}</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#0B1F3A]">Shipped</div>
        </div>
      </div>
      <div className="mt-5 flex flex-col lg:flex-row gap-3">
        <div className="flex items-center bg-white border border-[#E5E5E5] rounded-xl px-3 h-11 w-full lg:w-105">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search order ID, buyer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-2 text-sm outline-none bg-transparent"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 w-full lg:w-47.5 rounded-xl border border-[#E5E5E5] bg-white px-3 text-sm outline-none"
        >
          {[
            "All Payments",
            "Paid",
            "Pending",
            "Refunded",
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-white p-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((t) => {
            const active = statusFilter === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setStatusFilter(t.key);
                  setPage(1);
                }}
                className={`h-10 rounded-xl px-4 text-sm font-extrabold inline-flex items-center gap-2 border transition ${
                  active
                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                    : "bg-white text-[#0B1F3A] border-transparent hover:bg-[#FFF8EC]"
                }`}
              >
                {Icon ? <Icon size={16} /> : <span className="inline-block w-4" />}
                {t.label}
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-extrabold ${active ? "bg-white/15" : "bg-gray-100 text-gray-600"}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 hidden md:block bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FFF8EC]">
            <tr>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">ORDER ID</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">BUYER</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">ITEMS</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">AMOUNT</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">PAYMENT</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">STATUS</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">DATE</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {pagedOrders.map((o) => {
              const actionLabel =
                o.status === "Pending"
                  ? "Mark Processing"
                  : o.status === "Processing"
                  ? "Mark Shipped"
                  : o.status === "Shipped"
                  ? "Mark Delivered"
                  : null;

              const actionNext =
                o.status === "Pending"
                  ? "Processing"
                  : o.status === "Processing"
                  ? "Shipped"
                  : o.status === "Shipped"
                  ? "Delivered"
                  : null;

              return (
                <tr key={o.id} className="border-t border-[#E5E5E5] hover:bg-[#FFF8EC] transition">
                  <td className="p-4">
                    <div className="font-extrabold text-[#0B1F3A]">{o.id}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-extrabold text-[#0B1F3A]">{o.buyer}</div>
                    <div className="mt-1 text-xs text-gray-500">{o.buyerLocation}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {(o.productThumbs || []).slice(0, 2).map((x, idx) => (
                          <div
                            key={idx}
                            className="h-8 w-8 rounded-lg bg-gray-100 border border-white flex items-center justify-center text-sm"
                          >
                            {x}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-sm font-extrabold text-[#0B1F3A]">
                          {o.itemsCount} {o.itemsCount === 1 ? "product" : "products"}
                        </div>
                        <div className="text-xs text-gray-500">{o.units} units</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-extrabold text-[#0B1F3A]">₹{Number(o.amount || 0).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-gray-500">{o.paymentMethod}</div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold ${paymentStyle(o.payment)}`}>
                      <span className={`h-2 w-2 rounded-full ${o.payment === "Paid" ? "bg-green-600" : o.payment === "Refunded" ? "bg-gray-500" : "bg-yellow-600"}`} />
                      {o.payment}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold ${statusStyle(o.status)}`}>
                      {o.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="text-sm font-extrabold text-[#0B1F3A]">{new Date(o.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">09:15 am</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-10 w-10 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                        aria-label="View"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>

                      {actionLabel && actionNext ? (
                        <button
                          type="button"
                          onClick={() => updateStatus(o.id, actionNext)}
                          className="h-10 rounded-xl bg-[#0B1F3A] text-white px-4 text-sm font-extrabold hover:opacity-95"
                        >
                          {actionLabel}
                        </button>
                      ) : (
                        <div className="h-10" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {pagedOrders.map((o) => (
          <div key={o.id} className="bg-white border rounded-lg p-3">
            <div className="flex justify-between">
              <p className="font-medium">{o.id}</p>
              <span className={`text-xs px-2 py-1 rounded ${statusStyle(o.status)}`}>
                {o.status}
              </span>
            </div>

            <p className="text-sm mt-1">{o.buyer}</p>
            <p className="text-xs text-gray-400">{o.product}</p>

            <div className="flex justify-between mt-2 text-sm">
              <span>₹{Number(o.amount || 0).toLocaleString("en-IN")}</span>
              <span className={`px-2 py-1 rounded text-xs ${paymentStyle(o.payment)}`}>
                {o.payment}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-gray-100 py-1 rounded text-sm">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
        <div>{rangeText}</div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className={`h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center ${
              safePage <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-[#FFF8EC]"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
            const p = idx + 1;
            const active = p === safePage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-extrabold border ${
                  active
                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                    : "bg-white text-[#0B1F3A] border-[#E5E5E5] hover:bg-[#FFF8EC]"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className={`h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center ${
              safePage >= totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-[#FFF8EC]"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}



function StatCard({ title, value, color }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition">
      <div className={`w-8 h-8 rounded-md ${color}`} />
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}