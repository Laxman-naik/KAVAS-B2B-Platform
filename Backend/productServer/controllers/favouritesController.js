const db = require("../config/db");

/* ================= HELPERS ================= */

// ensures one favourites row per user (atomic)
const getOrCreateFavouriteId = async (userId) => {
  const result = await db.query(
    `
    INSERT INTO favourites (user_id)
    VALUES ($1)
    ON CONFLICT (user_id)
    DO UPDATE SET user_id = EXCLUDED.user_id
    RETURNING id
    `,
    [userId]
  );

  return result.rows[0].id;
};

// get favouriteId only (no insert)
const getFavouriteId = async (userId) => {
  const result = await db.query(
    `SELECT id FROM favourites WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0]?.id;
};

/* ================= CONTROLLERS ================= */

exports.getFavourites = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const result = await db.query(
      `
      SELECT fi.product_id
      FROM favourites f
      JOIN favourite_items fi ON fi.favourite_id = f.id
      WHERE f.user_id = $1
      ORDER BY fi.created_at DESC
      `,
      [userId]
    );

    res.json({
      favourites: result.rows.map((r) => r.product_id),
    });
  } catch (error) {
    console.error("getFavourites error:", error);
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
};

exports.addToFavourites = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const favouriteId = await getOrCreateFavouriteId(userId);

    await db.query(
      `
      INSERT INTO favourite_items (favourite_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (favourite_id, product_id) DO NOTHING
      `,
      [favouriteId, productId]
    );

    res.json({ productId });
  } catch (error) {
    console.error("addToFavourites error:", error);
    res.status(500).json({ message: "Failed to add to favourites" });
  }
};

exports.removeFromFavourites = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { productId } = req.params;

    const favouriteId = await getFavouriteId(userId);

    if (!favouriteId) {
      return res.json({ productId });
    }

    await db.query(
      `
      DELETE FROM favourite_items
      WHERE favourite_id = $1 AND product_id = $2
      `,
      [favouriteId, productId]
    );

    res.json({ productId });
  } catch (error) {
    console.error("removeFromFavourites error:", error);
    res.status(500).json({ message: "Failed to remove from favourites" });
  }
};

exports.clearFavourites = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const favouriteId = await getFavouriteId(userId);

    if (favouriteId) {
      await db.query(
        `DELETE FROM favourite_items WHERE favourite_id = $1`,
        [favouriteId]
      );
    }

    res.json({ favourites: [] });
  } catch (error) {
    console.error("clearFavourites error:", error);
    res.status(500).json({ message: "Failed to clear favourites" });
  }
};