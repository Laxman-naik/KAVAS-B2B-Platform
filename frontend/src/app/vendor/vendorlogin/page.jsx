"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, TrendingUp, Boxes } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginVendor } from "@/store/slices/vendorSlice";

export default function VendorLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const blockedStatuses = ["in_review", "pending", "kyc_pending"];

  const leftItems = useMemo(
    () => [
      {
        icon: TrendingUp,
        title: "Increase Sales",
        desc: "Reach millions of customers across India.",
      },
      {
        icon: Boxes,
        title: "Easy Management",
        desc: "Manage catalog, inventory, orders and more in a few clicks.",
      },
      {
        icon: ShieldCheck,
        title: "Secure & Reliable",
        desc: "Safe payments and secure account management.",
      },
    ],
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const payload = {
        password,
        ...(identifier.includes("@")
          ? { email: identifier }
          : { phone: identifier }),
      };

      const data = await dispatch(loginVendor(payload)).unwrap();

      console.log("LOGIN RESPONSE:", data);

      if (!data) {
        setError("Empty response from server");
        return;
      }

      const {
        status,
        onboarding_step,
        next_action,
        vendor,
        message,
      } = data;

      // 🚨 safety guard
      if (!status) {
        setError("Missing status from backend response");
        return;
      }

      if (status === "in_review") {
        alert("Your application is under review. Please wait for admin approval.");
        return;
      }

      if (status === "kyc_pending") {
        alert("Your KYC is pending. admin will contact you.");
        return;
      }

      if (status === "rejected") {
        alert(`Your application was rejected. Reason: ${rejection_reason || "Not provided"}`);
        return;
      }

      if (status === "approved") {
        router.push("/vendor/dashboard");
      }

      if (status === "rejected") {
        router.push("/vendor/rejected");
        return;
      }

      if (status === "draft") {
        if (onboarding_step === 1) {
          router.push("/vendor/vendorbusinessdetails");
          return;
        }

        if (onboarding_step === 2) {
          router.push("/vendor/vendorstoredetails");
          return;
        }

        router.push("/vendor/vendorbusinessdetails");
        return;
      }

      router.push("/vendor/dashboard");

    } catch (err) {

      const msg =
        err?.data?.message ||
        err?.payload?.message ||
        err?.message ||
        err ||
        null;

      setError(msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#061A33] via-[#0B1F3A] to-[#061A33]">
          <div className="p-10">
            <div className="flex items-start gap-3">
              <Image
                src="/LOGOKAVAS.png"
                alt="KAVAS"
                width={210}
                height={72}
                className="h-12 w-auto object-contain"
                priority
              />
              <div className="pt-1">
                <div className="text-sm font-semibold tracking-wide text-white/90">
                  SELLER HUB
                </div>
              </div>
            </div>

            <h1 className="mt-12 text-4xl font-extrabold leading-tight text-white">
              Grow Your Business
              <br />
              with Kavas
            </h1>

            <p className="mt-4 max-w-md text-sm text-white/70">
              List your products, manage orders, track performance and grow your sales — all in one place.
            </p>

            <div className="mt-10 grid gap-5 max-w-md">
              {leftItems.map((x) => {
                const Icon = x.icon;
                return (
                  <div key={x.title} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-sm border border-white/15 bg-white/10 shadow-sm flex items-center justify-center">
                      <Icon size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{x.title}</div>
                      <div className="mt-1 text-xs leading-relaxed text-white/70">{x.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative p-10">
            <div className="absolute bottom-8 left-10 z-10 text-xs text-white/60">© {new Date().getFullYear()} Kavas. All rights reserved.</div>

            <div className="pointer-events-none absolute bottom-0 right-10 opacity-95">
              <div className="absolute right-6 bottom-12 h-32 w-52 opacity-60">
                <div className="h-full w-full rounded-sm bg-[radial-gradient(circle,rgba(212,175,55,0.25)_1px,transparent_1px)] [background-size:10px_10px]" />
              </div>

              <Image
                src="/vendorloginimage.png"
                alt=""
                width={860}
                height={600}
                className="h-80 w-auto object-contain"
              />
            </div>
          </div>
        </aside>

        <main className="flex flex-col bg-[#FFF8EC]">
          <div className="flex items-center justify-between px-6 sm:px-10 py-5">
            <Link href="/vendor" className="lg:hidden flex items-center gap-2">
              <Image
                src="/LOGOKAVAS.png"
                alt="KAVAS"
                width={160}
                height={52}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:block text-xs text-gray-600">New to Kavas?</div>
              <Link
                href="/vendor/vendorregister"
                className="rounded-sm bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:opacity-95"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-8">
            <div className="w-full max-w-md">
              <div className="rounded-sm border border-[#E5E5E5] bg-white shadow-lg p-6 sm:p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-[#0B1F3A]">Welcome Back!</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Login to your Kavas Seller Hub account
                  </p>
                </div>

                <form onSubmit={onSubmit} className="mt-8 grid gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]">
                      Mobile Number / Email ID
                    </label>
                    <div className="mt-2 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={16} />
                      </span>
                      <input
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter mobile number or email ID"
                        className="w-full h-11 rounded-sm border border-[#E5E5E5] bg-white pl-10 pr-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]">Password</label>
                    <div className="mt-2 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={16} />
                      </span>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full h-11 rounded-sm border border-[#E5E5E5] bg-white pl-10 pr-10 text-sm text-[#1A1A1A] outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40"
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
                    <div className="mt-2 text-right">
                      <a
                        href="/forgotpassword"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#D4AF37] hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-sm bg-[#0B1F3A] text-white text-sm font-semibold transition hover:opacity-95 disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  {error && (
                    <div className="mt-4 text-sm text-red-500 text-center">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-8">
            <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500">
              <div className="hidden lg:block">&nbsp;</div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/privacy" className="hover:text-[#0B1F3A]">
                  Privacy Policy
                </Link>
                <Link href="/termsandconditions" className="hover:text-[#0B1F3A]">
                  Terms & Conditions
                </Link>
                <a href="#" className="hover:text-[#0B1F3A]">
                  Seller Policy
                </a>
                <Link href="/help" className="hover:text-[#0B1F3A]">
                  Help
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
