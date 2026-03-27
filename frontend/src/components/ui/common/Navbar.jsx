"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { MapPin, Search, ShoppingCart, Moon, Heart, ChevronDown, User } from "lucide-react";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { logoutUser } from "@/services/authService";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("login");

    // ✅ NEW STATES
    const [dropdown, setDropdown] = useState(false);

    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [initialEmail, setInitialEmail] = useState("");

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            // ignore
        } finally {
            dispatch(logoutAction());
            setDropdown(false);
        }
    };

    return (
        <>
            <div className="w-full shadow-sm border-b bg-white sticky top-0 z-50">
                <div className="bg-black text-white text-xs py-2 overflow-hidden hidden sm:block">
                    <div className="whitespace-nowrap animate-marquee flex gap-10 px-4">
                        <span>Pro Membership — 14 days free trial, no credit card needed</span>
                        <span>Sell on Kavas — List your products FREE for 6 months</span>
                        <span>Help Centre — 24/7 support available</span>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 px-4 sm:px-6 lg:px-10 py-2">

                        {/* Logo */}
                        <div className="flex items-center shrink-0 h-16 sm:h-20">
                            <img
                                src="/KAVASlogo.png"
                                alt="KAVAS Logo"
                                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                            />
                        </div>

                        {/* Location */}
                        <div className="hidden sm:flex items-center gap-2 border rounded-md px-3 py-1.5 h-10 bg-gray-50 hover:bg-gray-100 shrink-0">
                            <MapPin size={18} className="text-gray-600" />
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                Deliver to <ChevronDown size={16} />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="w-full order-3 lg:order-0 flex-1 flex items-center max-w-full lg:max-w-2xl rounded shadow-lg">
                            <input
                                placeholder="Search products, suppliers, brands......."
                                className="h-10 w-full rounded-l-md border border-gray-300 bg-white px-3 text-sm outline-none"
                            />
                            <div className="h-10 px-3 sm:px-4 flex justify-center items-center rounded-r-md bg-orange-500 hover:bg-orange-600 text-white text-sm">
                                <Search size={16} className="mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Search</span>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2 ml-auto shrink-0">

                            {/* ❌ Hide on mobile */}
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 hidden sm:flex">
                                <Moon className="h-4 w-4" />
                            </Button>

                            {/* ✅ AUTH */}
                            {!isAuthenticated ? (
                                <Button
                                    variant="outline"
                                    className="h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
                                    onClick={() => {
                                        setMode("login");
                                        setInitialEmail("");
                                        setOpen(true);
                                    }}
                                >
                                    Sign in
                                </Button>
                            ) : (
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="h-9 sm:h-10 px-3 text-xs sm:text-sm"
                                        onClick={() => setDropdown(!dropdown)}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        {(user?.full_name || user?.name || "User").split(" ")[0]} {/* ✅ first name */}
                                    </Button>

                                    {/* Dropdown */}
                                    {dropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                                            <div className="px-4 py-3 text-xs text-gray-500 border-b">
                                                {user?.email}
                                            </div>

                                            <div className="flex flex-col">
                                                <Link href="/profile" className="px-4 py-2 text-sm hover:bg-gray-100 border-b">
                                                    Profile
                                                </Link>
                                                <Link href="/orders" className="px-4 py-2 text-sm hover:bg-gray-100 border-b">
                                                    Orders
                                                </Link>
                                                <Link href="/wishlist" className="px-4 py-2 text-sm hover:bg-gray-100 border-b">
                                                    Favourites
                                                </Link>
                                                <Link href="/help" className="px-4 py-2 text-sm hover:bg-gray-100 border-b">
                                                    Help
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ❌ Hide on mobile */}
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 hidden sm:flex">
                                <Heart color="#9e1a1a" />
                            </Button>

                            {/* Cart */}
                            <Button variant="outline" className="h-9 sm:h-10 gap-1 sm:gap-2 px-2 sm:px-3">
                                <Link href="/cart" className="flex items-center gap-1 sm:gap-2">
                                    <span className="relative">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                                            0
                                        </span>
                                    </span>
                                    <span className="hidden sm:inline">Cart</span>
                                </Link>
                            </Button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Auth Modals */}
            {mode === "login" ? (
                <Login 
                    open={open} 
                    setOpen={setOpen} 
                    setMode={setMode} 
                    initialEmail={initialEmail}
                />
            ) : (
                <Register 
                    open={open} 
                    setOpen={setOpen} 
                    setMode={setMode} 
                    onRegistered={({ email }) => {
                        setInitialEmail(email || "");
                    }} 
                />
            )}
        </>
    )
}

export default Navbar;