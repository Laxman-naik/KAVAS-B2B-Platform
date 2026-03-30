import Navbar from "../../components/ui/common/Navbar";
import Footer from "../../components/ui/common/Footer";

export default function BuyerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}