"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  ChevronDown,
  Clock,
  CreditCard,
  Headphones,
  Mail,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Search,
  User,
} from "lucide-react";

const Page = () => {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [openTopic, setOpenTopic] = useState(0);

  const categories = useMemo(
    () => [
      {
        title: "Orders & Shipping",
        desc: "Track orders, shipping methods, delivery time and more.",
        icon: Package,
      },
      {
        title: "Returns & Refunds",
        desc: "Return process, refund status, eligibility and policies.",
        icon: RotateCcw,
      },
      {
        title: "Payments & Billing",
        desc: "Payment methods, failed payments, invoices and billing help.",
        icon: CreditCard,
      },
      {
        title: "Account & Profile",
        desc: "Manage your account, addresses, security and profile settings.",
        icon: User,
      },
      {
        title: "Products & Categories",
        desc: "Product details, stock availability and category related help.",
        icon: Boxes,
      },
      {
        title: "General Support",
        desc: "Other queries, technical issues and general assistance.",
        icon: Headphones,
      },
    ],
    []
  );

  const topics = useMemo(
    () => [
      {
        q: "How do I place a bulk order?",
        a: "Open the product, check MOQ and price, then add required quantity to cart and proceed to checkout. For large volumes, use Bulk Orders or contact support to assist with supplier coordination.",
      },
      {
        q: "How can I track my order?",
        a: "Go to My Orders and open the order details to view tracking updates. You can also use the Track Order page with your order reference.",
      },
      {
        q: "What are the shipping charges?",
        a: "Shipping charges depend on supplier, weight/volume, and destination. Any shipping fees (if applicable) are shown at checkout before payment.",
      },
      {
        q: "What is your return policy?",
        a: "Return eligibility depends on product category and supplier policy. If the item is eligible, you can raise a return request from the order details page.",
      },
      {
        q: "How do I cancel my order?",
        a: "If the order hasn’t been processed by the supplier, you can cancel it from My Orders. If it’s already shipped, cancellation may not be available.",
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "How long does delivery take?",
        a: "Delivery timelines vary by supplier and destination. You’ll see an estimated delivery date at checkout and in your order tracking.",
      },
      {
        q: "Can I change my order after placing it?",
        a: "If the supplier hasn’t processed the order yet, you may be able to update quantity or cancel. Go to Orders and check the available actions.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We support common payment methods based on availability, including cards and UPI. The available options are shown at checkout.",
      },
      {
        q: "How do I return a product?",
        a: "Open the order, select the item, and choose Return. Follow the prompts to schedule pickup (if available) or to ship back the product.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are typically processed after return verification. The exact time depends on your payment method and bank processing timelines.",
      },
    ],
    []
  );

  const onSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="bg-[#0B1F3A]">
        <div className="w-full mx-auto px-6 sm:px-8 ">

          
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <div className="text-[#D4AF37] text-[11px] font-semibold tracking-wider">
                HELP CENTER
              </div>

              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                How Can We Help You?
              </h1>

              <p className="mt-3 text-white/80 text-sm max-w-lg">
                Find answers to your questions or reach out to us.
              </p>

              <p className="mt-1 text-white/70 text-sm max-w-lg">
                We’re here to help you 24/7.
              </p>
              <form onSubmit={onSearch} className="mt-4 max-w-lg">
                <div className="flex items-stretch rounded-sm overflow-hidden border border-white/15 bg-white">

                  <div className="flex items-center gap-2 px-3 flex-1">
                    <Search size={16} className="text-gray-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search help articles..."
                      className="w-full h-10 text-sm outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 bg-[#D4AF37] text-[#0B1F3A] font-semibold text-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
            <div className="hidden lg:flex justify-end">
              <Image
                src="/headphonesimage.png"
                alt="Help Center"
                width={350}
                height={300}
                priority
                className="object-contain"
              />
            </div>

          </div>
        </div>
      </div>        

      <div className="w-full px-4 sm:px-6 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-10 bg-[#E9DDC9]" />
            <h2 className="text-xl font-bold text-[#0B1F3A]">Help by Category</h2>
            <div className="h-px w-10 bg-[#E9DDC9]" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.title}
                type="button"
                className="text-left rounded-sm bg-white border border-[#E9DDC9] p-4 hover:shadow-sm transition"
              >
                <div className="h-12 w-12 rounded-sm bg-[#FFF8EC] border border-[#E9DDC9] flex items-center justify-center">
                  <Icon size={22} className="text-[#0B1F3A]" />
                </div>
                <div className="mt-3 text-sm font-semibold text-[#0B1F3A]">{c.title}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-gray-600 line-clamp-3">
                  {c.desc}
                </div>
                <div className="mt-3 flex items-center justify-end text-[#0B1F3A]">
                  <ArrowRight size={18} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-sm bg-white border border-[#E9DDC9] overflow-hidden">
            <div className="px-5 py-2  border-[#E9DDC9]">
              <div className="text-[#0B1F3A] font-bold">Popular Topics</div>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                {topics.map((t, idx) => {
                  const isOpen = openTopic === idx;
                  return (
                    <div key={t.q} className="rounded-sm border border-[#E9DDC9] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenTopic((p) => (p === idx ? -1 : idx))}
                        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#0B1F3A] bg-white hover:bg-[#FFF8EC] transition"
                      >
                        <span className="pr-3">{t.q}</span>
                        <span className="h-8 w-8 rounded-sm border border-[#E9DDC9] bg-white flex items-center justify-center shrink-0">
                          <ChevronDown
                            size={16}
                            className={`text-[#0B1F3A] transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                              }`}
                          />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">
                          {t.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-4 w-full flex items-center justify-between rounded-sm bg-[#FFF8EC] border border-[#E9DDC9] px-4 py-3 text-sm font-semibold text-[#0B1F3A]"
              >
                View All Help Articles
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="rounded-sm bg-white border border-[#E9DDC9] overflow-hidden">
            <div className="px-5 py-2 border-[#E9DDC9]">
              <div className="text-[#0B1F3A] font-bold">Frequently Asked Questions</div>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                {faqs.map((f, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={f.q} className="rounded-sm border border-[#E9DDC9] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq((p) => (p === idx ? -1 : idx))}
                        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#0B1F3A] bg-white hover:bg-[#FFF8EC] transition"
                      >
                        <span className="pr-3">{f.q}</span>
                        <span className="h-8 w-8 rounded-sm border border-[#E9DDC9] bg-white flex items-center justify-center shrink-0">
                          {isOpen ? (
                            <Minus size={16} className="text-[#0B1F3A]" />
                          ) : (
                            <Plus size={16} className="text-[#0B1F3A]" />
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">
                          {f.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-4 w-full flex items-center justify-between rounded-sm bg-[#FFF8EC] border border-[#E9DDC9] px-4 py-3 text-sm font-semibold text-[#0B1F3A]"
              >
                View All FAQs
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-16 bg-[#E9DDC9]" />
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1F3A]">
              Still Need Help? Contact Us
            </h3>
            <div className="h-px w-16 bg-[#E9DDC9]" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-sm bg-white border border-[#E9DDC9] p-5 flex flex-col h-full">
            <div>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-sm bg-[#0B1F3A] flex items-center justify-center shrink-0">
                  <MessageCircle size={22} className="text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-bold text-[#0B1F3A]">Live Chat</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Chat with our support team in real-time.
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-auto w-full rounded-sm bg-[#0B1F3A] text-[#FFF8EC] py-2.5 text-sm font-semibold"
            >
              Start Live Chat
            </button>
          </div>

          <div className="rounded-sm bg-white border border-[#E9DDC9] p-5 flex flex-col h-full">
            <div>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-sm bg-[#2E5A3A] flex items-center justify-center shrink-0">
                  <Mail size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-[#0B1F3A]">Email Support</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Drop us an email and we’ll get back to you.
                  </div>
                </div>
              </div>
            </div>
            <a
              href="mailto:support@kavas.com"
              className="mt-auto inline-flex w-full items-center justify-center rounded-sm bg-[#2E5A3A] text-white py-2.5 text-sm font-semibold"
            >
              Send an Email
            </a>
          </div>

          <div className="rounded-sm bg-white border border-[#E9DDC9] p-5 flex flex-col h-full">
            <div>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-sm bg-[#D4AF37] flex items-center justify-center shrink-0">
                  <Phone size={22} className="text-[#0B1F3A]" />
                </div>
                <div>
                  <div className="font-bold text-[#0B1F3A]">Call Us</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Speak with our support executive.
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#0B1F3A]">+91 6302259849</div>
                </div>
              </div>
            </div>
            <a
              href="tel:+916302259849"
              className="mt-auto inline-flex w-full items-center justify-center rounded-sm bg-[#D4AF37] text-[#0B1F3A] py-2.5 text-sm font-semibold"
            >
              Call Now
            </a>
          </div>

          <div className="rounded-sm bg-white border border-[#E9DDC9] p-5 flex flex-col h-full">
            <div>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-sm bg-[#0B1F3A] flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-[#D4AF37]" />
                </div>
                <div>
                  <div className="font-bold text-[#0B1F3A]">Support Hours</div>
                  <div className="mt-1 text-sm text-gray-600">
                    We are available 24/7 to assist you.
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-auto w-full rounded-sm bg-[#0B1F3A] text-[#FFF8EC] py-2.5 text-sm font-semibold"
            >
              24/7 Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;