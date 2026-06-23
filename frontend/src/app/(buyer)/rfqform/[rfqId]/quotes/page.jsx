"use client";

import { useEffect, useState } from "react";
import { CheckCircle, IndianRupee, Clock, Package } from "lucide-react";
import { productapi } from "@/lib/axios";

export default function Page({ params }) {
  const { rfqId } = params;

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQuotes = async () => {
    try {
      setLoading(true);

      const res = await productapi.get(`/api/rfqs/${rfqId}/quotes`);

      setQuotes(res.data?.quotes || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rfqId) {
      loadQuotes();
    }
  }, [rfqId]);

  const acceptQuote = async (quoteId) => {
    const confirmAccept = confirm("Accept this quote?");
    if (!confirmAccept) return;

    try {
      const res = await productapi.put(
        `/api/rfqs/quotes/${quoteId}/accept`
      );

      if (res.data?.success) {
        alert("Quote accepted successfully");
        loadQuotes();
      } else {
        alert(res.data?.message || "Failed to accept quote");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to accept quote");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] p-6">
      <h1 className="text-3xl font-bold text-[#0B1F3A]">RFQ Quotes</h1>

      <p className="text-gray-600 mt-1">
        Compare vendor quotations and accept the best quote
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <p>Loading quotes...</p>
        ) : quotes.length === 0 ? (
          <p>No quotes submitted yet</p>
        ) : (
          quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-xl p-6 shadow border"
            >
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                {quote.vendor_name}
              </h2>

              <p className="text-sm text-gray-500">{quote.vendor_type}</p>

              <div className="mt-5 space-y-3">
                <p className="flex gap-2 items-center">
                  <IndianRupee size={18} />
                  Unit Price: ₹{quote.unit_price}
                </p>

                <p className="flex gap-2 items-center">
                  <IndianRupee size={18} />
                  Total Price: ₹{quote.total_price}
                </p>

                <p className="flex gap-2 items-center">
                  <Package size={18} />
                  Quantity: {quote.quantity}
                </p>

                <p className="flex gap-2 items-center">
                  <Clock size={18} />
                  Delivery: {quote.delivery_days} Days
                </p>
              </div>

              <div className="mt-4 bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Payment Terms</p>
                <p className="font-semibold">{quote.payment_terms || "N/A"}</p>
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-semibold">{quote.notes || "N/A"}</p>
              </div>

              <span className="inline-block mt-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {quote.status}
              </span>

              {quote.status === "submitted" && (
                <button
                  onClick={() => acceptQuote(quote.id)}
                  className="mt-5 w-full bg-green-600 text-white p-3 rounded-lg flex justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Accept Quote
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}