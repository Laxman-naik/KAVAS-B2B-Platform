"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  Trash2,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfileSidebar from "@/components/buyer/ProfileSidebar";

import { logoutUserThunk } from "../../../store/slices/authSlice";
import {
  fetchFavourites,
  removeFromFavourites,
  clearFavourites,
} from "@/store/slices/favouritesSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart, fetchCart } from "@/store/slices/cartSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const pageSize = 6;

  const { items: favouriteIds = [], loading, error } = useSelector(
    (state) => state.favourites
  );

  const products = useSelector((state) => state.products.products || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const authUser = useSelector((state) => state.auth.user);

  const isLoggedIn = Boolean(authUser);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const productMap = useMemo(() => {
    return products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
  }, [products]);

  const cartProductIds = useMemo(() => {
    return new Set(cartItems.map((item) => item.product_id || item.productId));
  }, [cartItems]);

  const fullName =
    authUser?.full_name || authUser?.fullName || authUser?.name || "";

  const [firstName = "", ...restName] = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const user = {
    firstName: authUser?.firstName || firstName,
    lastName: authUser?.lastName || restName.join(" "),
    email: authUser?.email || "",
  };

  useEffect(() => {
    setMounted(true);

    if (authUser) {
      dispatch(fetchFavourites());
      dispatch(fetchProducts());
      dispatch(fetchCart());
    }
  }, [dispatch, authUser]);

  const normalized = useMemo(() => {
    return favouriteIds
      .map((id) => {
        const product = productMap[id];

        if (!product) return null;

        const primaryImage =
          product.image_url ||
          product.images?.find((img) => img.is_primary)?.image_url ||
          product.images?.[0]?.image_url ||
          "/placeholder.png";

        return {
          productId: id,
          organization_id: product.organization_id,
          image: primaryImage,
          name: product.name || "Product",
          sku: product.sku || "",
          color: product.color || "",
          mrp: Number(product.mrp || product.price || 0),
          price: Number(product.price || 0),
          stockLabel: product.stock > 0 ? "In Stock" : "Out of Stock",
          stockNote: product.stock > 0 ? "Available" : "Currently unavailable",
        };
      })
      .filter(Boolean);
  }, [favouriteIds, productMap]);

  const totals = useMemo(() => {
    const totalItems = normalized.length;

    const totalMrp = normalized.reduce(
      (sum, item) => sum + Number(item.mrp || 0),
      0
    );

    const totalWholesale = normalized.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    return {
      totalItems,
      totalMrp,
      totalWholesale,
    };
  }, [normalized]);

  const totalPages = Math.max(1, Math.ceil(normalized.length / pageSize));

  const paged = normalized.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleClearAll = async () => {
    if (!isLoggedIn) {
      showToast("Please login first");
      router.push("/login");
      return;
    }

    if (normalized.length === 0) {
      showToast("Wishlist is already empty");
      return;
    }

    try {
      setClearing(true);
      await dispatch(clearFavourites()).unwrap();
      showToast("Wishlist cleared");
    } catch (err) {
      console.error("CLEAR FAVOURITES FAILED:", err);
      showToast("Failed to clear wishlist");
    } finally {
      setClearing(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    showToast("Logged out successfully");
    router.push("/login");
  };

  const handleRemove = async (productId) => {
    if (!isLoggedIn) {
      showToast("Please login first");
      router.push("/login");
      return;
    }

    try {
      setRemovingId(productId);
      await dispatch(removeFromFavourites(productId)).unwrap();
      showToast("Removed from wishlist");
    } catch (err) {
      console.error("REMOVE FROM FAVOURITES FAILED:", err);
      showToast("Failed to remove product");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      showToast("Please login first");
      router.push("/login");
      return;
    }

    const product = productMap[productId];

    if (!product) {
      showToast("Product not found");
      return;
    }

    const primaryImage =
      product.image_url ||
      product.images?.find((img) => img.is_primary)?.image_url ||
      product.images?.[0]?.image_url ||
      "/placeholder.png";

    try {
      setAddingId(productId);

      await dispatch(
        addToCart({
          productId: product.id,
          quantity: product.moq || 1,
          image_url: primaryImage,
        })
      ).unwrap();

      await dispatch(fetchCart());

      showToast("Added to cart");
    } catch (err) {
      console.error("ADD TO CART FAILED:", err);
      showToast("Failed to add cart");
    } finally {
      setAddingId(null);
    }
  };

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        {toast && (
          <div className="fixed top-30 right-5 z-50 flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-[#0B1F3A] shadow-lg border border-[#E5E5E5]">
            <CheckCircle className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-sm font-semibold">{toast}</span>
          </div>
        )}

        <div className="mx-auto bg-white border rounded-sm border-white/10">
          <div className="text-center py-16 bg-white rounded-sm">
            <div className="text-5xl mb-3">❤️</div>

            <p className="text-gray-600 mb-4">
              Please log in to view favourites
            </p>

            <Button
              type="button"
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
    <div className="relative min-h-screen bg-white">
      {toast && (
        <div className="fixed top-30 right-5 z-50 flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-[#0B1F3A] shadow-lg border border-[#E5E5E5]">
          <CheckCircle className="h-5 w-5 text-[#D4AF37]" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="mx-auto bg-white border rounded-sm border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar user={user} onLogout={handleLogout} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                My Wishlist
              </h1>

              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <ChevronRight size={14} />
                <span className="text-[#0B1F3A]">My Wishlist</span>
              </div>
            </div>

            <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-sm bg-red-50 flex items-center justify-center">
                      <Heart className="text-red-600" size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Total Wishlist Items
                      </p>
                      <p className="text-lg font-bold text-[#0B1F3A]">
                        {totals.totalItems}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Price (MRP)</p>
                    <p className="text-lg font-bold text-[#0B1F3A]">
                      ₹{totals.totalMrp.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Price (Wholesale)</p>
                    <p className="text-lg font-bold text-green-700">
                      ₹{totals.totalWholesale.toLocaleString()}
                    </p>
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
                <p className="text-yellow-600">Login to see Wishlist</p>
              </div>
            ) : normalized.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-sm border border-[#E5E5E5]">
                <div className="text-5xl mb-3">❤️</div>
                <p className="text-gray-500">No favourites yet</p>
              </div>
            ) : (
              <Card className="rounded-sm border border-[#E5E5E5] shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-xs text-gray-500">
                          <th className="px-4 py-3 text-left font-medium">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            Unit Price (Wholesale)
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            Stock Status
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paged.map((row) => {
                          const isInCart = cartProductIds.has(row.productId);
                          const isOutOfStock =
                            row.stockLabel === "Out of Stock";

                          return (
                            <tr
                              key={row.productId}
                              className="border-t hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3 min-w-70">
                                  <img
                                    src={row.image}
                                    alt={row.name}
                                    className="w-12 h-12 rounded-sm object-cover border"
                                  />

                                  <div className="min-w-0">
                                    <p className="font-semibold text-[#0B1F3A] text-sm truncate">
                                      {row.name}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                      {row.sku ? `SKU: ${row.sku}` : ""}
                                      {row.sku && row.color ? " | " : ""}
                                      {row.color}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <p className="font-semibold text-[#0B1F3A]">
                                  ₹{row.price.toLocaleString()}
                                </p>

                                {row.mrp > 0 && (
                                  <p className="text-xs text-gray-500 line-through">
                                    ₹{row.mrp.toLocaleString()}
                                  </p>
                                )}
                              </td>

                              <td className="px-4 py-4">
                                <Badge
                                  className={
                                    row.stockLabel === "In Stock"
                                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                                      : "bg-red-100 text-red-700 hover:bg-red-100"
                                  }
                                >
                                  {row.stockLabel}
                                </Badge>

                                <p className="text-xs text-gray-500 mt-1">
                                  {row.stockNote}
                                </p>
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant={isInCart ? "secondary" : "outline"}
                                    className="rounded-sm border-[#E5E5E5] h-8 px-3"
                                    title={
                                      isInCart
                                        ? "Already in cart"
                                        : "Move to cart"
                                    }
                                    disabled={
                                      isInCart ||
                                      isOutOfStock ||
                                      addingId === row.productId
                                    }
                                    onClick={() =>
                                      handleAddToCart(row.productId)
                                    }
                                  >
                                    <ShoppingCart size={16} className="mr-1" />
                                    {addingId === row.productId
                                      ? "Adding..."
                                      : isInCart
                                      ? "In Cart"
                                      : "Add"}
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-sm border-[#E5E5E5] h-8 w-8 p-0 hover:bg-red-50"
                                    title="Remove"
                                    disabled={removingId === row.productId}
                                    onClick={() => handleRemove(row.productId)}
                                  >
                                    <Trash2
                                      size={16}
                                      className="text-gray-700"
                                    />
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
                      Showing {(page - 1) * pageSize + 1} to{" "}
                      {Math.min(page * pageSize, normalized.length)} of{" "}
                      {normalized.length} items
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
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-sm border-[#E5E5E5]"
                onClick={handleClearAll}
                disabled={clearing}
              >
                {clearing ? "Clearing..." : "Clear all"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-sm border-[#E5E5E5]"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;