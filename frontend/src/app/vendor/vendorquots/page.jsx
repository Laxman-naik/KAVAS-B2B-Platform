"use client";

import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Calendar,
  IndianRupee,
  RefreshCcw,
} from "lucide-react";

const statusStyles = {
  submitted: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-700",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:5002";

const isUUID = (value) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value || ""
  );
};

const getVendorOrgId = () => {
  if (typeof window === "undefined") return null;

  const directOrgId =
    localStorage.getItem("vendor_organization_id") ||
    localStorage.getItem("organization_id") ||
    localStorage.getItem("organizationId");

  if (isUUID(directOrgId)) {
    return directOrgId;
  }

  const token =
    localStorage.getItem("vendor_accessToken") ||
    localStorage.getItem("accessToken");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const tokenOrgId =
        payload.organization_id ||
        payload.organizationId ||
        payload.org_id;

      if (isUUID(tokenOrgId)) {
        localStorage.setItem("vendor_organization_id", tokenOrgId);
        return tokenOrgId;
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }

  return null;
};

const MyQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);

      const vendorOrgId = getVendorOrgId();

      if (!vendorOrgId) {
        throw new Error(
          "Vendor organization id missing. Please login again as vendor."
        );
      }

      const res = await fetch(`${API_BASE_URL}/api/vendor/quotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "vendor-id": vendorOrgId,
        },
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(`API Error ${res.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);

      const list = data.quotes || [];

      setQuotes(list);
      setSelected(list[0] || null);
    } catch (error) {
      console.error("Load quotes error:", error);
      setQuotes([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const withdrawQuote = async (id) => {
    const confirmWithdraw = confirm(
      "Are you sure you want to withdraw this quote?"
    );

    if (!confirmWithdraw) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/vendor/quotes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "withdrawn",
        }),
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(responseText);
      }

      await loadQuotes();
    } catch (error) {
      console.error("Withdraw quote error:", error);
      alert("Failed to withdraw quote");
    }
  };

  const filteredQuotes = quotes
    .filter((item) => {
      const text = `
        ${item.rfq_title || ""}
        ${item.buyer_organization || ""}
        ${item.product_name || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .filter((item) => status === "All" || item.status === status);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Quotes</h1>
          <p className="text-slate-500 mt-1">
            View and manage your submitted RFQ quotes
          </p>
        </div>

        <div className="flex gap-5 text-slate-700">
          <FileText />
          <Clock />
          <CheckCircle />
          <XCircle />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl mt-6 flex gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" />

          <input
            className="w-full border p-3 pl-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Search quotes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-4 outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>submitted</option>
          <option>accepted</option>
          <option>rejected</option>
          <option>withdrawn</option>
        </select>

        <button
          onClick={loadQuotes}
          className="border px-4 rounded-lg flex gap-2 items-center hover:bg-slate-50"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 text-left">RFQ</th>
                <th className="text-left">Buyer</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-5 text-slate-500" colSpan="4">
                    Loading quotes...
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td className="p-5 text-slate-500" colSpan="4">
                    No quotes found
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => setSelected(q)}
                    className={`border-t cursor-pointer hover:bg-slate-50 ${
                      selected?.id === q.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {q.rfq_title || "Untitled RFQ"}
                    </td>

                    <td className="text-slate-600">
                      {q.buyer_organization || "N/A"}
                    </td>

                    <td className="font-semibold text-slate-800">
                      ₹{q.total_price || 0}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusStyles[q.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {selected ? (
            <>
              <h2 className="text-xl font-bold text-slate-900">
                Quote Details
              </h2>

              <h1 className="text-2xl font-bold mt-5 text-slate-800">
                {selected.rfq_title || "Untitled RFQ"}
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                {selected.rfq_description || "No RFQ description"}
              </p>

              <div className="space-y-4 mt-5 text-slate-700">
                <p className="flex gap-2 items-center">
                  <Package size={18} />
                  {selected.product_name || "No product"}
                </p>

                <p className="flex gap-2 items-center">
                  <IndianRupee size={18} />
                  Total Price: ₹{selected.total_price || 0}
                </p>

                <p className="flex gap-2 items-center">
                  <Calendar size={18} />
                  {selected.delivery_days || 0} Days Delivery
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Unit Price</p>

                <h2 className="text-xl font-bold text-slate-900">
                  ₹{selected.unit_price || 0}
                </h2>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Payment Terms</p>

                <h2 className="font-semibold text-slate-800">
                  {selected.payment_terms || "N/A"}
                </h2>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Notes</p>

                <h2 className="font-semibold text-slate-800">
                  {selected.notes || "N/A"}
                </h2>
              </div>

              {selected.status === "submitted" && (
                <button
                  onClick={() => withdrawQuote(selected.id)}
                  className="mt-6 w-full border border-red-500 text-red-500 p-3 rounded-lg hover:bg-red-50"
                >
                  Withdraw Quote
                </button>
              )}
            </>
          ) : (
            <p className="text-slate-500">Select a quote to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQuotes;