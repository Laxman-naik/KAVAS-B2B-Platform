"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const COLORS = {
  primary: "#0B1F3A",
  accent: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://kavas-b2b-platform-3.onrender.com";

export default function CategoryPage({ params }) {
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [route, setRoute] = useState({ category: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [supplierType, setSupplierType] = useState([]);
  const [minQty, setMinQty] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const resolved = await params;
        const { category } = resolved;
        setRoute({ category });
        const API_BASE = "http://localhost:5002";
        // const API_BASE = "https://kavas-b2b-platform-3.onrender.com";

        const [metaRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories/slug/${category}`, {
            cache: "no-store",
          }),
          fetch(`${API_BASE}/api/products/category/${category}`, {
            cache: "no-store",
          }),
        ]);

        if (!metaRes.ok) {
          throw new Error(`Category API failed: ${metaRes.status}`);
        }

        if (!productsRes.ok) {
          throw new Error(`Products API failed: ${productsRes.status}`);
        }

        const metaJson = await metaRes.json();
        const productsJson = await productsRes.json();

        setCategoryMeta(metaJson?.data || null);

        const rawProducts = Array.isArray(productsJson?.data)
          ? productsJson.data
          : Array.isArray(productsJson)
            ? productsJson
            : [];

        const mappedProducts = rawProducts.map((p) => ({
          ...p,
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          imageUrl: p.image_url || p.imageUrl || "/placeholder.png",
          minOrderQty: p.moq ?? p.minOrderQty ?? 0,
          subcategorySlug:
            p.subcategory_slug ||
            p.subcategorySlug ||
            p.sub_category_slug ||
            "",
          supplierType: p.supplier_type || p.supplierType || "",
          createdAt: p.created_at || p.createdAt,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load category page:", error);
        setCategoryMeta(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params]);

  const toggleSupplier = (value) => {
    setSupplierType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (minPrice !== "") {
      list = list.filter((p) => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice !== "") {
      list = list.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    if (minQty !== "") {
      list = list.filter((p) => Number(p.minOrderQty) >= Number(minQty));
    }

    if (supplierType.length) {
      list = list.filter((p) => supplierType.includes(p.supplierType));
    }

    if (sort === "price_asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price_desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return list;
  }, [products, minPrice, maxPrice, minQty, supplierType, sort]);

  const resetFilters = () => {
    setSort("default");
    setMinPrice("");
    setMaxPrice("");
    setSupplierType([]);
    setMinQty("");
  };

  const categorySlug = route.category;
  const categoryName = categoryMeta?.name || "Category";
  const subcategories = categoryMeta?.subcategories || [];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.cream, color: COLORS.text }}
    >
      <div
        className="px-4 sm:px-6 py-5 sm:py-6 text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {categoryName}
        </h1>
        <p className="text-sm mt-1">{filteredProducts.length} products available</p>
      </div>

      <div
        className="px-4 sm:px-6 py-3 flex gap-3 border-b overflow-x-auto bg-white"
        style={{ borderColor: COLORS.border }}
      >
        <button
          className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap border"
          style={{
            backgroundColor: COLORS.accent,
            color: COLORS.primary,
            borderColor: COLORS.accent,
          }}
        >
          All {categoryName}
        </button>

        {subcategories.map((sub) => (
          <Link
            key={sub.id || sub.slug}
            href={`/products/${categorySlug}/${sub.slug}`}
            className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition"
            style={{
              backgroundColor: COLORS.white,
              color: COLORS.text,
              borderColor: COLORS.border,
            }}
          >
            {sub.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 py-5">
        <div
          className="w-full lg:w-64 border rounded-lg p-4 h-fit bg-white"
          style={{ borderColor: COLORS.border }}
        >
          <h3 className="font-semibold mb-3" style={{ color: COLORS.primary }}>
            Filters
          </h3>

          <p className="text-sm mb-2">Price</p>
          <div className="space-y-2 mb-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              style={{ borderColor: COLORS.border }}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <p className="text-sm mb-2">Minimum Order Qty</p>
          <input
            type="number"
            placeholder="e.g. 50"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-4"
            style={{ borderColor: COLORS.border }}
          />

          <p className="text-sm mb-2">Supplier Type</p>
          {["Verified Supplier", "Gold Supplier", "Trusted Supplier"].map(
            (type) => (
              <label key={type} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  checked={supplierType.includes(type)}
                  onChange={() => toggleSupplier(type)}
                  className="mr-2"
                />
                {type}
              </label>
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
          <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
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
              className="border rounded-lg p-6 text-center bg-white"
              style={{ borderColor: COLORS.border }}
            >
              Loading...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              className="border rounded-lg p-6 text-center bg-white"
              style={{ borderColor: COLORS.border }}
            >
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${categorySlug}/${item.subcategorySlug}/${item.slug}`}
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
      </div>
    </div>
  );
}