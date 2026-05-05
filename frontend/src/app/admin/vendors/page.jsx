// "use client"
// import { useState } from "react";

// const vendorsData = [
//   {
//     name: "NovaParts Ltd",
//     category: "Electronics",
//     rating: 4.8,
//     orders: 340,
//     revenue: "₹420K",
//     status: "Approved",
//   },
//   {
//     name: "SteelWorks Co",
//     category: "Raw Materials",
//     rating: 4.5,
//     orders: 210,
//     revenue: "₹185K",
//     status: "Approved",
//   },
//   {
//     name: "ChemFirst Inc",
//     category: "Chemicals",
//     rating: 3.9,
//     orders: 88,
//     revenue: "₹76K",
//     status: "Pending KYC",
//   },
//   {
//     name: "TexLine Group",
//     category: "Textiles",
//     rating: 4.1,
//     orders: 157,
//     revenue: "₹98K",
//     status: "Approved",
//   },
//   {
//     name: "MachTech",
//     category: "Machinery",
//     rating: 2.8,
//     orders: 44,
//     revenue: "₹32K",
//     status: "Flagged",
//   },
//   {
//     name: "GreenSource",
//     category: "Organic",
//     rating: 4.7,
//     orders: 73,
//     revenue: "₹54K",
//     status: "Pending KYC",
//   },
// ];

// const statusStyles = {
//   Approved: "bg-green-500/20 text-green-400",
//   "Pending KYC": "bg-yellow-500/20 text-yellow-400",
//   Flagged: "bg-red-500/20 text-red-400",
// };

// export default function VendorsTable() {
//   const [search, setSearch] = useState("");

//   // 🔥 NEW STATES
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     contact: "",
//     email: "",
//     country: "",
//     phone: "",
//     commission: "",
//     kyc: "Yes",
//     message: "",
//   });

//   const [vendors, setVendors] = useState(vendorsData);

//   // 🔥 FILTER
//   const filtered = vendors.filter((v) =>
//     v.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // 🔥 SUBMIT FUNCTION
//   const handleSubmit = () => {
//     if (!form.name || !form.category) return;

//     const newVendor = {
//       name: form.name,
//       category: form.category,
//       rating: 0,
//       orders: 0,
//       revenue: "₹0",
//       status: "Pending KYC",
//     };

//     setVendors([newVendor, ...vendors]);
//     setShowModal(false);

//     setForm({
//       name: "",
//       category: "",
//       contact: "",
//       email: "",
//       country: "",
//       phone: "",
//       commission: "",
//       kyc: "Yes",
//       message: "",
//     });
//   };

//   return (
//     <div className="p-4 md:p-8 min-h-screen bg-[#0b1220] text-white">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <h1 className="text-2xl font-semibold">Vendors</h1>

//         <div className="flex gap-3">
//           <input
//             type="text"
//             placeholder="Search vendors..."
//             className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-200">
//             Export
//           </button>

//           {/* 🔥 UPDATED BUTTON */}
//           <button
//             onClick={() => setShowModal(true)}
//             className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition duration-200"
//           >
//             + Invite vendor
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-2xl border border-gray-800">
//         <table className="min-w-full text-sm">
//           <thead className="bg-[#111827] text-gray-400">
//             <tr>
//               {[
//                 "Vendor",
//                 "Category",
//                 "Rating",
//                 "Orders",
//                 "Revenue",
//                 "Status",
//               ].map((h) => (
//                 <th key={h} className="px-6 py-4 text-left font-medium ">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.map((v, i) => (
//               <tr
//                 key={i}
//                 className="border-t border-gray-800 hover:bg-[#0d1424] transition duration-200 bg-[#111827]"
//               >
//                 <td className="px-6 py-4 font-medium">{v.name}</td>
//                 <td className="px-6 py-4 text-gray-300">{v.category}</td>
//                 <td
//                   className={`px-6 py-4 font-medium flex items-center gap-1 ${
//                     v.rating < 3 ? "text-red-400" : "text-yellow-400"
//                   }`}
//                 >
//                   ★ {v.rating}
//                 </td>
//                 <td className="px-6 py-4">{v.orders}</td>
//                 <td className="px-6 py-4">{v.revenue}</td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs ${statusStyles[v.status]}`}
//                   >
//                     {v.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2">
//           <div className="w-full max-w-2xl bg-[#0F1E33] rounded-2xl p-6 text-white shadow-xl">

//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h2 className="text-lg font-semibold">Invite vendor</h2>
//                 <p className="text-xs text-gray-400">
//                   Send an onboarding invitation
//                 </p>
//               </div>
//               <button onClick={() => setShowModal(false)}>✕</button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

//               <input
//                 placeholder="Business name"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />

//               <input
//                 placeholder="Category"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.category}
//                 onChange={(e) => setForm({ ...form, category: e.target.value })}
//               />

