"use client";
import React from "react";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  syncUpdateCartItem,
  syncRemoveCartItem,
  syncClearCart,
} from "@/store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const [inputValues, setInputValues] = React.useState({});

  const cartItems = useSelector((state) => state.cart?.items || []);
  const loading = useSelector((state) => state.cart?.loading || false);
  const error = useSelector((state) => state.cart?.error || null);

  React.useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  React.useEffect(() => {
    const mappedValues = {};
    cartItems.forEach((item) => {
      mappedValues[item.cartItemId] = String(item.quantity || item.moq || 1);
    });
    setInputValues(mappedValues);
  }, [cartItems]);

  const cartCount = cartItems.length;

  const getTypedQty = (item) => {
    const rawValue = inputValues[item.cartItemId];
    if (rawValue === "" || rawValue === undefined) return null;

    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const hasInvalidMoq = cartItems.some((item) => {
    const typedQty = getTypedQty(item);
    if (typedQty === null) return false;
    return typedQty < (item.moq || 1);
  });

  const subtotal = cartItems.reduce((total, item) => {
    const typedQty = getTypedQty(item);
    const moq = item.moq || 1;
    const actualQty = typedQty ?? item.quantity ?? 0;

    if (actualQty < moq) return total;
    return total + item.price * actualQty;
  }, 0);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleInputChange = (cartItemId, value) => {
    if (/^\d*$/.test(value)) {
      setInputValues((prev) => ({
        ...prev,
        [cartItemId]: value,
      }));
    }
  };

  const handleInputBlur = async (item) => {
    const moq = item.moq || 1;
    const rawValue = inputValues[item.cartItemId];

    let finalQty = Number(rawValue);

    if (!rawValue || Number.isNaN(finalQty) || finalQty < moq) {
      finalQty = moq;
    }

    await dispatch(
      syncUpdateCartItem({
        itemId: item.cartItemId,
        quantity: finalQty,
      })
    );

    setInputValues((prev) => ({
      ...prev,
      [item.cartItemId]: String(finalQty),
    }));
  };

  const handleIncrease = async (item) => {
    const currentQty = Number(
      inputValues[item.cartItemId] ?? item.quantity ?? item.moq ?? 1
    );
    const finalQty = currentQty + 1;

    setInputValues((prev) => ({
      ...prev,
      [item.cartItemId]: String(finalQty),
    }));

    await dispatch(
      syncUpdateCartItem({
        itemId: item.cartItemId,
        quantity: finalQty,
      })
    );
  };

  const handleDecrease = async (item) => {
    const moq = item.moq || 1;
    const currentQty = Number(
      inputValues[item.cartItemId] ?? item.quantity ?? moq
    );
    const finalQty = currentQty > moq ? currentQty - 1 : moq;

    setInputValues((prev) => ({
      ...prev,
      [item.cartItemId]: String(finalQty),
    }));

    await dispatch(
      syncUpdateCartItem({
        itemId: item.cartItemId,
        quantity: finalQty,
      })
    );
  };

  const handleRemove = async (cartItemId) => {
    await dispatch(syncRemoveCartItem(cartItemId));
  };

  const handleClearCart = async () => {
    await dispatch(syncClearCart());
  };

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

          {loading && (
            <div className="bg-white border rounded-xl p-4 text-sm text-gray-600 mb-4">
              Loading cart...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {!loading && cartItems.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Browse products and add items to get started.
              </p>
              <Link href="/products">
                <button className="bg-orange-500 text-white px-5 py-2 rounded-md text-sm hover:bg-orange-600">
                  Browse Products
                </button>
              </Link>
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
                const typedQty = getTypedQty(item);
                const displayQty =
                  inputValues[item.cartItemId] ?? String(item.quantity || moq);

                const isBelowMoq = typedQty !== null && typedQty < moq;

                const qtyForTotal =
                  typedQty !== null ? typedQty : item.quantity || moq;

                const itemTotal =
                  qtyForTotal >= moq ? item.price * qtyForTotal : 0;

                return (
                  <div
                    key={item.cartItemId}
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

                      {isBelowMoq && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          Only MOQ quantity will be available. Minimum allowed is {moq}.
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            disabled={(item.quantity || moq) <= moq || loading}
                            className={`px-2.5 py-1 bg-gray-100 ${
                              (item.quantity || moq) <= moq || loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-200"
                            }`}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>

                          <input
                            type="text"
                            inputMode="numeric"
                            value={displayQty}
                            onChange={(e) =>
                              handleInputChange(item.cartItemId, e.target.value)
                            }
                            onBlur={() => handleInputBlur(item)}
                            className={`w-20 px-2 py-1 text-sm text-center outline-none ${
                              isBelowMoq ? "text-red-600" : ""
                            }`}
                            disabled={loading}
                          />

                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className={`px-2.5 py-1 bg-gray-100 ${
                              loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-200"
                            }`}
                            aria-label="Increase quantity"
                            disabled={loading}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm font-semibold text-gray-900">
                          ₹{itemTotal.toFixed(0)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      className="text-red-500"
                      disabled={loading}
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
              onClick={handleClearCart}
              disabled={loading || cartItems.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 border border-red-500 px-4 py-2 rounded-md text-sm ${
                loading || cartItems.length === 0
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
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
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
            <span>₹{total.toFixed(2)}</span>
          </div>

          <Link href="/checkout">
            <button
              disabled={hasInvalidMoq || loading || cartItems.length === 0}
              className={`w-full mt-4 py-2.5 rounded-md text-sm font-medium ${
                hasInvalidMoq || loading || cartItems.length === 0
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