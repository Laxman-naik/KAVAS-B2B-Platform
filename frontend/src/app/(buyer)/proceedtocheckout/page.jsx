// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { MapPin, FileText, Package, CreditCard, ShieldCheck, LockKeyhole, Download, Plus, Landmark, Banknote, } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAddresses } from "@/store/slices/addressSlice";
// import { fetchCart } from "@/store/slices/cartSlice";
// import { createOrderFromCart } from "@/store/slices/orderSlice";
// import { loadRazorpay } from "@/lib/razorpay";
// import { createCheckout, verifyPayment } from "@/store/slices/paymentSlice";

// const Page = () => {
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const dispatch = useDispatch();
//   const { addresses, loading } = useSelector((state) => state.address);
//   const { items: cartItems = [], loading: cartLoading, } = useSelector((state) => state.cart);
//   const defaultAddress = useMemo(() => addresses.find((a) => a.is_default), [addresses]);
//   // console.log(cartItems)

//   useEffect(() => {
//     dispatch(fetchAddresses());
//     dispatch(fetchCart());
//   }, [dispatch]);

//   const products = useMemo(() => {
//     return cartItems.map((item) => ({
//       id: item.id,

//       name: item.name,

//       desc: [
//         item.unit ? `Unit: ${item.unit}` : null,
//         item.moq ? `MOQ: ${item.moq}` : null,
//       ]
//         .filter(Boolean)
//         .join(" • "),

//       qty: Number(item.quantity),

//       unitPrice: Number(item.price || 0),

//       mrp: Number(item.mrp || 0),

//       image: item.image_url || "/placeholder.png",

//       productId: item.product_id,
//       variantId: item.variant_id,
//       organizationId: item.organization_id,
//     }));
//   }, [cartItems]);

//   const paymentMethods = [
//     {
//       id: "upi",
//       title: "UPI",
//       subtitle: "Pay using any UPI app",
//       logos: ["G Pay", "PhonePe", "Paytm"],
//     },
//     {
//       id: "netbanking",
//       title: "Net Banking",
//       subtitle: "Pay using your bank account",
//       icon: <Landmark size={22} />,
//     },
//     {
//       id: "card",
//       title: "Credit / Debit Cards",
//       subtitle: "Visa, Mastercard, ",
//       logos: ["VISA", "Mastercard", "RuPay"],
//     },
//     {
//       id: "cod",
//       title: "Cash on Delivery (COD)",
//       subtitle: "Pay when your order is delivered",
//       icon: <Banknote size={22} />,
//     },
//   ];

//   const handlePayment = async () => {
//     const isLoaded = await loadRazorpay();

//     if (!isLoaded) {
//       alert("Razorpay SDK failed to load");
//       return;
//     }

//     try {
//       const data = await dispatch(createCheckout()).unwrap();

//       const options = {
//         key: data.key,
//         amount: data.amount,
//         currency: data.currency || "INR",
//         name: "KAVAS Wholesale Hub",
//         description: "Order Payment",
//         order_id: data.orderId,

//         theme: {
//           color: "#D4AF37",
//         },

//         handler: async (response) => {
//           try {
//             await dispatch(
//               verifyPayment({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               })
//             ).unwrap();

//             alert("Payment Successful");
//           } catch {
//             alert("Payment verification failed");
//           }
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       alert(err?.message || "Checkout failed");
//     }
//   };

//   const subtotal = useMemo(() => {
//     return products.reduce(
//       (sum, item) => sum + item.qty * item.unitPrice,
//       0
//     );
//   }, [products]);

//   return (
//     <main className="min-h-screen bg-[#001a35] px-4 py-5 text-[#0b1324] md:px-8">
//       <section className="mb-5 flex flex-col gap-5 text-white lg:flex-row lg:items-center lg:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold md:text-4xl">Checkout</h1>
//           <p className="mt-1 text-sm text-white/75">
//             Review your order and complete your purchase
//           </p>
//         </div>
//       </section>

