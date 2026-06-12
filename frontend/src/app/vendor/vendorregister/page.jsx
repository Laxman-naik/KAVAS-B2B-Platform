"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Lock, Mail, Phone, Wallet, BarChart3, Headset, BadgeCheck, } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendVendorOtp, verifyVendorOtp, registerVendor, } from "../../../store/slices/vendorSlice";

export default function VendorRegisterPage() {
  const router = useRouter();
  const step = 1;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState({ mobile: Array(6).fill(""), });
  const otpRefs = useRef({ mobile: [] });
  const dispatch = useDispatch();

  const { loading, otp, error } = useSelector((state) => state.vendor);

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
    const value =
      e?.target?.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setForm((s) => ({
      ...s,
      [key]: value,
    }));
  };

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return;

    const res = await dispatch(
      sendVendorOtp({ phone: form.mobile })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setOtpDigits({
        mobile: Array(6).fill("")
      });
    }
  };

  const onOtpChange = (channel, index) => (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);

    setOtpDigits((prev) => {
      const next = [...prev[channel]];
      next[index] = val;

      return {
        ...prev,
        [channel]: next,
      };
    });

    if (val && index < 5) {
      otpRefs.current[channel][index + 1]?.focus?.();
    }
  };

  const onOtpKeyDown = (channel, index) => (e) => {
    if (e.key !== "Backspace") return;
    if (otpDigits[channel][index]) return;
    if (index === 0) return;
    otpRefs.current?.[channel]?.[index - 1]?.focus?.();
  };

  const verifyOtp = async () => {
    const code = otpDigits.mobile.join("");

    if (code.length !== 6) return;

    const res = await dispatch(
      verifyVendorOtp({
        phone: form.mobile,
        otp: code,
      })
    );
  };

  const canContinue =
    otp.mobileVerified &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 6;

  const onContinue = async (e) => {
    e.preventDefault();

    const payload = {
      phone: form.mobile,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    const res = await dispatch(registerVendor(payload));

    if (res.meta.requestStatus === "fulfilled") {
      router.push("/vendor/vendorbusinessdetails");
    }
  };

  const onBack = () => {
    router.back();
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-[#0B1F3A] mb-10">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-3">

            <div className="flex items-start gap-3">
              <Image
                src="/LOGOKAVAS.png"
                alt="KAVAS"
                width={210}
                height={72}
                className="h-12 w-auto"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span>Already a seller?</span>

            <Link
              href="/vendor/vendorlogin"
              className="rounded-full bg-white px-5 py-2 font-bold text-[#0B1F3A] shadow-sm transition-all duration-200 hover:bg-[#D4AF37] hover:text-white hover:shadow-md"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-12">
        <div className="rounded-sm bg-white shadow-[0_10px_40px_rgba(13,38,76,0.10)] border border-[#E5E5E5] overflow-hidden">
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
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 1
                      ? "bg-[#0B1F3A] text-white"
                      : "border border-[#E5E5E5] text-gray-500"
                      }`}
                  >
                    1
                  </div>
                  <div
                    className={`text-[11px] font-bold ${step === 1 ? "text-[#0B1F3A]" : "text-gray-500"
                      }`}
                  >
                    EMAIL & PASSWORD
                  </div>
                </div>

                <div className="h-px flex-1 bg-[#E5E5E5]" />

                {/* STEP 2 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 2
                      ? "bg-[#0B1F3A] text-white"
                      : "border border-[#E5E5E5] text-gray-500"
                      }`}
                  >
                    2
                  </div>
                  <div
                    className={`text-[11px] font-bold ${step === 2 ? "text-[#0B1F3A]" : "text-gray-500"
                      }`}
                  >
                    BUSINESS DETAILS
                  </div>
                </div>

                <div className="h-px flex-1 bg-[#E5E5E5]" />

                {/* STEP 3 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 3
                      ? "bg-[#0B1F3A] text-white"
                      : "border border-[#E5E5E5] text-gray-500"
                      }`}
                  >
                    3
                  </div>
                  <div
                    className={`text-[11px] font-bold ${step === 3 ? "text-[#0B1F3A]" : "text-gray-500"
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
                        onClick={sendOtp}
                        disabled={loading || otp.mobileVerified || !/^[6-9]\d{9}$/.test(form.mobile)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B1F3A] hover:underline"
                      >
                        {otp.mobileVerified ? "Verified" : otp?.mobileSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    </div>

                    {otp?.mobileSent && !otp.mobileVerified && (
                      <div className="-mt-1 rounded-md border border-[#E5E5E5] bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[11px] font-semibold text-gray-600">Enter 6-digit OTP</div>
                          <button
                            type="button"
                            onClick={() => verifyOtp("mobile")}
                            disabled={loading || otpDigits.mobile.join("").length !== 6}
                            className={`h-8 rounded-md px-3 text-[11px] font-bold text-white ${otpDigits.mobile.join("").length === 6
                              ? "bg-[#0B1F3A] hover:opacity-95"
                              : "bg-[#0B1F3A]/40 cursor-not-allowed"
                              }`}
                          >
                            Verify
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {otpDigits.mobile.map((d, i) => (
                            <input
                              key={i}
                              inputMode="numeric"
                              value={d}
                              onChange={onOtpChange("mobile", i)}
                              onKeyDown={onOtpKeyDown("mobile", i)}
                              ref={(el) => {
                                otpRefs.current.mobile[i] = el;
                              }}
                              className="h-10 w-10 rounded-md border border-[#E5E5E5] text-center text-sm font-bold text-[#0B1F3A] outline-none focus:border-[#0B1F3A]"
                            />
                          ))}
                        </div>
                      </div>
                    )}


                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={16} />
                      </span>

                      <input
                        type="email"
                        value={form.email}
                        onChange={setValue("email")}
                        placeholder="Email ID"
                        className="w-full h-11 rounded-md border border-[#E5E5E5] bg-white pl-10 pr-3 text-sm text-[#1A1A1A] outline-none focus:border-[#0B1F3A]"
                      />
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
                      disabled={!canContinue || loading.register}
                      className={`mt-2 h-12 w-full rounded-md text-white text-sm font-bold flex items-center justify-center gap-2 ${canContinue ? "bg-[#0B1F3A] hover:opacity-95" : "bg-[#0B1F3A]/40 cursor-not-allowed"
                        }`}
                    >
                      Register &amp; Continue
                      <span className="text-white/90">→</span>
                    </button>
                    {error && (<div className="text-red-500 text-xs mt-2">{typeof error === "string" ? error : error?.message}</div>)}
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

            <aside className="relative lg:col-span-5 bg-[#0B1F3A] p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-[#E5E5E5] overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#102B4D] to-[#061426]" />

              {/* Building image */}
              <div className="absolute bottom-0 left-0 right-0 h-[48%] opacity-75">
                <Image
                  src="/kavas-building.png"
                  alt="Kavas Wholesale Hub Building"
                  fill
                  className="object-cover object-center"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/20 via-[#0B1F3A]/55 to-[#0B1F3A]" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex min-h-[620px] flex-col">
                <Link href="/vendor" className="flex items-center gap-3">
                  <Image
                    src="/LOGOKAVAS.png"
                    alt="KAVAS"
                    width={190}
                    height={65}
                    className="h-14 w-auto"
                    priority
                  />
                </Link>

                <div className="mt-10">

                  <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
                    GROW YOUR
                    <br />
                    WHOLESALE BUSINESS
                    <br />
                    <span className="text-[#D4AF37]">FASTER</span>
                  </h2>

                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                    List your products, reach more buyers, manage orders, and grow your
                    business with Kavas Seller Hub.
                  </p>
                </div>

                <div className="mt-7 grid gap-4">
                  <div className="flex items-start gap-3 rounded-sm border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <BadgeCheck size={17} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">0% Commission</div>
                      <div className="text-xs text-white/70">for the first 45 days</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-sm border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Wallet size={17} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Low Fees</div>
                      <div className="text-xs text-white/70">Big returns for sellers</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-sm border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Headset size={17} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Dedicated Support</div>
                      <div className="text-xs text-white/70">Support at every step</div>
                    </div>
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