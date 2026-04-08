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

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loadAdminThunk } from "@/store/slices/adminSlice";
import { loadUserThunk } from "@/store/slices/authSlice";
import { usePathname } from "next/navigation";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  // ✅ prevents repeated execution
  const initialized = useRef(false);

  useEffect(() => {
    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginPage =
      pathname === "/admin/login" || pathname === "/login";

    // ❌ skip login pages
    if (isLoginPage) return;

    // ❌ run only once
    if (initialized.current) return;

    initialized.current = true;

    // fire auth once
    if (isAdminRoute) {
      dispatch(loadAdminThunk());
    } else {
      dispatch(loadUserThunk());
    }
  }, [pathname, dispatch]);

  return children;
};

export default AuthLoader;