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
  ShieldCheck,
  Phone,
  UserPlus,
  Truck,
  MapPin,
  CreditCard,
  ClipboardList,
  Bell,
  KeyRound,
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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categoryOpen, setCategoryOpen] = useState(false);

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
  const categoryRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const favouritesCount = useSelector((state) => state.favourites.items.length);
  const cartCount = useSelector(
    (state) =>
      state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  );
  const [initialEmail, setInitialEmail] = useState("");
  const [postAuthRedirect, setPostAuthRedirect] = useState(null);

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

      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setDropdown(false);
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

  const openLoginForRedirect = (path) => {
    setPostAuthRedirect(path || null);
    setMode("login");
    setInitialEmail("");
    setOpen(true);
    setDropdown(false);
    setMobileMenu(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!postAuthRedirect) return;

    const to = postAuthRedirect;
    setPostAuthRedirect(null);
    router.push(to);
  }, [isAuthenticated, postAuthRedirect, router]);

  if (!mounted) return null;

  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Industrial",
    "Beauty & Personal Care",
  ];

  return (
    <>
      <div className="w-full sticky top-0 z-50 shadow-sm bg-[#0B1F3A] text-[#FFF8EC]">
        <div className="hidden lg:block border-b border-white/10">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-10 py-2 text-[12px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-white/85">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                  Trusted by 10,000+ Businesses
                </span>
                <span className="text-white/35">|</span>
                <span>Premium Quality</span>
                <span className="text-white/35">|</span>
                <span>Best Wholesale Prices</span>
              </div>

              <div className="flex items-center gap-4 text-white/85">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#D4AF37]" />
                  +91 0000000000
                </span>
                <span className="text-white/35">|</span>
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <CircleHelp className="h-4 w-4 text-[#D4AF37]" />
                  Help & Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#0B1F3A] border-b border-white/10">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-10 py-3">
            <div className="flex items-center justify-between gap-3 lg:gap-6">
              <div className="flex items-center gap-3 lg:hidden shrink-0">
                <button
                  onClick={() => setMobileMenu(!mobileMenu)}
                  className="rounded-sm border border-white/20 p-2 text-white hover:bg-white/5"
                  aria-label="Menu"
                >
                  {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

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

              <div className="hidden md:flex flex-1 justify-center min-w-0">
                <div ref={searchRef} className="w-full max-w-3xl px-2 relative">
                  <div
                    ref={categoryRef}
                    className="flex items-stretch rounded-sm overflow-hidden border border-white/15 bg-white shadow-lg relative"
                  >
                    <button
                      type="button"
                      onClick={() => setCategoryOpen((v) => !v)}
                      className="h-11 px-4 bg-[#0B1F3A] text-white text-sm flex items-center gap-2 border-r border-white/10"
                    >
                      <span className="whitespace-nowrap">{selectedCategory}</span>
                      <ChevronDown
                        className={`h-4 w-4 opacity-80 transition-transform ${
                          categoryOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => {
                        if (debouncedQuery) setShowSearchDropdown(true);
                      }}
                      placeholder="Search for products, categories, brands..."
                      className="h-11 w-full bg-white text-[#1A1A1A] px-4 text-sm outline-none"
                    />
                    <button
                      onClick={handleSearchSubmit}
                      className="h-11 w-14 flex justify-center items-center bg-[#D4AF37] hover:bg-[#caa734] text-[#0B1F3A] shrink-0"
                      aria-label="Search"
                    >
                      <Search size={18} />
                    </button>

                    {categoryOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-[#E5E5E5] rounded-sm shadow-xl z-50 overflow-hidden">
                        <div className="max-h-72 overflow-auto py-1">
                          {categories.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(c);
                                setCategoryOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FFF8EC] ${
                                selectedCategory === c
                                  ? "bg-[#FFF8EC] text-[#0B1F3A] font-semibold"
                                  : "text-[#1A1A1A]"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                <div className="hidden lg:flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => router.push("/vendor")}
                    className="flex flex-col items-center gap-1 text-white/90 hover:text-white"
                  >
                    <span className="relative  flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-[#D4AF37]" />
                    </span>
                    <span className="text-[11px]">Become a Seller</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        openLoginForRedirect("/favourites");
                      } else {
                        router.push("/favourites");
                      }
                    }}
                    className="flex flex-col items-center gap-1 text-white/90 hover:text-white"
                  >
                    <span className="relative  flex items-center justify-center">
                      <Heart className="h-5 w-5 text-[#D4AF37]" />
                      {favouritesCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0B1F3A] text-[10px] px-1.5 rounded-full font-semibold">
                          {favouritesCount}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px]">Wish List</span>
                  </button>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdown((d) => !d);
                      }}
                      className="flex flex-col items-center gap-1 text-white/90 hover:text-white"
                    >
                      <span className="relative   flex items-center justify-center">
                        <User className="h-5 w-5 text-[#D4AF37]" />
                      </span>
                      <span className="text-[11px]">Profile</span>
                    </button>

                    {dropdown && (
                      <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-1rem))] bg-white border border-[#E5E5E5] rounded-sm shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="px-5 py-4 bg-[#0B1F3A] text-center border-b border-[#E5E5E5]">
                          {isAuthenticated ? (
                            <>
                              <div className="text-xl font-semibold text-[#FFF8EC] leading-tight">
                                {user?.full_name || user?.name || "User"}
                              </div>
                              <div className="text-sm text-[#FFF8EC]/80 mt-1 truncate">
                                {user?.email || ""}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xl font-semibold text-[#FFF8EC] leading-tight">
                                Welcome
                              </div>
                              <div className="text-sm text-[#FFF8EC]/80 mt-1">
                                Sign in to access your account
                              </div>
                            </>
                          )}
                        </div>

                        <div className="py-2">
                          {isAuthenticated ? (
                            <>
                              <button
                                onClick={() => {
                                  router.push("/profile");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <User className="h-5 w-5" />
                                <span>My Profile</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/buyerorders");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Package className="h-5 w-5" />
                                <span>My Orders</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/trackorder");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Truck className="h-5 w-5" />
                                <span>Track Order</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/favourites");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center justify-between px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <span className="flex items-center gap-3">
                                  <Heart className="h-5 w-5 text-red-500" />
                                  <span>Wishlist</span>
                                </span>
                                <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
                                  {favouritesCount}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/profile");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <MapPin className="h-5 w-5" />
                                <span>Addresses</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/profile");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <CreditCard className="h-5 w-5" />
                                <span>Payment Methods</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/help");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <ClipboardList className="h-5 w-5" />
                                <span>Bulk Enquiry</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/profile");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Bell className="h-5 w-5" />
                                <span>Notifications</span>
                              </button>

                              <button
                                onClick={() => {
                                  router.push("/profile");
                                  setDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <KeyRound className="h-5 w-5" />
                                <span>Change Password</span>
                              </button>
                            </>
                          ) : (
                            <div className="py-2">
                              <div className="px-5 py-3 space-y-2">
                                <Button
                                  className="w-full bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#caa734]"
                                  onClick={() => {
                                    setMode("login");
                                    setInitialEmail("");
                                    setOpen(true);
                                    setDropdown(false);
                                  }}
                                >
                                  Sign in
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full border-[#E5E5E5] text-[#0B1F3A] hover:bg-[#FFF8EC] hover:text-[#0B1F3A]"
                                  onClick={() => {
                                    setMode("register");
                                    setInitialEmail("");
                                    setOpen(true);
                                    setDropdown(false);
                                  }}
                                >
                                  Create account
                                </Button>
                              </div>

                              <div className="border-t border-[#E5E5E5]" />

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/profile");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <User className="h-5 w-5" />
                                <span>My Profile</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/buyerorders");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Package className="h-5 w-5" />
                                <span>My Orders</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/trackorder");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Truck className="h-5 w-5" />
                                <span>Track Order</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/favourites");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Heart className="h-5 w-5 text-red-500" />
                                <span>Wishlist</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/profile");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <MapPin className="h-5 w-5" />
                                <span>Addresses</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/profile");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <CreditCard className="h-5 w-5" />
                                <span>Payment Methods</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/help");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <ClipboardList className="h-5 w-5" />
                                <span>Bulk Enquiry</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/profile");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <Bell className="h-5 w-5" />
                                <span>Notifications</span>
                              </button>

                              <button
                                onClick={() => {
                                  openLoginForRedirect("/profile");
                                }}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-[14px] text-[#1A1A1A] hover:text-[#0B1F3A] hover:bg-[#FFF8EC]"
                              >
                                <KeyRound className="h-5 w-5" />
                                <span>Change Password</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {isAuthenticated && (
                          <>
                            <div className="border-t border-[#E5E5E5]" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-red-600 hover:bg-[#FFF8EC]"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Logout</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        openLoginForRedirect("/cart");
                      } else {
                        router.push("/cart");
                      }
                    }}
                    className="flex flex-col items-center gap-1 text-white/90 hover:text-white"
                  >
                    <span className="relative  flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0B1F3A] text-[10px] px-1.5 rounded-full font-semibold">
                          {cartCount}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px]">Cart</span>
                  </button>
                </div>
              </div>

              {mobileMenu && (
                <div className="mt-3 w-full space-y-3 rounded-lg bg-white p-4 text-black shadow-md dark:bg-gray-800 dark:text-white lg:hidden">
                  {!isAuthenticated ? (
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#caa734]"
                        onClick={() => {
                          setMode("login");
                          setInitialEmail("");
                          setOpen(true);
                          setMobileMenu(false);
                        }}
                      >
                        Sign in
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-[#FFF8EC] text-[#0B1F3A] border-[#E5E5E5] cursor-pointer"
                        onClick={() => {
                          setMode("register");
                          setInitialEmail("");
                          setOpen(true);
                          setMobileMenu(false);
                        }}
                      >
                        Create account
                      </Button>

                      <div className="border-t border-[#E5E5E5]" />

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => openLoginForRedirect("/profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => openLoginForRedirect("/buyerorders")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => openLoginForRedirect("/trackorder")}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Track Order
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => openLoginForRedirect("/favourites")}
                      >
                        <Heart className="mr-2 h-4 w-4 text-red-500" />
                        Wishlist
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => openLoginForRedirect("/help")}
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Bulk Enquiry
                      </Button>
                    </div>
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
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/trackorder");
                          setMobileMenu(false);
                        }}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Track Order
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/favourites");
                          setMobileMenu(false);
                        }}
                      >
                        <Heart className="mr-2 h-4 w-4 text-red-500" />
                        Wishlist
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/profile");
                          setMobileMenu(false);
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Addresses
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/profile");
                          setMobileMenu(false);
                        }}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment Methods
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/help");
                          setMobileMenu(false);
                        }}
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Bulk Enquiry
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/profile");
                          setMobileMenu(false);
                        }}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/profile");
                          setMobileMenu(false);
                        }}
                      >
                        <KeyRound className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4 text-red-600" />
                        Logout
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-[#FFF8EC] text-[#0B1F3A] border-[#E5E5E5]"
                    onClick={() => {
                      if (!isAuthenticated) {
                        openLoginForRedirect("/cart");
                      } else {
                        router.push("/cart");
                        setMobileMenu(false);
                      }
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

            <div className="mt-3 w-full md:hidden">
              <div ref={categoryRef} className="relative">
                <div className="flex w-full items-stretch rounded-sm shadow-lg overflow-hidden border border-white/15 bg-white">
                  <button
                    type="button"
                    onClick={() => setCategoryOpen((v) => !v)}
                    className="h-11 px-4 bg-[#0B1F3A] text-white text-sm flex items-center gap-2 border-r border-white/10"
                  >
                    <span className="whitespace-nowrap">{selectedCategory}</span>
                    <ChevronDown
                      className={`h-4 w-4 opacity-80 transition-transform ${
                        categoryOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => {
                      if (debouncedQuery) setShowSearchDropdown(true);
                    }}
                    placeholder="Search for products, categories, brands..."
                    className="h-11 w-full bg-white px-3 text-sm outline-none text-[#1A1A1A]"
                  />
                  <button
                    onClick={handleSearchSubmit}
                    className="flex h-11 w-14 items-center justify-center bg-[#D4AF37] px-4 text-[#0B1F3A] hover:bg-[#caa734]"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>

                {categoryOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E5E5E5] rounded-sm shadow-xl z-50 overflow-hidden">
                    <div className="max-h-72 overflow-auto py-1">
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(c);
                            setCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FFF8EC] ${
                            selectedCategory === c
                              ? "bg-[#FFF8EC] text-[#0B1F3A] font-semibold"
                              : "text-[#1A1A1A]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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