"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
 const router = useRouter();

  const { admin, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/admin/login");
    }
  }, [loading, admin, router]);

  if (loading) return null;

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

