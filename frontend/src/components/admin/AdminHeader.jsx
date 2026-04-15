"use client";
 import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, HelpCircle, User, Settings, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutAdminThunk } from "@/store/slices/authSlice";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef(null);

  //  Profile state (persisted)
  const [profile, setProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("profile");
      return saved
        ? JSON.parse(saved)
        : {
            name: "Admin User",
            email: "superadmin@tradehub.com",
            phone: "",
          };
    }

    return {
      name: "Admin User",
      email: "superadmin@tradehub.com",
      phone: "",
    };
  });


  //  SYNC LISTENER
  useEffect(() => {
    const syncProfile = () => {
      const saved = localStorage.getItem("profile");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      setProfile((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(parsed)) {
          return prev;
        }
        return parsed;
      });
    };

    window.addEventListener("profileUpdated", syncProfile);
    return () => window.removeEventListener("profileUpdated", syncProfile);
  }, []);

  //  SAVE + NOTIFY
  useEffect(() => {
    const current = localStorage.getItem("profile");
    const updated = JSON.stringify(profile);

    if (current !== updated) {
      localStorage.setItem("profile", updated);
      window.dispatchEvent(new Event("profileUpdated"));
    }
  }, [profile]);

  // NEW: Listen to Sidebar trigger
  useEffect(() => {
    const openProfileFromSidebar = () => {
      setOpen(true); // open dropdown
    };

    window.addEventListener("openHeaderProfile", openProfileFromSidebar);

    return () => {
      window.removeEventListener("openHeaderProfile", openProfileFromSidebar);
    };
  }, []);

  const title = pathname.split("/").pop() || "dashboard";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
  };

 

const handleLogout = async () => {
  await dispatch(logoutAdminThunk());
  router.push("/admin/login");
};

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-[#0F1E33] border-b border-gray-700 flex items-center justify-between px-4 md:px-6 z-30 text-white">
        <h1 className="text-sm md:text-lg font-semibold capitalize truncate">
          {title}
        </h1>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center bg-[#13263C] px-3 py-1.5 rounded-lg">
            <Search
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent outline-none text-sm px-2 text-white w-24 md:w-40"
              placeholder="Search..."
            />
          </div>

          <Bell className="w-5 h-5" />
          <HelpCircle className="w-5 h-5" />

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setOpen(!open)}
              className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              {initials}
            </div>

            <div
              className={`absolute right-0 mt-3 w-56 bg-[#0F1E33] border border-gray-700 rounded-xl shadow-lg ${
                open ? "block" : "hidden"
              }`}
            >
              <div className="p-3 border-b border-gray-700">
                <p className="text-sm font-semibold">{profile.name}</p>
                <p className="text-xs text-gray-400">{profile.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfile(true);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#13263C]"
              >
                <User className="w-4 h-4" /> My Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#13263C]">
                <Settings className="w-4 h-4" /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-105 bg-[#0F1E33] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                {initials}
              </div>
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className="text-xs text-gray-400">{profile.email}</p>
              </div>
            </div>

            <p className="text-xs text-orange-400 mb-2">EDIT PROFILE</p>

            <input
              className="w-full mb-2 p-2 rounded bg-[#13263C]"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />

            <input
              className="w-full mb-2 p-2 rounded bg-[#13263C]"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <input
              className="w-full mb-2 p-2 rounded bg-[#13263C]"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="Phone"
            />

            <p className="text-xs text-orange-400 mt-4 mb-2">SECURITY</p>

            <input
              type="password"
              className="w-full mb-2 p-2 rounded bg-[#13263C]"
              placeholder="Current password"
            />
            <input
              type="password"
              className="w-full mb-4 p-2 rounded bg-[#13263C]"
              placeholder="New password"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 bg-orange-500 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
