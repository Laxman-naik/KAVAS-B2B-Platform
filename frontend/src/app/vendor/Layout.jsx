"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorHeader from "../../components/vendor/VendorHeader";
import { fetchVendorme } from "../../store/slices/vendorSlice";

const Layout = ({ children }) => {
  const pathname = usePathname() || "";
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.vendor.accessToken);
  const hideLayout =
    pathname === "/vendor" ||
    pathname.startsWith("/vendor/vendorlogin") ||
    pathname.startsWith("/vendor/vendorregister") ||
    pathname.startsWith("/vendor/vendorbusinessdetails") ||
    pathname.startsWith("/vendor/vendorstoredetails");
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchVendorme());
    }
  }, [accessToken, dispatch]);

  return (
    <div className="flex">
      {!hideLayout && <VendorSidebar />}

      <div className={`flex-1 ${!hideLayout ? "ml-64" : ""}`}>
        {!hideLayout && <VendorHeader />}

        <main className={!hideLayout ? "pt-16" : ""}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;