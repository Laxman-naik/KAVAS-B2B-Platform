"use client";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { addToFavourites, removeFromFavourites } from "@/store/slices/favouritesSlice";
import { Heart, ShoppingCart, Star } from "lucide-react";

export default function NewArrivals() {
  const dispatch = useDispatch();
  const { newArrivals, loading } = useSelector((state) => state.products);
  const favouriteItems = useSelector((state) => state.favourites.items);

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const liked = useMemo(() => {
    return (Array.isArray(favouriteItems)
      ? favouriteItems
      : []
    )
      .map((item) =>
        String(
          item?._id ??
          item?.id ??
          item?.productId ??
          item
        )
      )
      .filter(Boolean);
  }, [favouriteItems]);

  const onToggleFavourite = (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    if (!productId) return;
    if (liked.includes(String(productId))) {
      dispatch(removeFromFavourites(productId));
    } else {
      dispatch(addToFavourites(productId));
    }
  };

  const onAddToCart = (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    if (!productId) return;
    dispatch(
      addToCart({
        productId,
        quantity: 1,
        variantId: product?.variantId ?? product?.variant_id,
      })
    );
  };

  const products = Array.isArray(newArrivals) ? newArrivals : [];

  return (
    <section className="py-10 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-[11px] font-extrabold tracking-widest text-[#D4AF37] uppercase">
            Discover Our Latest Collection
          </div>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]/60" />
            <h2 className="text-3xl sm:text-3xl font-extrabold text-[#0B1F3A]">
              New Arrivals
            </h2>
            <span className="h-px w-10 bg-[#D4AF37]/60" />
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {(loading ? Array.from({ length: 6 }) : products.slice(0, 6)).map(
              (item, idx) => {
                if (loading) {
                  return (
                    <div
                      key={`skeleton-${idx}`}
                      className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-4"
                    >
                      <div className="h-44 sm:h-48 bg-gray-100 rounded-xl" />
                      <div className="mt-4 h-3 bg-gray-100 rounded" />
                      <div className="mt-2 h-3 bg-gray-100 rounded w-2/3" />
                      <div className="mt-4 h-10 bg-gray-100 rounded-xl" />
                    </div>
                  );
                }

                const productId = String(item?._id ?? item?.id ?? item?.productId);
                const isLiked = liked.includes(productId);
                const imageUrl =
                  item?.image_url || item?.imageUrl || "/placeholder.png";
                const title = item?.name || "Product";
                const rating = Number(item?.rating ?? item?.avgRating ?? 0);

                return (
                  <div
                    key={productId ?? `${title}-${idx}`}
                    className="group h-full bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-48 sm:h-52 bg-[#FFF8EC] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onToggleFavourite(item)}
                        className={`absolute right-3 top-3 z-10 h-9 w-9 rounded-full border flex items-center justify-center bg-white/90 backdrop-blur shadow-sm transition ${isLiked
                          ? "border-[#D4AF37] text-[#D4AF37]"
                          : "border-[#E5E5E5] text-[#0B1F3A] hover:border-[#D4AF37]"
                          }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${isLiked
                              ? "text-red-500 fill-red-500"
                              : "text-[#0B1F3A]"
                            }`}
                        />
                      </button>

                      <Link href={`/product/${productId}`}>
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </Link>
                    </div>
                    <div className="px-4 pb-4 flex flex-col flex-1">

                      <Link href={`/product/${productId}`}>
                        <h3 className="mt-3 text-sm font-semibold text-[#1A1A1A] line-clamp-2 min-h-10">
                          {title}
                        </h3>
                      </Link>
                      <div className=" flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const filled = rating >= i + 1;
                          return (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${filled
                                ? "text-[#D4AF37] fill-[#D4AF37]"
                                : "text-gray-300"
                                }`}
                            />
                          );
                        })}
                        <span className="text-[11px] text-gray-500 ml-1">
                          ({Number.isFinite(rating) ? rating.toFixed(1) : "0.0"})
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#0B1F3A] font-extrabold text-lg">
                            ₹{item?.price ?? "0"}
                          </span>
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{item?.mrp ?? item?.price ?? "0"}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#D4AF37] font-extrabold mt-1">
                          10% OFF
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className=" w-full h-11 rounded-sm bg-[#0B1F3A] hover:bg-[#07172b] text-[#FFF8EC] font-semibold text-sm flex items-center justify-center gap-2 mt-auto"
                      >
                        <ShoppingCart className="h-4 w-4 text-[#D4AF37]" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/newarrivalsviewall"
              className="text-[#0B1F3A] font-semibold text-sm hover:text-[#D4AF37]"
            >
              View all products →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
