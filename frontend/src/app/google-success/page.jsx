"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("role", "buyer");
    localStorage.setItem("buyer_accessToken", token);

    router.replace("/");
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">
          Logging you in...
        </h1>
        <p className="text-gray-600 mt-2">Please wait</p>
      </div>
    </div>
  );
}