"use client";

import { useState } from "react";
import { X, Package, BarChart3, Eye, Clock, Layers, Star, BadgeInfo, Box, Palette, Ruler, Shirt, Circle, } from "lucide-react";

const C = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const Eyeview = ({ product, open, onClose }) => {
  if (!open || !product) return null;

  const image = product.images?.find((img) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder.png";

  const statusClass =
    product.status === "approved"
      ? "bg-green-100 text-green-700"
      : product.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : product.status === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      <div className="relative w-full max-w-4xl max-h-[86vh] overflow-y-auto scrollbar-hide rounded-xl bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10"
          style={{ color: C.primary }}
        >
          <X size={22} />
        </button>

        <div className="p-6 text-[#1A1A1A]">
          <h2
            className="text-xl font-bold mb-5"
            style={{ color: C.primary }}
          >
            Product Details
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {/* Main Image */}
              <img
                src={image}
                alt={product.name || "product"}
                className="w-full h-[330px] object-cover rounded-lg border"
                style={{ borderColor: C.border }}
              />

              {/* All Images */}
              {product?.images?.length > 0 && (
                <div className="mt-4">
                  <h4
                    className="text-sm font-bold mb-2"
                    style={{ color: C.primary }}
                  >
                    Product Images
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {product.images.map((img) => (
                      <div
                        key={img.id}
                        className="border rounded-lg overflow-hidden"
                        style={{ borderColor: C.border }}
                      >
                        <img
                          src={img.image_url}
                          alt="product"
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {product?.videos?.length > 0 && (
                <div className="mt-5">
                  <h4
                    className="text-sm font-bold mb-2"
                    style={{ color: C.primary }}
                  >
                    Product Videos
                  </h4>

                  <div className="space-y-3">
                    {product.videos.map((video) => (
                      <video
                        key={video.id}
                        controls
                        className="w-full rounded-lg border"
                        style={{ borderColor: C.border }}
                      >
                        <source
                          src={video.video_url}
                          type="video/mp4"
                        />
                        Your browser does not support video.
                      </video>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: C.primary }}
              >
                {product.name || "Product Name"}
              </h3>
              <div className="flex items-center gap-3 mb-4 text-xs">
                <span className="text-gray-500">
                  SKU: {product.sku || "N/A"}
                </span>

                <span
                  className={`px-3 py-1 rounded-md ${statusClass}`}
                >
                  {product.status || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">

                <TopInfo
                  label="Price"
                  value={`₹${Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}`}
                  color={C.gold}
                />

                <TopInfo
                  label="MRP"
                  value={`₹${Number(
                    product.mrp || 0
                  ).toLocaleString("en-IN")}`}
                  color="#777"
                  line
                />

                <TopInfo
                  label="Stock"
                  value={product.stock || 0}
                  color="green"
                />

              </div>

              <div
                className="h-px mb-4"
                style={{ background: C.border }}
              />
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">

                <Detail
                  icon={<Package size={15} />}
                  label="MOQ"
                  value={product.moq || "-"}
                />

                <Detail
                  icon={<BarChart3 size={15} />}
                  label="Sales Count"
                  value={product.sales_count || 0}
                />

                <Detail
                  icon={<Box size={15} />}
                  label="Units"
                  value={`${product.weight || 0} kg`}
                />

                <Detail
                  icon={<Eye size={15} />}
                  label="Views Count"
                  value={product.views_count || 0}
                />

                <Detail
                  icon={<Clock size={15} />}
                  label="Dispatch Time"
                  value={`${product.dispatch_time_days || 0} days`}
                />

                <Detail
                  icon={<Star size={15} />}
                  label="Rating"
                  value={`⭐ ${product.avg_rating || 0}`}
                />

                <Detail
                  icon={<Layers size={15} />}
                  label="Category"
                  value={product.category || "N/A"}
                />

                <Detail
                  icon={<BadgeInfo size={15} />}
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusClass}`}
                    >
                      {product.status || "N/A"}
                    </span>
                  }
                />

              </div>
              <div className="mb-4">

                <h4
                  className="font-bold mb-1 text-sm"
                  style={{ color: C.primary }}
                >
                  Description
                </h4>

                <p className="text-sm leading-relaxed text-gray-700">
                  {product.description ||
                    "No description available"}
                </p>

              </div>
              <h4
                className="font-bold mb-2 text-sm"
                style={{ color: C.primary }}
              >
                Product Information
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 border rounded-lg overflow-hidden">

                <Info
                  icon={<Package size={14} />}
                  label="Material"
                  value={product.material || "N/A"}
                />

                <Info
                  icon={<Palette size={14} />}
                  label="Color"
                  value={product.color || "N/A"}
                />

                <Info
                  icon={<Ruler size={14} />}
                  label="Size"
                  value={product.size || "N/A"}
                />

                <Info
                  icon={<Circle size={14} />}
                  label="Gender"
                  value={product.gender || "N/A"}
                />

                <Info
                  icon={<Shirt size={14} />}
                  label="Sleeve"
                  value={product.sleeve || "N/A"}
                />

                <Info
                  icon={<BadgeInfo size={14} />}
                  label="Neck"
                  value={product.neck || "N/A"}
                />

              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end mt-5">

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: C.cream,
                color: C.primary,
                border: `1px solid ${C.border}`,
              }}
            >
              Close
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

const TopInfo = ({
  label,
  value,
  color,
  line,
}) => (
  <div>
    <p className="text-xs font-semibold text-gray-600 mb-1">
      {label}
    </p>

    <p
      className={`text-xl font-bold ${line ? "line-through" : ""
        }`}
      style={{ color }}
    >
      {value}
    </p>
  </div>
);

const Detail = ({
  icon,
  label,
  value,
}) => (
  <div className="flex gap-2">

    <div
      className="w-7 h-7 flex items-center justify-center rounded-md"
      style={{
        background: C.cream,
        color: C.primary,
      }}
    >
      {icon}
    </div>

    <div>
      <p
        className="font-semibold text-sm"
        style={{ color: C.text }}
      >
        {label}
      </p>

      <div className="text-xs text-gray-700">
        {value}
      </div>
    </div>

  </div>
);

const Info = ({
  icon,
  label,
  value,
}) => (
  <div
    className="flex gap-2 p-3 border"
    style={{ borderColor: C.border }}
  >

    <div style={{ color: C.primary }}>
      {icon}
    </div>

    <div>
      <p
        className="font-semibold text-xs"
        style={{ color: C.text }}
      >
        {label}
      </p>

      <p className="text-xs text-gray-700">
        {value}
      </p>
    </div>

  </div>
);

export default Eyeview;