"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Download,
  Printer,
  LifeBuoy,
  CreditCard,
  Truck,
  ClipboardList,
  HelpCircle,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Info } from "lucide-react";

const VendorSupportPage = () => {
  const [faqTab, setFaqTab] = useState("All");
  const [ticketStatus, setTicketStatus] = useState("All Status");

  const faqTabs = useMemo(
    () => [
      "All",
      "Getting Started",
      "Orders & Shipping",
      "Payments & Payouts",
      "Products & Listings",
      "Account & KYC",
      "Returns & Refunds",
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        id: "faq-1",
        category: "Getting Started",
        q: "How long does the onboarding process take?",
        a: "Most vendors complete onboarding within 15–30 minutes. Verification may take longer depending on document review.",
      },
      {
        id: "faq-2",
        category: "Orders & Shipping",
        q: "How do I process a new order?",
        a: "Open Orders, select the order, confirm inventory, then mark it as Processing. Once packed, mark it Shipped and add tracking details.",
      },
      {
        id: "faq-3",
        category: "Orders & Shipping",
        q: "Which courier partners does KAVAS support?",
        a: "KAVAS supports multiple courier partners based on your pickup pin code and serviceability. You’ll see available options during shipment creation.",
      },
      {
        id: "faq-4",
        category: "Payments & Payouts",
        q: "When do I receive my payouts?",
        a: "Payouts are typically processed as per your settlement cycle after successful delivery and return window completion.",
      },
      {
        id: "faq-5",
        category: "Payments & Payouts",
        q: "What are the platform fees?",
        a: "Fees may vary by category and services used. You can view a detailed breakup inside your Payments & Payouts dashboard.",
      },
      {
        id: "faq-6",
        category: "Products & Listings",
        q: "How many products can I list?",
        a: "There is no strict limit. Keep your catalog clean with correct specs, images, MOQ and pricing for best performance.",
      },
      {
        id: "faq-7",
        category: "Products & Listings",
        q: "How do I set MOQ (Minimum Order Quantity)?",
        a: "While creating or editing a product, set MOQ in pricing/inventory. MOQ helps filter bulk-friendly buyers and improves conversions.",
      },
      {
        id: "faq-8",
        category: "Returns & Refunds",
        q: "What is the return policy for B2B orders?",
        a: "Return eligibility depends on category and reasons. For eligible cases, returns are reviewed and processed as per policy terms.",
      },
    ],
    [],
  );

  const visibleFaqs = useMemo(() => {
    if (faqTab === "All") return faqs;
    return faqs.filter((f) => f.category === faqTab);
  }, [faqs, faqTab]);

  const tickets = useMemo(
    () => [
      {
        id: "TKT-2847",
        subject: "Payment not received for order ORD-2830",
        category: "Payments",
        priority: "High",
        status: "In Progress",
        replies: 3,
        lastUpdate: "27 Apr",
        updatedBy: "Support Agent",
      },
      {
        id: "TKT-2846",
        subject: "Product listing approval pending for 3 days",
        category: "Products",
        priority: "Medium",
        status: "Open",
        replies: 1,
        lastUpdate: "26 Apr",
        updatedBy: "You",
      },
      {
        id: "TKT-2845",
        subject: "Need to update GSTIN after business restructuring",
        category: "Account",
        priority: "Low",
        status: "Resolved",
        replies: 4,
        lastUpdate: "24 Apr",
        updatedBy: "Support Agent",
      },
      {
        id: "TKT-2844",
        subject: "Bulk upload template not accepting SKU format",
        category: "Products",
        priority: "Medium",
        status: "Resolved",
        replies: 2,
        lastUpdate: "22 Apr",
        updatedBy: "Support Agent",
      },
      {
        id: "TKT-2843",
        subject: "Warehouse address change request",
        category: "Account",
        priority: "Low",
        status: "Closed",
        replies: 2,
        lastUpdate: "17 Apr",
        updatedBy: "Support Agent",
      },
      {
        id: "TKT-2842",
        subject: "Urgent: Wrong product delivered to customer",
        category: "Orders",
        priority: "Urgent",
        status: "In Progress",
        replies: 1,
        lastUpdate: "28 Apr",
        updatedBy: "You",
      },
    ],
    [],
  );

  const filteredTickets = useMemo(() => {
    if (ticketStatus === "All Status") return tickets;
    return tickets.filter((t) => t.status === ticketStatus);
  }, [tickets, ticketStatus]);

  const priorityDot = (p) => {
    if (p === "Urgent") return "bg-red-500";
    if (p === "High") return "bg-orange-500";
    if (p === "Medium") return "bg-yellow-500";
    return "bg-gray-400";
  };

  const statusPill = (s) => {
    if (s === "In Progress") return "bg-blue-50 text-blue-700 border-blue-100";
    if (s === "Open") return "bg-orange-50 text-orange-700 border-orange-100";
    if (s === "Resolved") return "bg-green-50 text-green-700 border-green-100";
    if (s === "Closed") return "bg-gray-50 text-gray-700 border-gray-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const quickCards = useMemo(
    () => [
      {
        label: "Payment Issue",
        icon: CreditCard,
        tint: "bg-[#ECFFF6]",
        iconColor: "text-green-700",
      },
      {
        label: "Shipping Help",
        icon: Truck,
        tint: "bg-[#EAF3FF]",
        iconColor: "text-blue-700",
      },
      {
        label: "Order Problem",
        icon: ClipboardList,
        tint: "bg-[#FFF7E6]",
        iconColor: "text-yellow-700",
      },
      {
        label: "Product Listing",
        icon: HelpCircle,
        tint: "bg-[#F3EEFF]",
        iconColor: "text-purple-700",
      },
    ],
    [],
  );
  const [openTicketModal, setOpenTicketModal] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "Medium",
    orderId: "",
    description: "",
  });

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();

    if (
      !ticketForm.subject ||
      !ticketForm.category ||
      !ticketForm.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    alert("Support ticket submitted successfully!");

    setTicketForm({
      subject: "",
      category: "",
      priority: "Medium",
      orderId: "",
      description: "",
    });

    setOpenTicketModal(false);
  };

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
            Help & Support
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Find answers or get help from our support team
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 inline-flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 inline-flex items-center gap-2"
          >
            <Printer size={16} />
            Print All
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card
              key={c.label}
              className="rounded-2xl border border-[#E5E5E5] bg-white text-left hover:shadow-sm transition cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl ${c.tint} flex items-center justify-center`}
                  >
                    <Icon size={18} className={c.iconColor} />
                  </div>
                  <div className="text-sm font-extrabold text-[#0B1F3A]">
                    {c.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-[#F1D99A] bg-[#FFF6DE] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-sm font-extrabold text-[#0B1F3A]">
            Can’t find what you need?
          </div>
          <div className="mt-1 text-xs text-[#8A6D1B]">
            Our support team typically responds within 2 hours
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setOpenTicketModal(true)}
          className="h-10 rounded-xl bg-[#D97B00] text-white px-5 inline-flex items-center gap-2 hover:opacity-95"
        >
          <Plus size={16} />
          Create Ticket
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <LifeBuoy size={16} className="text-gray-600" />
          <div className="text-sm font-extrabold text-[#0B1F3A]">
            Frequently Asked Questions
          </div>
          <div className="text-xs text-gray-500">{faqs.length} articles</div>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto">
          {faqTabs.map((t) => {
            const active = faqTab === t;
            return (
              <Button
                key={t}
                type="button"
                onClick={() => {
                  setFaqTab(t);
                }}
                variant={active ? "default" : "outline"}
                className={`h-9 whitespace-nowrap rounded-xl px-4 text-xs font-extrabold ${active ? "bg-[#0B1F3A] text-white" : "bg-white"}`}
              >
                {t}
              </Button>
            );
          })}
        </div>

        <Card className="mt-4 rounded-2xl border border-[#E5E5E5] bg-white">
          <CardContent className="p-4">
            <Accordion type="single" collapsible className="w-full">
              {visibleFaqs.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="border-0">
                  <AccordionTrigger className="rounded-xl px-3 hover:no-underline">
                    <div className="flex items-start gap-4 min-w-0 w-full">
                      <div className="w-28 shrink-0">
                        <div className="text-[10px] font-extrabold tracking-widest text-gray-400">
                          {f.category.toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-[#0B1F3A] truncate">
                          {f.q}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 text-sm text-gray-600">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-[#0B1F3A]">
              My Support Tickets
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {tickets.length} tickets ·{" "}
              {tickets.filter((t) => t.status === "In Progress").length} active
            </div>
          </div>

          <Select value={ticketStatus} onValueChange={setTicketStatus}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {["All Status", "Open", "In Progress", "Resolved", "Closed"].map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF8EC]">
              <tr>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  TICKET
                </th>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  CATEGORY
                </th>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  PRIORITY
                </th>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  STATUS
                </th>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  REPLIES
                </th>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  LAST UPDATE
                </th>
                <th className="p-4 text-left text-xs font-extrabold text-gray-500">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id} className="border-t border-[#E5E5E5]">
                  <td className="p-4">
                    <div className="text-[11px] font-extrabold text-gray-500">
                      {t.id}
                    </div>
                    <div className="mt-1 font-extrabold text-[#0B1F3A]">
                      {t.subject}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{t.category}</td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0B1F3A]">
                      <span
                        className={`h-2 w-2 rounded-full ${priorityDot(t.priority)}`}
                      />
                      {t.priority}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={`h-6 rounded-full border px-3 text-xs font-extrabold ${statusPill(t.status)}`}
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{t.replies}</td>
                  <td className="p-4">
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {t.lastUpdate}
                    </div>
                    <div className="text-xs text-gray-500">
                      by {t.updatedBy}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4 text-sm font-extrabold">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-[#0B1F3A]"
                      >
                        View
                      </Button>
                      {t.status === "Open" ? (
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-gray-500"
                        >
                          Close
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4 space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-extrabold text-gray-500">
                    {t.id}
                  </div>
                  <div className="mt-1 font-extrabold text-[#0B1F3A]">
                    {t.subject}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`h-6 rounded-full border px-3 text-xs font-extrabold ${statusPill(t.status)}`}
                >
                  {t.status}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Category</div>
                  <div className="font-extrabold text-[#0B1F3A]">
                    {t.category}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Priority</div>
                  <div className="font-extrabold text-[#0B1F3A] inline-flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${priorityDot(t.priority)}`}
                    />
                    {t.priority}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  Replies:{" "}
                  <span className="text-[#0B1F3A] font-extrabold">
                    {t.replies}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-[#0B1F3A] font-extrabold"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2">
          <LifeBuoy size={16} className="text-gray-600" />
          <div className="text-sm font-extrabold text-[#0B1F3A]">
            Contact Your Support Team
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Dedicated account managers and specialists
        </div>

        <div className="mt-4 rounded-2xl bg-[#0B1F3A] text-white p-5 flex flex-row flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold">24/7 Support Line</div>
              <div className="mt-1 text-xs text-white/70">
                For urgent issues only
              </div>
            </div>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
              <Phone size={16} className="text-white/80" />
              <div className="text-sm font-extrabold">+91 1800-123-4567</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
              <Mail size={16} className="text-white/80" />
              <div className="text-sm font-extrabold">support@kavas.in</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
              <Clock size={16} className="text-white/80" />
              <div className="text-sm font-extrabold">
                Mon-Sat, 9 AM - 8 PM IST
              </div>
            </div>
          </div>
        </div>
      </div>
      {openTicketModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-3">
    <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-sm bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-3 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B1F3A]">
            Create Support Ticket
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            We typically respond within 2 hours
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenTicketModal(false)}
          className="text-gray-400 hover:text-[#0B1F3A] transition"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleTicketSubmit} className="px-6 py-5 space-y-5">
        <div>
          <label className="text-sm font-bold text-[#0B1F3A]">
            Subject *
          </label>
          <input
            name="subject"
            value={ticketForm.subject}
            onChange={handleTicketChange}
            placeholder="Brief description of your issue"
            className="mt-2 w-full h-12 rounded-sm border border-gray-200 px-4 outline-none focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-[#0B1F3A]">
              Category *
            </label>
            <select
              name="category"
              value={ticketForm.category}
              onChange={handleTicketChange}
              className="mt-2 w-full h-12 rounded-sm border border-gray-200 px-4 outline-none focus:border-[#0B1F3A] bg-white"
            >
              <option value="">Select</option>
              <option value="Payments">Payments</option>
              <option value="Orders">Orders</option>
              <option value="Shipping">Shipping</option>
              <option value="Products">Products</option>
              <option value="Account">Account</option>
              <option value="Returns">Returns</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-[#0B1F3A]">
              Priority
            </label>
            <select
              name="priority"
              value={ticketForm.priority}
              onChange={handleTicketChange}
              className="mt-2 w-full h-12 rounded-sm border border-gray-200 px-4 outline-none focus:border-[#0B1F3A] bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-[#0B1F3A]">
            Related Order ID Optional
          </label>
          <input
            name="orderId"
            value={ticketForm.orderId}
            onChange={handleTicketChange}
            placeholder="e.g. ORD-2847"
            className="mt-2 w-full h-12 rounded-sm border border-gray-200 px-4 outline-none focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#0B1F3A]">
            Description *
          </label>
          <textarea
            name="description"
            value={ticketForm.description}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                handleTicketChange(e);
              }
            }}
            placeholder="Describe your issue in detail..."
            rows={5}
            className="mt-2 w-full rounded-sm border border-gray-200 px-4 py-3 outline-none resize-none focus:border-[#0B1F3A]  focus:ring-[#0B1F3A]/10"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {ticketForm.description.length}/500
          </div>
        </div>

        <div className="rounded-sm bg-[#F7F9FC] border border-gray-100 p-4 flex gap-3 text-sm text-gray-500">
          <Info size={18} className="text-gray-400 shrink-0 mt-0.5" />
          <p>
            For faster resolution, include order IDs, screenshots, and specific
            error messages. Our team is available Mon-Sat, 9 AM - 8 PM IST.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenTicketModal(false)}
            className="h-11 rounded-sm px-6"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="h-11 rounded-sm px-6 bg-[#D97B00] text-white hover:bg-[#b96500] inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default VendorSupportPage;
