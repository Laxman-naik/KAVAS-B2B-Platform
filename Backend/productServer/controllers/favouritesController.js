const db = require("../config/db");

// GET favourites
exports.getFavourites = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;

    const result = await db.query(
      `
      SELECT p.*
      FROM favourites f
      JOIN favourite_items fi ON fi.favourite_id = f.id
      JOIN products p ON p.id = fi.product_id
      WHERE f.organization_id = $1
      ORDER BY fi.id DESC
      `,
      [organizationId]
    );

    res.status(200).json({
      favourites: result.rows,
    });
  } catch (error) {
    console.error("getFavourites error:", error);
    res.status(500).json({ message: "Failed to fetch favourites" });
  }
};

// ADD to favourites
exports.addToFavourites = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    let favouriteResult = await db.query(
      `SELECT id FROM favourites WHERE organization_id = $1`,
      [organizationId]
    );

    let favouriteId;

    if (favouriteResult.rows.length === 0) {
      const createdFavourite = await db.query(
        `INSERT INTO favourites (organization_id) VALUES ($1) RETURNING id`,
        [organizationId]
      );
      favouriteId = createdFavourite.rows[0].id;
    } else {
      favouriteId = favouriteResult.rows[0].id;
    }

    const exists = await db.query(
      `SELECT id FROM favourite_items WHERE favourite_id = $1 AND product_id = $2`,
      [favouriteId, productId]
    );

    if (exists.rows.length === 0) {
      await db.query(
        `INSERT INTO favourite_items (favourite_id, product_id) VALUES ($1, $2)`,
        [favouriteId, productId]
      );
    }

    const result = await db.query(
      `
      SELECT p.*
      FROM favourites f
      JOIN favourite_items fi ON fi.favourite_id = f.id
      JOIN products p ON p.id = fi.product_id
      WHERE f.organization_id = $1
      ORDER BY fi.id DESC
      `,
      [organizationId]
    );

    res.status(200).json({
      favourites: result.rows,
    });
  } catch (error) {
    console.error("addToFavourites error:", error);
    res.status(500).json({ message: "Failed to add to favourites" });
  }
};

// REMOVE from favourites
exports.removeFromFavourites = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const { productId } = req.params;

    const favouriteResult = await db.query(
      `SELECT id FROM favourites WHERE organization_id = $1`,
      [organizationId]
    );

    if (favouriteResult.rows.length === 0) {
      return res.status(200).json({ favourites: [] });
    }

    const favouriteId = favouriteResult.rows[0].id;

    await db.query(
      `DELETE FROM favourite_items WHERE favourite_id = $1 AND product_id = $2`,
      [favouriteId, productId]
    );

    const result = await db.query(
      `
      SELECT p.*
      FROM favourites f
      JOIN favourite_items fi ON fi.favourite_id = f.id
      JOIN products p ON p.id = fi.product_id
      WHERE f.organization_id = $1
      ORDER BY fi.id DESC
      `,
      [organizationId]
    );

    res.status(200).json({
      favourites: result.rows,
    });
  } catch (error) {
    console.error("removeFromFavourites error:", error);
    res.status(500).json({ message: "Failed to remove from favourites" });
  }
};

// CLEAR all favourites
exports.clearFavourites = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;

    const favouriteResult = await db.query(
      `SELECT id FROM favourites WHERE organization_id = $1`,
      [organizationId]
    );

    if (favouriteResult.rows.length > 0) {
      const favouriteId = favouriteResult.rows[0].id;

      await db.query(
        `DELETE FROM favourite_items WHERE favourite_id = $1`,
        [favouriteId]
      );
    }

    res.status(200).json({
      favourites: [],
    });
  } catch (error) {
    console.error("clearFavourites error:", error);
    res.status(500).json({ message: "Failed to clear favourites" });
  }
};