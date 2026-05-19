"use client";

import { useEffect } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function Page() {

  const router = useRouter();

  const params =
    useSearchParams();

  useEffect(() => {

    const accessToken =
      params.get("accessToken");

    const refreshToken =
      params.get("refreshToken");

    const role =
      params.get("role");

    if (
      accessToken &&
      refreshToken
    ) {

      localStorage.setItem(
        `${role}_accessToken`,
        accessToken
      );

      localStorage.setItem(
        `${role}_refreshToken`,
        refreshToken
      );

      localStorage.setItem(
        "role",
        role
      );

      router.push("/");
    }

  }, [params, router]);

  return (
    <div>
      Signing in...
    </div>
  );
}