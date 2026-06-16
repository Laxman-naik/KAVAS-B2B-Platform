"use client";

import { useMemo, useState } from "react";
import {
  Lock,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const SecuritySettings = () => {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [twoFA, setTwoFA] = useState(false);
  const [message, setMessage] = useState("");

  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Delhi, India",
      status: "Active now",
      current: true,
      type: "desktop",
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Mumbai, India",
      status: "2 hours ago",
      current: false,
      type: "mobile",
    },
    {
      id: 3,
      device: "Firefox on Mac",
      location: "Bengaluru, India",
      status: "1 day ago",
      current: false,
      type: "desktop",
    },
  ]);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (form.newPass.length >= 8) score++;
    if (/[A-Z]/.test(form.newPass)) score++;
    if (/[0-9]/.test(form.newPass)) score++;
    if (/[^A-Za-z0-9]/.test(form.newPass)) score++;

    if (!form.newPass) return "";
    if (score <= 1) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  }, [form.newPass]);

  const strengthClass =
    passwordStrength === "Strong"
      ? "text-green-600"
      : passwordStrength === "Medium"
      ? "text-yellow-600"
      : "text-red-600";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (form.newPass.length < 8) {
      setMessage("New password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(form.newPass)) {
      setMessage("New password must include one uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(form.newPass)) {
      setMessage("New password must include one number.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(form.newPass)) {
      setMessage("New password must include one symbol.");
      return;
    }

    if (form.newPass !== form.confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setForm({
      current: "",
      newPass: "",
      confirm: "",
    });

    setMessage("Password updated successfully.");
  };

  const logoutSession = (id) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    setMessage("Session logged out successfully.");
  };

  const logoutAllOthers = () => {
    setSessions((prev) => prev.filter((session) => session.current));
    setMessage("All other sessions logged out successfully.");
  };

  return (
    <div className="min-h-screen rounded-sm bg-white p-3 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="border-b border-[#E5E5E5] pb-4">
          <h1 className="text-xl font-bold text-[#0B1F3A] md:text-2xl">
            Security Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your password, 2FA, and active sessions
          </p>
        </div>

        <div className="rounded-sm border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#F8FAFC] text-[#0B1F3A]">
              <Lock size={18} />
            </div>

            <div>
              <h2 className="font-bold text-[#0B1F3A]">Change Password</h2>
              <p className="text-sm text-gray-500">
                Use a strong password to protect your seller account
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <PasswordInput
              label="Current Password"
              name="current"
              value={form.current}
              placeholder="Enter current password"
              showPassword={showPassword}
              handleChange={handleChange}
              toggleShowPassword={toggleShowPassword}
            />

            <PasswordInput
              label="New Password"
              name="newPass"
              value={form.newPass}
              placeholder="Enter new password"
              showPassword={showPassword}
              handleChange={handleChange}
              toggleShowPassword={toggleShowPassword}
            />

            {form.newPass && (
              <p className={`text-xs font-semibold ${strengthClass}`}>
                Password Strength: {passwordStrength}
              </p>
            )}

            <p className="text-xs text-gray-400">
              Minimum 8 characters with uppercase, number, and symbol.
            </p>

            <PasswordInput
              label="Confirm New Password"
              name="confirm"
              value={form.confirm}
              placeholder="Confirm new password"
              showPassword={showPassword}
              handleChange={handleChange}
              toggleShowPassword={toggleShowPassword}
            />

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-10 items-center gap-2 rounded-sm bg-[#0B1F3A] px-5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <Lock size={16} />
                Update Password
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#F8FAFC] text-[#0B1F3A]">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2 className="font-bold text-[#0B1F3A]">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTwoFA(!twoFA);
                setMessage(
                  !twoFA
                    ? "Two-factor authentication enabled."
                    : "Two-factor authentication disabled."
                );
              }}
              className={`h-10 rounded-sm px-5 text-sm font-semibold text-white transition hover:opacity-95 ${
                twoFA ? "bg-green-600" : "bg-[#0B1F3A]"
              }`}
            >
              {twoFA ? "Enabled" : "Enable 2FA"}
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#0B1F3A]">Active Sessions</h2>
              <p className="text-sm text-gray-500">
                Review and manage devices currently signed in
              </p>
            </div>

            <button
              type="button"
              onClick={logoutAllOthers}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout All Others
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => {
              const Icon = session.type === "mobile" ? Smartphone : Monitor;

              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 rounded-sm border border-[#E5E5E5] p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#F8FAFC] text-[#0B1F3A]">
                      <Icon size={18} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#0B1F3A]">
                          {session.device}
                        </p>

                        {session.current && (
                          <span className="rounded-sm bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            CURRENT
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        {session.location} • {session.status}
                      </p>
                    </div>
                  </div>

                  {!session.current && (
                    <button
                      type="button"
                      onClick={() => logoutSession(session.id)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Logout
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {message && (
          <div
            className={`rounded-sm border p-3 text-sm font-medium ${
              message.includes("successfully") || message.includes("enabled")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  placeholder,
  showPassword,
  handleChange,
  toggleShowPassword,
}) => {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <div className="relative mt-2">
        <input
          type={showPassword[name] ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="h-11 w-full rounded-sm border border-[#E5E5E5] px-3 pr-10 text-sm outline-none transition focus:border-[#0B1F3A]"
        />

        <button
          type="button"
          onClick={() => toggleShowPassword(name)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F3A]"
        >
          {showPassword[name] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;