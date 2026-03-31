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

//   // 🔥 Block UI until auth is checked
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return children;
// };

// export default AuthLoader;

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserThunk } from "@/store/slices/authSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  return (
    <>
      {/* 👇 Overlay instead of blocking */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* <p>Loading...</p> */}
        </div>
      )}
      {children}
    </>
  );
};

export default AuthLoader;