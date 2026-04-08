// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { suppliers } from "@/data/suppliers";

// const FeaturedSuppliers = () => {
//   const [activeIndex, setActiveIndex] = useState(2);
//   const [range, setRange] = useState(2); // default desktop

//   const allSuppliers =
//     suppliers.length < 10 ? [...suppliers, ...suppliers] : suppliers;

//   // Handle responsive range properly
//   useEffect(() => {
//     const updateRange = () => {
//       const width = window.innerWidth;

//       if (width < 640) setRange(0);       // mobile → 1 item
//       else if (width < 1024) setRange(1); // tablet → 3 items
//       else setRange(2);                   // desktop → 5 items
//     };

//     updateRange();
//     window.addEventListener("resize", updateRange);

//     return () => window.removeEventListener("resize", updateRange);
//   }, []);

//   const nextSlide = () => {
//     setActiveIndex((prev) =>
//       prev + 1 >= allSuppliers.length ? 0 : prev + 1
//     );
//   };

//   const prevSlide = () => {
//     setActiveIndex((prev) =>
//       prev - 1 < 0 ? allSuppliers.length - 1 : prev - 1
//     );
//   };

//   const getVisible = () => {
//     let result = [];

//     for (let i = -range; i <= range; i++) {
//       const index =
//         (activeIndex + i + allSuppliers.length) % allSuppliers.length;
//       result.push(allSuppliers[index]);
//     }

//     return result;
//   };

//   const visibleSuppliers = getVisible();

//   return (
//     <div className="bg-gray-50 w-full dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-lg sm:text-xl md:text-2xl border-l-4 pl-2 font-semibold border-orange-500">
//             Featured Suppliers
//           </h2>

//           <Link
//             href="/suppliers/verified"
//             className="text-sm text-orange-500 hover:underline"
//           >
//             View all →
//           </Link>
//         </div>

//         {/* Carousel */}
//         <div className="relative flex items-center justify-center w-full">

//           {/* Left Button */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-1 sm:left-2 z-10 bg-white shadow-md p-2 dark:text-black sm:p-3 rounded-full"
//           >
//             <ChevronLeft size={20} />
//           </button>

//           {/* Items */}
//           <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-12 w-full overflow-hidden">
//             {visibleSuppliers.map((supplier, index) => {
//               const isCenter = index === range;

//               return (
//                 <Link
//                   key={`${supplier.id}-${index}`}
//                   href={`/suppliers/${supplier.id}`}
//                   className="flex flex-col items-center transition-all duration-300"
//                 >
//                   {/* Circle */}
//                   <div
//                     className={`
//                       flex items-center justify-center  rounded-full font-bold
//                       transition-all duration-300
//                       text-center
//                       ${isCenter
//                         ? "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 text-sm sm:text-lg dark:text-gray-700 bg-orange-100 shadow-lg"
//                         : "w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 text-xs sm:text-sm dark:text-gray-500 bg-gray-200 opacity-80"}
//                     `}
//                   >
//                     {supplier.name.slice(0, 2).toUpperCase()}
//                   </div>

//                   {/* Name */}
//                   <p
//                     className={`
//                       mt-2 sm:mt-3 text-center
//                       ${isCenter
//                         ? "text-xs sm:text-sm font-semibold text-black dark:text-white"
//                         : "text-[10px] sm:text-xs text-gray-500 dark:text-gray-300"}
//                     `}
//                   >
//                     {supplier.name}
//                   </p>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right Button */}
//           <button
//             onClick={nextSlide}
//             className="absolute right-1 sm:right-2 z-10 bg-white shadow-md p-2 sm:p-3 rounded-full dark:text-black"
//           >
//             <ChevronRight size={20} />
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeaturedSuppliers;

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { suppliers } from "@/data/suppliers";

const FeaturedSuppliers = () => {
  const [activeIndex, setActiveIndex] = useState(0); // ✅ safer default
  const [range, setRange] = useState(2);

  const allSuppliers =
    suppliers.length < 10 ? [...suppliers, ...suppliers] : suppliers;

  // ✅ Responsive range
  useEffect(() => {
    const updateRange = () => {
      const width = window.innerWidth;

      if (width < 640) setRange(0);
      else if (width < 1024) setRange(1);
      else setRange(2);
    };

    updateRange();
    window.addEventListener("resize", updateRange);

    return () => window.removeEventListener("resize", updateRange);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) =>
      (prev + 1) % allSuppliers.length
    );
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      (prev - 1 + allSuppliers.length) % allSuppliers.length
    );
  };

  const getVisible = () => {
    const result = [];

    for (let i = -range; i <= range; i++) {
      const index =
        (activeIndex + i + allSuppliers.length) % allSuppliers.length;
      result.push(allSuppliers[index]);
    }

    return result;
  };

  const visibleSuppliers = getVisible();

  if (!allSuppliers.length) return null; // ✅ safety

  return (
    <div className="w-full dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl border-l-4 pl-2 font-semibold border-orange-500">
            Featured Suppliers
          </h2>

          <Link
            href="/suppliers/verified"
            className="text-sm text-orange-500 hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center w-full">

          {/* Left */}
          <button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 z-10 bg-white shadow-md p-2 sm:p-3 rounded-full dark:text-black"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Items */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-12 w-full overflow-hidden">
            {visibleSuppliers.map((supplier, index) => {
              const isCenter = index === range;

              return (
                <Link
                  key={`${supplier.id}-${index}`}
                  href={`/suppliers/${supplier.id}`}
                  className="flex flex-col items-center transition-all duration-300"
                >
                  {/* Circle */}
                  <div
                    className={`flex items-center justify-center rounded-full font-bold transition-all duration-300 text-center
                      ${
                        isCenter
                          ? "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 text-sm sm:text-lg dark:text-gray-700 bg-orange-100 shadow-lg"
                          : "w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 text-xs sm:text-sm dark:text-gray-500 bg-gray-200 opacity-80"
                      }`}
                  >
                    {supplier.name.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Name */}
                  <p
                    className={`mt-2 sm:mt-3 text-center ${
                      isCenter
                        ? "text-xs sm:text-sm font-semibold text-black dark:text-white"
                        : "text-[10px] sm:text-xs text-gray-500 dark:text-gray-300"
                    }`}
                  >
                    {supplier.name}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 z-10 bg-white shadow-md p-2 sm:p-3 rounded-full dark:text-black"
          >
            <ChevronRight size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default FeaturedSuppliers;