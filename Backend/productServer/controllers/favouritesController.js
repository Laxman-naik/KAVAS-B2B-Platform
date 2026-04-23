const db = require("../config/db");

exports.getFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `
      SELECT fi.product_id
      FROM favourites f
      JOIN favourite_items fi ON fi.favourite_id = f.id
      WHERE f.user_id = $1
      ORDER BY fi.id DESC
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
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    // get or create favourites row
    let result = await db.query(
      `SELECT id FROM favourites WHERE user_id = $1`,
      [userId]
    );

    let favouriteId;

    if (result.rows.length === 0) {
      const created = await db.query(
        `
        INSERT INTO favourites (user_id)
        VALUES ($1)
        RETURNING id
        `,
        [userId]
      );
      favouriteId = created.rows[0].id;
    } else {
      favouriteId = result.rows[0].id;
    }

    // insert safely (no duplicates)
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
    const userId = req.user.id;
    const { productId } = req.params;

    const result = await db.query(
      `SELECT id FROM favourites WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ productId });
    }

    const favouriteId = result.rows[0].id;

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
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id FROM favourites WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      const favouriteId = result.rows[0].id;

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