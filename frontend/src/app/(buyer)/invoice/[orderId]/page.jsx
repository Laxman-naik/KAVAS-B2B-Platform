"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { productapi } from "@/lib/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Building2,
  User,
  Calendar,
  Hash,
  Printer,
} from "lucide-react";

const InvoicePage = () => {
  const { orderId } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const res = await productapi.get(
        `/api/orders/${orderId}/invoice`
      );

      setInvoice(res.data.invoice);
    } catch (err) {
      console.error("Load Invoice Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-semibold">
          Loading Invoice...
        </h2>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-semibold text-red-500">
          Invoice Not Found
        </h2>
      </div>
    );
  }

  const order = invoice.order;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">

        <Card className="shadow-lg">
          <CardContent className="p-8">

            <div className="flex items-start justify-between border-b pb-6">

              <div>

                <h1 className="text-4xl font-bold text-[#0B1F3A]">
                  KAVAS Wholesale Hub
                </h1>

                <p className="mt-2 text-slate-500">
                  Wholesale Purchase Invoice
                </p>

              </div>

              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">

              <div>

                <p className="text-sm text-gray-500">
                  Invoice No
                </p>

                <h2 className="mt-2 font-bold">
                  INV-{order.id.slice(0, 8).toUpperCase()}
                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Order No
                </p>

                <h2 className="mt-2 font-bold">
                  #{order.id.slice(0, 8).toUpperCase()}
                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Invoice Date
                </p>

                <h2 className="mt-2 font-bold">
                  {new Date(order.created_at).toLocaleDateString()}
                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Order Status
                </p>

                <h2 className="mt-2 font-bold capitalize">
                  {order.status}
                </h2>

              </div>

            </div>
                        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

              <Card className="border shadow-none">

                <CardContent className="p-6">

                  <div className="flex items-center gap-3">

                    <User className="h-5 w-5 text-[#0B1F3A]" />

                    <h2 className="text-lg font-bold text-[#0B1F3A]">
                      Buyer Details
                    </h2>

                  </div>

                  <div className="mt-5 space-y-2">

                    <p className="font-semibold">
                      {order.buyer_name || "-"}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.buyer_email || "-"}
                    </p>

                    <p className="text-sm">
                      {order.address_line1 || "-"}
                    </p>

                    {order.address_line2 && (
                      <p className="text-sm">
                        {order.address_line2}
                      </p>
                    )}

                    <p className="text-sm">
                      {order.city || "-"}, {order.state || "-"}
                    </p>

                    <p className="text-sm">
                      {order.country || "-"} - {order.postal_code || "-"}
                    </p>

                    <p className="text-sm">
                      {order.phone || "-"}
                    </p>

                  </div>

                </CardContent>

              </Card>

              <Card className="border shadow-none">

                <CardContent className="p-6">

                  <div className="flex items-center gap-3">

                    <Building2 className="h-5 w-5 text-[#0B1F3A]" />

                    <h2 className="text-lg font-bold text-[#0B1F3A]">
                      Vendor Details
                    </h2>

                  </div>

                  <div className="mt-5 space-y-2">

                    <p className="font-semibold">
                      {order.vendor_name || "-"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Supplier Organization
                    </p>

                    <p className="text-sm text-gray-500">
                      Thank you for choosing KAVAS Wholesale Hub.
                    </p>

                  </div>

                </CardContent>

              </Card>

            </div>

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Order Summary
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <Card className="shadow-none">

                  <CardContent className="p-5">

                    <div className="flex items-center gap-2">

                      <Hash className="h-5 w-5 text-[#0B1F3A]" />

                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                    </div>

                    <p className="mt-3 break-all text-sm font-semibold">
                      {order.id}
                    </p>

                  </CardContent>

                </Card>

                <Card className="shadow-none">

                  <CardContent className="p-5">

                    <div className="flex items-center gap-2">

                      <Calendar className="h-5 w-5 text-[#0B1F3A]" />

                      <p className="text-sm text-gray-500">
                        Order Date
                      </p>

                    </div>

                    <p className="mt-3 text-sm font-semibold">
                      {new Date(order.created_at).toLocaleString()}
                    </p>

                  </CardContent>

                </Card>

                <Card className="shadow-none">

                  <CardContent className="p-5">

                    <div className="flex items-center gap-2">

                      <Building2 className="h-5 w-5 text-[#0B1F3A]" />

                      <p className="text-sm text-gray-500">
                        Courier
                      </p>

                    </div>

                    <p className="mt-3 text-sm font-semibold">
                      {order.courier || "-"}
                    </p>

                  </CardContent>

                </Card>

                <Card className="shadow-none">

                  <CardContent className="p-5">

                    <div className="flex items-center gap-2">

                      <Hash className="h-5 w-5 text-[#0B1F3A]" />

                      <p className="text-sm text-gray-500">
                        Tracking Number
                      </p>

                    </div>

                    <p className="mt-3 break-all text-sm font-semibold">
                      {order.awb || "-"}
                    </p>

                  </CardContent>

                </Card>

              </div>

            </div>
                        <div className="mt-10">

              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Products
              </h2>

              <div className="mt-5 overflow-x-auto rounded-lg border">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Product
                      </th>

                      <th className="px-5 py-4 text-center text-sm font-semibold">
                        Qty
                      </th>

                      <th className="px-5 py-4 text-right text-sm font-semibold">
                        Unit Price
                      </th>

                      <th className="px-5 py-4 text-right text-sm font-semibold">
                        Amount
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {invoice.items.map((item, index) => (

                      <tr
                        key={item.id || index}
                        className="border-t"
                      >

                        <td className="px-5 py-4">

                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            SKU : {item.sku || "-"}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-center">
                          {item.quantity}
                        </td>

                        <td className="px-5 py-4 text-right">
                          ₹
                          {Number(item.price).toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4 text-right font-bold">
                          ₹
                          {Number(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            <div className="mt-10 flex justify-end">

              <Card className="w-full max-w-md">

                <CardContent className="p-0">

                  <div className="flex items-center justify-between border-b p-5">

                    <span className="text-gray-600">
                      Sub Total
                    </span>

                    <span className="font-semibold">
                      ₹
                      {Number(order.total_amount).toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-b p-5">

                    <span className="text-gray-600">
                      GST
                    </span>

                    <span className="font-semibold">
                      ₹0
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-b p-5">

                    <span className="text-gray-600">
                      Shipping
                    </span>

                    <span className="font-semibold">
                      ₹0
                    </span>

                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-5">

                    <span className="text-xl font-bold text-[#0B1F3A]">
                      Grand Total
                    </span>

                    <span className="text-xl font-bold text-[#0B1F3A]">
                      ₹
                      {Number(order.total_amount).toLocaleString("en-IN")}
                    </span>

                  </div>

                </CardContent>

              </Card>

            </div>

            <div className="mt-12">

              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Shipment Details
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                <Card>

                  <CardContent className="p-5">

                    <p className="text-sm text-gray-500">
                      Courier Partner
                    </p>

                    <p className="mt-2 font-semibold">
                      {order.courier || "-"}
                    </p>

                  </CardContent>

                </Card>

                <Card>

                  <CardContent className="p-5">

                    <p className="text-sm text-gray-500">
                      Tracking Number
                    </p>

                    <p className="mt-2 font-semibold break-all">
                      {order.awb || "-"}
                    </p>

                  </CardContent>

                </Card>

                <Card>

                  <CardContent className="p-5">

                    <p className="text-sm text-gray-500">
                      Shipping Date
                    </p>

                    <p className="mt-2 font-semibold">
                      {order.shipping_date
                        ? new Date(
                            order.shipping_date
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                  </CardContent>

                </Card>

                <Card>

                  <CardContent className="p-5">

                    <p className="text-sm text-gray-500">
                      Estimated Delivery
                    </p>

                    <p className="mt-2 font-semibold">
                      {order.estimated_delivery
                        ? new Date(
                            order.estimated_delivery
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                  </CardContent>

                </Card>

              </div>

            </div>
                        <div className="mt-12 border-t pt-10">

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                <div>

                  <h2 className="text-xl font-bold text-[#0B1F3A]">
                    Payment Information
                  </h2>

                  <div className="mt-5 space-y-3">

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Payment Status
                      </span>

                      <span className="font-semibold capitalize">
                        {order.status}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Payment Method
                      </span>

                      <span className="font-semibold">
                        {order.payment_method || "Online Payment"}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Paid On
                      </span>

                      <span className="font-semibold">
                        {order.paid_at
                          ? new Date(order.paid_at).toLocaleDateString()
                          : "-"}
                      </span>

                    </div>

                  </div>

                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#0B1F3A]">
                    Shipping Address
                  </h2>

                  <div className="mt-5 space-y-2">

                    <p className="font-semibold">
                      {order.buyer_name}
                    </p>

                    <p>
                      {order.address_line1}
                    </p>

                    {order.address_line2 && (
                      <p>
                        {order.address_line2}
                      </p>
                    )}

                    <p>
                      {order.city}, {order.state}
                    </p>

                    <p>
                      {order.country} - {order.postal_code}
                    </p>

                    <p>
                      {order.phone}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-12 rounded-lg bg-slate-50 p-8">

              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

                <div>

                  <h2 className="text-2xl font-bold text-[#0B1F3A]">
                    Thank You For Choosing KAVAS
                  </h2>

                  <p className="mt-2 text-gray-600">
                    This invoice is generated automatically by
                    KAVAS Wholesale Hub.
                  </p>

                  <p className="mt-1 text-gray-600">
                    No signature is required.
                  </p>

                </div>

                <div className="text-center">

                  <div className="mb-4 h-16 border-b border-dashed border-gray-400"></div>

                  <p className="font-semibold">
                    Authorized Signature
                  </p>

                  <p className="text-sm text-gray-500">
                    KAVAS Wholesale Hub
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 flex flex-wrap justify-end gap-4">

              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>

              <Button
                className="bg-[#0B1F3A] hover:bg-[#16345D]"
                onClick={() => alert("PDF download will be added in Part 4")}
              >
                Download PDF
              </Button>

            </div>
                        <div className="mt-12 border-t pt-8">

              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

                <div>

                  <h2 className="text-xl font-bold text-[#0B1F3A]">
                    Terms & Conditions
                  </h2>

                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">

                    <li>
                      Goods once sold cannot be returned without vendor approval.
                    </li>

                    <li>
                      Payment should be completed according to agreed payment terms.
                    </li>

                    <li>
                      Please keep this invoice for future reference.
                    </li>

                    <li>
                      For any support, contact KAVAS Wholesale Hub.
                    </li>

                  </ul>

                </div>

                <div className="text-center">

                  <div className="mb-3 h-16 border-b border-dashed border-gray-400"></div>

                  <p className="font-semibold">
                    Authorized Signature
                  </p>

                  <p className="text-sm text-gray-500">
                    KAVAS Wholesale Hub
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 flex flex-wrap justify-end gap-4">

              <Button
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>

              <Button
                className="bg-[#0B1F3A] hover:bg-[#16345D]"
                onClick={downloadInvoice}
              >
                Download PDF
              </Button>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );
};

const downloadInvoice = async () => {
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.body;

  html2pdf()
    .set({
      margin: 0.5,
      filename: `Invoice_${new Date().getTime()}.pdf`,
      image: {
        type: "jpeg",
        quality: 1,
      },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    })
    .from(element)
    .save();
};

export default InvoicePage;