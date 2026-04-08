"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const { user, role, loading } = useSelector((state) => state.auth);

  const isAdmin = user && role === "admin";

  // debug (keep this while testing)
  console.log("AUTH STATE:", { user, role, loading });

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, router]);

  // block UI until auth is resolved
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // prevent flashing protected UI
  if (!isAdmin) {
    return null;
  }
  return (
    <div className="bg-[#0B1626] min-h-screen text-white">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <main
        className="
        pt-16
        md:pl-60
        px-4 md:px-6
        w-full
      "
      >
        {children}
      </main>

    </div>
  );
}

