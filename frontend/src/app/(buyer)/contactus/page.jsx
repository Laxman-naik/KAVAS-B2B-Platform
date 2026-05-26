"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Handshake,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Tag,
  Truck,
  Wrench,
} from "lucide-react";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const contactCards = [
  {
    icon: <MapPin />,
    title: "Our Address",
    desc: "Manjeera Trinity Corporate, JNTU Road, Kukatpally, Hyderabad, Telangana, India 500072",
    btn: "View on Google Maps",
    link: "https://www.google.com/maps/search/?api=1&query=Manjeera%20Trinity%20Corporate%20JNTU%20Road%20Kukatpally%20Hyderabad%20Telangana%20500072",
  },
  {
    icon: <Mail />,
    title: "Email Us",
    desc: "info@kavaswholesalehub.com\nsales@kavaswholesalehub.com\nsupport@kavaswholesalehub.com",
  },
  {
    icon: <Phone />,
    title: "Call Us",
    desc: "+91 6302259849\nMon - Sat: 9AM - 6PM",
  },
  {
    icon: <MessageCircle />,
    title: "WhatsApp Support",
    desc: "+91 6302259849\nChat with us on WhatsApp for quick assistance",
    btn: "Chat on WhatsApp",
    link: "https://wa.me/916302259849",
  },
  {
    icon: <Clock />,
    title: "Business Hours",
    desc: "Mon - Sat: 9AM - 6PM",
    close: "Sunday Closed",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const phoneNumber = "916302259849";

  const whatsappMessage = `
Hello KAVAS Wholesale Hub,

👤 Name: ${form.name}
📧 Email: ${form.email}
📱 Phone: ${form.phone}
📂 Category: ${form.category}

📝 Message:
${form.message}
`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  window.location.href = whatsappURL;

  setForm({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });
};

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="bg-[#0B1F3A] w-full px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Contact{" "}
                <span className="text-[#D4AF37]">
                  Us
                </span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl font-bold text-[#D4AF37]">
                Get in Touch with KAVAS Wholesale Hub
              </p>

              <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/75 leading-relaxed">
                We are committed to supporting our customers and
                business partners. Whether you have inquiries related
                to bulk orders, wholesale partnerships, shipping,
                or technical support, our team is here to assist you
                with fast and reliable service.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 w-fit backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />

                <span className="text-sm text-white/80">
                  Trusted by growing businesses across India
                  for reliable wholesale sourcing.
                </span>
              </div>
            </div>

            <div className="hidden lg:flex justify-end relative">
              <div className="absolute inset-0 flex justify-end items-center">
                <div className="w-85 h-85 bg-[#D4AF37]/15 rounded-full blur-3xl" />
              </div>

              <Image
                src="/kavasbuilding.png"
                alt="Contact Support"
                width={450}
                height={380}
                priority
                className="relative object-contain -ml-20 drop-shadow-[0_20px_40px_rgba(212,175,55,0.18)] hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {contactCards.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition h-full"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="h-11 w-11 rounded-sm bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center mb-3">
                  {item.icon}
                </div>

                <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 whitespace-pre-line mt-2 leading-relaxed">
                  {item.desc}
                </p>

                {item.close && (
                  <p className="mt-3 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                    {item.close}
                  </p>
                )}

                {item.btn && (
                  <div className="mt-auto pt-4 flex justify-center">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-sm px-7 py-2 text-xs font-bold flex items-center justify-center transition ${
                        item.title === "WhatsApp Support"
                          ? "bg-[#16A34A] text-white hover:bg-[#15803D]"
                          : "bg-[#D4AF37] text-[#0B1F3A] hover:opacity-95"
                      }`}
                    >
                      {item.btn}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold bg-yellow-100 text-yellow-700 inline-block px-3 py-1 rounded-full mb-3">
                SEND US A MESSAGE
              </p>

              <h2 className="text-2xl font-bold text-gray-900">
                We'd Love to Hear From You!
              </h2>

              <p className="text-sm text-gray-500 mt-2 mb-6">
                For faster assistance, please select the appropriate category
                while submitting your query.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  >
                    <option value="">
                      Select a Category
                    </option>

                    <option value="Sales">
                      Sales
                    </option>

                    <option value="Order & Shipping">
                      Order & Shipping
                    </option>

                    <option value="Technical">
                      Technical
                    </option>

                    <option value="Partnership">
                      Partnership
                    </option>
                  </select>
                </div>

                <textarea
                  rows={4}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="mt-4 w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />

                <div className="mt-5 flex flex-col items-center">
                  <button
                    type="submit"
                    className="bg-[#0B1F3A] text-white px-8 py-2.5 rounded-sm font-semibold flex items-center gap-2 hover:opacity-95 transition"
                  >
                    <span>✈</span>
                    Send Message
                  </button>

                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                    Your information is safe and secure with us.
                  </p>
                </div>
              </form>
            </div>

            <div className="bg-[#0B1F3A] text-white rounded-sm p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-yellow-400">
                SELECT A CATEGORY
              </h3>

              <p className="text-xs text-gray-300 mb-4">
                Choose the right department for faster assistance
              </p>

              <div className="space-y-5">
                {[
                  {
                    title: "Sales Inquiries",
                    desc: "Bulk Pricing & Product Details",
                    icon: <Tag className="text-yellow-400" size={18} />,
                  },
                  {
                    title: "Order & Shipping Support",
                    desc: "Delivery & Tracking Issues",
                    icon: <Truck className="text-yellow-400" size={18} />,
                  },
                  {
                    title: "Technical Assistance",
                    desc: "Account & Product Issues",
                    icon: <Wrench className="text-yellow-400" size={18} />,
                  },
                  {
                    title: "Partnership Requests",
                    desc: "Supplier & Distributor Applications",
                    icon: <Handshake className="text-yellow-400" size={18} />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-3 border-b border-white/20 last:border-b-0 hover:bg-white/5 transition"
                  >
                    <div className="bg-white/10 p-2 rounded-lg">
                      {item.icon}
                    </div>

                    <div>
                      <p className="font-semibold text-sm">
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF8EC] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-sm shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition h-full">
            <div className="relative rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Manjeera%20Trinity%20Corporate%20JNTU%20Road%20Kukatpally%20Hyderabad%20Telangana%20500072&z=16&output=embed"
                className="w-full h-32 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Manjeera%20Trinity%20Corporate%20JNTU%20Road%20Kukatpally%20Hyderabad%20Telangana%20500072"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 left-2 bg-black text-white text-xs px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-800 transition"
              >
                <MapPin size={14} />
                View Larger Map
              </a>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-semibold text-[#1A1A1A]">
                Hyderabad Office
              </h3>

              <p className="text-xs text-gray-600 mt-1">
                Hyderabad, Telangana, India
              </p>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition h-full">
            <h3 className="font-semibold text-gray-800 mb-1">
              Connect With Us
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              Stay updated with our latest offers and announcements
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#E5E5E5] px-3 py-1.5 rounded text-sm text-[#0A66C2] hover:bg-[#EAF4FF] transition"
              >
                <FaLinkedinIn size={14} />
                LinkedIn
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#E5E5E5] px-3 py-1.5 rounded text-sm text-[#1877F2] hover:bg-[#EAF2FF] transition"
              >
                <FaFacebookF size={14} />
                Facebook
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#E5E5E5] px-3 py-1.5 rounded text-sm text-black hover:bg-gray-100 transition"
              >
                <FaTwitter size={14} />
                Twitter
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#E5E5E5] px-3 py-1.5 rounded text-sm text-[#E4405F] hover:bg-pink-50 transition"
              >
                <FaInstagram size={14} />
                Instagram
              </a>
            </div>
          </div>

          <div className="bg-[#0B1F3A] text-white rounded-sm shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-yellow-400" size={18} />
                <h3 className="font-semibold">
                  Schedule a Meeting
                </h3>
              </div>

              <p className="text-sm text-gray-200 mb-4">
                Need a detailed discussion? Book a one-on-one consultation.
              </p>
            </div>

            <button className="bg-yellow-400 text-black text-sm font-medium px-4 py-2 rounded hover:bg-yellow-300 transition">
              Book an Appointment
            </button>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="text-yellow-500" size={18} />

                <h3 className="font-semibold text-gray-800">
                  Need Quick Help?
                </h3>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Check our FAQ section for answers related to orders,
                payments, shipping, and returns.
              </p>
            </div>

            <Link
              href="/faqs"
              className="inline-block border border-[#D4AF37] text-[#D4AF37] text-sm font-medium px-4 py-2 rounded hover:bg-[#FFF8EC] transition"
            >
              View FAQs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}