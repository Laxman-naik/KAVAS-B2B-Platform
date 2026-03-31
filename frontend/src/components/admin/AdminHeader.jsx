// import React from 'react'

// const AdminHeader = () => {
//   return (
//     <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-6"></header>
//   )
// }

// export default AdminHeader

"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

const AdminHeader = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        {/* Role Switch */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button className="px-3 py-1 text-sm rounded-md text-gray-600">
            Admin
          </button>
          <button className="px-3 py-1 text-sm rounded-md text-gray-600">
            Buyer
          </button>
          <button className="px-3 py-1 text-sm rounded-md bg-orange-500 text-white">
            Vendor
          </button>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex-1 max-w-xl mx-6">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search buyers, vendors, orders..."
            className="bg-transparent outline-none px-2 w-full text-sm"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Add User */}
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
          + Add User
        </button>

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
            A
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;