"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Wallet,
  BarChart3,
  Headset,
  BadgeCheck,
  Quote,
} from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();
  const step = 1;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    gstin: "",
    agree: false,
  });

  const whySellItems = useMemo(
    () => [
      {
        icon: BadgeCheck,
        title: "Sell Across India",
        desc: "Reach customers across 19000+ pincodes.",
      },
      {
        icon: Wallet,
        title: "Higher Profits",
        desc: "Low fees and faster growth opportunities.",
      },
      {
        icon: BarChart3,
        title: "Account Management",
        desc: "Track performance and manage operations easily.",
      },
      {
        icon: Headset,
        title: "Dedicated Support",
        desc: "Seller support at every step of the way.",
      },
    ],
    []
  );

  const setValue = (key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const onContinue = (e) => {
    e?.preventDefault?.();
    router.push("/vendor/vendorbusinessdetails");
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F9FF] via-white to-white">
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-sm bg-[#0B1F3A] flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">K</span>
              </div>
              <div className="leading-none">
                <div className="text-sm font-extrabold text-[#0B1F3A]">KAVAS</div>
                <div className="text-[11px] font-semibold tracking-wide text-[#0B1F3A]/80">SELLER HUB</div>
              </div>
            </div>
          </Link>

          <div className="text-xs text-gray-600">
            Already a seller?
            <Link href="/vendor/vendorlogin" className="ml-1 font-semibold text-[#0B1F3A] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="rounded-2xl bg-white shadow-[0_10px_40px_rgba(13,38,76,0.10)] border border-[#E5E5E5] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <section className="lg:col-span-7 p-6 sm:p-10">
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
                Create your Kavas Seller Hub account
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Start selling and grow your business with India&apos;s trusted platform
              </div>

             <div className="mt-6 flex items-center gap-4">
  {/* STEP 1 */}
  <div className="flex items-center gap-2">
    <div
      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
        step === 1
          ? "bg-[#0B1F3A] text-white"
          : "border border-[#E5E5E5] text-gray-500"
      }`}
    >
      1
    </div>
    <div
      className={`text-[11px] font-bold ${
        step === 1 ? "text-[#0B1F3A]" : "text-gray-500"
      }`}
    >
      EMAIL & PASSWORD
    </div>
  </div>

  <div className="h-px flex-1 bg-[#E5E5E5]" />

  {/* STEP 2 */}
  <div className="flex items-center gap-2">
    <div
      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
        step === 2
          ? "bg-[#0B1F3A] text-white"
          : "border border-[#E5E5E5] text-gray-500"
      }`}
    >
      2
    </div>
    <div
      className={`text-[11px] font-bold ${
        step === 2 ? "text-[#0B1F3A]" : "text-gray-500"
      }`}
    >
      BUSINESS DETAILS
    </div>
  </div>

  <div className="h-px flex-1 bg-[#E5E5E5]" />

  {/* STEP 3 */}
  <div className="flex items-center gap-2">
    <div
      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
        step === 3
          ? "bg-[#0B1F3A] text-white"
          : "border border-[#E5E5E5] text-gray-500"
      }`}
    >
      3
    </div>
    <div
      className={`text-[11px] font-bold ${
        step === 3 ? "text-[#0B1F3A]" : "text-gray-500"
      }`}
    >
      STORE & PICKUP DETAILS
    </div>
  </div>
</div>

              <div className="mt-7">
                {step === 1 ? (
                  <form onSubmit={onContinue} className="grid gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={16} />
                      </span>
                      <input
                        value={form.mobile}
                        onChange={setValue("mobile")}
                        placeholder="Enter Mobile Number"
                        className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-24 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B1F3A] hover:underline"
                      >
                        Send OTP
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={16} />
                      </span>
                      <input
                        value={form.email}
                        onChange={setValue("email")}
                        placeholder="Email ID"
                        className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-24 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B1F3A] hover:underline"
                      >
                        Send OTP
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={16} />
                      </span>
                      <input
                        value={form.password}
                        onChange={setValue("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create Password"
                        className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-10 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F3A]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={16} />
                      </span>
                      <input
                        value={form.confirmPassword}
                        onChange={setValue("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-10 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F3A]"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="mt-1 text-[11px] text-gray-500">
                      By continuing, I agree to Kavas Seller Hub&apos;s
                      <span className="mx-1" />
                      <Link href="/termsandconditions" className="font-semibold text-[#0B1F3A] hover:underline">
                        Terms of Use
                      </Link>
                      <span className="mx-1">&amp;</span>
                      <Link href="/privacy" className="font-semibold text-[#0B1F3A] hover:underline">
                        Privacy Policy
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 h-12 w-full rounded-md bg-[#0B1F3A] text-white text-sm font-bold hover:opacity-95 flex items-center justify-center gap-2"
                    >
                      Register &amp; Continue
                      <span className="text-white/90">→</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Building2 size={16} />
                      </span>
                      <input
                        value={form.businessName}
                        onChange={setValue("businessName")}
                        placeholder="Business Name"
                        className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-3 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <select
                      value={form.businessType}
                      onChange={setValue("businessType")}
                      className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                    >
                      <option value="">Business Type</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="wholesaler">Wholesaler</option>
                      <option value="distributor">Distributor</option>
                      <option value="retailer">Retailer</option>
                    </select>

                    <input
                      value={form.gstin}
                      onChange={setValue("gstin")}
                      placeholder="GSTIN (Optional)"
                      className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white px-3 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                    />

                    <button
                      type="submit"
                      className="mt-2 h-12 w-full rounded-md bg-[#0B1F3A] text-white text-sm font-bold hover:opacity-95"
                    >
                      Create Account
                    </button>

                    <button
                      type="button"
                      onClick={onBack}
                      className="w-full text-sm font-semibold text-[#0B1F3A] hover:underline"
                    >
                      ← Back
                    </button>
                  </form>
                )}
              </div>
            </section>

            <aside className="lg:col-span-5 bg-gradient-to-b from-[#E9F4FF] via-[#F3F9FF] to-white p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-[#E5E5E5]">
              <div className="rounded-2xl bg-white border border-[#E5E5E5] shadow-sm p-5 flex gap-4 items-start">
                <div className="h-12 w-12 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center text-[#0B1F3A] font-extrabold">
                  AV
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[#0B1F3A]">
                    <Quote size={18} className="text-[#0B1F3A]" />
                    <div className="text-sm font-bold">Kavas Seller Hub helped me grow</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 leading-relaxed">
                    my business to more categories with consistent growth.
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">— Amit Verma, Kavas Seller</div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(13,38,76,0.18)] border border-[#0B1F3A]/15">
                <div className="bg-[#0B1F3A] px-6 py-5 relative">
                  <div className="text-[11px] font-bold tracking-wide text-white/80">KAVAS SELLER HUB</div>
                  <div className="mt-2 text-2xl font-extrabold leading-tight text-white">
                    GROW <span className="text-[#D4AF37]">FASTER</span>,
                    <br />
                    EARN <span className="text-[#D4AF37]">MORE</span>
                  </div>
                  <div className="mt-2 text-xs text-white/75">
                    List in multiple categories and unlock endless opportunities.
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
                        <BadgeCheck size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">0% Commission</div>
                        <div className="text-[11px] text-white/70">for the first 45 days</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
                        <Wallet size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Low Fees</div>
                        <div className="text-[11px] text-white/70">Big Returns</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
                        <Headset size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Dedicated Support</div>
                        <div className="text-[11px] text-white/70">Every step of the way</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-2 text-xs font-extrabold text-[#0B1F3A] hover:opacity-95"
                  >
                    Start Selling Now
                  </button>

                  <div className="pointer-events-none absolute -right-6 -bottom-10 opacity-20">
                    <Image src="/lotussymbol.png" alt="" width={240} height={240} className="h-auto w-[240px]" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="mt-10">
          <div className="text-center text-lg sm:text-xl font-extrabold text-[#0B1F3A]">
            Why sell on Kavas Seller Hub?
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whySellItems.map((x) => {
              const Icon = x.icon;
              return (
                <div
                  key={x.title}
                  className="rounded-2xl bg-white border border-[#E5E5E5] shadow-sm p-5 text-center"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#0B1F3A]" />
                  </div>
                  <div className="mt-3 text-sm font-extrabold text-[#0B1F3A]">{x.title}</div>
                  <div className="mt-1 text-[11px] text-gray-600 leading-relaxed">{x.desc}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}