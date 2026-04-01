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
    <div className="bg-[#0B1626] min-h-screen text-white">

      <AdminSidebar />
      <AdminHeader />

      {/* Main Content */}
      <main className="
        pt-16           /* space for header */
        md:pl-60        /* sidebar width */
        px-4 md:px-6 
        w-full
      ">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;