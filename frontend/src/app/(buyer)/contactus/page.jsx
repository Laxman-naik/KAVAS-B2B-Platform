"use client";
import { useState } from "react";
import Link from "next/link";
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
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, } from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-[#0B1F3A] " />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white">
          <p className="text-xs text-white/80 mb-3">
            <Link href="/">
              <span className="hover:text-[#D4AF37]">Home</span>
            </Link>
            <span className="mx-1">››</span>
            <span className="font-semibold">Contact Us</span>
          </p>

          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide">
            WE'RE HERE TO HELP!
          </div>

          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold">Contact Us</h1>

          <p className="mt-2 text-[#D4AF37] text-lg font-bold">
            Get in Touch with KAVAS Wholesale Hub
          </p>

          <p className="mt-3 max-w-2xl text-sm text-white/80">
            We are committed to supporting our customers and business partners.
            Whether you have inquiries related to bulk orders, wholesale partnerships,
            shipping, or technical support, our team is here to assist you.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/75">
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            <span>Trusted by growing businesses across India for reliable wholesale sourcing.</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: <MapPin />,
              title: "Our Address",
              desc: "Manjeera Trinity Corporate, JNTU Road, Kukatpally, Hyderabad, Telangana, India 500072",
              btn: "View on Google Maps",
            },
            {
              icon: <Mail />,
              title: "Email Us",
              desc: "info@kavaswholesalehub.com\nsales@kavaswholesalehub.com\nsupport@kavaswholesalehub.com",
            },
            {
              icon: <Phone />,
              title: "Call Us",
              desc: "+91 6302259849\n Mon - Sat:  9AM - 6PM",
            },
            {
              icon: <MessageCircle />,
              title: "WhatsApp Support",
              desc: "+91 6302259849\n Chat with us on whatsapp for quick assistance",
              btn: "Chat on WhatsApp",
            },
            {
              icon: <Clock />,
              title: "Business Hours",
              desc: "Mon - Sat: 9AM - 6PM",
              close: "Sunday closed",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition h-full"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="h-11 w-11 rounded-sm bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">{item.title}</h3>
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
                    <button
                      className={`rounded-sm px-7 py-2 text-xs font-bold flex items-center justify-center transition ${item.title === "WhatsApp Support"
                          ? "bg-[#16A34A] text-white hover:bg-[#15803D]"
                          : "bg-[#D4AF37] text-[#0B1F3A] hover:opacity-95"
                        }`}
                    >
                      {item.btn}
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM + CATEGORY */}
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
                while submitting your query. We aim to respond within 12 - 24
                business hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="mt-1 w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="mt-1 w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="mt-1 w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Subject / Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option>Select a Category</option>
                      <option>Sales</option>
                      <option>Order & Shipping</option>
                      <option>Technical</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="mt-1 w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="mt-5 flex flex-col items-center">
                  <button type="submit" className="bg-[#0B1F3A] cursor-pointer text-white px-8 py-2.5 rounded-sm font-semibold flex items-center gap-2 hover:opacity-95 transition">
                    <span className="text-base">✈</span> Send Message
                  </button>

                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                    <span>Your information is safe and secure with us.</span>
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
                    className="flex items-start gap-3 py-3 border-b border-white/20 last:border-b-0 hover:bg-white/5 transition cursor-pointer"
                  >
                    <div className="bg-white/10 p-2 rounded-lg">{item.icon}</div>

                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-gray-300">{item.desc}</p>
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
          {/* MAP CARD */}
          <div className="bg-white rounded-sm shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition h-full">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=Hyderabad&zoom=12&size=600x300&markers=color:red%7CHyderabad"
                alt="map"
                className="w-full h-32 object-cover"
              />
              <button className="absolute bottom-2 left-2 bg-black text-white text-xs px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-800 transition">
                <MapPin size={14} /> View Larger Map
              </button>
            </div>
          </div>

          {/* SOCIAL CARD */}
          <div className="bg-white rounded-sm shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition h-full">
            <h3 className="font-semibold text-gray-800 mb-1">
              Connect With Us
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Stay updated with our latest offers and announcements
            </p>

            <div className="flex flex-wrap gap-2">
              <SocialBtn icon={<FaLinkedinIn size={14} />} label="LinkedIn" />
              <SocialBtn icon={<FaFacebookF size={14} />} label="Facebook" />
              <SocialBtn icon={<FaTwitter size={14} />} label="Twitter (X)" />
              <SocialBtn icon={<FaInstagram size={14} />} label="Instagram" />
            </div>
          </div>

          {/* MEETING CARD */}
          <div className="bg-[#0B1F3A] text-white rounded-sm shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-yellow-400" size={18} />
                <h3 className="font-semibold">Schedule a Meeting</h3>
              </div>

              <p className="text-sm text-gray-200 mb-4">
                Need a detailed discussion? Book a one-on-one consultation with
                our team.
              </p>
            </div>

            <button className="bg-yellow-400 text-black text-sm cursor-pointer font-medium px-4 py-2 rounded hover:bg-yellow-300 transition">
              Book an Appointment
            </button>
          </div>

          {/* FAQ CARD */}
          <div className="bg-white rounded-sm shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="text-yellow-500" size={18} />
                <h3 className="font-semibold text-gray-800">
                  Need Quick Help?
                </h3>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                You may also check our FAQ section for answers related to
                orders, payments, shipping, and returns.
              </p>
            </div>

            <button className="border border-yellow-400 text-yellow-500 cursor-pointer text-sm font-medium px-4 py-2 rounded hover:bg-yellow-50 transition">
              View FAQs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* Reusable Social Button */
function SocialBtn({ icon, label }) {
  return (
    <button className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
      {icon}
      {label}
    </button>
  );
}
