<<<<<<< HEAD

=======
>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
<<<<<<< HEAD
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, LayoutGrid, LayoutList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  fetchFavourites,
} from "@/store/slices/favouritesSlice";
import { addToCart } from "@/store/slices/cartSlice";
=======
>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
import { productapi } from "@/lib/axios";

const COLORS = {
  primary: "#0B1F3A",
  accent: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

export default function SubCategoryPage() {
  const { category, subcategory } = useParams();

  const [route, setRoute] = useState({ category: "", subcategory: "" });
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [supplierType, setSupplierType] = useState([]);
  const [minQty, setMinQty] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!category || !subcategory) return;

      setLoading(true);

      try {
<<<<<<< HEAD
=======
        setRoute({ category, subcategory });

>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
        const [categoryRes, productsRes] = await Promise.all([
          productapi.get(`/api/categories/slug/${category}`),
          productapi.get(`/api/products/category/${category}/${subcategory}`),
        ]);
 
        setCategoryMeta(categoryRes.data.data);
<<<<<<< HEAD
 
        const fetchedProducts = Array.isArray(productsRes?.data?.data)
          ? productsRes.data.data
          : Array.isArray(productsRes?.data)
          ? productsRes.data
          : [];
 
        setRawProducts(fetchedProducts);
=======

        const rawProducts = Array.isArray(productsRes?.data?.data)
          ? productsRes.data.data
          : Array.isArray(productsRes?.data)
            ? productsRes.data
            : [];

        const mappedProducts = rawProducts.map((p) => ({
          ...p,
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          imageUrl: p.image_url || p.imageUrl || "/placeholder.png",
          minOrderQty: p.moq ?? p.minOrderQty ?? 0,
          supplierType: p.supplier_type || p.supplierType || "",
          createdAt: p.created_at || p.createdAt,
        }));

        setProducts(mappedProducts);
>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
      } catch (error) {
        console.error("Failed to load subcategory page:", error);
        setCategoryMeta(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category, subcategory]);
<<<<<<< HEAD
 
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
    if (!product?.productId) return;
 
    dispatch(
      addToCart({
        productId: product.productId,
        quantity: 1,
        variantId: product?.variantId ?? product?.variant_id,
      })
=======

  const toggleSupplier = (value) => {
    setSupplierType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
    );
  };
<<<<<<< HEAD
 
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
    setFilters({ minQty: [], price: [], rating: [] });
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
    let list = [...normalizedProducts];
 
    if (filters.minQty.length) {
      list = list.filter((p) =>
        filters.minQty.some((label) => {
          const opt = MOQ_OPTIONS.find((o) => o.label === label);
          return opt ? opt.test(p.minOrderQty) : true;
        })
      );
=======

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (minPrice !== "") {
      list = list.filter((p) => Number(p.price) >= Number(minPrice));
>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
    }
 
    if (filters.price.length) {
      list = list.filter((p) =>
        filters.price.some((label) => {
          const opt = PRICE_OPTIONS.find((o) => o.label === label);
          return opt ? opt.test(p.priceValue) : true;
        })
      );
    }
 
    if (filters.rating.length) {
      list = list.filter((p) =>
        filters.rating.some((value) => p.ratingValue >= Number(value))
      );
    }
 
    if (sortOption === "Price low to high") {
      list.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortOption === "Price high to low") {
      list.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortOption === "Newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }
 
    return list;
<<<<<<< HEAD
  }, [normalizedProducts, filters, sortOption]);
 
  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);
 
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
 
  const categorySlug = category;
  const subcategorySlug = subcategory;
  const subcategories = categoryMeta?.subcategories || [];
  const categoryName = categoryMeta?.name || "Category";
 
=======
  }, [products, minPrice, maxPrice, minQty, supplierType, sort]);

  const resetFilters = () => {
    setSort("default");
    setMinPrice("");
    setMaxPrice("");
    setSupplierType([]);
    setMinQty("");
  };

  const categorySlug = route.category;
  const subcategorySlug = route.subcategory;
  const selectedSubcategory =
    categoryMeta?.subcategories?.find(
      (sub) => sub.slug === subcategorySlug
    );

  const categoryName =
    selectedSubcategory?.name ||
    categoryMeta?.name ||
    "Category";
  const subcategories = categoryMeta?.subcategories || [];

