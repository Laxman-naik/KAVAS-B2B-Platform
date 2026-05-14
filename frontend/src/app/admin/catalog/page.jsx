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

  const { products = [], loading } = useSelector(
    (state) => state.products
  );

  const [catalogProducts, setCatalogProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [openView, setOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setCatalogProducts(products);
  }, [products]);

  const totalPages = Math.ceil(
    catalogProducts.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = catalogProducts.slice(
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

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditProduct(null);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setCatalogProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id
          ? {
              ...item,
              status: updatedProduct.status,
              rejection_reason:
                updatedProduct.rejection_reason,
            }
          : item
      )
    );

    setOpenEdit(false);
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] p-6 text-white">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold">
          Product Catalog
        </h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
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
                "Dispatch Time",
                "Units",
                "Sales",
                "Views",
                "Rating",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-left"
                >
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
                      p.images?.find(
                        (img) => img.is_primary
                      )?.image_url ||
                      p.images?.[0]?.image_url ||
                      "/placeholder.png"
                    }
                    alt={p.name || "product"}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>

                <td className="p-3 font-medium">
                  {p.name}
                </td>

                <td className="p-3 text-orange-400">
                  ₹
                  {Number(
                    p.price || 0
                  ).toLocaleString("en-IN")}
                </td>

                <td className="p-3 text-gray-400">
                  ₹
                  {Number(
                    p.mrp || 0
                  ).toLocaleString("en-IN")}
                </td>

                <td className="p-3">{p.moq}</td>

                <td className="p-3">{p.stock}</td>

                <td className="p-3">
                  {p.dispatch_time_days} days
                </td>

                <td className="p-3">
                  {p.weight} kg
                </td>

                <td className="p-3">
                  {p.sales_count}
                </td>

                <td className="p-3">
                  {p.views_count}
                </td>

                <td className="p-3">
                  {p.avg_rating}
                </td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
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

                  {p.status === "rejected" &&
                    p.rejection_reason && (
                      <p className="mt-1 max-w-[180px] text-xs text-red-300">
                        {p.rejection_reason}
                      </p>
                    )}
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      title="View"
                      onClick={() =>
                        handleOpenView(p)
                      }
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Update Status"
                      onClick={() =>
                        handleOpenEdit(p)
                      }
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading &&
              paginatedProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={13}
                    className="p-6 text-center text-gray-400"
                  >
                    No products found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() =>
            setCurrentPage((p) => p - 1)
          }
          disabled={currentPage === 1}
          className="rounded bg-gray-700 px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {currentPage}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) => p + 1)
          }
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          className="rounded bg-gray-700 px-3 py-1 disabled:opacity-50"
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