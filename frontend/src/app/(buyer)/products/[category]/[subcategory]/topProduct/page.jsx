// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";

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

// export default function ProductPage({ params }) {
//   const [route, setRoute] = useState({ category: "", subcategory: "", product: "" });
//   const [mainProduct, setMainProduct] = useState(null);
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [sort, setSort] = useState("default");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [supplierType, setSupplierType] = useState([]);
//   const [minQty, setMinQty] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);

//       try {
//         const resolved = await params;
//         const { category, subcategory, product } = resolved;
//         setRoute({ category, subcategory, product });

//         const res1 = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/products/${product}`,
//           { cache: "no-store" }
//         );
//         const prod = await res1.json();

//         const normalizedProduct = {
//           ...prod,
//           imageUrl: prod.image_url || prod.imageUrl || "/placeholder.png",
//           minOrderQty: prod.moq ?? prod.minOrderQty ?? 0,
//         };

//         setMainProduct(normalizedProduct);

//         const res2 = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/products/${normalizedProduct.id}/listings`,
//           { cache: "no-store" }
//         );
//         const listingData = await res2.json();

//         const rawListings = Array.isArray(listingData?.data)
//           ? listingData.data
//           : Array.isArray(listingData)
//           ? listingData
//           : [];

//         const normalizedListings = rawListings.map((item) => ({
//           ...item,
//           imageUrl: item.image_url || item.imageUrl || "/placeholder.png",
//           minOrderQty: item.moq ?? item.minOrderQty ?? 0,
//           supplierType: item.supplierType || item.supplier_type || "",
//           createdAt: item.created_at || item.createdAt,
//         }));

//         setListings(normalizedListings);
//       } catch (error) {
//         setMainProduct(null);
//         setListings([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [params]);

//   const toggleSupplier = (value) => {
//     setSupplierType((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   const filteredListings = useMemo(() => {
//     let list = [...listings];

//     if (minPrice !== "") {
//       list = list.filter((p) => Number(p.price) >= Number(minPrice));
//     }

//     if (maxPrice !== "") {
//       list = list.filter((p) => Number(p.price) <= Number(maxPrice));
//     }

//     if (minQty !== "") {
//       list = list.filter((p) => Number(p.minOrderQty) >= Number(minQty));
//     }

//     if (supplierType.length) {
//       list = list.filter((p) => supplierType.includes(p.supplierType));
//     }

//     if (sort === "price_asc") {
//       list.sort((a, b) => Number(a.price) - Number(b.price));
//     } else if (sort === "price_desc") {
//       list.sort((a, b) => Number(b.price) - Number(a.price));
//     } else if (sort === "newest") {
//       list.sort(
//         (a, b) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       );
//     }

//     return list;
//   }, [listings, minPrice, maxPrice, minQty, supplierType, sort]);

//   const resetFilters = () => {
//     setSort("default");
//     setMinPrice("");
//     setMaxPrice("");
//     setSupplierType([]);
//     setMinQty("");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
//         <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   if (!mainProduct) {
//     return (
//       <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
//         <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
//           Product not found
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: COLORS.cream, color: COLORS.text }}>
//       <div
//         className="px-4 sm:px-6 py-5 sm:py-6 text-white"
//         style={{ backgroundColor: COLORS.primary }}
//       >
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
//           {mainProduct.name}
//         </h1>
//         <p className="text-sm mt-1">
//           {filteredListings.length} product listings available
//         </p>
//       </div>

//       <div
//         className="px-4 sm:px-6 py-3 bg-white border-b text-sm flex flex-wrap gap-2"
//         style={{ borderColor: COLORS.border }}
//       >
//         <Link href={`/products/${route.category}`} className="hover:underline">
//           {slugLabel(route.category)}
//         </Link>
//         <span>/</span>
//         <Link href={`/products/${route.category}/${route.subcategory}`} className="hover:underline">
//           {slugLabel(route.subcategory)}
//         </Link>
//         <span>/</span>
//         <span>{mainProduct.name}</span>
//       </div>