//               <input
//                 placeholder="Contact name"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.contact}
//                 onChange={(e) => setForm({ ...form, contact: e.target.value })}
//               />

//               <input
//                 placeholder="Email"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//               />

//               <input
//                 placeholder="Country"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.country}
//                 onChange={(e) => setForm({ ...form, country: e.target.value })}
//               />

//               <input
//                 placeholder="Phone"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.phone}
//                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
//               />

//               <input
//                 placeholder="Commission %"
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.commission}
//                 onChange={(e) =>
//                   setForm({ ...form, commission: e.target.value })
//                 }
//               />

//               <select
//                 className="p-2 rounded bg-[#13263C]"
//                 value={form.kyc}
//                 onChange={(e) => setForm({ ...form, kyc: e.target.value })}
//               >
//                 <option>Yes</option>
//                 <option>No</option>
//               </select>
//             </div>

//             <textarea
//               placeholder="Invitation message"
//               className="w-full mt-3 p-2 rounded bg-[#13263C]"
//               value={form.message}
//               onChange={(e) => setForm({ ...form, message: e.target.value })}
//             />

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-600 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600"
//               >
//                 Send invitation
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://kavas-b2b-platform-3.onrender.com";

export default function OnboardingAdminPage() {
  const [vendors, setVendors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // fetch list
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/onboarding-vendors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      setVendors(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // approve
  const approveVendor = async (id) => {
    try {
      setLoading(true);

      await axios.post(
        `${API}/api/admin/approve-vendor`,
        { onboarding_id: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      alert("Vendor Approved");
      fetchData();
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // reject
  const rejectVendor = async (id) => {
    if (!rejectReason) {
      alert("Enter rejection reason");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API}/api/admin/reject-vendor`,
        {
          onboarding_id: id,
          reason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      alert("Vendor Rejected");
      fetchData();
      setSelected(null);
      setRejectReason("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT LIST */}
      <div className="w-1/3 bg-white p-4 border-r overflow-auto">
        <h2 className="font-bold text-lg mb-4">Onboarding Vendors</h2>

        {vendors.map((v) => (
          <div
            key={v.onboarding_id}
            onClick={() => setSelected(v)}
            className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-100"
          >
            <div className="font-semibold">{v.business_name}</div>
            <div className="text-sm text-gray-500">{v.email}</div>
            <div className="text-xs text-blue-600">
              Status: {v.status}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT DETAIL PANEL */}
      <div className="flex-1 p-6">
        {!selected ? (
          <div className="text-gray-500">Select vendor to view details</div>
        ) : (
          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-xl font-bold mb-4">
              {selected.business_name}
            </h2>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><b>Email:</b> {selected.email}</div>
              <div><b>Phone:</b> {selected.phone}</div>
              <div><b>Status:</b> {selected.status}</div>
              <div><b>Step:</b> {selected.current_step}</div>
            </div>

            <hr className="my-4" />

            {/* BUSINESS */}
            <h3 className="font-semibold mb-2">Business Details</h3>
            <div className="text-sm">
              <div>Name: {selected.business_name}</div>
              <div>Type: {selected.business_type}</div>
              <div>PAN: {selected.pan}</div>
              <div>GST: {selected.gstin}</div>
              <div>Address: {selected.business_address}</div>
            </div>

            <hr className="my-4" />

            {/* BANK */}
            <h3 className="font-semibold mb-2">Bank Details</h3>
            <div className="text-sm">
              <div>Holder: {selected.account_holder_name}</div>
              <div>Account: {selected.account_number}</div>
              <div>IFSC: {selected.ifsc_code}</div>
            </div>

            <hr className="my-4" />

            {/* STORE */}
            <h3 className="font-semibold mb-2">Store Details</h3>
            <div className="text-sm">
              <div>Tagline: {selected.tagline}</div>
              <div>Description: {selected.description}</div>

              {selected.store_image && (
                <img
                  src={selected.store_image}
                  className="w-40 mt-2 rounded"
                />
              )}

              {selected.store_logo && (
                <img
                  src={selected.store_logo}
                  className="w-20 mt-2"
                />
              )}
            </div>

            <hr className="my-4" />

            {/* PICKUP */}
            <h3 className="font-semibold mb-2">Pickup Address</h3>
            <div className="text-sm">
              <div>{selected.pickup_address}</div>
              <div>
                {selected.pickup_city}, {selected.pickup_state}
              </div>
              <div>{selected.pickup_pincode}</div>
            </div>

            <hr className="my-4" />

            {/* ACTIONS */}
            <div className="space-y-2">

              <textarea
                className="w-full border p-2 rounded"
                placeholder="Rejection reason (if rejecting)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex gap-2">

                <button
                  onClick={() => approveVendor(selected.onboarding_id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectVendor(selected.onboarding_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}