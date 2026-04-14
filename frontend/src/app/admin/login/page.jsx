"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminThunk, loadAdminThunk } from "@/store/slices/authSlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);
  const { isAuthenticated, role, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadAdminThunk());
  }, [dispatch]);

  useEffect(() => {
    if (initialized && isAuthenticated && role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [initialized, isAuthenticated, role, router]);

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