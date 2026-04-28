
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, TrendingUp, Boxes } from "lucide-react";

export default function VendorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

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

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFF8EC] to-white">
          <div className="p-10">
            <div className="flex items-start gap-3">
              <Image
                src="/LOGOKAVAS.png"
                alt="KAVAS"
                width={210}
                height={72}
                className="h-12 w-auto"
                priority
              />
              <div className="pt-1">
                <div className="text-sm font-semibold tracking-wide text-[#0B1F3A]">
                  SELLER HUB
                </div>
              </div>
            </div>

            <h1 className="mt-10 text-4xl font-extrabold leading-tight text-[#0B1F3A]">
              Grow Your Business
              <br />
              with Kavas
            </h1>

            <p className="mt-4 max-w-md text-sm text-gray-600">
              List your products, manage orders, track performance and grow your sales — all in one place.
            </p>

            <div className="mt-10 grid gap-5 max-w-md">
              {leftItems.map((x) => {
                const Icon = x.icon;
                return (
                  <div key={x.title} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-sm border border-[#E5E5E5] bg-white shadow-sm flex items-center justify-center">
                      <Icon size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">{x.title}</div>
                      <div className="mt-1 text-xs leading-relaxed text-gray-600">{x.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-10">
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} Kavas. All rights reserved.</div>
          </div>

          <div className="pointer-events-none absolute -bottom-8 -right-10 opacity-[0.12]">
            <Image src="/lotussymbol.png" alt="" width={520} height={520} className="h-auto w-[520px]" />
          </div>
        </aside>

        <main className="flex flex-col">
          <div className="flex items-center justify-between px-6 sm:px-10 py-6">
            <Link href="/vendor" className="lg:hidden flex items-center gap-2">
              <Image
                src="/LOGOKAVAS.png"
                alt="KAVAS"
                width={160}
                height={52}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:block text-xs text-gray-600">New to Kavas?</div>
              <Link
                href="/vendor/vendorregister"
                className="rounded-sm border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-10">
            <div className="w-full max-w-md">
              <div className="rounded-sm border border-[#E5E5E5] bg-white shadow-sm p-6 sm:p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#0B1F3A]">Welcome Back!</h2>
                  <p className="mt-1 text-sm text-gray-600">
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
                        className="w-full h-11 rounded-sm border border-[#E5E5E5] bg-white pl-10 pr-3 text-sm text-[#1A1A1A] outline-none focus:border-[#D4AF37]"
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
                        className="w-full h-11 rounded-sm border border-[#E5E5E5] bg-white pl-10 pr-10 text-sm text-[#1A1A1A] outline-none focus:border-[#D4AF37]"
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
                      <Link href="#" className="text-xs font-semibold text-[#0B1F3A] hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-sm bg-[#0B1F3A] text-white text-sm font-semibold hover:opacity-90"
                  >
                    Login
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                    <div className="text-xs text-gray-500">or</div>
                    <div className="h-px flex-1 bg-[#E5E5E5]" />
                  </div>

                  <button
                    type="button"
                    className="h-11 w-full rounded-sm border border-[#E5E5E5] bg-white text-sm font-semibold text-[#1A1A1A] hover:bg-[#FFF8EC]"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="text-base">G</span>
                      Login with Google
                    </span>
                  </button>
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

