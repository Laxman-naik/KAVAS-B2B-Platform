"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul@sharmatraders.com",
    phone: "+91 98765 43210",
    bio: "Wholesale supplier of organic food products, spices, and handicrafts based in Delhi. Serving B2B customers across India since 2018.",
    language: "English",
    timezone: "IST (India) — UTC+5:30",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    if (!form.firstName || !form.email) {
      alert("Please fill required fields");
      return;
    }

    console.log("Saved Data:", form);
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className=" min-h-screen p-3 md:p-6"
    >
      <div className="bg-white rounded-sm p-4 md:p-6 shadow-sm max-w-6xl mx-auto">

        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Profile Information
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Manage your personal details and preferences
        </p>

        <div className="bg-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6 hover:shadow-md transition">
          <div className="w-16 h-16 rounded-full bg-[#1E2A38] flex items-center justify-center text-white font-bold text-lg">
            RS
          </div>

          <div>
            <p className="font-medium">Profile Photo</p>
            <p className="text-sm text-gray-500">JPG, PNG. Max 2MB</p>

            <div className="flex gap-3 mt-2">
              <button className="bg-[#1E2A38] text-white px-3 py-1 rounded-md hover:bg-[#2d3b4f] transition">
                Upload New
              </button>
              <button className="text-red-500 hover:underline">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="md:col-span-1">
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
            <p className="text-xs text-gray-400 mt-1">
              This email is used for login and notifications
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600">Bio / About</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="input w-full"
          />
          <div className="text-right text-xs text-gray-400">
            {form.bio.length}/300
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-[#1E2A38] text-white px-5 py-2 rounded-lg hover:bg-[#2d3b4f] transition-all duration-300 hover:scale-105"
          >
            Save Changes
          </button>
        </div>

        {/* Success Message */}
        {saved && (
          <p className="text-green-600 text-sm mt-3 text-right">
            Changes saved successfully!
          </p>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 12px;
          margin-top: 4px;
          outline: none;
          transition: all 0.3s ease;
        }

        .input:focus {
          border-color: #1e2a38;
          box-shadow: 0 0 0 2px rgba(30, 42, 56, 0.1);
        }
      `}</style>
    </motion.div>
  );
}