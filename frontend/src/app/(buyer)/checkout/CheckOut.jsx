"use client";
import React, { useState } from "react";
import { CreditCard, Banknote, Smartphone, ShoppingCart, } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout, verifyPayment } from "../../../store/slices/paymentSlice";
import { loadRazorpay } from "@/lib/razorpay";

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const handlePlaceOrder = async () => {
  const res = await fetch("/api/orders/create", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (data.success) {
    console.log("Order created", data.order);
    // NEXT: trigger payment
  }
};
  const paymentMethods = [
    { id: "bank", name: "Bank Transfer", icon: <Banknote size={16} /> },
    { id: "card", name: "Card", icon: <CreditCard size={16} /> },
    { id: "upi", name: "UPI", icon: <Smartphone size={16} /> },
  ];

  const handlePayment = async () => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert("Razorpay SDK failed to load");
    return;
  }

  try {
    const data = await dispatch(createCheckout()).unwrap();

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "Your Store",
      description: "Order Payment",
      order_id: data.orderId,

      handler: async function (response) {
        try {
          await dispatch(
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          ).unwrap();

          alert("Payment Successful");
        } catch (err) {
          alert("Payment verification failed");
        }
      },

      theme: {
        color: "#f97316",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    alert(err.message || "Checkout failed");
  }
};

  const inputClass ="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-1 focus:ring-orange-400 focus:border-orange-400 outline-none";

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-16 xl:px-24 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 max-w-7xl mx-auto">Checkout</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
              <h3 className="text-base sm:text-lg font-semibold">Shipping / Business Address</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input className={inputClass} placeholder="First Name" />
              <input className={inputClass} placeholder="Last Name" />
            </div>
            <input className={`${inputClass} mb-3`} placeholder="Company name" />
            <input className={`${inputClass} mb-4`} placeholder="Address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className={inputClass} placeholder="City" />
              <input className={inputClass} placeholder="Pin Code" />
              <input className={inputClass} placeholder="Phone" />
              <input className={inputClass} placeholder="GST (optional)" />
            </div>
          </div>
          <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-2 border-b">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
              <h3 className="text-base sm:text-lg font-semibold">Payment Method</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center justify-center gap-1 px-2 py-2 border-2 rounded-md cursor-pointer text-xs sm:text-sm ${
                    paymentMethod === method.id? "border-orange-500 bg-orange-50" : "border-gray-300"
                  }`}
                >{method.icon} {method.name}</div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-md border">
              {paymentMethod === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input className={inputClass} placeholder="Account Holder" />
                  <input className={inputClass} placeholder="Account Number" />
                  <input className={inputClass} placeholder="IFSC" />
                  <input className={inputClass} placeholder="Bank Name" />
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="space-y-2">
                  <input className={inputClass} placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-2">
                    <input className={inputClass} placeholder="MM/YY" />
                    <input className={inputClass} placeholder="CVV" />
                  </div>
                  <input className={inputClass} placeholder="Cardholder Name" />
                </div>
              )}
              {paymentMethod === "upi" && (
                <input className={inputClass} placeholder="example@upi" />
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Review & Place Order</h3>
            <button onClick={handlePayment} className="w-full bg-orange-500 text-white py-2.5 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-orange-600">
              <ShoppingCart size={16} /> Place Order — Pay ₹{cart?.summary?.total || 0}
            </button>
          </div>
        </div>
        <div>
          <div className="bg-white border rounded-xl p-4 shadow-sm lg:sticky lg:top-20">
            <h3 className="text-base font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart?.summary?.subtotal || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹{cart?.summary?.gst || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>
            <div className="border-t mt-4 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{cart?.summary?.total || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