>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.cream, color: COLORS.text }}
    >
      <div
        className="px-4 sm:px-6 py-5 sm:py-6 text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
          {subcategorySlug?.replaceAll("-", " ") || categoryName}
        </h1>
        <p className="text-sm mt-1">
          {totalProducts} products available
        </p>
      </div>
 
      <div className="max-w-350 mx-auto px-4 py-4">
        <p className="text-xs" style={{ color: COLORS.muted }}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">››</span>
          <Link href={`/products/${categorySlug}`} className="hover:underline">
            {categoryName}
          </Link>
          <span className="mx-2">››</span>
          <span
            className="font-medium capitalize"
            style={{ color: COLORS.primary }}
          >
            {subcategorySlug?.replaceAll("-", " ")}
          </span>
        </p>
      </div>
 
      <div
        className="px-4 sm:px-6 py-3 flex gap-3 border-b overflow-x-auto bg-white no-scrollbar"
        style={{ borderColor: COLORS.border }}
      >
        <Link
          href={`/products/${categorySlug}`}
          className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap border"
          style={{
            backgroundColor: COLORS.white,
            color: COLORS.text,
            borderColor: COLORS.border,
          }}
        >
          All {categoryName}
        </Link>
 
        {subcategories.map((sub) => (
          <Link
            key={sub.id || sub.slug}
            href={`/products/${categorySlug}/${sub.slug}`}
            className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap border"
            style={{
              backgroundColor:
                subcategorySlug === sub.slug ? COLORS.accent : COLORS.white,
              color:
                subcategorySlug === sub.slug ? COLORS.primary : COLORS.text,
              borderColor:
                subcategorySlug === sub.slug ? COLORS.accent : COLORS.border,
            }}
          >
            {sub.name}
          </Link>
        ))}
      </div>
 
      <div
        className="max-w-350 mx-auto px-4 pb-10 pt-5 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6"
      >
        <div className="md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full border rounded-lg py-2 text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundColor: COLORS.white,
              color: COLORS.primary,
              borderColor: COLORS.border,
            }}
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
          className={`${
            showFilters ? "block" : "hidden"
          } md:block bg-white rounded-2xl border p-5 h-fit sticky top-24 shadow-sm`}
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
 
        
          <div className="border-b pb-5 mb-5" style={{ borderColor: COLORS.border }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: COLORS.primary }}>
              Min. Order Qty
            </h3>
            {MOQ_OPTIONS.map((opt) => (
              <label
                key={opt.label}
                className="flex items-center gap-2 text-sm mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.minQty.includes(opt.label)}
                  onChange={() => handleFilterChange("minQty", opt.label)}
                  className="accent-[#D4AF37]"
                />
                {opt.label}
              </label>
<<<<<<< HEAD
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
              <label
                key={opt.label}
                className="flex items-center gap-2 text-sm mb-2 cursor-pointer"
              >
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
              <label
                key={opt.value}
                className="flex gap-2 items-center text-sm mb-2 cursor-pointer"
              >
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
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm" style={{ color: COLORS.text }}>
              Showing{" "}
              <span className="font-semibold">
                {totalProducts === 0 ? 0 : startIndex + 1}
              </span>
              –<span className="font-semibold">{endIndex}</span> of{" "}
              <span className="font-semibold">{totalProducts}</span> Products
            </p>
 
            <div className="flex items-center gap-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-lg border bg-white px-3 py-2 text-sm"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.white,
                  color: COLORS.text,
                }}
              >
                <option>Most relevant</option>
                <option>Price low to high</option>
                <option>Price high to low</option>
                <option>Newest</option>
              </select>
 
              <button
                onClick={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center cursor-pointer"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.white,
                  color: COLORS.primary,
                }}
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
                      href={`/products/${categorySlug}/${subcategorySlug}/${product.slug}`}
                    >
                      <Card
                        className="rounded-xl border bg-white hover:shadow-sm transition overflow-hidden cursor-pointer"
                        style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
                      >
                        <CardContent className="p-0">
                          <div className={viewMode === "grid" ? "" : "flex gap-3 items-start"}>
                            <div
                              className={
                                viewMode === "grid"
                                  ? "relative h-40 w-full"
                                  : "relative h-24 w-24 shrink-0 m-3"
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
                              <h3
                                className="text-sm font-semibold line-clamp-2"
                                style={{ color: COLORS.accent }}
                              >
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
                                    viewMode === "grid"
                                      ? "w-full text-sm py-2 justify-center"
                                      : "text-xs px-3 py-1.5"
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
                    className="h-9 w-9 rounded-lg border bg-white cursor-pointer disabled:opacity-40"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.white,
                      color: COLORS.primary,
                    }}
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
                            ? {
                                backgroundColor: COLORS.primary,
                                color: COLORS.cream,
                                borderColor: COLORS.primary,
                              }
                            : {
                                backgroundColor: COLORS.white,
                                color: COLORS.primary,
                                borderColor: COLORS.border,
                              }
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
                            ? {
                                backgroundColor: COLORS.primary,
                                color: COLORS.cream,
                                borderColor: COLORS.primary,
                              }
                            : {
                                backgroundColor: COLORS.white,
                                color: COLORS.primary,
                                borderColor: COLORS.border,
                              }
                        }
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
 
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-9 w-9 rounded-lg border bg-white cursor-pointer disabled:opacity-40"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.white,
                      color: COLORS.primary,
                    }}
                    disabled={safePage === totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </main>
=======
            )
          )}

          <button
            onClick={resetFilters}
            className="mt-4 w-full border py-2 rounded"
            style={{ borderColor: COLORS.border, color: COLORS.primary }}
          >
            Reset Filters
          </button>
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-3 gap-3 flex-wrap items-center">
            <p>{filteredProducts.length} products</p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded px-3 py-2 text-sm bg-white"
              style={{ borderColor: COLORS.border }}
            >
              <option value="default">Sort</option>
              <option value="price_asc">Low → High</option>
              <option value="price_desc">High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <div
              className="bg-white border rounded-lg p-6 text-center"
              style={{ borderColor: COLORS.border }}
            >
              Loading...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              className="bg-white border rounded-lg p-6 text-center"
              style={{ borderColor: COLORS.border }}
            >
              No top products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${categorySlug}/${subcategorySlug}/${item.slug}`}
                >
                  <div
                    className="bg-white p-3 border rounded shadow-sm hover:shadow-md transition"
                    style={{ borderColor: COLORS.border }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-32 sm:h-36 md:h-40 w-full object-cover rounded"
                    />
                    <h3 className="text-sm mt-2 line-clamp-2">{item.name}</h3>
                    <p
                      className="mt-1 font-semibold"
                      style={{ color: COLORS.accent }}
                    >
                      ₹{item.price}
                    </p>
                    <p className="text-xs mt-1 text-gray-500">
                      Min. {item.minOrderQty} units
                    </p>
                    <p className="text-xs mt-1 text-gray-500">
                      {item.supplierType}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
>>>>>>> 8391893e21eadc79797e5229f205d0687938419c
      </div>
 
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm z-50"
          style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
