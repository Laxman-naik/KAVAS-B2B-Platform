"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminHeader from "../../components/admin/AdminSidebar";
import AdminSidebar from "../../components/admin/AdminHeader";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
  // const router = useRouter();
  // const { isAuthenticated, role, loading } = useSelector((state) => state.auth);

  // const isAdmin = isAuthenticated && role === "admin";

  // useEffect(() => {
  //   if (!loading && !isAdmin) {
  //     router.replace("/admin/login");
  //   }
  // }, [loading, isAdmin]);

  // // if (loading) {
  // //   return (
  // //     <div className="h-screen flex items-center justify-center">
  // //       Loading...
  // //     </div>
  // //   );
  // // }

  // if (!isAdmin) return null;

const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, role, loading } = useSelector(
    (state) => state.auth
  );

  const isAdmin = isAuthenticated && role === "admin";

  const isPublicRoute = pathname === "/admin/login";

  useEffect(() => {
    // ⛔ wait until auth state is known
    if (loading) return;

    if (!isAdmin && !isPublicRoute) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, isPublicRoute]);

  // allow login page always
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // prevent flashing / redirect loop
  if (loading || !isAdmin) {
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

