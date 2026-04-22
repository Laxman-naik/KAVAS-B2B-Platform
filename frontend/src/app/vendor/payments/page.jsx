"use client";

import { useState } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  Edit,
  Save
} from "lucide-react";

const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

export default function PaymentsPayoutsBody() {
  const [isEditing, setIsEditing] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    name: "Sharma Industries Pvt Ltd",
    account: "****9012",
    IFSC: "SBIN0001234",
    bank: "State Bank of India",
    branch: "Mumbai Main Branch",
    type: "Current Account",
  });

  const transactions = [
    { id: "TXN-2024-4521", order: "ORD-2024-8819", date: "2026-04-19", amount: 210000, commission: 6300, net: 203700, status: "Settled" },
    { id: "TXN-2024-4520", order: "ORD-2024-8817", date: "2026-04-17", amount: 345200, commission: 10356, net: 334844, status: "Settled" },
    { id: "TXN-2024-4519", order: "ORD-2024-8814", date: "2026-04-14", amount: 105000, commission: 3150, net: 101850, status: "Settled" },
    { id: "TXN-2024-4518", order: "ORD-2024-8815", date: "2026-04-15", amount: 141250, commission: 4237, net: 137013, status: "Pending" },
    { id: "TXN-2024-4517", order: "ORD-2024-8820", date: "2026-04-20", amount: 56500, commission: 1695, net: 54805, status: "Pending" },
    { id: "TXN-2024-4514", order: "ORD-2024-8818", date: "2026-04-18", amount: -88750, commission: 0, net: -88750, status: "Refunded" },
  ];

  const payouts = [
    { id: "PAY-2024-089", date: "2026-04-15", amount: 485000, method: "Bank Transfer", ref: "NEFT/SBIN0001234/123456", status: "Processing" },
    { id: "PAY-2024-088", date: "2026-04-08", amount: 520000, method: "Bank Transfer", ref: "NEFT/SBIN0001234/123455", status: "Completed" },
    { id: "PAY-2024-087", date: "2026-04-01", amount: 485000, method: "Bank Transfer", ref: "NEFT/SBIN0001234/123454", status: "Completed" },
    { id: "PAY-2024-086", date: "2026-03-25", amount: 510000, method: "Bank Transfer", ref: "NEFT/SBIN0001234/123453", status: "Completed" },
  ];

  const statusStyle = (s) => {
    if (s === "Settled" || s === "Completed") return "bg-green-100 text-green-600";
    if (s === "Pending" || s === "Processing") return "bg-yellow-100 text-yellow-600";
    if (s === "Refunded") return "bg-red-100 text-red-600";
    return "bg-gray-100";
  };

  const handleChange = (key, value) => {
    setBankDetails(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 md:p-6" style={{ backgroundColor: COLORS.cream }}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Payments & Payouts</h1>
          <p className="text-sm text-gray-500">Track your earnings and manage payouts</p>
        </div>
        <button className="px-4 py-2 text-white rounded-lg cursor-pointer text-sm flex items-center gap-2 hover:opacity-90"
          style={{ backgroundColor: COLORS.gold }}>
          {/* <DollarSign size={16} /> */}
          Download Statement
        </button>
      </div>

      {/* STATS WITH ICONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard icon={<DollarSign size={16} />} label="Total Earnings" value="₹28.48L" bg="bg-green-500" />
        <StatCard icon={<Clock size={16} />} label="Pending Payouts" value="₹4.85L" bg="bg-yellow-500" />
        <StatCard icon={<CheckCircle size={16} />} label="Settled Payouts" value="₹23.63L" bg="bg-blue-500" />
        <StatCard icon={<Calendar size={16} />} label="This Month" value="₹485K" bg="bg-purple-500" />
      </div>

      {/* BANK DETAILS */}
      <div className="bg-white border rounded-xl p-4 mb-4" style={{ borderColor: COLORS.border }}>
        <div className="flex justify-between mb-2">
          <h2 className="font-semibold">Bank Account Details</h2>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm flex items-center gap-1 bg-amber-300 cursor-pointer px-3 border rounded-2xl text-orange-500"
          >
            {isEditing ? <Save size={14} /> : <Edit size={14} />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {Object.entries(bankDetails).map(([key, val]) => (
            <div key={key}>
              <p className="text-xs text-gray-500 capitalize">{key}</p>
              {isEditing ? (
                <input
                  value={val}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="font-medium">{val}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white border rounded-xl mb-4" style={{ borderColor: COLORS.border }}>
        <h2 className="p-4 font-semibold">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Txn ID","Order ID","Date","Amount","Commission","Net Amount","Status"].map(h => (
                  <th key={h} className="p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t,i)=>(
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3 text-blue-500">{t.order}</td>
                  <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
                  <td className={`p-3 ${t.amount<0?"text-red-500":"text-green-600"}`}>
                    ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="p-3">₹{t.commission.toLocaleString()}</td>
                  <td className="p-3 font-medium">₹{t.net.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYOUTS */}
      <div className="bg-white border rounded-xl" style={{ borderColor: COLORS.border }}>
        <h2 className="p-4 font-semibold">Payout History</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Payout ID","Date","Amount","Method","Reference","Status"].map(h => (
                  <th key={h} className="p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((p,i)=>(
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-3">₹{p.amount.toLocaleString()}</td>
                  <td className="p-3">{p.method}</td>
                  <td className="p-3 text-xs text-gray-500">{p.ref}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* STAT CARD */
function StatCard({ icon, label, value, bg }) {
  return (
    <div className="bg-white border p-4 rounded-xl flex items-center gap-3 hover:shadow-md hover:-translate-y-1 transition">
      <div className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}