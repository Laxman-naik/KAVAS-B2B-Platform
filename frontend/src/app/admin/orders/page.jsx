"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/slices/orderSlice";

const statusStyles = {
  Fulfilled: "bg-green-500/20 text-green-400",
  Processing: "bg-yellow-500/20 text-yellow-400",
  Disputed: "bg-red-500/20 text-red-400",
};

export default function OrdersTable() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.order);
  console.log(orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase().trim();
    return (
      o.id.toLowerCase().includes(term) ||
      o.buyer.toLowerCase().includes(term) ||
      o.vendor.toLowerCase().includes(term) ||
      o.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-48 md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition cursor-pointer duration-200">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["Order ID", "Buyer", "Vendor", "Value", "Date", "Status",].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <tr key={o.id} className="border-t border-gray-800">
                  <td className="px-6 py-4 text-blue-400">{o.id}</td>
                  <td className="px-6 py-4">{o.buyer_name}</td>
                  <td className="px-6 py-4">{o.vendor_name}</td>

                  <td className="px-6 py-4 text-orange-400">
                    ₹{Number(o.total_amount || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded bg-green-500/20 text-green-400">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  {loading ? "Loading..." : "No orders found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}