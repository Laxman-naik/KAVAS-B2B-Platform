"use client";

import React, { useMemo, useState } from "react";
import {
  MapPin,
  FileText,
  Package,
  CreditCard,
  ShieldCheck,
  LockKeyhole,
  Download,
  Plus,
  Banknote,
  Landmark,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  createCheckout,
  verifyPayment,
} from "../../../store/slices/paymentSlice";

import { loadRazorpay } from "@/lib/razorpay";

const CheckOut = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const [selectedAddress, setSelectedAddress] = useState("office");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const cartItems = cart?.items || [];

  const fallbackProducts = [
    {
      id: 1,
      name: "Premium Coffee Beans",
      desc: "1kg • Pack of 10",
      qty: 2,
      unitPrice: 120,
      image: "/coffee.png",
    },
    {
      id: 2,
      name: "Ceramic Coffee Mug",
      desc: "Black • 350ml • Pack of 24",
      qty: 1,
      unitPrice: 120,
      image: "/mug.png",
    },
    {
      id: 3,
      name: "Green Tea Leaves",
      desc: "500g • Pack of 20",
      qty: 1,
      unitPrice: 200,
      image: "/tea.png",
    },
  ];

  const products = cartItems.length
    ? cartItems.map((item, index) => ({
        id: item.id || index,
        name: item.name || item.product_name || "Product",
        desc: item.description || item.variant || "Wholesale Item",
        qty: Number(item.quantity || item.qty || 1),
        unitPrice: Number(item.price || item.unit_price || 0),
        image: item.image || item.product_image || "/placeholder.png",
      }))
    : fallbackProducts;

  const subtotal = useMemo(
    () => products.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [products]
  );

  const total = cart?.summary?.total || subtotal;

  const addresses = [
    {
      id: "office",
      title: "Office Address",
      tag: "Default",
      name: "Kavas Industries Pvt. Ltd.",
      address:
        "123 Business Park, Industrial Area, New York, NY 10001, United States",
      person: "John Doe",
      phone: "+1 123 456 7890",
    },
    {
      id: "warehouse",
      title: "Warehouse Address",
      name: "Kavas Industries Pvt. Ltd.",
      address:
        "456 Logistics Hub, Warehouse Zone, New Jersey, NJ 07001, United States",
      person: "Michael Smith",
      phone: "+1 987 654 3210",
    },
    {
      id: "home",
      title: "Home Address",
      name: "John Doe",
      address: "789 Residential St, New York, NY 10002, United States",
      person: "John Doe",
      phone: "+1 123 456 7890",
    },
  ];

  const paymentMethods = [
    {
      id: "upi",
      title: "UPI",
      subtitle: "Pay using any UPI app",
      logos: ["G Pay", "PhonePe", "Paytm"],
    },
    {
      id: "netbanking",
      title: "Net Banking",
      subtitle: "Pay using your bank account",
      icon: <Landmark size={22} />,
    },
    {
      id: "card",
      title: "Credit / Debit Cards",
      subtitle: "Visa, Mastercard, ",
      logos: ["VISA", "Mastercard", "RuPay"],
    },
    {
      id: "cod",
      title: "Cash on Delivery (COD)",
      subtitle: "Pay when your order is delivered",
      icon: <Banknote size={22} />,
    },
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
        currency: data.currency || "INR",
        name: "KAVAS Wholesale Hub",
        description: "Order Payment",
        order_id: data.orderId,

        theme: {
          color: "#D4AF37",
        },

        handler: async (response) => {
          try {
            await dispatch(
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            alert("Payment Successful");
          } catch {
            alert("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err?.message || "Checkout failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FC] px-4 py-6 text-[#1A1A1A] md:px-8">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <Card>
            <SectionTitle
              icon={MapPin}
              title="Delivery Address"
              subtitle="Select a delivery address"
            />

            <div className="my-4 h-px bg-[#E5E5E5]" />

            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-[#1A1A1A]">
                Saved Addresses
              </h3>

              <button className="flex items-center gap-2 rounded-sm border border-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC]">
                <Plus size={16} />
                Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {addresses.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAddress(item.id)}
                  className={`rounded-sm border p-4 text-left transition ${
                    selectedAddress === item.id
                      ? "border-[#D4AF37] bg-[#FFF8EC]"
                      : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Radio active={selectedAddress === item.id} />

                    <div>
                      <h4 className="font-bold text-[#1A1A1A]">
                        {item.title}

                        {item.tag && (
                          <span className="ml-2 rounded-sm bg-[#FFF3D6] px-2 py-1 text-xs text-[#D4AF37]">
                            {item.tag}
                          </span>
                        )}
                      </h4>

                      <p className="mt-2 text-sm text-[#1A1A1A]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#666666]">
                        {item.address}
                      </p>

                      <p className="mt-2 text-sm text-[#1A1A1A]">
                        {item.person}

                        <span className="mx-2 text-[#999999]">|</span>

                        {item.phone}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <SectionTitle
                icon={FileText}
                title="Invoice Preview"
                subtitle="Review your invoice details before payment"
              />

              <button className="flex w-fit items-center gap-2 rounded-sm border border-[#E5E5E5] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:border-[#D4AF37]">
                <Download size={16} />
                Download Proforma Invoice
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-sm border border-[#E5E5E5] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-[#FFF8EC] text-left text-[#1A1A1A]">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Descriptions</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((item) => {
                      const itemTotal = item.qty * item.unitPrice;

                      return (
                        <tr
                          key={item.id}
                          className="border-t border-[#E5E5E5]"
                        >
                          <td className="px-4 py-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-16 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] object-contain"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <h4 className="font-bold text-[#1A1A1A]">
                              {item.name}
                            </h4>

                            <p className="mt-1 text-[#666666]">
                              {item.desc}
                            </p>
                          </td>

                          <td className="px-4 py-3 text-center">
                            {item.qty}
                          </td>

                          <td className="px-4 py-3 text-right">
                            ₹{item.unitPrice.toFixed(2)}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold">
                            ₹{itemTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto w-full max-w-md space-y-2 px-8 py-4 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={`₹${subtotal.toFixed(2)}`}
                />

                <SummaryRow label="Shipping" value="FREE" gold />

                <SummaryRow label="Tax (0%)" value="₹0.00" />

                <div className="flex justify-between border-t border-[#E5E5E5] pt-3 text-xl font-bold">
                  <span>Grand Total</span>

                  <span className="text-[#D4AF37]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <aside className="h-fit rounded-sm border border-[#E5E5E5] bg-white p-5 shadow-sm xl:sticky xl:top-5">
          <SectionTitle icon={Package} title="Order Summary" />

          <div className="my-4 h-px bg-[#E5E5E5]" />

          <div className="space-y-4">
            {products.map((item) => {
              const itemTotal = item.qty * item.unitPrice;

              return (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] object-contain"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <h4 className="text-sm font-bold text-[#1A1A1A]">
                        {item.name}
                      </h4>

                      <p className="text-sm font-bold text-[#D4AF37]">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-[#666666]">
                      {item.desc}
                    </p>

                    <p className="mt-1 text-xs text-[#1A1A1A]">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="my-4 h-px bg-[#E5E5E5]" />

          <div className="space-y-3 text-sm">
            <SummaryRow
              label="Subtotal"
              value={`₹${subtotal.toFixed(2)}`}
            />

            <SummaryRow label="Shipping" value="FREE" gold />

            <SummaryRow label="Tax (0%)" value="₹0.00" />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-4">
            <span className="text-lg font-bold text-[#1A1A1A]">
              Total
            </span>

            <span className="text-4xl font-bold text-[#D4AF37]">
              ₹{total.toFixed(2)}
            </span>
          </div>

          <div className="my-5 h-px bg-[#E5E5E5]" />

          <SectionTitle
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Choose your preferred payment method"
          />

          <div className="mt-3 space-y-2">
  {paymentMethods.map((method) => (
    <button
      key={method.id}
      type="button"
      onClick={() => setPaymentMethod(method.id)}
      className={`flex w-full items-center justify-between rounded-sm border px-3 py-2.5 text-left transition ${
        paymentMethod === method.id
          ? "border-[#D4AF37] bg-[#FFF8EC]"
          : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <Radio active={paymentMethod === method.id} />

        <div>
          <h4 className="text-[13px] font-semibold leading-none text-[#1A1A1A]">
            {method.title}
          </h4>

          <p className="mt-1 text-[11px] text-[#666666]">
            {method.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0B1F3A]">
        {method.logos?.map((logo) => (
          <span key={logo}>{logo}</span>
        ))}

        {method.icon && (
          <span className="text-[#0B1F3A]">
            {method.icon}
          </span>
        )}
      </div>
    </button>
  ))}
</div>

          <button
            onClick={handlePayment}
            className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#D4AF37] text-lg font-bold text-[#0B1F3A] transition hover:bg-[#c89f28]"
          >
            <LockKeyhole size={18} />
            Pay with Razorpay Securely
          </button>

          <div className="mt-4 text-center text-sm text-[#666666]">
            Secured by Razorpay
          </div>
        </aside>
      </section>
    </main>
  );
};

const Card = ({ children }) => {
  return (
    <section className="rounded-sm border border-[#E5E5E5] bg-white p-5 shadow-sm">
      {children}
    </section>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-sm border border-[#D4AF37] bg-[#FFF8EC]">
        <Icon size={24} className="text-[#D4AF37]" />
      </span>

      <div>
        <h3 className="text-2xl font-bold text-[#1A1A1A]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-[#666666]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const Radio = ({ active }) => {
  return (
    <span
      className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full border ${
        active ? "border-[#D4AF37]" : "border-[#999999]"
      }`}
    >
      {active && (
        <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
      )}
    </span>
  );
};

const SummaryRow = ({ label, value, gold }) => {
  return (
    <div className="flex justify-between">
      <span className="text-[#666666]">{label}</span>

      <span
        className={
          gold
            ? "font-bold text-[#D4AF37]"
            : "text-[#1A1A1A]"
        }
      >
        {value}
      </span>
    </div>
  );
};

export default CheckOut;