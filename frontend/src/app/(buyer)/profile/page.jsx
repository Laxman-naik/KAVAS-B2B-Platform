"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, MapPin, Building, Shield, Heart, Package, LogOut, Edit, Plus, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, addAddress, editAddress, removeAddress, } from "../../../store/slices/addressSlice";

const Page = () => {
    const authUser = useSelector((state) => state.auth.user);
    const [notifications, setNotifications] = useState(true);
    const [promo, setPromo] = useState(true);
    const [user, setUser] = useState({ firstName: "", lastName: "", email: "", phone: "", });
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const { addresses } = useSelector((state) => state.address);

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!authUser) return;
                const fullName = authUser.full_name || authUser.fullName || authUser.name || "";
                const [parsedFirstName = "", ...rest] = String(fullName).trim().split(/\s+/).filter(Boolean);
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

    const [newAddress, setNewAddress] = useState({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
    });
    const [editId, setEditId] = useState(null);
    const [open, setOpen] = useState(false);

    const handleUserChange = (e) => { setUser({ ...user, [e.target.name]: e.target.value }); };

    const handleAddAddress = async () => {
    if (
        !newAddress.address_line1 ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.country ||
        !newAddress.postal_code
    ) return;

    try {
        await dispatch(addAddress(newAddress)).unwrap();
        dispatch(fetchAddresses());
        resetForm();
    } catch (err) {
        console.error("Add address failed:", err);
    }
};

    const handleDelete = async (id) => {
    try {
        await dispatch(removeAddress(id)).unwrap();
        dispatch(fetchAddresses());
    } catch (err) {
        console.error("Delete failed:", err);
    }
};

    const handleEdit = (addr) => {
    setEditId(addr.id);
    setNewAddress({
        address_line1: addr.address_line1 || "",
        address_line2: addr.address_line2 || "",
        city: addr.city || "",
        state: addr.state || "",
        country: addr.country || "",
        postal_code: addr.postal_code || "",
    });
    setOpen(true);
};

    const handleUpdate = async () => {
    try {
        await dispatch(editAddress({ id: editId, data: newAddress })).unwrap();
        dispatch(fetchAddresses());
        resetForm();
    } catch (err) {
        console.error("Update failed:", err);
    }
};

    const resetForm = () => {
    setNewAddress({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
    });
    setEditId(null);
    setOpen(false);
};

    const handleEditToggle = () => {
        if (isEditing) {
            localStorage.setItem("user", JSON.stringify(user));
        }
        setIsEditing(!isEditing);
    };
    return (
        <div className="bg-[#FFF8EC] min-h-screen">
            <div className="bg-[#0B1F3A] text-[#FFF8EC] px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                            {user.firstName?.[0] || "U"}
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-sm opacity-80 break-all">{user.email}</p>
                            <span className="bg-[#D4AF37] text-[#0B1F3A] text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold">
                                Starter
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center w-full sm:w-auto">
                        <div>
                            <p className="text-lg sm:text-xl font-bold">0</p>
                            <p className="text-xs opacity-80">Orders</p>
                        </div>
                        <div>
                            <p className="text-lg sm:text-xl font-bold">0</p>
                            <p className="text-xs opacity-80">Favourites</p>
                        </div>
                        <div>
                            <p className="text-lg sm:text-xl font-bold">2024</p>
                            <p className="text-xs opacity-80">Member Since</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="rounded-2xl border border-[#E5E5E5]">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <User size={18} /> Personal Information
                                    </h3>
                                    <Button size="sm" variant="outline" className="border-[#E5E5E5] hover:bg-[#FFF8EC] hover:text-[#0B1F3A]" onClick={handleEditToggle}>
                                        <Edit size={14} /> {isEditing ? "Save" : "Edit"}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input name="firstName" value={user?.firstName || ""} onChange={handleUserChange} disabled={!isEditing} />
                                    <Input name="lastName" value={user?.lastName || ""} onChange={handleUserChange} disabled={!isEditing} />
                                    <Input name="email" value={user?.email || ""} onChange={handleUserChange} disabled={!isEditing} />
                                    <Input name="phone" value={user?.phone || ""} onChange={handleUserChange} disabled={!isEditing} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border border-[#E5E5E5]">
                            <CardContent className="p-4 sm:p-6">
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <Building size={18} /> Business Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input placeholder="Company Name" />
                                    <Input placeholder="GST Number" defaultValue="22AAAAA0000A1Z5" />
                                    <Input placeholder="City" />
                                    <Input placeholder="State" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border border-[#E5E5E5]">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MapPin size={18} /> Saved Addresses
                                    </h3>
                                    <Button size="sm" className="bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#caa734]" onClick={() => setOpen(true)}>
                                        <Plus size={14} /> Add New
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="border border-[#E5E5E5] hover:border-[#D4AF37] p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3 bg-white">
                                            <div>
                                                <p className="font-medium">{addr.address_line1}</p>
                                                <p className="text-sm text-gray-500">
                                                    {addr.address_line2 && `${addr.address_line2}, `}
                                                    {addr.city}, {addr.state}, {addr.country} - {addr.postal_code}
                                                </p>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                <Button size="sm" variant="outline" className="border-[#E5E5E5] hover:bg-[#FFF8EC] hover:text-[#0B1F3A]" onClick={() => handleEdit(addr)}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border border-[#E5E5E5]">
                            <CardContent className="p-4 sm:p-6">
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <Shield size={18} /> Security & Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p>Two-Factor Authentication</p>
                                        <Switch checked={false} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p>Order Notifications</p>
                                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p>Promotional Emails</p>
                                        <Switch checked={promo} onCheckedChange={setPromo} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card className="rounded-2xl bg-[#0B1F3A] text-[#FFF8EC] border border-[#E5E5E5]">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Starter Plan</h3>
                                <ul className="text-sm space-y-2">
                                    <li>✔ Bulk pricing</li>
                                    <li>✔ Supplier access</li>
                                    <li>✔ GST invoices</li>
                                    <li>✔ Account manager</li>
                                </ul>
                                <Button className="mt-4 w-full bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#caa734] font-semibold">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-[#E5E5E5]">
                            <CardContent className="p-4 space-y-3">
                                <Button asChild variant="outline" className="w-full justify-start border-[#E5E5E5] hover:bg-[#FFF8EC] hover:text-[#0B1F3A]">
                                    <Link href="/buyerorders" className="flex items-center gap-2 w-full">
                                        <Package size={16} />
                                        <span>My Orders</span>
                                    </Link>
                                </Button>

                                <Button asChild variant="outline" className="w-full justify-start border-[#E5E5E5] hover:bg-[#FFF8EC] hover:text-[#0B1F3A]">
                                    <Link href="/favourites" className="flex items-center gap-2 w-full">
                                        <Heart size={16} />
                                        <span>Favourites</span>
                                    </Link>
                                </Button>

                                <Button asChild variant="outline" className="w-full justify-start border-[#E5E5E5] hover:bg-[#FFF8EC] hover:text-[#0B1F3A]">
                                    <Link href="/help" className="flex items-center gap-2 w-full">
                                        <Shield size={16} />
                                        <span>Help Centre</span>
                                    </Link>
                                </Button>

                                <Button variant="destructive" className="w-full justify-start flex items-center gap-2">
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="rounded-2xl w-[95%] sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editId ? "Edit Address" : "Add Address"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Input
                                placeholder="Address Line 1"
                                value={newAddress.address_line1}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, address_line1: e.target.value })
                                }
                            />

                            <Input
                                placeholder="Address Line 2"
                                value={newAddress.address_line2}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, address_line2: e.target.value })
                                }
                            />

                            <Input
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, city: e.target.value })
                                }
                            />

                            <Input
                                placeholder="State"
                                value={newAddress.state}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, state: e.target.value })
                                }
                            />

                            <Input
                                placeholder="Country"
                                value={newAddress.country}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, country: e.target.value })
                                }
                            />

                            <Input
                                placeholder="Postal Code"
                                value={newAddress.postal_code}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, postal_code: e.target.value })
                                }
                            />
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" className="w-full sm:w-auto" onClick={resetForm}>Cancel</Button>
                            <Button className="w-full sm:w-auto" onClick={editId ? handleUpdate : handleAddAddress}>
                                {editId ? "Update" : "Save"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Page;