//       <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
//         <div className="space-y-5">
//           <Card>
//             <SectionTitle icon={MapPin} title="Delivery Address" />
//             <div className="mt-4 grid grid-cols-1 gap-4">
//               {defaultAddress && (
//                 <div className="mt-4">
//                   <button className="w-full rounded-sm border border-[#f3a51c] bg-[#fff8ea] p-4 text-left">
//                     <div className="flex gap-3">
//                       <Radio active />
//                       <div className="w-full">
//                         <div className="flex items-center gap-2">
//                           <h4 className="text-sm font-bold capitalize">{defaultAddress.type}</h4>
//                           <span className="rounded-sm bg-[#fff2d2] px-2 py-1 text-[11px] font-semibold text-[#d48800]">Default</span>
//                         </div>
//                         <p className="mt-2 text-sm leading-6 text-[#536072]">
//                           {defaultAddress.address_line1}
//                           {defaultAddress.address_line2 &&
//                             `, ${defaultAddress.address_line2}`}
//                           , {defaultAddress.city}
//                         </p>
//                         <p className="text-sm leading-6 text-[#536072]"> {defaultAddress.state}, {defaultAddress.country} - {defaultAddress.postal_code}</p>
//                         <p className="mt-2 text-sm"> {defaultAddress.phone} </p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </Card>

//           <Card>
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <SectionTitle icon={FileText} title="Invoice Preview" />
//             </div>

//             <div className="mt-5 overflow-hidden rounded-sm border border-[#d8dee8]">
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[720px] text-sm">
//                   <thead className="bg-[#f8fafc] text-left">
//                     <tr>
//                       <th className="px-4 py-3">Item</th>
//                       <th className="px-4 py-3">Description</th>
//                       <th className="px-4 py-3 text-center">Qty</th>
//                       <th className="px-4 py-3 text-right">Unit Price</th>
//                       <th className="px-4 py-3 text-right">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map((item) => { const total = item.qty * item.unitPrice;
//                       return (
//                         <tr key={item.id} className="border-t border-[#d8dee8]">
//                           <td className="px-4 py-3">
//                             <img src={item.image} alt={item.name} className="h-14 w-16 rounded-sm bg-[#f3f5f8] object-contain" />
//                           </td>
//                           <td className="px-4 py-3">
//                             <h4 className="font-bold">{item.name}</h4>
//                             <p className="mt-1 text-[#536072]">{item.desc}</p>
//                           </td>
//                           <td className="px-4 py-3 text-center">{item.qty}</td>
//                           <td className="px-4 py-3 text-right">
//                             ${item.unitPrice.toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 text-right font-semibold">
//                             ${total.toFixed(2)}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="ml-auto w-full max-w-sm space-y-2 px-5 py-4 text-sm">
//                 <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
//                 <SummaryRow label="Shipping" value="FREE" gold />
//                 <SummaryRow label="Tax (0%)" value="$0.00" />
//                 <div className="flex justify-between border-t border-[#d8dee8] pt-3 text-lg font-bold">
//                   <span>Grand Total</span>
//                   <span className="text-[#d48800]">${subtotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 flex items-center gap-3 rounded-sm border border-[#f3c77b] bg-[#fff8ea] px-4 py-3 text-sm text-[#536072]">
//               <ShieldCheck size={18} className="text-[#d48800]" />
//               This is a proforma invoice. Final invoice will be available after
//               order confirmation.
//             </div>
//           </Card>
//         </div>

//         <aside className="h-fit rounded-sm border border-[#E5E5E5] bg-white p-5 shadow-sm xl:sticky xl:top-5">
//           <SectionTitle icon={Package} title="Order Summary" />

//           <div className="my-4 h-px bg-[#E5E5E5]" />

//           <div className="space-y-4">
//             {products.map((item) => {
//               const itemTotal = item.qty * item.unitPrice;

//               return (
//                 <div key={item.id} className="flex gap-4">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="h-16 w-16 rounded-sm border border-[#E5E5E5] bg-[#FFF8EC] object-contain"
//                   />

//                   <div className="flex-1">
//                     <div className="flex justify-between gap-3">
//                       <h4 className="text-sm font-bold text-[#1A1A1A]">
//                         {item.name}
//                       </h4>

//                       <p className="text-sm font-bold text-[#D4AF37]">
//                         ₹{itemTotal.toFixed(2)}
//                       </p>
//                     </div>

