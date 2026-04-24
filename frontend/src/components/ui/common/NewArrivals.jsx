"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { addToFavourites, removeFromFavourites } from "@/store/slices/favouritesSlice";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star } from "lucide-react";

export default function NewArrivals() {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { newArrivals, loading } = useSelector((state) => state.products);
  const favouriteItems = useSelector((state) => state.favourites.items);

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const liked = useMemo(() => {
    const items = Array.isArray(favouriteItems) ? favouriteItems : [];
    return items
      .map((item) => item?._id ?? item?.id ?? item?.productId)
      .filter(Boolean);
  }, [favouriteItems]);

  const onToggleFavourite = (product) => {
    const productId = product?._id ?? product?.id ?? product?.productId;
    if (!productId) return;
    if (liked.includes(productId)) {
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
    <div className="py-6 bg-white">
      <div className="max-w-350 mx-auto px-4">
        <div className="relative rounded-[28px] bg-[#FFF8EC] border border-[#E5E5E5] px-4 sm:px-6 pb-8 pt-12">
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 h-20 w-[320px] max-w-[85%] bg-white rounded-b-[40px] z-10" />

          <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20">
            <div className="bg-white rounded-full px-6 py-3 shadow-sm border border-[#E5E5E5]">
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#1A1A1A] leading-tight">
                  New Arrival Products
                </h2>
                {/* <p className="text-xs text-gray-600 mt-1">
                  Up to 69% discount for limited time
                </p> */}
              </div>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="hidden md:inline-flex p-2 bg-white border border-[#E5E5E5] rounded-full shadow-sm hover:bg-[#FFF8EC] hover:scale-110 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="text-[#0B1F3A]" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar flex-1 pb-1"
            >
              {(loading ? Array.from({ length: 8 }) : products.slice(0, 12)).map(
                (item, idx) => {
                  if (loading) {
                    return (
                      <div
                        key={`skeleton-${idx}`}
                        className="min-w-47.5 sm:min-w-52.5 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-3"
                      >
                        <div className="h-36 bg-gray-100 rounded-xl" />
                        <div className="mt-3 h-3 bg-gray-100 rounded" />
                        <div className="mt-2 h-3 bg-gray-100 rounded w-2/3" />
                        <div className="mt-4 h-9 bg-gray-100 rounded-xl" />
                      </div>
                    );
                  }

                  const productId = item?._id ?? item?.id ?? item?.productId;
                  const isLiked = productId ? liked.includes(productId) : false;
                  const imageUrl = item?.image_url || item?.imageUrl || "/placeholder.png";
                  const title = item?.name || "Product";
                  const rating = Number(item?.rating ?? item?.avgRating ?? 0);

                  return (
                    <div
                      key={productId ?? `${title}-${idx}`}
                      className="min-w-47.5 sm:min-w-52.5 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-xl transition overflow-hidden"
                    >
                      <div className="relative p-3">
                        <span className="absolute left-3 top-3 bg-[#D4AF37] text-[#0B1F3A] text-[11px] px-2 py-0.5 rounded-full font-semibold">
                          -10% off
                        </span>

                        <button
                          type="button"
                          onClick={() => onToggleFavourite(item)}
                          className={`absolute right-3 top-3 h-8 w-8 rounded-full border flex items-center justify-center bg-white shadow-sm ${
                            isLiked
                              ? "border-[#D4AF37] text-[#D4AF37]"
                              : "border-[#E5E5E5] text-[#0B1F3A]"
                          }`}
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            className={`h-4 w-4 ${isLiked ? "fill-[#D4AF37]" : ""}`}
                          />
                        </button>

                        <Link href={`/product/${productId}`}>
                          <div className="h-36 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={title}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </Link>
                      </div>

                      <div className="px-3 pb-3">
                        <Link href={`/product/${productId}`}>
                          <h3 className="text-sm font-semibold text-[#1A1A1A] line-clamp-2 min-h-10">
                            {title}
                          </h3>
                        </Link>

                        <div className="mt-2 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const filled = rating >= i + 1;
                            return (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  filled
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

                        <div className="mt-3 flex items-end justify-between">
                          <div>
                            <div className="text-[#0B1F3A] font-bold">
                              ₹{item?.price ?? "0"}
                            </div>
                            <div className="text-[11px] text-gray-500 line-through">
                              ₹{item?.mrp ?? item?.price ?? "0"}
                            </div>
                            <div className="text-[11px] text-[#D4AF37] font-semibold">
                              10% OFF
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            className="flex-1 h-10 rounded-xl bg-[#0B1F3A] hover:bg-[#07172b] text-[#FFF8EC] font-semibold text-sm inline-flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4 text-[#D4AF37]" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <button
              onClick={scrollRight}
              className="hidden md:inline-flex p-2 bg-white border border-[#E5E5E5] rounded-full shadow-sm hover:bg-[#FFF8EC] hover:scale-110 transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="text-[#0B1F3A]" />
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/newarrivalsviewall"
              className="text-[#0B1F3A] font-semibold text-sm hover:underline"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}