"use client";
import React, { useState, useEffect } from "react";
import {
    User,
    MapPin,
    Building,
    Shield,
    Heart,
    Package,
    LogOut,
    Edit,
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const Page = () => {
    const [notifications, setNotifications] = useState(true);
    const [promo, setPromo] = useState(true);

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Not authenticated");

                const data = await res.json();

                setUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    role: data.role, // 👈 user or vendor
                });
            } catch (err) {
                console.log("User not logged in");
            }
        };

        fetchUser();
    }, []);


    const [addresses, setAddresses] = useState([
        { id: 1, type: "Home", location: "Vijayawada, Andhra Pradesh" },
        { id: 2, type: "Office", location: "Autonagar, Vijayawada" },
    ]);

    const [newAddress, setNewAddress] = useState({
        type: "",
        location: "",
        state: "",
        country: "",
        zipcode: "",
    });

    const [editId, setEditId] = useState(null);
    const [open, setOpen] = useState(false);

    const handleUserChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAddAddress = () => {
        if (
            !newAddress.type ||
            !newAddress.location ||
            !newAddress.state ||
            !newAddress.country ||
            !newAddress.zipcode
        )
            return;

        setAddresses([...addresses, { id: Date.now(), ...newAddress }]);
        resetForm();
    };

    const handleDelete = (id) => {
        setAddresses(addresses.filter((a) => a.id !== id));
    };

    const handleEdit = (addr) => {
        setEditId(addr.id);
        setNewAddress(addr);
        setOpen(true);
    };

    const handleUpdate = () => {
        setAddresses(
            addresses.map((a) =>
                a.id === editId ? { ...a, ...newAddress } : a
            )
        );
        resetForm();
    };

    const resetForm = () => {
        setNewAddress({
            type: "",
            location: "",
            state: "",
            country: "",
            zipcode: "",
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
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-orange-500 text-white px-4 sm:px-6 lg:px-8 py-6">
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
                            <span className="bg-white/20 text-xs px-3 py-1 rounded-full mt-1 inline-block">
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
                        <Card className="rounded-2xl">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <User size={18} /> Personal Information
                                    </h3>
                                    <Button size="sm" variant="outline" onClick={handleEditToggle}>
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
                        <Card className="rounded-2xl">
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
                        <Card className="rounded-2xl">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MapPin size={18} /> Saved Addresses
                                    </h3>
                                    <Button size="sm" onClick={() => setOpen(true)}>
                                        <Plus size={14} /> Add New
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="border hover:border-orange-500 p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3">
                                            <div>
                                                <p className="font-medium">{addr.type}</p>
                                                <p className="text-sm text-gray-500">
                                                    {addr.location}, {addr.state}, {addr.country} - {addr.zipcode}
                                                </p>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(addr)}>
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
                        <Card className="rounded-2xl">
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
                        <Card className="rounded-2xl bg-orange-500 text-white">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Starter Plan</h3>
                                <ul className="text-sm space-y-2">
                                    <li>✔ Bulk pricing</li>
                                    <li>✔ Supplier access</li>
                                    <li>✔ GST invoices</li>
                                    <li>✔ Account manager</li>
                                </ul>
                                <Button className="mt-4 w-full bg-white text-orange-600">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardContent className="p-4 space-y-3">
                                <Button variant="outline" className="w-full justify-start"><Package size={16} /> My Orders</Button>
                                <Button variant="outline" className="w-full justify-start"><Heart size={16} /> Favourites</Button>
                                <Button variant="outline" className="w-full justify-start"><Shield size={16} /> Help Centre</Button>
                                <Button variant="destructive" className="w-full justify-start"><LogOut size={16} /> Sign Out</Button>
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
                            <Input placeholder="Type" value={newAddress.type} onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })} />
                            <Input placeholder="Location" value={newAddress.location} onChange={(e) => setNewAddress({ ...newAddress, location: e.target.value })} />
                            <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                            <Input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                            <Input placeholder="Zip Code" value={newAddress.zipcode} onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })} />
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