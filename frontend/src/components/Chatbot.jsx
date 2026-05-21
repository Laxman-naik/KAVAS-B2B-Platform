"use client";

import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  ShoppingBag,
  FileText,
  UserRound,
  Headphones,
  BadgeHelp,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Warehouse,
  IndianRupee,
} from "lucide-react";

const CUSTOMER_CARE_NUMBER = "+91 98765 43210";
const CUSTOMER_CARE_EMAIL = "support@kavas.com";

const helpTopics = [
  {
    title: "Customer Care",
    icon: Headphones,
    reply: `You can contact KAVAS customer care at ${CUSTOMER_CARE_NUMBER} or mail us at ${CUSTOMER_CARE_EMAIL}.`,
  },
  {
    title: "Orders",
    icon: Package,
    reply:
      "For orders, you can track order status, cancel order, download invoice, check delivery date, or raise an issue from My Orders section.",
  },
  {
    title: "Payments",
    icon: CreditCard,
    reply:
      "For payments, KAVAS supports UPI, cards, net banking, and business payments. If amount is deducted but order failed, refund will be processed after verification.",
  },
  {
    title: "RFQ / Bulk Enquiry",
    icon: FileText,
    reply:
      "For bulk purchase, create an RFQ with product name, quantity, target price, delivery location, and requirements. Vendors can send quotations.",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    reply:
      "You can check product price, MOQ, stock, description, images, specifications, seller details, and bulk pricing on product details page.",
  },
  {
    title: "Shipping",
    icon: Truck,
    reply:
      "You can track delivery from Track Order page. Shipping charges and delivery time depend on product, quantity, seller, and location.",
  },
  {
    title: "Refunds",
    icon: RotateCcw,
    reply:
      "Refunds are processed after cancellation, return approval, or failed payment verification. Usually it may take 3-7 working days.",
  },
  {
    title: "Vendor Support",
    icon: Building2,
    reply:
      "Vendors can manage products, inventory, orders, RFQs, warehouses, payouts, business profile, and GST details from vendor dashboard.",
  },
  {
    title: "Invoice & GST",
    icon: FileText,
    reply:
      "GST invoices are available in My Orders section. You can update GST number and billing address from account or business settings.",
  },
  {
    title: "Account Help",
    icon: UserRound,
    reply:
      "For account help, you can update profile, password, mobile number, email, business details, GST, and address from settings.",
  },
  {
    title: "Payouts",
    icon: IndianRupee,
    reply:
      "Vendor payouts can be checked from vendor payout dashboard. Payouts depend on delivered orders, settlement cycle, and bank verification.",
  },
  {
    title: "Warehouse",
    icon: Warehouse,
    reply:
      "Vendors can add or update warehouse address, pickup location, and stock location from warehouse settings.",
  },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [chats, setChats] = useState([
    {
      sender: "bot",
      text: "Hi 👋 Welcome to KAVAS Help Center. I can help with orders, payments, RFQ, products, shipping, refunds, vendor support, GST, account issues, and customer care.",
    },
  ]);

  const handleTopicClick = (topic) => {
    setChats((prev) => [
      ...prev,
      { sender: "user", text: topic.title },
      { sender: "bot", text: topic.reply },
    ]);
  };

  const getBotReply = (msg) => {
    const text = msg.toLowerCase();

    if (
      text.includes("customer care") ||
      text.includes("contact") ||
      text.includes("phone") ||
      text.includes("mobile") ||
      text.includes("number") ||
      text.includes("call")
    ) {
      return `You can contact KAVAS customer care at ${CUSTOMER_CARE_NUMBER}. You can also email us at ${CUSTOMER_CARE_EMAIL}.`;
    }

    if (
      text.includes("mail") ||
      text.includes("email") ||
      text.includes("support email")
    ) {
      return `KAVAS support email is ${CUSTOMER_CARE_EMAIL}. Please mention your order ID, RFQ ID, or registered mobile number for faster support.`;
    }

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello 👋 How can I help you? You can ask about orders, RFQ, payments, refunds, products, delivery, GST invoice, vendor support, or customer care.";
    }

    if (
      text.includes("order") ||
      text.includes("my order") ||
      text.includes("track order") ||
      text.includes("order status")
    ) {
      return "You can track your order from My Orders or Track Order page. Use your order ID to check status, delivery date, invoice, cancellation, or return option.";
    }

    if (text.includes("cancel") || text.includes("cancel order")) {
      return "To cancel an order, go to My Orders, select the order, and click Cancel Order. Cancellation depends on order status and seller approval.";
    }

    if (
      text.includes("payment") ||
      text.includes("paid") ||
      text.includes("upi") ||
      text.includes("card") ||
      text.includes("net banking") ||
      text.includes("money deducted") ||
      text.includes("transaction")
    ) {
      return "For payment issues, check your payment status in Orders. If money is deducted but order failed, refund will be processed after verification, usually within 3-7 working days.";
    }

    if (
      text.includes("refund") ||
      text.includes("return money") ||
      text.includes("money back")
    ) {
      return "Refunds are processed after cancellation, return approval, or failed payment verification. Refund time is usually 3-7 working days depending on bank/payment method.";
    }

    if (
      text.includes("return") ||
      text.includes("replace") ||
      text.includes("replacement") ||
      text.includes("damaged") ||
      text.includes("wrong product")
    ) {
      return "For return or replacement, open My Orders, select the product, and raise a return request. Share reason like damaged, wrong item, missing item, or quality issue.";
    }

    if (
      text.includes("shipping") ||
      text.includes("delivery") ||
      text.includes("delivered") ||
      text.includes("late") ||
      text.includes("delay")
    ) {
      return "Delivery status is available in Track Order page. Delivery time depends on seller location, stock availability, quantity, and buyer delivery address.";
    }

    if (
      text.includes("product") ||
      text.includes("price") ||
      text.includes("stock") ||
      text.includes("moq") ||
      text.includes("minimum order") ||
      text.includes("specification") ||
      text.includes("specs")
    ) {
      return "Product pages show price, MOQ, stock, specifications, images, seller details, and bulk pricing. For large quantity, you can create RFQ for better quote.";
    }

    if (
      text.includes("rfq") ||
      text.includes("bulk") ||
      text.includes("quotation") ||
      text.includes("quote") ||
      text.includes("enquiry") ||
      text.includes("bulk order")
    ) {
      return "For RFQ or bulk enquiry, enter product name, required quantity, target price, delivery location, and requirements. Vendors can send quotations for your request.";
    }

    if (
      text.includes("vendor") ||
      text.includes("seller") ||
      text.includes("supplier")
    ) {
      return "Vendors can manage products, inventory, orders, RFQs, warehouses, payouts, and business profile from vendor dashboard.";
    }

    if (
      text.includes("add product") ||
      text.includes("upload product") ||
      text.includes("create product")
    ) {
      return "To add product, go to Vendor Dashboard > Products > Add Product. Enter name, category, price, MOQ, stock, description, images, and specifications.";
    }

    if (
      text.includes("inventory") ||
      text.includes("stock update") ||
      text.includes("out of stock")
    ) {
      return "Vendors can update inventory from Vendor Dashboard > Products or Inventory section. Keep stock updated to avoid order issues.";
    }

    if (
      text.includes("payout") ||
      text.includes("settlement") ||
      text.includes("bank")
    ) {
      return "Vendor payouts are available in Payouts section. Settlement depends on delivered orders, return period, and verified bank details.";
    }

    if (
      text.includes("warehouse") ||
      text.includes("pickup") ||
      text.includes("pickup address")
    ) {
      return "Warehouse and pickup address can be managed from Vendor Settings > Warehouses. Add correct address for smooth pickup and delivery.";
    }

    if (
      text.includes("invoice") ||
      text.includes("gst") ||
      text.includes("tax") ||
      text.includes("billing")
    ) {
      return "GST invoice is available in My Orders after order confirmation. You can update GST number and billing address from Account or Business Settings.";
    }

    if (
      text.includes("login") ||
      text.includes("password") ||
      text.includes("forgot password") ||
      text.includes("account") ||
      text.includes("profile")
    ) {
      return "For account help, go to Account Settings. You can update profile, password, mobile number, email, GST details, and business information.";
    }

    if (
      text.includes("business verification") ||
      text.includes("verify business") ||
      text.includes("kyc")
    ) {
      return "Business verification may require GST details, business name, address, and contact information. Vendors can update these from Business Settings.";
    }

    if (
      text.includes("ticket") ||
      text.includes("complaint") ||
      text.includes("issue") ||
      text.includes("problem") ||
      text.includes("support")
    ) {
      return `You can raise a support ticket from Help Center. For urgent support, contact ${CUSTOMER_CARE_NUMBER} or email ${CUSTOMER_CARE_EMAIL}.`;
    }

    if (
      text.includes("website") ||
      text.includes("not working") ||
      text.includes("error") ||
      text.includes("bug") ||
      text.includes("page not loading")
    ) {
      return "For website technical issues, try refreshing, clearing browser cache, or logging in again. If issue continues, raise a support ticket with screenshot.";
    }

    if (
      text.includes("address") ||
      text.includes("change address") ||
      text.includes("delivery address")
    ) {
      return "You can add or update delivery address from Account > Addresses. For already placed orders, address change depends on order status.";
    }

    if (
      text.includes("wishlist") ||
      text.includes("favourite") ||
      text.includes("favorite")
    ) {
      return "You can save products in Wishlist/Favourites and view them later from your account.";
    }

    return `I can help with complete KAVAS B2B support: orders, payments, refunds, returns, RFQ, bulk orders, products, MOQ, GST invoice, delivery, vendor dashboard, payouts, warehouse, account, and customer care. For direct support call ${CUSTOMER_CARE_NUMBER} or email ${CUSTOMER_CARE_EMAIL}.`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChats((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "bot", text: getBotReply(userMessage) },
    ]);

    setMessage("");
  };

  return (
    <>
      {/* CHAT BUTTON */}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 group"
      >
        {/* FIRE / GLOW ANIMATION */}
        <div className="absolute inset-0 rounded-full bg-linear-to-r from-orange-500 via-yellow-400 to-red-500 blur-lg opacity-80 animate-ping"></div>

        {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] via-orange-400 to-red-500 animate-spin"></div> */}

        {/* MAIN LOGO */}
        <div className="relative bg-linear-to-br from-[#0B1F3A] via-[#163B68] to-[#D4AF37] text-white p-5 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-all duration-300">
          <MessageCircle size={20} />
        </div>
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[90vw] sm:w-92.5 max-h-[78vh] bg-white rounded-3xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#0B1F3A] text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#D4AF37] p-2 rounded-full">
                <BadgeHelp size={18} />
              </div>

              <div>
                <h2 className="font-bold text-base">KAVAS Help Center</h2>
                <p className="text-[10px] text-gray-200">
                  B2B Orders • RFQ • Payments • Support
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="hover:rotate-90 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-[#FFF8EC] p-3 border-b">
            <h3 className="font-semibold text-[#0B1F3A] mb-2 text-sm">
              Quick Help Topics
            </h3>

            <div className="grid grid-cols-2 gap-2 max-h-37.5 overflow-y-auto pr-1">
              {helpTopics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <button
                    key={topic.title}
                    onClick={() => handleTopicClick(topic)}
                    className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs hover:bg-[#0B1F3A] hover:text-white transition-all duration-300"
                  >
                    <Icon size={14} />
                    <span>{topic.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-57.5 overflow-y-auto p-3 space-y-2 bg-white">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  chat.sender === "user"
                    ? "bg-[#D4AF37] text-white ml-auto"
                    : "bg-[#F5F5F5] text-gray-800"
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about KAVAS..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border border-gray-300 rounded-2xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />

            <button
              onClick={sendMessage}
              className="bg-[#0B1F3A] text-white px-3 rounded-2xl hover:bg-[#D4AF37] transition-all duration-300"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