//                     <p className="mt-1 text-xs text-[#666666]">
//                       {item.desc}
//                     </p>

//                     <p className="mt-1 text-xs text-[#1A1A1A]">
//                       Qty: {item.qty}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="my-4 h-px bg-[#E5E5E5]" />

//           <div className="space-y-3 text-sm">
//             <SummaryRow
//               label="Subtotal"
//               value={`₹${subtotal.toFixed(2)}`}
//             />

//             <SummaryRow label="Shipping" value="FREE" gold />

//             <SummaryRow label="Tax (0%)" value="₹0.00" />
//           </div>

//           <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-4">
//             <span className="text-lg font-bold text-[#1A1A1A]">
//               Total
//             </span>

//             <span className="text-4xl font-bold text-[#D4AF37]">
//               ₹{subtotal.toFixed(2)}
//             </span>
//           </div>

//           <div className="my-5 h-px bg-[#E5E5E5]" />

//           <SectionTitle
//             icon={CreditCard}
//             title="Payment Methods"
//             subtitle="Choose your preferred payment method"
//           />

//           <div className="mt-3 space-y-2">
//             {paymentMethods.map((method) => (
//               <button
//                 key={method.id}
//                 type="button"
//                 onClick={() => setPaymentMethod(method.id)}
//                 className={`flex w-full items-center justify-between rounded-sm border px-3 py-2.5 text-left transition ${paymentMethod === method.id
//                   ? "border-[#D4AF37] bg-[#FFF8EC]"
//                   : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
//                   }`}
//               >
//                 <div className="flex items-start gap-2.5">
//                   <Radio active={paymentMethod === method.id} />

//                   <div>
//                     <h4 className="text-[13px] font-semibold leading-none text-[#1A1A1A]">
//                       {method.title}
//                     </h4>

//                     <p className="mt-1 text-[11px] text-[#666666]">
//                       {method.subtitle}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0B1F3A]">
//                   {method.logos?.map((logo) => (
//                     <span key={logo}>{logo}</span>
//                   ))}

//                   {method.icon && (
//                     <span className="text-[#0B1F3A]">
//                       {method.icon}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={handlePayment}
//             className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#D4AF37] text-lg font-bold text-[#0B1F3A] transition hover:bg-[#c89f28]"
//           >
//             <LockKeyhole size={18} />
//             Pay with Razorpay Securely
//           </button>

//           <div className="mt-4 text-center text-sm text-[#666666]">
//             Secured by Razorpay
//           </div>
//         </aside>
//       </section>
//     </main>
//   );
// };

// const Card = ({ children }) => {
//   return (
//     <section className="rounded-sm border border-[#d8dee8] bg-white p-5 shadow-xl">
//       {children}
//     </section>
//   );
// };

// const SectionTitle = ({ icon: Icon, title, subtitle }) => {
//   return (
//     <div className="flex items-center gap-3">
//       <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#f3a51c] bg-[#fff8ea]">
//         <Icon size={23} className="text-[#d48800]" />
//       </span>

//       <div>
//         <h3 className="text-xl font-bold text-[#0b1324]">{title}</h3>
//         {subtitle && <p className="mt-1 text-sm text-[#536072]">{subtitle}</p>}
//       </div>
//     </div>
//   );
// };

// const Radio = ({ active }) => {
//   return (
//     <span
//       className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-[#f3a51c]" : "border-[#9aa4b2]"
//         }`}
//     >
//       {active && <span className="h-2 w-2 rounded-full bg-[#f3a51c]" />}
//     </span>
//   );
// };

// const SummaryRow = ({ label, value, gold }) => {
//   return (
//     <div className="flex justify-between">
//       <span className="text-[#536072]">{label}</span>
//       <span className={gold ? "font-bold text-[#d48800]" : "text-[#0b1324]"}>
//         {value}
//       </span>
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  FileText,
  Package,
  CreditCard,
  ShieldCheck,
  LockKeyhole,
  Landmark,
  Banknote,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { fetchAddresses } from "@/store/slices/addressSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { createOrderFromCart } from "@/store/slices/orderSlice";
import { createCheckout, verifyPayment } from "@/store/slices/paymentSlice";

