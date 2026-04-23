import React from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorHeader from "../../components/vendor/VendorHeader";

const layout = ({ children }) => {
  return (
    <div className="flex">
      <VendorSidebar />

      <div className="flex-1 ml-64">
        <VendorHeader />
        <main className="pt-16 ">{children}</main>
      </div>
    </div>
  );
};

export default layout;