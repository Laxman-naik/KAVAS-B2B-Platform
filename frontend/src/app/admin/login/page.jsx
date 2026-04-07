// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { loginAdminThunk } from "../../../store/slices/adminSlice";

// const AdminLoginPage = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isAdminAuthenticated, loginLoading, error } = useSelector((state) => state.admin);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (isAdminAuthenticated) { router.push("/admin/dashboard");}
//   }, [isAdminAuthenticated]);

//   const handleLogin = () => {
//     if (!email || !password) {
//       alert("Please enter email and password");
//       return;
//     }
//     dispatch(loginAdminThunk({ email, password }));
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-md w-80">
//         <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
//         <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)}/>
//         <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)}/>
//         <button onClick={handleLogin} className="w-full bg-orange-500 text-white p-2 rounded" disabled={loginLoading} >{loginLoading ? "Logging in..." : "Login"}</button>
//         {error && <p className="text-red-500 mt-2">{error.message || error}</p>}
//       </div>
//     </div>
//   );
// };

// export default AdminLoginPage;


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminThunk } from "../../../store/slices/adminSlice";

const AdminLoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAdminAuthenticated, loginLoading, error } = useSelector(
    (state) => state.admin
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // redirect if already logged in
  useEffect(() => {
    if (isAdminAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAdminAuthenticated, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    try {
      const resultAction = await dispatch(
        loginAdminThunk({ email, password })
      );

      // ✅ proper success check
      if (loginAdminThunk.fulfilled.match(resultAction)) {
        router.replace("/admin/dashboard");
        return;
      }

      // ❌ handled rejection
      console.log("Login failed:", resultAction.payload);

    } catch (err) {
      console.log("Unexpected error:", err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">

        <h2 className="text-xl font-semibold mb-4">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loginLoading}
          className="w-full bg-orange-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loginLoading ? "Logging in..." : "Login"}
        </button>

        {/* safe error rendering */}
        {error && (
          <p className="text-red-500 mt-2 text-sm">
            {typeof error === "string"
              ? error
              : error?.message || "Login failed"}
          </p>
        )}

      </div>
    </div>
  );
};

export default AdminLoginPage;