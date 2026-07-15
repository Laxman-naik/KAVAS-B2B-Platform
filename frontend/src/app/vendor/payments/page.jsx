"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Wallet,
  Clock,
  CheckCircle,
  Coins,
  IndianRupee,
  Send,
  Eye,
  ArrowRight,
  X,
  RefreshCcw,
} from "lucide-react";

import {
  requestVendorPayout,
  getMyVendorPayouts,
  getVendorPayoutSummary,
  clearVendorPayoutState,
} from "@/store/slices/vendorPayoutSlice"

import WithdrawFundsPopup from "../withdrawfundspopup/page";
import Link from "next/link";

export default function PaymentsPayoutsBody() {
  const dispatch = useDispatch();

  const { loading, error, success, payouts, summary } = useSelector(
    (state) => state.vendorPayout
  );

  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    remarks: "",
  });

  useEffect(() => {
    dispatch(getMyVendorPayouts());
    dispatch(getVendorPayoutSummary());

    return () => {
      dispatch(clearVendorPayoutState());
    };
  }, [dispatch]);

  const formatMoney = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const statusStyle = (status) => {
    if (status === "PAID") return "bg-green-100 text-green-700";
    if (status === "APPROVED") return "bg-blue-100 text-blue-700";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleSendRequest = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter valid payout amount");
      return;
    }

    setShowPopup(true);
  };

  const confirmRequest = async () => {
    const result = await dispatch(
      requestVendorPayout({
        payout_amount: Number(form.amount),
        remarks: form.remarks,
      })
    );

    if (requestVendorPayout.fulfilled.match(result)) {
      setShowPopup(false);

      setForm({
        amount: "",
        remarks: "",
      });

      dispatch(getMyVendorPayouts());
      dispatch(getVendorPayoutSummary());
    }
  };

  const refreshData = () => {
    dispatch(getMyVendorPayouts());
    dispatch(getVendorPayoutSummary());
  };

  const cards = [
    {
      title: "Pending Requests",
      value: formatMoney(summary?.pending_amount),
      sub: "Under Admin Review",
      icon: <Clock />,
      color: "yellow",
    },
    {
      title: "Approved Payouts",
      value: formatMoney(summary?.approved_amount),
      sub: "Ready To Be Paid",
      icon: <CheckCircle />,
      color: "blue",
    },
    {
      title: "Paid Payouts",
      value: formatMoney(summary?.paid_amount),
      sub: "Settled To Bank",
      icon: <Wallet />,
      color: "green",
    },
    {
      title: "Total Requested",
      value: formatMoney(summary?.total_requested),
      sub: "All Time Requests",
      icon: <Coins />,
      color: "purple",
    },
  ];
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleWithdrawConfirm = (data) => {
    dispatch(
      requestVendorPayout({
        payout_amount: data.payout_amount,
        remarks: data.remarks,
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] p-4 sm:p-6 lg:p-8 text-[#1A1A1A]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            Payments & Payouts
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Request payout and track admin approval status.
          </p>
        </div>

        <button
          onClick={() => {
            dispatch(getMyVendorPayouts());
            dispatch(getVendorPayoutSummary());
          }}
          className="border border-[#0B1F3A] text-[#0B1F3A] px-4 py-2 rounded-sm font-semibold flex items-center gap-2 w-fit"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-sm border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {typeof error === "string" ? error : error?.message}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-sm border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">
          Payout request submitted successfully.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
        <section className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-5">
            New Payout Request
          </h3>

          <div>
            <label className="text-sm font-medium">
              Payout Amount <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 flex border border-[#E5E5E5] rounded-sm overflow-hidden">
              <span className="px-4 py-3 bg-gray-50 border-r">
                <IndianRupee size={16} />
              </span>

              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                placeholder="Enter payout amount"
                className="w-full px-3 outline-none"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Minimum payout amount should be handled from backend validation.
            </p>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Remarks Optional</label>

            <textarea
              value={form.remarks}
              maxLength={200}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              placeholder="Enter remarks"
              className="mt-2 w-full border border-[#E5E5E5] rounded-sm px-4 py-3 h-24 outline-none resize-none"
            />

            <p className="text-right text-xs text-gray-500">
              {form.remarks.length}/200
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-sm px-4 py-3 text-sm">
              Your request will be reviewed by admin. Status will update after
              approval.
            </div>

            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-sm font-bold shadow transition"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </section>

        <section className="bg-[#1E293B] rounded-sm p-8 shadow-xl text-white overflow-hidden relative">

          {/* Top Row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-wider text-gray-400 font-semibold text-sm">
                Available Balance
              </p>

              <h2 className="text-5xl font-extrabold mt-6">
                ₹{Number(summary?.approved_amount || 0).toLocaleString("en-IN")}
              </h2>

              <p className="text-gray-400 mt-3 text-lg">
                Ready for payout
              </p>
            </div>

            <div className="h-14 w-14 rounded-sm bg-white/10 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/5 rounded-sm p-4">
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-xl font-bold mt-1">
                ₹{Number(summary?.pending_amount || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-white/5 rounded-sm p-4">
              <p className="text-gray-400 text-sm">Paid</p>
              <p className="text-xl font-bold mt-1">
                ₹{Number(summary?.paid_amount || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row  gap-4 mt-8">

            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setWithdrawOpen(true);
              }}
              className="flex-1 bg-white text-[#1E293B] font-bold py-4 rounded-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <Wallet size={18} />
              Withdraw Funds
            </Link>

            <button
              onClick={refreshData}
              className="flex-1 border border-white/20 text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>

          </div>
        </section>
      </div>

      <Table title="My Payout Requests">
        <thead>
          <tr className="bg-gray-50 text-left text-sm">
            <Th>Request ID</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Reference</Th>
            <Th>Admin Note</Th>
            <Th>Action</Th>
          </tr>
        </thead>

        <tbody>
          {loading && payouts.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                Loading payouts...
              </td>
            </tr>
          ) : payouts.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                No payout requests found.
              </td>
            </tr>
          ) : (
            payouts.map((item) => (
              <tr key={item.id} className="border-t text-sm hover:bg-gray-50">
                <Td>{item.id?.slice(0, 8)}...</Td>
                <Td>{formatMoney(item.payout_amount)}</Td>
                <Td>{formatDate(item.created_at)}</Td>
                <Td>
                  <span
                    className={`px-3 py-1 rounded-sm text-xs font-semibold ${statusStyle(
                      item.payout_status
                    )}`}
                  >
                    {item.payout_status}
                  </span>
                </Td>
                <Td>{item.reference_number || "-"}</Td>
                <Td>{item.admin_note || "-"}</Td>
                <Td>
                  <button className="border px-3 py-2 rounded-sm hover:bg-[#FFF8EC] flex items-center gap-2">
                    <Eye size={14} />
                    View
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="flex justify-center mt-5">
        <button className="border border-green-600 text-green-700 px-6 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-green-50">
          View All Payout History <ArrowRight size={18} />
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md shadow-2xl p-6 animate-[scaleIn_0.25s_ease]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-[#0B1F3A]">
                Confirm Payout Request
              </h3>

              <button onClick={() => setShowPopup(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <Info label="Payout Amount" value={formatMoney(form.amount)} />
              <Info label="Payout Method" value="BANK TRANSFER" />
              <Info label="Remarks" value={form.remarks || "No remarks"} />
            </div>

            <div className="bg-[#FFF8EC] border border-[#D4AF37] rounded-sm p-4 mt-5 text-sm">
              After sending request, admin will review and approve. Once payment
              is settled, status will show <b className="text-green-700">PAID</b>.
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full border border-[#E5E5E5] py-3 rounded-sm font-bold"
              >
                Cancel
              </button>

              <button
                onClick={confirmRequest}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2"
              >
                <Send size={17} />
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      <WithdrawFundsPopup
        open={withdrawOpen}
        setOpen={setWithdrawOpen}
        availableBalance={Number(summary?.approved_amount || 0)}
        onConfirm={handleWithdrawConfirm}
      />

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>

  );

}

function Card({ title, value, sub, icon, color }) {
  const styles = {
    green: "border-green-200 bg-green-50 text-green-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
  };

  return (
    <div
      className={`rounded-sm border p-6 shadow-sm hover:shadow-md transition ${styles[color]}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <h3 className="text-2xl font-bold mt-3">{value}</h3>
          <p className="text-sm text-gray-600 mt-2">{sub}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

function Table({ title, children }) {
  return (
    <section className="bg-white border border-[#E5E5E5] rounded-sm p-5 shadow-sm mb-5 overflow-hidden">
      <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5">{children}</table>
      </div>
    </section>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 font-bold text-[#0B1F3A]">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-3 text-[#0B1F3A]">{children}</td>;
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3 gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-[#0B1F3A] text-right">{value}</span>
    </div>
  );
}