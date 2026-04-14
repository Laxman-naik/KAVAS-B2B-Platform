"use client"
import { useState } from "react";

const rfqData = [
  {
    id: "#892",
    buyer: "Acme Corp",
    product: "PCB Module",
    qty: "5,000",
    quotes: 3,
    deadline: "Apr 10",
    status: "Quoted",
  },
  {
    id: "#891",
    buyer: "TechSource",
    product: "Steel Sheet",
    qty: "2 tons",
    quotes: 1,
    deadline: "Apr 8",
    status: "Pending",
  },
  {
    id: "#890",
    buyer: "BuildMart",
    product: "Hydraulic Press",
    qty: "4",
    quotes: 0,
    deadline: "Apr 5",
    status: "No Bids",
  },
  {
    id: "#889",
    buyer: "ClearPath",
    product: "Fabric Roll",
    qty: "1,000 m",
    quotes: 5,
    deadline: "Apr 3",
    status: "Accepted",
  },
];

const statusStyles = {
  Quoted: "bg-blue-500/20 text-blue-400",
  Pending: "bg-yellow-500/20 text-yellow-400",
  "No Bids": "bg-gray-500/20 text-gray-400",
  Accepted: "bg-green-500/20 text-green-400",
};

export default function RFQTable() {
  const [search, setSearch] = useState("");

  // 🔥 NEW STATES
  const [showModal, setShowModal] = useState(false);
  const [rfqs, setRfqs] = useState(rfqData);

  const [form, setForm] = useState({
    buyer: "",
    product: "",
    qty: "",
    deadline: "",
    price: "",
    location: "",
    notes: "",
  });

  // 🔥 FILTER
  const filtered = rfqs.filter((r) =>
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 SUBMIT FUNCTION
  const handleSubmit = () => {
    if (!form.buyer || !form.product || !form.qty) return;

    const newRFQ = {
      id: "#" + Math.floor(Math.random() * 1000),
      buyer: form.buyer,
      product: form.product,
      qty: form.qty,
      quotes: 0,
      deadline: form.deadline || "—",
      status: "Pending",
    };

    setRfqs([newRFQ, ...rfqs]);
    setShowModal(false);

    setForm({
      buyer: "",
      product: "",
      qty: "",
      deadline: "",
      price: "",
      location: "",
      notes: "",
    });
  };

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">RFQ / Quotes</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search RFQs..."
            className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔥 BUTTON UPDATED */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition duration-200 cursor-pointer"
          >
            + New RFQ
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "RFQ #",
                "Buyer",
                "Product",
                "QTY",
                "Quotes",
                "Deadline",
                "Status",
              ].map((h) => (
                <th key={h} className="px-6 py-4 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={i}
                className="border-t border-gray-800 hover:bg-[#111827] transition duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 text-blue-400 font-medium">
                  {r.id}
                </td>
                <td className="px-6 py-4">{r.buyer}</td>
                <td className="px-6 py-4 text-gray-300">{r.product}</td>
                <td className="px-6 py-4">{r.qty}</td>
                <td
                  className={`px-6 py-4 font-medium ${
                    r.quotes === 0
                      ? "text-red-400"
                      : r.quotes >= 3
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {r.quotes}
                </td>
                <td className="px-6 py-4">{r.deadline}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyles[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2">
          <div className="w-full max-w-2xl bg-[#0F1E33] rounded-2xl p-6 text-white shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Create new RFQ</h2>
                <p className="text-xs text-gray-400">
                  Request for quotation from vendors
                </p>
              </div>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <input
                placeholder="Buyer"
                className="p-2 rounded bg-[#13263C]"
                value={form.buyer}
                onChange={(e) => setForm({ ...form, buyer: e.target.value })}
              />

              <input
                placeholder="Product / item"
                className="p-2 rounded bg-[#13263C]"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />

              <input
                placeholder="Quantity"
                className="p-2 rounded bg-[#13263C]"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
              />

              <input
                type="date"
                className="p-2 rounded bg-[#13263C]"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />

              <input
                placeholder="Target price"
                className="p-2 rounded bg-[#13263C]"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <input
                placeholder="Delivery location"
                className="p-2 rounded bg-[#13263C]"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Specifications / notes"
              className="w-full mt-3 p-2 rounded bg-[#13263C]"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600"
              >
                Submit RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}