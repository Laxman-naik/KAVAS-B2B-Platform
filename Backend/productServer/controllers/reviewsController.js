exports.createReview = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user?.id || null;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: "productId and rating required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    await client.query("BEGIN");

    // ✅ prevent duplicate review (optional but recommended)
    if (userId) {
      const existing = await client.query(
        `SELECT 1 FROM reviews WHERE product_id = $1 AND user_id = $2`,
        [productId, userId]
      );

      if (existing.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Already reviewed" });
      }
    }

    // ✅ insert review
    await client.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)`,
      [productId, userId, rating, comment]
    );

    // ✅ update product rating (IMPORTANT)
    await client.query(
      `UPDATE products
       SET 
         avg_rating = (
           SELECT COALESCE(AVG(rating), 0)
           FROM reviews WHERE product_id = $1
         ),
         total_reviews = (
           SELECT COUNT(*)
           FROM reviews WHERE product_id = $1
         )
       WHERE id = $1`,
      [productId]
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "Review added" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createReview error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `SELECT id, rating, comment, created_at
       FROM reviews
       WHERE product_id = $1
       ORDER BY created_at DESC`,
      [productId]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("getProductReviews error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  const client = await pool.connect();

  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    await client.query("BEGIN");

    const reviewRes = await client.query(
      `SELECT product_id FROM reviews WHERE id = $1`,
      [reviewId]
    );

    if (!reviewRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = reviewRes.rows[0].product_id;

    await client.query(
      `UPDATE reviews
       SET rating = $1, comment = $2
       WHERE id = $3`,
      [rating, comment, reviewId]
    );

    // ✅ recalc rating
    await client.query(
      `UPDATE products
       SET 
         avg_rating = (
           SELECT COALESCE(AVG(rating), 0)
           FROM reviews WHERE product_id = $1
         ),
         total_reviews = (
           SELECT COUNT(*)
           FROM reviews WHERE product_id = $1
         )
       WHERE id = $1`,
      [productId]
    );

    await client.query("COMMIT");

    res.json({ message: "Review updated" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updateReview error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.deleteReview = async (req, res) => {
  const client = await pool.connect();

  try {
    const { reviewId } = req.params;

    await client.query("BEGIN");

    const reviewRes = await client.query(
      `SELECT product_id FROM reviews WHERE id = $1`,
      [reviewId]
    );

    if (!reviewRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = reviewRes.rows[0].product_id;

    await client.query(
      `DELETE FROM reviews WHERE id = $1`,
      [reviewId]
    );

    // ✅ recalc rating
    await client.query(
      `UPDATE products
       SET 
         avg_rating = (
           SELECT COALESCE(AVG(rating), 0)
           FROM reviews WHERE product_id = $1
         ),
         total_reviews = (
           SELECT COUNT(*)
           FROM reviews WHERE product_id = $1
         )
       WHERE id = $1`,
      [productId]
    );

    await client.query("COMMIT");

    res.json({ message: "Review deleted" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("deleteReview error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};