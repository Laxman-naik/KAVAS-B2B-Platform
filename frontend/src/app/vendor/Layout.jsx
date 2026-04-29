"use client";

import React from "react";
import { usePathname } from "next/navigation";
// import VendorSidebar from "../../components/vendor/VendorSidebar";
// import VendorHeader from "../../components/vendor/VendorHeader";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const hideLayout = [
    "/vendor",
    "/vendor/vendorlogin",
    "/vendor/vendorregister",
    "/vendor/vendorbusinessdetails",
    "/vendor/vendorstoredetails",
  ].includes(pathname);

  return (
    <div className="flex">
      {/* {!hideLayout && <VendorSidebar />} */}
      <div className={`flex-1 ${!hideLayout ? "ml-64" : ""}`}>
        {/* {!hideLayout && <VendorHeader />} */}
        <main className={!hideLayout ? "pt-16" : ""}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;