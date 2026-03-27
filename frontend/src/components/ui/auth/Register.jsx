"use client";
import Image from "next/image";
import { X, Eye } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/services/authService";

const Register = ({ open, setOpen, setMode, onRegistered }) => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: "buyer",
      });

      if (typeof onRegistered === "function") {
        onRegistered({ email: form.email });
      }

      setMode("login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4" onClick={() => setOpen(false)}>
      <div className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setOpen(false)}className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-black z-10"><X size={18} /></button>
        <div className="flex justify-start mb-2 sm:mb-3">
          <Image src="/KAVASlogo.png" alt="KAVAS Logo" width={140} height={60} className="h-10 sm:h-12 md:h-14 w-auto object-contain"/>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">Create free account</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Join 50,000+ businesses on Kavas</p>
        <form className="space-y-2 sm:space-y-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="text-xs sm:text-sm font-medium">First name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="Rahul" className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"/>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium">Last name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Sharma" className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"/>
            </div>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium">Email *</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@company.com" className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:ring-1 focus:ring-orange-500 outline-none"/>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium">Phone number *</label>
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+91 98765 43210" className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:ring-1 focus:ring-orange-500 outline-none"/>
          </div>
          <div className="relative">
            <label className="text-xs sm:text-sm font-medium">Create password *</label>
            <input name="password" value={form.password} onChange={handleChange} type={show ? "text" : "password"} placeholder="Min. 6 characters" className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm pr-10 focus:ring-1 focus:ring-orange-500 outline-none"/>
            <Eye onClick={() => setShow(!show)} size={16} className="absolute right-3 top-8 sm:top-9 text-gray-400"/>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium">Confirm password *</label>
            <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type={show ? "text" : "password"} placeholder="Re-enter password" className="w-full mt-0.5 px-3 py-1.5 sm:py-2 border rounded-md text-sm focus:ring-1 focus:ring-orange-500 outline-none"/>
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <button disabled={loading} type="submit" className="w-full py-2 sm:py-2.5 text-sm font-semibold text-white rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-60">
            {loading ? "Creating account..." : "Create free account →"}
          </button>
        </form>
        <p className="text-[11px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">By joining you agree to our{" "}
          <span className="text-orange-500 cursor-pointer">Terms</span>. Already have an account?{" "}
          <span onClick={() => setMode("login")} className="text-orange-500 font-medium cursor-pointer">Sign in →</span>
        </p>
      </div>
    </div>
  );
};

export default Register;