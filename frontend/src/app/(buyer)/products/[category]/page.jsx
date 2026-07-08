// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import { productapi } from "@/lib/axios";

// const COLORS = {
//   primary: "#0B1F3A",
//   accent: "#D4AF37",
//   cream: "#FFF8EC",
//   white: "#FFFFFF",
//   text: "#1A1A1A",
//   border: "#E5E5E5",
// };

// export default function CategoryPage() {
//   const { category } = useParams();

//   const [categoryMeta, setCategoryMeta] = useState(null);
//   const [route, setRoute] = useState({ category: "" });
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [sort, setSort] = useState("default");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [supplierType, setSupplierType] = useState([]);
//   const [minQty, setMinQty] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       if (!category) return;

//       setLoading(true);

//       try {
//         setRoute({ category });

//         const [metaRes, productsRes] = await Promise.all([
//           productapi.get(`/api/categories/slug/${category}`),
//           productapi.get(`/api/products/category/${category}`),
//         ]);

//         setCategoryMeta(metaRes?.data?.data || null);

//         const rawProducts = Array.isArray(productsRes?.data?.data)
//           ? productsRes.data.data
//           : Array.isArray(productsRes?.data)
//             ? productsRes.data
//             : [];

//         const mappedProducts = rawProducts.map((p) => ({
//           ...p,
//           id: p.id,
//           slug: p.slug,
//           name: p.name,
//           price: p.price,
//           imageUrl: p.image_url || p.imageUrl || "/placeholder.png",
//           minOrderQty: p.moq ?? p.minOrderQty ?? 0,
//           subcategorySlug:
//             p.subcategory_slug ||
//             p.subcategorySlug ||
//             p.sub_category_slug ||
//             "",
//           supplierType: p.supplier_type || p.supplierType || "",
//           createdAt: p.created_at || p.createdAt,
//         }));

//         setProducts(mappedProducts);
//       } catch (error) {
//         console.error("Failed to load category page:", error);
//         setCategoryMeta(null);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [category]);

//   const toggleSupplier = (value) => {
//     setSupplierType((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   const filteredProducts = useMemo(() => {
//     let list = [...products];

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
//   }, [products, minPrice, maxPrice, minQty, supplierType, sort]);

//   const resetFilters = () => {
//     setSort("default");
//     setMinPrice("");
//     setMaxPrice("");
//     setSupplierType([]);
//     setMinQty("");
//   };

//   const categorySlug = route.category;
//   const categoryName = categoryMeta?.name || "Category";
//   const subcategories = categoryMeta?.subcategories || [];

//   return (
//     <div
//       className="min-h-screen"
//       style={{ backgroundColor: COLORS.cream, color: COLORS.text }}
//     >
//       <div
//         className="px-4 sm:px-6 py-5 sm:py-6 text-white"
//         style={{ backgroundColor: COLORS.primary }}
//       >
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
//           {categoryName}
//         </h1>
//         <p className="text-sm mt-1">{filteredProducts.length} products available</p>
//       </div>

//       <div
//         className="px-4 sm:px-6 py-3 flex gap-3 border-b overflow-x-auto bg-white"
//         style={{ borderColor: COLORS.border }}
//       >
//         <button
//           className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap border"
//           style={{
//             backgroundColor: COLORS.accent,
//             color: COLORS.primary,
//             borderColor: COLORS.accent,
//           }}
//         >
//           All {categoryName}
//         </button>

//         {subcategories.map((sub) => (
//           <Link
//             key={sub.id || sub.slug}
//             href={`/products/${categorySlug}/${sub.slug}`}
//             className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition"
//             style={{
//               backgroundColor: COLORS.white,
//               color: COLORS.text,
//               borderColor: COLORS.border,
//             }}
//           >
//             {sub.name}
//           </Link>
//         ))}
//       </div>

//       <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 py-5">
//         <div
//           className="w-full lg:w-64 border rounded-lg p-4 h-fit bg-white"
//           style={{ borderColor: COLORS.border }}
//         >
//           <h3 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
//             Filters
//           </h3>

