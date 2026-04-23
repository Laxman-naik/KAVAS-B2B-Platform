// "use client";

// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFavourites, removeFromFavourites, clearFavourites,} from "@/store/slices/favouritesSlice";
// import { fetchProducts } from "@/store/slices/productSlice";

// const Page = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [mounted, setMounted] = useState(false);
//   const { loading, error } = useSelector((state) => state.favourites);
//   const favouriteIds = useSelector((state) => state.favourites.items);
//   const products = useSelector((state) => state.products.products || []);
//   const favouriteProducts = products.filter((p) => favouriteIds.includes(p.id));

//   useEffect(() => {
//     setMounted(true);
//     dispatch(fetchFavourites());
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   if (!mounted) return null;

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg sm:text-xl font-semibold">
//             My Favourites {favouriteIds.length} items
//           </h2>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               onClick={() => dispatch(clearFavourites())}
//               className="cursor-pointer"
//             >
//               Clear all
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() => router.push("/")}
//               className="hidden sm:inline-flex cursor-pointer"
//             >
//               Continue Shopping
//             </Button>
//           </div>
//         </div>

//         <div className="mt-6">
//           {loading ? (
//             <div className="text-center py-16 bg-white rounded-2xl border">
//               <p className="text-gray-500">Loading...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-16 bg-white rounded-2xl border">
//               <p className="text-red-500">{error}</p>
//             </div>
//           ) : favourites.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl border">
//               <div className="text-5xl mb-3">❤️</div>
//               <p className="text-gray-500">No favourites yet</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
//               {favouriteProducts.map((item, index) => {
//                 const productId = item.id;
//                 const image = item.image_url || "/placeholder.png";
//                 const price =
//                   item?.priceValue ||
//                   item?.price ||
//                   item?.product?.price ||
//                   "";
//                 const name =
//                   item?.name ||
//                   item?.product?.name ||
//                   "Product";

//                 return (
//                   <div
//                     key={productId}
//                     className="bg-white rounded-2xl border shadow-sm overflow-hidden"
//                   >
//                     <div className="relative">
//                       <button
//                         type="button"
//                         onClick={() => dispatch(removeFromFavourites(productId))}
//                         className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow cursor-pointer"
//                         aria-label="Remove from favourites"
//                       >
//                         <X size={16} />
//                       </button>

//                       <Link href={`/product/${productId}`} className="block">
//                         <img
//                           src={image}
//                           alt={name}
//                           className="w-full h-44 sm:h-52 object-cover"
//                         />
//                       </Link>
//                     </div>

//                     <div className="p-3">
//                       <p className="text-sm font-medium line-clamp-2 min-h-10">
//                         {name}
//                       </p>

//                       {price ? (
//                         <p className="text-sm font-semibold mt-1">
//                           ₹{price}
//                         </p>
//                       ) : null}

//                       <Button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-9 cursor-pointer">
//                         MOVE TO CART
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;


"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchFavourites,
  removeFromFavourites,
  clearFavourites,
} from "@/store/slices/favouritesSlice";

import { fetchProducts } from "@/store/slices/productSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);

  const { items: favouriteIds, loading, error } = useSelector(
    (state) => state.favourites
  );

  const products = useSelector((state) => state.products.products || []);

  /* ✅ Optimized lookup instead of filter */
  const productMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [products]);

  const favouriteProducts = useMemo(() => {
    return favouriteIds.map((id) => productMap[id]).filter(Boolean);
  }, [favouriteIds, productMap]);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchFavourites());
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ✅ Prevent hydration + flicker */
  if (!mounted || loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">
            My Favourites {favouriteIds.length} items
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch(clearFavourites())}
              className="cursor-pointer"
            >
              Clear all
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="hidden sm:inline-flex cursor-pointer"
            >
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-6">

          {error ? (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <p className="text-red-500">{error}</p>
            </div>
          ) : favouriteIds.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <div className="text-5xl mb-3">❤️</div>
              <p className="text-gray-500">No favourites yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">

              {favouriteProducts.map((item) => {
                const productId = item.id;
                const image = item.image_url || "/placeholder.png";
                const price = item.price || "";
                const name = item.name || "Product";

                return (
                  <div
                    key={productId}
                    className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeFromFavourites(productId))
                        }
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow cursor-pointer"
                      >
                        <X size={16} />
                      </button>

                      <Link href={`/product/${productId}`}>
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-44 sm:h-52 object-cover"
                        />
                      </Link>
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-medium line-clamp-2 min-h-10">
                        {name}
                      </p>

                      {price && (
                        <p className="text-sm font-semibold mt-1">
                          ₹{price}
                        </p>
                      )}

                      <Button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-9 cursor-pointer">
                        MOVE TO CART
                      </Button>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;