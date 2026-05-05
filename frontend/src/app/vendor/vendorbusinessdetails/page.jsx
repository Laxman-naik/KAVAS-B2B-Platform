
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {BadgeCheck, Building2, CheckCircle2, ChevronDown, Circle, HelpCircle, Landmark, Lock, MapPin, Phone, ShieldCheck, } from "lucide-react";
import { fetchVendorProfile, fetchBusinessDetails, fetchBankDetails, saveBusinessDetails, saveBankDetails, logoutLocal } from "@/store/slices/vendorSlice";
import { upsertBusinessAPI, upsertBankAPI } from "@/services/vendorServer";

export default function VendorBusinessDetailsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const businessInfoRef = useRef(null);
  const bankDetailsRef = useRef(null);
  const vendor = useSelector((state) => state.vendor.vendor);
const business = useSelector((state) => state.vendor.business);
const bank = useSelector((state) => state.vendor.bank);
const vendorId = vendor?.id;
  

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    registeredBusinessName: "",
    businessPan: "",
    gstin: "",
    businessRegNo: "",
    businessAddress: "",
    pincode: "",
    city: "",
    state: "",
    accountHolderName: "",
    bankAccountNumber: "",
    ifsc: "",
  });

  const [activeSection, setActiveSection] = useState("business_info");

 useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!vendorId || !token) return;

  dispatch(fetchVendorProfile(vendorId));
  dispatch(fetchBusinessDetails());
  dispatch(fetchBankDetails());
}, [vendorId, dispatch]);

useEffect(() => {
  if (business) {
    setForm(prev => ({
      ...prev,
      businessName: business.business_name || "",
      businessType: business.business_type || "",
      registeredBusinessName: business.registered_name || "",
      businessPan: business.pan || "",
      gstin: business.gstin || "",
      businessRegNo: business.registration_number || "",
      businessAddress: business.address || "",
      pincode: business.pincode || "",
      city: business.city || "",
      state: business.state || "",
    }));
  }
}, [business]);

useEffect(() => {
  if (bank) {
    setForm(prev => ({
      ...prev,
      accountHolderName: bank.account_holder_name || "",
      bankAccountNumber: bank.account_number || "",
      ifsc: bank.ifsc_code || "",
    }));
  }
}, [bank]);

  const setValue = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

const verificationItems = useMemo(() => {
  const v = vendor; 
  return [
    { label: "Mobile Verification", done: v?.phone_verified === true },
    { label: "Email Verification", done: v?.email_verified === true },
    { label: "ID Verification", done: v?.id_verified === true },
    { label: "Signature Verification", done: v?.signature_verified === true },
  ];
}, [vendor]);

  const requiredBusinessFields = useMemo(
    () => [
      "businessName",
      "businessType",
      "registeredBusinessName",
      "businessPan",
      "gstin",
      "businessAddress",
      "pincode",
      "city",
      "state",
    ],
    []
  );

  const requiredBankFields = useMemo(
    () => ["accountHolderName", "bankAccountNumber", "ifsc"],
    []
  );

  const isFilled = (key) => String(form[key] ?? "").trim().length > 0;

  const businessInfoComplete = useMemo(
    () => requiredBusinessFields.every((k) => isFilled(k)),
    [form, requiredBusinessFields]
  );

  const bankDetailsComplete = useMemo(
    () => requiredBankFields.every((k) => isFilled(k)),
    [form, requiredBankFields]
  );

  const onboardingProgress = useMemo(() => {
    const sectionSteps = [
      { key: "mobile_verification", done: verificationItems[0]?.done },
      { key: "email_verification", done: verificationItems[1]?.done },
      { key: "id_verification", done: verificationItems[2]?.done },
      { key: "signature_verification", done: verificationItems[3]?.done },
      { key: "business_information", done: businessInfoComplete },
      { key: "bank_details", done: bankDetailsComplete },
      { key: "store_pickup", done: false },
      { key: "listing_stock", done: false },
    ];

    const total = sectionSteps.length;
    const doneCount = sectionSteps.reduce((acc, s) => acc + (s.done ? 1 : 0), 0);
    return Math.round((doneCount / total) * 100);
  }, [bankDetailsComplete, businessInfoComplete, verificationItems]);

  const navItems = useMemo(
    () => [
      { id: "business_details", label: "Business Details", complete: businessInfoComplete && bankDetailsComplete },
      { id: "business_info", label: "Business Information", complete: businessInfoComplete },
      { id: "bank_details", label: "Bank Details", complete: bankDetailsComplete },
      { id: "store_pickup", label: "Store & Pickup Details", complete: false },
    ],
    [bankDetailsComplete, businessInfoComplete]
  );

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = id === "bank_details" ? bankDetailsRef.current : businessInfoRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      const businessTop = businessInfoRef.current?.getBoundingClientRect?.().top ?? Number.POSITIVE_INFINITY;
      const bankTop = bankDetailsRef.current?.getBoundingClientRect?.().top ?? Number.POSITIVE_INFINITY;

      if (Math.abs(bankTop) < Math.abs(businessTop)) {
        setActiveSection("bank_details");
      } else {
        setActiveSection("business_info");
      }
    };
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!(businessInfoComplete && bankDetailsComplete)) return;

    // 1. Save business details
    await dispatch(saveBusinessDetails({
      business_name: form.businessName,
      business_type: form.businessType,
      registered_name: form.registeredBusinessName,
      pan: form.businessPan,
      gstin: form.gstin,
      registration_number: form.businessRegNo,
      address: form.businessAddress,
      pincode: form.pincode,
      city: form.city,
      state: form.state,
    })).unwrap();

    // 2. Save bank details
    await dispatch(saveBankDetails({
      account_holder_name: form.accountHolderName,
      account_number: form.bankAccountNumber,
      ifsc_code: form.ifsc,
    })).unwrap();

    // 3. Move to next step only after success
    router.push("/vendor/vendorstoredetails");

  } catch (err) {
    console.error("Save failed:", err);
    alert("Failed to save details");
  }
};