import { loadRazorpay } from "@/lib/razorpay";

const Page = () => {
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const dispatch = useDispatch();

  const { addresses } = useSelector((state) => state.address);

  const { items: cartItems = [] } = useSelector(
    (state) => state.cart
  );

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.is_default),
    [addresses]
  );

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, [dispatch]);

  const products = useMemo(() => {
    return cartItems.map((item) => ({
      id: item.id,

      name: item.name,

      desc: [
        item.unit ? `Unit: ${item.unit}` : null,
        item.moq ? `MOQ: ${item.moq}` : null,
      ]
        .filter(Boolean)
        .join(" • "),

      qty: Number(item.quantity),

      unitPrice: Number(item.price || 0),

      image: item.image_url || "/placeholder.png",
    }));
  }, [cartItems]);

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
      subtitle: "Visa, Mastercard",
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
    try {
      // COD FLOW
      if (paymentMethod === "cod") {
        await dispatch(
          createOrderFromCart({
            payment_method: "cod",
          })
        ).unwrap();

        alert("Order placed successfully with COD");
        return;
      }

      // LOAD RAZORPAY
      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // CREATE ORDER
      const orderRes = await dispatch(
        createOrderFromCart({
          idempotency_key: crypto.randomUUID(),
        })
      ).unwrap();

      const orderId = orderRes?.orders?.[0]?.id;

      if (!orderId) {
        alert("Order ID missing");
        return;
      }

      // CREATE CHECKOUT
      const data = await dispatch(
        createCheckout({ orderId })
      ).unwrap();

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

        // THIS CONTROLS WHICH PAYMENT METHOD OPENS
        method: {
          upi: paymentMethod === "upi",
          card: paymentMethod === "card",
          netbanking: paymentMethod === "netbanking",
          wallet: false,
          emi: false,
          paylater: false,
        },

        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using Net Banking",
                instruments: [{ method: "netbanking", },],
              },

              cards: {
                name: "Pay using Cards",
                instruments: [{ method: "card", },],
              },

              upi: {
                name: "Pay using UPI",
                instruments: [{ method: "upi", },],
              },
            },

            sequence: paymentMethod === "upi" ? ["upi"] : paymentMethod === "card" ? ["cards"] : paymentMethod === "netbanking" ? ["banks"] : ["upi"],
            preferences: { show_default_blocks: false, },
          },
        },

        handler: async (response) => {
          try {
            await dispatch(
              verifyPayment({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              })
            ).unwrap();

            alert("Payment Successful");
          } catch (err) {
            console.error(err);

            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      console.log("ERROR OBJECT:", err);

      console.log("MESSAGE:", err.message);

      console.log("CODE:", err.code);

      console.log("RESPONSE:", err.response);

      console.log("REQUEST:", err.request);

      console.log("TO JSON:", err.toJSON?.());

      alert(
        err?.message ||
        err?.response?.data?.message
      );
    }
  };

  const subtotal = useMemo(() => {
    return products.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    );
  }, [products]);

  return (
    <main className="min-h-screen bg-[#001a35] px-4 py-5 text-[#0b1324] md:px-8">
      <section className="mb-5 flex flex-col gap-5 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-white/75">
            Review your order and complete your purchase
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <Card>
            <SectionTitle
              icon={MapPin}
              title="Delivery Address"
            />

            <div className="mt-4 grid grid-cols-1 gap-4">
              {defaultAddress && (
                <div className="mt-4">
                  <button className="w-full rounded-sm border border-[#f3a51c] bg-[#fff8ea] p-4 text-left">
                    <div className="flex gap-3">
                      <Radio active />

                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold capitalize">
                            {defaultAddress.type}
                          </h4>

                          <span className="rounded-sm bg-[#fff2d2] px-2 py-1 text-[11px] font-semibold text-[#d48800]">
                            Default
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#536072]">
                          {defaultAddress.address_line1}
                          {defaultAddress.address_line2 &&
                            `, ${defaultAddress.address_line2}`}
                          , {defaultAddress.city}
                        </p>

                        <p className="text-sm leading-6 text-[#536072]">
                          {defaultAddress.state},{" "}
                          {defaultAddress.country} -{" "}
                          {defaultAddress.postal_code}
                        </p>

                        <p className="mt-2 text-sm">
                          {defaultAddress.phone}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle
              icon={FileText}
              title="Invoice Preview"
            />

            <div className="mt-5 overflow-hidden rounded-sm border border-[#d8dee8]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-[#f8fafc] text-left">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">
                        Description
                      </th>
                      <th className="px-4 py-3 text-center">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((item) => {
                      const total =
                        item.qty * item.unitPrice;

                      return (
                        <tr
                          key={item.id}
                          className="border-t border-[#d8dee8]"
                        >
                          <td className="px-4 py-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-16 rounded-sm bg-[#f3f5f8] object-contain"
                            />
                          </td>

                          <td className="px-4 py-3">
                            <h4 className="font-bold">
                              {item.name}
                            </h4>

                            <p className="mt-1 text-[#536072]">
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
                            ₹{total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto w-full max-w-sm space-y-2 px-5 py-4 text-sm">
                <SummaryRow
                  label="Subtotal"
                  value={`₹${subtotal.toFixed(2)}`}
                />

                <SummaryRow
                  label="Shipping"
                  value="FREE"
                  gold
                />

                <SummaryRow
                  label="Tax (0%)"
                  value="₹0.00"
                />

                <div className="flex justify-between border-t border-[#d8dee8] pt-3 text-lg font-bold">
                  <span>Grand Total</span>

                  <span className="text-[#d48800]">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-sm border border-[#f3c77b] bg-[#fff8ea] px-4 py-3 text-sm text-[#536072]">
              <ShieldCheck
                size={18}
                className="text-[#d48800]"
              />

              This is a proforma invoice. Final invoice
              will be available after order confirmation.
            </div>
          </Card>
        </div>

        <aside className="h-fit rounded-sm border border-[#E5E5E5] bg-white p-5 shadow-sm xl:sticky xl:top-5">
          <SectionTitle
            icon={Package}
            title="Order Summary"
          />

          <div className="my-4 h-px bg-[#E5E5E5]" />

          <div className="space-y-4">
            {products.map((item) => {
              const itemTotal =
                item.qty * item.unitPrice;

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

            <SummaryRow
              label="Shipping"
              value="FREE"
              gold
            />

            <SummaryRow
              label="Tax (0%)"
              value="₹0.00"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-4">
            <span className="text-lg font-bold text-[#1A1A1A]">
              Total
            </span>

            <span className="text-4xl font-bold text-[#D4AF37]">
              ₹{subtotal.toFixed(2)}
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
                onClick={() =>
                  setPaymentMethod(method.id)
                }
                className={`flex w-full items-center justify-between rounded-sm border px-3 py-2.5 text-left transition ${paymentMethod === method.id
                  ? "border-[#D4AF37] bg-[#FFF8EC]"
                  : "border-[#E5E5E5] bg-white hover:border-[#D4AF37]"
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <Radio
                    active={
                      paymentMethod === method.id
                    }
                  />

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

            {paymentMethod === "cod"
              ? "Place Order"
              : "Pay Securely"}
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
    <section className="rounded-sm border border-[#d8dee8] bg-white p-5 shadow-xl">
      {children}
    </section>
  );
};

const SectionTitle = ({
  icon: Icon,
  title,
  subtitle,
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#f3a51c] bg-[#fff8ea]">
        <Icon
          size={23}
          className="text-[#d48800]"
        />
      </span>

      <div>
        <h3 className="text-xl font-bold text-[#0b1324]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-[#536072]">
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
      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active
        ? "border-[#f3a51c]"
        : "border-[#9aa4b2]"
        }`}
    >
      {active && (
        <span className="h-2 w-2 rounded-full bg-[#f3a51c]" />
      )}
    </span>
  );
};

const SummaryRow = ({ label, value, gold }) => {
  return (
    <div className="flex justify-between">
      <span className="text-[#536072]">{label}</span>

      <span
        className={
          gold
            ? "font-bold text-[#d48800]"
            : "text-[#0b1324]"
        }
      >
        {value}
      </span>
    </div>
  );
};

export default Page;