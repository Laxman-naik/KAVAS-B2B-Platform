"use client";
import React from "react";
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  IndianRupee,
  Home,
  Building2,
  Plus,
} from "lucide-react";

export default function ProfileBody() {
  return (
    <div className="p-4 md:p-6 bg-[#FFF8EC] min-h-screen text-[#1A1A1A]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-gray-500">Home &gt; My Profile</p>
        </div>
        <button className="bg-[#0B1F3A] text-white px-4 py-2 rounded-lg hover:bg-[#1c355e] transition">
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition">
        <div className="w-24 h-24 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white text-3xl">
          <User />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">Rahul Kumar</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile Number</p>
            <p className="font-medium">+91 6302259849</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">rahul@gmail.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">May 15, 2024</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          {
            title: "Total Orders",
            value: 12,
            icon: ShoppingBag,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            title: "Pending Orders",
            value: 3,
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-100",
          },
          {
            title: "Delivered Orders",
            value: 9,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            title: "Total Spent",
            value: "₹25,450",
            icon: IndianRupee,
            color: "text-[#D4AF37]",
            bg: "bg-[#D4AF37]/20",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white border border-[#E5E5E5]  rounded-xl p-5 hover:shadow-md transition"
            >
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-md ${item.bg}`}>
                  <Icon className={`${item.color}`} size={20} />
                </div>
                <p className="text-sm text-gray-500">{item.title}</p>
              </div>

              {/* VALUE */}
              <p className="text-xl text-center font-semibold">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl mt-6 p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <button className="text-[#D4AF37] hover:underline text-sm">
            View All Orders
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Order ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: "#KAVAS1234",
                date: "15 May 2024",
                amount: "₹2,450",
                status: "Delivered",
              },
              {
                id: "#KAVAS1233",
                date: "12 May 2024",
                amount: "₹3,120",
                status: "Shipped",
              },
              {
                id: "#KAVAS1232",
                date: "09 May 2024",
                amount: "₹1,890",
                status: "Processing",
              },
              {
                id: "#KAVAS1231",
                date: "05 May 2024",
                amount: "₹4,230",
                status: "Delivered",
              },
            ].map((order, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-[#FFF8EC] transition"
              >
                <td className="py-3">{order.id}</td>
                <td>{order.date}</td>
                <td>{order.amount}</td>
                <td>
                  <span className="px-2 py-1 rounded text-xs bg-[#D4AF37]/20 text-[#1A1A1A]">
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="text-[#0B1F3A] hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Addresses */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Saved Addresses</h2>
          <button className="text-[#D4AF37] hover:underline text-sm">
            Manage Addresses
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Home */}
          <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <Home className="text-green-600" size={18} />
              <p className="font-medium">Home</p>
            </div>
            <p className="text-sm text-gray-500">
              123, Green Hills Colony, Hyderabad, Telangana - 500001
            </p>
          </div>

          {/* Office */}
          <div className="bg-white border border-[#E5E5E5] p-4 rounded-xl hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-blue-600" size={18} />
              <p className="font-medium">Office</p>
            </div>
            <p className="text-sm text-gray-500">
              45, Business Park, Hitech City, Hyderabad - 500081
            </p>
          </div>

          {/* Add Address */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E5E5] rounded-xl hover:bg-[#FFF8EC] cursor-pointer transition">
            <Plus className="mb-2 text-[#D4AF37]" />
            <span className="text-sm">Add New Address</span>
          </div>
        </div>
      </div>
    </div>
  );
}
