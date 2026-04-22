// "use client";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsersThunk } from "@/store/slices/authSlice";

// export default function BuyersTable() {
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.admin);

//     useEffect(() => {
//     dispatch(fetchUsersThunk());
//   }, [dispatch]);

//   const [form, setForm] = useState({
//     company: "",
//     industry: "",
//     contact: "",
//     email: "",
//     phone: "",
//     country: "",
//     tier: "Standard",
//     credit: "",
//     notes: "",
//   });

//   const tierStyles = {
//     Premium: "bg-yellow-500/20 text-yellow-400",
//     Standard: "bg-gray-500/20 text-gray-300",
//     Enterprise: "bg-blue-500/20 text-blue-400",
//   };

//   const statusStyles = {
//     Active: "bg-green-500/20 text-green-400",
//     Review: "bg-yellow-500/20 text-yellow-400",
//     Inactive: "bg-gray-500/20 text-gray-400",
//   };

//   const filtered = buyers.filter((b) =>
//     b.company.toLowerCase().includes(search.toLowerCase())
//   );

//   // ✅ Add Buyer
//   const handleAddBuyer = () => {
//     if (!form.company || !form.contact || !form.email) return;

//     const newBuyer = {
//       company: form.company,
//       contact: form.contact,
//       email: form.email,
//       tier: form.tier,
//       orders: 0,
//       status: "Active",
//     };

//     setBuyers([newBuyer, ...buyers]);

//     // Reset form
//     setForm({
//       company: "",
//       industry: "",
//       contact: "",
//       email: "",
//       phone: "",
//       country: "",
//       tier: "Standard",
//       credit: "",
//       notes: "",
//     });

//     setShowModal(false);
//   };

//   return (
//     <div className="p-4 text-white">
//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <input
//           placeholder="Search..."
//           className="px-4 py-2 rounded bg-[#13263C]"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button
//           onClick={() => setShowModal(true)}
//           className="px-4 py-2 bg-orange-500 rounded"
//         >
//           + Add buyer
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="border border-gray-700 rounded-xl overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-[#111827] text-gray-400">
//             <tr>
//               {["Company", "Contact", "Email", "Tier", "Orders", "Status"].map(
//                 (h) => (
//                   <th key={h} className="px-4 py-3 text-left">
//                     {h}
//                   </th>
//                 )
//               )}
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.map((b, i) => (
//               <tr key={i} className="border-t border-gray-800">
//                 <td className="px-4 py-3">{b.company}</td>
//                 <td className="px-4 py-3">{b.contact}</td>
//                 <td className="px-4 py-3 text-blue-400">{b.email}</td>
//                 <td className="px-4 py-3">
//                   <span className={`px-2 py-1 rounded ${tierStyles[b.tier]}`}>
//                     {b.tier}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">{b.orders}</td>
//                 <td className="px-4 py-3">
//                   <span className={`px-2 py-1 rounded ${statusStyles[b.status]}`}>
//                     {b.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
//           <div className="w-150 bg-[#0F1E33] p-6 rounded-2xl text-white">

//             <div className="flex justify-between mb-4">
//               <h2 className="text-lg font-semibold">Add new buyer</h2>
//               <button onClick={() => setShowModal(false)}>✕</button>
//             </div>

//             {/* COMPANY DETAILS */}
//             <p className="text-orange-400 text-xs mb-2">COMPANY DETAILS</p>

//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 placeholder="Company name *"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.company}
//                 onChange={(e) =>
//                   setForm({ ...form, company: e.target.value })
//                 }
//               />
//               <input
//                 placeholder="Industry"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.industry}
//                 onChange={(e) =>
//                   setForm({ ...form, industry: e.target.value })
//                 }
//               />

//               <input
//                 placeholder="Contact name *"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.contact}
//                 onChange={(e) =>
//                   setForm({ ...form, contact: e.target.value })
//                 }
//               />
//               <input
//                 placeholder="Email *"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//               />

//               <input
//                 placeholder="Phone"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.phone}
//                 onChange={(e) =>
//                   setForm({ ...form, phone: e.target.value })
//                 }
//               />
//               <input
//                 placeholder="Country"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.country}
//                 onChange={(e) =>
//                   setForm({ ...form, country: e.target.value })
//                 }
//               />
//             </div>

//             {/* ACCOUNT */}
//             <p className="text-orange-400 text-xs mt-4 mb-2">ACCOUNT TIER</p>

//             <div className="grid grid-cols-2 gap-3">
//               <select
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.tier}
//                 onChange={(e) =>
//                   setForm({ ...form, tier: e.target.value })
//                 }
//               >
//                 <option>Standard</option>
//                 <option>Premium</option>
//                 <option>Enterprise</option>
//               </select>

//               <input
//                 placeholder="Credit limit"
//                 className="p-2 bg-[#13263C] rounded"
//                 value={form.credit}
//                 onChange={(e) =>
//                   setForm({ ...form, credit: e.target.value })
//                 }
//               />
//             </div>

//             {/* NOTES */}
//             <p className="text-orange-400 text-xs mt-4 mb-2">NOTES</p>

//             <textarea
//               placeholder="Internal notes..."
//               className="w-full p-2 bg-[#13263C] rounded"
//               value={form.notes}
//               onChange={(e) =>
//                 setForm({ ...form, notes: e.target.value })
//               }
//             />

//             {/* ACTIONS */}
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-600 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleAddBuyer}
//                 className="px-4 py-2 bg-orange-500 rounded"
//               >
//                 Add buyer
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
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk } from "@/store/slices/authSlice";

export default function BuyersTable() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { users = [], loading } = useSelector((state) => state.auth);

  console.log(users)

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  // ✅ filter using real field
  const filtered = users.filter((u) => u.role === "buyer").filter((u) => u.full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 text-white">

      {/* SEARCH */}
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search..."
          className="px-4 py-2 rounded bg-[#13263C]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading users...</p>}

      {/* TABLE */}
      <div className="border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">

          {/* ✅ FIXED HEADER */}
          <thead className="bg-[#111827] text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-gray-800">
                <td className="px-4 py-3">{u.full_name}</td>
                <td className="px-4 py-3 text-blue-400">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-400 mt-4">No users found</p>
      )}
    </div>
  );
}