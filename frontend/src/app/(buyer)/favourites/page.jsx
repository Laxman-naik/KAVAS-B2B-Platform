"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ Hook
export const useFavourites = () => {
  const [favourites, setFavourites] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const clearFavourites = () => setFavourites([]);

  return {
    favourites,
    setFavourites,
    clearFavourites,
  };
};

// ✅ Page Component
const Page = () => {
  const router = useRouter();
  const { favourites, clearFavourites } = useFavourites();

  // ✅ Dynamic close function
  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔹 BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 🔹 MODAL */}
      <div className="relative w-full max-w-md sm:max-w-lg mx-3 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* 🔹 HEADER */}
        <div className="flex items-center justify-between px-5 py-4 bg-orange-500 text-white">
          <h2 className="text-lg font-semibold">❤️ My Favourites</h2>

          <button onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* 🔹 CONTENT (MIDDLE LIST ITEMS) */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {favourites.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">❤️</div>
              <p className="text-gray-500">No favourites yet</p>
            </div>
          ) : (
            favourites.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 border-b py-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  {item.price && (
                    <p className="text-xs text-gray-500">
                      ₹ {item.price}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔹 FOOTER */}
        <div className="flex gap-3 p-4 border-t">
          <Button
            className="flex-1 bg-orange-500 text-white"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>

          <Button variant="outline" onClick={clearFavourites}>
            Clear all
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;