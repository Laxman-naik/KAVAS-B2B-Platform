"use client";

import React from "react";
import {
  CalendarDays,
  ShieldCheck,
  Ban,
  PackageCheck,
  FileText,
  ClipboardList,
  UserCheck,
  Truck,
  SearchCheck,
  IndianRupee,
  CheckCircle2,
  Boxes,
  ShoppingCart,
  PieChart,
  UserCog,
  ReceiptText,
  Info,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const RefundPolicyPage = () => {
  const glanceItems = [
    {
      icon: CalendarDays,
      title: "Return Window",
      text: "Returns are accepted within 7 - 15 days of delivery based on product category.",
    },
    {
      icon: ShieldCheck,
      title: "Eligibility",
      text: "Items must be unused, in original packaging with all tags and accessories.",
    },
    {
      icon: Ban,
      title: "Non-Refundable Items",
      text: "Customized products, perishables, software, and clearance items are non-refundable.",
    },
    {
      icon: PackageCheck,
      title: "Damaged / Wrong Items",
      text: "Report within 48 hours of delivery with photos for quick resolution.",
    },
    {
      icon: FileText,
      title: "GST Invoice",
      text: "Refunds are processed after validating returned items and GST invoice adjustments.",
    },
  ];

  const processSteps = [
    {
      icon: ClipboardList,
      title: "Request Submitted",
      text: "You submit a refund request through our portal or contact our support team.",
    },
    {
      icon: UserCheck,
      title: "Seller Approval",
      text: "Our team reviews and approves your request.",
    },
    {
      icon: Truck,
      title: "Return Shipment",
      text: "Pickup or return shipment is arranged.",
    },
    {
      icon: SearchCheck,
      title: "Quality Check",
      text: "We inspect the returned item at our quality check facility.",
    },
    {
      icon: IndianRupee,
      title: "Refund Initiated",
      text: "Refund is initiated to your original payment method or as per your choice.",
    },
    {
      icon: CheckCircle2,
      title: "Refund Completed",
      text: "Refund is completed and confirmation is sent to you.",
    },
  ];

  const rules = [
    {
      icon: Boxes,
      title: "Bulk Orders",
      text: "Returns for bulk orders are accepted on a case-to-case basis.",
    },
    {
      icon: ShoppingCart,
      title: "MOQ Based",
      text: "Refunds are applicable only if the returned quantity meets MOQ terms.",
    },
    {
      icon: PieChart,
      title: "Partial Refunds",
      text: "Partial refunds may be issued for partial returns or deductions.",
    },
    {
      icon: UserCog,
      title: "Supplier Approval",
      text: "Some categories require supplier approval for refunds.",
    },
    {
      icon: ReceiptText,
      title: "GST Adjustments",
      text: "Refunds are processed after GST invoice adjustments.",
    },
  ];

  const policyPoints = [
    [
      "Product Condition",
      "Returned items must be unused, undamaged and in original packaging with all accessories, manuals and labels.",
    ],
    [
      "Return Window",
      "Return requests are accepted within 7 to 15 days of delivery. The exact window depends on the product category.",
    ],
    [
      "Damaged or Wrong Items",
      "Please report within 48 hours of delivery with clear photos and order details. We will arrange a replacement or refund.",
    ],
    [
      "Partial Returns",
      "For bulk orders, partial returns are accepted as per our policy and supplier approval.",
    ],
    [
      "Non-Refundable Items",
      "Customized or made-to-order products, perishable goods, software, digital codes and clearance sale items are non-refundable.",
    ],
    [
      "Shipping Charges",
      "Original shipping charges are non-refundable unless the return is due to our error.",
    ],
    [
      "GST Invoice & Taxes",
      "Refunds are processed after validating returned items and adjusting the GST invoice as per applicable laws.",
    ],
    [
      "Approval",
      "All refund requests are subject to review and approval by the seller or supplier.",
    ],
  ];

  const refundMethods = [
    [
      "Original Payment Method",
      "Refunds are credited back to the original payment method such as UPI, card or net banking.",
    ],
    [
      "Bank Transfer",
      "For approved requests, refund will be transferred to your registered bank account.",
    ],
    [
      "Store Credit",
      "Available on request. Store credit can be used for future purchases.",
    ],
    [
      "Refund Timeline",
      "Once return is received and approved, refunds are processed within 5 - 10 business days.",
    ],
  ];

  return (
    <main className="min-h-screen bg-white text-[#0B1F3A]">
      <section className="relative overflow-hidden bg-[#0B1F3A]">
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              

              <h1 className="text-4xl flex font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Refund
                <span className="block text-[#D4AF37]"> Policy</span>
              </h1>

              <p className="mt-4 text-lg font-semibold text-[#D4AF37]">
                Clear Returns. Safe Refunds. Better B2B Experience.
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                We are committed to delivering quality products and a fair
                buying experience for our B2B customers. Please read our refund
                policy carefully before placing an order.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-sm border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-2xl font-bold text-[#D4AF37]">7-15</p>
                  <p className="text-xs text-white/70">Days Return Window</p>
                </div>

                <div className="rounded-sm border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-2xl font-bold text-[#D4AF37]">48H</p>
                  <p className="text-xs text-white/70">Damage Report Time</p>
                </div>
              </div>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="relative h-72 w-full max-w-md rounded-sm bg-[#FFF8EC] p-6">
    
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle number="1" title="Refund Policy at a Glance" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {glanceItems.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}
        </div>

        <SectionTitle number="2" title="Our Refund Process" />

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {processSteps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37] bg-white">
                <step.icon className="h-7 w-7 text-[#0B1F3A]" />
              </div>

              <div className="mx-auto -mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-white">
                {index + 1}
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-[#0B1F3A]">
                {step.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[#0B1F3A]/75">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="rounded-sm border-[#E5E5E5] shadow-none">
            <CardContent className="p-5">
              <h2 className="text-xl font-extrabold text-[#0B1F3A]">
                3. Detailed Refund Policy
              </h2>

              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#0B1F3A]/85">
                {policyPoints.map(([title, text]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                    <span>
                      <strong>{title}:</strong> {text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-sm border-[#E5E5E5] shadow-none">
              <CardContent className="p-5">
                <h2 className="text-xl font-extrabold text-[#0B1F3A]">
                  4. Refund Methods & Timeline
                </h2>

                <div className="mt-5 overflow-hidden rounded-sm border border-[#E5E5E5]">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0B1F3A] text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Refund Method
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {refundMethods.map(([method, details]) => (
                        <tr key={method} className="border-t border-[#E5E5E5]">
                          <td className="px-4 py-3 font-medium">{method}</td>
                          <td className="px-4 py-3 text-[#0B1F3A]/75">
                            {details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex gap-3 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-4 text-sm">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#0B1F3A]" />
                  <p className="text-[#0B1F3A]/80">
                    <strong>Note:</strong> The time taken for the refund to
                    reflect in your account depends on your bank or payment
                    provider.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm border-[#E5E5E5] shadow-none">
              <CardContent className="p-5">
                <h2 className="text-xl font-extrabold text-[#0B1F3A]">
                  6. Frequently Asked Questions
                </h2>

                <Accordion type="single" collapsible className="mt-4 space-y-2">
                  {[
                    "How long does it take to get my refund?",
                    "Can I return bulk orders?",
                    "What if I receive a damaged or wrong item?",
                    "When will GST invoice be adjusted?",
                    "Can I get store credit instead of bank refund?",
                  ].map((question, index) => (
                    <AccordionItem
                      key={question}
                      value={`faq-${index}`}
                      className="rounded-sm border border-[#E5E5E5] px-3"
                    >
                      <AccordionTrigger className="text-left text-sm font-semibold text-[#0B1F3A] hover:no-underline">
                        {question}
                      </AccordionTrigger>

                      <AccordionContent className="text-sm leading-6 text-[#0B1F3A]/75">
                        Refunds are handled according to product condition,
                        supplier approval, return window, and payment method.
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        <SectionTitle number="5" title="B2B Specific Rules" />

        <Card className="rounded-sm border-[#E5E5E5] shadow-none">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
            {rules.map((rule) => (
              <div key={rule.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8EC]">
                  <rule.icon className="h-7 w-7 text-[#0B1F3A]" />
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#0B1F3A]">
                  {rule.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#0B1F3A]/70">
                  {rule.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center gap-4 rounded-sm bg-[#FFF8EC] p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
            <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />
          </div>

          <p className="text-sm leading-6 text-[#0B1F3A]/85">
            Our goal is to ensure a transparent and hassle-free refund process.
            For any further assistance, please contact our support team.
          </p>
        </div>
      </section>
    </main>
  );
};

const SectionTitle = ({ number, title }) => (
  <h2 className="mb-5 mt-10 text-xl font-extrabold capitalize tracking-tight text-[#0B1F3A]">
    <span className="mr-2 text-[#D4AF37]">{number}.</span>
    {title}
  </h2>
);

const InfoCard = ({ icon: Icon, title, text }) => (
  <Card className="rounded-sm border-[#E5E5E5] shadow-none transition hover:shadow-sm">
    <CardContent className="flex h-full flex-col items-center p-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8EC]">
        <Icon className="h-8 w-8 text-[#0B1F3A]" />
      </div>

      <h3 className="mt-4 text-sm font-extrabold text-[#0B1F3A]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#0B1F3A]/75">{text}</p>
    </CardContent>
  </Card>
);

export default RefundPolicyPage;