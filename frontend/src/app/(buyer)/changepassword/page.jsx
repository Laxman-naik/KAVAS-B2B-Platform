
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Lock,
  RefreshCcw,
  CalendarClock,
} from "lucide-react";

const Page = () => {
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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutOthers, setLogoutOthers] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rules = useMemo(() => {
    const length = newPassword.length >= 8;
    const upper = /[A-Z]/.test(newPassword);
    const lower = /[a-z]/.test(newPassword);
    const number = /\d/.test(newPassword);
    const special = /[^A-Za-z0-9]/.test(newPassword);
    return {
      length,
      upper,
      lower,
      number,
      special,
    };
  }, [newPassword]);

  const strength = useMemo(() => {
    const count = Object.values(rules).filter(Boolean).length;
    if (!newPassword) return { label: "", color: "text-gray-500", bar: "w-0" };
    if (count <= 2) return { label: "Weak", color: "text-red-500", bar: "w-1/4 bg-red-500" };
    if (count === 3) return { label: "Medium", color: "text-yellow-600", bar: "w-2/4 bg-yellow-500" };
    if (count === 4) return { label: "Good", color: "text-blue-600", bar: "w-3/4 bg-blue-500" };
    return { label: "Strong", color: "text-green-600", bar: "w-full bg-green-500" };
  }, [newPassword, rules]);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;

    if (logoutOthers) {
      await dispatch(logoutUserThunk());
      router.push("/login");
      return;
    }
  };

  const RuleItem = ({ ok, children }) => (
    <div className="flex items-center gap-2 text-xs">
      <CheckCircle2 size={14} className={ok ? "text-green-500" : "text-gray-300"} />
      <span className={ok ? "text-[#0B1F3A]" : "text-gray-500"}>{children}</span>
    </div>
  );

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">Change Password</h1>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={14} />
                <span className="text-[#0B1F3A]">Change Password</span>
              </div>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

                  {/* LEFT SECTION */}
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center">
                      <ShieldCheck className="text-[#0B1F3A]" size={26} />
                    </div>

                    <div>
                      <p className="font-semibold text-[#0B1F3A] text-sm">
                        Keep your account secure
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        For your security, please use a strong password that you
                        don’t use on other websites.
                      </p>
                    </div>
                  </div>

                  {/* DIVIDER (only desktop) */}
                  <div className="hidden lg:block h-full w-px bg-[#E5E5E5]" />

                  {/* RIGHT SECTION */}
                  <div className="lg:col-span-1">
                    <p className="text-xs font-semibold text-[#0B1F3A] mb-3">
                      Password must contain:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                      <RuleItem ok={rules.length}>At least 8 characters</RuleItem>
                      <RuleItem ok={rules.number}>One number (0-9)</RuleItem>
                      <RuleItem ok={rules.upper}>One uppercase letter (A-Z)</RuleItem>
                      <RuleItem ok={rules.special}>One special character (!@#$%^&*)</RuleItem>
                      <RuleItem ok={rules.lower}>One lowercase letter (a-z)</RuleItem>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="rounded-sm border border-[#E5E5E5] lg:col-span-2">
                <CardContent className="p-4 sm:p-6">
                  <p className="font-semibold text-[#0B1F3A]">Update Your Password</p>
                  <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Current Password</label>
                      <div className="mt-2 relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current password"
                          className="pl-9 pr-10 rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700">New Password</label>
                      <div className="mt-2 relative">
                        <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter your new password"
                          className="pl-9 pr-10 rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Password strength:{" "}
                            <span className={strength.color}>{strength.label}</span>
                          </p>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-sm overflow-hidden">
                          <div className={`h-full ${strength.bar}`} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700">Confirm New Password</label>
                      <div className="mt-2 relative">
                        <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your new password"
                          className="pl-9 pr-10 rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword ? (
                        <p className="text-xs text-red-500 mt-2">Passwords do not match.</p>
                      ) : null}
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="logoutOthers"
                        checked={logoutOthers}
                        onCheckedChange={(v) => setLogoutOthers(Boolean(v))}
                        className="mt-1"
                      />
                      <label htmlFor="logoutOthers" className="text-xs text-gray-600">
                        Log out from other devices
                        <div className="text-[11px] text-gray-500">We will log you out from other devices for your security.</div>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-[#0B1F3A] text-[#D4AF37] rounded-sm hover:bg-[#0B1F3A]/95 font-semibold"
                    >
                      <RefreshCcw size={16} className="mr-2" />
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-4 sm:p-6">
                    <p className="font-semibold text-[#0B1F3A]">Password Tips</p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
                          <ShieldCheck size={18} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0B1F3A]">Use a strong password</p>
                          <p className="text-xs text-gray-500 mt-1">Avoid using common words, names or easy to guess information.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-sm bg-blue-50 flex items-center justify-center">
                          <Lock size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0B1F3A]">Keep it confidential</p>
                          <p className="text-xs text-gray-500 mt-1">Never share your password with anyone, including KAVAS staff.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-sm bg-yellow-50 flex items-center justify-center">
                          <RefreshCcw size={18} className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0B1F3A]">Change regularly</p>
                          <p className="text-xs text-gray-500 mt-1">Update your password periodically to keep your account secure.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-sm border border-[#E5E5E5]">
                  <CardContent className="p-4 sm:p-6">
                    <p className="font-semibold text-[#0B1F3A]">Recent Password Change</p>
                    <div className="mt-4 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-sm bg-[#0B1F3A]/10 flex items-center justify-center">
                        <CalendarClock size={18} className="text-[#0B1F3A]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last changed on</p>
                        <p className="text-sm font-semibold text-[#0B1F3A]">12 May 2024, 10:30 AM</p>
                        <p className="text-xs text-gray-500 mt-2">
                          If you didn't change your password, please contact support immediately.
                        </p>
                      </div>
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
};

export default Page;
