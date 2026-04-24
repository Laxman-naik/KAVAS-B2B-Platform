"use client";
import Image from "next/image";
import { BadgePercent, Boxes, Eye,Headset,Lock,Mail,PackageCheck, Phone,ShieldCheck, Tag, Truck,User,} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../../store/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = ({ open, setOpen, setMode, onRegistered }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isModal = typeof open === "boolean";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    if (!agreeTerms) {
      alert("Please accept the Terms.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      full_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    const res = await dispatch(registerUserThunk(payload));

    if (res.meta.requestStatus === "fulfilled") {
      alert("Registered successfully");
      if (typeof onRegistered === "function") onRegistered();
      if (typeof setOpen === "function") setOpen(false);
      if (typeof setMode === "function") {
        setMode("login");
      } else {
        router.push("/login");
      }
    }
  };

  if (isModal && !open) return null;

  const content = (
    <div className="w-full max-w-3xl mx-auto bg-[#0B1F3A] px-4 py-7 rounded-2xl border-white/10">
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
          <div className="bg-[#0B1F3A] text-[#FFF8EC] p-5 sm:p-8">
            <h3 className="text-3xl font-bold tracking-tight">Welcome!</h3>
            <p className="mt-3 text-sm text-white/80 max-w-sm leading-6">
              Join thousands of businesses that trust Kavas for the best wholesale deals.
            </p>

            <div className="mt-6 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1658851665036-10a9982f9b2d?auto=format&fit=crop&w=520&q=80"
                alt="Register Illustration"
                className="w-full max-w-90 h-40 object-cover rounded-xl border border-white/10"
                loading="lazy"
              />
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-[#D4AF37]">Why Join Kavas?</div>
              <ul className="mt-3 space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-3">
                  <BadgePercent className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Access exclusive wholesale prices</span>
                </li>
                <li className="flex items-start gap-3">
                  <Boxes className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Wide range of quality products</span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Fast & reliable delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <Headset className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Dedicated customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <PackageCheck className="h-4 w-4 mt-0.5 text-[#D4AF37]" />
                  <span>Grow your business with us</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Create your account
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Join 50,000+ businesses on Kavas
            </p>

            <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[13px] font-medium text-[#1A1A1A]">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-0.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      onChange={handleChange}
                      placeholder="Rahul"
                      className="w-full pl-10 pr-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#1A1A1A]">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-0.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      placeholder="Sharma"
                      className="w-full pl-10 pr-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-0.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-0.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  Create password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-0.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-10 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />

                  <Eye
                    onClick={() => setShow((v) => !v)}
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
                <div className="mt-0.5 text-[11px] text-gray-500">Min. 6 characters</div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-0.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={show ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-10 py-1.5 border border-[#E5E5E5] rounded-md text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <Eye
                    onClick={() => setShow((v) => !v)}
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-600">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 accent-[#D4AF37]"
                />
                <span className="whitespace-nowrap">
                  I agree to the{" "}
                  <Link href="/termsandconditions">
                    <span className="text-[#D4AF37] cursor-pointer hover:underline">Terms &Conditions</span>
                  </Link>
                  {" "} and {" "}
                    <Link href="/privacy">
                    <span className="text-[#D4AF37] cursor-pointer hover:underline">Privacy & Policy.</span>
                  </Link>
                  
                </span>
              </label>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-1.5 text-sm font-semibold text-[#1A1A1A] rounded-md bg-[#D4AF37] hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? "Creating..." : "Create your account"}
                <span className="text-base">→</span>
              </button>
            </form>

            <div className="mt-2 pt-2 border-t border-[#E5E5E5]">
              <p className="text-[11px] sm:text-xs text-gray-600 text-center mt-2 whitespace-nowrap">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    if (typeof setMode === "function") {
                      setMode("login");
                    } else {
                      router.push("/login");
                    }
                  }}
                  className="text-[#D4AF37] font-medium cursor-pointer"
                >
                  Sign in <span className="text-base">→</span>
                </span>
              </p>
            </div>
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
              <div className="text-[11px] text-white/75">100% safe & secure</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">Best Wholesale Prices</div>
              <div className="text-[11px] text-white/75">Get the best prices</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">Fast & Reliable Delivery</div>
              <div className="text-[11px] text-white/75">Trusted partners</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Headset className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold">24/7 Customer Support</div>
              <div className="text-[11px] text-white/75">We’re here to help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={() => {
          if (typeof setOpen === "function") setOpen(false);
        }}
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
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

export default Register;