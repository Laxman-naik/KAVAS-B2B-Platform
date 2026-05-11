"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, Info, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-[#E5E5E5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/LOGOKAVAS.png"
              alt="Kavas"
              width={180}
              height={60}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Back Button */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 rounded-md border border-[#D4AF37] px-5 py-2 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#FFF8EC]"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 shadow-sm sm:p-10">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF8EC]">
              <LockKeyhole className="h-9 w-9 text-[#0B1F3A]" />
            </div>

            {/* Heading */}
            <div className="mt-6 text-center">
              <h1 className="text-4xl font-extrabold text-[#0B1F3A]">
                Forgot Password?
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-600">
                No worries! Enter your registered mobile number or email
                address and we'll send you a secure link to reset your
                password.
              </p>
            </div>

            {/* Form */}
            <form className="mt-10 space-y-6">
              {/* Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                  Mobile Number / Email ID
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>

                  <input
                    type="text"
                    placeholder="Enter mobile number or email ID"
                    className="h-14 w-full rounded-xl border border-[#E5E5E5] bg-white pl-12 pr-4 text-sm text-[#1A1A1A] outline-none transition focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                className="h-14 w-full rounded-sm cursor-pointer bg-[#0B1F3A] text-sm font-semibold text-white transition hover:opacity-90"
              >
                Send Reset Link
              </button>

              {/* Divider */}
              {/* <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E5E5E5]" />
                <span className="text-sm text-gray-500">OR</span>
                <div className="h-px flex-1 bg-[#E5E5E5]" />
              </div> */}

              {/* SMS Button */}
              {/* <button
                type="button"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#0B1F3A] bg-white text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#FFF8EC]"
              >
                <Phone size={18} />
                Reset via SMS
              </button> */}
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] p-5">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Info className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  We'll send a secure link to reset your password.
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  The reset link will expire in 15 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 border-t border-[#E5E5E5] pt-6">
            <div className="flex flex-wrap items-center justify-center gap-20 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-[#0B1F3A]">
                Privacy Policy
              </Link>

              <Link
                href="/termsandconditions"
                className="hover:text-[#0B1F3A]"
              >
                Terms & Conditions
              </Link>

              <Link href="#" className="hover:text-[#0B1F3A]">
                Seller Policy
              </Link>

              <Link href="/help" className="hover:text-[#0B1F3A]">
                Help
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Kavas. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}