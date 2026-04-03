"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "@/store/slices/authSlice";

const Login = ({ open, setOpen, setMode, initialEmail = "" }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "", });
  const { loginLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!open) return;
    if (!initialEmail) return;
    setForm((prev) => ({ ...prev, email: initialEmail }));
  }, [open, initialEmail]);

  if (!open) return null;

  // Handle input
  const handleChange = (e) => {setForm({ ...form, [e.target.name]: e.target.value, });};

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginLoading) return;

    const res = await dispatch(loginUserThunk(form));

    if (res.meta.requestStatus === "fulfilled") { setOpen(false); } 
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white relative rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 max-h-[90vh] overflow-y-auto dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="flex justify-center sm:justify-start mb-2">
          <Image
            src="/KAVASlogo.png"
            alt="Kavas Logo"
            width={120}
            height={60}
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <h3 className="text-base sm:text-lg font-semibold">Welcome back</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          Sign in to your Kavas account
        </p>

        {/* Form */}
        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="text-xs sm:text-sm font-medium">
              Email / Vendor ID
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs sm:text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs mt-1">{error.message}</p>
          )}

          {/* Forgot */}
          <div className="text-right">
            <span className="text-xs sm:text-sm text-orange-500 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-1.5 sm:py-2 text-sm font-semibold text-white rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
          >
            {loginLoading ? "Signing in..." : "Sign in to Kavas"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-3 sm:my-4">
          <div className="flex grow h-px bg-gray-200" />
          <span className="mx-2 text-xs sm:text-sm text-gray-400">or</span>
          <div className="flex grow h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full border py-1.5 sm:py-2 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
          Continue with Google
        </button>

        {/* Register */}
        <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4 text-gray-500">
          New?{" "}
          <span
            onClick={() => setMode("register")}
            className="text-orange-500 font-medium hover:underline cursor-pointer"
          >
            Create your account →
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;