"use client";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchCart, updateCartItem, removeCartItem, clearCart, } from "@/store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items: cartItems, loading, error, } = useSelector((state) => state.cart);

  // console.log("CART ITEMS:", cartItems);

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const isUpdating = (id) => loading.update === id;
  const isRemoving = (id) => loading.remove === id;
  const isFetching = loading.fetch;
  const isClearing = loading.clear;

  /* ---------------- HELPERS ---------------- */

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

  const handleIncrease = (item) => {
    handleUpdateQty(item, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    const moq = item.moq || 1;
    handleUpdateQty(item, Math.max(moq, item.quantity - 1));
  };

  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  /* ---------------- TOTALS ---------------- */

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

  /* ---------------- BUTTON STATES ---------------- */

  const getQty = (item) => item.quantity || item.moq || 1;
  const isDecreaseDisabled = (item) => getQty(item) <= (item.moq || 1);
  const isIncreaseDisabled = () => loading;

  // const isAnyLoading = loading?.fetch || loading?.update || loading?.remove || loading?.clear;


  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-16 xl:px-24 py-8 sm:py-10 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg sm:text-xl font-semibold">
              My Cart{" "}
              <span className="text-gray-500 text-sm">({cartCount} items)</span>
            </h2>
          </div>

          {/* {loading && (
            <div className="bg-white border rounded-xl p-4 text-sm text-gray-600 mb-4">
              Loading cart...
            </div>
          )} */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {!loading && cartItems.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-75">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Browse products and add items to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hasInvalidMoq && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
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
                    className="bg-white border rounded-xl p-4 flex items-center gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{item.name}</h4>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                      <p className="text-[11px] text-gray-500">
                        Min. {moq} units
                      </p>

                      {/* {isBelowMoq && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          Only MOQ quantity will be available. Minimum allowed is {moq}.
                        </p>
                      )} */}

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={updating || item.quantity <= moq}
                            className="px-2 bg-gray-200"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={updating}
                            className="px-2 bg-gray-200"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm font-semibold text-gray-900"> ₹{itemTotal.toFixed(0)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removing}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/products">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-400 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                <ArrowLeft size={16} />
                Continue Shopping
              </button>
            </Link>

            <button
              onClick={handleClear}
              disabled={loading.clear || cartItems.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 border hover:border-red-800 border-red-500 px-4 py-2 rounded-md text-sm ${loading.clear || cartItems.length === 0
                  ? "text-red-300 cursor-not-allowed"
                  : "text-red-500 hover:bg-red-50"
                }`}
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 h-fit sticky top-20">
          <h3 className="text-base font-semibold mb-2">Order Summary</h3>

          <div className="border-b mb-2"></div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totals.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{totals.gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">₹0</span>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>

          <Link href="/checkout">
            <button
              disabled={hasInvalidMoq || loading || cartItems.length === 0}
              className={`w-full mt-4 py-2.5 rounded-md text-sm font-medium ${hasInvalidMoq || loading || cartItems.length === 0
                ? "bg-orange-300 text-white cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
            >
              Proceed to Checkout →
            </button>
          </Link>

          <Link href="/products">
            <button className="w-full border py-2.5 rounded-md text-sm mt-3 hover:bg-gray-100">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;