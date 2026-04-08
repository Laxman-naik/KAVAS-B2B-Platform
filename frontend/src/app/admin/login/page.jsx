// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { loginAdminThunk } from "../../../store/slices/authSlice";

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { isAuthenticated, role, loading, error } = useSelector(
//     (state) => state.auth
//   );

//   const isAdminAuthenticated = isAuthenticated && role === "admin";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (isAdminAuthenticated) {
//       router.replace("/admin/dashboard");
//     }
//   }, [isAdminAuthenticated, router]);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Email and password required");
//       return;
//     }

//     const resultAction = await dispatch(
//       loginAdminThunk({ email, password })
//     );

//     if (loginAdminThunk.fulfilled.match(resultAction)) {
//       router.replace("/admin/dashboard");
//     } else {
//       console.log("Login failed:", resultAction.payload);
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-80">
//         <h2 className="text-xl font-semibold mb-4">
//           Admin Login
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-3 p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-orange-500 text-white p-2 rounded disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {error && (
//           <p className="text-red-500 mt-2 text-sm">
//             {typeof error === "string"
//               ? error
//               : error?.message || "Login failed"}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminThunk } from "@/store/slices/authSlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);
  const { isAuthenticated, role } = useSelector((state) => state.auth);

useEffect(() => {
  if (isAuthenticated && role === "admin") {
    router.replace("/admin/dashboard");
  }
}, [isAuthenticated, role]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return alert("Email and password required");

    const result = await dispatch(loginAdminThunk({ email, password }));

    if (loginAdminThunk.fulfilled.match(result)) {
      router.replace("/admin/dashboard");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-2">Login failed</p>}
      </div>
    </div>
  );
}