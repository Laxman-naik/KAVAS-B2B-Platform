"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Coins,
  Search,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

const initialRequests = [
  {
    id: "PAYOUT-2024-022",
    vendor: "Srikanth",
    amount: 25000,
    date: "12 May 2024",
    bank: "SBI •••• 4023",
    account: "623015794218",
    remarks: "Monthly payout request",
    status: "Pending",
  },
  {
    id: "PAYOUT-2024-020",
    vendor: "Ravi Kumar",
    amount: 35000,
    date: "11 May 2024",
    bank: "HDFC •••• 5678",
    account: "987654321098",
    remarks: "Weekly settlement",
    status: "Pending",
  },
  {
    id: "PAYOUT-2024-019",
    vendor: "Priya Sharma",
    amount: 20000,
    date: "10 May 2024",
    bank: "ICICI •••• 1234",
    account: "456789123456",
    remarks: "Approved payout",
    status: "Approved",
  },
  {
    id: "PAYOUT-2024-018",
    vendor: "Meena Patel",
    amount: 15000,
    date: "08 May 2024",
    bank: "SBI •••• 4023",
    account: "623015794218",
    remarks: "Payment completed",
    status: "Approved & Paid",
  },
  {
    id: "PAYOUT-2024-017",
    vendor: "Arjun Verma",
    amount: 30000,
    date: "07 May 2024",
    bank: "AXIS •••• 7890",
    account: "112233445566",
    remarks: "Payment completed",
    status: "Approved & Paid",
  },
];

