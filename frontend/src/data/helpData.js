import {
  CreditCard,
  Package,
  Factory,
  RefreshCcw,
  Lock,
  Crown,
  Wrench,
  Info
} from "lucide-react"
export const helpData = [
  {
    title: "Payments & Billing",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods does Kavas accept?",
        answer:
          "Bank Transfer (NEFT/RTGS), Credit/Debit Cards, UPI, and Kavas Pay Later (up to ₹5 lakhs credit)."
      },
      {
        question: "How do I get GST invoice?",
        answer:
          'Auto-generated in "My Orders" → "Invoices" within 24 hours of delivery.'
      },
      {
        question: "Is my payment secure?",
        answer:
          "PCI-DSS compliant gateways. Escrow protection — funds held until delivery confirmed."
      }
    ]
  },
  {
    title: "Orders & Shipping",
    icon: Package,
    faqs: [
      {
        question: "How do I track my bulk order?",
        answer:
          'Log in → "My Orders". Real-time tracking with courier details and SMS/email updates.'
      },
      {
        question: "What is the typical delivery timeline?",
        answer:
          "3–7 business days. Metro: 3–4 days. Tier-2/3: 5–7 days."
      },
      {
        question: "Can I change delivery address after placing order?",
        answer:
          "Within 2 hours. Contact support@kavas.com immediately."
      }
    ]
  },
  {
    title: "Supplier Queries",
    icon: Factory,
    faqs: [
      {
        question: "How are suppliers verified?",
        answer:
          "3-stage: GST + MSME check, audit, and sample quality testing."
      },
      {
        question: "How do I send an RFQ?",
        answer:
          'Supplier profile → "Send RFQ". Response within 24 hours.'
      }
    ]
  },
  {
    title: "Returns & Disputes",
    icon: RefreshCcw,
    faqs: [
      {
        question: "What is the return policy?",
        answer:
          "7 days for defective/wrong items. No change-of-mind returns."
      },
      {
        question: "How do I initiate a return?",
        answer:
          '"My Orders" → "Return/Replace". Upload photos. Review in 24h.'
      }
    ]
  },
  {
    title: "Account & Security",
    icon: Lock,
    faqs: [
      {
        question: "How do I reset password?",
        answer:
          '"Forgot password" → reset link valid for 30 minutes.'
      },
      {
        question: "How to enable 2FA?",
        answer:
          "Account Settings → Security → Enable 2FA."
      }
    ]
  },
  {
    title: "Membership",
    icon: Crown,
    faqs: [
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes. No cancellation fees."
      },
      {
        question: "Is there a free trial?",
        answer:
          "14-day free Pro trial. No credit card required."
      }
    ]
  },
  {
    title: "Technical Support",
    icon: Wrench,
    faqs: [
      {
        question: "Is there a mobile app?",
        answer:
          'Yes! Search "Kavas Wholesale" on App Store or Play Store.'
      },
      {
        question: "Does Kavas offer API access?",
        answer:
          "Enterprise only. Contact support@kavas.com."
      }
    ]
  },
  {
    title: "General",
    icon: Info,
    faqs: [
      {
        question: "What is Kavas?",
        answer:
          "India's #1 B2B wholesale marketplace connecting suppliers and buyers."
      },
      {
        question: "Is Kavas free to use?",
        answer:
          "Yes. Buyers can use it free. Pro gives extra benefits."
      }
    ]
  }
]