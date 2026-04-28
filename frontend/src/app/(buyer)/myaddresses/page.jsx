
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import { fetchAddresses, addAddress, editAddress, removeAddress } from "../../../store/slices/addressSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronRight, Plus, MapPin, Home, CheckCircle2, Trash2, Pencil, User, Phone, } from "lucide-react";

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
  const fullName = authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName).trim().split(/\s+/).filter(Boolean);
  const user = { firstName: authUser?.firstName || firstName, lastName: authUser?.lastName || rest.join(" "), email: authUser?.email || "", };
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_line1: "", address_line2: "", city: "", state: "", country: "", postal_code: "", phone: "",
    label: "", type: "home", is_default: false, active: true,
  });

  const resetForm = () => {
    setOpen(false);
    setEditId(null);
    setNewAddress({
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      phone: "",
      label: "",
      type: "home",
      is_default: false,
      active: true,
    });
  };

  const handleAddAddress = async () => {
    const payload = { ...newAddress };
    await dispatch(addAddress(payload));
    resetForm();
  };

  const handleUpdate = async () => {
    await dispatch(editAddress({ id: editId, data: newAddress }));
    resetForm();
  };

  const handleDelete = async (id) => {
    await dispatch(removeAddress(id));
  };

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleEditClick = (addr) => {
    setEditId(addr.id);
    setNewAddress({
      address_line1: addr.address_line1 || "",
      address_line2: addr.address_line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "",
      postal_code: addr.postal_code || "",
      phone: addr.phone || "",
      label: addr.label || "",
      type: addr.type || "other",
      is_default: addr.is_default || false,
      active: addr.active ?? true
    });
    setOpen(true);
  };

  const normalizedAddresses = useMemo(() => {
    if (!Array.isArray(addresses) || addresses.length === 0) return [];

    return addresses.map((a, idx) => {
      const type = (a?.type || "other").toLowerCase();

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
        ...a,
        id: a?.id ?? `addr_${idx}`,
        title: a?.label || `Address ${idx + 1}`,
        tag: type.charAt(0).toUpperCase() + type.slice(1),
        isDefault: Boolean(a?.is_default),
        active: a?.active ?? true,

        // 👇 FIX HERE
        name:
          a?.name ||
          `${authUser?.firstName || firstName} ${authUser?.lastName || rest.join(" ")}`.trim(),

        phone: a?.phone || authUser?.phone || "",
        addressLine,
      };
    });
  }, [addresses, authUser, firstName, rest]);

  const stats = useMemo(() => {
    const total = normalizedAddresses.length;
    const defaultCount = normalizedAddresses.filter((a) => a.isDefault).length;
    const active = normalizedAddresses.filter((a) => a.active).length;
    const inactive = normalizedAddresses.filter((a) => !a.active).length;
    return { total, defaultCount, active, inactive };
  }, [normalizedAddresses]);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start"><ProfileSidebar user={user} onLogout={handleLogout} /></div>
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">My Addresses</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Link href="/" className="hover:underline">Home</Link><ChevronRight size={14} />
                  <span className="text-[#0B1F3A]">My Addresses</span>
                </div>
              </div>
              <Button onClick={() => setOpen(true)} className="bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95 w-full sm:w-auto">
                <Plus size={16} className="mr-2" /> Add New Address
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
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.total}</p>
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
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.defaultCount}</p>
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
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.active}</p>
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
                    <p className="text-lg font-bold text-[#0B1F3A]">{stats.inactive}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="font-semibold text-[#0B1F3A] text-sm mb-3">Saved Addresses</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {normalizedAddresses.map((a) => (
                  <Card key={a.id} className="rounded-sm border border-[#E5E5E5]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {!a.isDefault && (<Button variant="outline" className="h-8 text-xs" onClick={() => dispatch(changeDefaultAddress(a.id))}>Set Default</Button>)}
                            <p className="font-semibold text-[#0B1F3A] text-sm truncate">{a.title}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tagStyles[a.tag] || "bg-gray-100 text-gray-700"}`}>
                              {a.tag}
                            </span>
                          </div>
                        </div>
                        <Switch
                          checked={Boolean(a.active)}
                          onCheckedChange={(checked) =>
                            dispatch(editAddress({
                                id: a.id,
                                data: {...a, active: checked,},
                              }))}
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
                        <Button variant="outline" onClick={() => handleEditClick(a)} className="rounded-sm border-[#E5E5E5] h-8 text-xs">
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button variant="outline" onClick={() => handleDelete(a.id)} className="rounded-sm border-[#E5E5E5] h-8 text-xs text-red-600 hover:text-red-600">
                          <Trash2 size={14} className="mr-1" /> Delete
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
                    <p className="mt-3 font-semibold text-[#0B1F3A]">Add New Address</p>
                    <p className="mt-1 text-xs text-gray-500 max-w-55">
                      Save multiple addresses and ship to your convenience
                    </p>
                    <Button onClick={() => setOpen(true)} className="mt-4 bg-[#0B1F3A] text-white rounded-sm hover:bg-[#0B1F3A]/95">
                      <Plus size={16} className="mr-2" /> Add Address
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                You can set any address as default from the edit option. Default address will be used for checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl w-[95%] sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Edit Address" : "Add Address"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Label (e.g. Home Address)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            <select value={newAddress.type} onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
              <option value="billing">Billing</option>
            </select>
            <Input placeholder="Address Line 1" value={newAddress.address_line1} onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })} />
            <Input placeholder="Address Line 2" value={newAddress.address_line2} onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })} />
            <Input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            <Input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            <Input placeholder="Postal Code" value={newAddress.postal_code} onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={editId ? handleUpdate : handleAddAddress}>{editId ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}