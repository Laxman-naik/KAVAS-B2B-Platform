"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRFQ,
  fetchRFQs,
  deleteRFQ,
} from "@/store/slices/rfqSlice";
import { Search, Plus, Trash2 } from "lucide-react";

const statusStyles = {
  open: "bg-blue-500/20 text-blue-400",
  quoted: "bg-yellow-500/20 text-yellow-400",
  closed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function RFQTable() {
  const dispatch = useDispatch();

  const { rfqs, loading, error } = useSelector((state) => state.rfq);

  const buyerOrgId = "YOUR_REAL_BUYER_ORG_UUID";

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    budget: "",
    product_id: "",
  });

  useEffect(() => {
    dispatch(fetchRFQs());
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      quantity: "",
      budget: "",
      product_id: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      alert("Valid quantity is required");
      return;
    }

    const payload = {
      buyer_org_id: buyerOrgId,
      product_id: form.product_id || null,
      title: form.title,
      description: form.description || null,
      quantity: Number(form.quantity),
      budget: form.budget ? Number(form.budget) : null,
    };

    const result = await dispatch(createRFQ(payload));

    if (createRFQ.fulfilled.match(result)) {
      alert("RFQ created successfully");
      resetForm();
      setShowModal(false);
      dispatch(fetchRFQs());
    } else {
      alert(result.payload || "Failed to create RFQ");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this RFQ?");
    if (!confirmDelete) return;

    await dispatch(deleteRFQ(id));
  };

  const filtered = rfqs.filter((r) =>
    `${r.title} ${r.product_name || ""} ${r.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">RFQ / Quotes</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage buyer RFQs and quotation requests
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search RFQs..."
              className="pl-10 pr-4 py-2 rounded bg-[#111827] border border-gray-800 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} />
            New RFQ
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-500/10 border border-red-500/30 p-3 text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111827]">
            <tr>
              <th className="p-4 text-left">RFQ</th>
              <th className="text-left">Product</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Budget</th>
              <th className="text-left">Status</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-gray-400" colSpan="6">
                  Loading RFQs...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-400" colSpan="6">
                  No RFQs found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-800">
                  <td className="p-4">
                    <p className="text-blue-400 font-semibold">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {r.description || "No description"}
                    </p>
                  </td>

                  <td>{r.product_name || r.product_id || "N/A"}</td>

                  <td>{r.quantity}</td>

                  <td>₹{r.budget || 0}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        statusStyles[r.status] ||
                        "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {r.status || "open"}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1E33] p-6 rounded-xl w-full max-w-xl border border-gray-800">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Create RFQ</h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              placeholder="Title"
              className="w-full p-3 mb-3 bg-[#13263C] rounded outline-none border border-gray-700"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full p-3 mb-3 bg-[#13263C] rounded outline-none border border-gray-700"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              placeholder="Quantity"
              type="number"
              className="w-full p-3 mb-3 bg-[#13263C] rounded outline-none border border-gray-700"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />

            <input
              placeholder="Budget"
              type="number"
              className="w-full p-3 mb-3 bg-[#13263C] rounded outline-none border border-gray-700"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
            />

            <input
              placeholder="Product ID optional"
              className="w-full p-3 mb-3 bg-[#13263C] rounded outline-none border border-gray-700"
              value={form.product_id}
              onChange={(e) =>
                setForm({ ...form, product_id: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}