"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Eye,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCcw,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// import { fetchOrders, updateOrderStatus } from "@/store/slices/orderSlice";
import { fetchVendorOrders, updateOrderStatus } from "@/store/slices/orderSlice";

export default function OrdersManagementBody() {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    dispatch(fetchVendorOrders());
  }, [dispatch]);

  const statusLabel = (status) => {
    if (!status) return "Pending";
    return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      needAttention: pending + processing,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((o) => {
      const paymentValue = o.payment_status || o.payment || "pending";

      const matchSearch =
        !q ||
        String(o.id).toLowerCase().includes(q) ||
        String(o.buyer_name || "").toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || o.status === statusFilter;

      const matchPayment =
        paymentFilter === "All Payments" ||
        String(paymentValue).toLowerCase() === paymentFilter.toLowerCase();

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

  const statusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const paymentStyle = (payment) => {
    const value = String(payment || "pending").toLowerCase();

    if (value === "paid") return "bg-green-50 text-green-700 border-green-200";
    if (value === "refunded") return "bg-gray-50 text-gray-700 border-gray-200";

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const tabs = useMemo(
    () => [
      { key: "All", label: "All Orders", icon: null, count: stats.total },
      { key: "pending", label: "Pending", icon: Clock, count: stats.pending },
      {
        key: "processing",
        label: "Processing",
        icon: RefreshCcw,
        count: stats.processing,
      },
      { key: "shipped", label: "Shipped", icon: Truck, count: stats.shipped },
      {
        key: "delivered",
        label: "Delivered",
        icon: CheckCircle2,
        count: stats.delivered,
      },
      {
        key: "cancelled",
        label: "Cancelled",
        icon: XCircle,
        count: stats.cancelled,
      },
    ],
    [stats]
  );

  const statCards = [
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      className: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Processing",
      value: stats.processing,
      icon: RefreshCcw,
      className: "bg-blue-50 text-blue-700",
    },
    {
      title: "Shipped",
      value: stats.shipped,
      icon: Truck,
      className: "bg-purple-50 text-purple-700",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 border border-[#E5E5E5] bg-white p-5 shadow-sm rounded-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0B1F3A]">
              Orders Management
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {stats.total} total orders · {stats.needAttention} need attention
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 border border-[#E5E5E5] bg-white px-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#FFF8EC] rounded-sm"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 border border-[#E5E5E5] bg-white px-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#FFF8EC] rounded-sm"
            >
              <Printer size={16} />
              Print All
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-4 border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-semibold text-[#0B1F3A] rounded-sm">
            Loading orders...
          </div>
        )}

        {error && (
          <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 rounded-sm">
            {error}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="border border-[#E5E5E5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md rounded-sm"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-sm ${card.className}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="text-2xl font-extrabold text-[#0B1F3A]">
                    {card.value}
                  </div>
                </div>

                <p className="mt-4 text-sm font-bold text-gray-600">
                  {card.title}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 border border-[#E5E5E5] bg-white p-4 shadow-sm rounded-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex h-11 w-full items-center border border-[#E5E5E5] bg-[#FAFAFA] px-3 rounded-sm lg:max-w-md">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search order ID, buyer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent px-3 text-sm font-medium text-[#0B1F3A] outline-none placeholder:text-gray-400"
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full border border-[#E5E5E5] bg-[#FAFAFA] px-3 text-sm font-semibold text-[#0B1F3A] outline-none rounded-sm lg:w-48"
            >
              {["All Payments", "paid", "pending", "refunded"].map((x) => (
                <option key={x} value={x}>
                  {x === "All Payments" ? x : statusLabel(x)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2">
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
                    className={`inline-flex h-10 items-center gap-2 border px-4 text-sm font-extrabold transition rounded-sm ${active
                        ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                        : "border-[#E5E5E5] bg-white text-[#0B1F3A] hover:bg-[#FFF8EC]"
                      }`}
                  >
                    {Icon ? <Icon size={16} /> : <span className="w-4" />}
                    {t.label}
                    <span
                      className={`ml-1 px-2 py-0.5 text-xs font-extrabold rounded-sm ${active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 hidden overflow-hidden border border-[#E5E5E5] bg-white shadow-sm rounded-sm md:block">
          <table className="w-full text-sm">
            <thead className="bg-[#0B1F3A]">
              <tr>
                {[
                  "ORDER ID",
                  "BUYER",
                  "ITEMS",
                  "AMOUNT",
                  "PAYMENT",
                  "STATUS",
                  "DATE",
                  "ACTIONS",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left text-xs font-extrabold tracking-wide text-white"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pagedOrders.map((o) => {
                const paymentValue = o.payment_status || o.payment || "pending";

                const actionLabel =
                  o.status === "pending"
                    ? "Mark Processing"
                    : o.status === "processing"
                      ? "Mark Shipped"
                      : o.status === "shipped"
                        ? "Mark Delivered"
                        : null;

                const actionNext =
                  o.status === "pending"
                    ? "processing"
                    : o.status === "processing"
                      ? "shipped"
                      : o.status === "shipped"
                        ? "delivered"
                        : null;

                return (
                  <tr
                    key={o.id}
                    className="border-t border-[#E5E5E5] transition hover:bg-[#FFF8EC]"
                  >
                    <td className="p-4">
                      <p className="font-extrabold text-[#0B1F3A]">{o.id}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-[#0B1F3A]">
                        {o.buyer_name || "Unknown Buyer"}
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        Buyer ID: {o.user_id || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center border border-[#E5E5E5] bg-[#FAFAFA] text-sm rounded-sm">
                          📦
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0B1F3A]">
                            Order Items
                          </p>
                          <p className="text-xs font-medium text-gray-500">
                            View details
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-[#0B1F3A]">
                        ₹{Number(o.total_amount || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        {o.payment_method || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center border px-3 py-1 text-xs font-extrabold rounded-sm ${paymentStyle(
                          paymentValue
                        )}`}
                      >
                        {statusLabel(paymentValue)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center border px-3 py-1 text-xs font-extrabold rounded-sm ${statusStyle(
                          o.status
                        )}`}
                      >
                        {statusLabel(o.status)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-[#0B1F3A]">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleDateString()
                          : "-"}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : ""}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center border border-[#E5E5E5] bg-white transition hover:bg-[#FFF8EC] rounded-sm"
                          aria-label="View"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>

                        {actionLabel && actionNext ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (actionNext === "shipped") {
                                const awb = prompt("Enter AWB Number");
                                if (!awb) return;

                                const courier = prompt("Enter Courier Name");
                                if (!courier) return;

                                const estimated_delivery = prompt("Enter Estimated Delivery Date YYYY-MM-DD");

                                dispatch(
                                  updateOrderStatus({
                                    orderId: o.id,
                                    status: actionNext,
                                    awb,
                                    courier,
                                    estimated_delivery,
                                  })
                                );
                              } else {
                                dispatch(
                                  updateOrderStatus({
                                    orderId: o.id,
                                    status: actionNext,
                                  })
                                );
                              }
                            }}
                            className="h-10 bg-[#0B1F3A] px-4 text-sm font-extrabold text-white transition hover:bg-[#102A4C] rounded-sm"
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

              {pagedOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <p className="text-sm font-bold text-[#0B1F3A]">
                      No orders found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Try changing search or filter options.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 space-y-3 md:hidden">
          {pagedOrders.map((o) => {
            const paymentValue = o.payment_status || o.payment || "pending";

            return (
              <div
                key={o.id}
                className="border border-[#E5E5E5] bg-white p-4 shadow-sm rounded-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-[#0B1F3A]">{o.id}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      {o.buyer_name || "Unknown Buyer"}
                    </p>
                  </div>

                  <span
                    className={`border px-2 py-1 text-xs font-extrabold rounded-sm ${statusStyle(
                      o.status
                    )}`}
                  >
                    {statusLabel(o.status)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Amount</p>
                    <p className="font-extrabold text-[#0B1F3A]">
                      ₹{Number(o.total_amount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`border px-2 py-1 text-xs font-extrabold rounded-sm ${paymentStyle(
                      paymentValue
                    )}`}
                  >
                    {statusLabel(paymentValue)}
                  </span>
                </div>

                <button className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 border border-[#E5E5E5] bg-[#FAFAFA] text-sm font-extrabold text-[#0B1F3A] rounded-sm">
                  <Eye size={15} />
                  View Details
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold">{rangeText}</div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className={`inline-flex h-9 w-9 items-center justify-center border border-[#E5E5E5] bg-white rounded-sm ${safePage <= 1
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-[#FFF8EC]"
                }`}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages })
              .slice(0, 5)
              .map((_, idx) => {
                const p = idx + 1;
                const active = p === safePage;

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 border text-sm font-extrabold rounded-sm ${active
                        ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                        : "border-[#E5E5E5] bg-white text-[#0B1F3A] hover:bg-[#FFF8EC]"
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
              className={`inline-flex h-9 w-9 items-center justify-center border border-[#E5E5E5] bg-white rounded-sm ${safePage >= totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-[#FFF8EC]"
                }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}