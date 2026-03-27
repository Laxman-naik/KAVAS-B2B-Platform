"use client";
import React, { useState } from "react";
import { CreditCard, Banknote, Smartphone, Wallet, ShoppingCart } from "lucide-react";
import Link from "next/link";

const CheckOut = () => {
    const [paymentMethod, setPaymentMethod] = useState("bank");

    const paymentMethods = [
        { id: "bank", name: "Bank Transfer", icon: <Banknote size={16} /> },
        { id: "card", name: "Card", icon: <CreditCard size={16} /> },
        { id: "upi", name: "UPI", icon: <Smartphone size={16} /> },
        { id: "wallet", name: "Pay Later", icon: <Wallet size={16} /> },
    ];

    const inputClass = "w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:ring-1 focus:ring-orange-400 focus:border-orange-400 outline-none";

    return (
        <div className="min-h-screen bg-gray-100 px-24 py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 max-w-7xl mx-auto">
                Checkout
            </h1>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">1</div>
                            <h3 className="text-lg font-semibold text-gray-800">Shipping / Business Address</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                                <input className={inputClass}
                                    placeholder="Rahul" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                                <input className={inputClass}
                                    placeholder="Sharma" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Company</label>
                            <input className={inputClass}
                                placeholder="Company name" />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
                            <input className={inputClass}
                                placeholder="Street, Building" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                                <input className={inputClass}
                                    placeholder="Hyderabad" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Pin Code</label>
                                <input className={inputClass}
                                    placeholder="500090" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                                <input className={inputClass}
                                    placeholder="+91 9876543210" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">GST (optional)</label>
                                <input className={inputClass}
                                    placeholder="22AAAA0000A1Z5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">2</div>
                            <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`flex items-center gap-1 px-3 py-2 border-2 rounded-md cursor-pointer text-sm transition-all ${paymentMethod === method.id
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-300 hover:border-orange-400"
                                        }`}
                                    onClick={() => setPaymentMethod(method.id)}
                                >
                                    {method.icon} {method.name}
                                </div>
                            ))}
                        </div>

                        {paymentMethod === "bank" && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Account Holder</label>
                                        <input className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Account Number</label>
                                        <input className={inputClass} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">IFSC</label>
                                        <input className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Bank Name</label>
                                        <input className={inputClass} />
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 mt-1">Order confirmed within 2 hours of payment</p>
                            </div>
                        )}

                        {paymentMethod === "card" && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Card Number</label>
                                    <input className={inputClass} placeholder="xxxx xxxx xxxx xxxx" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Expiry</label>
                                        <input className={inputClass} placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">CVV</label>
                                        <input className={inputClass} placeholder="123" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Cardholder Name</label>
                                    <input className={inputClass} />
                                </div>
                            </div>
                        )}

                        {paymentMethod === "upi" && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">UPI ID</label>
                                    <input className={inputClass} placeholder="example@upi" />
                                </div>
                            </div>
                        )}

                        {paymentMethod === "wallet" && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Mobile Number</label>
                                    <input className={inputClass} placeholder="Enter mobile for Pay Later" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">3</div>
                            <h3 className="text-lg font-semibold text-gray-800">Review & Place Order</h3>
                        </div>

                        <div className="bg-blue-100 text-center py-3 rounded-md mb-4">
                            <p className="text-sm text-blue-800">
                                By placing your order, you agree to our <a href="#" className="underline">Terms of Service</a>
                            </p>
                        </div>

                        <button className="w-full bg-orange-500 text-white py-2.5 rounded-md text-sm font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
                            <ShoppingCart size={16} /> Place Order — Pay ₹0
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-20 bg-white border rounded-xl p-4 shadow-sm">
                        <h3 className="text-base font-semibold mb-2">Order Summary</h3>
                        <div className="border-b mb-2"></div>

                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹0</span></div>
                            <div className="flex justify-between"><span>GST (18%)</span><span>₹0</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">FREE</span></div>
                            <div className="flex justify-between"><span>Discount</span><span className="text-green-600">₹0</span></div>
                        </div>

                        <div className="border-t mt-4 pt-3 flex justify-between font-semibold text-base">
                            <span>Total</span>
                            <span>₹0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;