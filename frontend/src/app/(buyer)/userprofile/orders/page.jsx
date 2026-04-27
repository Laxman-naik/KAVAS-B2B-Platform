"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Calendar,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Settings2,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";

const COLORS = {
  navy: "#02223B",
  gold: "#D4A24C",
  lightGold: "#F7E8C8",
  border: "#E8E8E8",
  bg: "#F7F7F7",
};

const stats = [
  { id: "all", label: "All Orders", count: 12, icon: PackageCheck, color: "bg-green-50" },
  { id: "pending", label: "Pending", count: 3, icon: Clock3, color: "bg-yellow-50" },
  { id: "processing", label: "Processing", count: 2, icon: Settings2, color: "bg-blue-50" },
  { id: "shipped", label: "Shipped", count: 4, icon: Truck, color: "bg-purple-50" },
  { id: "delivered", label: "Delivered", count: 3, icon: CheckCircle2, color: "bg-green-50" },
  { id: "cancelled", label: "Cancelled", count: 0, icon: XCircle, color: "bg-red-50" },
];

const ordersData = [
  {
    id: "#KAVAS1234",
    items: 3,
    product: "Premium Chair",
    date: "15 May 2024",
    time: "02:30 PM",
    amount: "₹2,450",
    payment: "VISA",
    status: "Delivered",
  },
  {
    id: "#KAVAS1233",
    items: 5,
    product: "Designer Lamp",
    date: "12 May 2024",
    time: "11:15 AM",
    amount: "₹3,120",
    payment: "UPI",
    status: "Shipped",
  },
  {
    id: "#KAVAS1232",
    items: 2,
    product: "Wooden Table",
    date: "09 May 2024",
    time: "09:45 AM",
    amount: "₹1,890",
    payment: "Mastercard",
    status: "Processing",
  },
  {
    id: "#KAVAS1231",
    items: 1,
    product: "Luxury Sofa",
    date: "05 May 2024",
    time: "04:20 PM",
    amount: "₹4,230",
    payment: "RuPay",
    status: "Delivered",
  },
];

const badgeStyles = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-orange-100 text-orange-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersBodyPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [activeCard, setActiveCard] = useState("all");

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.product.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCard =
        activeCard === "all" ||
        order.status.toLowerCase() === activeCard;

      return matchesSearch && matchesStatus && matchesCard;
    });
  }, [search, statusFilter, activeCard]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-[#EAEAEA]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#02223B]">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Home &gt; My Orders</p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-[#02223B] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <Download size={18} />
            Download All Invoices
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-[#EAEAEA] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="mb-2 text-sm font-medium">Search Orders</p>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Order ID, Product..."
                  className="h-12 w-full rounded-xl border border-[#E5E5E5] px-4 pr-11 outline-none focus:border-[#D4A24C]"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Order Status</p>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#E5E5E5] px-4 outline-none focus:border-[#D4A24C]"
              >
                <option>All Status</option>
                <option>Delivered</option>
                <option>Shipped</option>
                <option>Processing</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Date Range</p>
              <div className="relative">
                <input
                  type="date"
                  className="h-12 w-full rounded-xl border border-[#E5E5E5] px-4 outline-none focus:border-[#D4A24C]"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All Status");
                setActiveCard("all");
              }}
              className="mt-7 h-12 rounded-xl border border-[#E5E5E5] font-medium transition-all duration-300 hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {stats.map((item) => {
            const Icon = item.icon;
            const active = activeCard === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveCard(item.id)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  active ? "border-[#D4A24C] shadow-sm" : "border-[#ECECEC]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <h3 className="text-2xl font-bold text-[#02223B]">{item.count}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white">
          <div className="hidden md:grid grid-cols-6 bg-[#FAFAFA] px-6 py-4 text-sm font-semibold text-[#02223B]">
            <p>Order Details</p>
            <p>Date</p>
            <p>Amount</p>
            <p>Status</p>
            <p>Payment</p>
            <p>Action</p>
          </div>

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-1 gap-4 border-t px-4 py-5 transition-all duration-300 hover:bg-[#FCFCFC] md:grid-cols-6 md:px-6"
            >
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <h3 className="font-bold text-[#02223B]">{order.id}</h3>
                <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                  {order.items} Items <ChevronDown size={14} />
                </p>
              </div>

              <div>
                <p className="font-medium">{order.date}</p>
                <p className="text-sm text-gray-500">{order.time}</p>
              </div>

              <div>
                <p className="font-semibold">{order.amount}</p>
                <p className="text-sm text-gray-500">Paid</p>
              </div>

              <div>
                <span className={`rounded-lg px-3 py-1 text-sm font-medium ${badgeStyles[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div>
                <p className="font-medium">Online Payment</p>
                <p className="text-sm text-gray-500">{order.payment}</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-[#D4A24C] hover:text-[#02223B]">
                  View Details
                </button>
                <button className="rounded-xl border p-2 transition-all duration-300 hover:bg-[#02223B] hover:text-white">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {ordersData.length} orders
            </p>

            <div className="flex items-center gap-2">
              <button className="rounded-lg border p-2 hover:bg-gray-50">
                <ChevronLeft size={18} />
              </button>
              <button className="rounded-lg bg-[#02223B] px-4 py-2 text-white">1</button>
              <button className="rounded-lg px-4 py-2">2</button>
              <button className="rounded-lg px-4 py-2">3</button>
              <button className="rounded-lg border p-2 hover:bg-gray-50">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
