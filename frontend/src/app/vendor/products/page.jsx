"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import AddNewProductModal from "../../../components/vendor/AddNewProductModal";
import { DeleteProductModal, ProductDetailModal } from "../../../components/vendor/ProductModals";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorProducts,
  removeProduct,
} from "../../../store/slices/productSlice";

/* ─── helpers ────────────────────────────────────────────────── */
const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `https://kavas-b2b-platform-4.onrender.com${path}`;
};

const getPrimaryImage = (product) =>
  getImageUrl(
    product?.images?.find((img) => img.is_primary)?.image_url ||
      product?.images?.[0]?.image_url
  );

const statusStyles = {
  active:   "bg-green-100  text-green-700  border-green-200",
  pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  rejected: "bg-red-100    text-red-700    border-red-200",
  inactive: "bg-gray-100   text-gray-500   border-gray-200",
};
const statusPill = (s) =>
  statusStyles[s] || "bg-gray-100 text-gray-500 border-gray-200";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

/* ─── Summary card ───────────────────────────────────────────── */
function SummaryCard({ label, value, color }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-sm">
      <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────── */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden"
        >
          <div className="h-44 bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Action buttons (reused in both views) ──────────────────── */
function ActionButtons({ product, onView, onEdit, onDelete, mini = false }) {
  const sz = mini ? "h-8 w-8" : "h-9 w-9";
  const icSz = mini ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        title="View details"
        onClick={() => onView(product)}
        className={`${sz} rounded-xl border border-[#E5E5E5] bg-white hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors`}
      >
        <Eye className={`${icSz} text-blue-500`} />
      </button>
      <button
        type="button"
        title="Edit product"
        onClick={() => onEdit(product)}
        className={`${sz} rounded-xl border border-[#E5E5E5] bg-white hover:bg-amber-50 hover:border-amber-200 flex items-center justify-center transition-colors`}
      >
        <Pencil className={`${icSz} text-amber-600`} />
      </button>
      <button
        type="button"
        title="Delete product"
        onClick={() => onDelete(product)}
        className={`${sz} rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors`}
      >
        <Trash2 className={`${icSz} text-red-500`} />
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ProductManagementBody() {
  const dispatch  = useDispatch();
  const vendorData = useSelector((state) => state.vendor?.vendor);
  const { vendorProducts = [], loading } = useSelector((state) => state.products);

  /* ── Organization ────────────────────────────────────────── */
  const [organizationId, setOrganizationId] = useState(null);
  useEffect(() => {
    const orgId =
      vendorData?.organization_id ||
      localStorage.getItem("vendor_organization_id");
    setOrganizationId(orgId || null);
  }, [vendorData]);

  useEffect(() => {
    if (organizationId) dispatch(fetchVendorProducts(organizationId));
  }, [dispatch, organizationId]);

  /* ── Filters ─────────────────────────────────────────────── */
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [status,   setStatus]   = useState("All Status");
  const [viewMode, setViewMode] = useState("grid");
  const [page,     setPage]     = useState(1);
  const pageSize = 8;

  const products = Array.isArray(vendorProducts) ? vendorProducts : [];

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p?.category || p?.categories?.[0]?.name).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch = !q || p?.name?.toLowerCase().includes(q) || p?.sku?.toLowerCase().includes(q);
      const matchCat    = category === "All" || p?.category === category || p?.categories?.[0]?.name === category;
      const matchStatus = status === "All Status" || p?.status === status;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, category, status]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage   = Math.min(Math.max(1, page), totalPages);
  const pagedItems = useMemo(
    () => filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredProducts, safePage]
  );

  const rangeText = useMemo(() => {
    if (!filteredProducts.length) return "Showing 0 of 0";
    const s = (safePage - 1) * pageSize + 1;
    const e = Math.min(filteredProducts.length, safePage * pageSize);
    return `Showing ${s}–${e} of ${filteredProducts.length}`;
  }, [safePage, filteredProducts.length]);

  const summary = useMemo(() => ({
    total:    products.length,
    active:   products.filter((p) => p.status === "active").length,
    pending:  products.filter((p) => p.status === "pending").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  }), [products]);

  /* ── Modal state ─────────────────────────────────────────── */
  const [openAdd,     setOpenAdd]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [deleteError,  setDeleteError]  = useState("");

  /* ── Handlers ────────────────────────────────────────────── */
  const refresh = useCallback(() => {
    if (organizationId) dispatch(fetchVendorProducts(organizationId));
  }, [dispatch, organizationId]);

  const handleAfterSubmit = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleView   = useCallback((p) => setViewProduct(p), []);
  const handleEdit   = useCallback((p) => { setViewProduct(null); setEditProduct(p); }, []);
  const handleDelete = useCallback((p) => { setViewProduct(null); setDeleteTarget(p); }, []);

  const handleConfirmDelete = useCallback(async (id) => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await dispatch(removeProduct(id));
      if (removeProduct.fulfilled.match(res)) {
        setDeleteTarget(null);
        refresh();
      } else {
        setDeleteError(res.payload?.message || "Failed to delete");
      }
    } catch {
      setDeleteError("Unexpected error");
    } finally {
      setDeleting(false);
    }
  }, [dispatch, refresh]);

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 sm:p-6 lg:p-8">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
            Product Catalog
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {summary.total} products listed · {filteredProducts.length} shown
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            title="Refresh"
            className="h-10 w-10 rounded-xl border border-[#E5E5E5] bg-white hover:bg-slate-50 flex items-center justify-center transition-colors"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="h-10 rounded-xl bg-[#0B1F3A] text-white px-5 text-sm font-extrabold hover:opacity-90 inline-flex items-center gap-2 shadow-sm transition-opacity"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* ── Summary cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard label="Total Products" value={summary.total}    color="text-[#0B1F3A]" />
        <SummaryCard label="Active"          value={summary.active}   color="text-green-600" />
        <SummaryCard label="Pending Review"  value={summary.pending}  color="text-yellow-500" />
        <SummaryCard label="Rejected"        value={summary.rejected} color="text-red-500" />
      </div>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or SKU…"
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-[#E5E5E5] rounded-xl text-sm outline-none focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 transition-all"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="h-10 pl-9 pr-4 bg-slate-50 border border-[#E5E5E5] rounded-xl text-sm outline-none focus:border-[#0B1F3A] transition-all appearance-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-10 px-4 bg-slate-50 border border-[#E5E5E5] rounded-xl text-sm outline-none focus:border-[#0B1F3A] transition-all appearance-none cursor-pointer"
        >
          {["All Status", "active", "pending", "rejected", "inactive"].map((s) => (
            <option key={s} value={s}>{s === "All Status" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex items-center rounded-xl border border-[#E5E5E5] bg-slate-50 p-1 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-[#0B1F3A] text-white" : "text-gray-500 hover:bg-white"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-[#0B1F3A] text-white" : "text-gray-500 hover:bg-white"}`}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {loading ? (
        <GridSkeleton />
      ) : pagedItems.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-[#E5E5E5]">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-[15px] font-bold text-[#0B1F3A]">No products found</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            {products.length === 0
              ? "Add your first product to get started."
              : "Try adjusting your search or filters."}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => setOpenAdd(true)}
              className="mt-5 h-10 rounded-xl bg-[#0B1F3A] text-white text-sm font-bold px-5 hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus size={15} />
              Add First Product
            </button>
          )}
        </div>

      ) : viewMode === "grid" ? (
        /* ── GRID VIEW ──────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pagedItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-gray-50">
                <img
                  src={getPrimaryImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Status badge */}
                <span className={`absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusPill(product.status)}`}>
                  {product.status}
                </span>
                {/* Quick actions overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButtons
                    product={product}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    mini
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-[11px] text-gray-400 font-mono">{product.sku}</p>
                <h3 className="mt-1 text-[13px] font-extrabold text-[#0B1F3A] line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                {/* Category chip */}
                <span className="inline-flex mt-2 items-center text-[10px] bg-[#FFF8EC] text-amber-700 px-2.5 py-1 rounded-full border border-amber-200 font-medium">
                  {product?.categories?.[0]?.name || product.category || "—"}
                </span>

                {/* Price */}
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-lg font-extrabold text-[#0B1F3A]">
                    ₹{fmt(product.price)}
                  </span>
                  {product.mrp && Number(product.mrp) > Number(product.price) && (
                    <span className="text-xs text-gray-400 line-through mb-0.5">
                      ₹{fmt(product.mrp)}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { label: "MOQ",   value: fmt(product.moq) },
                    { label: "Stock", value: fmt(product.stock) },
                    { label: "Sold",  value: fmt(product.sales_count) },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-slate-50 border border-[#E5E5E5] py-2">
                      <p className="text-[12px] font-extrabold text-[#0B1F3A]">{value}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Action row */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleView(product)}
                    className="flex-1 h-9 rounded-xl border border-[#E5E5E5] bg-slate-50 text-[12px] font-semibold text-gray-600 hover:bg-slate-100 inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye size={13} />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="flex-1 h-9 rounded-xl bg-[#0B1F3A] text-white text-[12px] font-semibold hover:opacity-90 inline-flex items-center justify-center gap-1.5 transition-opacity"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="h-9 w-9 shrink-0 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (
        /* ── LIST VIEW ──────────────────────────────────────── */
        <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[56px_2fr_1fr_100px_80px_80px_auto] gap-3 px-5 py-3 border-b border-[#E5E5E5] bg-slate-50 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            <div></div>
            <div>Product</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {pagedItems.map((p, idx) => (
            <div
              key={p.id}
              className={`grid grid-cols-[56px_2fr_1fr_100px_80px_80px_auto] gap-3 px-5 py-3.5 items-center hover:bg-slate-50 transition-colors ${idx < pagedItems.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}
            >
              {/* Image */}
              <img
                src={getPrimaryImage(p)}
                alt={p.name}
                className="h-11 w-11 rounded-xl object-cover bg-gray-100 shrink-0"
              />

              {/* Name + SKU */}
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-[#0B1F3A] truncate">{p.name}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{p.sku}</p>
              </div>

              {/* Category */}
              <span className="text-[12px] text-gray-500 truncate">
                {p?.categories?.[0]?.name || p.category || "—"}
              </span>

              {/* Price */}
              <div>
                <span className="text-[13px] font-extrabold text-[#0B1F3A]">₹{fmt(p.price)}</span>
                {p.mrp && Number(p.mrp) > Number(p.price) && (
                  <span className="ml-1 text-[11px] text-gray-400 line-through">₹{fmt(p.mrp)}</span>
                )}
              </div>

              {/* Stock */}
              <span className="text-[13px] text-gray-600">
                {fmt(p.stock)}
                {Number(p.stock) <= 10 && (
                  <AlertCircle className="inline ml-1 h-3.5 w-3.5 text-red-400" title="Low stock" />
                )}
              </span>

              {/* Status */}
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${statusPill(p.status)}`}>
                {p.status}
              </span>

              {/* Actions */}
              <ActionButtons
                product={p}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────── */}
      {pagedItems.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-400">
          <span>{rangeText}</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="h-9 w-9 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (safePage <= 4) p = i + 1;
              else if (safePage >= totalPages - 3) p = totalPages - 6 + i;
              else p = safePage - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-xl text-[13px] font-bold border transition-colors ${
                    p === safePage
                      ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                      : "bg-white text-[#0B1F3A] border-[#E5E5E5] hover:bg-slate-50"
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
              className="h-9 w-9 rounded-xl border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Add Product Modal ────────────────────────────────── */}
      <AddNewProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAfterSubmit}
      />

      {/* ── Edit Product Modal ───────────────────────────────── */}
      <AddNewProductModal
        open={!!editProduct}
        initialProduct={editProduct}
        onClose={() => setEditProduct(null)}
        onSubmit={handleAfterSubmit}
      />

      {/* ── View Detail Modal ────────────────────────────────── */}
      {viewProduct && (
        <ProductDetailModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ── Delete Confirmation Modal ────────────────────────── */}
      {deleteTarget && (
        <DeleteProductModal
          product={deleteTarget}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onClose={() => { setDeleteTarget(null); setDeleteError(""); }}
        />
      )}

      {/* ── Delete error toast ──────────────────────────────── */}
      {deleteError && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 bg-red-600 text-white text-sm rounded-2xl px-5 py-3 shadow-xl">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {deleteError}
          <button onClick={() => setDeleteError("")} className="ml-2 text-white/70 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
}
