"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavourites,
  removeFromFavourites,
  clearFavourites,
  getProductIdFromItem,
} from "@/store/slices/favouritesSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = React.useState(false);
  const [token, setToken] = React.useState(null);

  const { items: favourites, loading, error } = useSelector(
    (state) => state.favourites
  );

  React.useEffect(() => {
    setMounted(true);

    const savedToken = localStorage.getItem("accessToken");
    setToken(savedToken);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("accessToken");
      setToken(updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  React.useEffect(() => {
    if (mounted && token) {
      dispatch(fetchFavourites());
    }
  }, [mounted, token, dispatch]);

  const handleClearAll = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    dispatch(clearFavourites());
  };

  const handleRemove = (productId) => {
    if (!token) {
      router.push("/login");
      return;
    }
    dispatch(removeFromFavourites(productId));
  };

  if (!mounted) return null;

  if (!token) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-16 bg-white rounded-2xl border">
            <div className="text-5xl mb-3">❤️</div>
            <p className="text-gray-600 mb-4">Please log in to view favourites</p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">
            My Favourites {favourites.length} items
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleClearAll}
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

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <p className="text-red-500">{error}</p>
            </div>
          ) : favourites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <div className="text-5xl mb-3">❤️</div>
              <p className="text-gray-500">No favourites yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {favourites.map((item, index) => {
                const productId = getProductIdFromItem(item) || index;
                const image =
                  item?.image ||
                  item?.image_url ||
                  item?.imageUrl ||
                  "/placeholder.png";
                const price =
                  item?.priceValue ||
                  item?.price ||
                  item?.product?.price ||
                  "";
                const name =
                  item?.name ||
                  item?.product?.name ||
                  "Product";

                return (
                  <div
                    key={productId}
                    className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                  >
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => handleRemove(productId)}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow cursor-pointer"
                        aria-label="Remove from favourites"
                      >
                        <X size={16} />
                      </button>

                      <Link href={`/product/${productId}`} className="block">
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

                      {price ? (
                        <p className="text-sm font-semibold mt-1">₹{price}</p>
                      ) : null}

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