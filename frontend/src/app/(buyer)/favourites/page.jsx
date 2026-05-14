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
import { fetchFavourites, removeFromFavourites, clearFavourites, getProductIdFromItem, } from "@/store/slices/favouritesSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart, fetchCart } from "@/store/slices/cartSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const { items: favouriteIds, loading, error } = useSelector((state) => state.favourites);
  const products = useSelector((state) => state.products.products || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const [token, setToken] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const pageSize = 6;
  const MAX_WISHLIST_ITEMS = 5;

  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  const cartProductIds = useMemo(() => {
    return new Set(
      cartItems.map((item) => item.product_id || item.productId)
    );
  }, [cartItems]);

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

  useEffect(() => {
    setMounted(true);
    dispatch(fetchFavourites());
    dispatch(fetchProducts());
    dispatch(fetchCart());
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

  useEffect(() => {
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

  const handleAddToCart = async (productId) => {
    if (!token) {
      router.push("/login");
      return;
    }

    const product = productMap[productId];

    if (!product) return;

    const primaryImage =
      product.images?.find((img) => img.is_primary)?.image_url ||
      product.images?.[0]?.image_url ||
      null;

    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity: product.moq || 1,
          image_url: primaryImage,
        })
      ).unwrap();

      alert("Added to cart");
    } catch (err) {
      console.error("ADD TO CART FAILED:", err);
    }
  };

  // const normalized = useMemo(() => {
  //   return favouriteIds
  //     .map((id) => {
  //       const product = productMap[id];
  //       if (!product) return null;

  //       return {
  //         productId: id,
  //         image: product.images?.find((img) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder.png",
  //         name: product.name || "Product",
  //         organization_id: product.organization_id,
  //         sku: product.sku || "",
  //         color: product.color || "",
  //         mrp: Number(product.mrp || product.price || 0),
  //         price: Number(product.price || 0),
  //         stockLabel: "In Stock",
  //         stockNote: "Available",
  //         addedOnDate: product.createdAt || "",
  //         addedOnTime: "",
  //       };
  //     })
  //     .filter(Boolean);
  // }, [favouriteIds, productMap]);

  const normalized = useMemo(() => {
  return favouriteIds
    .map((id) => {
      const product = productMap[id];
      if (!product) return null;
      return {
        productId: id,
        organization_id: product.organization_id,
        image:
          product.image_url ||
          product.images?.find((img) => img.is_primary)?.image_url ||
          product.images?.[0]?.image_url ||
          "/placeholder.png",
        name: product.name || "Product",
        sku: product.sku || "",
        color: product.color || "",
        mrp: Number(product.mrp || product.price || 0),
        price: Number(product.price || 0),
        stockLabel: "In Stock",
        stockNote: "Available",
        addedOnDate:
          product.createdAt ||
          product.created_at ||
          "",
        addedOnTime: "",
      };
    })
    .filter(Boolean);
}, [favouriteIds, productMap]);

  const totals = React.useMemo(() => {
    const totalItems = normalized.length;
    const totalMrp = normalized.reduce(
      (sum, x) => sum + Number(x.mrp || 0),
      0
    );

    const totalWholesale = normalized.reduce(
      (sum, x) => sum + Number(x.price || 0),
      0
    ); return { totalItems, totalMrp, totalWholesale };
  }, [normalized]);

  const totalPages = Math.max(1, Math.ceil(normalized.length / pageSize));
  const paged = normalized.slice((page - 1) * pageSize, page * pageSize);

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
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-sm border border-[#E5E5E5]">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-sm border border-[#E5E5E5]">
                <p className="text-yellow-500">Login to see Wishlist</p>
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
                          <th className="px-4 py-3 text-left font-medium">Product</th>
                          <th className="px-4 py-3 text-left font-medium">Unit Price (Wholesale)</th>
                          <th className="px-4 py-3 text-left font-medium">Stock Status</th>
                          {/* <th className="px-4 py-3 text-left font-medium">Added On</th> */}
                          <th className="px-4 py-3 text-right font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map((row) => {
                          const isInCart = cartProductIds.has(row.productId);
                          return (
                            <tr key={row.productId} className="border-t">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3 min-w-70">
                                  <img
                                    src={row.image || "/placeholder.png"}
                                    alt={row.name || "product"}
                                    className="w-12 h-12 rounded-sm object-cover border"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-semibold text-[#0B1F3A] text-sm truncate">
                                      {row.name}
                                    </p>
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
                                  <p className="font-semibold text-[#0B1F3A]">
                                    ₹{row.price.toLocaleString()}
                                  </p>
                                  {row.mrp ? (
                                    <p className="text-xs text-gray-500 line-through">
                                      ₹{row.mrp.toLocaleString()}
                                    </p>
                                  ) : null}
                                  {/* {row.mrp && row.price && row.mrp > row.price ? (
                                    <p className="text-xs text-green-700 font-semibold">
                                      (
                                      {Math.round(
                                        ((row.mrp - row.price) / row.mrp) * 100
                                      )}
                                      % OFF)
                                    </p>
                                  ) : null} */}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <Badge className="bg-green-100 text-green-700">
                                  {row.stockLabel}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {row.stockNote}
                                </p>
                              </td>
                              {/* <td className="px-4 py-4">
                                <p className="text-xs text-gray-600">
                                  {row.addedOnDate}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {row.addedOnTime}
                                </p>
                              </td> */}
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant={isInCart ? "secondary" : "outline"}
                                    className="rounded-sm border-[#E5E5E5] h-8 px-3"
                                    title={isInCart ? "Already in cart" : "Move to cart"}
                                    disabled={isInCart}
                                    onClick={() => handleAddToCart(row.productId)}
                                  >
                                    <ShoppingCart size={16} className="mr-1" />
                                    {isInCart ? "In Cart" : "Add"}
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
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-4 py-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

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