const handleLogout = () => {
  dispatch(logoutLocal());
  router.push("/vendor/vendorlogin");
};

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <header className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-2">
            <Image src="/LOGOKAVAS.png" alt="KAVAS" width={150} height={48} className="h-9 w-auto" priority />

          </Link>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-[#E5E5E5] text-gray-500 flex items-center justify-center text-[11px] font-bold">
                1
              </div>
              <div className="text-[11px] font-bold text-gray-500">EMAIL &amp; PASSWORD</div>
            </div>
            <div className="h-px w-12 bg-[#E5E5E5]" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[11px] font-bold">
                2
              </div>
              <div className="text-[11px] font-bold text-[#0B1F3A]">BUSINESS DETAILS</div>
            </div>
            <div className="h-px w-12 bg-[#E5E5E5]" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-[#E5E5E5] text-gray-500 flex items-center justify-center text-[11px] font-bold">
                3
              </div>
              <div className="text-[11px] font-bold text-gray-500">STORE &amp; PICKUP DETAILS</div>
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
                      {x.done ? (<CheckCircle2 size={14} className="text-[#0B1F3A]" />) : (<Circle size={14} className="text-gray-300" />)}
                      <div className="font-semibold">{x.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-[#E5E5E5] pt-5">
                <div className="text-xs font-bold text-[#0B1F3A]">ID &amp; Signature Verification</div>
                <div className="mt-3 grid gap-2">
                  {verificationItems.slice(2).map((x) => (
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

                <div className="grid gap-2 mt-3">
                  {navItems.map((x) => (
                    <button
                      type="button"
                      key={x.id}
                      onClick={() =>
                        x.id === "store_pickup"
                          ? router.push("/vendor/vendorstoredetails")
                          : scrollToSection(x.id)
                      }
                      className="flex w-full items-center justify-between gap-2 text-[11px] rounded-md px-2 py-2 hover:bg-[#F3F9FF]"
                    >
                      <span className="flex items-center gap-2">

                        {/* ICON */}
                        {x.complete ? (
                          <CheckCircle2 size={14} className="text-[#0B1F3A]" />
                        ) : (
                          <Circle size={14} className="text-gray-300" />
                        )}

                        {/* TEXT */}
                        <span className="text-gray-600 font-semibold">
                          {x.label}
                        </span>

                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-6">
            <div className="rounded-2xl bg-white border border-[#E5E5E5] shadow-sm p-6 sm:p-8">
              <div>
                <div className="text-xl font-extrabold text-[#0B1F3A]">Business Details</div>
                <div className="mt-1 text-sm text-gray-600">Tell us about your business</div>
              </div>

              <div className="mt-6 border-t border-[#E5E5E5]" />

              <form onSubmit={onSubmit} className="mt-6 grid gap-6">
                <div>
                  <div ref={businessInfoRef} className="text-sm font-extrabold text-[#0B1F3A]">Business Information</div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Business holder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.businessName}
                        onChange={setValue("businessName")}
                        placeholder="Enter your business name"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 relative">
                        <select
                          value={form.businessType}
                          onChange={setValue("businessType")}
                          className="w-full h-11 appearance-none rounded-md border border-[#E5E5E5] bg-white px-3 pr-9 text-sm outline-none focus:border-[#0B1F3A]"
                        >
                          <option value="">Select business type</option>
                          <option value="manufacturer">Manufacturer</option>
                          <option value="wholesaler">Wholesaler</option>
                          <option value="distributor">Distributor</option>
                          <option value="retailer">Retailer</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Registered Business Name (As per GST) <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.registeredBusinessName}
                        onChange={setValue("registeredBusinessName")}
                        placeholder="Enter registered business name"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        PAN <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.businessPan}
                        onChange={setValue("businessPan")}
                        placeholder="Enter PAN number"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        GSTIN (Optional)
                      </label>
                      <div className="mt-2 relative">
                        <input
                          value={form.gstin}
                          onChange={setValue("gstin")}
                          placeholder="Enter GSTIN"
                          className="w-full h-11 rounded-md border border-[#E5E5E5] px-3 pr-28 text-sm outline-none focus:border-[#0B1F3A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">Business Registration Number (Optional)</label>
                      <input
                        value={form.businessRegNo}
                        onChange={setValue("businessRegNo")}
                        placeholder="Enter registration number"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-700">
                        Business Address <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <MapPin size={16} />
                        </span>
                        <input
                          value={form.businessAddress}
                          onChange={setValue("businessAddress")}
                          placeholder="Enter complete business address"
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
                          <option value="andhra">Andhra Pradesh</option>
                          <option value="karnataka">Karnataka</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="telangana">Telangana</option>
                          <option value="tamilnadu">Tamil Nadu</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div ref={bankDetailsRef} className="text-sm font-extrabold text-[#0B1F3A]">Bank Details</div>
                    <Lock size={14} className="text-gray-400" />
                    <div className="text-[11px] text-gray-500">This information is safe and secure</div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Account Holder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.accountHolderName}
                        onChange={setValue("accountHolderName")}
                        placeholder="Enter account holder name"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        Bank Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.bankAccountNumber}
                        onChange={setValue("bankAccountNumber")}
                        placeholder="Enter account number"
                        className="mt-2 w-full h-11 rounded-md border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700">
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2 relative">
                        <input
                          value={form.ifsc}
                          onChange={setValue("ifsc")}
                          placeholder="Enter IFSC code"
                          className="w-full h-11 rounded-md border border-[#E5E5E5] px-3 pr-20 text-sm outline-none focus:border-[#0B1F3A]"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-[#0B1F3A] hover:underline"
                        >
                          Find IFSC
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/vendor/vendorregister")}
                    className="h-11 rounded-md border border-[#E5E5E5] bg-white px-5 text-sm font-bold text-[#0B1F3A] hover:bg-[#F3F9FF]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!(businessInfoComplete && bankDetailsComplete)}
                    className={`h-11 rounded-md px-6 text-sm font-extrabold text-white hover:opacity-95 ${businessInfoComplete && bankDetailsComplete
                        ? "bg-[#0B1F3A]"
                        : "bg-[#0B1F3A]/40 cursor-not-allowed"
                      }`}
                  >
                    Save &amp; Continue →
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside className="lg:col-span-3">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-[#E9F4FF] border border-[#CFE6FF] p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/80 border border-[#CFE6FF] flex items-center justify-center">
                    <Building2 size={18} className="text-[#0B1F3A]" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">Almost there!</div>
                    <div className="mt-1 text-[11px] text-[#0B1F3A]/80">
                      Please provide your business details to start selling on Kavas Seller Hub.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E5E5E5] shadow-sm p-5">
                <div className="text-xs font-extrabold text-[#0B1F3A]">Why provide business details?</div>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#0B1F3A]/10 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-[#0B1F3A]">Faster account verification</div>
                      <div className="mt-0.5 text-[11px] text-gray-600">Help us verify your identity quickly</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#0B1F3A]/10 flex items-center justify-center">
                      <Landmark size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-[#0B1F3A]">Secure transactions</div>
                      <div className="mt-0.5 text-[11px] text-gray-600">Receive payments safely in your bank account</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#0B1F3A]/10 flex items-center justify-center">
                      <BadgeCheck size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-[#0B1F3A]">Build trust with customers</div>
                      <div className="mt-0.5 text-[11px] text-gray-600">Your business information builds trust</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#ECFDF5] border border-[#CBEFDD] p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/80 border border-[#CBEFDD] flex items-center justify-center">
                    <HelpCircle size={18} className="text-[#0B1F3A]" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#0B1F3A]">Need help?</div>
                    <div className="mt-1 text-[11px] text-gray-600">
                      Our support team is here to help you with onboarding.
                    </div>
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

