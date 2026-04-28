
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Plus,
  MoreVertical,
  Wallet,
  CreditCard,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Star,
  XCircle,
} from "lucide-react";

const seedMethods = [
  {
    id: "pm_visa_4242",
    kind: "card",
    brand: "VISA",
    title: "Visa ending in 4242",
    holder: "Rahul Kumar",
    expiry: "12/26",
    billing: "Home Address",
    status: "Active",
    isDefault: true,
  },
  {
    id: "pm_mc_5555",
    kind: "card",
    brand: "Mastercard",
    title: "Mastercard ending in 5555",
    holder: "Rahul Kumar",
    expiry: "08/27",
    billing: "Office Address",
    status: "Active",
    isDefault: false,
  },
  {
    id: "pm_rupay_9876",
    kind: "card",
    brand: "RuPay",
    title: "RuPay ending in 9876",
    holder: "Rahul Kumar",
    expiry: "11/25",
    billing: "Home Address",
    status: "Active",
    isDefault: false,
  },
  {
    id: "pm_upi_rahul",
    kind: "upi",
    brand: "UPI",
    title: "rahulkumar@upi",
    holder: "rahulkumar@upi",
    expiry: "-",
    billing: "-",
    status: "Active",
    isDefault: false,
  },
  {
    id: "pm_bank_1234",
    kind: "bank",
    brand: "HDFC Bank",
    title: "HDFC Bank •••• 1234",
    holder: "Rahul Kumar",
    expiry: "-",
    billing: "Savings Account",
    status: "Inactive",
    isDefault: false,
  },
];

const getBrandMark = (brand) => {
  switch (String(brand).toLowerCase()) {
    case "visa":
      return (
        <div className="font-extrabold tracking-widest text-blue-700 text-lg">VISA</div>
      );
    case "mastercard":
      return (
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-red-500" />
          <span className="h-5 w-5 rounded-full bg-orange-400 -ml-2" />
        </div>
      );
    case "rupay":
      return (
        <div className="font-bold text-sm text-blue-900">RuPay</div>
      );
    case "upi":
      return (
        <div className="font-bold text-sm text-gray-700">UPI</div>
      );
    default:
      return <div className="font-bold text-sm text-gray-700">{brand}</div>;
  }
};

const getStatusBadgeClass = (status) => {
  return status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

export default function Page() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const fullName = authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName).trim().split(/\s+/).filter(Boolean);
  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || rest.join(" "),
    email: authUser?.email || "",
  };

  const [methods] = useState(seedMethods);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const stats = useMemo(() => {
    const total = methods.length;
    const active = methods.filter((m) => m.status === "Active").length;
    const inactive = methods.filter((m) => m.status !== "Active").length;
    const defaultCount = methods.some((m) => m.isDefault) ? 1 : 0;
    return { total, active, defaultCount, inactive };
  }, [methods]);

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">Payment Methods</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Link href="/" className="hover:underline">Home</Link>
                  <ChevronRight size={14} />
                  <span className="text-[#0B1F3A]">Payment Methods</span>
                </div>
              </div>

              <Button className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95 w-full sm:w-auto">
                <Plus size={16} className="mr-2" /> Add New Payment Method
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-green-50 flex items-center justify-center">
                    <Wallet className="text-green-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Payment Methods</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="text-blue-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Methods</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.active}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-yellow-50 flex items-center justify-center">
                    <Star className="text-yellow-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Default Method</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.defaultCount}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-red-50 flex items-center justify-center">
                    <XCircle className="text-red-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Inactive Methods</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.inactive}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[#0B1F3A] text-sm">Saved Payment Methods</h2>
                </div>

                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {methods.map((m) => (
                        <div key={m.id} className="p-4">
                          <div className="grid grid-cols-[64px_1fr_44px] sm:grid-cols-[84px_1fr_120px_160px_110px_44px] gap-3 items-start">
                            <div className="flex items-center justify-center h-12">
                              {getBrandMark(m.brand)}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-[#0B1F3A] text-sm truncate">{m.title}</p>
                                {m.isDefault ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                                    Default
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-2">
                                <p className="text-[10px] text-gray-500">Card Holder Name</p>
                                <p className="text-xs text-gray-700 truncate">{m.holder}</p>
                              </div>
                            </div>

                            <div className="hidden sm:block">
                              <p className="text-[10px] text-gray-500">Expiry Date</p>
                              <p className="text-xs text-gray-700">{m.expiry}</p>
                            </div>

                            <div className="hidden sm:block min-w-0">
                              <p className="text-[10px] text-gray-500">Billing Address</p>
                              <p className="text-xs text-gray-700 truncate">{m.billing}</p>
                            </div>

                            <div className="hidden sm:flex flex-col items-start gap-1">
                              <p className="text-[10px] text-gray-500">Status</p>
                              <Badge className={getStatusBadgeClass(m.status)}>{m.status}</Badge>
                            </div>

                            <div className="flex justify-end">
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-sm" title="More">
                                <MoreVertical size={16} className="text-gray-500" />
                              </Button>
                            </div>
                          </div>

                          <div className="sm:hidden mt-3 flex items-center justify-between">
                            <Badge className={getStatusBadgeClass(m.status)}>{m.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#0B1F3A] text-sm">Add New Payment Method</h3>

                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        className="w-full rounded-sm border border-[#E5E5E5] p-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-sm bg-gray-50 flex items-center justify-center">
                            <CreditCard size={18} className="text-gray-700" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#0B1F3A]">Add Debit / Credit Card</p>
                            <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-sm border border-[#E5E5E5] p-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-sm bg-gray-50 flex items-center justify-center">
                            <Wallet size={18} className="text-gray-700" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#0B1F3A]">Add UPI ID</p>
                            <p className="text-xs text-gray-500">Pay using UPI ID</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-sm border border-[#E5E5E5] p-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-sm bg-gray-50 flex items-center justify-center">
                            <Landmark size={18} className="text-gray-700" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#0B1F3A]">Add Net Banking</p>
                            <p className="text-xs text-gray-500">All major banks supported</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-sm border border-[#E5E5E5] p-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-sm bg-gray-50 flex items-center justify-center">
                            <Wallet size={18} className="text-gray-700" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#0B1F3A]">Add Wallet</p>
                            <p className="text-xs text-gray-500">PhonePe, Paytm, Amazon Pay</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-sm border border-[#E5E5E5] p-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-sm bg-gray-50 flex items-center justify-center">
                            <Landmark size={18} className="text-gray-700" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#0B1F3A]">Add Bank Account</p>
                            <p className="text-xs text-gray-500">For NEFT / IMPS / RTGS</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-sm bg-[#0B1F3A]/10 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-[#0B1F3A]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B1F3A] text-sm">100% Secure Payments</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Your payment details are safe with 256-bit SSL encryption.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

