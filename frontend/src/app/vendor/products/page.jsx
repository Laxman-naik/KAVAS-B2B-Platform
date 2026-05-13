"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Download,
  LayoutGrid,
  List,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { createProduct as createProductAPI } from "../../../services/productService";
import { useDispatch, useSelector } from "react-redux";
import { productsData } from "@/app/(buyer)/product/productData";
import { fetchProducts } from "@/store/slices/productSlice";

export default function ProductManagementBody() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All Status");
  const [viewMode, setViewMode] = useState("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const vendorId = useSelector((state) => state.vendor.vendor?.id);
  const { vendorProducts = [], loading } = useSelector(
    (state) => state.products,
  );
  console.log(vendorProducts);
  console.log(vendorId);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorProducts(vendorId));
    }
  }, [vendorId]);

  const products = Array.isArray(vendorProducts)
  ? vendorProducts
  : [];

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();

    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        String(p.sku).toLowerCase().includes(q);
      const matchCategory = category === "All" || p.category === category;
      const matchStatus = status === "All Status" || p.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, status]);

  const totalFiltered = filteredProducts.length;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalFiltered / pageSize));
  }, [totalFiltered]);

  const safePage = Math.min(Math.max(1, page), totalPages);

  const pagedFilteredProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage]);

  const rangeText = useMemo(() => {
    if (totalFiltered === 0) return "Showing 0 of 0";
    const start = (safePage - 1) * pageSize + 1;
    const end = Math.min(totalFiltered, safePage * pageSize);
    return `Showing ${start}-${end} of ${totalFiltered}`;
  }, [safePage, totalFiltered]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products],
  );
  const statuses = useMemo(
    () => [
      "All Status",
      "Active",
      "Pending Review",
      "Low Stock",
      "Out of Stock",
    ],
    [],
  );

  const enrichedProducts = useMemo(() => {
    return pagedFilteredProducts.map((p) => {
      const discount = p.id % 2 === 0 ? 25 : p.id % 3 === 0 ? 17 : 0;
      const oldPrice = discount
        ? Math.round(p.price / (1 - discount / 100))
        : null;
      const sold = 120 + p.id * 35;
      const rating = 4.2 + (p.id % 3) * 0.2;
      const reviews = 120 + p.id * 17;
      return { ...p, discount, oldPrice, sold, rating, reviews };
    });
  }, [pagedFilteredProducts]);

  const summary = useMemo(() => {
    const active = products.filter((p) => p.status === "Active").length;
    const pending = products.filter(
      (p) => p.status === "Pending Review",
    ).length;
    const low = products.filter((p) => p.status === "Low Stock").length;
    const out = products.filter((p) => p.status === "Out of Stock").length;
    return { active, pending, low, out, total: products.length };
  }, [products]);

  const statusPill = (s) => {
    if (s === "Active") return "bg-green-100 text-green-700";
    if (s === "Pending Review") return "bg-yellow-100 text-yellow-700";
    if (s === "Low Stock") return "bg-orange-100 text-orange-700";
    if (s === "Out of Stock") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  /* ================= UI ================= */

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
              Product Catalog
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {summary.total} products listed · {totalFiltered} shown
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC] inline-flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              type="button"
              onClick={() => setOpenAdd(true)}
              className="h-10 rounded-lg bg-[#0B1F3A] text-white px-4 text-sm font-extrabold hover:opacity-95 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#EFFFF6] p-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="text-sm font-extrabold text-green-700">
                {summary.active}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">Active Products</div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFF7E6] p-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
              </div>
              <div className="text-sm font-extrabold text-yellow-700">
                {summary.pending}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">Pending Review</div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFF3E6] p-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
              </div>
              <div className="text-sm font-extrabold text-orange-700">
                {summary.low}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">Low Stock</div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFECEC] p-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                <span className="h-3 w-3 rounded-full bg-red-500" />
              </div>
              <div className="text-sm font-extrabold text-red-700">
                {summary.out}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">Out of Stock</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex items-center bg-white border border-[#E5E5E5] rounded-xl px-3 h-11 w-full sm:w-85">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search products, SKU..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-2 outline-none text-sm bg-transparent"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-11 border border-[#E5E5E5] rounded-xl px-3 bg-white text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-11 border border-[#E5E5E5] rounded-xl px-3 bg-white text-sm"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3">
            <div className="flex items-center rounded-xl border border-[#E5E5E5] bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`h-9 w-9 rounded-lg inline-flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-[#0B1F3A] text-white"
                    : "text-gray-600 hover:bg-[#FFF8EC]"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`h-9 w-9 rounded-lg inline-flex items-center justify-center ${
                  viewMode === "list"
                    ? "bg-[#0B1F3A] text-white"
                    : "text-gray-600 hover:bg-[#FFF8EC]"
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-xs font-bold text-gray-500 border-b border-[#E5E5E5]">
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          {enrichedProducts.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-[#E5E5E5] last:border-b-0"
            >
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <img
                  src={p.image}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover bg-gray-100"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-[#0B1F3A]">
                    {p.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{p.sku}</div>
                </div>
              </div>
              <div className="col-span-2 text-sm font-extrabold text-[#0B1F3A]">
                ₹{Number(p.price).toLocaleString("en-IN")}
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                {Number(p.stock).toLocaleString("en-IN")}
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusPill(p.status)}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {enrichedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt=""
                  className="w-full h-44 object-cover bg-gray-100"
                />

                {product.discount ? (
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                ) : null}

                {product.status === "Out of Stock" ? (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="rounded-full bg-red-500 text-white text-xs font-extrabold px-4 py-2">
                      Out of Stock
                    </span>
                  </div>
                ) : null}

                <span
                  className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${statusPill(product.status)}`}
                >
                  {product.status}
                </span>
              </div>

              <div className="p-4">
                <div className="text-[11px] text-gray-400">{product.sku}</div>
                <div className="mt-1 text-sm font-extrabold text-[#0B1F3A] line-clamp-2">
                  {product.name}
                </div>
                <span className="inline-flex mt-2 text-[11px] bg-[#FFF8EC] text-gray-700 px-3 py-1 rounded-full border border-[#E5E5E5]">
                  {product.category}
                </span>

                <div className="mt-3 flex items-end gap-2">
                  <div className="text-lg font-extrabold text-[#0B1F3A]">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </div>
                  {product.oldPrice ? (
                    <div className="text-sm text-gray-400 line-through">
                      ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {product.moq}
                    </div>
                    <div className="text-[11px] text-gray-500">MOQ</div>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {Number(product.stock).toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-gray-500">Stock</div>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {Number(product.sold).toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-gray-500">Sold</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${product.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${product.status === "Active" ? "bg-green-600" : "bg-gray-500"}`}
                    />
                    {product.status === "Active" ? "Active" : "Inactive"}
                  </span>

                  <button
                    type="button"
                    className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                  >
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Edit ${product.name}`)}
                  className="mt-4 h-11 w-full rounded-xl bg-[#0B1F3A] text-white text-sm font-extrabold hover:opacity-95 inline-flex items-center justify-center gap-2"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
        <div>{rangeText}</div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className={`h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center ${
              safePage <= 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#FFF8EC]"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages })
            .slice(0, 5)
            .map((_, idx) => {
              const p = idx + 1;
              const active = p === safePage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-extrabold border ${
                    active
                      ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                      : "bg-white text-[#0B1F3A] border-[#E5E5E5] hover:bg-[#FFF8EC]"
                  }`}
                >
                  {p}
                </button>
              );
            })}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className={`h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center ${
              safePage >= totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#FFF8EC]"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddNewProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={async (data) => {
          const payload = {
            name: data?.name,
            sku: data?.sku,
            category: data?.category,
            unit: data?.unit,
            status: data?.status,
            description: data?.description,
            price: Number(data?.price || 0),
            mrp: Number(data?.mrp || 0),
            gst: data?.gst,
            moq: Number(data?.moq || 0),
            stock: Number(data?.stock || 0),
            images: Array.isArray(data?.images)
              ? data.images.filter((x) => typeof x === "string" && x.trim())
              : [],
          };

          const res = await createProductAPI(payload);
          const created = res?.data?.product;
          dispatch(fetchVendorProducts(vendorId));

          const next = {
            id: created?.id ?? Date.now(),
            name: String(data?.name || created?.name || "New Product"),
            sku: String(data?.sku || `SKU-${Date.now()}`),
            category: String(data?.category || "Industrial Hardware"),
            price: Number(data?.price || created?.price || 0),
            moq: Number(data?.moq || created?.moq || 1),
            stock: Number(data?.stock || created?.stock || 0),
            status: String(
              data?.status ||
                (created?.is_active ? "Active" : "Pending Review") ||
                "Active",
            ),
            image:
              "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
          };

          setPage(1);
          setOpenAdd(false);
        }}
      />
    </div>
  );
}
