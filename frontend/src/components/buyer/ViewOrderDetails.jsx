"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

const ViewOrderDetails = ({ open, onClose, order }) => {
  const { profile } = useSelector((state) => state.profile);
  const { addresses } = useSelector((state) => state.address);

  if (!order) return null;

  const items = order.items || order.order_items || [];
  const defaultAddress = Array.isArray(addresses) ? addresses[0] : null;

  const profileAddress = defaultAddress
    ? [
        defaultAddress.address_line1,
        defaultAddress.address_line2,
        defaultAddress.city,
        defaultAddress.state,
        defaultAddress.postal_code,
        defaultAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "-";

  const buyerName =
    order.buyer_name ||
    order.name ||
    profile?.full_name ||
    profile?.fullName ||
    profile?.name ||
    "-";

  const buyerEmail = order.buyer_email || order.email || profile?.email || "-";

  const buyerPhone = order.buyer_phone || order.phone || profile?.phone || "-";

  const shippingAddress =
    order.shipping_address ||
    order.delivery_address ||
    order.address ||
    profileAddress;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid" || value === "delivered") {
      return "bg-green-100 text-green-700 hover:bg-green-100";
    }

    if (value === "shipped") {
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700 hover:bg-red-100";
    }

    return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
  };

  const totalAmount = Number(order.total_amount || order.total || 0);
  const subtotal = Number(order.subtotal || totalAmount);
  const shippingCharge = Number(order.shipping_charge || order.delivery_charge || 0);
  const discount = Number(order.discount || 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="w-[95vw] sm:max-w-4xl rounded-sm p-0 overflow-hidden border border-[#E5E5E5] bg-white shadow-2xl">
<DialogHeader className="relative overflow-hidden border-b border-white/10 bg-[#0B1F3A] px-6 py-5">

  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04),transparent)]" />

  <div className="relative flex items-center justify-between">

    <div>
      <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">

        <div className="h-10 w-10 rounded-sm border border-white/20 bg-white/10 flex items-center justify-center">
          <Package className="text-white" size={20} />
        </div>

        <span className="text-white">
          Order Details
        </span>

      </DialogTitle>

      <p className="mt-2 text-sm text-white/70">
        Complete information about this order
      </p>
    </div>

  </div>

</DialogHeader>

 

        <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden p-4 space-y-4">
          <section className="rounded-sm border border-[#E5E5E5] bg-white p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-sm border bg-gray-50 flex items-center justify-center">
                  <Package size={22} className="text-[#0B1F3A]" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[#0B1F3A]">
                      #{String(order.id || "").slice(0, 8).toUpperCase()}
                    </h3>
                    <Badge className={getStatusClass(order.status)}>
                      {order.status || "pending"}
                    </Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <CalendarDays size={13} />
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-sm border bg-gray-50 px-3 py-2.5">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#0B1F3A]">
                    <CreditCard size={14} />
                    {order.payment_method || "Online Payment"}
                  </p>
                </div>

                <div className="rounded-sm border bg-gray-50 px-3 py-2.5">
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <p className="mt-1 text-sm font-semibold text-green-600">
                    {order.payment_status || "Paid"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-sm border p-4">
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-[#0B1F3A]">
                <User size={16} />
                Buyer Details
              </h4>

              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <User size={15} className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-[#0B1F3A]">{buyerName}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail size={15} className="mt-1 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-[#0B1F3A] break-all">
                      {buyerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone size={15} className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-[#0B1F3A]">{buyerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-sm border p-4">
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-[#0B1F3A]">
                <MapPin size={16} />
                Shipping Address
              </h4>

              <p className="text-sm leading-6 text-gray-600 wrap-break-word">
                {shippingAddress}
              </p>
            </div>

            <div className="rounded-sm border p-4">
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-[#0B1F3A]">
                <ReceiptText size={16} />
                Order Summary
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-[#0B1F3A]">
                    ₹{formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Charge</span>
                  <span className="font-semibold text-[#0B1F3A]">
                    ₹{formatPrice(shippingCharge)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-green-600">
                    -₹{formatPrice(discount)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-[#0B1F3A]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#0B1F3A]">
                    ₹{formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="h-9 rounded-sm border-[#E5E5E5] px-5"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDetails;