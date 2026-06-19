// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { loginAdminThunk, loadAdminThunk } from "@/store/slices/authSlice";

// export default function Page() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { loading, error } = useSelector((state) => state.auth);
//   const { isAuthenticated, role, initialized } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(loadAdminThunk());
//   }, [dispatch]);

//   useEffect(() => {
//     if (initialized && isAuthenticated && role === "admin") {
//       router.replace("/admin/dashboard");
//     }
//   }, [initialized, isAuthenticated, role, router]);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     if (!email || !password) return alert("Email and password required");

//     const result = await dispatch(loginAdminThunk({ email, password }));

//     if (loginAdminThunk.fulfilled.match(result)) {
//       router.replace("/admin/dashboard");
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-80">
//         <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

//         <input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           className="w-full mb-3 p-2 border rounded"
//         />

//         <input
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           type="password"
//           className="w-full mb-4 p-2 border rounded"
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-orange-500 text-white p-2 rounded"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {error && <p className="text-red-500 mt-2">Login failed</p>}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { loginAdminThunk, loadAdminThunk } from "@/store/slices/authSlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, role, initialized } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(loadAdminThunk());
  }, [dispatch]);

  useEffect(() => {
    if (initialized && isAuthenticated && role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [initialized, isAuthenticated, role, router]);

  const handleLogin = async () => {
    if (!email || !password) return alert("Email and password required");

    const result = await dispatch(loginAdminThunk({ email, password }));

    if (loginAdminThunk.fulfilled.match(result)) {
      router.replace("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07111f] px-4 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-orange-500/20 rounded-full blur-3xl -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-0 right-0" />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
            <ShieldCheck size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-500 mt-2">
            Secure access to KAVAS admin dashboard
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type="password"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-semibold text-sm transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-2xl p-3">
              Login failed. Please check your email and password.
            </p>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center mt-8">
          © 2026 KAVAS Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}