"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlice";
import { Eye, Edit } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function ProductCatalog() {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-[#0b1220] min-h-screen text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>
      </div>
      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {["Image", "Name", "Price", "MRP", "MOQ", "Stock", "Dispatch time", "units", "sales count", "views count", "Rating", "Status", "Action"].map((h) => (
                <th key={h} className="p-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="border-t border-gray-800 hover:bg-[#111827]">
                <td className="p-3"><img src={p.images?.find(img => img.is_primary)?.image_url || p.images?.[0]?.image_url || "/placeholder.png"} alt={p.name || "product"} className="w-12 h-12 object-cover rounded" /></td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-orange-400">₹{Number(p.price).toLocaleString("en-IN")}</td>
                <td className="p-3 text-gray-400">₹{Number(p.mrp).toLocaleString("en-IN")}</td>
                <td className="p-3">{p.moq}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.dispatch_time_days} days</td>
                <td className="p-3">{p.weight} kg</td>
                <td className="p-3">{p.sales_count}</td>
                <td className="p-3">{p.views_count}</td>
                <td className="p-3">{p.avg_rating}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${p.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : p.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : p.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">

                    {/* VIEW ICON */}
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      title="View"
                      onClick={() => console.log("view", p.id)}
                    >
                      <Eye size={18} />
                    </button>

                    {/* EDIT ICON */}
                    <button
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Edit"
                      onClick={() => console.log("edit", p.id)}
                    >
                      <Edit size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}