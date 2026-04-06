// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import AdminHeader from "@/components/admin/AdminHeader";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({ children }) {
//   const router = useRouter();

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("admin");

//     if (!isLoggedIn) {
//       router.push("/admin/login");
//     }
//   }, [router]);

//   return (
//     <div className="bg-[#0B1626] min-h-screen text-white">
      
//       {/* Sidebar */}
//       <AdminSidebar />

//       {/* Header */}
//       <AdminHeader />

//       {/* Main Content */}
//       <main
//         className="
//         pt-16
//         md:pl-60
//         px-4 md:px-6
//         w-full
//       "
//       >
//         {children}
//       </main>

//     </div>
//   );
// }

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.AUTH_PUBLIC_API_URL}/admin/me`,
          {
            credentials: "include", 
          }
        );

        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <div className="bg-[#0B1626] min-h-screen text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="pt-16 px-4 md:px-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}