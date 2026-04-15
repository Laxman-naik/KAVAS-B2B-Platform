"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search,ShoppingCart, Heart, ChevronDown, User,Menu, X,Package,CircleHelp,LogOut,} from "lucide-react";
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
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const favouritesCount = useSelector((state) => state.favourites.items.length);
  const cartCount = useSelector(
    (state) =>
      state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  );
  const [initialEmail, setInitialEmail] = useState("");
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
  useEffect(() => {
    dispatch(hydrateFavourites());
  }, [dispatch]);

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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      setDropdown(false);
      setMobileMenu(false);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="w-full sticky top-0 z-50 shadow-sm border-b bg-white dark:bg-gray-900 text-black dark:text-white">
        <div className="bg-amber-200 text-black text-[11px] py-1 overflow-hidden hidden sm:block">
          <div className="whitespace-nowrap animate-marquee flex gap-8 px-4">
            <span>Pro Membership — 14 days free trial, no credit card needed</span>
            <span>Sell on Kavas — List your products FREE for 6 months</span>
            <span>Help Centre — 24/7 support available</span>
          </div>
        </div>

        <div className="w-full bg-[#063149]">
          <div className="px-4 sm:px-6 lg:px-10 py-2">
            <div className="flex items-center justify-between gap-3 lg:gap-6">
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
                    className="h-12 sm:h-14 md:h-16 w-auto object-contain cursor-pointer"
                  />
                </Link>
              </div>
              <div className="hidden lg:flex flex-1 justify-center min-w-0">
                <div className="w-full max-w-3xl px-2">
                  <div className="flex items-center rounded-md shadow-lg overflow-hidden">
                    <input
                      placeholder="Search products, suppliers, brands......."
                      className="h-10 w-full border border-gray-300 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 px-4 text-sm outline-none rounded-l-md"
                    />
                    <button className="h-10 px-5 flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-r-md shrink-0">
                      <Search size={16} className="mr-2" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  {darkMode ? "☀️" : "🌙"}
                </Button> */}

                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
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
                      className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1 bg-white text-black hover:bg-gray-100"
                      onClick={() => setDropdown(!dropdown)}
                    >
                      <div className="h-6 w-6 rounded-full bg-orange-400 text-white flex items-center justify-center text-[11px] font-semibold">
                        {(
                          (user?.full_name || user?.name || "U")
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2) || "U"
                        ).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline max-w-22.5 truncate">
                        {(user?.full_name || user?.name || "User").split(" ")[0]}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-70" />
                    </Button>

                    {dropdown && (
                      <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="px-5 py-4 bg-orange-500 dark:bg-gray-700 text-center border-b border-gray-200 dark:border-gray-600">
                          <div className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                            {user?.full_name || user?.name || "Rahul Sharma"}
                          </div>
                          <div className="text-sm text-black mt-1 truncate">
                            {user?.email || "you@company.com"}
                          </div>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => {
                              router.push("/profile");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] text-gray-700 hover:text-orange-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <User className="h-5 w-5" />
                            <span>My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push("/orders");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] hover:text-orange-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Package className="h-5 w-5" />
                            <span>My Orders</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push("/favourites");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center justify-between px-5 py-3 text-left text-[15px] hover:text-orange-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="flex items-center gap-3">
                              <Heart className="h-5 w-5 text-red-500" />
                              <span>Favourites</span>
                            </span>

                            <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                              {favouritesCount}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              router.push("/help");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] hover:text-orange-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <CircleHelp className="h-5 w-5" />
                            <span>Help Centre</span>
                          </button>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="relative inline-block">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex"
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
                    className="h-8 sm:h-9 gap-1 sm:gap-2 px-2 sm:px-3"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setMode("login");
                        setInitialEmail("");
                        setOpen(true);
                      } else {
                        router.push("/cart");
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs sm:text-sm">Cart</span>
                  </Button>

                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="rounded-md border border-white/20 p-2 text-white"
                  >
                    {mobileMenu ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* MOBILE/TABLET SEARCH */}
            <div className="mt-3 w-full lg:hidden">
              <div className="flex w-full items-center rounded-md shadow-lg overflow-hidden">
                <input
                  placeholder="Search products, suppliers, brands..."
                  className="h-10 w-full border border-gray-300 bg-white px-3 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-l-md"
                />
                <button className="flex h-10 items-center justify-center bg-orange-500 px-4 text-white hover:bg-orange-600 rounded-r-md">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenu && (
              <div className="mt-3 w-full space-y-3 rounded-lg bg-white p-4 text-black shadow-md dark:bg-gray-800 dark:text-white lg:hidden">
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMode("login");
                      setInitialEmail("");
                      setOpen(true);
                      setMobileMenu(false);
                    }}
                  >
                    Sign in
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/profile");
                        setMobileMenu(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {(user?.full_name || user?.name || "User").split(" ")[0]}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/buyerorders");
                        setMobileMenu(false);
                      }}
                    >
                      My Orders
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/favourites");
                        setMobileMenu(false);
                      }}
                    >
                      Favourites
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/cart");
                    setMobileMenu(false);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
          initialEmail={initialEmail}
        />
      )}
    </>
  );
};

export default Navbar;