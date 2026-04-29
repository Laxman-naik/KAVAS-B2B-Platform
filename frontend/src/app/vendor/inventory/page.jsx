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
} from "lucide-react";

export default function InventoryManagementBody() {
  const data = [
    {
      id: 1,
      name: "Rajasthani Block Print Fabric 5m",
      sku: "RBF-5M-007",
      category: "Textiles & Fabrics",
      image: "https://images.unsplash.com/photo-1520975958225-7d8a2f2d9f52",
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
      image: "https://images.unsplash.com/photo-1604335399105-0f0a1f6f57d8",
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
      image: "https://images.unsplash.com/photo-1542444459-db47a0ea7770",
      stock: 8,
      capacity: 200,
      reorderAt: 30,
      sold: "380 Packs",
      incoming: "+100 Packs",
      warehouse: "Delhi Warehouse",
    },
    {
      id: 4,
      name: "Brass Pooja Thali Set",
      sku: "BPT-SET-009",
      category: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2",
      stock: 62,
      capacity: 200,
      reorderAt: 30,
      sold: "185 Sets",
      incoming: "—",
      warehouse: "Moradabad Warehouse",
    },
    {
      id: 5,
      name: "Organic Basmati Rice 25kg",
      sku: "OBR-25K-004",
      category: "Organic Food",
      image: "https://images.unsplash.com/photo-1604335399105-0f0a1f6f57d8",
      stock: 95,
      capacity: 500,
      reorderAt: 120,
      sold: "520 Sacks",
      incoming: "+300 Sacks",
      warehouse: "Delhi Warehouse",
    },
    {
      id: 6,
      name: "Cashew Nuts W240 Grade 1kg",
      sku: "CNW-1K-008",
      category: "Dry Fruits & Nuts",
      image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0",
      stock: 145,
      capacity: 400,
      reorderAt: 50,
      sold: "620 Units",
      incoming: "—",
      warehouse: "Mumbai Warehouse",
    },
    {
      id: 7,
      name: "Handmade Terracotta Pots Set",
      sku: "HTP-SET-012",
      category: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      stock: 15,
      capacity: 100,
      reorderAt: 25,
      sold: "90 Sets",
      incoming: "—",
      warehouse: "Pune Warehouse",
    },
    {
      id: 8,
      name: "Industrial Grade Bearings",
      sku: "BRG-001",
      category: "Industrial Hardware",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
      stock: 420,
      capacity: 600,
      reorderAt: 120,
      sold: "1,240 Units",
      incoming: "+60 Units",
      warehouse: "Jaipur Warehouse",
    },
    {
      id: 9,
      name: "Stainless Steel Fasteners Set",
      sku: "FST-042",
      category: "Industrial Hardware",
      image: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c",
      stock: 510,
      capacity: 800,
      reorderAt: 150,
      sold: "2,860 Units",
      incoming: "—",
      warehouse: "Chennai Warehouse",
    },
    {
      id: 10,
      name: "HDPE Pipes 50mm Diameter",
      sku: "PIP-017",
      category: "Pipes & Fittings",
      image: "https://images.unsplash.com/photo-1581091012184-7e0cdfbb6791",
      stock: 980,
      capacity: 1000,
      reorderAt: 200,
      sold: "3,200 Units",
      incoming: "+120 Units",
      warehouse: "Delhi Warehouse",
    },
    {
      id: 11,
      name: "PVC Water Pipes",
      sku: "PVC-111",
      category: "Pipes & Fittings",
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
      stock: 860,
      capacity: 900,
      reorderAt: 180,
      sold: "1,800 Units",
      incoming: "+40 Units",
      warehouse: "Mumbai Warehouse",
    },
    {
      id: 12,
      name: "Industrial Lubricant Oil",
      sku: "LUB-333",
      category: "Chemicals",
      image: "https://images.unsplash.com/photo-1581091014534-8987c1b8c9b6",
      stock: 780,
      capacity: 800,
      reorderAt: 90,
      sold: "920 Units",
      incoming: "—",
      warehouse: "Pune Warehouse",
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [warehouse, setWarehouse] = useState("All Warehouses");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const getStatus = (d) => {
    if (Number(d.stock || 0) <= 0) return "Out of Stock";
    if (Number(d.stock || 0) <= Number(d.reorderAt || 0)) return "Low Stock";
    if (Number(d.stock || 0) >= Number(d.capacity || 0) * 0.8) return "Overstocked";
    return "In Stock";
  };

  const warehouses = useMemo(() => ["All Warehouses", ...new Set(data.map((d) => d.warehouse))], [data]);

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    return data.filter((d) => {
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.sku.toLowerCase().includes(q);
      const s = getStatus(d);
      const matchStatus = statusFilter === "All Status" || s === statusFilter;
      const matchWarehouse = warehouse === "All Warehouses" || d.warehouse === warehouse;
      return matchSearch && matchStatus && matchWarehouse;
    });
  }, [data, search, statusFilter, warehouse]);

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const rangeText = useMemo(() => {
    if (totalFiltered === 0) return "Showing 0 of 0";
    const start = (safePage - 1) * pageSize + 1;
    const end = Math.min(totalFiltered, safePage * pageSize);
    return `Showing ${start}-${end} of ${totalFiltered}`;
  }, [safePage, totalFiltered]);

  const kpis = useMemo(() => {
    const total = data.length;
    const inStock = data.filter((d) => getStatus(d) === "In Stock").length;
    const lowStock = data.filter((d) => getStatus(d) === "Low Stock").length;
    const outOfStock = data.filter((d) => getStatus(d) === "Out of Stock").length;
    const overstocked = data.filter((d) => getStatus(d) === "Overstocked").length;
    return { total, inStock, lowStock, outOfStock, overstocked };
  }, [data]);

  const lowStockAlerts = useMemo(() => {
    return data
      .map((d) => ({ ...d, status: getStatus(d) }))
      .filter((d) => d.status === "Low Stock" || d.status === "Out of Stock")
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

  return (
    <div className="bg-[#FFF8EC] min-h-screen p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">Inventory Management</div>
          <div className="mt-1 text-sm text-gray-500">{kpis.total} SKUs · {totalFiltered} shown</div>
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
            className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFF8EC] inline-flex items-center gap-2"
          >
            <BarChart3 size={16} />
            Reports
          </button>
        </div>
      </div>

      {/* STATS WITH ICONS */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={<Package size={18} className="text-[#0B1F3A]" />}
          title="Total SKUs"
          value={kpis.total}
          bg="bg-white"
        />
        <KpiCard
          icon={<CheckCircle2 size={18} className="text-green-700" />}
          title="In Stock"
          value={kpis.inStock}
          bg="bg-[#ECFFF6]"
        />
        <KpiCard
          icon={<AlertTriangle size={18} className="text-yellow-700" />}
          title="Low Stock"
          value={kpis.lowStock}
          bg="bg-[#FFF7E6]"
        />
        <KpiCard
          icon={<XCircle size={18} className="text-red-700" />}
          title="Out of Stock"
          value={kpis.outOfStock}
          bg="bg-[#FFECEC]"
        />
        <KpiCard
          icon={<Layers size={18} className="text-blue-700" />}
          title="Overstocked"
          value={kpis.overstocked}
          bg="bg-[#EAF3FF]"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-red-200 bg-[#FFF5F5] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-sm font-extrabold text-red-700">Low Stock Alerts ({lowStockAlerts.length})</div>
            <div className="mt-1 text-xs text-red-600">Items below reorder point need immediate attention</div>
          </div>

          <button
            type="button"
            className="h-9 w-9 rounded-xl border border-red-200 bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
            aria-label="Refresh"
          >
            <RotateCcw size={16} className="text-red-700" />
          </button>
        </div>

        <div className="bg-white">
          {lowStockAlerts.map((d) => {
            const s = getStatus(d);
            return (
              <div key={d.id} className="flex items-center justify-between gap-4 px-5 py-4 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={d.image} alt="" className="h-10 w-10 rounded-xl object-cover bg-gray-100" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-[#0B1F3A]">{d.name}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {d.sku}
                      <span className="mx-2 text-gray-300">•</span>
                      <span className={s === "Out of Stock" ? "text-red-700 font-bold" : "text-yellow-700 font-bold"}>
                        {s === "Out of Stock" ? "Out of Stock" : `${d.stock} left (reorder at ${d.reorderAt})`}
                      </span>
                      {d.incoming && d.incoming !== "—" ? (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-green-700 font-bold">{d.incoming} incoming</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button type="button" className="h-9 rounded-xl bg-red-600 text-white px-4 text-xs font-extrabold hover:opacity-95">
                  + Restock
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mt-5 flex flex-col lg:flex-row gap-3">
        <div className="flex items-center bg-white border border-[#E5E5E5] rounded-xl px-3 h-11 w-full lg:w-[420px]">
          <Search size={16} className="text-gray-400" />
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

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 w-full lg:w-[190px] rounded-xl border border-[#E5E5E5] bg-white px-3 text-sm outline-none"
        >
          {["All Status", "In Stock", "Low Stock", "Out of Stock", "Overstocked"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={warehouse}
          onChange={(e) => {
            setWarehouse(e.target.value);
            setPage(1);
          }}
          className="h-11 w-full lg:w-[220px] rounded-xl border border-[#E5E5E5] bg-white px-3 text-sm outline-none"
        >
          {warehouses.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="mt-4 overflow-x-auto bg-white rounded-2xl border border-[#E5E5E5]">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-[#FFF8EC]">
            <tr>
              <th className="p-4 text-left w-10">
                <input type="checkbox" className="h-4 w-4" />
              </th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">PRODUCT</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">SKU</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">STOCK LEVEL</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">STATUS</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">SOLD</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">INCOMING</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">WAREHOUSE</th>
              <th className="p-4 text-left text-xs font-extrabold text-gray-500">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {paged.map((d) => {
              const s = getStatus(d);
              const pct = d.capacity ? Math.min(100, Math.round((Number(d.stock || 0) / Number(d.capacity)) * 100)) : 0;
              return (
                <tr key={d.id} className="border-t border-[#E5E5E5] hover:bg-[#FFF8EC] transition">
                  <td className="p-4">
                    <input type="checkbox" className="h-4 w-4" />
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={d.image} alt="" className="h-10 w-10 rounded-xl object-cover bg-gray-100" />
                      <div>
                        <div className="text-sm font-extrabold text-[#0B1F3A]">{d.name}</div>
                        <div className="text-xs text-gray-500">{d.category}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-extrabold text-[#0B1F3A]">{d.sku}</td>

                  <td className="p-4">
                    <div className="text-sm font-extrabold text-[#0B1F3A]">
                      {Number(d.stock || 0)} / {Number(d.capacity || 0)}
                    </div>
                    <div className="mt-2 h-2 w-44 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s === "Out of Stock" ? "bg-red-500" : s === "Low Stock" ? "bg-yellow-500" : s === "Overstocked" ? "bg-blue-500" : "bg-green-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">Reorder at {d.reorderAt}</div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${statusStyle(s)}`}>
                      {s}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-[#0B1F3A] font-semibold">{d.sold}</td>
                  <td className="p-4 text-sm font-extrabold text-green-700">{d.incoming}</td>

                  <td className="p-4 text-sm text-gray-700">
                    <div className="font-semibold text-[#0B1F3A]">{d.warehouse.split(" ")[0]}</div>
                    <div className="text-xs text-gray-500">Warehouse</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-9 w-9 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                        aria-label="Edit"
                      >
                        <Pencil size={16} className="text-gray-600" />
                      </button>
                      <button
                        type="button"
                        className="h-9 w-9 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#FFF8EC] inline-flex items-center justify-center"
                        aria-label="View"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BULK UPLOAD */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
        <div>{rangeText}</div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className={`h-9 w-9 rounded-lg border border-[#E5E5E5] bg-white inline-flex items-center justify-center ${
              safePage <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-[#FFF8EC]"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
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
              safePage >= totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-[#FFF8EC]"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, title, value, bg }) {
  return (
    <div className={`rounded-2xl border border-[#E5E5E5] ${bg} p-5`}>
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">{icon}</div>
        <div className="text-lg font-extrabold text-[#0B1F3A]">{value}</div>
      </div>
      <div className="mt-3 text-sm font-semibold text-gray-600">{title}</div>
    </div>
  );
}