//           <p className="text-sm mb-2">Price</p>
//           <div className="space-y-2 mb-4">
//             <input
//               type="number"
//               placeholder="Min Price"
//               value={minPrice}
//               onChange={(e) => setMinPrice(e.target.value)}
//               className="w-full border rounded px-3 py-2 text-sm"
//               style={{ borderColor: COLORS.border }}
//             />
//             <input
//               type="number"
//               placeholder="Max Price"
//               value={maxPrice}
//               onChange={(e) => setMaxPrice(e.target.value)}
//               className="w-full border rounded px-3 py-2 text-sm"
//               style={{ borderColor: COLORS.border }}
//             />
//           </div>

//           <p className="text-sm mb-2">Minimum Order Qty</p>
//           <input
//             type="number"
//             placeholder="e.g. 50"
//             value={minQty}
//             onChange={(e) => setMinQty(e.target.value)}
//             className="w-full border rounded px-3 py-2 text-sm mb-4"
//             style={{ borderColor: COLORS.border }}
//           />

//           <p className="text-sm mb-2">Supplier Type</p>
//           {["Verified Supplier", "Gold Supplier", "Trusted Supplier"].map(
//             (type) => (
//               <label key={type} className="block text-sm mb-1">
//                 <input
//                   type="checkbox"
//                   checked={supplierType.includes(type)}
//                   onChange={() => toggleSupplier(type)}
//                   className="mr-2"
//                 />
//                 {type}
//               </label>
//             )
//           )}

//           <button
//             onClick={resetFilters}
//             className="mt-4 w-full border py-2 rounded"
//             style={{ borderColor: COLORS.border, color: COLORS.primary }}
//           >
//             Reset Filters
//           </button>
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
//             <p>{filteredProducts.length} products</p>

//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="border rounded px-3 py-2 text-sm bg-white"
//               style={{ borderColor: COLORS.border }}
//             >
//               <option value="default">Sort</option>
//               <option value="price_asc">Low → High</option>
//               <option value="price_desc">High → Low</option>
//               <option value="newest">Newest</option>
//             </select>
//           </div>

