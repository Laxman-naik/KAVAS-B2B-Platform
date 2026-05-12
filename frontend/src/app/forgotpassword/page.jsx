"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Info, LockKeyhole, Mail, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="w-full px-4 py-2 bg-[#0B1F3A]">
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/LOGOKAVAS.png"
            alt="Kavas Logo"
            width={420}
            height={160}
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            priority
          />

          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-xs text-gray-300">
              Remember your password?
            </p>

            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-sm border border-[#D4AF37] bg-white px-3 py-2 text-xs font-semibold text-[#0B1F3A] transition hover:bg-[#FFF8EC]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-xl overflow-hidden rounded-sm border border-[#E5E5E5] bg-white shadow-lg">
          <div className="px-6 py-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FFF8EC]">
                <LockKeyhole className="h-6 w-6 text-[#0B1F3A]" />
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-[#0B1F3A] sm:text-3xl">
                Forgot Password?
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                No worries! Enter your registered mobile number or email
                address and we will send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-7">
              <label className="text-[13px] font-semibold text-[#1A1A1A]">
                Mobile Number / Email ID
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);

                    if (sent) setSent(false);
                  }}
                  placeholder="Enter mobile number or email ID"
                  className="w-full rounded-sm border border-[#E5E5E5] py-2 pl-10 pr-3 text-sm outline-none transition focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {sent ? (
                <p className="mt-2 text-xs font-semibold text-green-600">
                  Reset link sent (demo). Please check your inbox/SMS.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!identifier.trim()}
                className="mt-5 w-full rounded-sm bg-[#0B1F3A] py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-6 flex items-start gap-3 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 text-[#D4AF37]" />

              <div className="text-xs text-[#1A1A1A]">
                <p className="font-semibold">
                  We will send a secure link to reset your password.
                </p>

                <p className="mt-1 text-[#1A1A1A]/70">
                  The link will expire in 15 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full border-t border-[#E5E5E5] pt-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <button type="button" className="hover:underline">
              Privacy Policy
            </button>

            <span className="text-gray-300">|</span>

            <button type="button" className="hover:underline">
              Terms & Conditions
            </button>

            <span className="text-gray-300">|</span>

            <button type="button" className="hover:underline">
              Seller Policy
            </button>

            <span className="text-gray-300">|</span>

            <button type="button" className="hover:underline">
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}