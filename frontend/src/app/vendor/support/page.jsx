"use client";

import { useMemo, useRef, useState } from "react";
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
  const [openTicket, setOpenTicket] = useState(false);

  const [faqTab, setFaqTab] = useState("All");



  const faqSectionRef = useRef(null);

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

  

  const quickCards = useMemo(
    () => [
      {
        label: "Payment Issue",
        icon: CreditCard,
        tint: "bg-[#ECFFF6]",
        iconColor: "text-green-700",
        targetTab: "Payments & Payouts",
      },
      {
        label: "Shipping Help",
        icon: Truck,
        tint: "bg-[#EAF3FF]",
        iconColor: "text-blue-700",
        targetTab: "Orders & Shipping",
      },
      {
        label: "Order Problem",
        icon: ClipboardList,
        tint: "bg-[#FFF7E6]",
        iconColor: "text-yellow-700",
        targetTab: "Orders & Shipping",
      },
      {
        label: "Product Listing",
        icon: HelpCircle,
        tint: "bg-[#F3EEFF]",
        iconColor: "text-purple-700",
        targetTab: "Products & Listings",
      },
    ],
    [],
  );
  

  

 

 

  const visibleFaqs = useMemo(() => {
    if (faqTab === "All") return faqs;
    return faqs.filter((faq) => faq.category === faqTab);
  }, [faqs, faqTab]);



  const handleQuickCardClick = (targetTab) => {
    setFaqTab(targetTab);

    setTimeout(() => {
      faqSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Subject",
      "Category",
      "Priority",
      "Status",
      "Replies",
      "Last Update",
      "Updated By",
    ];

    const rows = filteredTickets.map((ticket) => [
      ticket.id,
      ticket.subject,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.replies,
      ticket.lastUpdate,
      ticket.updatedBy,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `support-tickets-${ticketStatus
      .toLowerCase()
      .replaceAll(" ", "-")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    const tableRows = filteredTickets
      .map(
        (ticket) => `
          <tr>
            <td>${ticket.id}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.category}</td>
            <td>${ticket.priority}</td>
            <td>${ticket.status}</td>
            <td>${ticket.replies}</td>
            <td>${ticket.lastUpdate}</td>
            <td>${ticket.updatedBy}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Support Tickets</title>
          <style>
            * {
              box-sizing: border-box;
              font-family: Arial, sans-serif;
            }

            body {
              padding: 30px;
              background: #ffffff;
              color: #0B1F3A;
            }

            .header {
              margin-bottom: 24px;
              border-bottom: 2px solid #0B1F3A;
              padding-bottom: 16px;
            }

            .title {
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 6px;
            }

            .subtitle {
              color: #6b7280;
              font-size: 14px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            thead {
              background: #FFF8EC;
            }

            th {
              padding: 14px;
              text-align: left;
              font-size: 12px;
              border: 1px solid #E5E5E5;
              text-transform: uppercase;
            }

            td {
              padding: 14px;
              border: 1px solid #E5E5E5;
              font-size: 13px;
            }

            tr:nth-child(even) {
              background: #fafafa;
            }

            .footer {
              margin-top: 24px;
              font-size: 12px;
              color: #6b7280;
            }

            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="title">Support Tickets Report</div>
            <div class="subtitle">Filtered Status: ${ticketStatus}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Replies</th>
                <th>Last Update</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            Generated from KAVAS Vendor Support Dashboard
          </div>

          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const priorityDot = (priority) => {
    if (priority === "Urgent") return "bg-red-500";
    if (priority === "High") return "bg-orange-500";
    if (priority === "Medium") return "bg-yellow-500";
    return "bg-gray-400";
  };

  const statusPill = (status) => {
    if (status === "In Progress") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "Open") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (status === "Resolved") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (status === "Closed") {
      return "bg-gray-50 text-gray-700 border-gray-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1F3A]">
              Help & Support
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Find answers or get help from our support team
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleExportCSV}
              variant="outline"
              className="h-10 rounded-sm border-[#E5E5E5] bg-white px-4"
            >
              <Download size={16} />
              Export CSV
            </Button>

            <Button
              type="button"
              onClick={handlePrintAll}
              variant="outline"
              className="h-10 rounded-sm border-[#E5E5E5] bg-white px-4"
            >
              <Printer size={16} />
              Print All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.label}
                type="button"
                onClick={() => handleQuickCardClick(card.targetTab)}
                className="text-left"
              >
                <Card className="rounded-sm border border-[#E5E5E5] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-sm ${card.tint}`}
                      >
                        <Icon size={18} className={card.iconColor} />
                      </div>

                      <div>
                        <p className="text-sm font-extrabold text-[#0B1F3A]">
                          {card.label}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          View related FAQs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

       

        <section ref={faqSectionRef} className="scroll-mt-6">
          <div className="flex items-center gap-2">
            <LifeBuoy size={16} className="text-gray-600" />
            <h2 className="text-sm font-extrabold text-[#0B1F3A]">
              Frequently Asked Questions
            </h2>
            <span className="text-xs text-gray-500">
              {visibleFaqs.length} articles
            </span>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {faqTabs.map((tab) => {
              const active = faqTab === tab;

              return (
                <Button
                  key={tab}
                  type="button"
                  onClick={() => setFaqTab(tab)}
                  variant={active ? "default" : "outline"}
                  className={`h-9 whitespace-nowrap rounded-sm px-4 text-xs font-extrabold ${
                    active
                      ? "bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]"
                      : "border-[#E5E5E5] bg-white text-[#0B1F3A]"
                  }`}
                >
                  {tab}
                </Button>
              );
            })}
          </div>

          <Card className="mt-4 rounded-sm border border-[#E5E5E5] bg-white shadow-sm">
            <CardContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {visibleFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border-b border-[#E5E5E5] last:border-b-0"
                  >
                    <AccordionTrigger className="rounded-sm px-3 py-4 text-left hover:no-underline">
                      <div className="flex w-full items-start gap-4">
                        <div className="hidden w-32 shrink-0 sm:block">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                            {faq.category}
                          </p>
                        </div>

                        <p className="text-sm font-extrabold text-[#0B1F3A]">
                          {faq.q}
                        </p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 pb-4 text-sm leading-6 text-gray-600">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        

        <section>
          <div className="flex items-center gap-2">
            <LifeBuoy size={16} className="text-gray-600" />
            <h2 className="text-sm font-extrabold text-[#0B1F3A]">
              Contact Your Support Team
            </h2>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Dedicated account managers and specialists
          </p>

          <div className="mt-4 flex flex-col gap-4 rounded-sm bg-[#0B1F3A] p-5 text-white lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/10">
                <Clock size={18} />
              </div>

              <div>
                <h3 className="text-sm font-extrabold">24/7 Support Line</h3>
                <p className="mt-1 text-xs text-white/70">
                  For urgent issues only
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-4 py-3">
                <Phone size={16} className="text-white/80" />
                <span className="text-sm font-extrabold">
                  +91 6302259849
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-4 py-3">
                <Mail size={16} className="text-white/80" />
                <span className="text-sm font-extrabold">support@kavas.in</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-4 py-3">
                <Clock size={16} className="text-white/80" />
                <span className="text-sm font-extrabold">
                  Mon-Sat, 9 AM - 8 PM IST
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </div>
  );
};

export default VendorSupportPage;