//       <div className="px-4 sm:px-6 py-5">
//         <div className="bg-white border rounded-lg p-4 sm:p-5 mb-5" style={{ borderColor: COLORS.border }}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             <div>
//               <img
//                 src={mainProduct.imageUrl}
//                 alt={mainProduct.name}
//                 className="w-full h-56 sm:h-72 object-cover rounded"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <span
//                 className="inline-block px-3 py-1 rounded-full text-xs mb-3"
//                 style={{ backgroundColor: COLORS.cream, color: COLORS.primary }}
//               >
//                 Top Product
//               </span>

//               <h2 className="text-2xl font-bold">{mainProduct.name}</h2>
//               <p className="text-xl mt-3 font-semibold" style={{ color: COLORS.accent }}>
//                 ₹{mainProduct.price}/unit
//               </p>
//               <p className="text-sm mt-1" style={{ color: "#666" }}>
//                 Min Qty: {mainProduct.minOrderQty}
//               </p>
//               <p className="text-sm mt-1" style={{ color: "#666" }}>
//                 Compare supplier listings below
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-4">
//           <div className="w-full lg:w-64 bg-white border rounded-lg p-4 h-fit" style={{ borderColor: COLORS.border }}>
//             <h3 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
//               Filters
//             </h3>

//             <p className="text-sm mb-2">Price</p>
//             <div className="space-y-2 mb-4">
//               <input
//                 type="number"
//                 placeholder="Min Price"
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(e.target.value)}
//                 className="w-full border rounded px-3 py-2 text-sm"
//                 style={{ borderColor: COLORS.border }}
//               />
//               <input
//                 type="number"
//                 placeholder="Max Price"
//                 value={maxPrice}
//                 onChange={(e) => setMaxPrice(e.target.value)}
//                 className="w-full border rounded px-3 py-2 text-sm"
//                 style={{ borderColor: COLORS.border }}
//               />
//             </div>

//             <p className="text-sm mb-2">Minimum Order Qty</p>
//             <input
//               type="number"
//               placeholder="e.g. 50"
//               value={minQty}
//               onChange={(e) => setMinQty(e.target.value)}
//               className="w-full border rounded px-3 py-2 text-sm mb-4"
//               style={{ borderColor: COLORS.border }}
//             />

//             <p className="text-sm mb-2">Supplier Type</p>
//             {["Verified Supplier", "Gold Supplier", "Trusted Supplier"].map((type) => (
//               <label key={type} className="block text-sm mb-1">
//                 <input
//                   type="checkbox"
//                   checked={supplierType.includes(type)}
//                   onChange={() => toggleSupplier(type)}
//                   className="mr-2"
//                 />
//                 {type}
//               </label>
//             ))}

//             <button
//               onClick={resetFilters}
//               className="mt-4 w-full border py-2 rounded transition"
//               style={{ borderColor: COLORS.border, color: COLORS.primary }}
//             >
//               Reset Filters
//             </button>
//           </div>

//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
//               <p>{filteredListings.length} listings</p>

//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="border rounded px-3 py-2 text-sm bg-white"
//                 style={{ borderColor: COLORS.border }}
//               >
//                 <option value="default">Sort</option>
//                 <option value="price_asc">Low → High</option>
//                 <option value="price_desc">High → Low</option>
//                 <option value="newest">Newest</option>
//               </select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {filteredListings.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white border rounded-lg p-4 hover:shadow-md transition"
//                   style={{ borderColor: COLORS.border }}
//                 >
//                   <div className="flex gap-4">
//                     <img
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="w-24 h-24 object-cover rounded"
//                     />

//                     <div className="flex-1">
//                       <span
//                         className="inline-block px-2 py-1 rounded-full text-xs mb-2"
//                         style={{ backgroundColor: COLORS.cream, color: COLORS.primary }}
//                       >
//                         {item.supplierType}
//                       </span>

//                       <h3 className="text-base font-semibold line-clamp-2">{item.name}</h3>
//                       <p className="mt-2 font-semibold" style={{ color: COLORS.accent }}>
//                         ₹{item.price}/unit
//                       </p>
//                       <p className="text-xs mt-1" style={{ color: "#666" }}>
//                         Min. {item.minOrderQty} units
//                       </p>

