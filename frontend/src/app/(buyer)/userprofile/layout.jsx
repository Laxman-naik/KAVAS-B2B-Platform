import UserSidebar from "../../../components/userprofile/UserSidebar";
import Footer from "../../../components/userprofile/UserFooter";

export default function Layout({ children }) {
  return (
    <div className="bg-[#FFF8EC]">

      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT */}
      <div className="md:ml-[260px] pt-6">
        
        {/* BODY */}
        <main>
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
}