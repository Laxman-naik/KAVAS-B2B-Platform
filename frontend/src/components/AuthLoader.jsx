// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loadUserThunk } from "@/store/slices/authSlice";

// const AuthLoader = ({ children }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(loadUserThunk());
//   }, [dispatch]);

//   return (
//     <>
//       {/* 👇 Overlay instead of blocking */}
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           {/* <p>Loading...</p> */}
//         </div>
//       )}
//       {children}
//     </>
//   );
// };

// export default AuthLoader;

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAdminThunk } from "@/store/slices/adminSlice";
import { loadUserThunk } from "@/store/slices/authSlice";
import { usePathname } from "next/navigation";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const admin = useSelector((state) => state.admin.admin);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const isAdminRoute = pathname.startsWith("/admin");
    const isAdminLogin = pathname === "/admin/login";
    const isUserLogin = pathname === "/login";

    // Skip login pages (prevents loop)
    if (isAdminLogin || isUserLogin) return;

    // Avoid unnecessary API calls
    if (isAdminRoute && admin) return;
    if (!isAdminRoute && user) return;

    // Fire and forget (non-blocking)
    if (isAdminRoute) {
      dispatch(loadAdminThunk());
    } else {
      dispatch(loadUserThunk());
    }
  }, [pathname, dispatch]); 

  return children; 
};

export default AuthLoader;