//                       <div className="flex gap-3 mt-4">
//                         <button
//                           className="px-4 py-2 rounded transition"
//                           style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
//                         >
//                           Get Quote
//                         </button>
//                         <Link
//                           href={`/products/${route.category}/${route.subcategory}/${route.product}/${item.id}`}
//                           className="border px-4 py-2 rounded transition"
//                           style={{ borderColor: COLORS.border, color: COLORS.primary }}
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {filteredListings.length === 0 && (
//                 <div
//                   className="bg-white border rounded-lg p-6 text-center md:col-span-2"
//                   style={{ borderColor: COLORS.border }}
//                 >
//                   No listings found.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
 
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, LayoutList } from "lucide-react";
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
 
const ITEMS_PER_PAGE = 12;
 
const MOQ_OPTIONS = [
  { label: "Under 50 units", test: (qty) => qty < 50 },
  { label: "50–200 units", test: (qty) => qty >= 50 && qty <= 200 },
  { label: "200–500 units", test: (qty) => qty > 200 && qty <= 500 },
  { label: "500+ units", test: (qty) => qty > 500 },
];
 
const PRICE_OPTIONS = [
  { label: "Under ₹500", test: (price) => price < 500 },
  { label: "₹500 - ₹1000", test: (price) => price >= 500 && price <= 1000 },
  { label: "₹1000 - ₹5000", test: (price) => price > 1000 && price <= 5000 },
  { label: "₹5000+", test: (price) => price > 5000 },
];
 
const RATING_OPTIONS = [
  { value: "4.5", label: "★★★★★" },
  { value: "4", label: "★★★★" },
];
 
export default function ProductPage({ params }) {
  const [route, setRoute] = useState({ category: "", subcategory: "", product: "" });
  const [mainProduct, setMainProduct] = useState(null);
  const [rawListings, setRawListings] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const [sortOption, setSortOption] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    minQty: [],
    price: [],
    rating: [],
  });
 
  useEffect(() => {
    const load = async () => {
      setLoading(true);
 
      try {
        const resolved = await params;
        const { category, subcategory, product } = resolved;
        setRoute({ category, subcategory, product });
 
        const res1 = await productapi.get(`/api/products/${product}`);
        const prod = res1?.data?.data || res1?.data;
 
        const normalizedProduct = {
          ...prod,
          imageUrl: prod.image_url || prod.imageUrl || "/placeholder.png",
          minOrderQty: prod.moq ?? prod.minOrderQty ?? 0,
        };
 
        setMainProduct(normalizedProduct);
 
        const res2 = await productapi.get(
          `/api/products/${normalizedProduct.id}/listings`
        );
 
        const list = Array.isArray(res2?.data?.data)
          ? res2.data.data
          : Array.isArray(res2?.data)
          ? res2.data
          : [];
 
        setRawListings(list);
      } catch (error) {
        console.error("Failed to load product page:", error);
        setMainProduct(null);
        setRawListings([]);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, [params]);
 
  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };
 
  const clearAllFilters = () => {
    setFilters({
      minQty: [],
      price: [],
      rating: [],
    });
    setSortOption("Most relevant");
    setCurrentPage(1);
  };
 
  const activeFilterCount =
    filters.minQty.length + filters.price.length + filters.rating.length;
 
  const normalizedListings = useMemo(() => {
    return rawListings.map((item) => ({
      ...item,
      listingId: String(item.id || item._id),
      imageUrl: item.image_url || item.imageUrl || "/placeholder.png",
      minOrderQty: Number(item.moq ?? item.minOrderQty ?? 0),
      supplierType: item.supplierType || item.supplier_type || "",
      priceValue: Number(item.priceValue ?? item.price ?? 0),
      ratingValue: Number(item.rating ?? 0),
      createdAt: item.created_at || item.createdAt,
    }));
  }, [rawListings]);
 
  const filteredListings = useMemo(() => {
    return [...normalizedListings]
      .filter((item) => {
        if (filters.minQty.length > 0) {
          const qty = item.minOrderQty;
          const matchQty = MOQ_OPTIONS.some(
            (opt) => filters.minQty.includes(opt.label) && opt.test(qty)
          );
          if (!matchQty) return false;
        }
 
        if (filters.rating.length > 0) {
          const matchRating = filters.rating.some(
            (r) => item.ratingValue >= parseFloat(r)
          );
          if (!matchRating) return false;
        }
 
        if (filters.price.length > 0) {
          const price = item.priceValue;
          const matchPrice = PRICE_OPTIONS.some(
            (opt) => filters.price.includes(opt.label) && opt.test(price)
          );
          if (!matchPrice) return false;
        }
 
        return true;
      })
      .sort((a, b) => {
        if (sortOption === "Price low to high") return a.priceValue - b.priceValue;
        if (sortOption === "Price high to low") return b.priceValue - a.priceValue;
        if (sortOption === "Newest")
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        return 0;
      });
  }, [normalizedListings, filters, sortOption]);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);
 
  const totalListings = filteredListings.length;
  const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalListings);
  const paginatedListings = filteredListings.slice(startIndex, endIndex);
 
  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
          Loading...
        </div>
      </div>
    );
  }
 
  if (!mainProduct) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.cream }}>
        <div className="bg-white border rounded-lg p-6 text-center" style={{ borderColor: COLORS.border }}>
          Product not found
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream, color: COLORS.text }}>
      <div
        className="px-4 sm:px-6 py-5 sm:py-6 text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {mainProduct.name}
        </h1>
        <p className="text-sm mt-1">
          {totalListings} product listings available
        </p>
      </div>
 
      <div
        className="px-4 sm:px-6 py-3 bg-white border-b text-sm flex flex-wrap gap-2"
        style={{ borderColor: COLORS.border }}
      >
        <Link href={`/products/${route.category}`} className="hover:underline">
          {slugLabel(route.category)}
        </Link>
        <span>/</span>
        <Link href={`/products/${route.category}/${route.subcategory}`} className="hover:underline">
          {slugLabel(route.subcategory)}
        </Link>
        <span>/</span>
        <span>{mainProduct.name}</span>
      </div>
 
      <div className="px-4 sm:px-6 py-5">
        <div className="bg-white border rounded-lg p-4 sm:p-5 mb-5" style={{ borderColor: COLORS.border }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <img
                src={mainProduct.imageUrl}
                alt={mainProduct.name}
                className="w-full h-56 sm:h-72 object-cover rounded"
              />
            </div>
 
            <div className="md:col-span-2">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                style={{ backgroundColor: COLORS.cream, color: COLORS.primary }}
              >
                Top Product
              </span>
 
              <h2 className="text-2xl font-bold">{mainProduct.name}</h2>
              <p className="text-xl mt-3 font-semibold" style={{ color: COLORS.accent }}>
                ₹{mainProduct.price}/unit
              </p>
              <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                Min Qty: {mainProduct.minOrderQty}
              </p>
              <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                Compare supplier listings below
              </p>
            </div>
          </div>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div className="md:hidden mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full border rounded-lg py-2 text-sm font-medium cursor-pointer flex items-center justify-center gap-2 bg-white"
              style={{ color: COLORS.primary, borderColor: COLORS.border }}
            >
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="text-[11px] px-1.5 py-px rounded-full"
                  style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
                >
                  {activeFilterCount}
                </span>
              )}
              <span>{showFilters ? "▲" : "▼"}</span>
            </button>
          </div>
 
          <div
            className={`${showFilters ? "block" : "hidden"} md:block bg-white rounded-2xl border p-5 h-fit sticky top-24 shadow-sm`}
            style={{ borderColor: COLORS.border }}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>
 
            {/* Min. Order Qty */}
            <div className="border-b pb-5 mb-5" style={{ borderColor: COLORS.border }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: COLORS.primary }}>
                Min. Order Qty
              </h3>
              {MOQ_OPTIONS.map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.minQty.includes(opt.label)}
                    onChange={() => handleFilterChange("minQty", opt.label)}
                    className="accent-[#D4AF37]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
 
            {/* Price Range */}
            <div className="border-b pb-5 mb-5" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: COLORS.primary }}>
                  Price Range
                </h3>
                {filters.price.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, price: [] }))}
                    className="text-[11px] text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              {PRICE_OPTIONS.map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.price.includes(opt.label)}
                    onChange={() => handleFilterChange("price", opt.label)}
                    className="accent-[#D4AF37]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
 
            {/* Rating */}
            <div>
              <h3 className="font-semibold text-sm mb-3" style={{ color: COLORS.primary }}>
                Rating
              </h3>
              {RATING_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex gap-2 items-center text-sm mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.rating.includes(opt.value)}
                    onChange={() => handleFilterChange("rating", opt.value)}
                    className="accent-[#D4AF37]"
                  />
                  <span className="text-yellow-500">{opt.label}</span>
                  <span>&amp; above</span>
                </label>
              ))}
            </div>
 
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer md:hidden"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
            >
              APPLY FILTERS
            </button>
          </div>
 
          <div>
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm" style={{ color: COLORS.text }}>
                Showing <span className="font-semibold">{totalListings === 0 ? 0 : startIndex + 1}</span>–
                <span className="font-semibold">{endIndex}</span> of{" "}
                <span className="font-semibold">{totalListings}</span> listings
              </p>
 
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-lg border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  <option>Most relevant</option>
                  <option>Price low to high</option>
                  <option>Price high to low</option>
                  <option>Newest</option>
                </select>
 
                <button
                  onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                  className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center cursor-pointer"
                  style={{ borderColor: COLORS.border, color: COLORS.primary }}
                >
                  {viewMode === "grid" ? <LayoutGrid size={16} /> : <LayoutList size={16} />}
                </button>
              </div>
            </div>
 
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : "grid grid-cols-1 gap-3"
              }
            >
              {paginatedListings.map((item) => (
                <div
                  key={item.listingId}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded shrink-0"
                    />
 
                    <div className="flex-1">
                      {item.supplierType && (
                        <span
                          className="inline-block px-2 py-1 rounded-full text-xs mb-2"
                          style={{ backgroundColor: COLORS.cream, color: COLORS.primary }}
                        >
                          {item.supplierType}
                        </span>
                      )}
 
                      <h3 className="text-base font-semibold line-clamp-2">{item.name}</h3>
                      <p className="mt-2 font-semibold" style={{ color: COLORS.accent }}>
                        ₹{item.priceValue}/unit
                      </p>
                      <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
                        Min. {item.minOrderQty} units
                      </p>
 
                      <div className="flex gap-3 mt-4">
                        <button
                          className="px-4 py-2 rounded transition cursor-pointer"
                          style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
                        >
                          Get Quote
                        </button>
                        <Link
                          href={`/products/${route.category}/${route.subcategory}/${route.product}/${item.listingId}`}
                          className="border px-4 py-2 rounded transition"
                          style={{ borderColor: COLORS.border, color: COLORS.primary }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
 
              {paginatedListings.length === 0 && (
                <div
                  className="bg-white border rounded-lg p-6 text-center md:col-span-2"
                  style={{ borderColor: COLORS.border, color: COLORS.muted }}
                >
                  No listings found for the selected filters.
                </div>
              )}
            </div>
 
            {totalListings > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
                  style={{ borderColor: COLORS.border, color: COLORS.primary }}
                  disabled={safePage === 1}
                >
                  ‹
                </button>
 
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-9 w-9 rounded-lg border text-sm cursor-pointer"
                      style={
                        safePage === pageNum
                          ? { backgroundColor: COLORS.primary, color: COLORS.cream, borderColor: COLORS.primary }
                          : { backgroundColor: COLORS.white, color: COLORS.primary, borderColor: COLORS.border }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
 
                {totalPages > 5 && (
                  <>
                    <span className="px-1" style={{ color: COLORS.muted }}>
                      …
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className="h-9 w-9 rounded-lg border text-sm cursor-pointer"
                      style={
                        safePage === totalPages
                          ? { backgroundColor: COLORS.primary, color: COLORS.cream, borderColor: COLORS.primary }
                          : { backgroundColor: COLORS.white, color: COLORS.primary, borderColor: COLORS.border }
                      }
                    >
                      {totalPages}
                    </button>
                  </>
                )}
 
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
                  style={{ borderColor: COLORS.border, color: COLORS.primary }}
                  disabled={safePage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}