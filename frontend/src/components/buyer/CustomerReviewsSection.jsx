"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, MessageSquareText, Star, XIcon } from "lucide-react";

const COLORS = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  cream: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  border: "#E5E5E5",
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const initialsFromName = (name) =>
  String(name || "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

const formatPercent = (value) => `${Math.round(Number(value || 0))}%`;

const StarRow = ({ rating, size = 16 }) => {
  const rounded = Math.round(Number(rating || 0));

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rounded} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ height: size, width: size }}
          className={i < rounded ? "" : ""}
          color={i < rounded ? COLORS.gold : COLORS.border}
          fill={i < rounded ? COLORS.gold : "transparent"}
        />
      ))}
    </div>
  );
};

const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Rahul Agarwal",
    verified: true,
    rating: 5,
    title: "Excellent sound quality!",
    comment:
      "The sound quality is amazing with deep bass and crystal clear calls. The noise cancellation works really well. Battery backup is also great.",
    variant: "Pro Max / White",
    timeAgo: "2 days ago",
    helpful: 12,
  },
  {
    id: "r2",
    name: "Priya Sharma",
    verified: true,
    rating: 4,
    title: "Very good product",
    comment:
      "Great product at this price. Comfortable to wear and easy to connect. Touch controls work smoothly.",
    variant: "Pro Max / Black",
    timeAgo: "1 week ago",
    helpful: 8,
  },
];

export default function CustomerReviewsSection() {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    MOCK_REVIEWS.forEach((r) => {
      const key = clamp(Math.round(Number(r.rating || 0)), 1, 5);
      counts[key] += 1;
    });
    return counts;
  }, []);

  const totalReviews = useMemo(() => MOCK_REVIEWS.length, []);

  const averageRating = useMemo(() => {
    if (!totalReviews) return 0;
    const sum = MOCK_REVIEWS.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / totalReviews;
  }, [totalReviews]);

  const recommendPercent = useMemo(() => {
    if (!totalReviews) return 0;
    const recommend = MOCK_REVIEWS.filter((r) => Number(r.rating || 0) >= 4).length;
    return (recommend / totalReviews) * 100;
  }, [totalReviews]);

  const resetWriteReview = () => {
    setReviewRating(0);
    setReviewTitle("");
    setReviewComment("");
  };

  const handleWriteReviewOpenChange = (open) => {
    setIsWriteReviewOpen(open);
    if (!open) resetWriteReview();
  };

  const isSubmitDisabled = !reviewRating || !reviewComment.trim();

  return (
    <>
      <section className="rounded-sm border bg-white" style={{ borderColor: COLORS.border }}>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm" style={{ background: COLORS.cream }}>
                <MessageSquareText className="h-5 w-5" style={{ color: COLORS.primary }} />
              </div>
              <h2 className="text-sm font-bold" style={{ color: COLORS.text }}>
                Customer Reviews
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(true)}
                className="rounded-sm border px-4 py-2 text-xs font-semibold"
                style={{ borderColor: COLORS.primary, color: COLORS.primary, background: COLORS.white }}
              >
                Write a review
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[240px_240px_1fr]">
            <div className="rounded-sm border p-5" style={{ borderColor: COLORS.border, background: COLORS.cream }}>
              <p className="text-4xl font-extrabold" style={{ color: COLORS.primary }}>
                {averageRating.toFixed(1)}
              </p>
              <div className="mt-2">
                <StarRow rating={averageRating} size={14} />
              </div>
              <p className="mt-2 text-xs" style={{ color: COLORS.text, opacity: 0.7 }}>
                {totalReviews} Ratings
              </p>
              <p className="mt-2 text-xs" style={{ color: COLORS.text, opacity: 0.7 }}>
                {formatPercent(recommendPercent)} recommend this product
              </p>
            </div>

            <div className="rounded-sm border p-5" style={{ borderColor: COLORS.border, background: COLORS.white }}>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const percent = totalReviews ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={star} className="grid grid-cols-[14px_1fr_42px] items-center gap-2">
                      <div className="text-xs font-semibold" style={{ color: COLORS.text, opacity: 0.7 }}>
                        {star}
                      </div>
                      <div className="h-2 overflow-hidden rounded-full" style={{ background: COLORS.border }}>
                        <div className="h-2 rounded-full" style={{ width: `${percent}%`, background: COLORS.gold }} />
                      </div>
                      <div className="text-right text-xs" style={{ color: COLORS.text, opacity: 0.7 }}>
                        {formatPercent(percent)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3">
              {MOCK_REVIEWS.slice(0, 2).map((r) => (
                <div key={r.id} className="rounded-sm border p-4" style={{ borderColor: COLORS.border, background: COLORS.white }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ background: COLORS.cream, color: COLORS.primary }}
                      >
                        <span className="text-xs font-bold">{initialsFromName(r.name)}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-xs font-semibold" style={{ color: COLORS.text }}>{r.name}</p>
                          <p className="text-[11px] font-semibold" style={{ color: COLORS.text, opacity: 0.55 }}>
                            Verified Buyer
                          </p>
                        </div>
                        <div className="mt-1">
                          <StarRow rating={r.rating} size={14} />
                        </div>
                        <p className="mt-2 text-xs" style={{ color: COLORS.text, opacity: 0.7 }}>
                          {r.comment}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px]" style={{ color: COLORS.text, opacity: 0.6 }}>
                      {r.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold"
              style={{ color: COLORS.primary }}
            >
              View All Reviews
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: COLORS.border }} />
      </section>

      <Dialog open={isWriteReviewOpen} onOpenChange={handleWriteReviewOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle className="text-base font-semibold">Write a review</DialogTitle>

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
                      aria-label={`Rate ${value} star`}
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
              placeholder="Review title"
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
                onClick={() => setIsWriteReviewOpen(false)}
                className="w-1/2 rounded-sm px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: COLORS.primary }}
              >
                Submit
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute right-3 top-3 rounded-sm p-1"
              style={{ color: COLORS.text, opacity: 0.7 }}
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