//           {loading ? (
//             <div
//               className="border rounded-lg p-6 text-center bg-white"
//               style={{ borderColor: COLORS.border }}
//             >
//               Loading...
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div
//               className="border rounded-lg p-6 text-center bg-white"
//               style={{ borderColor: COLORS.border }}
//             >
//               No products found.
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {filteredProducts.map((item) => (
//                 <Link
//                   key={item.id}
//                   href={`/products/${categorySlug}/${item.subcategorySlug}/${item.slug}`}
//                 >
//                   <div
//                     className="bg-white p-3 border rounded shadow-sm hover:shadow-md transition"
//                     style={{ borderColor: COLORS.border }}
//                   >
//                     <img
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="h-32 sm:h-36 md:h-40 w-full object-cover rounded"
//                     />
//                     <h3 className="text-sm mt-2 line-clamp-2">{item.name}</h3>
//                     <p
//                       className="mt-1 font-semibold"
//                       style={{ color: COLORS.accent }}
//                     >
//                       ₹{item.price}
//                     </p>
//                     <p className="text-xs mt-1 text-gray-500">
//                       Min. {item.minOrderQty} units
//                     </p>
//                     <p className="text-xs mt-1 text-gray-500">
//                       {item.supplierType}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
 
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingCart,
  LayoutGrid,
  LayoutList,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  fetchFavourites,
} from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { productapi } from "@/lib/axios";
 
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
 
export default function CategoryPage() {
  const { category } = useParams();
 
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const [sortOption, setSortOption] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState("");
  const [filters, setFilters] = useState({
    minQty: [],
    price: [],
    rating: [],
  });
 
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
      if (!category) return;
 
      setLoading(true);
 
      try {
        const [metaRes, productsRes] = await Promise.all([
          productapi.get(`/api/categories/slug/${category}`),
          productapi.get(`/api/products/category/${category}`),
        ]);
 
        setCategoryMeta(metaRes?.data?.data || null);
 
        const list = Array.isArray(productsRes?.data?.data)
          ? productsRes.data.data
          : Array.isArray(productsRes?.data)
          ? productsRes.data
          : [];
 
        setRawProducts(list);
      } catch (error) {
        console.error("Failed to load category page:", error);
        setCategoryMeta(null);
        setRawProducts([]);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, [category]);
 
  const onToggleFavourite = (product) => {
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
 
  const onAddToCart = (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    if (!productId) return;
 
    dispatch(
      addToCart({
        productId: product.productId,
        quantity: 1,
        variantId: product?.variantId ?? product?.variant_id,
      })
    );
 
    showToast("Added to cart");
  };
 
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
 
  const normalizedProducts = useMemo(() => {
    return rawProducts.map((product) => ({
      ...product,
      productId: String(product.id || product._id),
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url || product.imageUrl || "/placeholder.png",
      minOrderQty: Number(product.moq ?? product.minOrderQty ?? 0),
      supplierType: product.supplierType || product.supplier_type || "",
      priceValue: Number(product.priceValue ?? product.price ?? 0),
      subcategorySlug:
        product.subcategory_slug ||
        product.subcategorySlug ||
        product.sub_category_slug ||
        "",
      ratingValue: Number(product.rating ?? 0),
      createdAt: product.created_at || product.createdAt,
    }));
  }, [rawProducts]);
 
  const filteredProducts = useMemo(() => {
    return [...normalizedProducts]
      .filter((product) => {
        if (filters.minQty.length > 0) {
          const qty = product.minOrderQty;
          const matchQty = MOQ_OPTIONS.some(
            (opt) => filters.minQty.includes(opt.label) && opt.test(qty)
          );
          if (!matchQty) return false;
        }
 
        if (filters.rating.length > 0) {
          const matchRating = filters.rating.some(
            (r) => product.ratingValue >= parseFloat(r)
          );
          if (!matchRating) return false;
        }
 
        if (filters.price.length > 0) {
          const price = product.priceValue;
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
  }, [normalizedProducts, filters, sortOption]);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption, category]);
 
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
 
  const categorySlug = category;
  const categoryName = categoryMeta?.name || "Category";
  const subcategories = categoryMeta?.subcategories || [];
 
  return (
    <div
      className="bg-white min-h-screen text-[#1A1A1A]"
      style={{ backgroundColor: COLORS.white, color: COLORS.text }}
    >
      {toast && (
        <div className="fixed top-30 right-5 z-50 flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-[#0B1F3A] shadow-lg">
          <CheckCircle className="h-5 w-5 text-[#D4AF37]" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
 
      <div className="max-w-350 mx-auto px-4 py-6">
        <div className="mb-5">
          <p className="text-xs text-gray-600" style={{ color: COLORS.muted }}>
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">››</span>
            <span className="text-[#0B1F3A] font-medium" style={{ color: COLORS.primary }}>
              {categoryName}
            </span>
          </p>
        </div>
 
        <h1 className="text-3xl font-bold mt-2 text-[#0B1F3A]" style={{ color: COLORS.primary }}>
          {categoryName}
        </h1>
 
        <p className="text-gray-500 text-sm mt-1" style={{ color: COLORS.muted }}>
          {totalProducts} products available
        </p>
      </div>
 
      <div className="bg-white py-5 rounded-sm" style={{ backgroundColor: COLORS.white }}>
        {subcategories.length > 0 && (
          <div className="max-w-350 mx-auto px-4 pb-4">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              <span
                className="whitespace-nowrap px-4 py-2 rounded-lg text-sm border"
                style={{ backgroundColor: COLORS.accent, color: COLORS.primary, borderColor: COLORS.accent }}
              >
                All {categoryName}
              </span>
 
              {subcategories.map((sub) => (
                <Link
                  key={sub.id || sub.slug}
                  href={`/products/${categorySlug}/${sub.slug}`}
                  className="whitespace-nowrap px-4 py-2 rounded-lg text-sm border transition"
                  style={{ backgroundColor: COLORS.white, color: COLORS.text, borderColor: COLORS.border }}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}
 
        <div className="max-w-350 mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div className="md:hidden mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full border rounded-lg py-2 text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.white, color: COLORS.primary, borderColor: COLORS.border }}
            >
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="text-[11px] px-1.5 py-[1px] rounded-full"
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
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
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
 
          <main>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm" style={{ color: COLORS.text }}>
                Showing <span className="font-semibold">{totalProducts === 0 ? 0 : startIndex + 1}</span>–
                <span className="font-semibold">{endIndex}</span> of{" "}
                <span className="font-semibold">{totalProducts}</span> Products
              </p>
 
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-lg border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.text }}
                >
                  <option>Most relevant</option>
                  <option>Price low to high</option>
                  <option>Price high to low</option>
                  <option>Newest</option>
                </select>
 
                <button
                  onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                  className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center cursor-pointer"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.primary }}
                >
                  {viewMode === "grid" ? <LayoutGrid size={16} /> : <LayoutList size={16} />}
                </button>
              </div>
            </div>
 
            {loading ? (
              <div
                className="border rounded-lg p-12 text-center bg-white"
                style={{ borderColor: COLORS.border, color: COLORS.muted }}
              >
                Loading...
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "grid grid-cols-1 gap-3"
                  }
                >
                  {paginatedProducts.map((product) => {
                    const isLiked = favouriteItems
                      .map(String)
                      .includes(String(product.productId));
 
                    return (
                      <Link
                        key={product.productId}
                        href={`/products/${categorySlug}/${product.subcategorySlug}/${product.slug}`}
                      >
                        <Card
                          className="rounded-xl border bg-white hover:shadow-sm transition overflow-hidden cursor-pointer"
                          style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
                        >
                          <CardContent className="p-0">
                            <div className={viewMode === "grid" ? "" : "flex gap-3 items-start"}>
                              <div
                                className={
                                  viewMode === "grid" ? "relative h-40 w-full" : "relative h-24 w-24 shrink-0 m-3"
                                }
                              >
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleFavourite(product);
                                  }}
                                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer"
                                  aria-label="Toggle favourite"
                                >
                                  <Heart
                                    size={16}
                                    className={isLiked ? "text-red-500" : "text-gray-600"}
                                    fill={isLiked ? "currentColor" : "none"}
                                  />
                                </button>
 
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
 
                              <div className={viewMode === "grid" ? "p-3" : "flex-1 py-3 pr-3"}>
                                <h3 className="text-sm font-semibold line-clamp-2" style={{ color: COLORS.accent }}>
                                  {product.name}
                                </h3>
 
                                <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                                  ₹{product.priceValue}/unit
                                </p>
 
                                <p className="text-[11px]" style={{ color: COLORS.muted }}>
                                  Min. {product.minOrderQty} units
                                </p>
 
                                {product.supplierType ? (
                                  <p className="text-[11px]" style={{ color: COLORS.muted }}>
                                    {product.supplierType}
                                  </p>
                                ) : null}
 
                                <div className="mt-3">
                                  <Button
                                    className={`flex items-center gap-2 rounded-md cursor-pointer ${
                                      viewMode === "grid" ? "w-full text-sm py-2 justify-center" : "text-xs px-3 py-1.5"
                                    }`}
                                    style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onAddToCart(product);
                                    }}
                                  >
                                    <ShoppingCart size={viewMode === "grid" ? 14 : 12} />
                                    Add to cart
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
 
                {paginatedProducts.length === 0 && (
                  <div className="text-center py-12" style={{ color: COLORS.muted }}>
                    No products found for the selected filters.
                  </div>
                )}
 
                {totalProducts > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="h-9 w-9 rounded-lg border bg-white cursor-pointer"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.primary }}
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
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.primary }}
                      disabled={safePage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}