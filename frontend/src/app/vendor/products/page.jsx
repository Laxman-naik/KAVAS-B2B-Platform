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
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorProducts } from "../../../store/slices/productSlice";

export default function ProductManagementBody() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All Status");
  const [viewMode, setViewMode] = useState("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const vendorId = useSelector((state) => state.vendor.vendor?.vendor?.id);
  const { vendorProducts, loading } = useSelector((state) => state.products);
  console.log(vendorProducts);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorProducts(vendorId));
    }
  }, [vendorId, dispatch]);

  const products = Array.isArray(vendorProducts) ? vendorProducts : [];

  const filteredProducts = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();

    return products.filter((p) => {
      const productName = String(p?.name || "").toLowerCase();
      const productSku = String(p?.sku || "").toLowerCase();

      const productCategory =
        p?.category ||
        p?.categories?.[0]?.name ||
        "";

      const productStatus = p?.status || "";

      const matchSearch =
        !q || productName.includes(q) || productSku.includes(q);

      const matchCategory =
        category === "All" || productCategory === category;

      const matchStatus =
        status === "All Status" || productStatus === status;

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

  const categories = useMemo(() => {
    const list = products
      .map((p) => p?.category || p?.categories?.[0]?.name)
      .filter(Boolean);

    return ["All", ...new Set(list)];
  }, [products]);

  const statuses = useMemo(
    () => ["All Status", "active", "pending", "rejected", "inactive"],
    []
  );

  const enrichedProducts = useMemo(() => {
    return pagedFilteredProducts.map((p, index) => {
      const numericId = index + 1;
      const discount = numericId % 2 === 0 ? 25 : numericId % 3 === 0 ? 17 : 0;
      const price = Number(p?.price || 0);
      const oldPrice = discount ? Math.round(price / (1 - discount / 100)) : null;

      return {
        ...p,
        discount,
        oldPrice,
        sold: Number(p?.sales_count || 0),
        rating: Number(p?.avg_rating || 0),
        reviews: Number(p?.total_reviews || 0),
      };
    });
  }, [pagedFilteredProducts]);

  const summary = useMemo(() => {
    const active = products.filter((p) => p.status === "active").length;
    const pending = products.filter((p) => p.status === "pending").length;
    const rejected = products.filter((p) => p.status === "rejected").length;
    const inactive = products.filter((p) => p.status === "inactive").length;

    return {
      active,
      pending,
      rejected,
      inactive,
      total: products.length,
    };
  }, [products]);

  const statusPill = (s) => {
    if (s === "active") return "bg-green-100 text-green-700";
    if (s === "pending") return "bg-yellow-100 text-yellow-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    if (s === "inactive") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleCreateProduct = async (data) => {
    try {
      let localVendor = {};

      try {
        localVendor = JSON.parse(localStorage.getItem("vendor") || "{}");
      } catch {
        localVendor = {};
      }

      const finalOrganizationId =
        organizationId ||
        localVendor?.organization_id ||
        localVendor?.organizationId ||
        localVendor?.vendor?.organization_id ||
        localVendor?.vendor?.organizationId;

      const payload = {
        organizationId: finalOrganizationId,

        name: data?.name?.trim(),
        sku: data?.sku?.trim(),

        category: data?.category || null,
        subCategory: data?.subCategory || null,

        unit: data?.unit || "pcs",
        status: "active",
        description: data?.description || "",

        price: Number(data?.price || 0),
        mrp: Number(data?.mrp || 0),
        moq: Number(data?.moq || 1),
        stock: Number(data?.stock || 0),

        gst: data?.gst || "",
        brand: data?.brand || "",
        barcode: data?.barcode || "",

        weight: data?.productWeight || null,
        dispatchTimeDays: Number(data?.expectedDispatchTime || 0),

        images: Array.isArray(data?.images)
          ? data.images.filter((x) => typeof x === "string" && x.trim())
          : [],

        videos: Array.isArray(data?.videos)
          ? data.videos.filter((x) => typeof x === "string" && x.trim())
          : [],

        specifications: Array.isArray(data?.specifications)
          ? data.specifications
              .filter((s) => s?.name?.trim() && s?.value?.trim())
              .map((s) => ({
                name: s.name.trim(),
                value: s.value.trim(),
              }))
          : [],

        bulkPricing: Array.isArray(data?.bulkPricing)
          ? data.bulkPricing
              .filter((p) => p?.minQty && p?.pricePerUnit)
              .map((p) => ({
                minQty: Number(p.minQty),
                maxQty: p.maxQty ? Number(p.maxQty) : null,
                pricePerUnit: Number(p.pricePerUnit),
              }))
          : [],

        variants: Array.isArray(data?.variants)
          ? data.variants
              .filter((v) => v?.value?.trim())
              .map((v) => ({
                variant_type: v.variantName,
                variant_value: v.value,
                sku: v.sku || null,
                price: Number(v.price || data.price || 0),
                mrp: Number(v.mrp || data.mrp || 0),
                stock: Number(v.stock || 0),
                unit: data.unit || "pcs",
              }))
          : [],
      };

      if (!payload.organizationId) {
        alert("organizationId missing. Please check vendor login data.");
        return;
      }

      const res = await createProductAPI(payload);

      console.log("Product created:", res.data);

      if (vendorId) {
        dispatch(fetchVendorProducts(vendorId));
      }

      setPage(1);
      setOpenAdd(false);
    } catch (err) {
      console.error("Create product API error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Product create failed"
      );
    }
  };

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
            ><Plus size={16} />Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#EFFFF6] p-4">
            <div className="text-sm font-extrabold text-green-700">
              {summary.active}
            </div>
            <div className="mt-3 text-xs text-gray-600">Active Products</div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFF7E6] p-4">
            <div className="text-sm font-extrabold text-yellow-700">
              {summary.pending}
            </div>
            <div className="mt-3 text-xs text-gray-600">Pending Review</div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFECEC] p-4">
            <div className="text-sm font-extrabold text-red-700">
              {summary.rejected}
            </div>
            <div className="mt-3 text-xs text-gray-600">Rejected</div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
            <div className="text-sm font-extrabold text-gray-700">
              {summary.inactive}
            </div>
            <div className="mt-3 text-xs text-gray-600">Inactive</div>
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
                <option key={`category-${cat}`} value={cat}>
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

          <div className="flex items-center rounded-xl border border-[#E5E5E5] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`h-9 w-9 rounded-lg inline-flex items-center justify-center ${
                viewMode === "grid"
                  ? "bg-[#0B1F3A] text-white"
                  : "text-gray-600 hover:bg-[#FFF8EC]"
              }`}
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
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-sm text-gray-500">Loading products...</div>
      ) : viewMode === "list" ? (
        <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
          {enrichedProducts.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-[#E5E5E5] last:border-b-0"
            >
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <img
                  src={
                    p?.images?.find((img) => img.is_primary)?.image_url ||
                    p?.images?.[0]?.image_url ||
                    "/placeholder.png"
                  }
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
                ₹{Number(p.price || 0).toLocaleString("en-IN")}
              </div>

              <div className="col-span-2 text-sm text-gray-600">
                {Number(p.stock || 0).toLocaleString("en-IN")}
              </div>

              <div className="col-span-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusPill(
                    p.status
                  )}`}
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
              key={product.id || product.sku}
              className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative">
                <img
                  src={product?.images?.find((img) => img.is_primary)?.image_url ||
                    product?.images?.[0]?.image_url || "/placeholder.png"} alt={product?.name || "Product"} className="w-full h-44 object-cover bg-gray-100" />

                <span
                  className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${statusPill(
                    product.status
                  )}`}
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
                  {product?.categories?.[0]?.name || product.category || "No Category"}
                </span>

                <div className="mt-3 flex items-end gap-2">
                  <div className="text-lg font-extrabold text-[#0B1F3A]">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </div>
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
                      {Number(product.stock || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-gray-500">Stock</div>
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {Number(product.sold || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-gray-500">Sold</div>
                  </div>
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
            className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center"
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
            className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddNewProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
