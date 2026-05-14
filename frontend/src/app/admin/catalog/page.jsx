"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlice";
import { Eye, Edit } from "lucide-react";
import Eyeview from "../eyeview/page";
import EditProductModal from "../editmodal/page";

const ITEMS_PER_PAGE = 10;

export default function ProductCatalog() {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const [openView, setOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedProduct(null);
  };
  const [openEdit, setOpenEdit] = useState(false);
const [editProduct, setEditProduct] = useState(null);

const handleOpenEdit = (product) => {
  setEditProduct(product);
  setOpenEdit(true);
};

const handleCloseEdit = () => {
  setOpenEdit(false);
  setEditProduct(null);
};

const handleUpdateProduct = (updatedProduct) => {
  console.log("updated product", updatedProduct);
};

  return (
    <div className="p-6 bg-[#0b1220] min-h-screen text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>
      </div>

      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              {[
                "Image",
                "Name",
                "Price",
                "MRP",
                "MOQ",
                "Stock",
                "Dispatch time",
                "units",
                "sales count",
                "views count",
                "Rating",
                "Status",
                "Action",
              ].map((h) => (
                <th key={h} className="p-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-800 hover:bg-[#111827]"
              >
                <td className="p-3">
                  <img
                    src={
                      p.images?.find((img) => img.is_primary)?.image_url ||
                      p.images?.[0]?.image_url ||
                      "/placeholder.png"
                    }
                    alt={p.name || "product"}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>

                <td className="p-3 font-medium">{p.name}</td>

                <td className="p-3 text-orange-400">
                  ₹{Number(p.price || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-3 text-gray-400">
                  ₹{Number(p.mrp || 0).toLocaleString("en-IN")}
                </td>

                <td className="p-3">{p.moq}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.dispatch_time_days} days</td>
                <td className="p-3">{p.weight} kg</td>
                <td className="p-3">{p.sales_count}</td>
                <td className="p-3">{p.views_count}</td>
                <td className="p-3">{p.avg_rating}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "approved"
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
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      title="View"
                      onClick={() => handleOpenView(p)}
                    >
                      <Eye size={18} />
                    </button>

                   <button
  className="text-yellow-400 hover:text-yellow-300"
  title="Edit"
  onClick={() => handleOpenEdit(p)}
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
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Eyeview
        product={selectedProduct}
        open={openView}
        onClose={handleCloseView}
      />
      <EditProductModal
  open={openEdit}
  product={editProduct}
  onClose={handleCloseEdit}
  onUpdate={handleUpdateProduct}
/>
    </div>
  );
}