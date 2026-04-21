"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserThunk, loginUserThunk } from "@/store/slices/authSlice";

const Login = ({ open, setOpen, setMode, initialEmail = "" }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!open) return;
    if (!initialEmail) return;
    setForm((prev) => ({ ...prev, email: initialEmail }));
  }, [open, initialEmail]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      const res = await dispatch(loginUserThunk(form));

      if (res.meta.requestStatus === "fulfilled") {
        setOpen(false);
        dispatch(loadUserThunk());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#FFFFFF] relative rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto border border-[#E5E5E5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1A1A1A] z-10"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="w-full bg-[#0B1F3A] py-3 px-4 flex justify-center sm:justify-start rounded-t-2xl">
          <Image
            src="/LOGOKAVAS.png"
            alt="Kavas Logo"
            width={140}
            height={70}
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5 md:p-6 bg-[#FFF8EC]">
          <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
            Welcome back
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Sign in to your Kavas account
          </p>

          <form className="space-y-2" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs sm:text-sm font-medium text-[#1A1A1A]">
                Email / Vendor ID
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-[#1A1A1A]">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-1">
                {typeof error === "string"
                  ? error
                  : error?.message || "Login failed"}
              </p>
            )}

            <div className="text-right">
              <span className="text-xs sm:text-sm text-[#D4AF37] hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-1.5 sm:py-2 text-sm font-semibold text-white rounded-md bg-[#D4AF37] hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to Kavas"}
            </button>
          </form>

          <div className="flex items-center my-3 sm:my-4">
            <div className="flex grow h-px bg-[#E5E5E5]" />
            <span className="mx-2 text-xs sm:text-sm text-gray-400">or</span>
            <div className="flex grow h-px bg-[#E5E5E5]" />
          </div>

          <button className="w-full border border-[#E5E5E5] py-1.5 sm:py-2 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-white">
            Continue with Google
          </button>

          <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4 text-gray-600">
            New?{" "}
            <span
              onClick={() => setMode("register")}
              className="text-[#D4AF37] font-medium hover:underline cursor-pointer"
            >
              Create your account →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;