export default function AdminPayoutRequestsBody() {
  const [requests, setRequests] = useState(initialRequests);
  const [selected, setSelected] = useState(initialRequests[0]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const statusMatch = filter === "All" || item.status === filter;
      const searchMatch =
        item.vendor.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [requests, filter, search]);

  const summary = useMemo(() => {
    const pending = requests.filter((i) => i.status === "Pending");
    const approved = requests.filter((i) => i.status === "Approved");
    const paid = requests.filter((i) => i.status === "Approved & Paid");
    const rejected = requests.filter((i) => i.status === "Rejected");

    return {
      pendingCount: pending.length,
      pendingAmount: sumAmount(pending),
      approvedCount: approved.length,
      approvedAmount: sumAmount(approved),
      paidCount: paid.length,
      paidAmount: sumAmount(paid),
      rejectedCount: rejected.length,
      rejectedAmount: sumAmount(rejected),
      totalCount: requests.length,
      totalAmount: sumAmount(requests),
    };
  }, [requests]);

  const updateStatus = (id, status) => {
    const updated = requests.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            processedDate:
              status === "Approved & Paid"
                ? new Date().toLocaleDateString()
                : "-",
            paymentRef:
              status === "Approved & Paid"
                ? `REF${Math.floor(Math.random() * 999999999)}`
                : "-",
            adminRemarks,
          }
        : item
    );

    setRequests(updated);
    setSelected(updated.find((item) => item.id === id));
    setAdminRemarks("");
  };

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Payout Requests</h1>
          <p className="text-sm text-gray-400">
            Review and manage vendor payout requests
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 text-gray-300 focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Approved & Paid">Approved & Paid</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div className="relative">
            <Search
              size={17}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search payouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 pr-10 rounded-lg bg-[#111827] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card
          title="Pending Requests"
          count={summary.pendingCount}
          amount={summary.pendingAmount}
          icon={<Clock />}
          color="yellow"
        />
        <Card
          title="Approved"
          count={summary.approvedCount}
          amount={summary.approvedAmount}
          icon={<FileCheck2 />}
          color="blue"
        />
        <Card
          title="Approved & Paid"
          count={summary.paidCount}
          amount={summary.paidAmount}
          icon={<CheckCircle />}
          color="green"
        />
        <Card
          title="Rejected"
          count={summary.rejectedCount}
          amount={summary.rejectedAmount}
          icon={<XCircle />}
          color="red"
        />
        <Card
          title="Total Payouts"
          count={summary.totalCount}
          amount={summary.totalAmount}
          icon={<Coins />}
          color="orange"
        />
      </div>

      {/* Request Table + Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2 rounded-2xl border border-gray-800 bg-[#0b1220] overflow-hidden">
          <div className="flex flex-wrap gap-3 p-4 border-b border-gray-800">
            {["All", "Pending", "Approved", "Approved & Paid", "Rejected"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                    filter === item
                      ? "bg-orange-500 text-white"
                      : "bg-[#111827] text-gray-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#111827] text-gray-400">
              <tr>
                <Th>Vendor</Th>
                <Th>Request ID</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`border-t border-gray-800 cursor-pointer transition ${
                      selected?.id === item.id
                        ? "bg-[#111827]"
                        : "hover:bg-[#111827]"
                    }`}
                  >
                    <Td>{item.vendor}</Td>
                    <Td>
                      <span className="text-blue-400">{item.id}</span>
                    </Td>
                    <Td>
                      <span className="text-orange-400 font-medium">
                        {formatCurrency(item.amount)}
                      </span>
                    </Td>
                    <Td>
                      <Badge status={item.status} />
                    </Td>
                    <Td>
                      {item.status === "Pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(item.id, "Approved");
                            }}
                            className="px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(item.id, "Rejected");
                            }}
                            className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
                          View
                        </button>
                      )}
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No payout requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-gray-800 bg-[#0b1220] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Request Details</h2>
            <Badge status={selected.status} />
          </div>

          <div className="space-y-4 text-sm">
            <Info label="Request ID" value={selected.id} />
            <Info label="Vendor Name" value={selected.vendor} />
            <Info label="Amount" value={formatCurrency(selected.amount)} />
            <Info label="Request Date" value={selected.date} />
            <Info
              label="Bank Details"
              value={`${selected.bank} | A/C: ${selected.account}`}
            />
            <Info label="Remarks" value={selected.remarks || "-"} />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-400">
              Admin Remarks Optional
            </label>
            <textarea
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              maxLength={200}
              placeholder="Add remarks..."
              className="mt-2 w-full h-24 px-4 py-3 rounded-lg bg-[#111827] border border-gray-700 text-white focus:outline-none resize-none"
            />
            <p className="text-right text-xs text-gray-500">
              {adminRemarks.length}/200
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => updateStatus(selected.id, "Rejected")}
              disabled={selected.status === "Approved & Paid"}
              className="py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
            >
              Reject
            </button>

            <button
              onClick={() => updateStatus(selected.id, "Approved & Paid")}
              disabled={selected.status === "Approved & Paid"}
              className="py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              Approve & Pay
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity - no horizontal scrollbar */}
      <div className="rounded-2xl border border-gray-800 bg-[#0b1220] overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold">Recent Payout Activity</h2>
          <button className="text-orange-400 text-sm flex items-center gap-2">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <table className="w-full text-sm table-fixed">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              <Th>Request ID</Th>
              <Th>Vendor</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Processed Date</Th>
              <Th>Payment Ref</Th>
            </tr>
          </thead>

          <tbody>
            {requests.map((item) => (
              <tr key={item.id} className="border-t border-gray-800">
                <Td>{item.id}</Td>
                <Td>{item.vendor}</Td>
                <Td>
                  <span className="text-orange-400 font-medium">
                    {formatCurrency(item.amount)}
                  </span>
                </Td>
                <Td>
                  <Badge status={item.status} />
                </Td>
                <Td>{item.processedDate || "-"}</Td>
                <Td>{item.paymentRef || "-"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, count, amount, icon, color }) {
  const styles = {
    yellow: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    orange: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  };

  return (
    <div
      className={`rounded-2xl border p-5 hover:opacity-90 transition ${styles[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{count}</h3>
          <p className="text-lg font-medium mt-1">{formatCurrency(amount)}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const styles = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Approved: "bg-blue-500/20 text-blue-400",
    "Approved & Paid": "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded text-xs ${
        styles[status] || "bg-gray-500/20 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left font-medium truncate">{children}</th>
  );
}

function Td({ children }) {
  return (
    <td className="px-4 py-4 text-gray-300 truncate align-middle">
      {children}
    </td>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-gray-200 font-medium wrap-break-words">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function sumAmount(items) {
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}