"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorme } from "@/store/slices/vendorSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();

  const vendor = useSelector((state) => state.vendor.vendor);
  const loading = useSelector((state) => state.vendor.loading);

  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    language: "English",
    timezone: "IST (India) — UTC+5:30",
  });

  useEffect(() => {
    dispatch(fetchVendorme());
  }, [dispatch]);

  const fullName = useMemo(() => {
    return (
      vendor?.name ||
      vendor?.full_name ||
      vendor?.business_name ||
      vendor?.email?.split("@")[0] ||
      ""
    );
  }, [vendor]);

  useEffect(() => {
    if (!vendor) return;

    const savedProfile = JSON.parse(
      localStorage.getItem("vendorProfileData") || "{}"
    );

    const nameParts = fullName.trim().split(" ");

    setForm({
      firstName: savedProfile.firstName || vendor?.first_name || nameParts[0] || "",
      lastName:
        savedProfile.lastName ||
        vendor?.last_name ||
        nameParts.slice(1).join(" ") ||
        "",
      email: vendor?.email || savedProfile.email || "",
      phone: vendor?.phone || vendor?.mobile || savedProfile.phone || "",
      bio:
        savedProfile.bio ||
        vendor?.bio ||
        "Tell customers about your business, products, and services.",
      language: savedProfile.language || "English",
      timezone: savedProfile.timezone || "IST (India) — UTC+5:30",
    });

    setProfilePic(savedProfile.profilePic || vendor?.profile_image || null);
  }, [vendor, fullName]);

  const initials = useMemo(() => {
    const first = form.firstName?.charAt(0) || "";
    const last = form.lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [form.firstName, form.lastName]);

  const handleChange = (e) => {
    if (!isEditing) return;

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    if (!isEditing) return;

    if (!form.firstName.trim()) {
      alert("Please enter first name");
      return;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return;
    }

    const dataToSave = {
      ...form,
      profilePic,
    };

    localStorage.setItem("vendorProfileData", JSON.stringify(dataToSave));

    setSaved(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedProfile = JSON.parse(
      localStorage.getItem("vendorProfileData") || "{}"
    );

    const nameParts = fullName.trim().split(" ");

    setForm({
      firstName: savedProfile.firstName || vendor?.first_name || nameParts[0] || "",
      lastName:
        savedProfile.lastName ||
        vendor?.last_name ||
        nameParts.slice(1).join(" ") ||
        "",
      email: vendor?.email || savedProfile.email || "",
      phone: vendor?.phone || vendor?.mobile || savedProfile.phone || "",
      bio:
        savedProfile.bio ||
        vendor?.bio ||
        "Tell customers about your business, products, and services.",
      language: savedProfile.language || "English",
      timezone: savedProfile.timezone || "IST (India) — UTC+5:30",
    });

    setProfilePic(savedProfile.profilePic || vendor?.profile_image || null);
    setIsEditing(false);
    setSaved(false);
  };

  const handleImageUpload = (e) => {
    if (!isEditing) return;

    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be below 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
      setSaved(false);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (!isEditing) return;
    setProfilePic(null);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-white p-3 md:p-6">
      <div className="mx-auto max-w-6xl rounded-sm border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 border-b border-[#E5E5E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A] md:text-xl">
              Profile Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your personal details and preferences
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSaved(false);
              }}
              className="h-10 rounded-sm bg-[#0B1F3A] px-5 text-sm font-semibold text-white hover:opacity-95"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="h-10 rounded-sm border border-[#E5E5E5] bg-white px-5 text-sm font-semibold text-[#0B1F3A] hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-10 rounded-sm bg-[#D4AF37] px-5 text-sm font-semibold text-[#0B1F3A] hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 rounded-sm border border-[#E5E5E5] bg-gray-50 p-3 text-sm text-gray-600">
            Loading profile details...
          </div>
        )}

        <div className="mt-6 rounded-sm border border-[#E5E5E5] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0B1F3A] text-xl font-bold text-white">
                  {initials}
                </div>
              )}

              {isEditing && (
                <>
                  <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-[#0B1F3A] shadow">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {profilePic && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>

            <div>
              <p className="font-semibold text-[#0B1F3A]">Profile Photo</p>
              <p className="mt-1 text-sm text-gray-500">
                JPG or PNG. Max size 2MB
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Email and phone are taken from login/register details.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              First Name
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100 disabled:text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Last Name
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100 disabled:text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              disabled
              className="mt-2 h-11 w-full cursor-not-allowed rounded-sm border border-[#E5E5E5] bg-gray-100 px-3 text-sm text-gray-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              disabled
              className="mt-2 h-11 w-full cursor-not-allowed rounded-sm border border-[#E5E5E5] bg-gray-100 px-3 text-sm text-gray-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Language
            </label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] bg-white px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100 disabled:text-gray-600"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Timezone
            </label>
            <input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-2 h-11 w-full rounded-sm border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100 disabled:text-gray-600"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Bio / About
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            maxLength={300}
            disabled={!isEditing}
            className="mt-2 w-full rounded-sm border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#0B1F3A] disabled:bg-gray-100 disabled:text-gray-600"
          />
          <div className="mt-1 text-right text-xs text-gray-400">
            {form.bio.length}/300
          </div>
        </div>

        {saved && (
          <p className="mt-4 rounded-sm border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
            Profile changes saved successfully.
          </p>
        )}
      </div>
    </div>
  );
}