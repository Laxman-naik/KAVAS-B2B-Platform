"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getBuyerRFQsAPI, getRFQQuotesAPI } from "@/services/rfqService";
// TODO: adjust path/action name to match your project
import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  Loader2,
  Eye,
  IndianRupee,
  CalendarDays,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STAT_CARDS = [
  { key: "total", label: "Total RFQs", color: "blue", icon: FileText },
  { key: "pending", label: "Pending", color: "yellow", icon: Clock3 },
  { key: "quoted", label: "Approved", color: "green", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected", color: "red", icon: XCircle },
];

const TABLE_HEADERS = [
  "RFQ",
  "Product",
  "Quantity",
  "Budget",
  "Status",
  "Created",
  "Action",
];

const PAGE_SIZE = 5;

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authUser = useSelector((state) => state.auth.user);
  const buyerOrgId = authUser?.organization_id;

  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [quotesError, setQuotesError] = useState("");

  const loadRFQs = async () => {
    if (!buyerOrgId) return;

    try {
      setLoading(true);
      const data = await getBuyerRFQsAPI(buyerOrgId);

      if (data.success) {
        setRfqs(data.rfqs || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load RFQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRFQs();
  }, [buyerOrgId]);

  const filteredRFQs = useMemo(() => {
    const value = search.toLowerCase();

    return rfqs.filter((item) => {
      return (
        item.title?.toLowerCase().includes(value) ||
        item.product_name?.toLowerCase().includes(value) ||
        String(item.id).toLowerCase().includes(value)
      );
    });
  }, [rfqs, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRFQs.length / PAGE_SIZE));

  const paginatedRFQs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRFQs.slice(start, start + PAGE_SIZE);
  }, [filteredRFQs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const stats = useMemo(() => {
    const total = rfqs.length;
    const pending = rfqs.filter((r) => r.status === "open").length;
    const quoted = rfqs.filter((r) => r.status === "quoted").length;
    const rejected = rfqs.filter(
      (r) => r.status === "rejected" || r.status === "declined"
    ).length;

    return { total, pending, quoted, rejected };
  }, [rfqs]);

  const openQuotesModal = async (rfq) => {
    setSelectedRFQ(rfq);
    setIsModalOpen(true);
    setQuotes([]);
    setQuotesError("");

    try {
      setQuotesLoading(true);
      const data = await getRFQQuotesAPI(rfq.id);

      if (data.success) {
        setQuotes(data.quotes || []);
      } else {
        setQuotesError("Failed to load quotes");
      }
    } catch (err) {
      console.error(err);
      setQuotesError("Failed to load quotes");
    } finally {
      setQuotesLoading(false);
    }
  };

  const closeQuotesModal = () => {
    setIsModalOpen(false);
    setSelectedRFQ(null);
    setQuotes([]);
    setQuotesError("");
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={42} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="rounded-sm">
          <CardContent className="p-8">
            <h2 className="text-red-600 font-bold">{error}</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="lg:sticky lg:top-24 self-start">
          <ProfileSidebar user={authUser} onLogout={handleLogout} />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1F3A]">My RFQs</h1>
              <p className="text-gray-500">Track all quotation requests.</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, product, or RFQ ID"
                className="w-full rounded-sm border pl-10 pr-3 py-2 text-sm outline-none focus:border-[#E8891C] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {STAT_CARDS.map(({ key, label, color, icon: Icon }) => (
              <Card key={key} className="border-0 shadow-sm rounded-sm">
                <CardContent className="p-5 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <h2 className={`text-3xl font-bold mt-1 text-${color}-600`}>
                      {stats[key]}
                    </h2>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-sm bg-${color}-100 flex items-center justify-center`}
                  >
                    <Icon size={26} className={`text-${color}-600`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-sm border-0 shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-225">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {TABLE_HEADERS.map((head) => (
                      <th key={head} className="text-left p-4 font-semibold">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedRFQs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="text-center py-16 text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <FileText size={42} />
                          <h2 className="text-xl font-semibold">
                            No RFQs Found
                          </h2>
                          <p>No RFQs match your search.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRFQs.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-orange-50 transition"
                      >
                        <td className="p-4">
                          <p className="text-xs text-gray-500">{item.id}</p>
                        </td>

                        <td className="p-4">{item.title}</td>

                        <td className="p-4">{item.quantity}</td>

                        <td className="p-4 font-semibold">
                          ₹{Number(item.budget || 0).toLocaleString()}
                        </td>

                        <td className="p-4">
                          <span className="px-3 py-1 rounded-sm text-xs bg-gray-100">
                            {item.status}
                          </span>
                        </td>

                        <td className="p-4">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => openQuotesModal(item)}
                            className="inline-flex items-center gap-2 rounded-sm border border-[#E8891C] px-4 py-2 text-sm text-[#E8891C] hover:bg-[#E8891C] hover:text-white transition"
                          >
                            <Eye size={16} />
                            View Quotes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>

            {filteredRFQs.length > 0 && (
              <div className="flex justify-center items-center gap-2 py-5 border-t">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-sm text-sm font-medium border transition ${
                        page === currentPage
                          ? "bg-[#E8891C] border-[#E8891C] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeQuotesModal()}>
        <DialogContent className="rounded-sm max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F3A]">
              Quotes for {selectedRFQ?.title}
            </DialogTitle>
            <DialogDescription>RFQ ID: {selectedRFQ?.id}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 border rounded-sm p-3 bg-gray-50">
            <img
              src={selectedRFQ?.product_image || "/placeholder-product.png"}
              alt={selectedRFQ?.title}
              className="w-16 h-16 rounded-sm object-cover border bg-white"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-product.png";
              }}
            />

            <div className="flex-1">
              <h3 className="font-semibold text-[#0B1F3A]">
                {selectedRFQ?.title}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedRFQ?.product_name || "Custom Product"} · Qty:{" "}
                {selectedRFQ?.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Your Budget</p>
              <p className="font-bold text-[#0B1F3A] flex items-center gap-1 justify-end">
                <IndianRupee size={14} />
                {Number(selectedRFQ?.budget || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-2">
            {quotesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-gray-400" />
              </div>
            ) : quotesError ? (
              <div className="text-center py-12 text-red-600 font-medium">
                {quotesError}
              </div>
            ) : quotes.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
                <Inbox size={36} />
                <p>No quotes received yet for this RFQ.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="border rounded-sm p-4 hover:border-[#E8891C] transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={quote.supplier_logo || "/placeholder-avatar.png"}
                          alt={quote.supplier_name || "Supplier"}
                          className="w-8 h-8 rounded-sm object-cover border bg-gray-50"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-avatar.png";
                          }}
                        />
                        <span className="font-semibold text-[#0B1F3A]">
                          {quote.supplier_name || "Supplier"}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-sm text-xs bg-gray-100 capitalize">
                        {quote.status || "submitted"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee size={14} />
                        <div>
                          <span className="block text-xs text-gray-400">
                            Quoted Price
                          </span>
                          <span className="font-semibold text-[#0B1F3A]">
                            ₹{Number(quote.price || 0).toLocaleString()}
                            {quote.unit ? ` / ${quote.unit}` : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        <div>
                          <span className="block text-xs text-gray-400">
                            Delivery Time
                          </span>
                          <span>{quote.delivery_time || "—"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        <div>
                          <span className="block text-xs text-gray-400">
                            Quoted On
                          </span>
                          <span>
                            {quote.created_at
                              ? new Date(quote.created_at).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedRFQ?.budget ? (
                      <p
                        className={`text-xs mt-2 font-medium ${
                          Number(quote.price) <= Number(selectedRFQ.budget)
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {Number(quote.price) <= Number(selectedRFQ.budget)
                          ? "Within your budget"
                          : "Above your budget"}
                      </p>
                    ) : null}

                    {quote.notes && (
                      <p className="text-sm text-gray-500 mt-3 border-t pt-3">
                        {quote.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;