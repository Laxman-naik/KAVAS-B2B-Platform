"use client";
import { useState } from "react";
import { Tag, Truck, Wrench, Handshake } from "lucide-react";
import {MapPin,Mail,Phone,Clock,Send,MessageCircle,ArrowRight,} from "lucide-react";
import {Linkedin,Facebook,Twitter,Instagram,Calendar,HelpCircle,} from "lucide-react";
import {FaFacebookF,FaTwitter,FaInstagram,FaLinkedinIn,} from "react-icons/fa";

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
    <div className="bg-pink-100 min-h-screen">
      {/* HERO */}
      <div className="relative bg-gradient-to-r from-[#0b1d3a] to-[#020617] text-white px-6 md:px-20 py-12  ">
        <p className="text-xs bg-yellow-500 text-black inline-block px-3 py-1 rounded-full font-semibold mb-3">
          WE'RE HERE TO HELP!
        </p>

        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>

        <p className="text-yellow-400 text-lg mt-1">
          Get in Touch with KAVAS Wholesale Hub
        </p>

        <p className="text-gray-300 mt-2 max-w-xl text-sm">
          We are committed to supporting our customers and business partners.
          Whether you have inquiries related to bulk orders, partnerships,
          shipping, or technical support — our team is here to assist.
        </p>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5  px-5 md:px-20 mt-6">
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
            title: "WhatsApp",
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
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="text-yellow-500  mb-3">{item.icon}</div>
            <h3 className="font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-800 whitespace-pre-line mt-1">
              {item.desc}
            </p>
            <p className="bg-pink-400 text-pink-800 border rounded-xl text-center mt-2">
              {item.close}
            </p>

            {item.btn && (
              <button className="mt-3 text-sm bg-amber-200 text-black border rounded-xl p-1.5 text-yellow-600 font-medium hover:underline">
                {item.btn}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FORM + CATEGORY */}
      <div className="bg-pink-100 py-5 px-4 md:px-12">
        <div className="w-340 mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10 grid lg:grid-cols-3 gap-8">
          {/* LEFT FORM */}
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

            <div className="grid md:grid-cols-2 gap-4">
              {/* FULL NAME */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Subject / Category <span className="text-red-500">*</span>
                </label>
                <select className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option>Select a Category</option>
                  <option>Sales</option>
                  <option>Order & Shipping</option>
                  <option>Technical</option>
                  <option>Partnership</option>
                </select>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Tell us how we can help you..."
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* BUTTON */}
            {/* BUTTON */}
            <div className="mt-6 flex flex-col items-center">
              <button className="bg-[#0b1d3a] cursor-pointer text-white px-8 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#09152b] transition">
                ✈ Send Message
              </button>

              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                🔒 Your information is safe and secure with us.
              </p>
            </div>
          </div>

          {/* RIGHT CATEGORY PANEL */}
          <div className="bg-[#0b1d3a] text-white rounded-xl p-6 shadow-md">
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
                  className="flex items-start gap-3 border border-[#1e3a5f] rounded-lg p-4 hover:bg-[#112b57] transition cursor-pointer"
                >
                  {/* ICON BOX */}
                  <div className="bg-[#132f55] p-2 rounded-md">{item.icon}</div>

                  {/* TEXT */}
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

      <div className="w-full bg-pink-100 bg-[#f5f1ea] py-6 px-4">
        <div className="w-340 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {/* MAP CARD */}
          <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-xl hover:-translate-y-1 transition">
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
          <div className="bg-white rounded-xl shadow-sm p-4  hover:shadow-xl hover:-translate-y-1 transition">
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
          <div className="bg-[#0b2a4a] text-white rounded-xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between">
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
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between">
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
    <button className="flex items-center gap-1 border rounded-md px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 transition">
      {icon}
      {label}
    </button>
  );
}
