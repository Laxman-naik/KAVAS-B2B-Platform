"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MessageSquareText, Star, XIcon } from "lucide-react";

import {
  fetchProductReviews,
  submitProductReview,
} from "@/store/slices/productSlice";

const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const formatPercent = (value) => `${Math.round(Number(value || 0))}%`;

const StarRow = ({ rating, size = 16 }) => {
  const rounded = Math.round(Number(rating || 0));

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ height: size, width: size }}
          color={i < rounded ? COLORS.gold : COLORS.border}
          fill={i < rounded ? COLORS.gold : "transparent"}
        />
      ))}
    </div>
  );
};

export default function CustomerReviewsSection({ product }) {
  const dispatch = useDispatch();

  const { reviews, reviewSummary, reviewLoading, error } = useSelector(
    (state) => state.products
  );

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchProductReviews(product.id));
    }
  }, [dispatch, product?.id]);

  const averageRating = Number(reviewSummary?.avg_rating || 0);
  const totalReviews = Number(reviewSummary?.total_reviews || 0);

  const recommendPercent = useMemo(() => {
    if (!totalReviews || !averageRating) return 0;
    return averageRating >= 4 ? 100 : 0;
  }, [averageRating, totalReviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews?.forEach((review) => {
      const rating = Number(review.rating);

      if (rating >= 1 && rating <= 5) {
        counts[rating] += 1;
      }
    });

    return counts;
  }, [reviews]);

  const resetWriteReview = () => {
    setReviewRating(0);
    setReviewTitle("");
    setReviewComment("");
    setLocalError("");
  };

  const handleWriteReviewOpenChange = (open) => {
    setIsWriteReviewOpen(open);

    if (!open) {
      resetWriteReview();
    }
  };

  const isSubmitDisabled =
    !reviewRating || !reviewComment.trim() || reviewLoading;

  const handleSubmitReview = async () => {
    try {
      setLocalError("");

      if (!product?.id) {
        setLocalError("Product ID missing.");
        return;
      }

      await dispatch(
        submitProductReview({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment,
        })
      ).unwrap();

      setIsWriteReviewOpen(false);
      resetWriteReview();
    } catch (err) {
      setLocalError(
        err?.message ||
          err?.message?.message ||
          err?.data?.message ||
          "Failed to submit review."
      );
    }
  };

  return (
    <>
      <section
        className="rounded-sm border bg-white"
        style={{ borderColor: COLORS.border }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-sm"
                style={{ background: COLORS.cream }}
              >
                <MessageSquareText
                  className="h-5 w-5"
                  style={{ color: COLORS.primary }}
                />
              </div>

              <h2 className="text-sm font-bold" style={{ color: COLORS.text }}>
                Customer Reviews
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(true)}
              className="rounded-sm border px-4 py-2 text-xs font-semibold"
              style={{
                borderColor: COLORS.primary,
                color: COLORS.primary,
                background: COLORS.white,
              }}
            >
              Write a review
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[240px_240px_1fr]">
            <div
              className="rounded-sm border p-5"
              style={{ borderColor: COLORS.border, background: COLORS.cream }}
            >
              <p
                className="text-4xl font-extrabold"
                style={{ color: COLORS.primary }}
              >
                {averageRating.toFixed(1)}
              </p>

              <div className="mt-2">
                <StarRow rating={averageRating} size={14} />
              </div>

              <p
                className="mt-2 text-xs"
                style={{ color: COLORS.text, opacity: 0.7 }}
              >
                {totalReviews} Ratings
              </p>

              <p
                className="mt-2 text-xs"
                style={{ color: COLORS.text, opacity: 0.7 }}
              >
                {formatPercent(recommendPercent)} recommend this product
              </p>
            </div>

            <div
              className="rounded-sm border p-5"
              style={{ borderColor: COLORS.border, background: COLORS.white }}
            >
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const percent = totalReviews
                    ? (count / totalReviews) * 100
                    : 0;

                  return (
                    <div
                      key={star}
                      className="grid grid-cols-[14px_1fr_42px] items-center gap-2"
                    >
                      <div
                        className="text-xs font-semibold"
                        style={{ color: COLORS.text, opacity: 0.7 }}
                      >
                        {star}
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full"
                        style={{ background: COLORS.border }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${percent}%`,
                            background: COLORS.gold,
                          }}
                        />
                      </div>

                      <div
                        className="text-right text-xs"
                        style={{ color: COLORS.text, opacity: 0.7 }}
                      >
                        {formatPercent(percent)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="rounded-sm border p-5"
              style={{ borderColor: COLORS.border, background: COLORS.white }}
            >
              {reviews?.length > 0 ? (
                <div className="max-h-[220px] space-y-4 overflow-y-auto pr-2">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-3 last:border-b-0"
                      style={{ borderColor: COLORS.border }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: COLORS.text }}
                        >
                          {review.user_name || "Customer"}
                        </p>

                        <StarRow rating={review.rating} size={13} />
                      </div>

                      <p
                        className="mt-2 text-sm leading-6"
                        style={{ color: COLORS.text, opacity: 0.75 }}
                      >
                        {review.comment}
                      </p>

                      <p
                        className="mt-1 text-[11px]"
                        style={{ color: COLORS.text, opacity: 0.5 }}
                      >
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    No reviews yet
                  </p>

                  <p
                    className="mt-2 text-sm"
                    style={{ color: COLORS.text, opacity: 0.7 }}
                  >
                    Be the first to review this product.
                  </p>
                </div>
              )}
            </div>
          </div>

          {error?.message && (
            <p className="mt-3 text-xs text-red-600">{error.message}</p>
          )}
        </div>

        <div className="border-t" style={{ borderColor: COLORS.border }} />
      </section>

      <Dialog open={isWriteReviewOpen} onOpenChange={handleWriteReviewOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-base font-semibold">
            Write a review
          </DialogTitle>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                Rating
              </p>

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
                    >
                      <Star
                        className="h-7 w-7"
                        color={active ? COLORS.gold : COLORS.border}
                        fill={active ? COLORS.gold : "transparent"}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Review title optional"
              className="w-full rounded-sm border px-3 py-2 text-sm outline-none"
              style={{ borderColor: COLORS.border }}
            />

            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review..."
              rows={4}
              className="w-full resize-none rounded-sm border px-3 py-2 text-sm outline-none"
              style={{ borderColor: COLORS.border }}
            />

            {localError && (
              <p className="text-xs font-medium text-red-600">{localError}</p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(false)}
                className="w-1/2 rounded-sm border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitDisabled}
                onClick={handleSubmitReview}
                className="w-1/2 rounded-sm px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: COLORS.primary }}
              >
                {reviewLoading ? "Submitting..." : "Submit"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute right-3 top-3 rounded-sm p-1"
              style={{ color: COLORS.text, opacity: 0.7 }}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}