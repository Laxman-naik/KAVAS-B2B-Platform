"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin");

    if (!isLoggedIn) {
      router.push("/admin/login");
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminSidebar />
      <AdminHeader />
      <main className="ml-54 mt-10 p-6  overflow-y-auto w-12xl">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;