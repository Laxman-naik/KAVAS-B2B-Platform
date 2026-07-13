const pool = require("../config/db");
const uploadToCloudinary = require("../services/uploadToCloudinary");
const fs = require("fs");

/* ─── helpers ─────────────────────────────────────────────────────────── */

/** Upload a single temp file to Cloudinary and delete the temp file. */
const uploadFileAndClean = async (file, folder, resourceType) => {
  try {
    const result = await uploadToCloudinary(file.path, folder, resourceType);
    return result.url;
  } finally {
    try {
      fs.unlinkSync(file.path);
    } catch (_) {}
  }
};

/* ─── GET /api/products/:productId/reviews ───────────────────────────── */
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.image_urls,
        r.video_urls,
        u.full_name
      FROM reviews r
      LEFT JOIN users u ON u.id = r.user_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
      `,
      [productId]
    );

    res.json({
      success: true,
      reviews: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── POST /api/products/:productId/reviews ──────────────────────────── */
exports.addProductReview = async (req, res) => {
  const client = await pool.connect();

  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1 to 5" });
    }

    /* ── Upload media to Cloudinary ── */
    const files = req.files || [];

    const imageFiles = files.filter((f) =>
      f.mimetype.startsWith("image/")
    );
    const videoFiles = files.filter((f) =>
      f.mimetype.startsWith("video/")
    );

    const imageUrls = await Promise.all(
      imageFiles.map((f) =>
        uploadFileAndClean(f, "kavas/reviews/images", "image")
      )
    );

    const videoUrls = await Promise.all(
      videoFiles.map((f) =>
        uploadFileAndClean(f, "kavas/reviews/videos", "video")
      )
    );

    await client.query("BEGIN");

    /* ── Verify purchase ── */
    const bought = await client.query(
      `
      SELECT 1
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
        AND oi.product_id = $2
        AND o.status IN ('paid', 'cod', 'completed', 'delivered')
      LIMIT 1
      `,
      [userId, productId]
    );

    if (!bought.rows.length) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        message: "Only purchased users can review this product",
      });
    }

    /* ── Upsert review ── */
    const reviewRes = await client.query(
      `
      INSERT INTO reviews (product_id, user_id, rating, comment, image_urls, video_urls)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET
        rating     = EXCLUDED.rating,
        comment    = EXCLUDED.comment,
        image_urls = EXCLUDED.image_urls,
        video_urls = EXCLUDED.video_urls,
        updated_at = NOW()
      RETURNING *
      `,
      [
        productId,
        userId,
        rating,
        comment,
        imageUrls,
        videoUrls,
      ]
    );

    /* ── Refresh product aggregates ── */
    await client.query(
      `
      UPDATE products
      SET
        avg_rating = (
          SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
          FROM reviews
          WHERE product_id = $1
        ),
        total_reviews = (
          SELECT COUNT(*)
          FROM reviews
          WHERE product_id = $1
        )
      WHERE id = $1
      `,
      [productId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Review saved successfully",
      review: reviewRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};