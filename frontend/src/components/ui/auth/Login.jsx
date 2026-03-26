"use client";

import { useState } from "react";
import { X } from "lucide-react";

const Login = () => {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-blue-600">Kavas</h2>
        <h3 className="text-lg font-semibold mt-2">Welcome back</h3>
        <p className="text-sm text-gray-500 mb-4">
          Sign in to your Kavas account
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-md text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
          >
            Sign in to Kavas
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50">
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-500">
          New?{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Create free account →
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;