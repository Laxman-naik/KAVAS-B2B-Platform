// "use client";
// import { useEffect, useState } from "react";
// import {
//   Search,
//   FileText,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Package,
//   Calendar,
//   IndianRupee,
//   RefreshCcw
// } from "lucide-react";
// const MyQuotes = () => {
//   const [quotes, setQuotes] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const vendorId = "YOUR_VENDOR_ORG_ID";
//   useEffect(() => {
//     loadQuotes();
//   }, []);
//   const loadQuotes = async () => {
//     const res = await fetch(
//       "/api/vendor/quotes",
//       {
//         headers: {
//           "vendor-id": vendorId
//         }
//       }
//     );
//     const data = await res.json();
//     setQuotes(data);
//     if (data.length) {
//       setSelected(data[0]);
//     }
//     setLoading(false);
//   };
//   const withdrawQuote = async (id) => {
//     await fetch(
//       `/api/vendor/quotes/${id}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           status: "withdrawn"
//         })
//       }
//     );
//     loadQuotes();
//   };
//   const filteredQuotes =
//     quotes
//       .filter(item => {


//         const text =
//           `${item.rfqs?.title}
// ${item.rfqs?.organizations?.name}`
//             .toLowerCase();
//         return text.includes(
//           search.toLowerCase()
//         );
//       })
//       .filter(item =>
//         status === "All"
//         ||
//         item.status === status
//       );

//   return (
//     <div className="min-h-screen bg-slate-100 p-8">
//       <div className="flex justify-between">
//         <h1 className="text-3xl font-bold">
//           My Quotes
//         </h1>
//         <div className="flex gap-5">
//           <FileText />
//           <Clock />
//           <CheckCircle />
//           <XCircle />
//         </div>
//       </div>
//       <div className="bg-white p-5 rounded-xl mt-6 flex gap-3">
//         <div className="relative flex-1">
//           <Search
//             className="absolute left-3 top-3"
//           />
//           <input
//             className="w-full border p-3 pl-10 rounded-lg"
//             placeholder="Search quotes"
//             value={search}
//             onChange={
//               e => setSearch(e.target.value)
//             }
//           />
//         </div>
//         <select
//           className="border rounded-lg px-4"
//           onChange={
//             e => setStatus(e.target.value)
//           }
//         >
//           <option>
//             All
//           </option>
//           <option>
//             submitted
//           </option>
//           <option>
//             accepted
//           </option>
//           <option>
//             rejected
//           </option>
//           <option>
//             withdrawn
//           </option>
//         </select>
//         <button
//           onClick={loadQuotes}
//           className="border px-4 rounded flex gap-2 items-center"
//         >
//           <RefreshCcw size={18} />
//           Refresh
//         </button>
//       </div>
//       <div className="grid grid-cols-3 gap-5 mt-6">
//         <div className="col-span-2 bg-white rounded-xl overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-slate-50">
//               <tr>
//                 <th className="p-4 text-left">
//                   RFQ
//                 </th>
//                 <th>
//                   Buyer
//                 </th>
//                 <th>
//                   Amount
//                 </th>
//                 <th>
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {
//                 loading ?
//                   <tr>
//                     <td className="p-5">
//                       Loading...
//                     </td>
//                   </tr>
//                   :
//                   filteredQuotes.map(q => (
//                     <tr
//                       key={q.id}
//                       onClick={
//                         () => setSelected(q)
//                       }
//                       className="border-t cursor-pointer hover:bg-slate-50"
//                     >
//                       <td className="p-4">
//                         {q.rfqs?.title}
//                       </td>
//                       <td>
//                         {q.rfqs?.organizations?.name}
//                       </td>
//                       <td>
//                         ₹{q.total_price}
//                       </td>
//                       <td>
//                         <span className="bg-blue-100 px-3 py-1 rounded-full">
//                           {q.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//               }
//             </tbody>
//           </table>
//         </div>
//         <div className="bg-white rounded-xl p-6">
//           {
//             selected &&
//             <>
//               <h2 className="text-xl font-bold">
//                 Quote Details
//               </h2>
//               <h1 className="text-2xl font-bold mt-5">
//                 {selected.rfqs?.title}
//               </h1>
//               <div className="space-y-4 mt-5">
//                 <p className="flex gap-2">
//                   <Package />
//                   {selected.rfqs?.products?.name}
//                 </p>
//                 <p className="flex gap-2">
//                   <IndianRupee />
//                   {selected.total_price}
//                 </p>
//                 <p className="flex gap-2">
//                   <Calendar />
//                   {selected.delivery_days}
//                   Days Delivery
//                 </p>
//               </div>
//               <div className="mt-5">
//                 <p>
//                   Unit Price
//                 </p>
//                 <h2 className="text-xl font-bold">
//                   ₹{selected.unit_price}
//                 </h2>
//               </div>
//               {
//                 selected.status === "submitted" &&
//                 <button
//                   onClick={
//                     () => withdrawQuote(selected.id)
//                   }
//                   className="mt-6 w-full border border-red-500 text-red-500 p-3 rounded-lg"
//                 >
//                   Withdraw Quote
//                 </button>
//               }
//             </>
//           }
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MyQuotes;