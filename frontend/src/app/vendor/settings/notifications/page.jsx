"use client";
import { useState } from "react";
import {
  Bell,
  Truck,
  DollarSign,
  AlertTriangle,
  Star,
  RotateCcw,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-[#1F2937]" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default function NotificationPage() {
  const [settings, setSettings] = useState([
    {
      title: "New Orders",
      desc: "When a customer places a new order",
      icon: <Bell size={18} />,
      email: true,
      sms: true,
      push: true,
    },
    {
      title: "Payment Updates",
      desc: "When a payment is received or settled",
      icon: <DollarSign size={18} />,
      email: true,
      sms: false,
      push: true,
    },
    {
      title: "Shipping Updates",
      desc: "Order status changes and delivery updates",
      icon: <Truck size={18} />,
      email: true,
      sms: false,
      push: false,
    },
    {
      title: "Low Stock Alerts",
      desc: "When products fall below reorder point",
      icon: <AlertTriangle size={18} />,
      email: true,
      sms: true,
      push: true,
    },
    {
      title: "Customer Reviews",
      desc: "When a customer leaves a review or rating",
      icon: <Star size={18} />,
      email: false,
      sms: false,
      push: false,
    },
    {
      title: "Return Requests",
      desc: "When a customer initiates a return",
      icon: <RotateCcw size={18} />,
      email: true,
      sms: true,
      push: true,
    },
    {
      title: "Platform Promotions",
      desc: "Marketing campaigns and seller promotions",
      icon: <Megaphone size={18} />,
      email: false,
      sms: false,
      push: false,
    },
    {
      title: "Account & Security",
      desc: "Login alerts, password changes, KYC updates",
      icon: <ShieldCheck size={18} />,
      email: true,
      sms: true,
      push: true,
    },
  ]);

  const toggle = (index, field) => {
    const updated = [...settings];
    updated[index][field] = !updated[index][field];
    setSettings(updated);
  };

  return (
    <div className="p-2 md:p-6 mt-3 bg-white rounded-sm min-h-screen">
      <div className="mb-2">
        <h1 className="text-xl md:text-2xl font-semibold">
          Notification Preferences
        </h1>
        <p className="text-gray-500 text-sm">
          Choose how and when you want to be notified
        </p>
      </div>

      <div className="bg-white rounded-sm border overflow-hidden">
        <div className="grid grid-cols-4 p-4 text-sm font-medium text-gray-500 border-b">
          <div>Notification</div>
          <div className="text-center">Email</div>
          <div className="text-center">SMS</div>
          <div className="text-center">Push</div>
        </div>

        {settings.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center p-4 border-b hover:bg-gray-50 transition"
          >
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-gray-100 rounded-sm">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Toggle
                enabled={item.email}
                onChange={() => toggle(i, "email")}
              />
            </div>

            <div className="flex justify-center">
              <Toggle
                enabled={item.sms}
                onChange={() => toggle(i, "sms")}
              />
            </div>

            <div className="flex justify-center">
              <Toggle
                enabled={item.push}
                onChange={() => toggle(i, "push")}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-sm border">
          <h2 className="font-semibold mb-3">Email Digest</h2>
          <label className="flex items-center gap-2 mb-3">
            <input type="checkbox" defaultChecked /> Enable Daily Digest
          </label>
          <select className="w-full border rounded-lg p-2">
            <option>Daily at 8:00 AM</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-sm border">
          <h2 className="font-semibold mb-3">Quiet Hours</h2>
          <label className="flex items-center gap-2 mb-3">
            <input type="checkbox" defaultChecked /> Enable Quiet Hours
          </label>
          <div className="flex gap-2">
            <input className="w-1/2 border p-2 rounded-lg" defaultValue="22:00" />
            <input className="w-1/2 border p-2 rounded-lg" defaultValue="07:00" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-[#1F2937] cursor-pointer text-white px-6 py-3 rounded-sm hover:bg-black transition">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
