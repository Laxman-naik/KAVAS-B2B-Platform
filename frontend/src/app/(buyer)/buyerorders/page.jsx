"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle,
  Hourglass,
  IndianRupee,
  Search,
  Truck,
  XCircle,
  FileText,
  RotateCcw,
  Repeat,
} from "lucide-react";

const ordersData = [
  {
    id: "#KVS-10482",
    date: "20 Mar 2025",
    status: "Delivered",
    total: 49000,
    items: [
      {
        name: "Wireless Earbuds TWS Pro 50pcs",
        seller: "TechLink India",
        qty: 50,
        price: 22500,
        image: "https://images.unsplash.com/photo-1518441902110-3c3c8b5e9d52",
      },
      {
        name: "Cotton T-Shirts Wholesale x100",
        seller: "FabricWorld Co.",
        qty: 100,
        price: 8800,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      },
    ],
  },
  {
    id: "#KVS-10391",
    date: "14 Mar 2025",
    status: "Shipped",
    total: 19600,
    items: [
      {
        name: "SS Bolt Set Stainless Steel Kit",
        seller: "BoltCraft Hardware",
        qty: 20,
        price: 19600,
        image: "https://images.unsplash.com/photo-1581091215367-59ab6b6f3d3c",
      },
    ],
  },
];

const Page = () => {
  const [tab, setTab] = useState("All Orders");
  const [timeFilter, setTimeFilter] = useState("All time");

  // ✅ SINGLE FILTER (tab + time)
  const filteredOrders = ordersData.filter((order) => {
    // TAB FILTER
    const tabMatch =
      tab === "All Orders" || order.status === tab;

    // TIME FILTER
    const orderDate = new Date(order.date);
    const today = new Date();

    let timeMatch = true;

    if (timeFilter === "Last 30 days") {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      timeMatch = orderDate >= past;
    }

    if (timeFilter === "Last 3 months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 3);
      timeMatch = orderDate >= past;
    }

    if (timeFilter === "Last 6 months") {
      const past = new Date();
      past.setMonth(today.getMonth() - 6);
      timeMatch = orderDate >= past;
    }

    return tabMatch && timeMatch;
  });

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="w-full bg-orange-500 text-white flex items-center justify-center text-center px-4 py-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
              <Package size={24} /> My Orders
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1">
              Track, manage, and reorder your bulk purchases
            </p>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-10 py-6">
          <div className="flex flex-wrap gap-4 sm:gap-6 border-b mb-6 text-xs sm:text-sm font-medium">
            {["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 border-b-2 ${
                    tab === t
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Package className="text-blue-500" />
                <div>
                  <p className="text-lg sm:text-xl font-bold">5</p>
                  <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <CheckCircle className="text-green-500" />
                <div>
                  <p className="text-lg sm:text-xl font-bold">2</p>
                  <p className="text-xs sm:text-sm text-gray-500">Delivered</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Hourglass className="text-yellow-500" />
                <div>
                  <p className="text-lg sm:text-xl font-bold">2</p>
                  <p className="text-xs sm:text-sm text-gray-500">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <IndianRupee className="text-orange-500" />
                <div>
                  <p className="text-lg sm:text-xl font-bold">₹1,37,768</p>
                  <p className="text-xs sm:text-sm text-gray-500">Total Spent</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                className="w-full h-10 pl-9 pr-3 rounded-md border border-gray-300 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 hover:border-orange-500 transition"
              />
            </div>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option>All time</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <div>
                      <p className="font-semibold">Order {order.id}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{order.date}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <Badge
                        className={`${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </Badge>
                      <p className="font-semibold text-orange-600">
                        ₹{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border rounded-md p-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover border"
                          />

                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {item.seller} • Qty: {item.qty}
                            </p>
                          </div>
                        </div>

                        <p className="text-orange-600 font-semibold">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                      <Truck size={16} className="mr-1" /> Track Order
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                      <FileText size={16} className="mr-1" /> Invoice
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                      <RotateCcw size={16} className="mr-1" /> Return
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                      <Repeat size={16} className="mr-1" /> Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;