"use client";
import { productapi } from "@/lib/axios"
import { useEffect, useState } from "react";
import { productapi } from "@/lib/axios";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Send,
  Ban,
  RefreshCcw,
  FileText,
  Clock,
  CheckCircle,
  ShoppingBag,
  IndianRupee,
  X,
} from "lucide-react";

const statusStyles = {
  invited: "bg-blue-100 text-blue-700",
  quoted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
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

      return (
        payload.organization_id ||
        payload.organizationId ||
        payload.org_id
      );
    } catch (err) {
      console.error(err);
    }
  }

  return null;
};

const VendorRFQ = () => {
  const [rfqs, setRfqs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  const [quoteForm, setQuoteForm] = useState({
    unit_price: "",
    total_price: "",
    delivery_days: "",
    payment_terms: "",
    notes: "",
  });

  useEffect(() => {
    loadRFQs();
  }, []);

  const loadRFQs = async () => {
    try {
      setLoading(true);

      const vendorOrgId = getVendorOrgId();

      console.log("Vendor:", vendorOrgId);

      const { data } = await productapi.get("/api/rfqs", {
        headers: {
          "vendor-id": vendorOrgId,
        },
      });

      setRfqs(data.rfqs || []);
      setSelected(data.rfqs?.[0] || null);

    } catch (err) {
      console.error(err);
      setRfqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRFQs();
  }, []);

  const openQuoteModal = () => {
    if (!selected) return;

    setQuoteForm({
      unit_price: "",
      total_price: "",
      delivery_days: "",
      payment_terms: "",
      notes: "",
    });

    setShowQuoteModal(true);
  };

  const submitQuote = async () => {
    if (!selected) return;

    if (!quoteForm.unit_price || Number(quoteForm.unit_price) <= 0) {
      alert("Valid unit price is required");
      return;
    }

    if (!quoteForm.total_price || Number(quoteForm.total_price) <= 0) {
      alert("Valid total price is required");
      return;
    }

    try {
      setSubmitting(true);

      const quote = {
        rfq_id: selected.rfq_id,
        vendor_org_id: getVendorOrgId(),
        unit_price: Number(quoteForm.unit_price),
        total_price: Number(quoteForm.total_price),
        quantity: selected.quantity,
        delivery_days: quoteForm.delivery_days
          ? Number(quoteForm.delivery_days)
          : null,
        payment_terms: quoteForm.payment_terms || null,
        notes: quoteForm.notes || null,
      };

      const { data } = await productapi.post("/api/vendor/quotes", quote);

      if (!data.success) {
        alert(data.message || "Failed to submit quote");
        return;
      }

      alert("Quote submitted successfully");

      setShowQuoteModal(false);
      await loadRFQs();

    } catch (err) {
      console.error("Submit quote error:", err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const declineRFQ = async () => {
    if (!selected) return;

    const confirmDecline = confirm("Are you sure you want to decline this RFQ?");
    if (!confirmDecline) return;

    try {
      const { data } = await productapi.patch(
        `/api/vendor/rfqs/${selected.id}`,
        { status: "declined" }
      );

      if (!data.success) {
        alert(data.message || "Failed to decline RFQ");
        return;
      }

      await loadRFQs();

    } catch (err) {
      console.error("Decline RFQ error:", err);
      alert("Failed to decline RFQ");
    }
  };

  const filteredRFQs = rfqs.filter((item) => {
    const text = `
      ${item.title || ""}
      ${item.buyer_organization || ""}
      ${item.product_name || ""}
      ${item.status || ""}
    `.toLowerCase();

    const searchMatch = text.includes(search.toLowerCase());

    const statusMatch = status === "All" || item.status === status;

    return searchMatch && statusMatch;
  });

  const getDescription = (description) => {
    if (!description) return "No description";

    try {
      const parsed = JSON.parse(description);

      return parsed.requirements || description;
    } catch {
      return description;
    }
  };

  const getBuyerDetails = (description) => {
    if (!description) return null;

    try {
      return JSON.parse(description);
    } catch {
      return null;
    }
  };

  const buyerDetails = getBuyerDetails(selected?.description);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">RFQ Requests</h1>
          <p className="text-slate-500 mt-1">
            View buyer RFQ requests and submit quotations
          </p>
        </div>

        <div className="flex gap-3 text-slate-700">
          <FileText />
          <Clock />
          <CheckCircle />
          <ShoppingBag />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl mt-6 flex gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" />

          <input
            className="w-full border p-3 pl-10 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Search RFQ"
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
          <option>invited</option>
          <option>quoted</option>
          <option>declined</option>
        </select>

        <button
          onClick={loadRFQs}
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
                <th className="text-left">Quantity</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-5 text-slate-500" colSpan="4">
                    Loading RFQs...
                  </td>
                </tr>
              ) : filteredRFQs.length === 0 ? (
                <tr>
                  <td className="p-5 text-slate-500" colSpan="4">
                    No RFQs found
                  </td>
                </tr>
              ) : (
                filteredRFQs.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`border-t cursor-pointer hover:bg-slate-50 ${selected?.id === item.id ? "bg-blue-50" : ""
                      }`}
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {item.title || "Untitled RFQ"}
                    </td>

                    <td className="text-slate-600">
                      {item.buyer_organization || "N/A"}
                    </td>

                    <td className="text-slate-800">{item.quantity || 0}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${statusStyles[item.status] ||
                          "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {item.status}
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
              <h2 className="text-xl font-bold text-slate-900">RFQ Details</h2>

              <h1 className="text-2xl font-bold mt-5 text-slate-800">
                {selected.title || "Untitled RFQ"}
              </h1>

              <div className="mt-5 space-y-4 text-slate-700">
                <p className="flex gap-2 items-center">
                  <Package size={18} />
                  {selected.product_name || "No product"}
                </p>

                <p className="flex gap-2 items-center">
                  <MapPin size={18} />
                  {selected.buyer_organization || "N/A"}
                </p>

                <p className="flex gap-2 items-center">
                  <Calendar size={18} />
                  {selected.rfq_created_at
                    ? new Date(selected.rfq_created_at).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Quantity:</strong> {selected.quantity || 0}
                </p>

                <p>
                  <strong>Budget:</strong> ₹{selected.budget || 0}
                </p>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Requirements</p>
                <p className="mt-1 text-slate-700">
                  {getDescription(selected.description)}
                </p>
              </div>

              {buyerDetails && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4 space-y-1 text-sm text-slate-700">
                  <p>
                    <strong>Buyer:</strong> {buyerDetails.buyerName || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {buyerDetails.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {buyerDetails.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {buyerDetails.deliveryLocation || "N/A"}
                  </p>
                  <p>
                    <strong>Unit:</strong> {buyerDetails.unit || "N/A"}
                  </p>
                </div>
              )}

              {selected.status === "invited" && (
                <>
                  <button
                    onClick={openQuoteModal}
                    className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg flex justify-center gap-2 hover:bg-blue-700"
                  >
                    <Send size={18} />
                    Submit Quote
                  </button>

                  <button
                    onClick={declineRFQ}
                    className="mt-3 w-full border border-red-400 text-red-500 p-3 rounded-lg flex justify-center gap-2 hover:bg-red-50"
                  >
                    <Ban size={18} />
                    Decline
                  </button>
                </>
              )}

              {selected.status === "quoted" && (
                <div className="mt-6 rounded-lg bg-green-50 text-green-700 p-3 text-center font-semibold">
                  Quote already submitted
                </div>
              )}

              {selected.status === "declined" && (
                <div className="mt-6 rounded-lg bg-red-50 text-red-700 p-3 text-center font-semibold">
                  RFQ declined
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-500">Select an RFQ to view details</p>
          )}
        </div>
      </div>

      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Submit Quote
              </h2>

              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">Unit Price</label>
                <div className="relative mt-1">
                  <IndianRupee
                    size={17}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    type="number"
                    className="w-full border rounded-lg p-3 pl-9 outline-none"
                    placeholder="Enter unit price"
                    value={quoteForm.unit_price}
                    onChange={(e) =>
                      setQuoteForm({
                        ...quoteForm,
                        unit_price: e.target.value,
                        total_price:
                          e.target.value && selected?.quantity
                            ? Number(e.target.value) * Number(selected.quantity)
                            : quoteForm.total_price,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Total Price</label>
                <div className="relative mt-1">
                  <IndianRupee
                    size={17}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    type="number"
                    className="w-full border rounded-lg p-3 pl-9 outline-none"
                    placeholder="Enter total price"
                    value={quoteForm.total_price}
                    onChange={(e) =>
                      setQuoteForm({
                        ...quoteForm,
                        total_price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Delivery Days</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-3 mt-1 outline-none"
                  placeholder="Example: 10"
                  value={quoteForm.delivery_days}
                  onChange={(e) =>
                    setQuoteForm({
                      ...quoteForm,
                      delivery_days: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Payment Terms</label>
                <input
                  className="w-full border rounded-lg p-3 mt-1 outline-none"
                  placeholder="Example: 50% advance, 50% on delivery"
                  value={quoteForm.payment_terms}
                  onChange={(e) =>
                    setQuoteForm({
                      ...quoteForm,
                      payment_terms: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Notes</label>
                <textarea
                  className="w-full border rounded-lg p-3 mt-1 outline-none"
                  placeholder="Additional notes"
                  rows={3}
                  value={quoteForm.notes}
                  onChange={(e) =>
                    setQuoteForm({
                      ...quoteForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              onClick={submitQuote}
              disabled={submitting}
              className="mt-5 w-full bg-blue-600 text-white p-3 rounded-lg flex justify-center gap-2 hover:bg-blue-700 disabled:opacity-60"
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit Quote"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRFQ;