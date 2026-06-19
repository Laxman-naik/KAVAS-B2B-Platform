"use client";

import { useEffect, useState } from "react";

const statusStyles = {
  open: "bg-blue-500/20 text-blue-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  closed: "bg-green-500/20 text-green-400",
};

export default function RFQTable() {
  const [rfqs, setRfqs] = useState([]);
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
    fetch("/api/rfqs")
      .then((res) => res.json())
      .then((data) => setRfqs(data));
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.quantity || !form.product_id) return;

    const res = await fetch("/api/rfqs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        quantity: Number(form.quantity),
        budget: Number(form.budget),
        product_id: form.product_id,
        status: "open",
      }),
    });

    const newRFQ = await res.json();

    setRfqs((prev) => [newRFQ, ...prev]);

    setForm({
      title: "",
      description: "",
      quantity: "",
      budget: "",
      product_id: "",
    });

    setShowModal(false);
  };

  const filtered = rfqs.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-[#0b1220] min-h-screen text-white">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">RFQ / Quotes</h1>

        <div className="flex gap-3">

          <input
            placeholder="Search RFQs..."
            className="px-4 py-2 rounded bg-[#111827]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 px-4 rounded"
          >
            + New RFQ
          </button>

        </div>
      </div>


      <div className="overflow-x-auto border border-gray-800 rounded-xl">

        <table className="w-full text-sm">

          <thead className="bg-[#111827]">

            <tr>
              <th className="p-4 text-left">RFQ</th>
              <th className="text-left">Product</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Budget</th>
              <th className="text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {filtered.map((r) => (

              <tr
                key={r.id}
                className="border-t border-gray-800"
              >

                <td className="p-4 text-blue-400">
                  {r.title}
                </td>

                <td>
                  {r.product_id}
                </td>

                <td>
                  {r.quantity}
                </td>

                <td>
                  ${r.budget}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full ${statusStyles[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {showModal && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-[#0F1E33] p-6 rounded-xl w-full max-w-xl">

            <div className="flex justify-between mb-4">

              <h2 className="text-xl">
                Create RFQ
              </h2>

              <button onClick={() => setShowModal(false)}>
                ✕
              </button>

            </div>


            <input
              placeholder="Title"
              className="w-full p-2 mb-3 bg-[#13263C]"
              value={form.title}
              onChange={(e) =>
                setForm({...form,title:e.target.value})
              }
            />


            <textarea
              placeholder="Description"
              className="w-full p-2 mb-3 bg-[#13263C]"
              value={form.description}
              onChange={(e) =>
                setForm({...form,description:e.target.value})
              }
            />


            <input
              placeholder="Quantity"
              type="number"
              className="w-full p-2 mb-3 bg-[#13263C]"
              value={form.quantity}
              onChange={(e) =>
                setForm({...form,quantity:e.target.value})
              }
            />


            <input
              placeholder="Budget"
              type="number"
              className="w-full p-2 mb-3 bg-[#13263C]"
              value={form.budget}
              onChange={(e) =>
                setForm({...form,budget:e.target.value})
              }
            />


            <input
              placeholder="Product ID"
              className="w-full p-2 mb-3 bg-[#13263C]"
              value={form.product_id}
              onChange={(e) =>
                setForm({...form,product_id:e.target.value})
              }
            />


            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-orange-500 px-4 py-2 rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}