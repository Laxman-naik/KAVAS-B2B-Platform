"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadAdminThunk } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function DashboardBody() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, initialized } = useSelector((state) => state.auth);

useEffect(() => {
  dispatch(loadAdminThunk());
}, [dispatch]);

useEffect(() => {
  if (initialized && !isAuthenticated) {
    router.push("/admin/login");
  }
}, [initialized, isAuthenticated]);
  return (
    <div className="space-y-6  p-15 min-h-screen text-white  bg-[#0b1220]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {[
          {
            title: "TOTAL GMV",
            value: "₹2.4M",
            change: "↑ 12.4% vs last month",
            color: "text-green-400",
            border: "border-l-4 border-orange-400",
          },
          {
            title: "ACTIVE ORDERS",
            value: "384",
            change: "↑ 8 new today",
            color: "text-green-400",
          },
          {
            title: "ACTIVE VENDORS",
            value: "128",
            change: "↓ 2 this week",
            color: "text-red-400",
            border: "border-l-4 border-green-400",
          },
          {
            title: "PENDING RFQS",
            value: "47",
            change: "↑ 5 new",
            color: "text-green-400",
            border: "border-l-4 border-orange-400",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-[#13263C] ${card.border || "border border-gray-700"
              } rounded-xl p-5 transition duration-300 transform hover:scale-105 hover:shadow-xl`}
          >
            <p className="text-xs text-gray-400">{card.title}</p>
            <h2 className="text-2xl font-bold mt-2">{card.value}</h2>
            <p className={`text-xs mt-1 ${card.color}`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#13263C] border border-gray-700 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent orders</h2>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
              ● Live
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-400 text-xs">
              <tr className="text-left">
                <th className="pb-2">ORDER</th>
                <th>BUYER</th>
                <th>VALUE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody className="space-y-2">
              {[
                {
                  id: "#10482",
                  buyer: "Acme Corp",
                  value: "₹14,200",
                  status: "Fulfilled",
                  color: "bg-green-500/20 text-green-400",
                },
                {
                  id: "#10481",
                  buyer: "BuildMart",
                  value: "₹8,750",
                  status: "Pending",
                  color: "bg-yellow-500/20 text-yellow-400",
                },
                {
                  id: "#10480",
                  buyer: "TechSource",
                  value: "₹31,000",
                  status: "Fulfilled",
                  color: "bg-green-500/20 text-green-400",
                },
                {
                  id: "#10479",
                  buyer: "GlobeTraders",
                  value: "₹5,200",
                  status: "Disputed",
                  color: "bg-red-500/20 text-red-400",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-[#1B2A45] transition"
                >
                  <td className="py-3">{row.id}</td>
                  <td>{row.buyer}</td>
                  <td>{row.value}</td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${row.color}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== Activity Feed ===== */}
        <div className="bg-[#13263C] border border-gray-700 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Activity feed</h2>

          <div className="space-y-4 text-sm">
            {[
              {
                text: "Vendor NovaParts Ltd approved",
                time: "2 min ago",
                color: "bg-yellow-400",
              },
              {
                text: "RFQ #892 matched to 3 vendors",
                time: "18 min ago",
                color: "bg-yellow-400",
              },
              {
                text: "Invoice #4421 marked paid",
                time: "1 hr ago",
                color: "bg-yellow-400",
              },
              {
                text: "Buyer Acme Corp → Premium",
                time: "3 hr ago",
                color: "bg-yellow-400",
              },
              {
                text: "Compliance flag on Vendor #204",
                time: "5 hr ago",
                color: "bg-red-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-start hover:bg-[#1B2A45] p-2 rounded-lg transition"
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${item.color}`}
                ></div>

                <div>
                  <p>{item.text}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}