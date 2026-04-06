// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { MapPin, Search, ShoppingCart, Moon, Heart, ChevronDown, User, Package, HelpCircle, X } from "lucide-react";
// import Login from "../auth/Login";
// import Register from "../auth/Register";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUserThunk } from "@/store/slices/authSlice";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//     const [open, setOpen] = useState(false);
//     const [mode, setMode] = useState("login");
//     const [darkMode, setDarkMode] = useState(false);
//     const [favOpen, setFavOpen] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         const saved = localStorage.getItem("theme");

//         if (saved === "dark") {
//             document.documentElement.classList.add("dark");
//             setDarkMode(true);
//         }
//     }, []);

//     const toggleDarkMode = () => {
//         const newMode = !darkMode;
//         setDarkMode(newMode);

//         if (newMode) {
//             document.documentElement.classList.add("dark");
//             localStorage.setItem("theme", "dark");
//         } else {
//             document.documentElement.classList.remove("dark");
//             localStorage.setItem("theme", "light");
//         }
//     };

//     const [dropdown, setDropdown] = useState(false);

//     const dispatch = useDispatch();
//     const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

//     const [initialEmail, setInitialEmail] = useState("");
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setDropdown(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleLogout = () => {
//         dispatch(logoutUserThunk());
//         setDropdown(false);
//     };

//     return (
//         <>
//             <div className="w-full sticky top-0 z-50 shadow-sm border-b bg-white dark:bg-gray-900 text-black dark:text-white">
//                 <div className="bg-black text-white text-xs py-2 overflow-hidden hidden sm:block">
//                     <div className="whitespace-nowrap animate-marquee flex gap-10 px-4">
//                         <span>Pro Membership — 14 days free trial, no credit card needed</span>
//                         <span>Sell on Kavas — List your products FREE for 6 months</span>
//                         <span>Help Centre — 24/7 support available</span>
//                     </div>
//                 </div>

//                 <div className="w-full">
//                     <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 px-4 sm:px-6 lg:px-10 py-2">

//                         <div className="flex items-center shrink-0 h-16 sm:h-20">
//                             <Link href="/" onClick={() => { router.push("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
//                                 <img src="/lotussymbol.png" alt="KAVAS Logo" className="h-10 sm:h-12 md:h-14 w-auto object-contain cursor-pointer" />
//                             </Link>
//                         </div>

//                         <div className="hidden sm:flex items-center gap-2 border rounded-md px-3 py-1.5 h-10 bg-gray-50 hover:bg-gray-100 shrink-0">
//                             <MapPin size={18} className="text-gray-600" />
//                             <div className="flex items-center gap-1 text-sm text-gray-600">Deliver to <ChevronDown size={16} /></div>
//                         </div>

//                         <div className="w-full order-3 lg:order-0 flex-1 flex items-center max-w-full lg:max-w-2xl rounded shadow-lg">
//                             <input
//                                 placeholder="Search products, suppliers, brands......."
//                                 className="h-10 w-full rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 px-3 text-sm outline-none"
//                             />
//                             <div className="h-10 px-3 sm:px-4 flex justify-center items-center rounded-r-md bg-orange-500 hover:bg-orange-600 text-white text-sm">
//                                 <Search size={16} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Search</span>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-2 ml-auto shrink-0">

//                             <Button onClick={toggleDarkMode} variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
//                                 {darkMode ? "☀️" : "🌙"}
//                             </Button>

//                             {/* {!isAuthenticated ? (
//                                 <Button variant="outline" className="h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3" onClick={() => { setMode("login"); setInitialEmail(""); setOpen(true); }}>
//                                     Sign in
//                                 </Button>
//                             ) : (
//                                 <div className="relative" >
//                                     <Button
//                                         variant="outline"
//                                         className="h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
//                                         onClick={() => setDropdown(!dropdown)}
//                                     >
//                                         <User className="h-4 w-4 sm:mr-2" />
//                                         <span className="hidden sm:inline">
//                                             {(user?.full_name || user?.name || "User").split(" ")[0]}
//                                         </span>
//                                     </Button>
//                                     {dropdown && (
//                                         <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 overflow-hidden dark:bg-gray-900 dark:text-white">
//                                             <div className="px-4 py-3 text-xs bg-orange-500 text-white dark:bg-gray-900 border-b font-bold justify-center flex">
//                                                 {user?.email}
//                                             </div>
//                                             <div className="flex flex-col">
//                                                 <Link href="/profile" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b">
//                                                     <User className="h-4 w-4" /> Profile
//                                                 </Link>
//                                                 <Link href="/buyerorders" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b">
//                                                     <Package className="h-4 w-4" /> Orders
//                                                 </Link>
//                                                 <Link href="/help" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b">
//                                                     <HelpCircle className="h-4 w-4" /> Help
//                                                 </Link>
//                                                 <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500">
//                                                     <User className="h-4 w-4" /> Logout
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )} */}
//                             {!isAuthenticated ? (
//                                 <Button
//                                     variant="outline"
//                                     className="h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
//                                     onClick={() => {
//                                         setMode("login");
//                                         setInitialEmail("");
//                                         setOpen(true);
//                                     }}
//                                 >
//                                     Sign in
//                                 </Button>
//                             ) : (
//                                 <div className="relative" ref={dropdownRef}>
//                                     {/* User Button */}
//                                     <Button
//                                         variant="outline"
//                                         className="h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
//                                         onClick={() => setDropdown(!dropdown)}
//                                     >
//                                         <User className="h-4 w-4 sm:mr-2" />
//                                         <span className="hidden sm:inline">
//                                             {(user?.full_name || user?.name || "User").split(" ")[0]}
//                                         </span>
//                                     </Button>

