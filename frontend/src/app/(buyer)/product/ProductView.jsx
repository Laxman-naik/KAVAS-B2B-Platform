"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { arrivalProducts } from "@/data/arrivalProducts";
import { suppliers } from "@/data/suppliers";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "@/store/slices/favouritesSlice";

export default function ProductView() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);
  const id = params?.Id ?? params?.id;

  const allProducts = [...products, ...arrivalProducts];
  const product = allProducts.find((p) => String(p.id) === String(id));

  const [qty, setQty] = useState(50);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
}, []);

  // USE DATA FILE MEDIA (IMPORTANT FIX)
  const mediaItems =
    product?.media && product.media.length > 0
      ? product.media
      : [{ type: "image", src: product?.image }];

  const [activeImage, setActiveImage] = useState(null);
  const selectedMedia = activeImage || mediaItems[0];

  const tiers = [
    { min: 50, max: 99, price: 580 },
    { min: 100, max: 249, price: 539 },
    { min: 250, max: 499, price: 505 },
    { min: 500, max: Infinity, price: 464 },
  ];

  const activeTier = tiers.find((t) => qty >= t.min && qty <= t.max);

  if (!product) {
    return <div className="p-10 text-center">Product Not Found</div>;
  }

  if (!mounted) return null;

  const isWishlisted = mounted
  ? favouriteItems.some(
      (item) => String(item._id) === String(product.id),
    )
  : false;

  const normalizeName = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\b(pvt|pvt\s+ltd|ltd|limited|co|company|india)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normalizedCompany = normalizeName(product.company);

  const supplier = suppliers.find((s) => {
    const normalizedSupplier = normalizeName(s.name);
    if (!normalizedSupplier || !normalizedCompany) return false;
    return (
      normalizedSupplier === normalizedCompany ||
      normalizedSupplier.includes(normalizedCompany) ||
      normalizedCompany.includes(normalizedSupplier)
    );
  });

  const supplierInitials = (name) =>
    String(name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:px-24">
      <div className="grid lg:grid-cols-2 gap-7 items-start">
        {/* IMAGE SECTION */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300 relative">
          <button
            type="button"
            onClick={() => dispatch(toggleFavourite(product))}
            className="absolute top-3 right-3 text-xl bg-white rounded-full p-2 shadow hover:scale-110 transition"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>

          {/* Main Display */}
          <div className="overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center h-72 sm:h-96 lg:h-105">
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.src}
                className="w-full h-full object-contain transition duration-300 "
              />
            ) : (
              <video
                src={selectedMedia.src}
                controls
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-3 grid grid-cols-5 gap-3">
            {mediaItems.map((item, idx) => {
              const isActive =
                selectedMedia.src === item.src &&
                selectedMedia.type === item.type;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(item)}
                  className={`rounded-lg border p-1 overflow-hidden transition ${
                    isActive ? "border-orange-500" : "border-gray-200"
                  }`}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      className="w-full h-16 object-contain"
                    />
                  ) : (
                    <div className="relative w-full h-16 bg-black flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE (UNCHANGED) */}
        <div className="pt-2 sm:pt-5">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {product.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ⭐⭐⭐⭐⭐ <span>4.8</span>{" "}
            <span className="text-blue-500">(124 reviews)</span> •{" "}
            {product.company}
          </p>

          <div className="mt-2 bg-yellow-50 border border-yellow-300 rounded-xl p-5 h-auto">
            <p className="text-xs sm:text-sm font-medium mb-2">
              💰 Bulk pricing tiers — save more when you order more:
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-5 cursor-pointer">
              {tiers.map((tier, i) => {
                const isActive = qty >= tier.min && qty <= tier.max;

                return (
                  <div
                    key={i}
                    onClick={() => setQty(tier.min)}
                    className={`rounded-lg px-3 py-2 w-23.75 sm:w-27.5 text-center transition hover:scale-105 ${
                      isActive
                        ? "border-2 border-orange-500 bg-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {tier.max === Infinity
                        ? `${tier.min}+`
                        : `${tier.min}–${tier.max}`}{" "}
                      units
                    </p>

                    <p className="text-orange-600 font-bold text-sm sm:text-lg">
                      ₹{tier.price}
                    </p>

                    {!isActive && (
                      <p className="text-green-600 text-[10px] sm:text-xs">
                        Save {Math.round(((580 - tier.price) / 580) * 100)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-sm text-black-700">Quantity:</span>

            <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="px-3 sm:px-4 py-1 bg-gray-100 hover:bg-gray-200 transition"
              >
                -
              </button>

              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-14 sm:w-16 text-center outline-none"
              />

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 sm:px-4 py-1 bg-gray-100 hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>

            <span className="text-xs sm:text-sm text-gray-500">
              Min. {product.min}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {/* Top Row Buttons */}
            <div className="flex gap-2">

              <button className="w-1/2 cursor-pointer text-whit  bg-orange-500 hover:bg-orange-600 py-1.5 rounded-lg font-medium text-gray-700  hover:scale-[1.02] active:scale-[0.98] transition">
                Buy
              </button>
              <button className="w-1/2 cursor-pointer bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] text-white py-1.5 rounded-lg font-semibold text-sm sm:text-lg transition duration-200 shadow">
                🛒 Add to Cart
              </button>
            </div>

            {/* Full Width Button */}
            <button className="w-full border cursor-pointer border-gray-400 py-1.5 rounded-lg font-medium hover:bg-gray-300 transition">
              📄 Send Enquiry
            </button>
          </div>

          <div className="mt-4 rounded-xl shadow-sm p-3">
            <h3 className="font-semibold text-sm sm:text-md mb-1">
              Product Specifications
            </h3>

            <div className="text-xs sm:text-sm ">
              {[
                ["Brand", product.brand],
                ["Type", "TWS Earbuds"],
                ["Battery", "6+24hr"],
                ["Bluetooth", "5.3"],
                ["Water", "IPX5"],
                ["MOQ", product.min],
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-1 px-1">
                  <span className="text-gray-500">{item[0]}</span>
                  <span>{item[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">
                {supplierInitials(supplier?.name || product.company)}
              </div>
              <div>
                <p className="font-medium">{product.company}</p>
                <p className="text-xs text-gray-500">
                  {supplier
                    ? `📍 ${supplier.location} • ${supplier.category}`
                    : ""}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                supplier && router.push(`/suppliers/${supplier.id}`)
              }
              disabled={!supplier}
              className={`border px-4 py-2 rounded-lg border-orange-400 transition cursor-pointer ${
                supplier
                  ? "text-orange-500 hover:bg-orange-50 hover:scale-105"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              View Profile →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold border-l-4 border-orange-500 pl-2">
            Similar Products
          </h2>
          <Link
            href="/trendingviewall"
            className="text-orange-500 text-sm cursor-pointer hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {" "}
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl transition group overflow-hidden"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold">{item.title}</h3>

                <p className="text-orange-600 font-semibold">{item.price}</p>

                <p className="text-xs text-gray-500">{item.min}</p>

                <div className="flex items-center text-xs gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{item.brand}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Link
        href="/trendingviewall"
        className="text-orange-500 flex justify-center text-xl cursor-pointer hover:underline"
      >
        View all →
      </Link>
    </div>
  );
}
