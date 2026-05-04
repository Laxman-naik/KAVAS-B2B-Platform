"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, PauseCircle, Warehouse, X } from "lucide-react";

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: "Delhi Warehouse",
      address: "Plot 42, Industrial Area Phase II",
      city: "Delhi, Delhi — 110020",
      contact: "Rahul Sharma · +91 98765 43210",
      isDefault: true,
    },
    {
      id: 2,
      name: "Mumbai Warehouse",
      address: "B-201, MIDC Zone 3",
      city: "Mumbai, Maharashtra — 400063",
      contact: "Priya Patel · +91 87654 32109",
      isDefault: false,
    },
    {
      id: 3,
      name: "Jaipur Warehouse",
      address: "12, Sanganer Industrial Area",
      city: "Jaipur, Rajasthan — 302029",
      contact: "Vikram Singh · +91 76543 21098",
      isDefault: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    person: "",
    phone: "",
  });

  const handleAdd = () => {
    const newWarehouse = {
      id: Date.now(),
      name: form.name,
      address: form.address,
      city: `${form.city}, ${form.state} — ${form.pin}`,
      contact: `${form.person} · ${form.phone}`,
      isDefault: warehouses.length === 0,
    };
    setWarehouses([newWarehouse, ...warehouses]);
    setShowModal(false);
  };

  const setDefault = (id) => {
    setWarehouses(
      warehouses.map((w) => ({ ...w, isDefault: w.id === id }))
    );
  };

  return (
    <div className="p-4 md:p-6 bg-white mt-4 rounded-sm min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#1A1A1A]">
            Warehouse Management
          </h1>
          <p className="text-[#6B7280] text-sm">
            Manage your storage and dispatch locations
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1F2937] text-white px-4 py-2 rounded-xl hover:bg-[#111827] transition"
        >
          <Plus size={16} /> Add Warehouse
        </button>
      </div>

      <div className="space-y-4">
        {warehouses.map((w) => (
          <div
            key={w.id}
            className={`flex justify-between items-start p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
              w.isDefault ? "border-[#1F2937] bg-white" : "bg-[#F9FAFB]"
            }`}
          >
            <div className="flex gap-4">
              <div
                className={`p-3 rounded-xl ${
                  w.isDefault ? "bg-[#1F2937]" : "bg-[#E5E7EB]"
                }`}
              >
                <Warehouse
                  className={`$${
                    w.isDefault ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-[#1A1A1A]">
                    {w.name}
                  </h2>
                  {w.isDefault && (
                    <span className="text-xs bg-[#1F2937] text-white px-2 py-1 rounded-full">
                      DEFAULT
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#4B5563]">{w.address}</p>
                <p className="text-sm text-[#6B7280]">{w.city}</p>
                <p className="text-sm text-[#6B7280]">
                  Contact: {w.contact}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#6B7280]">
              {!w.isDefault && (
                <button
                  onClick={() => setDefault(w.id)}
                  className="text-sm hover:text-black"
                >
                  Set Default
                </button>
              )}
              <Pencil size={18} className="cursor-pointer hover:text-black" />
              <PauseCircle
                size={18}
                className="cursor-pointer hover:text-black"
              />
              <Trash2 size={18} className="cursor-pointer hover:text-red-500" />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl animate-scaleIn">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Add Warehouse</h2>
              <X
                className="cursor-pointer text-gray-500"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">
                  Warehouse Name
                </label>
                <input
                  placeholder="e.g., Delhi Warehouse"
                  className="w-full mt-1 border rounded-lg p-2"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Address</label>
                <input
                  placeholder="Street address"
                  className="w-full mt-1 border rounded-lg p-2"
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input
                    className="w-full mt-1 border rounded-lg p-2"
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">State</label>
                  <select
                    className="w-full mt-1 border rounded-lg p-2"
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                  >
                    <option>Select</option>
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                    <option>Rajasthan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">PIN Code</label>
                <input
                  className="w-full mt-1 border rounded-lg p-2"
                  onChange={(e) =>
                    setForm({ ...form, pin: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Contact Person
                  </label>
                  <input
                    className="w-full mt-1 border rounded-lg p-2"
                    onChange={(e) =>
                      setForm({ ...form, person: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Contact Phone
                  </label>
                  <input
                    className="w-full mt-1 border rounded-lg p-2"
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-[#9CA3AF] text-white px-4 py-2 rounded-lg hover:bg-[#6B7280]"
              >
                Add Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