//                                     {/* Dropdown */}
//                                     {dropdown && (
//                                         <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 overflow-hidden dark:bg-gray-900 dark:text-white">

//                                             {/* Email Header */}
//                                             <div className="px-4 py-3 text-xs bg-orange-500 text-white border-b font-bold flex justify-center">
//                                                 {user?.email}
//                                             </div>

//                                             {/* Menu Items */}
//                                             <div className="flex flex-col">
//                                                 <Link
//                                                     href="/profile"
//                                                     onClick={() => setDropdown(false)}
//                                                     className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b"
//                                                 >
//                                                     <User className="h-4 w-4" /> Profile
//                                                 </Link>

//                                                 <Link
//                                                     href="/buyerorders"
//                                                     onClick={() => setDropdown(false)}
//                                                     className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b"
//                                                 >
//                                                     <Package className="h-4 w-4" /> Orders
//                                                 </Link>

//                                                 <Link
//                                                     href="/help"
//                                                     onClick={() => setDropdown(false)}
//                                                     className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b"
//                                                 >
//                                                     <HelpCircle className="h-4 w-4" /> Help
//                                                 </Link>

//                                                 <button
//                                                     onClick={handleLogout}
//                                                     className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
//                                                 >
//                                                     <User className="h-4 w-4" /> Logout
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}

//                                 </div>
//                             )}


//                             <Button
//                                 variant="outline"
//                                 size="icon"
//                                 className="h-9 w-9 sm:h-10 sm:w-10 hidden sm:flex"
//                                 onClick={() => {
//                                     if (!isAuthenticated) {
//                                         setMode("login");
//                                         setOpen(true);
//                                     } else {
//                                         router.push("/favourites");
//                                     }
//                                 }}
//                             >
//                                 <Heart color="#9e1a1a" />
//                             </Button>

//                             <Button variant="outline" className="h-9 sm:h-10 gap-1 sm:gap-2 px-2 sm:px-3">
//                                 <Link href="/cart" className="flex items-center gap-1 sm:gap-2">
//                                     <span className="relative">
//                                         <ShoppingCart className="h-4 w-4" />
//                                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">0</span>
//                                     </span>
//                                     <span className="hidden sm:inline">Cart</span>
//                                 </Link>
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {mode === "login"
//                 ? (<Login open={open} setOpen={setOpen} setMode={setMode} />)
//                 : (<Register open={open} setOpen={setOpen} setMode={setMode} />)
//             }
//         </>
//     )
// }

// export default Navbar;


"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  User,
  Package,
  HelpCircle,
} from "lucide-react";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [darkMode, setDarkMode] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");

  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ✅ hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    setDropdown(false);
  };

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

  // ✅ IMPORTANT: prevent hydration mismatch
  if (!mounted) return null;

  return (
    <>
      <div className="w-full sticky top-0 z-50 shadow-sm border-b bg-white dark:bg-gray-900 text-black dark:text-white">

        {/* Top Bar */}
        <div className="bg-black text-white text-xs py-2 hidden sm:block">
          <div className="whitespace-nowrap flex gap-10 px-4 animate-marquee">
            <span>Pro Membership — 14 days free trial</span>
            <span>Sell on Kavas — List FREE for 6 months</span>
            <span>Help Centre — 24/7 support</span>
          </div>
        </div>

        {/* Navbar */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 px-4 sm:px-6 lg:px-10 py-2">

          {/* Logo */}
          <div className="flex items-center h-16">
            <Link href="/">
              <img
                src="/lotussymbol.png"
                alt="logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Location */}
          <div className="hidden sm:flex items-center gap-2 border rounded-md px-3 py-1.5 bg-gray-50">
            <MapPin size={18} />
            <div className="flex items-center gap-1 text-sm">
              Deliver to <ChevronDown size={16} />
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center max-w-2xl">
            <input
              placeholder="Search products..."
              className="h-10 w-full border px-3 text-sm rounded-l-md dark:bg-gray-800"
            />
            <div className="h-10 px-4 bg-orange-500 text-white flex items-center rounded-r-md">
              <Search size={16} className="mr-2" /> Search
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Dark Mode */}
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              {darkMode ? "☀️" : "🌙"}
            </Button>

            {/* AUTH */}
            {!isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => {
                  setMode("login");
                  setInitialEmail("");
                  setOpen(true);
                }}
              >
                Sign in
              </Button>
            ) : (
              <div className="relative" ref={dropdownRef}>

                {/* User Button */}
                <Button
                  variant="outline"
                  onClick={() => setDropdown(!dropdown)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.name?.split(" ")[0] || "User"}
                </Button>

                {/* Dropdown */}
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border rounded-lg shadow-lg z-50">

                    <div className="px-4 py-3 text-xs bg-orange-500 text-white border-b">
                      {user?.email}
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>

                    <Link
                      href="/buyerorders"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <Package className="h-4 w-4" /> Orders
                    </Link>

                    <Link
                      href="/help"
                      onClick={() => setDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <HelpCircle className="h-4 w-4" /> Help
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/favourites")}
            >
              <Heart />
            </Button>

            {/* Cart */}
            <Button variant="outline">
              <Link href="/cart" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {mode === "login" ? (
        <Login open={open} setOpen={setOpen} setMode={setMode} />
      ) : (
        <Register open={open} setOpen={setOpen} setMode={setMode} />
      )}
    </>
  );
};

export default Navbar;