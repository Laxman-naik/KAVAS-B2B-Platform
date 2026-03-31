"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Sidebar from "@/components/admin/AdminSidebar";

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
      <Sidebar />
      <AdminHeader />
      <main className="ml-64 mt-16 p-6 h-[calc(100vh-64px)] overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;