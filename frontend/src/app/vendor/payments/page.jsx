"use client";

import { useState } from "react";
import {
  Bell,
  Wallet,
  Clock,
  CheckCircle,
  Coins,
  IndianRupee,
  Send,
  Eye,
  ArrowRight,
  X,
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
  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    bank: "SBI •••• 4023",
    remarks: "",
  });

  const payoutRequests = [
    {
      id: "PAYOUT-2024-025",
      amount: "₹50,000",
      date: "20 May 2024, 10:30 AM",
      status: "Approved & Paid",
    },
    {
      id: "PAYOUT-2024-024",
      amount: "₹45,000",
      date: "18 May 2024, 02:15 PM",
      status: "Approved & Paid",
    },
    {
      id: "PAYOUT-2024-023",
      amount: "₹30,000",
      date: "15 May 2024, 11:45 AM",
      status: "Approved",
    },
    {
      id: "PAYOUT-2024-022",
      amount: "₹25,000",
      date: "12 May 2024, 09:20 AM",
      status: "Pending",
    },
    {
      id: "PAYOUT-2024-021",
      amount: "₹40,000",
      date: "10 May 2024, 04:10 PM",
      status: "Rejected",
    },
  ];

  const recentPayouts = [
    {
      id: "PAY-2024-018",
      amount: "₹50,000",
      date: "20 May 2024, 02:30 PM",
      ref: "REF123456789",
      status: "Paid",
    },
    {
      id: "PAY-2024-017",
      amount: "₹45,000",
      date: "18 May 2024, 04:15 PM",
      ref: "REF123456788",
      status: "Paid",
    },
    {
      id: "PAY-2024-016",
      amount: "₹30,000",
      date: "15 May 2024, 01:20 PM",
      ref: "REF123456787",
      status: "Paid",
    },
    {
      id: "PAY-2024-015",
      amount: "₹40,000",
      date: "10 May 2024, 05:30 PM",
      ref: "REF123456786",
      status: "Paid",
    },
  ];

  const statusStyle = (status) => {
    if (status === "Approved & Paid" || status === "Paid")
      return "bg-green-100 text-green-700";
    if (status === "Approved") return "bg-blue-100 text-blue-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleSendRequest = () => {
    if (!form.amount) {
      alert("Please enter payout amount");
      return;
    }
    setShowPopup(true);
  };

  const confirmRequest = () => {
    alert("Payout request sent successfully!");
    setShowPopup(false);
    setForm({
      amount: "",
      bank: "SBI •••• 4023",
      remarks: "",
    });
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: COLORS.cream, color: COLORS.text }}
    >

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <Card
          title="Available Balance"
          value="₹1,20,000"
          sub="Ready for Payout"
          icon={<Wallet />}
          color="green"
        />
        <Card
          title="Pending Requests"
          value="₹45,200"
          sub="Under Review"
          icon={<Clock />}
          color="yellow"
        />
        <Card
          title="Approved (To be Paid)"
          value="₹24,500"
          sub="Payment in Process"
          icon={<CheckCircle />}
          color="blue"
        />
        <Card
          title="Total Earned"
          value="₹2,80,500"
          sub="All Time Earnings"
          icon={<Coins />}
          color="purple"
        />
      </div>

      {/* Request + Flow */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
        {/* Request Form */}
        <section className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-5">
            New Payout Request
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium">
                Payout Amount <span className="text-red-500">*</span>
              </label>

              <div className="mt-2 flex border border-[#E5E5E5] rounded-lg overflow-hidden">
                <span className="px-4 py-3 bg-gray-50 border-r">
                  <IndianRupee size={16} />
                </span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  className="w-full px-3 outline-none"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Minimum payout: ₹1,000
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Bank Account</label>

              <select
                value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
                className="mt-2 w-full border border-[#E5E5E5] rounded-lg px-4 py-3 outline-none"
              >
                <option>SBI •••• 4023</option>
                <option>HDFC •••• 5678</option>
                <option>ICICI •••• 1234</option>
              </select>

              <p className="text-xs mt-2">
                Available Balance:{" "}
                <span className="text-green-700 font-bold">₹1,20,000</span>
              </p>
            </div>
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
              className="mt-2 w-full border border-[#E5E5E5] rounded-lg px-4 py-3 h-24 outline-none resize-none"
            />
            <p className="text-right text-xs text-gray-500">
              {form.remarks.length}/200
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
              Your request will be reviewed by admin. You will be notified once
              approved.
            </div>

            <button
              onClick={handleSendRequest}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow transition"
            >
              Send Request
            </button>
          </div>
        </section>

        {/* Flow */}
        <section className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#0B1F3A] mb-8">
            Payout Flow
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              ["1", "Request", "You send payout request"],
              ["2", "Review", "Admin reviews your request"],
              ["3", "Approve", "Admin approves request"],
              ["4", "Paid", "Payment settled"],
            ].map((item, index) => (
              <div key={index}>
                <div
                  className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center font-bold ${
                    index === 0 || index === 3
                      ? "bg-green-100 text-green-700 border border-green-400"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item[0]}
                </div>
                <h4 className="font-bold mt-3 text-[#0B1F3A]">{item[1]}</h4>
                <p className="text-xs text-gray-500 mt-1">{item[2]}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 text-sm">
            Once your request is approved and payment is processed, the status
            will be updated to Paid.
          </div>
        </section>
      </div>

      {/* My Requests */}
      <Table title="My Payout Requests">
        <thead>
          <tr className="bg-gray-50 text-left text-sm">
            <Th>Request ID</Th>
            <Th>Amount</Th>
            <Th>Request Date</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {payoutRequests.map((item) => (
            <tr key={item.id} className="border-t text-sm hover:bg-gray-50">
              <Td>{item.id}</Td>
              <Td>{item.amount}</Td>
              <Td>{item.date}</Td>
              <Td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </Td>
              <Td>
                <button className="border px-3 py-2 rounded-lg hover:bg-[#FFF8EC] flex items-center gap-2">
                  <Eye size={14} /> View Details
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Recent Payouts */}
      <Table title="Recent Payouts">
        <thead>
          <tr className="bg-gray-50 text-left text-sm">
            <Th>Payout ID</Th>
            <Th>Amount</Th>
            <Th>Paid Date</Th>
            <Th>Reference ID</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {recentPayouts.map((item) => (
            <tr key={item.id} className="border-t text-sm hover:bg-gray-50">
              <Td>{item.id}</Td>
              <Td>{item.amount}</Td>
              <Td>{item.date}</Td>
              <Td>{item.ref}</Td>
              <Td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="flex justify-center mt-5">
        <button className="border border-green-600 text-green-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-50">
          View All Payout History <ArrowRight size={18} />
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-[scaleIn_0.25s_ease]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-[#0B1F3A]">
                Confirm Payout Request
              </h3>
              <button onClick={() => setShowPopup(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <Info label="Payout Amount" value={`₹${form.amount}`} />
              <Info label="Bank Account" value={form.bank} />
              <Info label="Remarks" value={form.remarks || "No remarks"} />
            </div>

            <div className="bg-[#FFF8EC] border border-[#D4AF37] rounded-xl p-4 mt-5 text-sm">
              After sending request, admin will review and approve. Once
              payment is settled, vendor status will show{" "}
              <b className="text-green-700">Approved & Paid</b>.
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full border border-[#E5E5E5] py-3 rounded-lg font-bold"
              >
                Cancel
              </button>

              <button
                onClick={confirmRequest}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Send size={17} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

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
      className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition ${styles[color]}`}
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
    <section className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm mb-5 overflow-hidden">
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