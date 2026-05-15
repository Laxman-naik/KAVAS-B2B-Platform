"use client";

import { useState } from "react";
import {
  CircleCheck,
  ChevronRight,
  HandCoins,
  RefreshCcw,
  Truck,
} from "lucide-react";
import MoreInfoSection from "@/components/buyer/MoreInfoSection";

const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const Row = ({ Icon, title, right }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center">
          <Icon
            className="h-8 w-8"
            style={{ color: COLORS.text, opacity: 0.7 }}
          />
        </div>

        <div className="text-base font-semibold" style={{ color: COLORS.text }}>
          {title}
        </div>
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
};

export default function ShippingDeliverySection({ product }) {
  const [openMoreInfo, setOpenMoreInfo] = useState(false);

  const pincode = product?.pincode || product?.delivery_pincode || "500072";
  const userName = product?.delivery_name || product?.customer_name || "Sai krishna";

  const dispatchDays =
    Number(product?.dispatch_time_days || product?.dispatchTimeDays || 0) || 3;

  const returnDays =
    Number(product?.return_days || product?.returnDays || 7) || 7;

  const payOnDelivery =
    product?.pay_on_delivery ?? product?.cod_available ?? true;

  const originalProduct =
    product?.is_original ?? product?.original_product ?? true;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + dispatchDays);

  const deliveryText = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <section
        className="rounded-sm border"
        style={{ background: COLORS.white, borderColor: COLORS.border }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>
              DELIVERY OPTIONS
            </h2>

            <Truck
              className="h-6 w-6"
              style={{ color: COLORS.text, opacity: 0.7 }}
            />
          </div>

          <div
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border px-5 py-4"
            style={{ borderColor: COLORS.border, background: COLORS.white }}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg font-extrabold" style={{ color: COLORS.text }}>
                Delivery location
              </div>
              <CircleCheck className="h-6 w-6" style={{ color: "#10B981" }} />
            </div>

            <button type="button" className="text-sm font-extrabold" style={{ color: "#0B1F3A" }}>
              CHANGE
            </button>
          </div>

          <div className="mt-4 divide-y" style={{ borderColor: COLORS.border }}>
            <Row
              Icon={Truck}
              title={`Dispatch in ${product?.dispatch_time_days || 3} days`}
            />        
            <Row Icon={HandCoins} title="Pay on delivery available" />
            <Row
              Icon={RefreshCcw}
              title="Easy 7 days return & exchange available"
              right={
                <button
                  type="button"
                  onClick={() => setOpenMoreInfo(true)}
                  className="inline-flex items-center gap-1 text-sm font-extrabold"
                  style={{ color: "#0B1F3A" }}
                >
                  MORE INFO
                  <ChevronRight className="h-5 w-5" />
                </button>
              }
            />
          </div>

          <div className="mt-6 text-lg" style={{ color: COLORS.text }}>
            100% Original Products
          </div>
        </div>
      </section>

      <div
        className={`fixed inset-0 z-50 ${
          openMoreInfo ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!openMoreInfo}
      >
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity ${
            openMoreInfo ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpenMoreInfo(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-[92%] max-w-md bg-white shadow-xl transition-transform duration-200 ${
            openMoreInfo ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ borderLeft: `1px solid ${COLORS.border}` }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex items-center justify-between border-b px-5 py-4"
            style={{ borderColor: COLORS.border }}
          >
            <div
              className="text-base font-extrabold"
              style={{ color: COLORS.primary }}
            >
              Return & Exchange
            </div>

            <button
              type="button"
              onClick={() => setOpenMoreInfo(false)}
              className="rounded-sm border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: COLORS.border, color: COLORS.primary }}
            >
              Close
            </button>
          </div>

          <div className="h-[calc(100%-57px)] overflow-y-auto">
            <MoreInfoSection onClose={() => setOpenMoreInfo(false)} />
          </div>
        </div>
      </div>
    </>
  );
}