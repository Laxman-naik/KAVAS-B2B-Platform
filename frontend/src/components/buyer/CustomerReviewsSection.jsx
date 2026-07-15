"use client";
import { useMemo, useRef, useState } from "react";
import { addProductReviewAPI } from "@/services/productService";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Flag,
  Image as ImageIcon,
  MessageSquareText,
  MoreVertical,
  Play,
  Star,
  ThumbsUp,
  Truck,
  Upload,
  Video,
  X,
  XIcon,
  Zap,
  ShieldCheck,
} from "lucide-react";

const C = {
  primary: "#0B1F3A",
  gold: "#D4AF37",
  goldLight: "#FFF8EC",
  white: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7280",
  border: "#E5E5E5",
  bg: "#F9FAFB",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  blue: "#1D4ED8",
  blueBg: "#EFF6FF",
};

const INITIAL_VISIBLE = 5;
const LOAD_MORE_COUNT = 5;
const MAX_FILES = 6;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

const formatPercent = (v) => `${Math.round(Number(v || 0))}%`;

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? "s" : ""} ago`;
};

const initials = (name) => {
  const parts = String(name || "V").trim().split(/\s+/);
  return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
};

const avatarColor = (name) => {
  const colors = ["#0B1F3A", "#1D4ED8", "#7C3AED", "#059669", "#DC2626", "#D97706"];
  let hash = 0;
  for (const ch of String(name || "")) hash = (hash * 31 + ch.charCodeAt(0)) & 0xfffffff;
  return colors[hash % colors.length];
};

const StarRow = ({ rating, size = 15 }) => {
  const rounded = Math.round(Number(rating || 0));
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          color={i < rounded ? C.gold : C.border}
          fill={i < rounded ? C.gold : "transparent"}
        />
      ))}
    </div>
  );
};

const Lightbox = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.15)", border: "none",
          borderRadius: "50%", padding: 6, cursor: "pointer",
          color: "#fff", display: "flex",
        }}
      >
        <X style={{ width: 20, height: 20 }} />
      </button>
      {item.type === "image" ? (
        <img
          src={item.src} alt="enlarged"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 8, objectFit: "contain" }}
        />
      ) : (
        <video
          src={item.src} controls autoPlay
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 8 }}
        />
      )}
    </div>
  );
};

const MediaStrip = ({ images, videos, onOpen }) => {
  const all = [
    ...images.map((src) => ({ type: "image", src })),
    ...videos.map((src) => ({ type: "video", src })),
  ];
  if (!all.length) return null;
  const visible = all.slice(0, 5);
  const extra = all.length - visible.length;

  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
      {visible.map((item, idx) => (
        <button
          key={idx} type="button"
          onClick={() => onOpen(item)}
          style={{
            position: "relative", width: 110, height: 80,
            borderRadius: 6, overflow: "hidden",
            border: `1px solid ${C.border}`,
            background: "#111", cursor: "pointer", flexShrink: 0,
            padding: 0,
          }}
        >
          {item.type === "image" ? (
            <img src={item.src} alt="review" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <video src={item.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.3)",
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.9)", borderRadius: "50%",
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Play style={{ width: 13, height: 13, color: "#000", marginLeft: 2 }} />
                </div>
              </div>
              <span style={{
                position: "absolute", bottom: 4, right: 4,
                background: "rgba(0,0,0,0.7)", color: "#fff",
                fontSize: 10, borderRadius: 3, padding: "1px 4px", fontWeight: 600,
              }}>0:{Math.floor(Math.random() * 50 + 5).toString().padStart(2, "0")}</span>
            </>
          )}
          {idx === 4 && extra > 0 && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 15,
            }}>
              +{extra}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

const UploadTile = ({ file, onRemove }) => {
  const isVideo = file.type.startsWith("video/");
  const src = URL.createObjectURL(file);
  return (
    <div style={{
      position: "relative", width: 80, height: 80,
      borderRadius: 8, overflow: "hidden",
      border: `1.5px solid ${C.border}`, background: "#f0f0f0", flexShrink: 0,
    }}>
      {isVideo ? (
        <>
          <video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
          <span style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
          }}>
            <Play style={{ color: "#fff", width: 16, height: 16 }} />
          </span>
        </>
      ) : (
        <img src={src} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <button type="button" onClick={onRemove} style={{
        position: "absolute", top: 3, right: 3,
        background: "rgba(0,0,0,0.55)", border: "none",
        borderRadius: "50%", padding: 3, cursor: "pointer", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <X style={{ width: 11, height: 11 }} />
      </button>
      <span style={{
        position: "absolute", bottom: 3, left: 3,
        background: isVideo ? C.primary : C.gold, color: "#fff",
        fontSize: 8, borderRadius: 3, padding: "1px 4px", fontWeight: 700, textTransform: "uppercase",
      }}>{isVideo ? "VID" : "IMG"}</span>
    </div>
  );
};

export default function CustomerReviewsSection({ product }) {
  /* state */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const fileInputRef = useRef(null);


  const averageRating = Number(product?.avg_rating || 0);
  const totalReviews = Number(product?.total_reviews || 0);
  const rawReviews = Array.isArray(product?.reviews) ? product.reviews : [];


  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (rawReviews.length > 0) {
      rawReviews.forEach((r) => {
        const star = Math.max(1, Math.min(5, Math.round(Number(r.rating))));
        counts[star] = (counts[star] || 0) + 1;
      });
    } else if (totalReviews > 0 && averageRating > 0) {
      const rounded = Math.max(1, Math.min(5, Math.round(averageRating)));
      counts[rounded] = totalReviews;
    }
    return counts;
  }, [rawReviews, averageRating, totalReviews]);

  const recommendPercent = useMemo(() => {
    if (!rawReviews.length) return averageRating >= 4 ? 96 : 0;
    const good = rawReviews.filter((r) => Number(r.rating) >= 4).length;
    return Math.round((good / rawReviews.length) * 100);
  }, [rawReviews, averageRating]);


  const allMedia = useMemo(() => {
    const items = [];
    rawReviews.forEach((r) => {
      (r.image_urls || []).forEach((src) => items.push({ type: "image", src }));
      (r.video_urls || []).forEach((src) => items.push({ type: "video", src }));
    });
    return items;
  }, [rawReviews]);

  const filteredReviews = useMemo(() => {
    let list = [...rawReviews];
    if (filter === "photos") list = list.filter((r) => (r.image_urls || []).length > 0);
    if (filter === "videos") list = list.filter((r) => (r.video_urls || []).length > 0);
    if (sort === "highest") list.sort((a, b) => Number(b.rating) - Number(a.rating));
    else if (sort === "lowest") list.sort((a, b) => Number(a.rating) - Number(b.rating));
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return list;
  }, [rawReviews, filter, sort]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  const withPhotoCount = rawReviews.filter((r) => (r.image_urls || []).length > 0).length;
  const withVideoCount = rawReviews.filter((r) => (r.video_urls || []).length > 0).length;


  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type) || ACCEPTED_VIDEO_TYPES.includes(f.type)
    );
    setMediaFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  };
  const removeFile = (i) => setMediaFiles((prev) => prev.filter((_, idx) => idx !== i));
  const handleFileInput = (e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); };


  const resetDialog = () => { setReviewRating(0); setReviewComment(""); setMediaFiles([]); setIsSubmitting(false); };
  const handleOpenChange = (open) => { setIsDialogOpen(open); if (!open) resetDialog(); };

  const isSubmitDisabled = !reviewRating || !reviewComment.trim() || isSubmitting;

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    setIsSubmitting(true);
    try {
      if (mediaFiles.length > 0) {
        const form = new FormData();
        form.append("rating", reviewRating);
        form.append("comment", reviewComment);
        mediaFiles.forEach((f) => form.append("media", f));
        await addProductReviewAPI(product.id, form);
      } else {
        await addProductReviewAPI(product.id, { rating: reviewRating, comment: reviewComment });
      }
      setIsDialogOpen(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || reviewRating;
  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];


  const highlights = [
    { icon: <ShieldCheck style={{ width: 20, height: 20, color: C.primary }} />, title: "Good quality product", sub: "Most customers liked the quality" },
    { icon: <Truck style={{ width: 20, height: 20, color: C.primary }} />, title: "Value for money", sub: "Customers find it worth the price" },
    { icon: <Zap style={{ width: 20, height: 20, color: C.primary }} />, title: "Fast delivery", sub: "Customers are happy with delivery" },
  ];

  return (
    <>

      <section style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>


        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MessageSquareText style={{ width: 20, height: 20, color: C.primary }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
              Customer Reviews
              {totalReviews > 0 && (
                <span style={{ color: C.muted, fontWeight: 500, marginLeft: 6 }}>({totalReviews})</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            style={{
              background: C.primary, color: "#fff", border: "none",
              borderRadius: 6, padding: "9px 20px", fontSize: 13,
              fontWeight: 600, cursor: "pointer",
            }}
          >
            Write a Review
          </button>
        </div>


        <div style={{
          display: "grid", gridTemplateColumns: "220px 1fr 260px",
          gap: 0, borderBottom: `1px solid ${C.border}`,
        }}>

          <div style={{ padding: "20px 24px", borderRight: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 48, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>
              {averageRating > 0 ? averageRating.toFixed(1) : "—"}
            </p>
            <div style={{ marginTop: 6 }}>
              <StarRow rating={averageRating} size={16} />
            </div>
            <p style={{ marginTop: 8, fontSize: 12, color: C.muted }}>
              Based on {totalReviews} rating{totalReviews !== 1 ? "s" : ""}
            </p>
            <p style={{ marginTop: 6, fontSize: 12, color: C.muted }}>
              <strong style={{ color: C.text }}>{recommendPercent}%</strong> of customers<br />recommend this product
            </p>
          </div>


          <div style={{ padding: "20px 24px", borderRight: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", height: "100%" }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star] || 0;
                const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: C.muted, width: 20, textAlign: "right", flexShrink: 0 }}>{star}</span>
                    <Star style={{ width: 11, height: 11, flexShrink: 0 }} color={C.gold} fill={C.gold} />
                    <div style={{ flex: 1, height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: C.gold, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 12, color: C.muted, width: 32, textAlign: "right", flexShrink: 0 }}>{formatPercent(pct)}</span>
                  </div>
                );
              })}
            </div>
          </div>


          <div style={{ padding: "16px 20px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {highlights.map((h) => (
                <div key={h.title} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: "#F1F5F9",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {h.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{h.title}</p>
                    <p style={{ fontSize: 11, color: C.muted }}>{h.sub}</p>
                  </div>
                </div>
              ))}
            </div>


            {allMedia.length > 0 && (
              <>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 8 }}>Top Reviews</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {allMedia.slice(0, 4).map((m, idx) => (
                    <button
                      key={idx} type="button"
                      onClick={() => setLightbox(m)}
                      style={{
                        width: 52, height: 52, borderRadius: 6, overflow: "hidden",
                        border: `1px solid ${C.border}`, background: "#111", cursor: "pointer",
                        position: "relative", padding: 0, flexShrink: 0,
                      }}
                    >
                      {m.type === "image" ? (
                        <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <>
                          <video src={m.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Play style={{ width: 14, height: 14, color: "#fff" }} />
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                  {allMedia.length > 4 && (
                    <div style={{
                      width: 52, height: 52, borderRadius: 6,
                      background: "#1E293B", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700,
                    }}>
                      +{allMedia.length - 4}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setFilter("photos")}
                  style={{ marginTop: 8, fontSize: 12, color: C.blue, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  View all photos &amp; videos
                </button>
              </>
            )}
          </div>
        </div>


        <div className="flex items-center justify-between gap-4 px-5 border-b border-gray-100">
          <div className="flex">
            {[
              { key: "all", label: `All Reviews (${totalReviews || rawReviews.length})` },
              { key: "photos", label: `With Photos (${withPhotoCount})` },
              { key: "videos", label: `With Videos (${withVideoCount})` },
            ].map((tab) => (
              <button
                key={tab.key} type="button"
                onClick={() => { setFilter(tab.key); setVisibleCount(INITIAL_VISIBLE); }}
                className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-[2.5px] transition-colors ${
                  filter === tab.key
                    ? "text-[#0B1F3A] border-[#0B1F3A]"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setVisibleCount(INITIAL_VISIBLE); }}
            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white cursor-pointer outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleReviews.length > 0 ? (
            visibleReviews.map((review, idx) => {
              const imageItems = review.image_urls || [];
              const videoItems = review.video_urls || [];
              const hasMedia = imageItems.length > 0 || videoItems.length > 0;

              return (
                <div
                  key={review.id}
                  className={`flex gap-4 px-5 py-4 ${
                    idx < visibleReviews.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>

                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: avatarColor(review.full_name),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
                      }}>
                        {initials(review.full_name)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                            {review.full_name || "Verified Buyer"}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: C.green, fontWeight: 600 }}>
                            <BadgeCheck style={{ width: 13, height: 13 }} />
                            Verified Purchase
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                          <StarRow rating={review.rating} size={13} />
                          <span style={{ fontSize: 11, color: C.muted }}>
                            · {review.created_at ? timeAgo(review.created_at) : "Recently"}
                          </span>
                        </div>
                      </div>


                      <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4, flexShrink: 0 }}>
                        <MoreVertical style={{ width: 16, height: 16 }} />
                      </button>
                    </div>


                    <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 0 }}>
                      {review.comment}
                    </p>

                    {hasMedia && (
                      <MediaStrip
                        images={imageItems}
                        videos={videoItems}
                        onOpen={setLightbox}
                      />
                    )}



                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <MessageSquareText className="w-9 h-9 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">
                {filter === "all" ? "No reviews yet" : `No reviews with ${filter} yet`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {filter === "all" ? "Be the first to review this product." : "Try a different filter."}
              </p>
            </div>
          )}
        </div>

        {/* Load More / Show Less */}
        {hasMore ? (
          <div className="flex justify-center border-t border-gray-100 py-4">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A] transition-all duration-200"
            >
              Show more reviews
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : filteredReviews.length > INITIAL_VISIBLE ? (
          <div className="flex justify-center border-t border-gray-100 py-4">
            <button
              type="button"
              onClick={() => setVisibleCount(INITIAL_VISIBLE)}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Show less
            </button>
          </div>
        ) : null}
      </section>

      {/* ── Write Review Dialog ── */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl" style={{ maxHeight: "90vh", overflowY: "auto", padding: 0 }}>

          {/* Header */}
          <div style={{
            padding: "18px 22px 14px",
            borderBottom: `1px solid ${C.border}`,
            position: "sticky", top: 0, background: C.white, zIndex: 10,
          }}>
            <DialogTitle style={{ fontSize: 15, fontWeight: 700, color: C.primary, margin: 0 }}>
              Write a Review
            </DialogTitle>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
              Share your experience — photos &amp; videos welcome
            </p>
          </div>

          <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Star rating */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                Your Rating <span style={{ color: "#ef4444" }}>*</span>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      key={val} type="button"
                      onClick={() => setReviewRating(val)}
                      onMouseEnter={() => setHoverRating(val)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                    >
                      <Star
                        style={{ width: 28, height: 28 }}
                        color={val <= activeRating ? C.gold : C.border}
                        fill={val <= activeRating ? C.gold : "transparent"}
                      />
                    </button>
                  );
                })}
                {activeRating > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: C.gold }}>
                    {ratingLabels[activeRating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                Review <span style={{ color: "#ef4444" }}>*</span>
              </p>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell others what you think about this product..."
                rows={4}
                style={{
                  width: "100%", resize: "vertical",
                  border: `1px solid ${C.border}`, borderRadius: 6,
                  padding: "9px 12px", fontSize: 13, color: C.text,
                  outline: "none", boxSizing: "border-box", fontFamily: "inherit", minHeight: 100,
                }}
              />
            </div>

            {/* Media upload */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Add Photos &amp; Videos</p>
                <span style={{ fontSize: 11, color: C.muted }}>{mediaFiles.length}/{MAX_FILES}</span>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => mediaFiles.length < MAX_FILES && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? C.blue : C.border}`,
                  borderRadius: 10, padding: "18px 16px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  cursor: mediaFiles.length < MAX_FILES ? "pointer" : "not-allowed",
                  background: isDragging ? "#EFF6FF" : "#FAFAFA",
                  transition: "all 0.2s",
                  opacity: mediaFiles.length >= MAX_FILES ? 0.6 : 1,
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ background: C.goldLight, borderRadius: 8, padding: 8, display: "flex" }}>
                    <ImageIcon style={{ width: 18, height: 18, color: C.gold }} />
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 8, padding: 8, display: "flex" }}>
                    <Video style={{ width: 18, height: 18, color: C.primary }} />
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                    <span style={{ color: C.blue }}>Click to upload</span> or drag &amp; drop
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    JPG, PNG, WEBP, GIF, MP4, WEBM — up to {MAX_FILES} files
                  </p>
                </div>
                <input
                  ref={fileInputRef} type="file" multiple
                  accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(",")}
                  style={{ display: "none" }} onChange={handleFileInput}
                />
              </div>

              {mediaFiles.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {mediaFiles.map((file, idx) => (
                    <UploadTile key={idx} file={file} onRemove={() => removeFile(idx)} />
                  ))}
                  {mediaFiles.length < MAX_FILES && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} style={{
                      width: 80, height: 80, borderRadius: 8,
                      border: `2px dashed ${C.border}`, background: "#FAFAFA",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: 4, cursor: "pointer", color: C.muted, flexShrink: 0,
                    }}>
                      <Upload style={{ width: 16, height: 16 }} />
                      <span style={{ fontSize: 10, fontWeight: 600 }}>Add more</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                style={{
                  flex: 1, border: `1px solid ${C.border}`, borderRadius: 6,
                  padding: "10px 16px", fontSize: 13, fontWeight: 600,
                  color: C.text, background: C.white, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
                style={{
                  flex: 1, border: "none", borderRadius: 6,
                  padding: "10px 16px", fontSize: 13, fontWeight: 600,
                  color: "#fff",
                  background: isSubmitDisabled ? "#9CA3AF" : C.primary,
                  cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Close X */}
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            style={{
              position: "absolute", right: 12, top: 12,
              background: "rgba(0,0,0,0.06)", border: "none",
              borderRadius: "50%", padding: 5, cursor: "pointer",
              display: "flex", color: C.text,
            }}
          >
            <XIcon style={{ width: 15, height: 15 }} />
          </button>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}