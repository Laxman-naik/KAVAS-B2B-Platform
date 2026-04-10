import {
  Info,
  User,
  ShoppingCart,
  Truck,
  RefreshCcw,
  FileText,
  Phone
} from "lucide-react";

export const helpData = [
  {
    title: "General Questions",
    icon: Info,
    faqs: [
      {
        question: "What is Kavas Wholesale Hub?",
        answer:
          "Kavas Wholesale Hub is a B2B wholesale e-commerce platform connecting manufacturers, wholesalers, and retailers for bulk trade with competitive pricing and verified suppliers."
      },
      {
        question: "Who can buy from Kavas Wholesale Hub?",
        answer:
          "Businesses, wholesalers, retailers, and bulk buyers can register and purchase products."
      }
    ]
  },
  {
    title: "Account & Registration",
    icon: User,
    faqs: [
      {
        question: "Do I need an account to place an order?",
        answer:
          "Yes, a business account is required to access wholesale pricing and place orders."
      },
      {
        question: "How do I create an account?",
        answer:
          "Click Sign Up, enter business details, verify email, and get approval to start buying."
      },
      {
        question: "How long does account approval take?",
        answer:
          "Usually within 24–48 hours."
      }
    ]
  },
  {
    title: "Ordering & Payments",
    icon: ShoppingCart,
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "Browse products, add to cart, select quantity, checkout, and receive confirmation."
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "Bank Transfer, Credit/Debit Cards, UPI, and B2B credit terms for eligible businesses."
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Orders can be cancelled before shipping by contacting support."
      }
    ]
  },
  {
    title: "Shipping & Delivery",
    icon: Truck,
    faqs: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard: 5–10 days, Express: 2–5 days depending on location."
      },
      {
        question: "How can I track my order?",
        answer:
          "Tracking details will be sent via email/SMS and available in My Orders."
      }
    ]
  },
  {
    title: "Returns & Refunds",
    icon: RefreshCcw,
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "Returns accepted only for damaged or incorrect items within 48 hours."
      },
      {
        question: "How long do refunds take?",
        answer:
          "Refunds are processed within 5–10 business days."
      }
    ]
  },
  {
    title: "Additional Information",
    icon: FileText,
    faqs: [
      {
        question: "Do you provide GST invoices?",
        answer:
          "Yes, all orders include GST invoices."
      },
      {
        question: "Is there a minimum order quantity?",
        answer:
          "Yes, MOQ varies by supplier and product."
      },
      {
        question: "Do you offer COD?",
        answer:
          "No, all orders must be prepaid."
      }
    ]
  },
  {
    title: "Contact Support",
    icon: Phone,
    faqs: [
      {
        question: "How can I contact support?",
        answer:
          "Phone: +91 0000000000 | Email: info@kavaswholesalehub.com | Live chat during business hours."
      }
    ]
  }
];