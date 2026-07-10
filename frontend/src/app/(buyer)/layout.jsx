// import Navbar from "../../components/ui/common/Navbar";
// import Footer from "../../components/ui/common/Footer";

import { Suspense } from "react";
import Navbar from "@/components/ui/common/Navbar";
import Footer from "@/components/ui/common/Footer";
import ProfileFooter from "@/components/ui/common/WhyChoose";

export default function BuyerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      {/* <ProfileFooter /> */}
      <Footer />
    </div>
  );
}