import UserSidebar from "../../../components/userprofile/UserSidebar";
import UserFooter from "../../../components/userprofile/UserFooter";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen  bg-[#FFF8EC]">
      
      {/* LEFT SIDE (Sidebar + Footer) */}
      <div className="flex flex-col  justify-between">
        <UserSidebar />
        <UserFooter />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-4">
        {children}
      </div>
      
    </div>
  );
}