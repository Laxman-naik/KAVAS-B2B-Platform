"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { authapi } from "@/lib/axios";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please enter both passwords");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await authapi.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      setMessage(res.data?.message || "Password reset successfully");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset link expired or password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-sm border border-[#E5E5E5] bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8EC] border border-[#E5E5E5]">
            <LockKeyhole className="h-6 w-6 text-[#0B1F3A]" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#0B1F3A]">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#1A1A1A]">
              New Password
            </label>

            <div className="relative mt-2">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-sm border border-[#E5E5E5] px-3 py-2 pr-10 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1A1A1A]">
              Confirm Password
            </label>

            <input
              type={show ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mt-2 w-full rounded-sm border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600">{error}</p>
          )}

          {message && (
            <p className="text-xs font-semibold text-green-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[#0B1F3A] py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}