"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";
import { ChevronRight, Heart, Share2, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "../../../store/slices/authSlice";
import {fetchFavourites,removeFromFavourites,clearFavourites,getProductIdFromItem,} from "@/store/slices/favouritesSlice";
import { fetchProducts } from "@/store/slices/productSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const { items: favouriteIds, loading, error } = useSelector((state) => state.favourites);
  const products = useSelector((state) => state.products.products || []);
  const [token, setToken] = React.useState(null);
  const [selected, setSelected] = React.useState({});
  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  const productMap = useMemo(() => {
  const map = {};
  products.forEach((p) => {
    map[p.id] = p;
  });
  return map;
}, [products]);

  // const favouriteProducts = useMemo(() => {
  //   return favouriteIds.map((id) => productMap[id]).filter(Boolean);
  // }, [favouriteIds, productMap]);

  const authUser = useSelector((state) => state.auth.user);

  const fullName = authUser?.full_name || authUser?.fullName || authUser?.name || "";
  const [firstName = "", ...rest] = String(fullName).trim().split(/\s+/).filter(Boolean);
  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || rest.join(" "),
    email: authUser?.email || "",
  };

  React.useEffect(() => {
    setMounted(true);
    dispatch(fetchFavourites());
    dispatch(fetchProducts());
  }, [dispatch]);

    useEffect(() => {
  const savedToken = localStorage.getItem("accessToken");
  setToken(savedToken);

  const handleStorageChange = () => {
    const updatedToken = localStorage.getItem("accessToken");
    setToken(updatedToken);
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  React.useEffect(() => {
    if (mounted && token) {
      dispatch(fetchFavourites());
    }
  }, [mounted, token, dispatch]);

  const handleClearAll = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    dispatch(clearFavourites());
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push("/login");
  };

  const handleRemove = (productId) => {
    if (!token) {
      router.push("/login");
      return;
    }
    dispatch(removeFromFavourites(productId));
  };

  // const normalized = React.useMemo(() => {
  //   return (favourites || []).map((item, index) => {
  //     const productId = getProductIdFromItem(item) || index;
  //     const image =
  //       item?.image ||
  //       item?.image_url ||
  //       item?.imageUrl ||
  //       item?.product?.image ||
  //       "/placeholder.png";
  //     const price =
  //       Number(item?.wholesalePrice ?? item?.priceValue ?? item?.price ?? item?.product?.price ?? 0) || 0;
  //     const mrp =
  //       Number(item?.mrp ?? item?.product?.mrp ?? item?.originalPrice ?? price) || 0;
  //     const name = item?.name || item?.product?.name || "Product";
  //     const sku = item?.sku || item?.product?.sku || "";
  //     const color = item?.color || item?.product?.color || "";
  //     const addedOnDate = item?.addedOnDate || item?.createdAt || "15 May 2024";
  //     const addedOnTime = item?.addedOnTime || "02:30 PM";
  //     const stockLabel = item?.stockLabel || "In Stock";
  //     const stockNote = item?.stockNote || "250+ available";

  //     return {
  //       productId,
  //       image,
  //       name,
  //       sku,
  //       color,
  //       mrp,
  //       price,
  //       stockLabel,
  //       stockNote,
  //       addedOnDate,
  //       addedOnTime,
  //     };
  //   });
  // }, [favourites]);

  const normalized = useMemo(() => {
  return favouriteIds
    .map((id) => {
      const product = productMap[id];
      if (!product) return null;

      return {
        productId: id,
        image: product.image || "/placeholder.png",
        name: product.name || "Product",
        sku: product.sku || "",
        color: product.color || "",
        mrp: product.mrp || product.price || 0,
        price: product.price || 0,
        stockLabel: "In Stock",
        stockNote: "Available",
        addedOnDate: product.createdAt || "",
        addedOnTime: "",
      };
    })
    .filter(Boolean);
}, [favouriteIds, productMap]);

  const totals = React.useMemo(() => {
    const totalItems = normalized.length;
    const totalMrp = normalized.reduce((sum, x) => sum + (x.mrp || 0), 0);
    const totalWholesale = normalized.reduce((sum, x) => sum + (x.price || 0), 0);
    return { totalItems, totalMrp, totalWholesale };
  }, [normalized]);

  const totalPages = Math.max(1, Math.ceil(normalized.length / pageSize));
  const paged = normalized.slice((page - 1) * pageSize, page * pageSize);

  const selectedIds = React.useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  const toggleAllOnPage = (checked) => {
    const next = { ...selected };
    paged.forEach((row) => {
      next[String(row.productId)] = checked;
    });
    setSelected(next);
  };

  const removeSelected = () => {
    if (!token) {
      router.push("/login");
      return;
    }

    selectedIds.forEach((id) => handleRemove(id));
    setSelected({});
  };

  if (!mounted) return null;

  if (!token) {
    return (
      <div className="bg-[#0B1F3A] min-h-screen">
        <div className="mx-auto bg-white border rounded-sm border-white/10">
          <div className="text-center py-16 bg-white rounded-sm">
            <div className="text-5xl mb-3">❤️</div>
            <p className="text-gray-600 mb-4">Please log in to view favourites</p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#0B1F3A] hover:bg-[#0B1F3A]/95 text-white rounded-sm"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1F3A] min-h-screen">
      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">My Wishlist</h1>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={14} />
                <span className="text-[#0B1F3A]">My Wishlist</span>
              </div>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5]">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-sm bg-red-50 flex items-center justify-center">
                        <Heart className="text-red-600" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Wishlist Items</p>
                        <p className="text-lg font-bold text-[#0B1F3A]">{totals.totalItems}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Price (MRP)</p>
                      <p className="text-lg font-bold text-[#0B1F3A]">₹{totals.totalMrp.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Price (Wholesale)</p>
                      <p className="text-lg font-bold text-green-700">₹{totals.totalWholesale.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="bg-[#D4AF37] text-[#0B1F3A] rounded-sm hover:bg-[#caa734] font-semibold">
                      <ShoppingCart size={16} className="mr-2" /> Move All to Cart
                    </Button>
                    <Button variant="outline" className="rounded-sm border-[#E5E5E5]">
                      <Share2 size={16} className="mr-2" /> Share Wishlist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-sm border border-[#E5E5E5]">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-sm border border-[#E5E5E5]">
                <p className="text-red-500">{error}</p>
              </div>
            ) : normalized.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-sm border border-[#E5E5E5]">
                <div className="text-5xl mb-3">❤️</div>
                <p className="text-gray-500">No favourites yet</p>
              </div>
            ) : (
              <Card className="rounded-sm border border-[#E5E5E5]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-xs text-gray-500">
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              onChange={(e) => toggleAllOnPage(e.target.checked)}
                              checked={
                                paged.length > 0 &&
                                paged.every((r) => selected[String(r.productId)])
                              }
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-medium">Product</th>
                          <th className="px-4 py-3 text-left font-medium">Unit Price (Wholesale)</th>
                          <th className="px-4 py-3 text-left font-medium">Stock Status</th>
                          <th className="px-4 py-3 text-left font-medium">Added On</th>
                          <th className="px-4 py-3 text-left font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map((row) => (
                          <tr key={row.productId} className="border-t">
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={Boolean(selected[String(row.productId)])}
                                onChange={(e) =>
                                  setSelected((prev) => ({
                                    ...prev,
                                    [String(row.productId)]: e.target.checked,
                                  }))
                                }
                              />
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3 min-w-70">
                                <img
                                  src={row.image}
                                  alt={row.name}
                                  className="w-12 h-12 rounded-sm object-cover border"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#0B1F3A] text-sm truncate">{row.name}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {row.sku ? `SKU: ${row.sku}` : null}
                                    {row.sku && row.color ? "  |  " : null}
                                    {row.color ? row.color : null}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <div>
                                <p className="font-semibold text-[#0B1F3A]">₹{row.price.toLocaleString()}</p>
                                {row.mrp ? (
                                  <p className="text-xs text-gray-500 line-through">₹{row.mrp.toLocaleString()}</p>
                                ) : null}
                                {row.mrp && row.price && row.mrp > row.price ? (
                                  <p className="text-xs text-green-700 font-semibold">
                                    ({Math.round(((row.mrp - row.price) / row.mrp) * 100)}% OFF)
                                  </p>
                                ) : null}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <Badge className="bg-green-100 text-green-700">{row.stockLabel}</Badge>
                              <p className="text-xs text-gray-500 mt-1">{row.stockNote}</p>
                            </td>

                            <td className="px-4 py-4">
                              <p className="text-xs text-gray-600">{row.addedOnDate}</p>
                              <p className="text-xs text-gray-500">{row.addedOnTime}</p>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0" title="Move to cart">
                                  <ShoppingCart size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0"
                                  title="Remove"
                                  onClick={() => handleRemove(row.productId)}
                                >
                                  <Trash2 size={16} className="text-gray-700" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-4 py-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-sm border-[#E5E5E5] h-9"
                      onClick={removeSelected}
                      disabled={selectedIds.length === 0}
                    >
                      <Trash2 size={16} className="mr-2" /> Remove Selected
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, normalized.length)} of {normalized.length} items
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-sm border-[#E5E5E5] h-8"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Prev
                      </Button>
                      <Button
                        type="button"
                        className="rounded-sm h-8 bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/95"
                      >
                        {page}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-sm border-[#E5E5E5] h-8"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-sm border-[#E5E5E5]" onClick={handleClearAll}>
                Clear all
              </Button>
              <Button variant="outline" className="rounded-sm border-[#E5E5E5]" onClick={() => router.push("/")}>Continue Shopping</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;