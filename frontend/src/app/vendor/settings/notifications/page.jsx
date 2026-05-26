"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Truck,
  DollarSign,
  AlertTriangle,
  Star,
  RotateCcw,
  Megaphone,
  ShieldCheck,
  Save,
  RotateCcw as ResetIcon,
} from "lucide-react";

const defaultSettings = [
  {
    id: "new_orders",
    title: "New Orders",
    desc: "When a customer places a new order",
    icon: Bell,
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "payment_updates",
    title: "Payment Updates",
    desc: "When a payment is received or settled",
    icon: DollarSign,
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "shipping_updates",
    title: "Shipping Updates",
    desc: "Order status changes and delivery updates",
    icon: Truck,
    email: true,
    sms: false,
    push: false,
  },
  {
    id: "low_stock_alerts",
    title: "Low Stock Alerts",
    desc: "When products fall below reorder point",
    icon: AlertTriangle,
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "customer_reviews",
    title: "Customer Reviews",
    desc: "When a customer leaves a review or rating",
    icon: Star,
    email: false,
    sms: false,
    push: false,
  },
  {
    id: "return_requests",
    title: "Return Requests",
    desc: "When a customer initiates a return",
    icon: RotateCcw,
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "platform_promotions",
    title: "Platform Promotions",
    desc: "Marketing campaigns and seller promotions",
    icon: Megaphone,
    email: false,
    sms: false,
    push: false,
  },
  {
    id: "account_security",
    title: "Account & Security",
    desc: "Login alerts, password changes, KYC updates",
    icon: ShieldCheck,
    email: true,
    sms: true,
    push: true,
  },
];

const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex h-6 w-12 items-center rounded-sm p-1 transition ${
        enabled ? "bg-[#0B1F3A]" : "bg-gray-300"
      }`}
    >
      <div
        className={`h-4 w-4 rounded-sm bg-white shadow-sm transition ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default function NotificationPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const [digest, setDigest] = useState({
    enabled: true,
    time: "Daily at 8:00 AM",
  });

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    from: "22:00",
    to: "07:00",
  });

  useEffect(() => {
    const stored = localStorage.getItem("vendorNotificationSettings");

    if (stored) {
      const parsed = JSON.parse(stored);

      setSettings(parsed.settings || defaultSettings);
      setDigest(parsed.digest || { enabled: true, time: "Daily at 8:00 AM" });
      setQuietHours(parsed.quietHours || { enabled: true, from: "22:00", to: "07:00" });
    }
  }, []);

  const toggle = (index, field) => {
    setSettings((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: !item[field],
            }
          : item
      )
    );

    setSaved(false);
  };

  const handleSave = () => {
    const data = {
      settings,
      digest,
      quietHours,
    };

    localStorage.setItem("vendorNotificationSettings", JSON.stringify(data));
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setDigest({
      enabled: true,
      time: "Daily at 8:00 AM",
    });
    setQuietHours({
      enabled: true,
      from: "22:00",
      to: "07:00",
    });

    localStorage.removeItem("vendorNotificationSettings");
    setSaved(false);
  };

  return (
    <div className="min-h-screen rounded-sm bg-white p-3 md:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-[#E5E5E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F3A] md:text-2xl">
            Notification Preferences
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose how and when you want to be notified
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-gray-50"
        >
          <ResetIcon size={16} />
          Reset
        </button>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#E5E5E5] bg-white">
        <div className="grid grid-cols-4 border-b border-[#E5E5E5] bg-[#F8FAFC] p-4 text-sm font-semibold text-gray-600">
          <div>Notification</div>
          <div className="text-center">Email</div>
          <div className="text-center">SMS</div>
          <div className="text-center">Push</div>
        </div>

        {settings.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="grid grid-cols-4 items-center border-b border-[#E5E5E5] p-4 transition last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#F8FAFC] text-[#0B1F3A]">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="font-semibold text-[#0B1F3A]">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Toggle enabled={item.email} onChange={() => toggle(i, "email")} />
              </div>

              <div className="flex justify-center">
                <Toggle enabled={item.sms} onChange={() => toggle(i, "sms")} />
              </div>

              <div className="flex justify-center">
                <Toggle enabled={item.push} onChange={() => toggle(i, "push")} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-[#E5E5E5] bg-white p-4">
          <h2 className="mb-3 font-bold text-[#0B1F3A]">Email Digest</h2>

          <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={digest.enabled}
              onChange={(e) => {
                setDigest({ ...digest, enabled: e.target.checked });
                setSaved(false);
              }}
            />
            Enable Daily Digest
          </label>

          <select
            value={digest.time}
            onChange={(e) => {
              setDigest({ ...digest, time: e.target.value });
              setSaved(false);
            }}
            disabled={!digest.enabled}
            className="h-11 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
          >
            <option>Daily at 8:00 AM</option>
            <option>Daily at 12:00 PM</option>
            <option>Daily at 6:00 PM</option>
            <option>Weekly on Monday</option>
          </select>
        </div>

        <div className="rounded-sm border border-[#E5E5E5] bg-white p-4">
          <h2 className="mb-3 font-bold text-[#0B1F3A]">Quiet Hours</h2>

          <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={(e) => {
                setQuietHours({ ...quietHours, enabled: e.target.checked });
                setSaved(false);
              }}
            />
            Enable Quiet Hours
          </label>

          <div className="flex gap-2">
            <input
              type="time"
              value={quietHours.from}
              disabled={!quietHours.enabled}
              onChange={(e) => {
                setQuietHours({ ...quietHours, from: e.target.value });
                setSaved(false);
              }}
              className="h-11 w-1/2 rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />

            <input
              type="time"
              value={quietHours.to}
              disabled={!quietHours.enabled}
              onChange={(e) => {
                setQuietHours({ ...quietHours, to: e.target.value });
                setSaved(false);
              }}
              className="h-11 w-1/2 rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {saved && (
        <div className="mt-5 rounded-sm border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          Notification preferences saved successfully.
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center gap-2 rounded-sm bg-[#0B1F3A] px-6 text-sm font-semibold text-white transition hover:opacity-95"
        >
          <Save size={16} />
          Save Preferences
        </button>
      </div>
    </div>
  );
}