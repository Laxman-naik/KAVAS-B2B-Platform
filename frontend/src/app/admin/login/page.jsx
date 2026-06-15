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

  const { loading, error } = useSelector((state) => state.auth);
  const { isAuthenticated, role, initialized } = useSelector(
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Admin Control Panel
            </h1>

            <p className="mt-4 text-orange-50 text-sm leading-6 max-w-sm">
              Securely manage your dashboard, vendors, orders, products, and
              business operations from one professional admin workspace.
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 p-5 border border-white/20">
            <p className="text-sm font-medium">
              Secure login access for authorized administrators only.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <ShieldCheck size={26} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Admin Login
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Enter your credentials to access the admin dashboard.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
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
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
                Login failed. Please check your email and password.
              </p>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center mt-8">
            © 2026 Admin Panel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}