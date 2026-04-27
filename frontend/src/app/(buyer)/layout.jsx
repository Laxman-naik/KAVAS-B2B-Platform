// import Navbar from "../../components/ui/common/Navbar";
// import Footer from "../../components/ui/common/Footer";

import Navbar from "@/components/ui/common/Navbar";
import Footer from "@/components/ui/common/Footer";
import ProfileFooter from "@/components/buyer/ProfileFooter";

export default function BuyerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <ProfileFooter />
      <Footer />
    </div>
  );
}