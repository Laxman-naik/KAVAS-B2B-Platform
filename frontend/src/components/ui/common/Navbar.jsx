"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search, ShoppingCart, Heart, ChevronDown, User } from "lucide-react";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "@/store/slices/authSlice";
import { hydrateFavourites } from "@/store/slices/favouritesSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("login");
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("theme");

        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const favouritesCount = useSelector((state) => state.favourites.items.length);
    const cartCount = useSelector((state) =>
        state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
    );

    const [initialEmail, setInitialEmail] = useState("");

    useEffect(() => {
        dispatch(hydrateFavourites());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUserThunk());
    };

    if (!mounted) return null;

    return (
        <>
            <div className="w-full sticky top-0 z-50 shadow-sm border-b bg-white dark:bg-gray-900 text-black dark:text-white">
                <div className="bg-black text-white text-[11px] py-1 overflow-hidden hidden sm:block">
                    <div className="whitespace-nowrap animate-marquee flex gap-8 px-4">
                        <span>Pro Membership — 14 days free trial, no credit card needed</span>
                        <span>Sell on Kavas — List your products FREE for 6 months</span>
                        <span>Help Centre — 24/7 support available</span>
                    </div>
                </div>

                <div className="w-full bg-[#063149]">
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 px-4 sm:px-6 lg:px-10 py-1.5">

                        <div className="flex items-center shrink-0 h-12 sm:h-14">
                            <Link
                                href="/"
                                onClick={() => {
                                    router.push("/");
                                    if (typeof window !== "undefined") {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }
                                }}
                            >
                                <img
                                    src="/LOGOKAVAS.png"
                                    alt="KAVAS Logo"
                                    className="h-8 sm:h-10 md:h-11 w-auto object-contain cursor-pointer"
                                />
                            </Link>
                        </div>

                        {/* <div className="hidden sm:flex items-center gap-2 border rounded-md px-3 py-1 h-9 bg-gray-50 hover:bg-gray-100 shrink-0"> */}
                            {/* <MapPin size={16} className="text-gray-600" /> */}
                            {/* <div className="flex items-center gap-1 text-xs text-gray-600"> */}
                                {/* Deliver to <ChevronDown size={14} /> */}
                            {/* </div> */}
                        {/* </div> */}

                        <div className="w-full order-3 lg:order-0 flex-1 flex items-center max-w-full lg:max-w-2xl rounded shadow-lg">
                            <input
                                placeholder="Search products, suppliers, brands......."
                                className="h-9 w-full rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 px-3 text-sm outline-none"
                            />
                            <div className="h-9 px-3 sm:px-4 flex justify-center items-center rounded-r-md cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-sm">
                                <Search size={15} className="mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Search</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-auto shrink-0">
                            {/* <Button */}
                                {/* onClick={toggleDarkMode} */}
                                {/* variant="outline" */}
                                {/* size="icon" */}
                                {/* className="h-8 w-8 sm:h-9 sm:w-9" */}
                            {/* > */}
                                {/* {darkMode ? "☀️" : "🌙"} */}
                            {/* </Button> */}

                            {!isAuthenticated ? (
                                <Button
                                    variant="outline"
                                    className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3 cursor-pointer"
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
                                        className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm "
                                        onClick={() => router.push("/profile")}
                                    >
                                        <User className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">
                                            {(user?.full_name || user?.name || "User").split(" ")[0]}
                                        </span>
                                    </Button>
                                </div>
                            )}

                            <div className="relative inline-block cursor-p">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex cursor-pointer "
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            setMode("login");
                                            setOpen(true);
                                        } else {
                                            router.push("/favourites");
                                        }
                                    }}
                                >
                                    <Heart color="#9e1a1a" className="h-4 w-4" />
                                </Button>

                                {favouritesCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                        {favouritesCount}
                                    </span>
                                )}
                            </div>

                            <div className="relative inline-block">
                                <Button
                                    variant="outline"
                                    className="h-8 sm:h-9 gap-1 sm:gap-2 px-2 sm:px-3 cursor-pointer"
                                >
                                    <Link href="/cart" className="flex items-center gap-1 sm:gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span className="hidden sm:inline text-xs sm:text-sm">Cart</span>
                                    </Link>
                                </Button>

                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {mode === "login" ? (
                <Login open={open} setOpen={setOpen} setMode={setMode} />
            ) : (
                <Register open={open} setOpen={setOpen} setMode={setMode} />
            )}
        </>
    );
};

export default Navbar;