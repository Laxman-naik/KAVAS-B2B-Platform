"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import { fetchAddresses } from "../../../store/slices/addressSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
  Plus,
  MapPin,
  Home,
  CheckCircle2,
  Trash2,
  Pencil,
  User,
  Phone,
} from "lucide-react";

const seedAddresses = [
  {
    id: "addr_home",
    title: "Home Address",
    tag: "Home",
    isDefault: true,
    active: true,
    name: "Rahul Kumar",
    phone: "+91 6302259849",
    addressLine:
      "123, Green Hills Colony, Hyderabad, Telangana - 500001, India",
  },
  {
    id: "addr_office",
    title: "Office Address",
    tag: "Work",
    isDefault: false,
    active: true,
    name: "Rahul Kumar",
    phone: "+91 6302259849",
    addressLine:
      "8-2-293/82/A, 2nd Floor, Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034, India",
  },
  {
    id: "addr_warehouse",
    title: "Warehouse Address",
    tag: "Other",
    isDefault: false,
    active: true,
    name: "Rahul Kumar",
    phone: "+91 6302259849",
    addressLine:
      "Survey No. 45, Shamshan Narayanapur, Near ORR, Ranga Reddy District, Hyderabad, Telangana - 501359, India",
  },
  {
    id: "addr_billing",
    title: "Billing Address",
    tag: "Billing",
    isDefault: false,
    active: true,
    name: "Rahul Kumar",
    phone: "+91 6302259849",
    addressLine:
      "Flat No. 502, Sree Nilayam Apartments, Ameerpet, Hyderabad, Telangana - 500016, India",
  },
  {
    id: "addr_secondary",
    title: "Secondary Home",
    tag: "Home",
    isDefault: false,
    active: true,
    name: "Rahul Kumar",
    phone: "+91 6302259849",
    addressLine:
      "H. No. 12-5-678/1, Street No. 3, Kukatpally, Hyderabad, Telangana - 500072, India",
  },
];

const tagStyles = {
  Home: "bg-green-100 text-green-700",
  Work: "bg-blue-100 text-blue-700",
  Other: "bg-gray-100 text-gray-700",
  Billing: "bg-orange-100 text-orange-700",
};

