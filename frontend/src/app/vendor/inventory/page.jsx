"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
  Download,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Pencil,
  RotateCcw,
  X,
} from "lucide-react";

export default function InventoryManagementBody() {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Rajasthani Block Print Fabric 5m",
      sku: "RBF-5M-007",
      category: "Textiles & Fabrics",
      image:
        "https://images.unsplash.com/photo-1520975958225-7d8a2f2d9f52",
      stock: 0,
      capacity: 300,
      reorderAt: 40,
      sold: "290 Rolls",
      incoming: "+150 Rolls",
      warehouse: "Jaipur Warehouse",
    },
    {
      id: 2,
      name: "Moringa Leaf Powder 500g",
      sku: "MLP-500-010",
      category: "Health & Wellness",
      image:
        "https://images.unsplash.com/photo-1604335399105-0f0a1f6f57d8",
      stock: 0,
      capacity: 300,
      reorderAt: 40,
      sold: "340 Units",
      incoming: "+200 Units",
      warehouse: "Chennai Warehouse",
    },
    {
      id: 3,
      name: "Herbal Tea Assorted Pack 100 Bags",
      sku: "HTA-100-006",
      category: "Beverages",
      image:
        "https://images.unsplash.com/photo-1542444459-db47a0ea7770",
      stock: 8,
      capacity: 200,
      reorderAt: 30,
      sold: "380 Packs",
      incoming: "+100 Packs",
      warehouse: "Delhi Warehouse",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");
  const [warehouse, setWarehouse] =
    useState("All Warehouses");
  const [page, setPage] = useState(1);

  // EDIT MODAL
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // VIEW MODAL
  const [openView, setOpenView] = useState(false);
  const [viewProduct, setViewProduct] =
    useState(null);

  const pageSize = 10;

  const getStatus = (d) => {
    if (Number(d.stock || 0) <= 0)
      return "Out of Stock";

    if (
      Number(d.stock || 0) <=
      Number(d.reorderAt || 0)
    )
      return "Low Stock";

    if (
      Number(d.stock || 0) >=
      Number(d.capacity || 0) * 0.8
    )
      return "Overstocked";

    return "In Stock";
  };

  const warehouses = useMemo(
    () => [
      "All Warehouses",
      ...new Set(data.map((d) => d.warehouse)),
    ],
    [data]
  );

  const filtered = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();

    return data.filter((d) => {
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.sku.toLowerCase().includes(q);

      const s = getStatus(d);

      const matchStatus =
        statusFilter === "All Status" ||
        s === statusFilter;

      const matchWarehouse =
        warehouse === "All Warehouses" ||
        d.warehouse === warehouse;

      return (
        matchSearch &&
        matchStatus &&
        matchWarehouse
      );
    });
  }, [data, search, statusFilter, warehouse]);

  const totalFiltered = filtered.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / pageSize)
  );

  const safePage = Math.min(
    Math.max(1, page),
    totalPages
  );

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return filtered.slice(
      start,
      start + pageSize
    );
  }, [filtered, safePage]);

  const rangeText = useMemo(() => {
    if (totalFiltered === 0)
      return "Showing 0 of 0";

    const start =
      (safePage - 1) * pageSize + 1;

    const end = Math.min(
      totalFiltered,
      safePage * pageSize
    );

    return `Showing ${start}-${end} of ${totalFiltered}`;
  }, [safePage, totalFiltered]);

  const kpis = useMemo(() => {
    const total = data.length;

    const inStock = data.filter(
      (d) => getStatus(d) === "In Stock"
    ).length;

    const lowStock = data.filter(
      (d) => getStatus(d) === "Low Stock"
    ).length;

    const outOfStock = data.filter(
      (d) => getStatus(d) === "Out of Stock"
    ).length;

    const overstocked = data.filter(
      (d) => getStatus(d) === "Overstocked"
    ).length;

    return {
      total,
      inStock,
      lowStock,
      outOfStock,
      overstocked,
    };
  }, [data]);

  const lowStockAlerts = useMemo(() => {
    return data
      .map((d) => ({
        ...d,
        status: getStatus(d),
      }))
      .filter(
        (d) =>
          d.status === "Low Stock" ||
          d.status === "Out of Stock"
      )
      .slice(0, 5);
  }, [data]);

  const statusStyle = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700";

      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";

      case "Out of Stock":
        return "bg-red-100 text-red-700";

      case "Overstocked":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100";
    }
  };

  // EDIT OPEN
  const handleEditClick = (product) => {
    setSelectedProduct({ ...product });
    setOpenEdit(true);
  };

  // VIEW OPEN
  const handleViewClick = (product) => {
    setViewProduct(product);
    setOpenView(true);
  };

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedProduct((prev) => ({
      ...prev,
      [name]:
        name === "stock" ||
        name === "capacity" ||
        name === "reorderAt"
          ? Number(value)
          : value,
    }));
  };

  // SAVE
  const handleSave = () => {
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedProduct.id
          ? selectedProduct
          : item
      )
    );

    setOpenEdit(false);
  };

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
            Inventory Management
          </div>

          <div className="mt-1 text-sm text-gray-500">
            {kpis.total} SKUs · {totalFiltered} shown
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC] inline-flex items-center gap-2">
            <Download size={16} />
            Export
          </button>

          <button className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC] inline-flex items-center gap-2">
            <BarChart3 size={16} />
            Reports
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={
            <Package
              size={18}
              className="text-[#0B1F3A]"
            />
          }
          title="Total SKUs"
          value={kpis.total}
          bg="bg-white"
        />

        <KpiCard
          icon={
            <CheckCircle2
              size={18}
              className="text-green-700"
            />
          }
          title="In Stock"
          value={kpis.inStock}
          bg="bg-[#ECFFF6]"
        />

        <KpiCard
          icon={
            <AlertTriangle
              size={18}
              className="text-yellow-700"
            />
          }
          title="Low Stock"
          value={kpis.lowStock}
          bg="bg-[#FFF7E6]"
        />

        <KpiCard
          icon={
            <XCircle
              size={18}
              className="text-red-700"
            />
          }
          title="Out of Stock"
          value={kpis.outOfStock}
          bg="bg-[#FFECEC]"
        />
      </div>

      {/* LOW STOCK */}
      <div className="mt-5 rounded-2xl border border-red-200 bg-[#FFF5F5] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-sm font-extrabold text-red-700">
              Low Stock Alerts (
              {lowStockAlerts.length})
            </div>

            <div className="mt-1 text-xs text-red-600">
              Items below reorder point need
              immediate attention
            </div>
          </div>

          <button className="h-9 w-9 rounded-xl border border-red-200 bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center">
            <RotateCcw
              size={16}
              className="text-red-700"
            />
          </button>
        </div>

        <div className="bg-white">
          {lowStockAlerts.map((d) => {
            const s = getStatus(d);

            return (
              <div
                key={d.id}
                className="flex items-center justify-between gap-4 px-5 py-4 border-t border-[#F3F4F6]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={d.image}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover bg-gray-100"
                  />

                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-[#0B1F3A]">
                      {d.name}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {d.sku}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH */}
      <div className="mt-5 flex flex-col lg:flex-row gap-3">
        <div className="flex items-center bg-white border border-[#E5E5E5] rounded-xl px-3 h-11 w-full lg:w-105">
          <Search
            size={16}
            className="text-gray-400"
          />

          <input
            placeholder="Search by name or SKU..."
            className="w-full px-2 text-sm outline-none bg-transparent"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-4 overflow-x-auto bg-white rounded-2xl border border-[#E5E5E5]">
        <table className="w-full min-w-275 text-sm">
          <thead className="bg-[#FFF8EC]">
            <tr>
              <th className="p-4 text-left">
                PRODUCT
              </th>

              <th className="p-4 text-left">
                SKU
              </th>

              <th className="p-4 text-left">
                STOCK LEVEL
              </th>

              <th className="p-4 text-left">
                STATUS
              </th>

              <th className="p-4 text-left">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {paged.map((d) => {
              const s = getStatus(d);

              return (
                <tr
                  key={d.id}
                  className="border-t border-[#E5E5E5] hover:bg-[#FFF8EC] transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={d.image}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover bg-gray-100"
                      />

                      <div>
                        <div className="text-sm font-extrabold text-[#0B1F3A]">
                          {d.name}
                        </div>

                        <div className="text-xs text-gray-500">
                          {d.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-extrabold text-[#0B1F3A]">
                    {d.sku}
                  </td>

                  <td className="p-4">
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {d.stock} / {d.capacity}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${statusStyle(
                        s
                      )}`}
                    >
                      {s}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {/* EDIT */}
                      <button
                        onClick={() =>
                          handleEditClick(d)
                        }
                        className="h-9 w-9 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                      >
                        <Pencil
                          size={16}
                          className="text-gray-600"
                        />
                      </button>

                      {/* VIEW */}
                      <button
                        onClick={() =>
                          handleViewClick(d)
                        }
                        className="h-9 w-9 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                      >
                        <Eye
                          size={16}
                          className="text-gray-600"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
        <div>{rangeText}</div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() =>
              setPage((p) =>
                Math.max(1, p - 1)
              )
            }
            disabled={safePage <= 1}
            className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={safePage >= totalPages}
            className="h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {openEdit && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
              <h2 className="text-xl font-extrabold text-[#0B1F3A]">
                Edit Product
              </h2>

              <button
                onClick={() =>
                  setOpenEdit(false)
                }
                className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Product Name"
                name="name"
                value={selectedProduct.name}
                onChange={handleInputChange}
              />

              <InputField
                label="SKU"
                name="sku"
                value={selectedProduct.sku}
                onChange={handleInputChange}
              />

              <InputField
                label="Category"
                name="category"
                value={selectedProduct.category}
                onChange={handleInputChange}
              />

              <InputField
                label="Warehouse"
                name="warehouse"
                value={selectedProduct.warehouse}
                onChange={handleInputChange}
              />

              <InputField
                label="Stock"
                name="stock"
                type="number"
                value={selectedProduct.stock}
                onChange={handleInputChange}
              />

              <InputField
                label="Capacity"
                name="capacity"
                type="number"
                value={selectedProduct.capacity}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
              <button
                onClick={() =>
                  setOpenEdit(false)
                }
                className="h-11 px-5 rounded-xl border border-[#E5E5E5]"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="h-11 px-6 rounded-xl bg-[#0B1F3A] text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {openView && viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-5">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0B1F3A]">
                  Product Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Complete inventory information
                </p>
              </div>

              <button
                onClick={() =>
                  setOpenView(false)
                }
                className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-70">
                  <img
                    src={viewProduct.image}
                    alt={viewProduct.name}
                    className="w-full h-65 rounded-2xl object-cover border border-[#E5E5E5]"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-extrabold text-[#0B1F3A]">
                        {viewProduct.name}
                      </h3>

                      <p className="mt-1 text-gray-500">
                        {viewProduct.category}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold ${statusStyle(
                        getStatus(viewProduct)
                      )}`}
                    >
                      {getStatus(viewProduct)}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailCard
                      title="SKU"
                      value={viewProduct.sku}
                    />

                    <DetailCard
                      title="Warehouse"
                      value={
                        viewProduct.warehouse
                      }
                    />

                    <DetailCard
                      title="Current Stock"
                      value={`${viewProduct.stock} Units`}
                    />

                    <DetailCard
                      title="Capacity"
                      value={`${viewProduct.capacity} Units`}
                    />

                    <DetailCard
                      title="Reorder At"
                      value={`${viewProduct.reorderAt} Units`}
                    />

                    <DetailCard
                      title="Incoming"
                      value={
                        viewProduct.incoming
                      }
                    />

                    <DetailCard
                      title="Sold"
                      value={viewProduct.sold}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
              <button
                onClick={() =>
                  setOpenView(false)
                }
                className="h-11 px-5 rounded-xl border border-[#E5E5E5]"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(
                    viewProduct
                  );
                  setOpenView(false);
                  setOpenEdit(true);
                }}
                className="h-11 px-6 rounded-xl bg-[#0B1F3A] text-white font-bold"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  title,
  value,
  bg,
}) {
  return (
    <div
      className={`rounded-2xl border border-[#E5E5E5] ${bg} p-5`}
    >
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
          {icon}
        </div>

        <div className="text-lg font-extrabold text-[#0B1F3A]">
          {value}
        </div>
      </div>

      <div className="mt-3 text-sm font-semibold text-gray-600">
        {title}
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#0B1F3A] mb-2 block">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-[#E5E5E5] px-4 outline-none focus:border-[#0B1F3A]"
      />
    </div>
  );
}

function DetailCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFF8EC] p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {title}
      </div>

      <div className="mt-2 text-sm font-extrabold text-[#0B1F3A] -wrap-break-words">
        {value}
      </div>
    </div>
  );
}