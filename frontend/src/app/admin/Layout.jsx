import Sidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen p-6">{children}</main>
    </div>
  );
}