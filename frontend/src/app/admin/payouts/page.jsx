"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Clock,
  CheckCircle,
  XCircle,
  Coins,
  Search,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

import {
  getAdminPayouts,
  approveAdminPayout,
  rejectAdminPayout,
  markAdminPayoutPaid,
} from "@/store/slices/adminPayoutSlice";

export default function AdminPayoutRequestsBody() {
  const dispatch = useDispatch();

  const { loading, error, payouts } = useSelector(
    (state) => state.adminPayout || { payouts: [] }
  );

  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    dispatch(getAdminPayouts());
  }, [dispatch]);

  useEffect(() => {
    if (!selected && payouts?.length > 0) {
      setSelected(payouts[0]);
    }
  }, [payouts, selected]);

  const statusLabel = (status) => {
    if (status === "PENDING") return "Pending";
    if (status === "APPROVED") return "Approved";
    if (status === "PAID") return "Approved & Paid";
    if (status === "REJECTED") return "Rejected";
    return status;
  };

  const filteredRequests = useMemo(() => {
    return (payouts || []).filter((item) => {
      const label = statusLabel(item.payout_status);

      const statusMatch = filter === "All" || label === filter;

      const searchValue = `${item.business_name || ""} ${item.vendor_email || ""} ${item.id || ""}`.toLowerCase();

      const searchMatch = searchValue.includes(search.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [payouts, filter, search]);

  const summary = useMemo(() => {
    const pending = payouts.filter((i) => i.payout_status === "PENDING");
    const approved = payouts.filter((i) => i.payout_status === "APPROVED");
    const paid = payouts.filter((i) => i.payout_status === "PAID");
    const rejected = payouts.filter((i) => i.payout_status === "REJECTED");

    return {
      pendingCount: pending.length,
      pendingAmount: sumAmount(pending),
      approvedCount: approved.length,
      approvedAmount: sumAmount(approved),
      paidCount: paid.length,
      paidAmount: sumAmount(paid),
      rejectedCount: rejected.length,
      rejectedAmount: sumAmount(rejected),
      totalCount: payouts.length,
      totalAmount: sumAmount(payouts),
    };
  }, [payouts]);

  const handleApprove = async (id) => {
    await dispatch(
      approveAdminPayout({
        id,
        admin_note: adminRemarks,
      })
    );

    setAdminRemarks("");
    dispatch(getAdminPayouts());
  };

  const handleReject = async (id) => {
    await dispatch(
      rejectAdminPayout({
        id,
        admin_note: adminRemarks || "Rejected by admin",
      })
    );

    setAdminRemarks("");
    dispatch(getAdminPayouts());
  };

  const handlePaid = async (id) => {
    if (!referenceNumber.trim()) {
      alert("Please enter payment reference number");
      return;
    }

    await dispatch(
      markAdminPayoutPaid({
        id,
        reference_number: referenceNumber,
        admin_note: adminRemarks,
      })
    );

    setAdminRemarks("");
    setReferenceNumber("");
    dispatch(getAdminPayouts());
  };

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
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
              className="w-full sm:w-64 px-4 py-2 pr-10 rounded-lg bg-[#111827] border border-gray-700 text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card title="Pending Requests" count={summary.pendingCount} amount={summary.pendingAmount} icon={<Clock />} color="yellow" />
        <Card title="Approved" count={summary.approvedCount} amount={summary.approvedAmount} icon={<FileCheck2 />} color="blue" />
        <Card title="Approved & Paid" count={summary.paidCount} amount={summary.paidAmount} icon={<CheckCircle />} color="green" />
        <Card title="Rejected" count={summary.rejectedCount} amount={summary.rejectedAmount} icon={<XCircle />} color="red" />
        <Card title="Total Payouts" count={summary.totalCount} amount={summary.totalAmount} icon={<Coins />} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2 rounded-2xl border border-gray-800 bg-[#0b1220] overflow-hidden">
          <div className="flex flex-wrap gap-3 p-4 border-b border-gray-800">
            {["All", "Pending", "Approved", "Approved & Paid", "Rejected"].map((item) => (
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
            ))}
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    Loading payouts...
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`border-t border-gray-800 cursor-pointer transition ${
                      selected?.id === item.id ? "bg-[#111827]" : "hover:bg-[#111827]"
                    }`}
                  >
                    <Td>{item.business_name || item.vendor_email || "Vendor"}</Td>
                    <Td>
                      <span className="text-blue-400">{item.id.slice(0, 8)}...</span>
                    </Td>
                    <Td>
                      <span className="text-orange-400 font-medium">
                        {formatCurrency(item.payout_amount)}
                      </span>
                    </Td>
                    <Td>
                      <Badge status={statusLabel(item.payout_status)} />
                    </Td>
                    <Td>
                      {item.payout_status === "PENDING" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(item.id);
                            }}
                            className="px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(item.id);
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

        {selected && (
          <div className="rounded-2xl border border-gray-800 bg-[#0b1220] p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Request Details</h2>
              <Badge status={statusLabel(selected.payout_status)} />
            </div>

            <div className="space-y-4 text-sm">
              <Info label="Request ID" value={selected.id} />
              <Info label="Vendor Name" value={selected.business_name || selected.vendor_email} />
              <Info label="Vendor Phone" value={selected.vendor_phone || "-"} />
              <Info label="Amount" value={formatCurrency(selected.payout_amount)} />
              <Info label="Request Date" value={formatDate(selected.created_at)} />
              <Info
                label="Bank Details"
                value={`${selected.bank_name || "-"} | A/C: ${selected.account_number || "-"} | IFSC: ${selected.ifsc_code || "-"}`}
              />
              <Info label="Account Holder" value={selected.account_holder_name || "-"} />
              <Info label="Vendor Remarks" value={selected.remarks || "-"} />
              <Info label="Admin Note" value={selected.admin_note || "-"} />
              <Info label="Reference Number" value={selected.reference_number || "-"} />
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-400">Admin Remarks Optional</label>
              <textarea
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                maxLength={200}
                placeholder="Add remarks..."
                className="mt-2 w-full h-24 px-4 py-3 rounded-lg bg-[#111827] border border-gray-700 text-white focus:outline-none resize-none"
              />
            </div>

            {selected.payout_status === "APPROVED" && (
              <div className="mt-4">
                <label className="text-sm text-gray-400">
                  Payment Reference Number
                </label>
                <input
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter UTR / REF number"
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-700 text-white focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => handleReject(selected.id)}
                disabled={selected.payout_status === "PAID"}
                className="py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
              >
                Reject
              </button>

              {selected.payout_status === "PENDING" ? (
                <button
                  onClick={() => handleApprove(selected.id)}
                  className="py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                >
                  Approve
                </button>
              ) : (
                <button
                  onClick={() => handlePaid(selected.id)}
                  disabled={selected.payout_status === "PAID"}
                  className="py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
            {payouts.map((item) => (
              <tr key={item.id} className="border-t border-gray-800">
                <Td>{item.id.slice(0, 8)}...</Td>
                <Td>{item.business_name || item.vendor_email}</Td>
                <Td>
                  <span className="text-orange-400 font-medium">
                    {formatCurrency(item.payout_amount)}
                  </span>
                </Td>
                <Td>
                  <Badge status={statusLabel(item.payout_status)} />
                </Td>
                <Td>{formatDate(item.paid_at || item.approved_at)}</Td>
                <Td>{item.reference_number || "-"}</Td>
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
    <div className={`rounded-2xl border p-5 hover:opacity-90 transition ${styles[color]}`}>
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
    <span className={`px-3 py-1 rounded text-xs ${styles[status] || "bg-gray-500/20 text-gray-400"}`}>
      {status}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left font-medium truncate">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-4 text-gray-300 truncate align-middle">{children}</td>;
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
  return items.reduce((sum, item) => sum + Number(item.payout_amount || 0), 0);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
}