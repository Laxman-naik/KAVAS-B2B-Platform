"use client";

import { useEffect } from "react";

import { useRouter }
  from "next/navigation";

import { useDispatch }
  from "react-redux";

import {
  loadUserThunk,
} from "@/store/slices/authSlice";

export default function
GoogleSuccess() {

  const router =
    useRouter();

  const dispatch =
    useDispatch();

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    if (token) {

      localStorage.setItem(
        "accessToken",
        token
      );

      dispatch(
        loadUserThunk()
      )
        .unwrap()
        .then(() => {
          router.push("/");
        })
        .catch(() => {
          router.push("/login");
        });
    }

  }, [dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Logging in...
    </div>
  );
}