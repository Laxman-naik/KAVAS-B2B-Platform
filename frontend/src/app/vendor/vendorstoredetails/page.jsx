
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {BadgeCheck, CheckCircle2, ChevronDown, Circle, HelpCircle, ImagePlus, MapPin, Phone, Store, Lightbulb, Upload, X,} from "lucide-react";
import {fetchVendorme,saveStoreDetails,fetchStoreDetails,logoutLocal,} from "@/store/slices/vendorSlice";

export default function VendorStoreDetailsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const storeImageInputRef = useRef(null);
  const storeLogoInputRef = useRef(null);
  const storeInfoRef = useRef(null);
  const pickupAddressRef = useRef(null);

  // Redux state
  const vendor = useSelector((state) => state.vendor.vendor);
  const store = useSelector((state) => state.vendor.store);
  const business = useSelector((state) => state.vendor.business);
  const bank = useSelector((state) => state.vendor.bank);
  const loading = useSelector((state) => state.vendor.loading);
  const error = useSelector((state) => state.vendor.error);
  const pickup = useSelector((state) => state.vendor.pickup);

  const [form, setForm] = useState({
    tagline: "",
    description: "",
    pickupAddress: "",
    pincode: "",
    city: "",
    state: "",
    sameAsStore: true,
  });

  const [storeImageUrl, setStoreImageUrl] = useState("");
  const [storeLogoUrl, setStoreLogoUrl] = useState("");

  const [activeSection, setActiveSection] = useState("store_info");

  const setValue = (key) => (e) => {
    const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: v }));
  };

  const verificationItems = useMemo(() => {
    // Verification data is directly on vendor object
    const v = vendor;

    return [
      { label: "Mobile Verification", done: v?.phone_verified === true },
      { label: "Email Verification", done: v?.email_verified === true },
    ];
  }, [vendor]);

  const isFilled = (key) => String(form[key] ?? "").trim().length > 0;

  const requiredStoreFields = useMemo(() => [], []);
  const requiredPickupFields = useMemo(() => ["pickupAddress", "pincode", "city", "state"], []);

  const storeInfoComplete = useMemo(
  () => Boolean(storeImageUrl) && Boolean(storeLogoUrl),
  [storeImageUrl, storeLogoUrl]
);

  const pickupAddressComplete = useMemo(
    () => requiredPickupFields.every((k) => isFilled(k)),
    [form, requiredPickupFields]
  );

  const onboardingProgress = useMemo(() => {
    const sectionSteps = [
      { key: "mobile_verification", done: verificationItems[0]?.done },
      { key: "email_verification", done: verificationItems[1]?.done },
      { key: "business_information", done: true },
      { key: "bank_details", done: true },
      { key: "store_information", done: storeInfoComplete },
      { key: "pickup_address", done: pickupAddressComplete },
    ];

    const total = sectionSteps.length;
    const doneCount = sectionSteps.reduce((acc, s) => acc + (s.done ? 1 : 0), 0);
    return Math.round((doneCount / total) * 100);
  }, [pickupAddressComplete, storeInfoComplete, verificationItems]);

  const navItems = useMemo(
    () => [
      { id: "business_info", label: "Business Information", complete: !!business },
      { id: "bank_details", label: "Bank Details", complete: !!bank },
      { id: "store_info", label: "Store Information", complete: storeInfoComplete },
      { id: "pickup_address", label: "Pickup Address", complete: pickupAddressComplete },
    ],
    [pickupAddressComplete, storeInfoComplete, business, bank]
  );

  const scrollToSection = (id) => {
    setActiveSection(id);

    if (id === "business_info" || id === "bank_details") {
      router.push("/vendor/vendorbusinessdetails");
      return;
    }

    const el = id === "pickup_address" ? pickupAddressRef.current : storeInfoRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Fetch vendor and store data on mount
  useEffect(() => {
    dispatch(fetchVendorme());
    dispatch(fetchStoreDetails());
    dispatch(saveStoreDetails());
  }, [dispatch]);

  // Populate form with store data if available
  useEffect(() => {
  if (store || pickup) {
    setForm(prev => ({
      ...prev,
      tagline: store?.tagline || "",
      description: store?.description || "",
      pickupAddress: pickup?.pickup_address || "",
      pincode: pickup?.pincode || "",
      city: pickup?.city || "",
      state: pickup?.state || "",
    }));

    setStoreImageUrl(store?.store_image || "");
    setStoreLogoUrl(store?.store_logo || "");
  }
}, [store, pickup]);

  useEffect(() => {
    const onScroll = () => {
      const storeTop = storeInfoRef.current?.getBoundingClientRect?.().top ?? Number.POSITIVE_INFINITY;
      const pickupTop = pickupAddressRef.current?.getBoundingClientRect?.().top ?? Number.POSITIVE_INFINITY;

      if (Math.abs(pickupTop) < Math.abs(storeTop)) {
        setActiveSection("pickup_address");
      } else {
        setActiveSection("store_info");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPickFile = (type) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "store_image") {
      setStoreImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
    if (type === "store_logo") {
      setStoreLogoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  };

  const removeFile = (type) => {
    if (type === "store_image") {
      setStoreImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    }
    if (type === "store_logo") {
      setStoreLogoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!(storeInfoComplete && pickupAddressComplete)) return;

    try {
      await dispatch(saveStoreDetails({
        tagline: form.tagline,
        description: form.description,
        address: form.pickupAddress,
        pincode: form.pincode,
        city: form.city,
        state: form.state,
        store_image: storeImageUrl,
        store_logo: storeLogoUrl,
      })).unwrap();

      router.push("/vendor");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save store details");
    }
  };

  const handleLogout = () => {
    dispatch(logoutLocal());
    router.push("/vendor/vendorlogin");
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-[#E5E5E5]">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-2">
            <Image src="/LOGOKAVAS.png" alt="KAVAS" width={150} height={48} className="h-9 w-auto" priority />
           
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[11px] font-bold">
                ✓
              </div>
              <div className="text-[11px] font-bold text-[#0B1F3A]">EMAIL &amp; PASSWORD</div>
            </div>
            <div className="h-px w-14 bg-[#E5E5E5]" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[11px] font-bold">
                ✓
              </div>
              <div className="text-[11px] font-bold text-[#0B1F3A]">BUSINESS DETAILS</div>
            </div>
            <div className="h-px w-14 bg-[#E5E5E5]" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[11px] font-bold">
                3
              </div>
              <div className="text-[11px] font-bold text-[#0B1F3A]">STORE &amp; PICKUP DETAILS</div>
            </div>
          </div>

          <div onClick={handleLogout} className="text-xs font-semibold text-[#0B1F3A] hover:underline cursor-pointer">LOGOUT</div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-white border border-[#E5E5E5] shadow-sm p-5">
              <div className="text-xs font-bold text-[#0B1F3A]">Onboarding Progress</div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="text-gray-600 font-semibold">{onboardingProgress}%</div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#E5E5E5] overflow-hidden">
                  <div className="h-full bg-[#0B1F3A]" style={{ width: `${onboardingProgress}%` }} />
                </div>
              </div>

              <div className="mt-5 border-t border-[#E5E5E5] pt-5">
                <div className="text-xs font-bold text-[#0B1F3A]">Mobile &amp; Email Verification</div>
                <div className="mt-3 grid gap-2">
                  {verificationItems.slice(0, 2).map((x) => (
                    <div key={x.label} className="flex items-center gap-2 text-[11px] text-gray-600">
                      {x.done ? (
                        <CheckCircle2 size={14} className="text-[#0B1F3A]" />
                      ) : (
                        <Circle size={14} className="text-gray-300" />
                      )}
                      <div className="font-semibold">{x.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-[#E5E5E5] pt-5">
                <div className="text-xs font-bold text-[#0B1F3A]">Business Details</div>
                <div className="mt-3 grid gap-2">
                  {navItems.map((x) => (
                    <button
                      type="button"
                      key={x.id}
                      onClick={() => scrollToSection(x.id)}
                      className="flex w-full items-center justify-between gap-2 text-[11px] rounded-md px-2 py-2 hover:bg-[#F3F9FF]"
                    >
                      <span className="flex items-center gap-2">
                        {x.complete ? (
                          <CheckCircle2 size={14} className="text-[#0B1F3A]" />
                        ) : (
                          <Circle
                            size={14}
                            className={
                              x.id === activeSection
                                ? "text-[#0B1F3A] fill-[#0B1F3A]"
                                : "text-gray-300"
                            }
                          />
                        )}
                        <span className={x.id === activeSection ? "text-[#0B1F3A] font-bold" : "text-gray-600 font-semibold"}>
                          {x.label}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* <div className="mt-5 border-t border-[#E5E5E5] pt-5">
                <div className="text-xs font-bold text-[#0B1F3A]">Listing &amp; Stock Availability</div>
                <div className="mt-3 grid gap-2">
                  {["Listing Created", "Stock Added"].map((x) => (
                    <div key={x} className="flex items-center gap-2 text-[11px] text-gray-600">
                      <Circle size={14} className="text-gray-300" />
                      <div className="font-semibold">{x}</div>
                    </div>
                  ))}
                </div>
              </div> */}

              <div className="mt-5 rounded-2xl bg-[#F3F9FF] border border-[#D9EAFF] p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-[#D9EAFF] flex items-center justify-center">
                    <HelpCircle size={18} className="text-[#0B1F3A]" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0B1F3A]">Need Help?</div>
                    <div className="mt-1 text-[11px] text-gray-600">Our support team is here to help you with onboarding.</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 h-10 w-full rounded-md border border-[#D9EAFF] bg-white px-4 text-[11px] font-extrabold text-[#0B1F3A] hover:bg-[#F8FBFF]"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-6">
            <div className="rounded-2xl bg-white border border-[#E5E5E5] shadow-sm p-6 sm:p-8">
              <div>
                <div className="text-xl font-extrabold text-[#0B1F3A]">Store &amp; Pickup Details</div>
                <div className="mt-1 text-sm text-gray-600">Tell us about your store and pickup address</div>
              </div>

              <div className="mt-6 border-t border-[#E5E5E5]" />

              <form onSubmit={onSubmit} className="mt-6 grid gap-6">
                <div ref={storeInfoRef}>
                  <div className="text-sm font-extrabold text-[#0B1F3A]">Store Information</div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Store Image <span className="text-red-500">*</span>
                      </label>

                      <div className="mt-2 rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-4">

                        <div className="h-28 rounded-lg bg-[#F3F9FF] border border-[#D9EAFF] flex items-center justify-center overflow-hidden">
                          {storeImageUrl ? (
                            <img
                              src={storeImageUrl}
                              alt="Store"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <ImagePlus size={20} className="mx-auto text-[#0B1F3A]" />
                              <div className="mt-1 text-[11px] font-semibold text-gray-600">
                                Upload Store Image
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-gray-500">
                          Recommended: 1200×800px • Max size: 5MB
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <input
                            ref={storeImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onPickFile("store_image")}
                            className="hidden"
                          />

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => storeImageInputRef.current?.click()}
                              className="h-9 rounded-md bg-[#0B1F3A] px-4 text-[11px] font-semibold text-white hover:opacity-95 inline-flex items-center gap-2"
                            >
                              <Upload size={14} />
                              Upload
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFile("store_image")}
                              disabled={!storeImageUrl}
                              className={`h-9 rounded-md px-4 text-[11px] font-semibold inline-flex items-center gap-2 ${storeImageUrl
                                  ? "border border-[#E5E5E5] bg-white text-[#0B1F3A] hover:bg-[#F3F9FF]"
                                  : "border border-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Store Logo <span className="text-red-500">*</span>
                      </label>

                      <div className="mt-2 rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-4">

                        <div className="h-28 rounded-lg bg-[#F3F9FF] border border-[#D9EAFF] flex items-center justify-center overflow-hidden">
                          {storeLogoUrl ? (
                            <img
                              src={storeLogoUrl}
                              alt="Logo"
                              className="h-full w-full object-contain bg-white"
                            />
                          ) : (
                            <div className="text-center">
                              <Store size={20} className="mx-auto text-[#0B1F3A]" />
                              <div className="mt-1 text-[11px] font-semibold text-gray-600">
                                Upload Store Logo
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-gray-500">
                          Recommended: 512×512px • Max size: 2MB
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <input
                            ref={storeLogoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onPickFile("store_logo")}
                            className="hidden"
                          />

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => storeLogoInputRef.current?.click()}
                              className="h-9 rounded-md bg-[#0B1F3A] px-4 text-[11px] font-semibold text-white hover:opacity-95 inline-flex items-center gap-2"
                            >
                              <Upload size={14} />
                              Upload
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFile("store_logo")}
                              disabled={!storeLogoUrl}
                              className={`h-9 rounded-md px-4 text-[11px] font-semibold inline-flex items-center gap-2 ${storeLogoUrl
                                  ? "border border-[#E5E5E5] bg-white text-[#0B1F3A] hover:bg-[#F3F9FF]"
                                  : "border border-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-gray-700">Store Tagline (Optional)</label>
                        <div className="text-[10px] text-gray-400">{form.tagline.length}/100</div>
                      </div>
                      <input
                        value={form.tagline}
                        onChange={setValue("tagline")}
                        maxLength={100}
                        placeholder="Your trusted partner for quality products"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-gray-700">Store Description (Optional)</label>
                        <div className="text-[10px] text-gray-400">{form.description.length}/300</div>
                      </div>
                      <textarea
                        value={form.description}
                        onChange={setValue("description")}
                        maxLength={300}
                        rows={4}
                        placeholder="Tell customers about your store"
                        className="mt-2 w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>
                  </div>
                </div>

                <div ref={pickupAddressRef}>
                  <div className="text-sm font-extrabold text-[#0B1F3A]">Pickup Address</div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-gray-700">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <MapPin size={16} />
                        </span>
                        <input
                          value={form.pickupAddress}
                          onChange={setValue("pickupAddress")}
                          placeholder="Enter pickup address"
                          className="w-full h-11 rounded-md border border-[#E5E5E5] pl-10 pr-3 text-sm outline-none focus:border-[#0B1F3A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.pincode}
                        onChange={setValue("pincode")}
                        placeholder="Enter pincode"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.city}
                        onChange={setValue("city")}
                        placeholder="Enter city"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 relative">
                        <select
                          value={form.state}
                          onChange={setValue("state")}
                          className="w-full h-11 appearance-none rounded-md border border-[#E5E5E5] bg-white px-3 pr-9 text-sm outline-none focus:border-[#0B1F3A]"
                        >
                          <option value="">Select state</option>
                          <option value="telangana">Telangana</option>
                          <option value="andhra">Andhra Pradesh</option>
                          <option value="karnataka">Karnataka</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="tamilnadu">Tamil Nadu</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <label className="mt-4 flex items-center gap-2 text-[11px] text-gray-600 select-none">
                    <input
                      type="checkbox"
                      checked={form.sameAsStore}
                      onChange={setValue("sameAsStore")}
                      className="h-4 w-4 rounded border-[#E5E5E5]"
                    />
                    This is my store address
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/vendor/vendorbusinessdetails")}
                    className="h-11 rounded-md border border-[#E5E5E5] bg-white px-5 text-sm font-bold text-[#0B1F3A] hover:bg-[#F3F9FF]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!(storeInfoComplete && pickupAddressComplete)}
                    className={`h-11 rounded-md px-6 text-sm font-extrabold text-white hover:opacity-95 ${
                      storeInfoComplete && pickupAddressComplete
                        ? "bg-[#0B1F3A]"
                        : "bg-[#0B1F3A]/40 cursor-not-allowed"
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside className="lg:col-span-3">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-[#E9F4FF] border border-[#CFE6FF] p-5 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-white/80 border border-[#CFE6FF] flex items-center justify-center">
                  <Store size={22} className="text-[#0B1F3A]" />
                </div>
                <div className="mt-3 text-sm font-extrabold text-[#0B1F3A]">Showcase your store</div>
                <div className="mt-1 text-[11px] text-[#0B1F3A]/80">
                  Add your store details to build trust with customers and improve visibility.
                </div>
              </div>

              <div className="rounded-2xl bg-[#FFF8EC] border border-[#F2E2B8] p-5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0B1F3A]">
                  <Lightbulb size={16} className="text-[#0B1F3A]" />
                  Tips
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    "Use a clear store image for better recognition",
                    "Upload a professional logo",
                    "Provide accurate pickup address for smooth deliveries",
                  ].map((x) => (
                    <div key={x} className="flex items-start gap-3 text-[11px] text-gray-700">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-white border border-[#F2E2B8] flex items-center justify-center">
                        <BadgeCheck size={12} className="text-[#0B1F3A]" />
                      </div>
                      <div className="font-semibold">{x}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#ECFDF5] border border-[#CBEFDD] p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/80 border border-[#CBEFDD] flex items-center justify-center">
                    <HelpCircle size={18} className="text-[#0B1F3A]" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0B1F3A]">Need help?</div>
                    <div className="mt-1 text-[11px] text-gray-600">Our support team is here to help you with onboarding.</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    className="h-10 w-full rounded-md border border-[#CBEFDD] bg-white px-4 text-[11px] font-extrabold text-[#0B1F3A] hover:bg-[#F3FFF8] flex items-center justify-center gap-2"
                  >
                    <Phone size={14} className="text-[#0B1F3A]" />
                    Chat with Support
                  </button>
                  <div className="text-[11px] text-gray-600 flex items-center justify-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    Call us: 080-1234-5678
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

