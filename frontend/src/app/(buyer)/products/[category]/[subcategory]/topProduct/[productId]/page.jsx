// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// const slugLabel = (value = "") =>
//   value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// const COLORS = {
//   primary: "#0B1F3A",
//   accent: "#D4AF37",
//   cream: "#FFF8EC",
//   white: "#FFFFFF",
//   text: "#1A1A1A",
//   border: "#E5E5E5",
// };

// export default function ProductDetailPage({ params }) {
//   const [route, setRoute] = useState({
//     category: "",
//     subcategory: "",
//     product: "",
//     id: "",
//   });

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);

//       try {
//         const resolved = await params;
//         const { category, subcategory, product, id } = resolved;

//         setRoute({ category, subcategory, product, id });

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/products/listing/${id}`,
//           { cache: "no-store" }
//         );

//         const data = await res.json();

//         setProduct({
//           ...data,
//           imageUrl: data.image_url || data.imageUrl || "/placeholder.png",
//           minOrderQty: data.moq ?? data.minOrderQty ?? 0,
//           supplierType: data.supplierType || data.supplier_type || "",
//           organizationName: data.organizationName || data.organization_name || "",
//           dispatchTimeDays: data.dispatchTimeDays || data.dispatch_time_days,
//           pricingTiers: data.pricingTiers || data.pricing_tiers || [],
//           specifications: data.specifications || [],
//         });
//       } catch (error) {
//         setProduct(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [params]);

//   if (loading) {
//     return (
//       <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
//         <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
//         <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
//           <h2 className="text-xl font-semibold">Product not found</h2>
//           <Link
//             href={`/products/${route.category}/${route.subcategory}/${route.product}`}
//             className="inline-block mt-3 hover:underline"
//             style={{ color: COLORS.accent }}
//           >
//             Back
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: COLORS.cream, color: COLORS.text }}>
//       <div
//         className="px-4 sm:px-6 py-3 bg-white border-b text-sm flex flex-wrap gap-2"
//         style={{ borderColor: COLORS.border }}
//       >
//         <Link href={`/products/${route.category}`}>{slugLabel(route.category)}</Link>
//         <span>/</span>
//         <Link href={`/products/${route.category}/${route.subcategory}`}>
//           {slugLabel(route.subcategory)}
//         </Link>
//         <span>/</span>
//         <Link href={`/products/${route.category}/${route.subcategory}/${route.product}`}>
//           {slugLabel(route.product)}
//         </Link>
//         <span>/</span>
//         <span>{product.name}</span>
//       </div>

//       <div className="px-4 sm:px-6 py-5">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           <div className="lg:col-span-2 bg-white border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
//             <img
//               src={product.imageUrl}
//               alt={product.name}
//               className="w-full h-64 sm:h-80 md:h-[420px] object-cover rounded"
//             />

//             <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
//             <p className="text-2xl mt-2 font-semibold" style={{ color: COLORS.accent }}>
//               ₹{product.price}/unit
//             </p>
//             <p className="mt-1 text-sm" style={{ color: "#666" }}>
//               Min Qty: {product.minOrderQty}
//             </p>
//             <p className="mt-1 text-sm" style={{ color: "#666" }}>
//               {product.supplierType || product.organizationName}
//             </p>

//             {product.description && (
//               <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
//                 <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
//                   Description
//                 </h2>
//                 <p className="text-sm leading-6" style={{ color: "#555" }}>
//                   {product.description}
//                 </p>
//               </div>
//             )}

//             <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
//               <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
//                 Product Details
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                 {[
//                   ["Category", slugLabel(route.category)],
//                   ["Subcategory", slugLabel(route.subcategory)],
//                   ["Supplier Type", product.supplierType || "Supplier"],
//                   ["Minimum Order", `${product.minOrderQty} units`],
//                   ["Price", `₹${product.price}/unit`],
//                   ["Stock", product.stock ?? "Available"],
//                   [
//                     "Dispatch Time",
//                     product.dispatchTimeDays ? `${product.dispatchTimeDays} days` : "N/A",
//                   ],
//                   ["Unit", product.unit || "Piece"],
//                 ].map(([label, value]) => (
//                   <div
//                     key={label}
//                     className="border rounded p-3"
//                     style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
//                   >
//                     <p style={{ color: "#666" }}>{label}</p>
//                     <p className="font-medium">{value}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {Array.isArray(product.specifications) && product.specifications.length > 0 && (
//               <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
//                 <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
//                   Specifications
//                 </h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                   {product.specifications.map((spec) => (
//                     <div
//                       key={spec.id || `${spec.key}-${spec.value}`}
//                       className="border rounded p-3"
//                       style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
//                     >
//                       <p style={{ color: "#666" }}>{spec.key}</p>
//                       <p className="font-medium">{spec.value}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="bg-white border rounded-lg p-4 h-fit" style={{ borderColor: COLORS.border }}>
//             <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
//               Send Inquiry
//             </h3>
//             <p className="text-sm mt-1" style={{ color: "#666" }}>
//               Contact supplier for bulk pricing and order details.
//             </p>

//             <div className="space-y-3 mt-4">
//               <button
//                 className="w-full py-3 rounded transition"
//                 style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
//               >
//                 Request Quote
//               </button>

//               <button
//                 className="w-full border py-3 rounded transition"
//                 style={{ borderColor: COLORS.border, color: COLORS.primary }}
//               >
//                 Contact Supplier
//               </button>
//             </div>

//             <div className="mt-6 border-t pt-4 text-sm space-y-3" style={{ borderColor: COLORS.border }}>
//               <div>
//                 <p style={{ color: "#666" }}>Supplier</p>
//                 <p className="font-medium">{product.organizationName || "Supplier"}</p>
//               </div>

//               <div>
//                 <p style={{ color: "#666" }}>Supplier Type</p>
//                 <p className="font-medium">{product.supplierType || "Verified Supplier"}</p>
//               </div>

//               <div>
//                 <p style={{ color: "#666" }}>MOQ</p>
//                 <p className="font-medium">{product.minOrderQty} units</p>
//               </div>

//               <div>
//                 <p style={{ color: "#666" }}>Price</p>
//                 <p className="font-medium">₹{product.price}/unit</p>
//               </div>

//               <div>
//                 <p style={{ color: "#666" }}>Dispatch</p>
//                 <p className="font-medium">
//                   {product.dispatchTimeDays ? `${product.dispatchTimeDays} days` : "N/A"}
//                 </p>
//               </div>
//             </div>

//             {Array.isArray(product.pricingTiers) && product.pricingTiers.length > 0 && (
//               <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
//                 <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
//                   Pricing Tiers
//                 </h4>

//                 <div className="space-y-2">
//                   {product.pricingTiers.map((tier) => (
//                     <div
//                       key={tier.id || `${tier.minQuantity}-${tier.price}`}
//                       className="border rounded p-3 text-sm"
//                       style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
//                     >
//                       <p style={{ color: "#666" }}>Min Qty: {tier.minQuantity}</p>
//                       <p className="font-medium">₹{tier.price}</p>
//                       {tier.label && <p className="text-xs mt-1" style={{ color: "#666" }}>{tier.label}</p>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
 
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  fetchFavourites,
} from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { productapi } from "@/lib/axios";
 
const slugLabel = (value = "") =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
 
const COLORS = {
  primary: "#0B1F3A",
  accent: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
  muted: "#6B7280",
};
 
export default function ProductDetailPage({ params }) {
  const [route, setRoute] = useState({
    category: "",
    subcategory: "",
    product: "",
    id: "",
  });
 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
 
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items || []);
 
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };
 
  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);
 
  useEffect(() => {
    const load = async () => {
      setLoading(true);
 
      try {
        const resolved = await params;
        const { category, subcategory, product, id } = resolved;
 
        setRoute({ category, subcategory, product, id });
 
        const res = await productapi.get(`/api/products/listing/${id}`);
        const data = res?.data?.data || res?.data;
 
        setProduct({
          ...data,
          productId: String(data.id || data._id || id),
          imageUrl: data.image_url || data.imageUrl || "/placeholder.png",
          minOrderQty: data.moq ?? data.minOrderQty ?? 0,
          supplierType: data.supplierType || data.supplier_type || "",
          organizationName: data.organizationName || data.organization_name || "",
          dispatchTimeDays: data.dispatchTimeDays || data.dispatch_time_days,
          pricingTiers: data.pricingTiers || data.pricing_tiers || [],
          specifications: data.specifications || [],
        });
      } catch (error) {
        console.error("Failed to load product detail:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, [params]);
 
  const onToggleFavourite = () => {
    if (!product) return;
    const productId = String(product.productId);
    const isLiked = favouriteItems.map(String).includes(productId);
 
    if (isLiked) {
      dispatch(removeFromFavourites(productId));
      showToast("Removed from wishlist");
    } else {
      dispatch(addToFavourites(productId));
      showToast("Added to wishlist");
    }
  };
 
  const onAddToCart = () => {
    if (!product) return;
 
    dispatch(
      addToCart({
        productId: product.productId,
        quantity: 1,
        variantId: product?.variantId ?? product?.variant_id,
      })
    );
 
    showToast("Added to cart");
  };
 
  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
          Loading...
        </div>
      </div>
    );
  }
 
  if (!product) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl font-semibold">Product not found</h2>
          <Link
            href={`/products/${route.category}/${route.subcategory}/${route.product}`}
            className="inline-block mt-3 hover:underline"
            style={{ color: COLORS.accent }}
          >
            Back
          </Link>
        </div>
      </div>
    );
  }
 
  const isLiked = favouriteItems.map(String).includes(String(product.productId));
 
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream, color: COLORS.text }}>
      {toast && (
        <div className="fixed top-30 right-5 z-50 flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-[#0B1F3A] shadow-lg">
          <CheckCircle className="h-5 w-5 text-[#D4AF37]" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
 
      <div
        className="px-4 sm:px-6 py-3 bg-white border-b text-sm flex flex-wrap gap-2"
        style={{ borderColor: COLORS.border }}
      >
        <Link href={`/products/${route.category}`}>{slugLabel(route.category)}</Link>
        <span>/</span>
        <Link href={`/products/${route.category}/${route.subcategory}`}>
          {slugLabel(route.subcategory)}
        </Link>
        <span>/</span>
        <Link href={`/products/${route.category}/${route.subcategory}/${route.product}`}>
          {slugLabel(route.product)}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
 
      <div className="px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
            <div className="relative">
              <button
                onClick={onToggleFavourite}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow cursor-pointer z-10"
                aria-label="Toggle favourite"
              >
                <Heart
                  size={18}
                  className={isLiked ? "text-red-500" : "text-gray-600"}
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>
 
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 sm:h-80 md:h-105 object-cover rounded"
              />
            </div>
 
            <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
            <p className="text-2xl mt-2 font-semibold" style={{ color: COLORS.accent }}>
              ₹{product.price}/unit
            </p>
            <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
              Min Qty: {product.minOrderQty}
            </p>
            <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
              {product.supplierType || product.organizationName}
            </p>
 
            <div className="mt-4">
              <button
                onClick={onAddToCart}
                className="flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold cursor-pointer"
                style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
              >
                <ShoppingCart size={16} />
                Add to cart
              </button>
            </div>
 
            {product.description && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Description
                </h2>
                <p className="text-sm leading-6" style={{ color: "#555" }}>
                  {product.description}
                </p>
              </div>
            )}
 
            <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                Product Details
              </h2>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ["Category", slugLabel(route.category)],
                  ["Subcategory", slugLabel(route.subcategory)],
                  ["Supplier Type", product.supplierType || "Supplier"],
                  ["Minimum Order", `${product.minOrderQty} units`],
                  ["Price", `₹${product.price}/unit`],
                  ["Stock", product.stock ?? "Available"],
                  [
                    "Dispatch Time",
                    product.dispatchTimeDays ? `${product.dispatchTimeDays} days` : "N/A",
                  ],
                  ["Unit", product.unit || "Piece"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border rounded p-3"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                  >
                    <p style={{ color: COLORS.muted }}>{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
 
            {Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Specifications
                </h2>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.id || `${spec.key}-${spec.value}`}
                      className="border rounded p-3"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                    >
                      <p style={{ color: COLORS.muted }}>{spec.key}</p>
                      <p className="font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
 
          <div className="bg-white border rounded-lg p-4 h-fit" style={{ borderColor: COLORS.border }}>
            <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
              Send Inquiry
            </h3>
            <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
              Contact supplier for bulk pricing and order details.
            </p>
 
            <div className="space-y-3 mt-4">
              <button
                className="w-full py-3 rounded transition cursor-pointer"
                style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
              >
                Request Quote
              </button>
 
              <button
                className="w-full border py-3 rounded transition cursor-pointer"
                style={{ borderColor: COLORS.border, color: COLORS.primary }}
              >
                Contact Supplier
              </button>
 
              <button
                onClick={onToggleFavourite}
                className="w-full border py-3 rounded transition cursor-pointer flex items-center justify-center gap-2"
                style={{ borderColor: COLORS.border, color: COLORS.primary }}
              >
                <Heart
                  size={16}
                  className={isLiked ? "text-red-500" : ""}
                  fill={isLiked ? "currentColor" : "none"}
                />
                {isLiked ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
 
            <div className="mt-6 border-t pt-4 text-sm space-y-3" style={{ borderColor: COLORS.border }}>
              <div>
                <p style={{ color: COLORS.muted }}>Supplier</p>
                <p className="font-medium">{product.organizationName || "Supplier"}</p>
              </div>
 
              <div>
                <p style={{ color: COLORS.muted }}>Supplier Type</p>
                <p className="font-medium">{product.supplierType || "Verified Supplier"}</p>
              </div>
 
              <div>
                <p style={{ color: COLORS.muted }}>MOQ</p>
                <p className="font-medium">{product.minOrderQty} units</p>
              </div>
 
              <div>
                <p style={{ color: COLORS.muted }}>Price</p>
                <p className="font-medium">₹{product.price}/unit</p>
              </div>
 
              <div>
                <p style={{ color: COLORS.muted }}>Dispatch</p>
                <p className="font-medium">
                  {product.dispatchTimeDays ? `${product.dispatchTimeDays} days` : "N/A"}
                </p>
              </div>
            </div>
 
            {Array.isArray(product.pricingTiers) && product.pricingTiers.length > 0 && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
                  Pricing Tiers
                </h4>
 
                <div className="space-y-2">
                  {product.pricingTiers.map((tier) => (
                    <div
                      key={tier.id || `${tier.minQuantity}-${tier.price}`}
                      className="border rounded p-3 text-sm"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                    >
                      <p style={{ color: COLORS.muted }}>Min Qty: {tier.minQuantity}</p>
                      <p className="font-medium">₹{tier.price}</p>
                      {tier.label && <p className="text-xs mt-1" style={{ color: COLORS.muted }}>{tier.label}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}