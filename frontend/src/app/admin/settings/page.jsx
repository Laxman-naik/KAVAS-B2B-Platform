"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    platformName: "TradeHub B2B",
    currency: "USD ($)",
    commission: "3.5",
    kyc: "Required for all vendors",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    approvals: true,
    overdue: true,
    weekly: false,
    compliance: true,
  });

  const toggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 cursor-pointer transition">
          Save changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card */}
        <div className="bg-[#1f2a44] border border-gray-800 rounded-xl p-6 hover:bg-[#24304d] transition">
          <h2 className="text-lg font-medium mb-4">Platform configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Platform name</label>
              <input
                value={form.platformName}
                onChange={(e) =>
                  setForm({ ...form, platformName: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 rounded-lg bg-[#111827] border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Default currency</label>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Commission rate (%)</label>
              <input
                value={form.commission}
                onChange={(e) =>
                  setForm({ ...form, commission: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">KYC requirement</label>
              <select
                value={form.kyc}
                onChange={(e) => setForm({ ...form, kyc: e.target.value })}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option>Required for all vendors</option>
                <option>Optional</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-[#1f2a44] border border-gray-800 rounded-xl p-6 hover:bg-[#24304d] transition">
          <h2 className="text-lg font-medium mb-4">Notification preferences</h2>

          <div className="space-y-4">
            {[
              { key: "orders", label: "New order alerts" },
              { key: "approvals", label: "Vendor approvals" },
              { key: "overdue", label: "Overdue invoices" },
              { key: "weekly", label: "Weekly report email" },
              { key: "compliance", label: "Compliance flags" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex justify-between items-center border-b border-gray-800 pb-3"
              >
                <span className="text-gray-300">{item.label}</span>

                <button
                  onClick={() => toggle(item.key)}
                  className={`px-3 py-1 rounded-full text-xs transition ${
                    notifications[item.key]
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {notifications[item.key] ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}