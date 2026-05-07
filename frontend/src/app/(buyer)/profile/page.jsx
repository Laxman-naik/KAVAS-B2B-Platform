"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  IndianRupee,
  MapPin,
  Package,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../../../store/slices/addressSlice";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";

const Page = () => {
  const authUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { addresses } = useSelector((state) => state.address);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // ADD THIS useEffect inside Page component

  useEffect(() => {
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

  // ADD THESE FUNCTIONS inside Page component

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditProfileModal = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (
      !editForm.firstName ||
      !editForm.lastName ||
      !editForm.email ||
      !editForm.phone
    ) {
      alert("Please fill all fields");
      return;
    }

    setUser((prev) => ({
      ...prev,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
    }));

    setShowEditModal(false);
  };

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!authUser) return;
        const fullName =
          authUser.full_name || authUser.fullName || authUser.name || "";
        const [parsedFirstName = "", ...rest] = String(fullName)
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const parsedLastName = rest.join(" ");
        setUser({
          firstName: authUser.firstName || parsedFirstName || "",
          lastName: authUser.lastName || parsedLastName || "",
          email: authUser.email || "",
          phone: authUser.phone || "",
          role: authUser.role,
        });
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, [authUser]);

  const memberSince =
    authUser?.createdAt || authUser?.created_at || "May 15, 2024";

  const stats = {
    totalOrders: 12,
    pendingOrders: 3,
    deliveredOrders: 9,
    totalSpent: 25450,
  };

  const recentOrders = [
    {
      id: "#KAVAS1234",
      date: "15 May 2024",
      amount: 2450,
      status: "Delivered",
    },
    { id: "#KAVAS1233", date: "12 May 2024", amount: 3120, status: "Shipped" },
    {
      id: "#KAVAS1232",
      date: "09 May 2024",
      amount: 1890,
      status: "Processing",
    },
    {
      id: "#KAVAS1231",
      date: "05 May 2024",
      amount: 4230,
      status: "Delivered",
    },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const statusBadge = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const addressCards = Array.isArray(addresses) ? addresses.slice(0, 2) : [];

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                  My Profile
                </h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                  <ChevronRight size={14} />
                  <span className="text-[#0B1F3A]">My Profile</span>
                </div>
              </div>

              <Button
                onClick={openEditProfileModal}
                className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95 w-full sm:w-auto"
              >
                <Pencil size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-center">
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="relative">
                      <div className="h-28 w-28 rounded-full bg-[#0B1F3A] flex items-center justify-center">
                        <User className="text-white" size={44} />
                      </div>
                      <div className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center border-2 border-white">
                        <CreditCard size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-[#0B1F3A]">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mobile Number</p>
                      <p className="font-semibold text-[#0B1F3A]">
                        {user.phone || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-semibold text-[#0B1F3A] break-all">
                        {user.email || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="font-semibold text-[#0B1F3A]">
                        {memberSince}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-green-50 flex items-center justify-center">
                    <Package className="text-green-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.totalOrders}
                    </p>
                    <Link
                      href="/buyerorders"
                      className="text-xs text-[#0B1F3A] hover:underline"
                    >
                      View all orders →
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-yellow-50 flex items-center justify-center">
                    <ClipboardList className="text-yellow-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pending Orders</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.pendingOrders}
                    </p>
                    <span className="text-xs text-[#0B1F3A]">
                      View details →
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="text-blue-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Delivered Orders</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.deliveredOrders}
                    </p>
                    <span className="text-xs text-[#0B1F3A]">
                      View details →
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-green-50 flex items-center justify-center">
                    <IndianRupee className="text-green-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      ₹{stats.totalSpent.toLocaleString()}
                    </p>
                    <span className="text-xs text-[#0B1F3A]">
                      View statement →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-0">
                <div className="px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
                  <p className="font-semibold text-[#0B1F3A] text-sm">
                    Recent Orders
                  </p>
                  <Link
                    href="/buyerorders"
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    View All Orders →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500">
                        <th className="text-left font-medium px-4 py-3">
                          Order ID
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Date
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Amount
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Status
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.id} className="border-t">
                          <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                            {o.id}
                          </td>
                          <td className="px-4 py-4 text-gray-600">{o.date}</td>
                          <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                            ₹{o.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={statusBadge(o.status)}>
                              {o.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs text-[#0B1F3A] hover:underline cursor-pointer">
                              View Details
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-0">
                <div className="px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
                  <p className="font-semibold text-[#0B1F3A] text-sm">
                    Saved Addresses
                  </p>
                  <Link
                    href="/myaddresses"
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Manage Addresses →
                  </Link>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {addressCards.map((a) => (
                    <Card
                      key={a.id}
                      className="rounded-sm border border-[#E5E5E5]"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-sm bg-gray-50 flex items-center justify-center">
                            <MapPin size={18} className="text-gray-700" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0B1F3A] text-sm">
                              {a?.label || "Address"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                              {a.address_line1}
                              {a.address_line2 ? `, ${a.address_line2}` : ""}
                              {a.city ? `, ${a.city}` : ""}
                              {a.state ? `, ${a.state}` : ""}
                              {a.postal_code ? ` - ${a.postal_code}` : ""}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="rounded-sm border border-dashed border-[#E5E5E5]">
                    <CardContent className="p-4 h-full flex items-center justify-center">
                      <Link
                        href="/myaddresses"
                        className="text-sm font-semibold text-[#0B1F3A] hover:underline"
                      >
                        + Add New Address
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Edit Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={editForm.firstName}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-md p-3"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={editForm.lastName}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-md p-3"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={editForm.email}
              onChange={handleEditInputChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              value={editForm.phone}
              onChange={handleEditInputChange}
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleSaveProfile}
                className="bg-[#0B1F3A] text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