export default function Page() {
  const authUser = useSelector((state) => state.auth.user);
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const router = useRouter();

  const fullName =
    authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || rest.join(" "),
    email: authUser?.email || "",
  };

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    tag: "Home",
    name: "",
    phone: "",
    addressLine: "",
    isDefault: false,
    active: true,
  });

  // ADD THESE FUNCTIONS inside your Page() component

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setIsEdit(false);
    setSelectedId(null);

    setFormData({
      title: "",
      tag: "Home",
      name: "",
      phone: "",
      addressLine: "",
      isDefault: false,
      active: true,
    });

    setShowModal(true);
  };

  const openEditModal = (address) => {
    setIsEdit(true);
    setSelectedId(address.id);

    setFormData({
      title: address.title,
      tag: address.tag,
      name: address.name,
      phone: address.phone,
      addressLine: address.addressLine,
      isDefault: address.isDefault,
      active: address.active,
    });

    setShowModal(true);
  };

  const handleSaveAddress = () => {
    if (
      !formData.title ||
      !formData.name ||
      !formData.phone ||
      !formData.addressLine
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (isEdit) {
      setLocalAddresses((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                ...formData,
              }
            : item,
        ),
      );
    } else {
      const newAddress = {
        id: `addr_${Date.now()}`,
        ...formData,
      };

      setLocalAddresses((prev) => [...prev, newAddress]);
    }

    setShowModal(false);
  };

  const handleDeleteAddress = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (confirmDelete) {
      setLocalAddresses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const normalizedAddresses = useMemo(() => {
    if (Array.isArray(addresses) && addresses.length > 0) {
      return addresses.map((a, idx) => {
        const title = a?.label || a?.title || `Address ${idx + 1}`;
        const tag = a?.tag || a?.type || "Other";
        const addressLine = [
          a?.address_line1,
          a?.address_line2,
          a?.city,
          a?.state,
          a?.country,
          a?.postal_code ? `- ${a.postal_code}` : "",
        ]
          .filter(Boolean)
          .join(", ");

        return {
          id: a?.id ?? `addr_${idx}`,
          title,
          tag: tagStyles[tag] ? tag : "Other",
          isDefault: Boolean(a?.isDefault || a?.is_default) || idx === 0,
          active: a?.active !== undefined ? Boolean(a.active) : true,
          name: a?.name || fullName || "",
          phone: a?.phone || authUser?.phone || "",
          addressLine,
        };
      });
    }

    return seedAddresses;
  }, [addresses, authUser?.phone, fullName]);

  const [localAddresses, setLocalAddresses] = useState(seedAddresses);

  useEffect(() => {
    setLocalAddresses(normalizedAddresses);
  }, [normalizedAddresses]);

  const stats = useMemo(() => {
    const total = localAddresses.length;
    const defaultCount = localAddresses.filter((a) => a.isDefault).length || 1;
    const active = localAddresses.filter((a) => a.active).length;
    const inactive = localAddresses.filter((a) => !a.active).length;
    return { total, defaultCount, active, inactive };
  }, [localAddresses]);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

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
                  My Addresses
                </h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                  <ChevronRight size={14} />
                  <span className="text-[#0B1F3A]">My Addresses</span>
                </div>
              </div>

              <Button
                onClick={openAddModal}
                className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95 w-full sm:w-auto"
              >
                <Plus size={16} className="mr-2" />
                Add New Address
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-green-50 flex items-center justify-center">
                    <MapPin className="text-green-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Addresses</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.total}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-orange-50 flex items-center justify-center">
                    <Home className="text-orange-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Default Address</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.defaultCount}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 className="text-blue-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Addresses</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.active}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-sm bg-red-50 flex items-center justify-center">
                    <Trash2 className="text-red-700" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Inactive Addresses</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      {stats.inactive}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="font-semibold text-[#0B1F3A] text-sm mb-3">
                Saved Addresses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {localAddresses.map((a) => (
                  <Card
                    key={a.id}
                    className="rounded-sm border border-[#E5E5E5]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {a.isDefault ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                                Default
                              </span>
                            ) : null}
                            <p className="font-semibold text-[#0B1F3A] text-sm truncate">
                              {a.title}
                            </p>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tagStyles[a.tag] || "bg-gray-100 text-gray-700"}`}
                            >
                              {a.tag}
                            </span>
                          </div>
                        </div>

                        <Switch
                          checked={Boolean(a.active)}
                          onCheckedChange={(checked) =>
                            setLocalAddresses((prev) =>
                              prev.map((x) =>
                                x.id === a.id ? { ...x, active: checked } : x,
                              ),
                            )
                          }
                        />
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <User size={14} className="text-gray-500" />
                          <span className="truncate">{a.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Phone size={14} className="text-gray-500" />
                          <span className="truncate">{a.phone}</span>
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed">
                          {a.addressLine}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => openEditModal(a)}
                          className="rounded-sm border-[#E5E5E5] h-8 text-xs"
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteAddress(a.id)}
                          className="rounded-sm border-[#E5E5E5] h-8 text-xs text-red-600 hover:text-red-600"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="rounded-sm border border-dashed border-[#E5E5E5]">
                  <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Plus size={20} className="text-gray-700" />
                    </div>
                    <p className="mt-3 font-semibold text-[#0B1F3A]">
                      Add New Address
                    </p>
                    <p className="mt-1 text-xs text-gray-500 max-w-[220px]">
                      Save multiple addresses and ship to your convenience
                    </p>
                    <Button
                      onClick={openAddModal}
                      className="mt-4 bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                You can set any address as default from the edit option. Default
                address will be used for checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              {isEdit ? "Edit Address" : "Add New Address"}
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Address Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md"
            />

            <select
              name="tag"
              value={formData.tag}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md"
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
              <option>Billing</option>
            </select>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-md"
            />

            <textarea
              name="addressLine"
              placeholder="Full Address"
              value={formData.addressLine}
              onChange={handleInputChange}
              rows={4}
              className="w-full border p-3 rounded-md"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
              <label>Set as Default Address</label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleSaveAddress}
                className="bg-[#0B1F3A] text-white"
              >
                {isEdit ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
