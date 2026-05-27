"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items: cartItems, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const isUpdating = (id) => loading.update === id;
  const isRemoving = (id) => loading.remove === id;

  const handleUpdateQty = (item, qty) => {
    const moq = item.moq || 1;
    const finalQty = Number(qty) < moq ? moq : Number(qty);

    dispatch(
      updateCartItem({
        itemId: item.id,
        quantity: finalQty,
      })
    );
  };

  const handleIncrease = (item) => handleUpdateQty(item, item.quantity + 1);

  const handleDecrease = (item) => {
    const moq = item.moq || 1;
    handleUpdateQty(item, Math.max(moq, item.quantity - 1));
  };

  const handleRemove = (id) => dispatch(removeCartItem(id));

  const handleClear = async () => {
    await dispatch(clearCart());
    dispatch(fetchCart());
  };

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const qty = Math.max(item.quantity || 0, item.moq || 1);
      return sum + item.price * qty;
    }, 0);

    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return { subtotal, gst, total };
  }, [cartItems]);

  const cartCount = cartItems.length;

  const hasInvalidMoq = cartItems.some(
    (item) => item.quantity < (item.moq || 1)
  );

  const canCheckout =
    isAuthenticated &&
    !loading.fetch &&
    !loading.clear &&
    cartItems.length > 0 &&
    !hasInvalidMoq;

  const handleCheckout = () => {
    router.push("/proceedtocheckout");
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] px-4 sm:px-6 lg:px-16 xl:px-24 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#0B1F3A] text-white rounded-sm px-5 py-4 mb-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-sm bg-[#D4AF37] flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-[#0B1F3A]" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">My Cart</h2>
                <p className="text-sm text-white/75">{cartCount} items added</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {!loading && cartItems.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-75 shadow-sm">
              <div className="h-16 w-16 rounded-sm bg-[#FFF8EC] border border-[#E5E5E5] flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-[#0B1F3A]" />
              </div>

              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                Your cart is empty
              </h3>

              <p className="text-[#1A1A1A]/60 text-sm mb-6">
                Browse products and add items to get started.
              </p>

              <Link href="/products">
                <button className="bg-[#0B1F3A] hover:bg-[#08182c] text-white px-5 py-2.5 rounded-sm text-sm font-medium">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {hasInvalidMoq && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
                  Some items are below the minimum order quantity. Only MOQ quantity will be allowed.
                </div>
              )}

              {cartItems.map((item) => {
                const moq = item.moq || 1;
                const itemTotal = item.price * item.quantity;
                const updating = isUpdating(item.id);
                const removing = isRemoving(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E5E5E5] rounded-sm p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-sm border border-[#E5E5E5] bg-[#FFF8EC]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-[#1A1A1A] line-clamp-1">
                        {item.name}
                      </h4>

                      <p className="text-sm text-[#D4AF37] font-semibold mt-1">
                        ₹{item.price}
                      </p>

                      <p className="text-xs text-[#1A1A1A]/55">
                        Min. {moq} units
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center border border-[#E5E5E5] rounded-sm overflow-hidden bg-[#FFF8EC]">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={(item.quantity || moq) <= moq || updating}
                            className={`px-3 py-1.5 text-[#0B1F3A] cursor-pointer font-semibold ${
                              (item.quantity || moq) <= moq || updating
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-[#D4AF37]/20"
                            }`}
                          >
                            -
                          </button>

                          <span className="px-4 text-sm font-semibold text-[#1A1A1A]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={updating}
                            className="px-3 py-1.5 cursor-pointer text-[#0B1F3A] font-semibold hover:bg-[#D4AF37]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm sm:text-base font-bold text-[#0B1F3A]">
                          ₹{itemTotal.toFixed(0)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removing}
                      className="h-9 w-9 rounded-sm border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link href="/products">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#0B1F3A] text-[#0B1F3A] px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-[#0B1F3A] hover:text-white transition">
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </Link>

            <button
              onClick={handleClear}
              disabled={loading.clear || cartItems.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 border px-5 py-2.5 rounded-sm text-sm font-medium transition ${
                loading.clear || cartItems.length === 0
                  ? "border-red-200 text-red-300 cursor-not-allowed"
                  : "border-red-500 text-red-500 hover:bg-red-50"
              }`}
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-sm p-5 h-fit sticky top-20 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">
            Order Summary
          </h3>

          <div className="border-b border-[#E5E5E5] mb-4"></div>

          <div className="space-y-3 text-sm text-[#1A1A1A]/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#1A1A1A]">
                ₹{totals.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="font-medium text-[#1A1A1A]">
                ₹{totals.gst.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600 font-semibold">₹0</span>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] mt-5 pt-5 flex justify-between items-center">
            <span className="font-semibold text-[#1A1A1A]">Total</span>
            <span className="text-xl font-bold text-[#0B1F3A]">
              ₹{totals.total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            className={`w-full mt-5 py-3 rounded-sm text-sm font-semibold transition ${
              !canCheckout
                ? "bg-[#D4AF37]/60 text-white cursor-not-allowed"
                : "bg-[#D4AF37] hover:bg-[#c79f25] text-[#0B1F3A]"
            }`}
          >
            Proceed to Checkout →
          </button>

          <Link href="/allproducts">
            <button className="w-full border border-[#0B1F3A] text-[#0B1F3A] py-3 rounded-sm text-sm font-semibold mt-3 hover:bg-[#0B1F3A] hover:text-white transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;