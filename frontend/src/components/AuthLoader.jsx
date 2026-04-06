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

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadAdminThunk } from "@/store/slices/adminSlice";
import { loadUserThunk } from "@/store/slices/authSlice";
import { usePathname } from "next/navigation";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (pathname.startsWith("/admin")) {
          await dispatch(loadAdminThunk());
        } else {
          await dispatch(loadUserThunk());
        }
      } finally {
        setReady(true);
      }
    };

    init();
  }, [dispatch, pathname]);

  if (!ready) return null;

  return children;
};

export default AuthLoader;