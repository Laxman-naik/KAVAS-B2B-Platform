"use client";
import { useState } from "react";
import { Lock, Smartphone, Monitor } from "lucide-react";

export default function SecuritySettings() {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    {
      device: "Chrome on Windows",
      location: "Delhi, India",
      status: "Active now",
      current: true,
      icon: <Monitor size={18} />,
    },
    {
      device: "Safari on iPhone",
      location: "Mumbai, India",
      status: "2 hours ago",
      current: false,
      icon: <Smartphone size={18} />,
    },
    {
      device: "Firefox on Mac",
      location: "Bengaluru, India",
      status: "1 day ago",
      current: false,
      icon: <Monitor size={18} />,
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.newPass !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password Updated Successfully!");
  };

  return (
    <div className="min-h-screen bg-white mt-4 rounded-sm p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-semibold">Security Settings</h1>
          <p className="text-gray-500 text-sm">
            Manage your password, 2FA, and active sessions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <h2 className="font-semibold mb-4">Change Password</h2>

          <div className="space-y-4">
            <input
              type="password"
              name="current"
              placeholder="Current Password"
              value={form.current}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="password"
              name="newPass"
              placeholder="New Password"
              value={form.newPass}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <p className="text-xs text-gray-400">
              Min 8 chars, include uppercase, number, symbol
            </p>

            <input
              type="password"
              name="confirm"
              placeholder="Confirm New Password"
              value={form.confirm}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gray-300 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <Lock size={16} />
              Update Password
            </button>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition duration-300">
          <div>
            <h2 className="font-semibold">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500">
              Add an extra layer of security
            </p>
          </div>

          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`px-5 py-2 rounded-lg text-white transition transform hover:scale-105 ${
              twoFA ? "bg-green-500" : "bg-gray-800"
            }`}
          >
            {twoFA ? "Enabled" : "Enable 2FA"}
          </button>
        </div> */}

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Active Sessions</h2>
            <button className="text-red-500 text-sm hover:underline">
              Logout All Others
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 p-2 rounded-md">
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-medium">
                      {s.device}
                      {s.current && (
                        <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          CURRENT
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {s.location} • {s.status}
                    </p>
                  </div>
                </div>

                {!s.current && (
                  <button className="text-sm cursor-pointer text-blue-600 hover:underline">
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}