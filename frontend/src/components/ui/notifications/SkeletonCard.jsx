"use client";

import React from "react";

/**
 * SkeletonCard — animated shimmer placeholder for a notification card.
 * @param {{ compact?: boolean }} props
 *   compact: true → smaller dropdown-style skeleton
 *            false → full-page card skeleton (default)
 */
export default function SkeletonCard({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-0">
        {/* Icon placeholder */}
        <div className="skeleton-shimmer shrink-0 h-9 w-9 rounded-xl" />
        {/* Text */}
        <div className="flex-1 min-w-0 space-y-2 pt-0.5">
          <div className="skeleton-shimmer h-3.5 w-4/5 rounded" />
          <div className="skeleton-shimmer h-3 w-full rounded" />
          <div className="skeleton-shimmer h-3 w-2/3 rounded" />
          <div className="skeleton-shimmer h-2.5 w-1/4 rounded mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Large icon placeholder */}
        <div className="skeleton-shimmer shrink-0 h-12 w-12 rounded-2xl" />

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="skeleton-shimmer h-4 w-1/3 rounded" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          </div>
          <div className="skeleton-shimmer h-3.5 w-3/4 rounded" />
          <div className="skeleton-shimmer h-3.5 w-full rounded" />
          <div className="skeleton-shimmer h-3.5 w-2/3 rounded" />
          <div className="flex items-center justify-between pt-1">
            <div className="skeleton-shimmer h-3 w-20 rounded" />
            <div className="skeleton-shimmer h-7 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
