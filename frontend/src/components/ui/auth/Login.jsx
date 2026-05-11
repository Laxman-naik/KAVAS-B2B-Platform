"use client";
import Image from "next/image";
import {
  BadgePercent,
  Heart,
  ListOrdered,
  MapPinCheckInside,
  Eye,
  Headset,
  Lock,
  ShieldCheck,
  Tag,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserThunk, loginUserThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const Login = ({ open, setOpen, setMode, initialEmail = "" }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { loading, error } = useSelector((state) => state.auth);

  const isModal = typeof open === "boolean";

  useEffect(() => {
    if (isModal && !open) return;
    if (!initialEmail) return;
    setForm((prev) => ({ ...prev, email: initialEmail }));
  }, [isModal, open, initialEmail]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      const res = await dispatch(loginUserThunk(form));

      if (res.meta.requestStatus === "fulfilled") {
        if (typeof setOpen === "function") setOpen(false);
        dispatch(loadUserThunk());
        if (typeof setOpen !== "function") {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isModal && !open) return null;

  const content = (
    <div className="w-full max-w-5xl mx-auto bg-[#0B1F3A] px-4 py-7 rounded-2xl border-white/10">
      <div className="flex justify-center">
        <Image
          src="/LOGOKAVAS.png"
          alt="Kavas Logo"
          width={420}
          height={160}
          className="h-16 sm:h-20 md:h-24 w-auto object-contain"
          priority
        />
      </div>

      <div className="mt-3 w-full max-w-3xl bg-[#FFFFFF] relative rounded-sm shadow-lg border border-[#E5E5E5] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#0B1F3A] text-[#FFF8EC] p-6 sm:p-8">
            <h3 className="text-3xl font-bold tracking-tight">Welcome Back!</h3>
            <p className="mt-3 text-sm text-white/80 max-w-sm leading-6">
              Login to your account and continue shopping with the best
              wholesale prices.
            </p>

           <div className="flex justify-center">
  <Image
    src="/Lock3.png"
    alt="lock"
    width={320}
    height={420}
    priority
    className="
      h-55
      sm:h-65
      md:h-75
      w-auto
      object-contain
      drop-shadow-[0_15px_35px_rgba(212,175,55,0.18)]
    "
  />
</div>

            <div className="">
              <div className="text-sm font-semibold text-[#D4AF37]">Why Login?</div>
              <ul className="mt-3 space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-3">
                  <ListOrdered className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Access your order history</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPinCheckInside className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Track your orders</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Save your favorite products</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgePercent className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Get exclusive deals & offers</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Login to Your Account
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Enter your details to access your account
            </p>

            <form className="mt-4 space-y-2.5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  Email / Mobile Number
                </label>
                <div className="relative mt-0.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email or mobile number"
                    className="w-full pl-10 pr-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  Password
                </label>
                <div className="relative mt-0.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A]"
                    aria-label="Toggle password visibility"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs">
                  {typeof error === "string"
                    ? error
                    : error?.message || "Login failed"}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-[13px] text-gray-700">
                  <input
                    type="checkbox"
                    required
                    
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-[#D4AF37]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => window.open("/forgotpassword", "_blank")}
                  className="text-[13px] text-[#D4AF37] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-sm font-semibold text-[#1A1A1A] rounded-md bg-[#D4AF37] hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex grow h-px bg-[#E5E5E5]" />
              <span className="mx-2 text-xs text-gray-400">
                or continue with
              </span>
              <div className="flex grow h-px bg-[#E5E5E5]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="w-full border border-[#E5E5E5] py-2.5 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-[#FFF8EC]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.674 32.657 29.244 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.318-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.087 2.861-3.002 5.137-5.399 6.565l.003-.002 6.19 5.238C35.666 40.215 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
                  />
                </svg>
                Google
              </button>
              <button className="w-full border border-[#E5E5E5] py-2.5 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-[#FFF8EC]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#1877F2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12.07C22 6.55 17.52 2.07 12 2.07C6.48 2.07 2 6.55 2 12.07C2 17.05 5.66 21.17 10.44 21.93V14.95H7.9V12.07H10.44V9.88C10.44 7.37 11.93 5.98 14.22 5.98C15.31 5.98 16.45 6.18 16.45 6.18V8.64H15.2C13.97 8.64 13.56 9.4 13.56 10.18V12.07H16.33L15.89 14.95H13.56V21.93C18.34 21.17 22 17.05 22 12.07Z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => {
                  if (typeof setMode === "function") {
                    setMode("register");
                  } else {
                    router.push("/register");
                  }
                }}
                className="text-[#D4AF37] font-medium hover:underline cursor-pointer"
              >
                Register Now
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-5xl mx-auto bg-[#0B1F3A] text-[#FFF8EC] border border-white/10 rounded-sm px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">Secure Payments</div>
              <div className="text-[11px] text-white/75">
                100% safe & secure
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">Best Wholesale Prices</div>
              <div className="text-[11px] text-white/75">
                Get the best prices
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                Fast & Reliable Delivery
              </div>
              <div className="text-[11px] text-white/75">Trusted partners</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Headset className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">24/7 Customer Support</div>
              <div className="text-[11px] text-white/75">
                We’re here to help
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={() => {
          if (typeof setOpen === "function") setOpen(false);
        }}
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <div
            className="w-full max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1F3A] px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">{content}</div>
    </div>
  );
};

export default Login;
