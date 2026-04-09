"use client";
import Link from "next/link";
import { useParams,  } from "next/navigation";
import { products } from "@/data/products";
import { arrivalProducts } from "@/data/arrivalProducts";
import { suppliers } from "@/data/suppliers";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "@/store/slices/favouritesSlice";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, PackageCheck, RefreshCcw, Star, Truck, XIcon } from "lucide-react";

const ProductView = () => {
  const params = useParams();
 
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);
  const id = params?.Id ?? params?.id;

  const allProducts = [...products, ...arrivalProducts];
  const product = allProducts.find((p) => String(p.id) === String(id));

  const [qty, setQty] = useState(50);

  const mediaItems =
    product?.media && product.media.length > 0
      ? product.media
      : [{ type: "image", src: product?.image }];

  const [activeImage, setActiveImage] = useState(null);
  const selectedMedia = activeImage || mediaItems[0];

  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState([]);

  const resetReviewForm = () => {
    reviewPhotos.forEach((p) => URL.revokeObjectURL(p.url));
    setReviewRating(0);
    setReviewTitle("");
    setReviewComment("");
    setReviewPhotos([]);
  };

  const handleReviewDialogChange = (open) => {
    setIsWriteReviewOpen(open);
    if (!open) resetReviewForm();
  };

  const handleAddReviewPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setReviewPhotos((prev) => [...prev, ...next].slice(0, 6));
    e.target.value = "";
  };

  const removeReviewPhoto = (id) => {
    setReviewPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const submitReview = () => {
    if (!reviewRating || !reviewComment.trim()) return;
    setIsWriteReviewOpen(false);
  };

  const reviews = [
    {
      id: 1,
      name: "Procurement Manager",
      rating: 5,
      date: "Mar 2026",
      title: "Consistent quality and on-time delivery",
      comment:
        "Good packaging and reliable fulfillment. The product matched the listing and the batch quality was consistent.",
    },
    {
      id: 2,
      name: "Wholesale Buyer",
      rating: 4,
      date: "Feb 2026",
      title: "Value for bulk orders",
      comment:
        "Pricing is competitive at higher quantities. Support was responsive and helped confirm specifications before dispatch.",
    },
    {
      id: 3,
      name: "Retail Distributor",
      rating: 5,
      date: "Jan 2026",
      title: "Great supplier communication",
      comment:
        "Clear updates from order confirmation to delivery. Would reorder for regular stocking.",
    },
  ];

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5" aria-label={`Rating ${rounded} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < rounded ? "text-amber-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const WriteReviewDialog = () => {
    const isSubmitDisabled = !reviewRating || !reviewComment.trim();

    return (
      <Dialog open={isWriteReviewOpen} onOpenChange={handleReviewDialogChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-base font-semibold">
            Write a review
          </DialogTitle>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Rating</p>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  const active = value <= reviewRating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className="p-1"
                      aria-label={`Rate ${value} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          active ? "fill-amber-500 text-amber-500" : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
                {reviewRating > 0 && (
                  <button
                    type="button"
                    onClick={() => setReviewRating(0)}
                    className="ml-2 text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">Title</label>
              <input
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review here..."
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum requirement: rating + review text
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Add photos</p>
                <p className="text-xs text-gray-500">Up to 6</p>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <span className="text-base">＋</span>
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddReviewPhotos}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  JPG, PNG. Avoid sensitive info.
                </p>
              </div>

              {reviewPhotos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {reviewPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                    >
                      <img
                        src={p.url}
                        alt="Review upload"
                        className="h-24 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeReviewPhoto(p.id)}
                        className="absolute right-1 top-1 rounded-md bg-white/90 p-1 text-gray-700 shadow hover:bg-white"
                        aria-label="Remove photo"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(false)}
                className="w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitDisabled}
                onClick={submitReview}
                className={`w-1/2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  isSubmitDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const StepList = ({ title, steps }) => (
    <div className="mt-6">
      <h2 className="text-center text-sm font-extrabold tracking-wide text-gray-800">
        {title}
      </h2>

      <div className="mt-5 space-y-5">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              {index !== steps.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 mt-2" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MoreInfoDrawer = () => {
    const exchanges = [
      {
        title: "Go to Menu > My Orders > Exchange",
        description: "Select the time slot for exchange",
        icon: <PackageCheck className="h-5 w-5 text-gray-700" />,
      },
      {
        title: "Delivery agent will deliver the new product",
        description: "And pick up the old one",
        icon: <Truck className="h-5 w-5 text-gray-700" />,
      },
      {
        title: "No additional payment needed",
        description: "Exchange completed at your doorstep",
        icon: <RefreshCcw className="h-5 w-5 text-gray-700" />,
      },
    ];

    const returns = [
      {
        title: "Go to Menu > My Orders > Return",
        description: "Select the time slot and mode for return",
        icon: <PackageCheck className="h-5 w-5 text-gray-700" />,
      },
      {
        title: "Delivery agent will pick up the product",
        description: "Please keep product and packaging ready",
        icon: <Truck className="h-5 w-5 text-gray-700" />,
      },
      {
        title: "Refund will be processed in 7–14 days",
        description: "After the quality check",
        icon: <CreditCard className="h-5 w-5 text-gray-700" />,
      },
    ];

    return (
      <Dialog open={isMoreInfoOpen} onOpenChange={setIsMoreInfoOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-0! right-0! left-auto! translate-x-0! translate-y-0! h-dvh w-full sm:max-w-md rounded-none sm:rounded-l-xl p-0 data-open:slide-in-from-right-8 data-closed:slide-out-to-right-8"
        >
          <DialogTitle className="sr-only">Easy Exchange &amp; Return</DialogTitle>
          <div className="h-dvh bg-white flex flex-col">
            <div className="sticky top-0 z-10 border-b bg-white">
              <div className="px-4 py-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsMoreInfoOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Close"
                >
                  <XIcon className="h-5 w-5 text-gray-700" />
                </button>

                <div className="text-center flex-1">
                  <h1 className="text-lg font-extrabold text-gray-900">
                    Easy Exchange & Return
                  </h1>
                  <p className="text-xs tracking-widest text-gray-500 mt-1">
                    HOW IT WORKS?
                  </p>
                </div>

                <div className="w-10 h-10" />
              </div>
            </div>

            <div className="flex-1 overflow-auto px-5 py-6">
              <StepList title="EASY EXCHANGES" steps={exchanges} />
              <StepList title="EASY RETURNS" steps={returns} />

              <div className="mt-8 border-t pt-4">
                <p className="text-sm font-semibold text-gray-800">Note:</p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  The product should not be damaged and the price tags should be intact.
                  T&C applicable.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const tiers = [
    { min: 50, max: 99, price: 580 },
    { min: 100, max: 249, price: 539 },
    { min: 250, max: 499, price: 505 },
    { min: 500, max: Infinity, price: 464 },
  ];

  const activeTier = tiers.find((t) => qty >= t.min && qty <= t.max);

  if (!product) {
    return <div className="p-10 text-center">Product Not Found</div>;
  }

  const isWishlisted = favouriteItems.some(
    (item) => String(item._id) === String(product.id),
  );

  const normalizeName = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\b(pvt|pvt\s+ltd|ltd|limited|co|company|india)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normalizedCompany = normalizeName(product.company);

  const supplier = suppliers.find((s) => {
    const normalizedSupplier = normalizeName(s.name);
    if (!normalizedSupplier || !normalizedCompany) return false;
    return (
      normalizedSupplier === normalizedCompany ||
      normalizedSupplier.includes(normalizedCompany) ||
      normalizedCompany.includes(normalizedSupplier)
    );
  });

  const supplierInitials = (name) =>
    String(name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:px-24">
      <div className="grid lg:grid-cols-2 gap-7 items-start">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300 relative">
            <button
              type="button"
              onClick={() => dispatch(toggleFavourite(product))}
              className="absolute top-3 right-3 text-xl bg-white rounded-full p-2 shadow hover:scale-110 transition"
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>

            <div className="overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center h-72 sm:h-96 lg:h-105">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.src}
                  className="w-full h-full object-contain transition duration-300 "
                />
              ) : (
                <video
                  src={selectedMedia.src}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="mt-3 grid grid-cols-5 gap-3">
              {mediaItems.map((item, idx) => {
                const isActive =
                  selectedMedia.src === item.src &&
                  selectedMedia.type === item.type;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(item)}
                    className={`rounded-lg border p-1 overflow-hidden transition ${
                      isActive ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        className="w-full h-16 object-contain"
                      />
                    ) : (
                      <div className="relative w-full h-16 bg-black flex items-center justify-center">
                        <span className="text-white text-xs">▶</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Reviews</p>
                <div className="mt-1 flex items-center gap-2">
                  {renderStars(averageRating)}
                  <span className="text-sm font-medium text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({reviews.length})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(true)}
                className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Write a review
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {review.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              View all reviews
            </button>
          </div>
        </div>

        <div className="pt-2 sm:pt-5">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {product.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ⭐⭐⭐⭐⭐ <span>4.8</span>{" "}
            <span className="text-blue-500">(124 reviews)</span> •{" "}
            {product.company}
          </p>

          <div className="mt-2 bg-yellow-50 border border-yellow-300 rounded-xl p-5 h-auto">
            <p className="text-xs sm:text-sm font-medium mb-2">
              💰 Bulk pricing tiers — save more when you order more:
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-5 cursor-pointer">
              {tiers.map((tier, i) => {
                const isActive = qty >= tier.min && qty <= tier.max;

                return (
                  <div
                    key={i}
                    onClick={() => setQty(tier.min)}
                    className={`rounded-lg px-3 py-2 w-23.75 sm:w-27.5 text-center transition hover:scale-105 ${
                      isActive
                        ? "border-2 border-orange-500 bg-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {tier.max === Infinity
                        ? `${tier.min}+`
                        : `${tier.min}–${tier.max}`}{" "}
                      units
                    </p>

                    <p className="text-orange-600 font-bold text-sm sm:text-lg">
                      ₹{tier.price}
                    </p>

                    {!isActive && (
                      <p className="text-green-600 text-[10px] sm:text-xs">
                        Save {Math.round(((580 - tier.price) / 580) * 100)}%
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ✅ SIZES DISPLAY (NEW ADDED ONLY) */}
          {product?.sizes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 border rounded-md text-sm bg-white"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-sm text-black-700">Quantity:</span>

            <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="px-3 sm:px-4 py-1 bg-gray-100 hover:bg-gray-200 transition"
              >
                -
              </button>

              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-14 sm:w-16 text-center outline-none"
              />

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 sm:px-4 py-1 bg-gray-100 hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>

            <span className="text-xs sm:text-sm text-gray-500">
              Min. {product.min}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <button className="w-1/2 cursor-pointer text-white bg-orange-500 hover:bg-orange-600 py-1.5 rounded-lg font-medium  hover:scale-[1.02] active:scale-[0.98] transition">
                Buy
              </button>
              <button className="w-1/2 cursor-pointer bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] text-white py-1.5 rounded-lg font-semibold text-sm sm:text-lg transition duration-200 shadow">
                🛒 Add to Cart
              </button>
            </div>

            <button className="w-full border cursor-pointer border-gray-400 py-1.5 rounded-lg font-medium hover:bg-gray-300 transition">
              📄 Send Enquiry
            </button>
          </div>

          <div className="mt-4 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-sm sm:text-md mb-2">
              Product Description
            </h3>

            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description ||
                `Built for bulk procurement, this ${product.title} is designed for consistent performance and reliable quality. Suitable for regular stocking, distribution, and business use.`}
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {[
                ["Brand", product.brand || "—"],
                ["Supplier", product.company || "—"],
                ["Min. Order", product.min || "—"],
                ["Category", product.category || "—"],
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <span className="text-gray-500">{item[0]}</span>
                  <span className="font-medium text-gray-900">{item[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-sm sm:text-md mb-2">
              Product Specifications
            </h3>

            <div className="text-xs sm:text-sm">
              {[
                ["Brand", product.brand],
                ["Type", "TWS Earbuds"],
                ["Battery", "6+24hr"],
                ["Bluetooth", "5.3"],
                ["Water", "IPX5"],
                ["MOQ", product.min],
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 mb-2 last:mb-0"
                >
                  <span className="text-gray-500">{item[0]}</span>
                  <span className="font-medium text-gray-900">{item[1] || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-md">Delivery Options</h3>
              <span className="text-lg">🚚</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-gray-900">500072</span>
                <span className="text-sm text-gray-600 truncate">(Sai Krishna)</span>
                <span className="text-green-600 text-sm">✔</span>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-orange-500 hover:underline"
              >
                CHANGE
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">🚛</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Get it by <span className="font-semibold">Sat, Apr 11</span>
                  </p>
                  <p className="text-xs text-gray-500">Free delivery on eligible orders</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">💳</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Pay on delivery available
                  </p>
                  <p className="text-xs text-gray-500">COD subject to availability</p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Easy 14 days return & exchange available
                    </p>
                    <p className="text-xs text-gray-500">Conditions apply</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMoreInfoOpen(true)}
                  className="text-sm font-semibold text-orange-500 hover:underline whitespace-nowrap"
                >
                  MORE INFO →
                </button>
              </div>

              <p className="pt-2 text-sm text-gray-700">100% Original Products</p>
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">
                {supplierInitials(supplier?.name || product.company)}
              </div>
              <div>
                <p className="font-medium">{product.company}</p>
                <p className="text-xs text-gray-500">
                  {supplier
                    ? `📍 ${supplier.location} • ${supplier.category}`
                    : ""}
                </p>
              </div>
            </div>

           

{supplier ? (
  <Link href={`/suppliers/${supplier.id}`}>
    <button
      type="button"
      className="border px-4 py-2 rounded-lg border-orange-400 transition cursor-pointer text-orange-500 hover:bg-orange-50 hover:scale-105"
    >
      View Profile →
    </button>
  </Link>
) : (
  <button
    disabled
    className="border px-4 py-2 rounded-lg text-gray-400 border-gray-300 cursor-not-allowed"
  >
    View Profile →
  </button>
)}
          </div>
        </div>
      </div>

      {/* ✅ SIMILAR PRODUCTS (UNCHANGED) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold border-l-4 border-orange-500 pl-2">
            Similar Products
          </h2>
          <Link
            href="/trendingviewall"
            className="text-orange-500 text-sm cursor-pointer hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl transition group overflow-hidden"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-orange-600 font-semibold">{item.price}</p>
                <p className="text-xs text-gray-500">{item.min}</p>

                <div className="flex items-center text-xs gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{item.brand}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/trendingviewall"
        className="text-orange-500 flex justify-center text-xl cursor-pointer hover:underline"
      >
        View all →
      </Link>

      <MoreInfoDrawer />
      <WriteReviewDialog
        isWriteReviewOpen={isWriteReviewOpen}
        handleReviewDialogChange={handleReviewDialogChange}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewTitle={reviewTitle}
        setReviewTitle={setReviewTitle}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewPhotos={reviewPhotos}
        handleAddReviewPhotos={handleAddReviewPhotos}
        removeReviewPhoto={removeReviewPhoto}
        submitReview={submitReview}
      />
    </div>
  );
};

export default ProductView;