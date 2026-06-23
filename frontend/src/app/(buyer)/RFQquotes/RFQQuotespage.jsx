"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, CheckCircle, Truck, FileText } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function RFQQuotesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rfqId = searchParams.get("rfqId");

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/rfqs/${rfqId}/quotes`);

      if (res.data.success) {
        setQuotes(res.data.quotes || []);
      }
    } catch (error) {
      console.error("Fetch RFQ quotes error:", error);
      alert("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rfqId) {
      fetchQuotes();
    }
  }, [rfqId]);

  const handleAcceptQuote = async (quoteId) => {
    try {
      setAccepting(quoteId);

      const res = await axios.put(`${API_URL}/api/rfqs/quotes/${quoteId}/accept`);

      if (res.data.success) {
        alert("Quote accepted successfully");
        fetchQuotes();
      }
    } catch (error) {
      console.error("Accept quote error:", error);
      alert("Failed to accept quote");
    } finally {
      setAccepting(null);
    }
  };

  if (!rfqId) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center">
        <p className="text-red-600 font-semibold">RFQ ID missing</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#0B1F3A] font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-orange-100">
          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            RFQ Vendor Quotes
          </h1>
          <p className="text-gray-500 mt-1">RFQ ID: {rfqId}</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center">
            Loading quotes...
          </div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No quotes submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-2xl shadow-md border border-orange-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#0B1F3A]">
                    {quote.vendor_name || "Vendor"}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      quote.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : quote.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unit Price</span>
                    <span className="font-semibold">₹{quote.unit_price}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Quote Amount</span>
                    <span className="font-bold text-lg text-[#0B1F3A]">
                      ₹{quote.total_price}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-semibold">{quote.quantity}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Truck size={16} /> Delivery
                    </span>
                    <span className="font-semibold">
                      {quote.delivery_days} days
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-500 flex items-center gap-1">
                      <FileText size={16} /> Payment Terms
                    </p>
                    <p className="font-semibold mt-1">
                      {quote.payment_terms || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Notes</p>
                    <p className="font-medium mt-1">
                      {quote.notes || "No notes"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptQuote(quote.id)}
                  disabled={quote.status === "accepted" || accepting === quote.id}
                  className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${
                    quote.status === "accepted"
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-[#E8891C] text-white hover:bg-[#d97812]"
                  }`}
                >
                  <CheckCircle size={18} />
                  {quote.status === "accepted"
                    ? "Accepted"
                    : accepting === quote.id
                    ? "Accepting..."
                    : "Accept Quote"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}