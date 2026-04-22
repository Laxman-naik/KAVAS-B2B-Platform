"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  User,
  Menu,
  X,
  Package,
  CircleHelp,
  LogOut,
} from "lucide-react";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "@/store/slices/authSlice";
import { fetchFavourites } from "@/store/slices/favouritesSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [darkMode, setDarkMode] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    suppliers: [],
    categories: [],
  });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);

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
    dispatch(fetchFavourites());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery) {
        setSearchResults({
          products: [],
          suppliers: [],
          categories: [],
        });
        setShowSearchDropdown(false);
        return;
      }

      try {
        setSearchLoading(true);

        const res = await fetch(
          `http://localhost:5002/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Search failed");
        }

        setSearchResults({
          products: data.products || [],
          suppliers: data.suppliers || [],
          categories: data.categories || [],
        });

        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Navbar search error:", error);
        setSearchResults({
          products: [],
          suppliers: [],
          categories: [],
        });
        setShowSearchDropdown(false);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();

    if (!query) return;

    setShowSearchDropdown(false);
    setMobileMenu(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="w-full sticky top-0 z-50 shadow-sm border-b border-[#E5E5E5] bg-[#0B1F3A] text-[#FFF8EC]">
        <div className="bg-[#FFF8EC] text-[#1A1A1A] text-[11px] py-1 overflow-hidden hidden sm:block border-b border-[#E5E5E5]">
          <div className="whitespace-nowrap animate-marquee flex gap-8 px-4">
            <span>Pro Membership — 14 days free trial, no credit card needed</span>
            <span>Sell on Kavas — List your products FREE for 6 months</span>
            <span>Help Centre — 24/7 support available</span>
          </div>
        </div>

        <div className="w-full bg-[#0B1F3A]">
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
                <div ref={searchRef} className="w-full max-w-3xl px-2 relative">
                  <div className="flex items-center rounded-md shadow-lg overflow-hidden">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => {
                        if (debouncedQuery) setShowSearchDropdown(true);
                      }}
                      placeholder="Search products, suppliers, categories..."
                      className="h-10 w-full border border-[#E5E5E5] bg-white text-[#1A1A1A] px-4 text-sm outline-none rounded-l-md"
                    />
                    <button
                      onClick={handleSearchSubmit}
                      className="h-10 px-5 flex justify-center items-center bg-[#D4AF37] hover:bg-[#caa734] text-[#0B1F3A] text-sm rounded-r-md shrink-0 font-semibold"
                    >
                      <Search size={16} className="mr-2" />
                      <span>Search</span>
                    </button>
                  </div>

                  {showSearchDropdown && (
                    <div className="absolute left-2 right-2 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-4 max-h-96 overflow-y-auto">
                      {searchLoading ? (
                        <p className="text-sm text-gray-500">Searching...</p>
                      ) : searchResults.products.length === 0 &&
                        searchResults.suppliers.length === 0 &&
                        searchResults.categories.length === 0 ? (
                        <p className="text-sm text-gray-500">No results found.</p>
                      ) : (
                        <div className="space-y-4">
                          {searchResults.products.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold mb-2">Products</h3>
                              <div className="space-y-2">
                                {searchResults.products.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setShowSearchDropdown(false);
                                      router.push(`/products/${item.id}`);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {item.description}
                                    </div>
                                    {item.organization_name && (
                                      <div className="text-[11px] text-gray-400 truncate mt-1">
                                        Supplier: {item.organization_name}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {searchResults.suppliers.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold mb-2">Suppliers</h3>
                              <div className="space-y-2">
                                {searchResults.suppliers.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setShowSearchDropdown(false);
                                      router.push(`/suppliers/${item.id}`);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500 truncate">
                                      {item.industry || item.description || ""}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {searchResults.categories.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold mb-2">Categories</h3>
                              <div className="space-y-2">
                                {searchResults.categories.map((item) => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setSearchQuery(item.name);
                                      setShowSearchDropdown(false);
                                      router.push(`/search?q=${encodeURIComponent(item.name)}`);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    <div className="font-medium">{item.name}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3 cursor-pointer bg-[#FFF8EC] text-[#0B1F3A] border-[#E5E5E5]"
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
                      className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1 bg-white text-[#0B1F3A] hover:bg-[#FFF8EC] border-[#E5E5E5]"
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
                      <div className="absolute right-0 mt-3 w-72 bg-white border border-[#E5E5E5] rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="px-5 py-4 bg-[#0B1F3A] text-center border-b border-[#E5E5E5]">
                          <div className="text-xl font-semibold text-[#FFF8EC] leading-tight">
                            {user?.full_name || user?.name || "Rahul Sharma"}
                          </div>
                          <div className="text-sm text-[#FFF8EC]/80 mt-1 truncate">
                            {user?.email || "you@company.com"}
                          </div>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => {
                              router.push("/profile");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                          >
                            <User className="h-5 w-5" />
                            <span>My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push("/buyerorders");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                          >
                            <Package className="h-5 w-5" />
                            <span>My Orders</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push("/favourites");
                              setDropdown(false);
                            }}
                            className="w-full flex items-center justify-between px-5 py-3 text-left text-[15px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
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
                            className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                          >
                            <CircleHelp className="h-5 w-5" />
                            <span>Help Centre</span>
                          </button>
                        </div>

                        <div className="border-t border-[#E5E5E5]" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left text-[15px] text-red-600 hover:bg-[#FFF8EC]"
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
                    className="h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex bg-white hover:bg-[#FFF8EC] border-[#E5E5E5]"
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
                    className="h-8 sm:h-9 gap-1 sm:gap-2 px-2 sm:px-3 bg-[#FFF8EC] text-[#0B1F3A] border-[#E5E5E5]"
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
                    className="rounded-md border border-white/20 p-2 text-white hover:bg-white/5"
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

            <div className="mt-3 w-full lg:hidden">
              <div className="flex w-full items-center rounded-md shadow-lg overflow-hidden">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => {
                    if (debouncedQuery) setShowSearchDropdown(true);
                  }}
                  placeholder="Search products, suppliers, categories..."
                  className="h-10 w-full border border-[#E5E5E5] bg-white px-3 text-sm outline-none text-[#1A1A1A] rounded-l-md"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="flex h-10 items-center justify-center bg-[#D4AF37] px-4 text-[#0B1F3A] hover:bg-[#caa734] rounded-r-md"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>

            {mobileMenu && (
              <div className="mt-3 w-full space-y-3 rounded-lg bg-white p-4 text-black shadow-md dark:bg-gray-800 dark:text-white lg:hidden">
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full bg-[#FFF8EC] text-[#0B1F3A] border-[#E5E5E5]"
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
                  className="w-full justify-start bg-[#FFF8EC] text-[#0B1F3A] border-[#E5E5E5]"
                  onClick={() => {
                    router.push("/cart");
                    setMobileMenu(false);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4 text-[#0B1F3A]" />
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