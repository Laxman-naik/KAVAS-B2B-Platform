"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("role", "buyer");
      localStorage.setItem("buyer_accessToken", token);

      setTimeout(() => {
        router.replace("/");
      }, 500); // reduced to 0.5 sec
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm w-full">
        
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-xl font-bold text-[#0B1F3A]">
          Signing You In
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          Please wait while we securely log you into KAVAS.
        </p>

        <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-[#D4AF37] animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}